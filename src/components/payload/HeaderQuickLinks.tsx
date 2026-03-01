import type { Payload, ServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

const links = [
  {
    key: 'dashboard',
    label: 'Kontrolna tabla',
    matchers: ['/'],
    path: '/',
  },
  {
    key: 'search',
    label: 'Brza pretraga',
    matchers: ['/pretraga'],
    path: '/pretraga',
  },
  {
    key: 'clients',
    label: 'Klijenti',
    matchers: ['/collections/clients'],
    path: '/collections/clients',
  },
  {
    key: 'vehicles',
    label: 'Vozila',
    matchers: ['/collections/vehicles', '/vozila'],
    path: '/collections/vehicles',
  },
  {
    key: 'services',
    label: 'Servisi',
    matchers: ['/collections/services'],
    path: '/collections/services',
  },
  {
    key: 'purchases',
    label: 'Nabavke',
    matchers: ['/collections/part-purchases'],
    path: '/collections/part-purchases',
  },
  {
    key: 'tools',
    label: 'Alati',
    matchers: ['/collections/tools'],
    path: '/collections/tools',
  },
  {
    key: 'media',
    label: 'Dokumenta',
    matchers: ['/collections/media'],
    path: '/collections/media',
  },
] as const

const toAdminLink = (adminRoute: string, path: `/${string}`) =>
  formatAdminURL({
    adminRoute,
    path,
  })

export const resolveAdminLogoutPath = (payload: Payload): `/${string}` => {
  const logoutPath = payload.config.admin.routes?.logout

  if (typeof logoutPath === 'string' && logoutPath.startsWith('/')) {
    return logoutPath as `/${string}`
  }

  return '/logout'
}

type MVHeaderNavProps = {
  adminRoute: string
  currentPath?: string
  logoutPath: `/${string}`
  standalone?: boolean
}

const isLinkActive = (currentPath: string, matchers: readonly string[]) => {
  for (const matcher of matchers) {
    if (matcher === '/') {
      if (currentPath === '/') {
        return true
      }

      continue
    }

    if (currentPath === matcher || currentPath.startsWith(`${matcher}/`)) {
      return true
    }
  }

  return false
}

const resolveCurrentPath = (params: ServerProps['params']) => {
  const segments = params?.segments

  if (!Array.isArray(segments) || segments.length === 0) {
    return '/'
  }

  return `/${segments.join('/')}`
}

export const MVHeaderNav = ({
  adminRoute,
  currentPath = '/',
  logoutPath,
  standalone = false,
}: MVHeaderNavProps) => {
  const classNames = ['mv-header-tools']

  if (standalone) {
    classNames.push('mv-header-tools--standalone')
  }

  return (
    <div className={classNames.join(' ')}>
      <a className="mv-header-brand" href={toAdminLink(adminRoute, '/')}>
        <span className="mv-header-brand__mark">MV</span>
        <span className="mv-header-brand__label">MV servis</span>
      </a>

      <nav aria-label="Brza navigacija" className="mv-header-tabs">
        {links.map((link) => (
          <a
            className={`mv-header-tabs__link${isLinkActive(currentPath, link.matchers) ? ' is-active' : ''}`}
            href={toAdminLink(adminRoute, link.path)}
            key={link.key}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="mv-header-user">
        <a aria-label="Korisnicki nalog" className="mv-header-account" href={toAdminLink(adminRoute, '/account')}>
          <span aria-hidden className="mv-header-account__dot" />
          <span className="mv-header-account__label">Profil</span>
        </a>

        <a className="mv-header-logout" href={toAdminLink(adminRoute, logoutPath)}>
          Odjavi se
        </a>
      </div>
    </div>
  )
}

export const HeaderQuickLinks = ({ payload, params }: ServerProps) => {
  return (
    <MVHeaderNav
      adminRoute={payload.config.routes.admin}
      currentPath={resolveCurrentPath(params)}
      logoutPath={resolveAdminLogoutPath(payload)}
    />
  )
}
