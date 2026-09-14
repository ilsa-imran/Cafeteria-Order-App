# Backend Reference

## Responsibilities

The backend owns:
- authentication handling,
- authorization,
- validation,
- order business rules,
- menu management rules,
- pickup verification,
- notification orchestration,
- database access.

## Core business entities

At minimum, the design should support concepts equivalent to:

- User
- MenuItem
- Order
- OrderItem
- Pickup
- Notification

Exact database naming may be chosen by the implementation.

## Order lifecycle

Use a controlled order lifecycle.

Recommended implementation states:

```text
CONFIRMED
    |
    v
PREPARING
    |
    v
READY
    |
    v
PICKED_UP
```

Additional states such as CANCELLED may be added only if needed and documented.

## Business rules

Examples:
- An order must contain at least one item.
- The requested pickup time must be valid.
- Menu items that are unavailable must not be orderable.
- Only authorized staff can modify menu data.
- An order must have a unique order identifier.
- Pickup verification must identify the correct order.
- Invalid order-status transitions should be rejected.

## Validation

Validate:
- authentication input,
- menu item identifiers,
- quantities,
- pickup time,
- payment option if implemented,
- order status transitions,
- pickup verification data.

Never trust client-provided totals. Calculate authoritative order totals on the server if payment/price totals are implemented.

## Error handling

Return consistent API errors.

Do not expose:
- database internals,
- stack traces,
- secrets,
- internal implementation details.

## Performance

For rush-hour protection:
- avoid N+1 queries,
- add appropriate indexes,
- avoid loading unnecessary records,
- paginate large lists,
- use efficient order queries,
- measure before optimizing.

## Implementation Decision: Backend stack

The assignment does not mandate a specific backend stack. Chosen to match
the frontend's TypeScript ecosystem and keep the setup simple per
`architecture.md`:

- **Node.js + Express + TypeScript** — minimal, well-understood REST
  framework; no unnecessary framework complexity (rules out NestJS-style
  heavier structure for a project this size).
- **Prisma ORM + SQLite** — SQLite needs no separate database server to
  install/run, which keeps the project easy to clone and demo. Prisma's
  schema/migrations work identically against Postgres later if the project
  ever needs to move off SQLite, without an application-code rewrite.
- **JWT authentication** — stateless tokens issued on login, verified via
  middleware on protected routes, per `security.md`'s authentication and
  authorization rules. Passwords hashed with bcrypt (`database.md`).
- **Zod** — request validation at the API boundary, per `api.md`'s
  "validate request bodies and parameters" rule.
- **autocannon** (devDependency only, not shipped) — load testing tool for
  the rush-hour risk's Technical Review control (`risk-management.md`).
  `npm run load-test`. Chosen over standing up a heavier tool (k6, Locust)
  since it's a single npm package with no separate binary/runtime to
  install, proportional to a university project.

Feature-based backend layout, matching the frontend convention documented
in `dev-workflow.md`:

```text
backend/src/features/<feature>/
  routes.ts
  service.ts
  <feature>.test.ts (where applicable)
backend/src/shared/
  middleware/ (auth, error handling)
  lib/ (prisma client, jwt helpers)
```
