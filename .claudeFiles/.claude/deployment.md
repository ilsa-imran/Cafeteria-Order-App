# Deployment Reference

## Goal

Provide a reproducible deployment process suitable for a university project.

## Environments

Recommended:

```text
Development
    |
    v
Test / Staging
    |
    v
Production / Demo
```

For a small university project, a separate production environment is optional.

## Deployment requirements

- Configuration must be externalized.
- Secrets must not be committed.
- Build should be reproducible.
- Database migrations should be controlled.
- Health checks should be available where appropriate.

## Kubernetes

Kubernetes is optional.

Do not add Kubernetes merely because the project has a rush-hour scalability risk. The assignment only requires the risk to be identified and controlled through Technical Review.

If Kubernetes is chosen as an implementation enhancement, document:
- why it is needed,
- cluster architecture,
- deployments,
- services,
- ingress,
- secrets,
- resource limits,
- monitoring,
- rollback procedure.

## Implementation Decision: free-tier hosting, Postgres instead of SQLite

Not an assignment requirement — the assignment doesn't require a live
deployment at all — but the student wanted one for demoing. Chosen for
zero cost:

- **Frontend**: Vercel (static Vite build, free tier).
- **Backend**: Render free Web Service (Node/Express). Free-tier caveat:
  the instance sleeps after 15 minutes idle, so the first request after a
  gap has a 30–60s cold start.
- **Database**: switched from SQLite to a free **Neon Postgres** database.
  Render's free tier has an *ephemeral filesystem* — every restart or
  redeploy wipes a local SQLite file, so demo accounts/orders would reset
  constantly. `backend.md`/`architecture.md` already anticipated this
  ("Prisma's schema/migrations work identically against Postgres later...
  without an application-code rewrite") — it was a one-line datasource
  change (`backend/prisma/schema.prisma`), not a rewrite. Local dev now
  points at the same Neon database via `backend/.env` (gitignored), so
  local and deployed environments share one schema/data source instead of
  drifting.
  - **Use Neon's direct connection string, not the pooled one** (the one
    with `-pooler` in the hostname). The pooled endpoint was unreliable for
    both `prisma migrate` and plain queries in testing here; the direct
    connection worked consistently. Fine at this app's traffic level —
    connection pooling matters at a scale this project won't reach.
  - The old SQLite migration history (`backend/prisma/migrations/`) was
    deleted and regenerated fresh against Postgres, since SQLite and
    Postgres migration SQL aren't compatible with each other.
  - `backend/vitest.config.ts` needed `testTimeout: 20000` — the test
    suite's default 5s timeout assumed a same-process SQLite file; a few
    tests (notably the 20-concurrent-orders test) need more time over a
    real network connection to Postgres.
- **Frontend build fixes for Vercel**: `@types/react` 19.3.0 dropped the
  global `JSX` namespace, so `FoodIllustration.tsx` switched from
  `JSX.Element` to `ReactElement` (imported from `react`). A stale test
  fixture in `apiMappers.test.ts` was also missing a required
  `pickupTimeMinutes` field — only surfaced by running the real build
  command (`npm run build`, i.e. `tsc -b`), not by a plain
  `tsc --noEmit` check, since `tsc -b` also type-checks test files.
- **`VITE_API_URL` must be a Vercel "Config" variable, not "Secret"** —
  it's a `VITE_`-prefixed variable, meaning Vite inlines it into the
  public frontend bundle at build time, so it isn't actually secret.
  Vercel's Secret type is write-only and can't be read back into the
  client bundle at build time, and once a variable is saved as Secret
  it can't be converted to Config — it has to be deleted and
  recreated. Set as Secret initially, this caused every API call to
  resolve as `.../undefined/auth/login` in production (silently
  broken login) even though the Render backend itself was working.

## Live deployment (final)

- Frontend: `https://cafeteria-order-app.vercel.app/`
- Backend: `https://cafeteria-order-app-backend.onrender.com`
- Full end-to-end pass completed 2026-09-16: login, menu load, cart,
  pickup time selection, order confirmation (QR + order ID), and order
  tracking all verified working against the live deployed stack.

## Demo deployment

Before demonstration:
1. Deploy the latest tested version.
2. Verify authentication.
3. Verify menu.
4. Create a student order.
5. Verify kitchen order visibility.
6. Update order status.
7. Verify tracking/notification.
8. Verify QR/order ID pickup.
9. Verify staff authorization.
