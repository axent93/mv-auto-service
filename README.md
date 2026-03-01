# MV servis

Privatna PWA aplikacija za auto mehanicarsku radionicu, izradjena kao jedan Next.js + Payload CMS 3 projekat sa PostgreSQL bazom.

## Tehnologije

- Next.js 16
- React + TypeScript
- Payload CMS 3 (admin + auth + API)
- PostgreSQL (`@payloadcms/db-postgres`)
- PWA (manifest + service worker + offline fallback)
- Railway deployment setup (`railway.toml` + `nixpacks.toml`)

## Funkcionalni moduli

- Klijenti
- Vozila
- Servisi i popravke
- Nabavka delova
- Alati i uredjaji
- Upload slika i racuna (Media)
- Brza pretraga kroz klijente, vozila i servise
- Dashboard sa poslovnim pregledom
- Detalj vozila sa istorijom servisa

## Kolekcije (Payload)

- `users` (auth enabled)
- `clients`
- `vehicles`
- `services`
- `part-purchases`
- `tools`
- `media` (upload slike + PDF)

Sve kolekcije su privatne i dostupne samo autentifikovanom korisniku.

## Lokalni razvoj

1. Kopiraj env:

```bash
cp .env.example .env
```

2. Pokreni PostgreSQL (opciono preko Docker-a):

```bash
docker-compose up -d postgres
```

3. Instaliraj zavisnosti:

```bash
npm install
```

4. Pokreni aplikaciju:

```bash
npm run dev
```

5. Otvori:

- App login: `http://localhost:3000/login`
- Payload admin: `http://localhost:3000/admin`

Ako je baza prazna, prvi korisnik se kreira kroz Payload admin flow za inicijalnog korisnika.

## Build i provera

```bash
npm run lint
npm run build
```

## Railway deployment

1. Kreiraj Railway projekat i dodaj PostgreSQL servis.
2. Povezi ovaj repo sa Railway projektom.
3. U Railway Variables podesi:
   - `DATABASE_URL` (iz Railway PostgreSQL servisa)
   - `PAYLOAD_SECRET` (jak random string)
   - `NEXT_PUBLIC_SERVER_URL` (npr. `https://tvoj-domen.up.railway.app`)
   - `PORT=3000`
4. Deploy se koristi preko `nixpacks.toml` / `railway.toml`.

## PWA

- Manifest: `/manifest.webmanifest`
- Service worker: `/sw.js`
- Offline fallback: `/offline`
- Ikonice: `public/icons`

Instalacija na telefonu je dostupna kroz browser install prompt (Android/Chrome) ili Add to Home Screen (iOS/Safari).
