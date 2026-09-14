# Deployment Reference

## Goal

Provide a reproducible deployment process suitable for a university project.

## Environments

Recommended:

```text
Development
    |
    v
Test / Staging
    |
    v
Production / Demo
```

For a small university project, a separate production environment is optional.

## Deployment requirements

- Configuration must be externalized.
- Secrets must not be committed.
- Build should be reproducible.
- Database migrations should be controlled.
- Health checks should be available where appropriate.

## Kubernetes

Kubernetes is optional.

Do not add Kubernetes merely because the project has a rush-hour scalability risk. The assignment only requires the risk to be identified and controlled through Technical Review.

If Kubernetes is chosen as an implementation enhancement, document:
- why it is needed,
- cluster architecture,
- deployments,
- services,
- ingress,
- secrets,
- resource limits,
- monitoring,
- rollback procedure.

## Demo deployment

Before demonstration:
1. Deploy the latest tested version.
2. Verify authentication.
3. Verify menu.
4. Create a student order.
5. Verify kitchen order visibility.
6. Update order status.
7. Verify tracking/notification.
8. Verify QR/order ID pickup.
9. Verify staff authorization.
