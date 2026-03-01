'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LogoutButton = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await fetch('/api/users/logout', {
        method: 'POST',
      })
    } catch (_error) {
      // Nema dodatne akcije, svakako preusmeravamo korisnika na login.
    }

    router.replace('/login')
    router.refresh()
  }

  return (
    <button className="button button-ghost" disabled={isLoading} onClick={handleLogout} type="button">
      {isLoading ? 'Odjava...' : 'Odjavi se'}
    </button>
  )
}
