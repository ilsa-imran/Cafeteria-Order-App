# Security Reference

## Primary security requirement

Only authorized cafeteria staff or administrators may add, modify, or remove:
- menu items,
- prices,
- availability.

## Authentication

Authenticated users must be distinguishable from unauthenticated users.

## Authorization

Use server-side authorization.

Recommended roles:

```text
STUDENT
STAFF
ADMIN
```

The exact role model may be adjusted to the implementation.

## Student permissions

Students may:
- view available menu items,
- create their own orders,
- view their own orders,
- track their own orders,
- access their own pickup information.

Students must not:
- change menu prices,
- change availability,
- modify another student's order,
- change another student's order status.

## Staff permissions

Staff may:
- view kitchen orders,
- update preparation status,
- verify pickups.

## Admin/manager permissions

Administrators or managers may manage:
- menu items,
- prices,
- availability.

## Password policy

**Implementation Decision** — not specified by the assignment, added at the
student's request for stronger account security. Passwords (registration
and admin-created staff accounts) must be at least 8 characters and include
at least one letter and one number; any other characters, including
special characters (`@#$%^&*` etc.), are allowed but not required. This
accepts both a fully mixed password like `something@#$%(*q3r!` and a
simpler letter+number combination like `AfeefL22332`.

Enforced at both layers, per the "validate input at system boundaries" and
"do not rely on the frontend for authorization" rules:
- **Backend** (source of truth): a shared `strongPassword` Zod schema in
  `backend/src/features/auth/schema.ts`, used by both `registerSchema` and
  `createStaffSchema`.
- **Frontend** (UX only, not a security boundary): `validatePassword` in
  `frontend/src/shared/lib/passwordStrength.ts`, used by `LoginPage.tsx`
  (registration) and `CreateStaffAccountPage.tsx` (admin-created staff),
  each showing the specific unmet rule instead of a generic backend
  message plus a static hint below the password field.

## Security practices

- Validate all input.
- Use parameterized database access.
- Hash passwords securely if local authentication is used.
- Protect authenticated endpoints.
- Apply authorization checks to every protected operation.
- Do not expose secrets.
- Do not log passwords or authentication tokens.
- Avoid leaking sensitive data in error responses.

## Threats to consider

- Fake orders
- Unauthorized menu changes
- Unauthorized order access
- Duplicate requests
- QR/order ID guessing
- Injection attacks
- Session/token theft

Security controls should be proportional to a university project while demonstrating sound engineering practice.
