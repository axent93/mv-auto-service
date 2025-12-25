# MV Auto Servis - Auto Service Tracking

Vehicle service tracking application built with Payload CMS for auto mechanics.

## Features

- **Client Management (Mušterije)**: Track customer information (name, phone, email, notes)
- **Vehicle Registry (Vozila)**: Manage vehicles with license plates, VIN, engine types
- **Service Records (Servisni Zapisi)**: Complete service history with automatic cost calculations
- **Admin Interface**: Professional Payload CMS admin panel with Serbian localization
- **Internationalization**: Full Serbian (SR) and English (EN) support, Serbian as default
- **PostgreSQL Database**: Reliable data persistence with automated backups
- **Railway Deployment**: Ready for single-click cloud deployment

## Tech Stack

- **Backend**: Payload CMS v3 (Node.js/TypeScript)
- **Frontend**: Next.js with Payload Admin UI
- **Database**: PostgreSQL  
- **Auth**: Payload CMS built-in authentication
- **Hosting**: Railway-ready
- **Localization**: Serbian (default) and English support

## Data Model

```
Client (1) → Vehicles (Many) → ServiceRecords (Many)
Mušterija (1) → Vozila (Više) → Servisni Zapisi (Više)
```

### Collections

1. **Clients (Mušterije)**: Customer information and contact details
2. **Vehicles (Vozila)**: Vehicle registry with client relationships  
3. **ServiceRecords (Servisni Zapisi)**: Complete service history with cost tracking
4. **Users (Korisnici)**: Admin authentication
5. **Media (Mediji)**: File uploads and attachments

## Local Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL database

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd mv-auto-servis
   npm install
   ```

2. **Setup PostgreSQL database**:
   ```bash
   # Create database
   createdb mv_auto_servis
   
   # Or using PostgreSQL prompt
   psql postgres
   CREATE DATABASE mv_auto_servis;
   \q
   ```

3. **Setup environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database connection and secrets
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Admin panel: http://localhost:3000/admin 
   - API: http://localhost:3000/api

   Create your first admin user when accessing `/admin` for the first time.

## Project Architecture

Based on ADR documents:

- **ADR-001**: Payload CMS-only architecture, no custom frontend
- **ADR-002**: Railway hosting with PostgreSQL
- **ADR-003**: Managed backups and data retention

### Database Schema

Generated automatically by Payload CMS based on collection configurations.

### Authentication

Single admin user with full access to all collections. Multi-user support can be added in future iterations.

## Usage

### Adding a New Client (Dodavanje Nove Mušterije)

1. Navigate to **Clients (Mušterije)** in admin panel
2. Click **Add New (Dodaj Novo)**
3. Fill in required fields:
   - **Ime i Prezime** (Full Name) 
   - **Telefon** (Phone)
4. Optionally add email and notes (napomene)

### Registering a Vehicle (Registrovanje Vozila)

1. Navigate to **Vehicles (Vozila)**
2. Click **Add New (Dodaj Novo)** 
3. Select client (mušterija) from dropdown
4. Enter vehicle details:
   - **Marka** (Brand)
   - **Model** (Model)
   - **Registarska Tablica** (License Plate)
5. Optionally add VIN, year (godina), engine type (tip motora), notes

### Recording Service (Evidentiranje Servisa)

1. Navigate to **Service Records (Servisni Zapisi)**
2. Click **Add New (Dodaj Novo)**
3. Select vehicle (vozilo) from dropdown
4. Enter service details:
   - **Datum Servisa** (Service Date)
   - **Kilometraža** (Mileage)
   - **Opis** (Description) - detailed work description
   - **Cena Rada** (Labor Cost)
   - **Cena Delova** (Parts Cost)
5. **Ukupna Cena** (Total Cost) calculates automatically

## Railway Deployment

### Environment Variables
Set in Railway dashboard:
```
DATABASE_URL=<railway-postgresql-url>
PAYLOAD_SECRET=<secure-random-key>
NEXT_PUBLIC_SERVER_URL=<your-domain>
```

### Build Configuration
Railway auto-detects the Node.js/Next.js project and handles deployment.

## Backup Strategy

### Automated Backups
- Railway provides daily PostgreSQL backups
- Retention period depends on Railway plan

### Manual Backups
- pg_dump via Railway CLI or local tools
- Store backups securely

## Support

For issues related to:
- **Payload CMS**: [Payload Documentation](https://payloadcms.com/docs)
- **Railway**: [Railway Documentation](https://docs.railway.app)
- **PostgreSQL**: [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

MIT License - See LICENSE file for details.