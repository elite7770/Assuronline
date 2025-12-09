## System Architecture

The system is a classic three-tier web application.

```mermaid
flowchart LR
  User((Browser))
  subgraph Frontend [Frontend - React]
    App[SPA]
  end
  subgraph Backend [Backend - Node/Express]
    API[REST API]
    Mail[Email Service]
    Docs[PDF Generation]
    Pricing[Pricing Service]
  end
  subgraph Infra [Infrastructure]
    DB[(MySQL)]
    Storage[(Documents Folder)]
  end

  User --> App
  App <-->|HTTPS JSON| API
  API --> DB
  API --> Storage
  API --> Mail
  API --> Docs
  API --> Pricing
```

### Deployment View

```mermaid
flowchart TB
  subgraph Internet
    Client[End Users]
  end
  subgraph Cloud[Host]
    LB[Reverse Proxy]
    FE[Frontend Container]
    BE[Backend Container]
    SQL[(MySQL Service)]
    Vol[Persistent Volume for documents]
  end

  Client --> LB --> FE
  Client --> LB --> BE
  BE --> SQL
  BE --> Vol
```

### Key Components

- Backend `Express` API with modules: auth, quotes, policies, payments, documents.
- MySQL via `mysql2` connection pool.
- PDF generation using `pdfkit`.
- Email delivery using `nodemailer`.

### Cross-cutting Concerns

- Authentication via JWT.
- Rate limiting and security headers.
- Input validation with `zod`.


