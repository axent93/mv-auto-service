'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FormEvent } from 'react'

type LoginResponse = {
  message?: string
}

export const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const responseBody = (await response.json().catch(() => ({}))) as LoginResponse

        setErrorMessage(responseBody.message || 'Prijava nije uspela. Proverite email i lozinku.')
        setIsLoading(false)
        return
      }

      router.replace('/dashboard')
      router.refresh()
    } catch (_error) {
      setErrorMessage('Doslo je do greske pri povezivanju. Pokusajte ponovo.')
      setIsLoading(false)
    }
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <label className="field">
        <span>Email</span>
        <input
          autoComplete="email"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="npr. servis@mv.rs"
          required
          type="email"
          value={email}
        />
      </label>

      <label className="field">
        <span>Lozinka</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Unesite lozinku"
          required
          type="password"
          value={password}
        />
      </label>

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <button className="button button-primary" disabled={isLoading} type="submit">
        {isLoading ? 'Prijava...' : 'Prijavi se'}
      </button>
    </form>
  )
}
