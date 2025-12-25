# ADR-003: Data Persistence, Backup & Recovery

## Status
Accepted

## Date
2025-12-24

---

## Context

The application stores business-critical data:
- Client information
- Vehicle records
- Service history

Data loss would be unacceptable.
The solution must be simple, reliable, and mostly automated.

---

## Decision

We will rely on **Railway managed PostgreSQL backups**, supplemented by optional manual exports.

---

## Backup Strategy

### Automatic Backups
- Railway provides daily automated PostgreSQL backups
- Backup retention handled by Railway plan

### Manual Backups (Optional)
- pg_dump via Railway CLI
- Stored locally or in cloud storage (Google Drive / S3)

---

## Restore Strategy

- Restore from Railway dashboard
- Point-in-time recovery if supported by plan
- Validate Payload CMS integrity after restore

---

## Schema Evolution

- Payload collections act as schema
- Backups taken before structural changes
- No destructive changes without backup

---

## Data Retention

- No automatic data deletion
- Manual cleanup if required
- Historical service records preserved indefinitely

---

## Consequences

### Positive
- Minimal configuration
- Reliable managed backups
- No custom scripts required

### Negative
- Limited control over backup granularity on free tiers

---

## Operational Notes

- Backup before upgrading Payload CMS
- Backup before major schema changes
- Periodic test restore recommended

---

**End of ADR**
