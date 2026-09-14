# API Reference

## API principles

- Use consistent resource-oriented endpoints.
- Validate request bodies and parameters.
- Return appropriate HTTP status codes.
- Keep authorization server-side.
- Do not expose database implementation details.

## Suggested resources

```text
/auth
/menu
/orders
/orders/:id
/orders/:id/status
/orders/:id/qr
/orders/:id/pickup
/notifications
/staff
```

These endpoint names are implementation suggestions.

## Example flows

### Browse menu

```text
GET /menu
```

### Create order

```text
POST /orders
```

Request should contain:
- selected menu items,
- quantities,
- pickup option,
- payment choice if implemented.

### Track order

```text
GET /orders/:id
```

### Update kitchen status

```text
PATCH /orders/:id/status
```

Only authorized staff should be allowed to perform this operation.

### Pickup verification

```text
POST /orders/:id/pickup
```

The backend should verify that the order exists and is eligible for pickup.

## API security

Protected endpoints require authentication.

Staff-only endpoints require authorization.

Never trust:
- role values sent by the frontend,
- client-calculated prices,
- client-provided ownership,
- client-provided order status transitions.

## API documentation

Document:
- request schema,
- response schema,
- authentication,
- authorization,
- validation errors,
- expected status codes.
