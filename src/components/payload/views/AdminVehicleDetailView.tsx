import Image from 'next/image'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { MVHeaderNav, resolveAdminLogoutPath } from '@/components/payload/HeaderQuickLinks'
import { relationId, readNumber, readString, toRecord } from '@/lib/doc'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'

const serviceTypeLabels: Record<string, string> = {
  dijagnostika: 'Dijagnostika',
  'limarija-ostalo': 'Limarija / ostalo',
  'mali-servis': 'Mali servis',
  'popravka-kvara': 'Popravka kvara',
  'veliki-servis': 'Veliki servis',
}

const paymentStatusLabels: Record<string, string> = {
  'delimisno-placeno': 'Delimisno placeno',
  'nije-placeno': 'Nije placeno',
  placeno: 'Placeno',
}

const mediaFileFromArrayRow = (row: unknown): null | Record<string, unknown> => {
  const rowRecord = toRecord(row)
  const fileValue = rowRecord?.file

  return toRecord(fileValue)
}

const mediaLink = (mediaRecord: null | Record<string, unknown>) => {
  if (!mediaRecord) {
    return null
  }

  const url = readString(mediaRecord, 'url')
  const filename = readString(mediaRecord, 'filename') || 'fajl'
  const mimeType = readString(mediaRecord, 'mimeType')

  if (!url) {
    return null
  }

  return {
    filename,
    isImage: mimeType.startsWith('image/'),
    url,
  }
}

const normalizeID = (id: string): number | string => {
  if (/^\d+$/.test(id)) {
    return Number(id)
  }

  return id
}

export const AdminVehicleDetailView = async ({
  params,
  payload,
  initPageResult,
}: AdminViewServerProps) => {
  const rawID = params?.id
  const req = initPageResult.req
  const idFromParams = Array.isArray(rawID) ? rawID[0] : rawID
  const adminRoute = payload.config.routes.admin
  const logoutPath = resolveAdminLogoutPath(payload)
  const adminLink = (path: string) =>
    formatAdminURL({
      adminRoute,
      path: path as `/${string}`,
    })
  const topBar = (
    <section className="mv-admin-view__topbar">
      <MVHeaderNav
        adminRoute={adminRoute}
        currentPath={idFromParams ? `/vozila/${idFromParams}` : '/collections/vehicles'}
        logoutPath={logoutPath}
        standalone
      />
    </section>
  )

  if (!idFromParams || typeof idFromParams !== 'string') {
    return (
      <div className="mv-admin-view gutter--left gutter--right">
        {topBar}
        <article className="mv-card">
          <h1>Detalj vozila</h1>
          <p>ID vozila nije prosledjen.</p>
          <a href={adminLink('/collections/vehicles')}>Nazad na vozila</a>
        </article>
      </div>
    )
  }

  const documentID = normalizeID(idFromParams)
  let vehicle: unknown = null

  try {
    vehicle = await payload.findByID({
      collection: 'vehicles',
      depth: 2,
      id: documentID,
      req,
    })
  } catch (_error) {
    vehicle = null
  }

  const vehicleRecord = toRecord(vehicle)

  if (!vehicleRecord) {
    return (
      <div className="mv-admin-view gutter--left gutter--right">
        {topBar}
        <article className="mv-card">
          <h1>Detalj vozila</h1>
          <p>Vozilo nije pronadjeno.</p>
          <a href={adminLink('/collections/vehicles')}>Nazad na vozila</a>
        </article>
      </div>
    )
  }

  const servicesResult = await payload.find({
    collection: 'services',
    depth: 2,
    limit: 100,
    req,
    sort: '-serviceDate',
    where: {
      vehicle: {
        equals: documentID,
      },
    },
  })

  const services = servicesResult.docs as unknown[]
  const client = toRecord(vehicleRecord.client)
  const clientName = [readString(client, 'firstName'), readString(client, 'lastName')]
    .filter(Boolean)
    .join(' ')
    .trim()

  const galleryRows = Array.isArray(vehicleRecord.gallery) ? vehicleRecord.gallery : []
  const galleryFiles = galleryRows.map(mediaFileFromArrayRow).map(mediaLink).filter(Boolean)

  return (
    <div className="mv-admin-view gutter--left gutter--right">
      {topBar}
      <section className="mv-admin-view__intro">
        <h1>Detalj vozila</h1>
        <p>Pregled podataka, vlasnika i istorije servisa za izabrano vozilo.</p>
      </section>

      <section className="mv-card">
        <div className="mv-card__head">
          <h2>Osnovni podaci</h2>
          <div className="mv-inline-links">
            <a href={adminLink(`/collections/vehicles/${idFromParams}`)}>Otvori vozilo</a>
            {relationId(client) ? (
              <a href={adminLink(`/collections/clients/${relationId(client)}`)}>Otvori klijenta</a>
            ) : null}
          </div>
        </div>

        <dl className="mv-details-grid">
          <div>
            <dt>Vlasnik</dt>
            <dd>{clientName || '-'}</dd>
          </div>
          <div>
            <dt>Telefon klijenta</dt>
            <dd>{readString(client, 'phone') || '-'}</dd>
          </div>
          <div>
            <dt>Marka i model</dt>
            <dd>
              {[readString(vehicleRecord, 'brand'), readString(vehicleRecord, 'model')]
                .filter(Boolean)
                .join(' ') || '-'}
            </dd>
          </div>
          <div>
            <dt>Godiste</dt>
            <dd>{formatNumber(readNumber(vehicleRecord, 'year'))}</dd>
          </div>
          <div>
            <dt>Registracija</dt>
            <dd>{readString(vehicleRecord, 'registrationNumber') || '-'}</dd>
          </div>
          <div>
            <dt>Broj sasije</dt>
            <dd>{readString(vehicleRecord, 'vin') || '-'}</dd>
          </div>
          <div>
            <dt>Motor</dt>
            <dd>{readString(vehicleRecord, 'engine') || '-'}</dd>
          </div>
          <div>
            <dt>Gorivo</dt>
            <dd>{readString(vehicleRecord, 'fuelType') || '-'}</dd>
          </div>
          <div>
            <dt>Kubikaza</dt>
            <dd>{readString(vehicleRecord, 'engineCapacity') || '-'}</dd>
          </div>
          <div>
            <dt>Snaga</dt>
            <dd>{readString(vehicleRecord, 'power') || '-'}</dd>
          </div>
          <div>
            <dt>Boja</dt>
            <dd>{readString(vehicleRecord, 'color') || '-'}</dd>
          </div>
          <div>
            <dt>Trenutna kilometraza</dt>
            <dd>{formatNumber(readNumber(vehicleRecord, 'currentMileage'))}</dd>
          </div>
        </dl>

        {readString(vehicleRecord, 'note') ? (
          <div className="mv-note">
            <h3>Napomena</h3>
            <p>{readString(vehicleRecord, 'note')}</p>
          </div>
        ) : null}
      </section>

      <section className="mv-card">
        <h2>Slike i dokumenta vozila</h2>
        {galleryFiles.length === 0 ? (
          <p>Nema dodatih slika ili dokumenata.</p>
        ) : (
          <div className="mv-media-grid">
            {galleryFiles.map((file) =>
              file ? (
                <a href={file.url} key={`${file.url}-${file.filename}`} rel="noreferrer" target="_blank">
                  <div className="mv-media-grid__item">
                    {file.isImage ? (
                      <Image
                        alt={file.filename}
                        height={140}
                        loading="lazy"
                        src={file.url}
                        unoptimized
                        width={220}
                      />
                    ) : (
                      <div className="mv-media-grid__pdf">PDF</div>
                    )}
                    <p>{file.filename}</p>
                  </div>
                </a>
              ) : null,
            )}
          </div>
        )}
      </section>

      <section className="mv-card">
        <div className="mv-card__head">
          <h2>Istorija servisa</h2>
          <a href={adminLink('/collections/services')}>Svi servisi</a>
        </div>
        <div className="mv-table-wrap">
          <table className="mv-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Tip servisa</th>
                <th>Kilometraza</th>
                <th>Opis</th>
                <th>Status naplate</th>
                <th>Ukupno</th>
                <th>Fajlovi</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={8}>Za ovo vozilo jos nema unetih servisa.</td>
                </tr>
              ) : (
                services.map((service, index) => {
                  const serviceRecord = toRecord(service)
                  const serviceID = relationId(serviceRecord)
                  const serviceType = readString(serviceRecord, 'serviceType')
                  const paymentStatus = readString(serviceRecord, 'paymentStatus')

                  const issueCount = Array.isArray(serviceRecord?.issueImages)
                    ? serviceRecord.issueImages.length
                    : 0
                  const afterCount = Array.isArray(serviceRecord?.afterRepairImages)
                    ? serviceRecord.afterRepairImages.length
                    : 0
                  const invoiceCount = Array.isArray(serviceRecord?.partsInvoiceFiles)
                    ? serviceRecord.partsInvoiceFiles.length
                    : 0

                  const totalPriceValue = serviceRecord?.totalPrice
                  const totalPrice =
                    typeof totalPriceValue === 'number' && Number.isFinite(totalPriceValue)
                      ? totalPriceValue
                      : null

                  return (
                    <tr key={serviceID || `${serviceType}-${index}`}>
                      <td>{formatDate(readString(serviceRecord, 'serviceDate'))}</td>
                      <td>{serviceTypeLabels[serviceType] || serviceType || '-'}</td>
                      <td>{formatNumber(readNumber(serviceRecord, 'mileage'))}</td>
                      <td>{readString(serviceRecord, 'description') || '-'}</td>
                      <td>{paymentStatusLabels[paymentStatus] || '-'}</td>
                      <td>{formatCurrency(totalPrice)}</td>
                      <td>
                        Kvar: {issueCount} | Posle: {afterCount} | Racuni: {invoiceCount}
                      </td>
                      <td>
                        {serviceID ? (
                          <a href={adminLink(`/collections/services/${serviceID}`)}>Otvori</a>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
