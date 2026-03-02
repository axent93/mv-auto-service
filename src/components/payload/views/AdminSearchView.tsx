import type { AdminViewServerProps, Where } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { DebouncedAdminSearchInput } from '@/components/payload/DebouncedAdminSearchInput'
import { MVHeaderNav, resolveAdminLogoutPath } from '@/components/payload/HeaderQuickLinks'
import { relationId, readString, toRecord } from '@/lib/doc'
import { formatDate } from '@/lib/formatters'
import { getClientName, getVehicleName, serviceTypeLabels } from '@/lib/view-helpers'

const findServiceTypeMatches = (term: string): string[] => {
  const value = term.toLowerCase()
  const matched = new Set<string>()

  if (value.includes('mali')) {
    matched.add('mali-servis')
  }

  if (value.includes('veliki')) {
    matched.add('veliki-servis')
  }

  if (value.includes('kvar') || value.includes('poprav')) {
    matched.add('popravka-kvara')
  }

  if (value.includes('dijag')) {
    matched.add('dijagnostika')
  }

  if (value.includes('limar') || value.includes('ostalo')) {
    matched.add('limarija-ostalo')
  }

  return Array.from(matched)
}

const dedupeByRelationID = (items: unknown[]): unknown[] => {
  const byID = new Map<string, unknown>()
  const withoutID: unknown[] = []

  for (const item of items) {
    const id = relationId(item)

    if (id) {
      if (!byID.has(id)) {
        byID.set(id, item)
      }
      continue
    }

    withoutID.push(item)
  }

  return [...byID.values(), ...withoutID]
}

const relationIDs = (items: unknown[]): string[] =>
  items.map((item) => relationId(item)).filter((value): value is string => Boolean(value))

const collectVehiclesFromServices = (items: unknown[]): unknown[] =>
  items
    .map((service) => toRecord(service)?.vehicle)
    .filter((value): value is unknown => Boolean(value))

const collectClientsFromVehicles = (items: unknown[]): unknown[] =>
  items
    .map((vehicle) => toRecord(vehicle)?.client)
    .filter((value): value is unknown => Boolean(value))

const readSearchTerm = (
  searchParams: AdminViewServerProps['searchParams'],
): {
  term: string
} => {
  const rawValue = searchParams?.q
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue

  if (typeof value !== 'string') {
    return { term: '' }
  }

  return { term: value.trim() }
}

export const AdminSearchView = async ({
  payload,
  initPageResult,
  searchParams,
}: AdminViewServerProps) => {
  const adminRoute = payload.config.routes.admin
  const req = initPageResult.req
  const logoutPath = resolveAdminLogoutPath(payload)
  const adminLink = (path: string) =>
    formatAdminURL({
      adminRoute,
      path: path as `/${string}`,
    })

  const { term } = readSearchTerm(searchParams)

  let clients: unknown[] = []
  let vehicles: unknown[] = []
  let services: unknown[] = []

  if (term.length >= 2) {
    const clientsResult = await payload.find({
      collection: 'clients',
      depth: 1,
      limit: 20,
      req,
      sort: 'lastName',
      where: {
        or: [
          { firstName: { like: term } },
          { lastName: { like: term } },
          { phone: { like: term } },
          { email: { like: term } },
        ],
      },
    })

    const clientDocs = (clientsResult.docs as unknown[]) || []
    const directClientIDs = relationIDs(clientDocs)

    const [vehiclesByTermResult, vehiclesByOwnerResult] = await Promise.all([
      payload.find({
        collection: 'vehicles',
        depth: 1,
        limit: 20,
        req,
        sort: '-updatedAt',
        where: {
          or: [
            { brand: { like: term } },
            { model: { like: term } },
            { registrationNumber: { like: term } },
            { vin: { like: term } },
          ],
        },
      }),
      directClientIDs.length === 0
        ? Promise.resolve({ docs: [] as unknown[] })
        : payload.find({
            collection: 'vehicles',
            depth: 1,
            limit: 40,
            req,
            sort: '-updatedAt',
            where: {
              client: {
                in: directClientIDs,
              },
            },
          }),
    ])

    const baseVehicles = dedupeByRelationID([
      ...((vehiclesByTermResult.docs as unknown[]) || []),
      ...((vehiclesByOwnerResult.docs as unknown[]) || []),
    ])
    const vehicleIDs = relationIDs(baseVehicles)

    const serviceTypeMatches = findServiceTypeMatches(term)

    const serviceWhereClauses: Where[] = [
      { description: { like: term } },
      { clientSnapshotName: { like: term } },
      { internalNote: { like: term } },
    ]

    if (serviceTypeMatches.length > 0) {
      serviceWhereClauses.push({
        serviceType: {
          in: serviceTypeMatches,
        },
      })
    }

    if (vehicleIDs.length > 0) {
      serviceWhereClauses.push({
        vehicle: {
          in: vehicleIDs,
        },
      })
    }

    const serviceResult = await payload.find({
      collection: 'services',
      depth: 2,
      limit: 20,
      req,
      sort: '-serviceDate',
      where: {
        or: serviceWhereClauses,
      },
    })

    services = (serviceResult.docs as unknown[]) || []

    const vehiclesFromServices = collectVehiclesFromServices(services)
    vehicles = dedupeByRelationID([...baseVehicles, ...vehiclesFromServices])

    const clientsFromVehicles = collectClientsFromVehicles(vehicles)
    clients = dedupeByRelationID([...clientDocs, ...clientsFromVehicles])
  }

  return (
    <div className="mv-admin-view gutter--left gutter--right">
      <section className="mv-admin-view__topbar">
        <MVHeaderNav adminRoute={adminRoute} currentPath="/pretraga" logoutPath={logoutPath} standalone />
      </section>

      <section className="mv-admin-view__intro">
        <h1>Centralna brza pretraga</h1>
        <p>Pretraga kroz klijente, vozila i istoriju servisa sa jednog mesta.</p>
      </section>

      <section className="mv-card mv-search-form">
        <label className="field-label" htmlFor="admin-search">
          Unesite pojam za pretragu
        </label>
        <div className="mv-search-form__row">
          <DebouncedAdminSearchInput
            id="admin-search"
            initialValue={term}
            placeholder="Ime, telefon, model, broj sasije, registracija, tip servisa..."
          />
        </div>
      </section>

      {term.length === 0 ? (
        <article className="mv-card">
          <p>Unesite najmanje 2 karaktera da biste pokrenuli pretragu.</p>
        </article>
      ) : null}

      {term.length > 0 && term.length < 2 ? (
        <article className="mv-card">
          <p>Pretraga zahteva najmanje 2 karaktera.</p>
        </article>
      ) : null}

      {term.length >= 2 ? (
        <section className="mv-admin-grid mv-admin-grid--split">
          <article className="mv-card">
            <h2>Klijenti ({clients.length})</h2>
            <ul className="mv-list">
              {clients.length === 0 ? (
                <li>Nema rezultata.</li>
              ) : (
                clients.map((client, index) => {
                  const clientRecord = toRecord(client)
                  const id = relationId(clientRecord)
                  const fullName = getClientName(clientRecord)
                  const phone = readString(clientRecord, 'phone')

                  return (
                    <li key={id || `${fullName}-${index}`}>
                      <div>
                        <strong>{fullName}</strong>
                        <p>{phone || 'Telefon nije unet'}</p>
                      </div>
                      {id ? <a href={adminLink(`/collections/clients/${id}`)}>Otvori</a> : null}
                    </li>
                  )
                })
              )}
            </ul>
          </article>

          <article className="mv-card">
            <h2>Vozila ({vehicles.length})</h2>
            <ul className="mv-list">
              {vehicles.length === 0 ? (
                <li>Nema rezultata.</li>
              ) : (
                vehicles.map((vehicle, index) => {
                  const vehicleRecord = toRecord(vehicle)
                  const id = relationId(vehicleRecord)
                  const model = getVehicleName(vehicleRecord)
                  const owner = getClientName(vehicleRecord?.client)

                  return (
                    <li key={id || `${model}-${index}`}>
                      <div>
                        <strong>{model}</strong>
                        <p>Vlasnik: {owner}</p>
                      </div>
                      {id ? (
                        <div className="mv-inline-links">
                          <a href={adminLink(`/vozila/${id}`)}>Detalj</a>
                          <a href={adminLink(`/collections/vehicles/${id}`)}>Admin</a>
                        </div>
                      ) : null}
                    </li>
                  )
                })
              )}
            </ul>
          </article>

          <article className="mv-card mv-card--full">
            <h2>Servisi ({services.length})</h2>
            <ul className="mv-list">
              {services.length === 0 ? (
                <li>Nema rezultata.</li>
              ) : (
                services.map((service, index) => {
                  const serviceRecord = toRecord(service)
                  const id = relationId(serviceRecord)
                  const vehicle = serviceRecord?.vehicle
                  const vehicleID = relationId(vehicle)
                  const vehicleName = getVehicleName(vehicle)
                  const serviceType = readString(serviceRecord, 'serviceType')
                  const clientName =
                    readString(serviceRecord, 'clientSnapshotName') || getClientName(toRecord(vehicle)?.client)

                  return (
                    <li key={id || `${serviceType}-${index}`}>
                      <div>
                        <strong>{serviceTypeLabels[serviceType] || serviceType || 'Servis'}</strong>
                        <p>
                          {formatDate(readString(serviceRecord, 'serviceDate'))} | {vehicleName}
                        </p>
                        <p>Vlasnik: {clientName || '-'}</p>
                      </div>
                      <div className="mv-inline-links">
                        {vehicleID ? <a href={adminLink(`/vozila/${vehicleID}`)}>Vozilo</a> : null}
                        {id ? <a href={adminLink(`/servisi/${id}`)}>Detalj</a> : null}
                        {id ? <a href={adminLink(`/collections/services/${id}`)}>Admin</a> : null}
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </article>
        </section>
      ) : null}
    </div>
  )
}
