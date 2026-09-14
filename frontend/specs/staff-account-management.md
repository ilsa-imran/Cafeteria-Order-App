# Spec: Create Staff Account (Admin)

## Requirement

NFR-03 (only authorized staff/admin may act with elevated access) — this
closes the gap noted in `backend/specs/auth-api.md`'s superseded
Assumption: previously staff/admin accounts could only be created via a
seed script, with no in-app flow. This provides that flow.

## Acceptance criteria

- Only ADMIN can reach this page (not STAFF, not STUDENT) — a cafeteria
  manager provisions accounts, not regular staff.
- Form: name, email, password, role (STAFF or ADMIN).
- On success, shows a confirmation with the created account's email/role
  and clears the form so another account can be created immediately.
- Duplicate email shows a clear error, not a generic failure.
- The backend re-verifies the caller is ADMIN on every request — the
  frontend route guard is a convenience, not the real security boundary
  (architecture.md).

## States

- Success, Error (duplicate email, validation), Disabled (submit button
  while a request is in flight or required fields are empty).

## Status

Wired to `POST /auth/staff` (ADMIN only, `backend/specs/auth-api.md`).
