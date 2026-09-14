# UI/UX Reference

## Design objective

Create a sleek, minimalist cafeteria experience that reduces cognitive load and supports fast ordering.

## Design principles

1. Make the next action obvious.
2. Minimize unnecessary steps.
3. Make pickup time prominent.
4. Make order status easy to understand.
5. Keep kitchen information scannable.
6. Use consistent spacing and typography.
7. Provide clear feedback after actions.

## Student interface

The menu should make it easy to:
- identify food,
- understand price,
- see availability,
- add items,
- review the cart.

The checkout experience should clearly show:
- selected items,
- quantities,
- total,
- pickup time,
- payment option if implemented,
- final confirmation.

## Order tracking

Use clear status labels:

```text
Confirmed
Preparing
Ready
Picked Up
```

The ready state should be highly noticeable.

## Pickup

Display:
- order number,
- QR code,
- pickup information,
- status.

Provide an order ID fallback if QR scanning is unavailable.

## Staff interface

The kitchen dashboard should prioritize:
- current orders,
- pickup time,
- order status,
- item details.

Avoid unnecessary decorative elements on operational screens.

## Accessibility

Consider:
- readable contrast,
- keyboard navigation,
- visible focus states,
- meaningful labels,
- accessible form errors,
- non-color-only status indicators.
