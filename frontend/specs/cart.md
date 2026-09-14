# Spec: Cart

## Requirement

Supports FR-02 (pickup time) and FR-05 (order confirmation) by holding the
items and quantities the student is about to order. Not a named FR itself —
the assignment's core flow implies a review step between Menu and Pickup
Time (architecture.md core flow).

## Acceptance criteria

- Adding a menu item from the Menu page increases its quantity in the cart
  if already present, otherwise adds it with quantity 1.
- Cart shows each line item's name, unit price, quantity, and line subtotal.
- Quantity can be increased/decreased; decreasing to 0 removes the line.
- Cart shows a running total.
- Empty cart shows an empty state with a link back to the menu.
- "Proceed to Pickup" is disabled when the cart is empty.

## States

- Empty: no items added yet.
- Success: one or more line items with controls.

## Status

Cart state lives in a React context (`shared/state/CartContext`) shared
between Menu and Cart pages. Not yet persisted or sent to a backend.
