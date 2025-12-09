# ADR-002: Authentication Approach

Status: Accepted
Date: 2025-09-26

## Context
We need stateless auth for SPA + API. Current implementation uses JWT with roles.

## Decision
Continue using JWT (access tokens) signed with strong secret and short TTL. Optionally support refresh tokens stored httpOnly if needed.

## Consequences
- Simple horizontal scaling, no server session storage.
- Clients must handle token renewal.

## Alternatives
- Server sessions (Redis): heavier infra, more control over revocation.
- OAuth/OIDC: potentially overkill for current scope.


