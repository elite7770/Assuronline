# ADR-001: Database Migrations Strategy

Status: Accepted
Date: 2025-09-26

## Context
The project currently uses raw SQL files for schema creation and seed scripts. We need a repeatable, versioned migration system.

## Decision
Adopt Knex migration framework for MySQL. Keep existing seed scripts but transition long-term to Knex seeds. Migrations will either (a) re-express DDL via Knex schema builder, or (b) execute vetted SQL from existing schema files.

## Consequences
- Enables CI/CD controlled schema evolution.
- New environments bootstrap with `knex migrate:latest`.
- Requires `knexfile.js` and migration scripts in `backend/`.

## Alternatives Considered
- Prisma Migrate: richer schema modeling but higher adoption cost and conflicts with existing raw queries.
- Flyway/Liquibase: external tooling; additional runtime dependency.


