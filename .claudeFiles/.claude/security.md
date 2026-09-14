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
