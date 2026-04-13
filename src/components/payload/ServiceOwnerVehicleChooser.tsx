import type { BeforeListTableServerProps, Where } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { relationId, readString, toRecord } from '@/lib/doc'
import { getClientName, getVehicleName } from '@/lib/view-helpers'

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

const readSearchTerm = (searchParams: BeforeListTableServerProps['searchParams']): string => {
  const rawValue = searchParams?.search
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue

  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

const firstNameLike = (value: string): Where => ({ firstName: { like: value } })

const lastNameLike = (value: string): Where => ({ lastName: { like: value } })

const phoneLike = (value: string): Where => ({ phone: { like: value } })

const emailLike = (value: string): Where => ({ email: { like: value } })

const buildClientWhere = (term: string): Where => {
  const tokens = term
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)

  const baseSearch: Where[] = [firstNameLike(term), lastNameLike(term), phoneLike(term), emailLike(term)]

  if (tokens.length < 2) {
    return {
      or: baseSearch,
    }
  }

  return {
    or: [
      ...baseSearch,
      {
        and: tokens.map((token) => ({
          or: [firstNameLike(token), lastNameLike(token)],
        })),
      },
    ],
  }
}

export const ServiceOwnerVehicleChooser = async ({
  payload,
  searchParams,
  user,
}: BeforeListTableServerProps) => {
  const term = readSearchTerm(searchParams)

  if (!user || term.length < 2) {
    return null
  }

  const adminRoute = payload.config.routes.admin
  const adminLink = (path: string) =>
    formatAdminURL({
      adminRoute,
      path: path as `/${string}`,
    })

  let vehicles: unknown[] = []

  try {
    const clientsResult = await payload.find({
      collection: 'clients',
      depth: 0,
      limit: 20,
      overrideAccess: false,
      sort: 'lastName',
      user,
      where: buildClientWhere(term),
    })

    const clientDocs = (clientsResult.docs as unknown[]) || []
    const clientIDs = relationIDs(clientDocs)

    if (clientIDs.length > 0) {
      const vehiclesResult = await payload.find({
        collection: 'vehicles',
        depth: 1,
        limit: 50,
        overrideAccess: false,
        sort: '-updatedAt',
        user,
        where: {
          client: {
            in: clientIDs,
          },
        },
      })

      vehicles = dedupeByRelationID((vehiclesResult.docs as unknown[]) || [])
    }
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: `Unable to render owner vehicle chooser for services search term "${term}"`,
    })

    return null
  }

  return (
    <section className="mv-card mv-service-owner-chooser">
      <div className="mv-card__head">
        <h2>Vozila po vlasniku ({vehicles.length})</h2>
      </div>

      <p className="mv-service-owner-chooser__hint">
        Pretraga prihvata ime, prezime, telefon ili email vlasnika. Izaberite vozilo da otvorite
        istoriju servisa.
      </p>

      {vehicles.length === 0 ? (
        <p className="mv-service-owner-chooser__empty">
          Nema pronadjenih vozila za uneti vlasnik. Rezultati servisa ispod i dalje koriste istu
          pretragu.
        </p>
      ) : (
        <ul className="mv-list">
          {vehicles.map((vehicle, index) => {
            const vehicleRecord = toRecord(vehicle)
            const vehicleID = relationId(vehicleRecord)
            const clientRecord = toRecord(vehicleRecord?.client)
            const ownerName = getClientName(clientRecord)
            const phone = readString(clientRecord, 'phone')
            const vehicleName = getVehicleName(vehicleRecord)

            return (
              <li key={vehicleID || `${vehicleName}-${index}`}>
                <div>
                  <strong>{vehicleName}</strong>
                  <p>Vlasnik: {ownerName}</p>
                  {phone ? <p>Telefon: {phone}</p> : null}
                </div>

                {vehicleID ? (
                  <div className="mv-inline-links">
                    <a href={adminLink(`/vozila/${vehicleID}`)}>Istorija servisa</a>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
