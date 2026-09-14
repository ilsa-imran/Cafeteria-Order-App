# Spec: Auth API

## Requirement

FR-01 (separate User/Staff modes) and the authentication half of NFR-03
(authenticated users must be distinguishable from unauthenticated ones,
per security.md).

## Endpoints

### POST /auth/register

Creates a **STUDENT** account only. Staff/Admin accounts are not
self-registerable — see Assumption below.

Request: `{ name, email, password }`
Response: `201 { id, name, email, role }`

Validation: name non-empty, email valid + unique, password minimum length.

### POST /auth/login

Request: `{ email, password }`
Response: `200 { token, user: { id, name, email, role } }`
Errors: `401` on wrong credentials (generic message — do not reveal whether
the email exists, per security.md's "avoid leaking sensitive data").

### GET /auth/me

Requires a valid JWT. Returns the authenticated user's own profile.

### POST /auth/staff

ADMIN only. Creates a **STAFF** or **ADMIN** account — the admin-only
onboarding flow previously scoped out (see the superseded Assumption
below). This is how a cafeteria manager (ADMIN) provisions a new staff
member's login, instead of a seed script.

Request: `{ name, email, password, role }` where `role` is `STAFF` or
`ADMIN`.
Response: `201 { id, name, email, role }`

Validation: same as register, plus `role` must be exactly `STAFF` or
`ADMIN` (never `STUDENT` — that's what `/auth/register` is for).

## Assumption (superseded)

Originally, the assignment didn't specify how staff/admin accounts are
provisioned, so they were created only via the database seed script
(`prisma/seed.ts`), with no in-app flow — documented as an Optional
Enhancement to add later. `POST /auth/staff` now closes that gap: an
ADMIN can create STAFF/ADMIN accounts through the app itself, still
gated so a STUDENT or STAFF account can never self-escalate (only ADMIN
may call this endpoint — enforced server-side, matching the authorization
boundary in `architecture.md`). The seed script still exists to bootstrap
the very first ADMIN account, since an empty database has no ADMIN yet to
create one through the API.

## States / errors

- Duplicate email on register or staff creation: `409`.
- Invalid credentials on login: `401`.
- Missing/invalid/expired token on protected routes: `401`.
- Non-ADMIN calling `/auth/staff`: `403`.
- Invalid `role` value on `/auth/staff`: `400`.

## Status

Passwords hashed with bcrypt. JWT signed with a server-side secret from
environment configuration, never committed to source control.
