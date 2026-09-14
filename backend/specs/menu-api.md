# Spec: Menu API

## Requirement

NFR-03 — only authorized staff/admin can add, modify, or remove menu
items, prices, and availability.

## Endpoints

### GET /menu

Public. Returns all menu items (including unavailable ones — the frontend
decides how to display them, matching the existing Menu page behavior).

### POST /menu

STAFF or ADMIN only. Request: `{ name, price, description? }`. Created
with `available: true` by default.

### PATCH /menu/:id

STAFF or ADMIN only. Partial update: `{ name?, price?, available?,
description? }`.

### DELETE /menu/:id

STAFF or ADMIN only.

## Authorization

Every write endpoint re-verifies the caller's role from the JWT server-side
— the frontend's role toggle (`auth/LoginPage`) is a UI convenience only
and must never be trusted, per `architecture.md`'s authorization boundary.

## Validation

- name: non-empty string.
- price: number > 0.
- Unknown menu item id on PATCH/DELETE: `404`.

## Status

Not yet implemented.
