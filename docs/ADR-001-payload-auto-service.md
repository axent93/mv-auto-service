# ADR-001: Evidence of Vehicle Service Records Application (Payload CMS Only)

## Status
Accepted

## Date
2025-12-24

---

## Context

The goal is to build a **web-based application used exclusively through Payload CMS Admin UI** for an auto mechanic to track:

- Clients
- Their vehicles
- Complete service and repair history per vehicle

There will be **no custom frontend application**.  
All data entry, updates, and viewing will be performed directly via the **Payload CMS Admin Panel**.

Key requirements:
- Minimal custom code
- Low maintenance overhead
- Schema-driven development
- Fast CRUD operations
- Self-hosted solution
- Future extensibility

Primary domain model:

```
Client → Vehicle → ServiceRecord
```

The system is **single-tenant**, intended for one mechanic.

---

## Decision

We will use **Payload CMS as the only application interface**.

Payload CMS will provide:
- Data modeling (collections)
- Admin UI (CRUD operations)
- Authentication
- REST & GraphQL APIs (internal use only)
- Database access layer

No frontend framework (React, Next.js, etc.) will be built.

---

## Rationale

Payload CMS is selected because it:

- Enables **schema-first development** in TypeScript
- Generates a **fully usable admin UI out of the box**
- Requires **minimal custom coding**
- Handles authentication and authorization natively
- Is self-hosted (no SaaS lock-in)
- Allows future expansion without re-architecture

Using Payload CMS only eliminates:
- Frontend maintenance
- API contract complexity
- Additional hosting layers

This approach is ideal for a small business internal tool.

---

## Architecture Overview

### High-level architecture

```
[ Payload CMS Admin UI ]
              |
        [ Payload API ]
              |
        [ PostgreSQL ]
```

The mechanic interacts exclusively with the Payload Admin UI.

---

## Data Model

### Collection: Clients

Represents a customer of the mechanic.

**Fields:**
- `fullName` — text, required
- `phone` — text, required
- `email` — email, optional
- `notes` — textarea, optional

**Relationships:**
- One Client → Many Vehicles

---

### Collection: Vehicles

Represents a vehicle owned by a client.

**Fields:**
- `client` — relationship → Clients (required)
- `brand` — text, required
- `model` — text, required
- `year` — number, optional
- `licensePlate` — text, required, unique
- `vin` — text, optional
- `engineType` — select:
  - petrol
  - diesel
  - hybrid
  - electric
- `notes` — textarea, optional

**Relationships:**
- One Vehicle → Many ServiceRecords

---

### Collection: ServiceRecords

Represents a single service or repair event.

**Fields:**
- `vehicle` — relationship → Vehicles (required)
- `serviceDate` — date, required, default: now
- `mileage` — number, optional
- `description` — textarea, required
- `laborCost` — number, required
- `partsCost` — number, required
- `totalCost` — number, read-only, calculated as `laborCost + partsCost`
- `notes` — textarea, optional

---

## Authentication & Authorization

- Use Payload built-in authentication
- Single role: `admin`
- All collections require authentication
- No role-based access control in phase 1

---

## Admin UI Requirements

The Payload Admin UI must:

- Allow fast creation and editing of:
  - Clients
  - Vehicles
  - Service Records
- Display relationships clearly:
  - Client → Vehicles
  - Vehicle → Service Records
- Support filtering and search by:
  - Client name
  - License plate
- Default sorting:
  - Latest service records first

No custom admin UI components are required.

---

## Non-Functional Requirements

- Self-hosted deployment
- PostgreSQL database
- Docker-compatible setup
- Easy schema evolution
- Minimal runtime configuration

---

## Consequences

### Positive
- Extremely low maintenance
- Minimal codebase
- Rapid implementation
- Non-technical user friendly
- Clear and enforceable data model

### Negative
- UI limited to Payload Admin capabilities
- Less customization than custom frontend
- Payload CMS knowledge required

---

## Future Considerations (Out of Scope)

- PDF service reports
- Service reminders
- Multi-user support
- Analytics and revenue reports
- Mobile-first UX

---

## Instructions for AI Code Generation

When generating code based on this ADR:

- Use Payload CMS idiomatic patterns
- Define all domain logic via collections
- Prefer configuration over custom logic
- Avoid building frontend code
- Keep implementation minimal and explicit

---

**End of ADR**
