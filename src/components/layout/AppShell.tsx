import Link from 'next/link'
import type { ReactNode } from 'react'

import { LogoutButton } from '@/components/auth/LogoutButton'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

type AppShellProps = {
  children: ReactNode
  user: {
    email?: null | string
    ime?: null | string
    uloga?: null | string
  }
}

export const AppShell = ({ children, user }: AppShellProps) => {
  const userDisplay = user.ime || user.email || 'Korisnik'
  const roleDisplay = user.uloga ? `(${user.uloga})` : ''

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MV servis</p>
          <h1>Interna servisna aplikacija</h1>
        </div>

        <div className="header-actions">
          <div className="user-chip">
            <span>{userDisplay}</span>
            {roleDisplay ? <small>{roleDisplay}</small> : null}
          </div>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      <nav className="tab-nav">
        <Link href="/dashboard">Kontrolna tabla</Link>
        <Link href="/pretraga">Brza pretraga</Link>
        <Link href="/klijenti">Klijenti</Link>
        <Link href="/vozila">Vozila</Link>
        <Link href="/servisi">Servisi</Link>
        <Link href="/nabavke">Nabavke</Link>
        <Link href="/alati">Alati</Link>
        <Link href="/admin">Admin</Link>
      </nav>

      <section className="content-wrap">{children}</section>
    </div>
  )
}
