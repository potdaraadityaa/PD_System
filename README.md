# Enterprise Authorization & Policy Management System (PD_System)

A centralized, RBAC-driven authorization platform designed to secure enterprise applications through dynamic policy enforcement and real-time decision-making.

## Project Overview

The Enterprise Authorization & Policy Management System provides a scalable solution for managing user access across complex organizational structures. By centralizing authorization logic, it eliminates fragmented security policies, ensuring consistency and compliance.

### Why Centralized Authorization?
In modern distributed architectures, managing permissions at the service level leads to duplication and security gaps. A centralized policy engine ensures that access control mimics the organization's structure, not just its technical components.

### Use Cases
- **Enterprise IAM:** Managing thousands of employees with granular role-based access.
- **SaaS Platforms:** Multi-tenant authorization for diverse customer bases.
- **Fintech Applications:** Strict compliance enforcement and audit trails.
- **Admin Dashboards:** Dynamic menu rendering based on user permissions.

## Architecture

The system follows a decoupled architecture where the frontend visualizes relationships and the backend enforces policies via a dedicated engine.

```ascii
+-------------+        +-------------+        +-----------------+
|   User      | -----> | API Gateway | -----> |  Authorization  |
| (Frontend)  |        | (Secure)    |        |     Service     |
+------+------+        +-------------+        +--------+--------+
       |                                               |
       | Visualize                             Validate|
       v                                               v
+-------------+                               +--------+--------+
|  Three.js   |                               |  Policy Engine  |
|  Visualizer |                               | (Decision Logic)|
+-------------+                               +--------+--------+
                                                       |
                                                       v
                                              +--------+--------+
                                              |   PostgreSQL    |
                                              | (Users/Roles)   |
                                              +-----------------+
```

## Tech Stack

### Frontend
- Next.js (React Framework)
- Three.js (3D Visualization)
- Tailwind CSS (Black & White Enterprise Theme)

### Backend
- Java 17
- Spring Boot (REST APIs)

### Security
- JWT (JSON Web Tokens)
- HttpOnly Cookies
- CSRF Protection

### Deployment
- Docker Support
- CI/CD Pipelines

## Core Features

- **User Management:** Onboard and manage user lifecycles securely.
- **Role Management:** Define hierarchical roles and permissions.
- **Policy Management:** Create and enforce fine-grained access policies.
- **Real-Time Decisions:** Instant ALLOW/DENY responses from the policy engine.
- **3D Visualization:** Interactive graph of user-role-policy relationships.
- **Relationship Graph:** Visual mapping of complex authorization structures.
- **Secure API Validation:** Middleware for token verification and scope checks.

## Security Features

- **JWT Authentication:** Stateless, signed tokens for secure identity propagation.
- **Policy Enforcement:** Backend-validated access control ensuring zero trust.
- **Secure Cookies:** HttpOnly and Secure flags to prevent XSS attacks.
- **Input Validation:** Strict request sanitization to prevent injection.
- **CORS Protection:** Configured resource sharing policies.
- **Audit Logging:** Comprehensive tracking of all authorization attempts.

## Installation & Setup

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/potdaraadityaa/PD_System.git
    cd PD_System
    ```

2.  **Configure environment variables:**
    Update `application.properties` with your database credentials.

3.  **Run the application:**
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd sentinel-visualizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Deployment Guide

### Frontend
Deployed on Vercel for optimal edge performance and static generation.

### Backend
Hosted on AWS EC2 or scalable PaaS providers like Render/Railway.

### Database
Managed PostgreSQL instance (RDS, Supabase, or Neon) for reliability and backup.

## Screenshots

![Dashboard Overview](PLACEHOLDER_LINK)
*Dashboard showing real-time metrics and system status.*

![Policy Editor](PLACEHOLDER_LINK)
*Interface for creating and editing granular access policies.*

![3D Visualization](PLACEHOLDER_LINK)
*Interactive 3D graph representing user-role relationships.*

## Future Enhancements

- **Multi-Factor Authentication (MFA):** Adding a second layer of security.
- **Policy Approval Workflow:** Maker-checker process for sensitive policy changes.
- **Advanced Audit Dashboards:** Visual analytics for access patterns.
- **Zero-Trust Improvements:** enhanced identity verification for all requests.
- **Anomaly Detection:** AI-driven identification of suspicious access behavior.

## Author

**Aditya Potdar**
[GitHub Profile](https://github.com/potdaraadityaa)