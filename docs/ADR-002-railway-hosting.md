# ADR-002: Hosting & Deployment Strategy (Railway)

## Status
Accepted

## Date
2025-12-24

---

## Context

The application is a **Payload CMS–only system** with:
- No frontend
- Single admin user
- Low traffic
- Minimal resource usage

The goal is to deploy the system publicly with:
- Lowest possible cost
- Minimal configuration
- Managed PostgreSQL
- Automatic HTTPS
- Easy domain attachment

---

## Decision

We will use **Railway** as the hosting platform for:

- Payload CMS (Node.js application)
- PostgreSQL database
- Environment variable management
- Continuous deployment from GitHub

---

## Rationale

Railway is chosen because it:

- Requires almost zero infrastructure knowledge
- Provides PostgreSQL in one click
- Automatically injects DATABASE_URL
- Supports Node.js long-running services (Payload compatible)
- Is cost-efficient for low-usage apps
- Supports custom domains and HTTPS out of the box

This matches the project requirement of **minimal maintenance and minimal cost**.

---

## Architecture

```
[ User Browser ]
        |
   HTTPS (Custom Domain)
        |
[ Railway Node Service ]
   (Payload CMS)
        |
[ Railway PostgreSQL ]
```

---

## Deployment Strategy

### Source Control
- GitHub repository
- Main branch = production

### Build & Run
- Build command: `pnpm install`
- Start command: `pnpm payload start`
- Node version: LTS

### Environment Variables
Required:
- `DATABASE_URL` (auto-provided by Railway)
- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`

---

## Domain & HTTPS

- Custom domain purchased externally
- DNS A / CNAME record pointing to Railway
- HTTPS automatically provisioned by Railway

---

## Scaling

- No auto-scaling required
- Single small instance is sufficient
- Vertical scaling only if needed

---

## Cost Considerations

- Railway free credits usable initially
- Expected monthly cost: **$5–10**
- PostgreSQL included

---

## Consequences

### Positive
- Extremely fast setup
- No server maintenance
- Automatic SSL
- Integrated logs

### Negative
- Vendor dependency
- Free tier limits

---

**End of ADR**
