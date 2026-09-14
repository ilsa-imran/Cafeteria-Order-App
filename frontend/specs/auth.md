# Spec: Sign In / Register

## Requirement

FR-01 — Separate User and Staff Member modes.

## Acceptance criteria

- Sign In takes email + password and calls the backend `/auth/login`;
  role comes back from the server, it is never chosen by the UI.
- Create Account registers a new STUDENT account only (`/auth/register`)
  — staff/admin accounts are seeded server-side, not self-registered, per
  `backend/specs/auth-api.md`'s Assumption.
- On successful login, redirect by role: STUDENT -> `/menu`,
  STAFF/ADMIN -> `/kitchen`.
- Wrong credentials show a generic error (matches the backend's
  intentionally generic 401 message).
- The token is stored so a page refresh keeps the session.

## States

- Success: form submits, redirects by role.
- Error: invalid credentials / duplicate email on register.
- Loading: submit button disabled while the request is in flight.

## Status

Wired to the real backend via `AuthContext`. The previous "User/Staff
mode" toggle has been retired — it was documented from the start as a UI
convenience only, and now that real accounts carry a real role, offering a
toggle that doesn't affect anything would be misleading. Protected routes
use `ProtectedRoute` to check `user.role`, but the actual authorization
enforcement lives server-side (`architecture.md`'s authorization boundary)
— this component only improves navigation.
