# Coding Conventions

## General

- Use clear English identifiers for code.
- Use descriptive names.
- Prefer small focused functions.
- Avoid unnecessary abstractions.
- Avoid duplicated business logic.
- Keep modules cohesive.
- Prefer explicit code over clever code.

## Naming

Use consistent conventions for:
- files,
- classes,
- functions,
- variables,
- database entities,
- API resources.

Choose one convention per layer and apply it consistently.

## Business logic

Do not place important business rules only in:
- UI components,
- route handlers,
- database triggers without documentation.

Business rules should have a clear, testable home.

## Error handling

Handle expected errors explicitly.

Do not use empty catch blocks.

Do not expose internal errors to users.

## Comments

Never write comments in code.

Rely on clear naming, small focused functions, and the `specs/` files for the "why" — non-obvious decisions belong in the relevant `.claude/` reference file or the feature's spec, not inline.

## Dependencies

Before adding a dependency:
1. Check whether the existing stack already solves the problem.
2. Check maintenance and security implications.
3. Check whether the dependency is necessary.
4. Avoid dependencies for trivial functionality.

## Changes

Keep commits/MRs focused.

Do not mix:
- unrelated refactoring,
- feature development,
- formatting-only changes,
- dependency upgrades

unless there is a clear reason.
