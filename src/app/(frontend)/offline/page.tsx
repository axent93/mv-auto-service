import Link from 'next/link'

export default function OfflinePage() {
  return (
    <section className="offline-page card">
      <h1>Niste povezani na internet</h1>
      <p>
        Osnovni prikaz aplikacije je dostupan, ali su podaci i unos novih zapisa moguci tek kada se
        veza vrati.
      </p>
      <Link className="button button-primary" href="/admin/login">
        Povratak na prijavu
      </Link>
    </section>
  )
}
