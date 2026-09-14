# Spec: Pickup Time Selection

## Requirement

FR-02 — Flexible Pickup Time (immediately / within 30 min / within 1 hour).

## Acceptance criteria

- Exactly one pickup option can be selected at a time.
- Selection is visually obvious (highlighted).
- Selected value must be attached to the order before confirmation.

## States

- Success: option selectable and highlighted.
- Disabled: N/A unless a slot is later capacity-limited (not in current scope).

## Status

Selection lives in `CartContext` (shared with Cart/Confirmation). "Confirm
Order" is disabled until a pickup time is selected and the cart has items;
confirming generates the order and navigates to Order Confirmation.
