# Spec: Food Item Details (Student)

## Requirement

Not a named FR; supports the Menu domain and `frontend.md`'s Student
screen list ("Food item details"). Gives space for a description and a
clearer availability/price view than the compact menu card.

## Acceptance criteria

- Clicking a menu item's name opens its details: name, description (if
  any), price, availability.
- Add to cart works from this page too, disabled when unavailable.
- Unknown item id shows a clear "not found" state instead of a blank page.

## States

- Loading, Not found, Success, Disabled (unavailable item).

## Status

Reuses `GET /menu` (already fetched for the Menu page) and finds the item
by id client-side, rather than adding a `GET /menu/:id` backend endpoint —
the menu list is small, so a dedicated single-item endpoint would be
unjustified complexity per `coding-conventions.md`'s dependency-check rule.
Revisit if the menu grows large enough that fetching the full list per
visit becomes wasteful.
