import type { AdminViewServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { relationId, readString, toRecord } from '@/lib/doc'
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

const toolConditionLabels: Record<string, string> = {
  'na-servisu': 'Na servisu',
  neispravno: 'Neispravno',
  rashodovano: 'Rashodovano',
}

const getClientName = (value: unknown): string => {
  const client = toRecord(value)
  const firstName = readString(client, 'firstName')
  const lastName = readString(client, 'lastName')

  return [firstName, lastName].filter(Boolean).join(' ').trim() || '-'
}

const getVehicleName = (value: unknown): string => {
  const vehicle = toRecord(value)
  const brand = readString(vehicle, 'brand')
  const model = readString(vehicle, 'model')
  const registration = readString(vehicle, 'registrationNumber')
  const parts = [brand, model].filter(Boolean).join(' ')

  return registration ? `${parts} (${registration})` : parts || '-'
}

export const AdminDashboardView = async ({ payload, initPageResult }: AdminViewServerProps) => {
  const adminRoute = payload.config.routes.admin
  const req = initPageResult.req
  const adminLink = (path: string) =>
    formatAdminURL({
      adminRoute,
      path: path as `/${string}`,
    })

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [clientsResult, vehiclesResult, lastThirtyServicesResult, servicesResult, purchasesResult, toolsResult] =
    await Promise.all([
      payload.find({
        collection: 'clients',
        limit: 1,
        req,
      }),
      payload.find({
        collection: 'vehicles',
        limit: 1,
        req,
      }),
      payload.find({
        collection: 'services',
        limit: 1,
        req,
        where: {
          serviceDate: {
            greater_than_equal: thirtyDaysAgo,
          },
        },
      }),
      payload.find({
        collection: 'services',
        depth: 2,
        limit: 8,
        req,
        sort: '-serviceDate',
      }),
      payload.find({
        collection: 'part-purchases',
        limit: 5,
        req,
        sort: '-purchaseDate',
      }),
      payload.find({
        collection: 'tools',
        limit: 10,
        req,
        sort: '-updatedAt',
        where: {
          condition: {
            not_equals: 'ispravno',
          },
        },
      }),
    ])

  const latestServices = (servicesResult.docs as unknown[]) || []
  const latestPurchases = (purchasesResult.docs as unknown[]) || []
  const problematicTools = (toolsResult.docs as unknown[]) || []

  return (
    <div className="mv-admin-view gutter--left gutter--right">
      <section className="mv-admin-view__intro">
        <h1>Kontrolna tabla</h1>
        <p>Pregled servisa, nabavki i stanja radionice na jednom mestu.</p>
      </section>

      <section className="mv-admin-grid mv-admin-grid--stats">
        <article className="mv-card">
          <p className="mv-card__label">Ukupno klijenata</p>
          <p className="mv-card__value">{formatNumber(clientsResult.totalDocs)}</p>
        </article>
        <article className="mv-card">
          <p className="mv-card__label">Ukupno vozila</p>
          <p className="mv-card__value">{formatNumber(vehiclesResult.totalDocs)}</p>
        </article>
        <article className="mv-card">
          <p className="mv-card__label">Servisi u poslednjih 30 dana</p>
          <p className="mv-card__value">{formatNumber(lastThirtyServicesResult.totalDocs)}</p>
        </article>
      </section>

      <section className="mv-card">
        <div className="mv-card__head">
          <h2>Poslednji servisi</h2>
          <a href={adminLink('/collections/services')}>Svi servisi</a>
        </div>

        <div className="mv-table-wrap mv-dashboard-services__desktop">
          <table className="mv-table mv-table--dashboard">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Klijent</th>
                <th>Vozilo</th>
                <th>Tip</th>
                <th>Status</th>
                <th>Iznos</th>
                <th>Detalj</th>
              </tr>
            </thead>
            <tbody>
              {latestServices.length === 0 ? (
                <tr>
                  <td colSpan={7}>Nema evidentiranih servisa.</td>
                </tr>
              ) : (
                latestServices.map((service, index) => {
                  const serviceRecord = toRecord(service)
                  const serviceID = relationId(serviceRecord)
                  const vehicle = serviceRecord?.vehicle
                  const vehicleID = relationId(vehicle)
                  const vehicleName = getVehicleName(vehicle)
                  const clientName =
                    readString(serviceRecord, 'clientSnapshotName') ||
                    getClientName(toRecord(vehicle)?.client)

                  const serviceType = readString(serviceRecord, 'serviceType')
                  const paymentStatus = readString(serviceRecord, 'paymentStatus')
                  const totalPriceValue = serviceRecord?.totalPrice
                  const totalPrice =
                    typeof totalPriceValue === 'number' && Number.isFinite(totalPriceValue)
                      ? totalPriceValue
                      : null

                  return (
                    <tr key={relationId(serviceRecord) || `${serviceType}-${index}`}>
                      <td>{formatDate(readString(serviceRecord, 'serviceDate'))}</td>
                      <td>{clientName || '-'}</td>
                      <td>{vehicleName}</td>
                      <td>{serviceTypeLabels[serviceType] || serviceType || '-'}</td>
                      <td>{paymentStatusLabels[paymentStatus] || '-'}</td>
                      <td>{formatCurrency(totalPrice)}</td>
                      <td>
                        <div className="mv-inline-links">
                          {serviceID ? <a href={adminLink(`/servisi/${serviceID}`)}>Servis</a> : null}
                          {vehicleID ? <a href={adminLink(`/vozila/${vehicleID}`)}>Vozilo</a> : null}
                          {!serviceID && !vehicleID ? '-' : null}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <ul className="mv-list mv-dashboard-services__mobile">
          {latestServices.length === 0 ? (
            <li>Nema evidentiranih servisa.</li>
          ) : (
            latestServices.map((service, index) => {
              const serviceRecord = toRecord(service)
              const serviceID = relationId(serviceRecord)
              const vehicle = serviceRecord?.vehicle
              const vehicleID = relationId(vehicle)
              const vehicleName = getVehicleName(vehicle)
              const clientName =
                readString(serviceRecord, 'clientSnapshotName') || getClientName(toRecord(vehicle)?.client)

              const serviceType = readString(serviceRecord, 'serviceType')
              const paymentStatus = readString(serviceRecord, 'paymentStatus')
              const totalPriceValue = serviceRecord?.totalPrice
              const totalPrice =
                typeof totalPriceValue === 'number' && Number.isFinite(totalPriceValue) ? totalPriceValue : null

              return (
                <li key={`mobile-${relationId(serviceRecord) || `${serviceType}-${index}`}`}>
                  <div>
                    <strong>{clientName || '-'}</strong>
                    <p>{vehicleName}</p>
                    <p>
                      {formatDate(readString(serviceRecord, 'serviceDate'))} |{' '}
                      {serviceTypeLabels[serviceType] || serviceType || '-'}
                    </p>
                    <p>
                      Status: {paymentStatusLabels[paymentStatus] || '-'} | Iznos: {formatCurrency(totalPrice)}
                    </p>
                  </div>
                  <div className="mv-inline-links">
                    {serviceID ? <a href={adminLink(`/servisi/${serviceID}`)}>Servis</a> : null}
                    {vehicleID ? <a href={adminLink(`/vozila/${vehicleID}`)}>Vozilo</a> : null}
                    {!serviceID && !vehicleID ? '-' : null}
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </section>

      <section className="mv-admin-grid mv-admin-grid--split">
        <article className="mv-card">
          <div className="mv-card__head">
            <h2>Poslednje nabavke delova</h2>
            <a href={adminLink('/collections/part-purchases')}>Sve nabavke</a>
          </div>
          <ul className="mv-list">
            {latestPurchases.length === 0 ? (
              <li>Nema evidentiranih nabavki.</li>
            ) : (
              latestPurchases.map((purchase, index) => {
                const purchaseRecord = toRecord(purchase)
                const supplier = readString(purchaseRecord, 'supplier')
                const invoice = readString(purchaseRecord, 'invoiceNumber')
                const totalValue = purchaseRecord?.totalAmount
                const total =
                  typeof totalValue === 'number' && Number.isFinite(totalValue) ? totalValue : null

                return (
                  <li key={relationId(purchaseRecord) || `${invoice}-${index}`}>
                    <div>
                      <strong>{supplier || 'Nepoznati dobavljac'}</strong>
                      <p>Racun: {invoice || '-'}</p>
                    </div>
                    <div className="mv-list__meta">
                      <p>{formatDate(readString(purchaseRecord, 'purchaseDate'))}</p>
                      <p>{formatCurrency(total)}</p>
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </article>

        <article className="mv-card">
          <div className="mv-card__head">
            <h2>Alati koji nisu ispravni</h2>
            <a href={adminLink('/collections/tools')}>Svi alati</a>
          </div>
          <ul className="mv-list">
            {problematicTools.length === 0 ? (
              <li>Svi alati su oznaceni kao ispravni.</li>
            ) : (
              problematicTools.map((tool, index) => {
                const toolRecord = toRecord(tool)
                const name = readString(toolRecord, 'name')
                const condition = readString(toolRecord, 'condition')
                const location = readString(toolRecord, 'locationInWorkshop')

                return (
                  <li key={relationId(toolRecord) || `${name}-${index}`}>
                    <div>
                      <strong>{name || 'Bez naziva'}</strong>
                      <p>{location || 'Lokacija nije upisana'}</p>
                    </div>
                    <div className="mv-list__meta">
                      <p>{toolConditionLabels[condition] || condition || '-'}</p>
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </article>
      </section>
    </div>
  )
}
