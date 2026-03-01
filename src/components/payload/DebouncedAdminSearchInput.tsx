'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type DebouncedAdminSearchInputProps = {
  id: string
  initialValue: string
  placeholder: string
}

const DEBOUNCE_MS = 300

export const DebouncedAdminSearchInput = ({
  id,
  initialValue,
  placeholder,
}: DebouncedAdminSearchInputProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextTerm = value.trim()
      const currentTerm = (searchParams.get('q') || '').trim()

      if (nextTerm === currentTerm) {
        return
      }

      const nextParams = new URLSearchParams(searchParams.toString())

      if (nextTerm.length > 0) {
        nextParams.set('q', nextTerm)
      } else {
        nextParams.delete('q')
      }

      const query = nextParams.toString()
      router.replace(query ? `${pathname}?${query}` : pathname)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [pathname, router, searchParams, value])

  return (
    <div className="search-bar">
      <svg className="icon icon--search" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          className="stroke"
          d="M16 16L13.1333 13.1333M14.6667 9.33333C14.6667 12.2789 12.2789 14.6667 9.33333 14.6667C6.38781 14.6667 4 12.2789 4 9.33333C4 6.38781 6.38781 4 9.33333 4C12.2789 4 14.6667 6.38781 14.6667 9.33333Z"
          strokeLinecap="square"
        />
      </svg>

      <div className="search-filter">
        <input
          className="search-filter__input"
          id={id}
          name="q"
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </div>
    </div>
  )
}
