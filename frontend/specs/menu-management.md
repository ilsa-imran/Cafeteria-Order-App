# Spec: Menu Management (Staff)

## Requirement

NFR-03 — only authorized staff/admin can add, modify, or remove menu items,
prices, and availability.

## Acceptance criteria

- Staff can add a new menu item (name + price).
- Staff can edit an existing item's price.
- Staff can toggle an item's availability.
- Staff can remove an item.
- Frontend role checks are a convenience only; the backend must re-verify
  authorization on every write (architecture.md authorization boundary).
  This page has no auth guard yet — see Status.

## States

- Empty: no menu items exist yet.
- Success: item list with inline controls.
- Disabled: save/add controls disabled while a name or price is invalid.

## Status

Wired to the real backend (`POST/PATCH/DELETE /menu`, staff/admin JWT
required). Route is guarded by `ProtectedRoute` (roles: STAFF, ADMIN) —
the frontend redirect/"Unauthorized" message is a convenience; the backend
re-verifies the role on every write regardless.
