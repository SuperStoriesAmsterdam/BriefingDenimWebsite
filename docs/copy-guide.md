# Copy Guide — Starting a New Project with This Tool

This tool is designed to be copied for each new SuperStories project. The content is isolated from the platform. Copying takes minutes, not days.

---

## What to Change (and Nothing Else)

### 1. `client/src/lib/project.config.ts`

The single swap point for all project-specific identifiers:

```ts
export const PROJECT_ID = "dc";       // change to new project slug, e.g. "bm", "vx"
export const PROJECT_VERSION = "v34"; // reset to "v1" for a new project
```

`PROJECT_ID` becomes the localStorage key prefix — it prevents data collision if two projects are ever opened in the same browser during development.

`PROJECT_VERSION` drives the merge logic: bump it whenever `prd-defaults.ts` changes significantly, so new defaults reach users who already have data saved.

### 2. `client/src/lib/prd-defaults.ts`

Replace all content with the new project's pages, blocks, and annotations. This is the only file where project content lives. Everything else is platform.

---

## What NOT to Change

Everything else is platform code — generic, reusable, project-agnostic:

| File | What it does |
|------|-------------|
| `prd-constants.ts` | Team colors, block types, schema types |
| `prd-storage.ts` | localStorage + server sync logic |
| `team-members.ts` | Team member management (UI-driven, no hardcoding) |
| `server/routes.ts` | Image upload, PRD API endpoints |
| `server/storage.ts` | Database read/write (already supports multi-project via `id`) |
| `shared/schema.ts` | Database schema |

---

## Copy Checklist

- [ ] Duplicate the repo (or use as template)
- [ ] Update `PROJECT_ID` and reset `PROJECT_VERSION` to `"v1"` in `project.config.ts`
- [ ] Replace `prd-defaults.ts` with new project content
- [ ] Create new GitHub repo under SuperStoriesAmsterdam
- [ ] Deploy via Coolify with new subdomain (Docker Compose, port 5000, branch: main)
- [ ] Set environment variables in Coolify (see below)
- [ ] Add Cloudflare CNAME for new subdomain

---

## Coolify Environment Variables

Coolify does not pass env vars from `docker-compose.yml` automatically. Set these manually in the Coolify UI after each new deployment — once, never touch again.

**DB service:**
```
POSTGRES_USER=prd
POSTGRES_PASSWORD=prd
POSTGRES_DB=prd
```

**APP service:**
```
DATABASE_URL=postgresql://prd:prd@db:5432/prd
SESSION_SECRET=change-me-to-something-random
```

> Protocol: internal tools (PRD, briefing tools) → DB in docker-compose stack. Customer-facing production apps → separate Coolify Database resource.

---

## Database Note

`server/storage.ts` already supports multiple projects at the DB level via the `id` parameter (`getPrd(id)` / `savePrd(data, version, id)`). The API currently uses `"default"` for all requests. When moving to a shared deployment across projects, pass the project slug as the `id` — no schema changes needed.
