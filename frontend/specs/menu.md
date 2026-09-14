# Spec: Menu (Student)

## Requirement

FR-01 (User mode), part of the Menu domain (architecture.md).

## Acceptance criteria

- Student can view available menu items with name, price, and availability.
- Unavailable items are visibly disabled and cannot be added to cart.
- Adding an item updates the cart count immediately.

## States

- Loading: menu is being fetched.
- Empty: no menu items configured.
- Success: menu items rendered as cards.
- Error: fetch failed, retry affordance shown.

## Status

Wired to `GET /menu` on the real backend.
