import { redirect } from 'next/navigation'

type SearchRedirectPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchRedirectPage({ searchParams }: SearchRedirectPageProps) {
  const { q } = await searchParams

  if (q && q.trim().length > 0) {
    redirect(`/admin/pretraga?q=${encodeURIComponent(q)}`)
  }

  redirect('/admin/pretraga')
}
