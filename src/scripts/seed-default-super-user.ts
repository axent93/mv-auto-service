import { getPayload } from 'payload'

import configPromise from '../payload.config'
import { ensureDefaultSuperUser } from '../lib/ensureDefaultSuperUser'

const run = async () => {
  const config = await configPromise
  const payload = await getPayload({ config })

  try {
    const result = await ensureDefaultSuperUser(payload)

    if (result.created) {
      console.log(`Korisnik kreiran: ${result.email}`)
    } else {
      console.log(`Korisnik vec postoji: ${result.email}`)
    }
  } finally {
    await payload.destroy()
  }
}

await run()
