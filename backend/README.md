## Database Migrations (Knex)

This backend uses Knex for schema migrations while keeping existing seed scripts.

### Setup

1. Ensure environment variables are set (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT).
2. Install dependencies at repo root: `npm install` (adds knex to root node_modules used by backend scripts).

### Commands

- Run latest migrations:
  - `npm run --workspace backend migrate:latest` (or from `backend/`: `npm run migrate:latest`)
- Rollback last batch:
  - `npm run --workspace backend migrate:rollback`
- Create a new migration:
  - `npm run --workspace backend migrate:make <name>`

### Notes

- Initial migrations execute `database/assuronline_schema.sql` then `database/enhanced_schema.sql` with `multipleStatements` enabled.
- Existing seed scripts remain unchanged, e.g.:
  - `npm run --workspace backend seed:admin`
- Optionally, you may import `database/seed_data.sql` manually if needed.

# AssurOnline Backend

A comprehensive Node.js/Express REST API for an insurance management platform that handles quotes, policies, claims, payments, and notifications with role-based authentication.

## 🚀 Overview

AssurOnline Backend is a robust REST API built with Node.js and Express.js that powers an insurance management platform. It provides secure APIs for managing insurance workflows including quote generation, policy management, claims processing, payment handling, and notification systems.

### Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with mysql2/promise
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Environment**: dotenv for configuration
- **Development**: nodemon for hot reloading

### Purpose

This backend serves as the core API for insurance workflows, providing endpoints for:

- User authentication and authorization
- Quote creation and management
- Policy generation and tracking
- Claims filing and processing
- Payment processing and invoicing
- Notification management

## ✨ Features & Modules

### 🔐 Authentication

- JWT-based authentication system
- Role-based access control (Client/Admin)
- Secure password hashing with bcrypt
- Protected routes with middleware

### 📋 Quotes Management

- Create insurance quotes with vehicle details
- List quotes for clients and admins
- Admin approval/rejection workflow
- Quote adjustment capabilities
- Automatic policy creation upon approval

### 📄 Policies

- Auto-generated when quotes are approved
- Policy tracking and management
- Renewal capabilities
- Status monitoring

### 🚨 Claims Processing

- Client claim filing and editing
- Admin review and approval workflow
- Claim settlement processing
- Status tracking throughout the lifecycle

### 💳 Payments & Invoices

- Payment intent creation
- Payment confirmation system
- Automatic invoice generation
- Admin payment status management
- Transaction tracking

### 🔔 Notifications

- Client notification management
- Mark as read functionality
- Admin broadcast capabilities
- System-generated notifications

### 🏥 Health Monitoring

- Health check endpoint for monitoring
- System status verification

## 📁 Project Structure

```
assuronline-backend/
├── src/
│   ├── models/           # Database models
│   │   ├── quotes.model.js
│   │   ├── policies.model.js
│   │   ├── claims.model.js
│   │   ├── payments.model.js
│   │   ├── invoices.model.js
│   │   ├── notifications.model.js
│   │   └── users.model.js
│   ├── controllers/      # Business logic
│   │   ├── auth.controller.js
│   │   ├── quotes.controller.js
│   │   ├── policies.controller.js
│   │   ├── claims.controller.js
│   │   ├── payments.controller.js
│   │   └── notifications.controller.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── quotes.routes.js
│   │   ├── policies.routes.js
│   │   ├── claims.routes.js
│   │   ├── payments.routes.js
│   │   └── notifications.routes.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   ├── config/         # Configuration
│   │   └── db.js
│   ├── utils/          # Helper functions
│   │   └── id.js
│   └── server.js       # Application entry point
├── database/
│   └── schema.sql      # Database schema
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL (v8.0 or higher)
- XAMPP (optional, for phpMyAdmin interface)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd assuronline-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=assuronline
   DB_PORT=3306
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=3001
   ```

4. **Database Setup**
   - Start MySQL service
   - Create database: `CREATE DATABASE assuronline;`
   - Import schema: `mysql -u root -p assuronline < database/schema.sql`

5. **Seed Admin User** (Optional)

   ```bash
   node src/scripts/seed-admin.js
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | User login        | No            |

### Quotes Endpoints

| Method | Endpoint              | Description      | Auth Required | Role   |
| ------ | --------------------- | ---------------- | ------------- | ------ |
| POST   | `/quotes`             | Create new quote | Yes           | Client |
| GET    | `/quotes`             | List user quotes | Yes           | Client |
| GET    | `/quotes/all`         | List all quotes  | Yes           | Admin  |
| POST   | `/quotes/:id/approve` | Approve quote    | Yes           | Admin  |
| POST   | `/quotes/:id/reject`  | Reject quote     | Yes           | Admin  |
| PATCH  | `/quotes/:id/adjust`  | Adjust quote     | Yes           | Admin  |

### Policies Endpoints

| Method | Endpoint        | Description        | Auth Required | Role   |
| ------ | --------------- | ------------------ | ------------- | ------ |
| GET    | `/policies`     | List user policies | Yes           | Client |
| GET    | `/policies/all` | List all policies  | Yes           | Admin  |

### Claims Endpoints

| Method | Endpoint                    | Description      | Auth Required | Role   |
| ------ | --------------------------- | ---------------- | ------------- | ------ |
| POST   | `/claims`                   | File new claim   | Yes           | Client |
| GET    | `/claims`                   | List user claims | Yes           | Client |
| PATCH  | `/claims/:id`               | Edit claim       | Yes           | Client |
| GET    | `/claims/all`               | List all claims  | Yes           | Admin  |
| POST   | `/claims/admin/:id/review`  | Review claim     | Yes           | Admin  |
| POST   | `/claims/admin/:id/approve` | Approve claim    | Yes           | Admin  |
| POST   | `/claims/admin/:id/reject`  | Reject claim     | Yes           | Admin  |
| POST   | `/claims/admin/:id/settle`  | Settle claim     | Yes           | Admin  |

### Payments Endpoints

| Method | Endpoint                | Description           | Auth Required | Role   |
| ------ | ----------------------- | --------------------- | ------------- | ------ |
| POST   | `/payments`             | Create payment intent | Yes           | Client |
| GET    | `/payments`             | List user payments    | Yes           | Client |
| POST   | `/payments/:id/confirm` | Confirm payment       | Yes           | Client |
| GET    | `/payments/:id/invoice` | Get invoice           | Yes           | Client |
| GET    | `/payments/all`         | List all payments     | Yes           | Admin  |
| PATCH  | `/payments/admin/:id`   | Update payment status | Yes           | Admin  |

### Notifications Endpoints

| Method | Endpoint                         | Description             | Auth Required | Role   |
| ------ | -------------------------------- | ----------------------- | ------------- | ------ |
| GET    | `/notifications`                 | List user notifications | Yes           | Client |
| POST   | `/notifications/:id/read`        | Mark as read            | Yes           | Client |
| GET    | `/notifications/admin/all`       | List all notifications  | Yes           | Admin  |
| POST   | `/notifications/admin/broadcast` | Broadcast notification  | Yes           | Admin  |

### System Endpoints

| Method | Endpoint  | Description  | Auth Required |
| ------ | --------- | ------------ | ------------- |
| GET    | `/health` | Health check | No            |

## 🔗 Frontend Integration

The React frontend connects to this backend via the following configuration:

```javascript
// Frontend API configuration
const API_BASE_URL = 'http://localhost:3001';
```

### Authentication Flow

1. **Client Registration/Login**: Frontend sends credentials to `/auth/register` or `/auth/login`
2. **JWT Token**: Backend returns JWT token on successful authentication
3. **Token Storage**: Frontend stores token in localStorage
4. **API Requests**: All subsequent requests include `Authorization: Bearer <token>` header

### Client Workflow

1. Register/Login → Receive JWT token
2. Create quotes → `POST /quotes`
3. View policies → `GET /policies`
4. File claims → `POST /claims`
5. Make payments → `POST /payments`
6. View notifications → `GET /notifications`

### Admin Workflow

1. Login with seeded admin account
2. Review quotes → `GET /quotes/all`
3. Approve/reject quotes → `POST /quotes/:id/approve|reject`
4. Process claims → `GET /claims/all`
5. Manage payments → `GET /payments/all`
6. Send notifications → `POST /notifications/admin/broadcast`

## 🧪 Testing

### Using Postman

Import the following collection structure:

```json
{
  "info": {
    "name": "AssurOnline API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  }
}
```

### Using cURL Examples

**Register User:**

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "client"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Quote:**

```bash
curl -X POST http://localhost:3001/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "type": "auto",
    "vehicleBrand": "Toyota",
    "vehicleModel": "Camry",
    "vehicleYear": 2020,
    "coverageType": "comprehensive"
  }'
```

### End-to-End Testing Flow

1. **Client Registration**

   ```bash
   POST /auth/register
   ```

2. **Client Login**

   ```bash
   POST /auth/login
   ```

3. **Create Quote**

   ```bash
   POST /quotes
   ```

4. **Admin Login**

   ```bash
   POST /auth/login (with admin credentials)
   ```

5. **Approve Quote**

   ```bash
   POST /quotes/:id/approve
   ```

6. **File Claim**

   ```bash
   POST /claims
   ```

7. **Admin Approve Claim**

   ```bash
   POST /claims/admin/:id/approve
   ```

8. **Make Payment**

   ```bash
   POST /payments
   ```

9. **Confirm Payment**

   ```bash
   POST /payments/:id/confirm
   ```

10. **Check Notifications**
    ```bash
    GET /notifications
    ```

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=assuronline_prod
JWT_SECRET=your-super-secure-jwt-secret
PORT=3001
```

### Deployment Steps

1. Set up production MySQL database
2. Configure environment variables
3. Run database migrations
4. Start the application with PM2 or similar process manager

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@assuronline.com or create an issue in the repository.

---

**AssurOnline Backend** - Powering the future of insurance management 🚀
