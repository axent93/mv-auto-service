import { redirect } from 'next/navigation'

type VehicleRedirectPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function VehicleRedirectPage({ params }: VehicleRedirectPageProps) {
  const { id } = await params

  redirect(`/admin/vozila/${encodeURIComponent(id)}`)
}
