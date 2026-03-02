import type { AdminViewServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { MVHeaderNav, resolveAdminLogoutPath } from '@/components/payload/HeaderQuickLinks'
import { MediaLightboxGrid } from '@/components/payload/MediaLightboxGrid'
import { readNumber, readString, relationId, toRecord } from '@/lib/doc'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import {
  extractDetailIDFromParams,
  getClientName,
  getVehicleName,
  type MediaFileLink,
  mediaLinkFromArrayRow,
  normalizeDocumentID,
  paymentStatusLabels,
  serviceTypeLabels,
} from '@/lib/view-helpers'

const paymentMethodLabels: Record<string, string> = {
  gotovina: 'Gotovina',
  kartica: 'Kartica',
  virman: 'Virman',
}

const readMediaLinks = (value: unknown): MediaFileLink[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map(mediaLinkFromArrayRow)
    .filter((file): file is MediaFileLink => Boolean(file))
}

const readPartsRows = (value: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => toRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
}

const MediaPanel = ({
  files,
  title,
}: {
  files: MediaFileLink[]
  title: string
}) => {
  if (files.length === 0) {
    return (
      <article className="mv-card">
        <h2>{title}</h2>
        <p>Nema dodatih fajlova.</p>
      </article>
    )
  }

  return (
    <article className="mv-card">
      <h2>{title}</h2>
      <MediaLightboxGrid files={files} hintText="Kliknite na fajl za prikaz bez izlaska iz aplikacije." />
    </article>
  )
}

export const AdminServiceDetailView = async ({
  payload,
  params,
  initPageResult,
}: AdminViewServerProps) => {
  const req = initPageResult.req
  const idFromParams = extractDetailIDFromParams(params, 'servisi')
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
        currentPath={idFromParams ? `/servisi/${idFromParams}` : '/collections/services'}
        logoutPath={logoutPath}
        standalone
      />
    </section>
  )

  if (!idFromParams) {
    return (
      <div className="mv-admin-view gutter--left gutter--right">
        {topBar}
        <article className="mv-card">
          <h1>Detalj servisa</h1>
          <p>ID servisa nije prosledjen.</p>
          <a href={adminLink('/collections/services')}>Nazad na servise</a>
        </article>
      </div>
    )
  }

  const documentID = normalizeDocumentID(idFromParams)
  let serviceDoc: unknown = null

  try {
    serviceDoc = await payload.findByID({
      collection: 'services',
      depth: 3,
      id: documentID,
      req,
    })
  } catch (_error) {
    serviceDoc = null
  }

  const service = toRecord(serviceDoc)

  if (!service) {
    return (
      <div className="mv-admin-view gutter--left gutter--right">
        {topBar}
        <article className="mv-card">
          <h1>Detalj servisa</h1>
          <p>Servis nije pronadjen.</p>
          <a href={adminLink('/collections/services')}>Nazad na servise</a>
        </article>
      </div>
    )
  }

  const vehicle = toRecord(service.vehicle)
  const client = toRecord(service.client) || toRecord(vehicle?.client)
  const clientName = readString(service, 'clientSnapshotName') || getClientName(client)
  const vehicleName = getVehicleName(vehicle)
  const vehicleID = relationId(vehicle)
  const clientID = relationId(client)
  const serviceID = relationId(service) || idFromParams

  const partsRows = readPartsRows(service.partsUsed)
  const issueImages = readMediaLinks(service.issueImages)
  const afterRepairImages = readMediaLinks(service.afterRepairImages)
  const invoiceFiles = readMediaLinks(service.partsInvoiceFiles)
  const serviceType = readString(service, 'serviceType')
  const paymentStatus = readString(service, 'paymentStatus')
  const paymentMethod = readString(service, 'paymentMethod')

  return (
    <div className="mv-admin-view gutter--left gutter--right">
      {topBar}

      <section className="mv-admin-view__intro">
        <h1>Detalj servisa</h1>
        <p>Pregled kompletnog servisa, koriscenih delova i dokumentacije.</p>
      </section>

      <section className="mv-card">
        <div className="mv-card__head">
          <h2>Osnovni podaci</h2>
          <div className="mv-inline-links">
            {vehicleID ? <a href={adminLink(`/vozila/${vehicleID}`)}>Detalj vozila</a> : null}
            <a href={adminLink(`/collections/services/${serviceID}`)}>Admin servis</a>
            {vehicleID ? <a href={adminLink(`/collections/vehicles/${vehicleID}`)}>Admin vozilo</a> : null}
            {clientID ? <a href={adminLink(`/collections/clients/${clientID}`)}>Admin klijent</a> : null}
          </div>
        </div>

        <dl className="mv-details-grid">
          <div>
            <dt>Datum servisa</dt>
            <dd>{formatDate(readString(service, 'serviceDate'))}</dd>
          </div>
          <div>
            <dt>Tip servisa</dt>
            <dd>{serviceTypeLabels[serviceType] || serviceType || '-'}</dd>
          </div>
          <div>
            <dt>Kilometraza</dt>
            <dd>{formatNumber(readNumber(service, 'mileage'))}</dd>
          </div>
          <div>
            <dt>Klijent</dt>
            <dd>{clientName || '-'}</dd>
          </div>
          <div>
            <dt>Vozilo</dt>
            <dd>{vehicleName}</dd>
          </div>
          <div>
            <dt>Status naplate</dt>
            <dd>{paymentStatusLabels[paymentStatus] || '-'}</dd>
          </div>
          <div>
            <dt>Nacin placanja</dt>
            <dd>{paymentMethodLabels[paymentMethod] || '-'}</dd>
          </div>
          <div>
            <dt>Cena rada</dt>
            <dd>{formatCurrency(readNumber(service, 'laborPrice'))}</dd>
          </div>
          <div>
            <dt>Cena delova</dt>
            <dd>{formatCurrency(readNumber(service, 'partsPrice'))}</dd>
          </div>
          <div>
            <dt>Ukupno</dt>
            <dd>{formatCurrency(readNumber(service, 'totalPrice'))}</dd>
          </div>
        </dl>

        <div className="mv-note">
          <h3>Opis radova</h3>
          <p>{readString(service, 'description') || '-'}</p>
        </div>

        {readString(service, 'internalNote') ? (
          <div className="mv-note">
            <h3>Interna napomena</h3>
            <p>{readString(service, 'internalNote')}</p>
          </div>
        ) : null}
      </section>

      <section className="mv-card">
        <h2>Ugradjeni delovi</h2>
        {partsRows.length === 0 ? (
          <p>Nema unetih delova za ovaj servis.</p>
        ) : (
          <div className="mv-table-wrap">
            <table className="mv-table">
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Brend</th>
                  <th>Sifra</th>
                  <th>Kolicina</th>
                  <th>Nabavna</th>
                  <th>Prodajna</th>
                  <th>Dobavljac</th>
                  <th>Napomena</th>
                </tr>
              </thead>
              <tbody>
                {partsRows.map((part, index) => (
                  <tr key={`${readString(part, 'partCode') || readString(part, 'partName') || 'deo'}-${index}`}>
                    <td>{readString(part, 'partName') || '-'}</td>
                    <td>{readString(part, 'brand') || '-'}</td>
                    <td>{readString(part, 'partCode') || '-'}</td>
                    <td>{formatNumber(readNumber(part, 'quantity'))}</td>
                    <td>{formatCurrency(readNumber(part, 'purchasePrice'))}</td>
                    <td>{formatCurrency(readNumber(part, 'salePrice'))}</td>
                    <td>{readString(part, 'supplier') || '-'}</td>
                    <td>{readString(part, 'note') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mv-admin-grid mv-admin-grid--split">
        <MediaPanel files={issueImages} title="Slike kvara" />
        <MediaPanel files={afterRepairImages} title="Slike nakon popravke" />
        <div className="mv-card--full">
          <MediaPanel files={invoiceFiles} title="Racuni delova" />
        </div>
      </section>
    </div>
  )
}
