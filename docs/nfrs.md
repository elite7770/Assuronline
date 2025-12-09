## Non-Functional Requirements

- Availability: 99.9% monthly uptime target.
- Performance: P95 API latency < 300ms under 100 RPS.
- Security: OWASP Top 10 mitigations; JWT expiration ≤ 15 min.
- Scalability: Stateless API; horizontal scale to 5x baseline RPS.
- Observability: Structured logs, error tracking, health checks.
- Compliance: PII encrypted at rest where applicable.
- Backups: Daily DB backups; 7-day retention.

### Measurement
- Synthetic checks for uptime and latency.
- Load testing before releases.
- Audit logs for admin actions.


