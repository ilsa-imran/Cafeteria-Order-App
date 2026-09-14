# Spec: Order History (Student)

## Requirement

Not a named FR itself, but implied by `frontend.md`'s Student screen list
("Order history") and supports FR-04 (students should be able to revisit
past orders, not just the one just placed).

## Acceptance criteria

- Student sees their own past orders, newest first.
- Each entry shows order number, items summary, pickup time, status, total.
- Clicking an order opens Order Tracking for that specific order.
- A student never sees another student's orders (backend-enforced, see
  `backend/specs/orders-api.md`).

## States

- Loading, Empty ("no orders yet" with a link to Menu), Success, Error.

## Status

Wired to `GET /orders` (student-scoped by the backend — the frontend sends
no filter, the backend infers "own orders only" from the JWT).
