---
name: software-architecture
description: >
  Use this skill whenever the user needs to DESIGN the technical architecture for a scenario or
  feature — API contracts, database schemas, OpenAPI specifications, and system design decisions.
  This skill produces just-enough architecture per scenario (not upfront big design), following
  agile principles.
  Covers: reading scenario requirements (SC-xxx) and test cases (TC-xxx), designing API contracts
  (endpoints, request/response schemas, error codes), designing database schemas (tables, columns,
  indexes, constraints, migrations), generating OpenAPI/Swagger specifications for API documentation,
  documenting integration points, and producing architecture decision records (ADRs) when trade-offs
  exist.
  Trigger when the user mentions: architecture, API design, API contract, database design, schema,
  data model, ERD, entity relationship, endpoint design, REST API, GraphQL schema, DB migration,
  table structure, system design, technical design, OpenAPI, Swagger, API documentation,
  "how should I structure the API", "what tables do I need", "design the database for",
  "create the API contract for", "generate OpenAPI spec", or when a scenario needs technical
  implementation planning.
  Always run AFTER business-analysis and software-tester-design — architecture serves the scenario,
  not the other way around. Output feeds directly into the ai-orchestrator for TDD implementation.
---

> **Artifact Reference:** All artifacts produced by this skill MUST follow the templates and storage locations defined in [`.opencode/artifacts/ARTIFACTS.md`](../../artifacts/ARTIFACTS.md). Store outputs in `docs/architecture/`.

# Software Architecture — Just-Enough Design Skill

## Role & Responsibility

This skill sits between scenario planning and implementation. It receives a single scenario with its test cases and produces the minimum technical design needed to implement that scenario.

```
[project-management]              [software-tester-design]
──────────────────────            ────────────────────────
SC-xxx  Scenario in scope   ──┐   TC-xxx  Test Cases        ──┐
DEV-xxx Task breakdown      ──┤   Expected I/O specs        ──┘
                              │
                              ↓
                   [software-architecture]
                   ─────────────────────────────────────
                   Step 1: Understand scenario scope
                   Step 2: Design API contract
                   Step 3: Design database schema
                   Step 4: Document integration points
                   Step 5: Record architecture decisions (ADR)
                   Step 6: Generate OpenAPI specification
                              ↓
                   [ai-orchestrator]
                   Receives: API contract + DB schema + OpenAPI + ADRs
                   Uses them to write failing tests (TDD Red)
                   then implements (TDD Green)
```

---

## Core Philosophy — Just-Enough Architecture

**Just-enough architecture** means designing only what is needed for the current scenario — not the entire system upfront.

```
❌ Big upfront design:   Design all 50 tables → Design all 100 endpoints → Then implement
✓  Just-enough:          Scenario 1 → Design 2 tables + 3 endpoints → Implement → Repeat
```

### Why this matters

| Principle | How it applies |
|-----------|----------------|
| **YAGNI** (You Aren't Gonna Need It) | Only design what the scenario requires |
| **Evolutionary architecture** | Schema and API evolve with each scenario |
| **Fast feedback** | Smaller design scope = faster validation |
| **Reduced waste** | No unused tables, no dead endpoints |

### When to do more upfront design

Sometimes a scenario touches a core domain model that will affect many future scenarios. In these cases:

- Document the **known extension points** (but don't implement them)
- Create an **ADR** explaining the trade-off
- Design for **current + 1 known future scenario** (no more)

---

## Step 1 — Understand Scenario Scope

Before designing anything, extract exactly what the scenario requires.

### Input Checklist

```
From project-management:
  [ ] SC-xxx: Scenario description and acceptance criteria
  [ ] DEV-xxx: Developer task breakdown (which layers are affected?)
  [ ] US-xxx: User story (what job is the user trying to do?)

From software-tester-design:
  [ ] TC-xxx: Test cases with expected inputs and outputs
  [ ] Field specifications (types, constraints, formats)
  [ ] SUT definition (existing components, tech stack)
```

### Scope Summary Template

```
## Architecture Scope — [Scenario ID]

Scenario:     SC-xxx-001 — [Scenario title]
User Story:   US-xxx-001 — [User story title]
Job Step:     [Which step in the user's job flow this covers]

─── What this scenario needs ───────────────────────────────────
  Actors involved:    [User | System | External Service]
  Data to persist:    [What entities/records are created or updated?]
  Data to read:       [What existing data is queried?]
  External calls:     [Any third-party APIs or services?]
  Events to emit:     [Any async events triggered?]

─── Existing components to reuse ───────────────────────────────
  [List existing tables, endpoints, services that already exist]

─── New components to design ───────────────────────────────────
  [ ] API endpoint(s): [List]
  [ ] DB table(s):     [List]
  [ ] Integration(s):  [List]
```

---

## Step 2 — Design API Contract

Design the API endpoints required by this scenario. Each endpoint must satisfy the test cases.

### API Contract Format

```
## API Contract — [Feature/Scenario]

### [HTTP_METHOD] [path]

Description:  [What this endpoint does — one sentence]
Actor:        [Who calls this: User | System | External Service]
Auth:         [None | Bearer Token | API Key | Session Cookie]
Scenario:     SC-xxx-001
Test Cases:   TC-xxx-001, TC-xxx-002, TC-xxx-003

─── Request ────────────────────────────────────────────────────
Headers:
  Authorization:  Bearer {token}      # if auth required
  Content-Type:   application/json

Path Parameters:
  | Param   | Type   | Required | Description            |
  |---------|--------|----------|------------------------|
  | {id}    | UUID   | Yes      | Resource identifier    |

Query Parameters:
  | Param   | Type   | Required | Default | Description           |
  |---------|--------|----------|---------|-----------------------|
  | page    | int    | No       | 1       | Page number           |
  | limit   | int    | No       | 20      | Items per page (max 100) |

Request Body:
  ```json
  {
    "fieldName": "string (3-50 chars, alphanumeric)",
    "email": "string (valid email, required)",
    "optionalField?": "string | null"
  }
  ```

─── Response ───────────────────────────────────────────────────
Success (2xx):
  HTTP 201 Created
  ```json
  {
    "id": "uuid",
    "fieldName": "string",
    "email": "string",
    "createdAt": "ISO 8601 datetime"
  }
  ```

Errors:
  | Status | Code                   | When                               |
  |--------|------------------------|------------------------------------|
  | 400    | VALIDATION_ERROR       | Request body fails validation      |
  | 401    | UNAUTHORIZED           | Missing or invalid auth token      |
  | 403    | FORBIDDEN              | User lacks permission              |
  | 404    | NOT_FOUND              | Resource does not exist            |
  | 409    | CONFLICT               | Resource already exists            |
  | 422    | UNPROCESSABLE_ENTITY   | Business rule violation            |
  | 500    | INTERNAL_ERROR         | Unexpected server error            |

Error Response Shape:
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "errors": [
      { "field": "email", "code": "INVALID_FORMAT", "message": "Email format is invalid." }
    ]
  }
  ```

─── Side Effects ───────────────────────────────────────────────
  - [DB: Creates record in `users` table]
  - [Event: Emits `user.created` to message queue]
  - [Email: Triggers verification email via SendGrid]

─── Rate Limiting ──────────────────────────────────────────────
  [e.g. 10 requests per IP per minute]
```

### RESTful Design Guidelines

| Resource | HTTP Method | Path Pattern | Purpose |
|----------|-------------|--------------|---------|
| Collection | GET | `/resources` | List all |
| Collection | POST | `/resources` | Create new |
| Single | GET | `/resources/{id}` | Get one |
| Single | PUT | `/resources/{id}` | Full update |
| Single | PATCH | `/resources/{id}` | Partial update |
| Single | DELETE | `/resources/{id}` | Delete |
| Action | POST | `/resources/{id}/action` | Custom action |

### Naming Conventions

- Use **plural nouns** for collections: `/users`, `/orders`, `/products`
- Use **kebab-case** for multi-word paths: `/order-items`, `/payment-methods`
- Use **camelCase** for JSON fields: `displayName`, `createdAt`, `orderId`
- Version in path when breaking changes: `/v1/users`, `/v2/users`

---

## Step 3 — Design Database Schema

Design the database tables required by this scenario. Each table must support the API contracts and test cases.

### Schema Design Format

```
## Database Schema — [Feature/Scenario]

### Table: [table_name]

Description:  [What this table stores — one sentence]
Owner:        [Which service owns this table]
Scenario:     SC-xxx-001

─── Columns ────────────────────────────────────────────────────
| Column        | Type          | Nullable | Default     | Constraints        |
|---------------|---------------|----------|-------------|--------------------|
| id            | UUID          | No       | gen_random_uuid() | PK          |
| display_name  | VARCHAR(50)   | No       | —           | CHECK(length >= 3) |
| email         | VARCHAR(255)  | No       | —           | UNIQUE             |
| password_hash | VARCHAR(255)  | No       | —           | —                  |
| is_verified   | BOOLEAN       | No       | false       | —                  |
| created_at    | TIMESTAMPTZ   | No       | now()       | —                  |
| updated_at    | TIMESTAMPTZ   | No       | now()       | —                  |

─── Indexes ────────────────────────────────────────────────────
| Name                    | Columns       | Type   | Purpose                    |
|-------------------------|---------------|--------|----------------------------|
| users_pkey              | id            | PK     | Primary key                |
| users_email_unique      | email         | UNIQUE | Enforce uniqueness         |
| users_created_at_idx    | created_at    | BTREE  | Query by registration date |

─── Foreign Keys ───────────────────────────────────────────────
| Column      | References          | On Delete | On Update |
|-------------|---------------------|-----------|-----------|
| [none]      | —                   | —         | —         |

─── Constraints ────────────────────────────────────────────────
  - display_name must be 3-50 characters
  - email must be unique across all users
  - password_hash must never be null (enforced at app level: bcrypt cost 12)
```

### Migration Script Template

```sql
-- Migration: [YYYYMMDD_HHMMSS]_create_[table_name]
-- Scenario: SC-xxx-001
-- Description: [What this migration does]

-- UP
CREATE TABLE [table_name] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    [column] [TYPE] [CONSTRAINTS],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX [index_name] ON [table_name] ([columns]);
CREATE INDEX [index_name] ON [table_name] ([columns]);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON [table_name]
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- DOWN
DROP TABLE IF EXISTS [table_name] CASCADE;
```

### Schema Design Guidelines

| Guideline | Rationale |
|-----------|-----------|
| Use UUID for primary keys | No sequential ID leakage, safe for distributed systems |
| Always have `created_at`, `updated_at` | Audit trail, debugging, analytics |
| Use `TIMESTAMPTZ` not `TIMESTAMP` | Timezone-aware, avoids ambiguity |
| Name foreign keys `[table]_id` | Clear ownership: `user_id`, `order_id` |
| Add indexes for query patterns | Design indexes based on API query needs |
| Don't over-normalize | Denormalize when read performance matters |
| Soft delete with `deleted_at` | When audit/recovery needed; hard delete otherwise |

---

## Step 4 — Document Integration Points

If the scenario involves external services, document the integration contract.

### Integration Contract Format

```
## Integration — [Service Name]

Provider:     [e.g. Stripe, SendGrid, AWS S3]
Purpose:      [What this integration does for the scenario]
Scenario:     SC-xxx-001
Test Approach: [Mock | Sandbox | Contract Test]

─── Outbound Call ──────────────────────────────────────────────
Endpoint:     POST https://api.provider.com/v1/resource
Auth:         Bearer {API_KEY}

Request:
  ```json
  {
    "to": "user@example.com",
    "subject": "Verify your email",
    "body": "Click here: {link}"
  }
  ```

Response (Success):
  HTTP 200
  ```json
  {
    "messageId": "abc123",
    "status": "queued"
  }
  ```

Response (Failure):
  | Status | Code               | Handling                        |
  |--------|--------------------|---------------------------------|
  | 429    | RATE_LIMITED       | Retry with exponential backoff  |
  | 500    | PROVIDER_ERROR     | Retry up to 3 times             |
  | 401    | INVALID_API_KEY    | Alert ops, fail immediately     |

─── Mock Contract ──────────────────────────────────────────────
For automated tests, mock this integration with:
  - Success: Return 200 with fake messageId
  - Failure: Return 500 to test retry logic
  - Mock file: src/tests/__mocks__/sendgrid.ts
```

---

## Step 5 — Architecture Decision Records (ADR)

When a design choice involves trade-offs, document it as an ADR.

### ADR Format

```
## ADR-[SEQ]: [Title — the decision]

Status:       Proposed | Accepted | Deprecated | Superseded
Date:         [YYYY-MM-DD]
Scenario:     SC-xxx-001
Deciders:     [Who made this decision]

─── Context ────────────────────────────────────────────────────
[What is the situation that requires a decision?]

─── Decision ───────────────────────────────────────────────────
[What is the decision that was made?]

─── Alternatives Considered ────────────────────────────────────
| Option | Pros | Cons |
|--------|------|------|
| [A]    | ...  | ...  |
| [B]    | ...  | ...  |

─── Consequences ───────────────────────────────────────────────
Positive:
  - [Benefit 1]
  - [Benefit 2]

Negative:
  - [Trade-off 1]
  - [Trade-off 2]

─── Related ────────────────────────────────────────────────────
  - ADR-xxx (supersedes or relates to)
  - SC-xxx-001 (scenario this decision supports)
```

### Common ADR Topics

| Topic | Example Decision |
|-------|------------------|
| Database choice | PostgreSQL vs MongoDB for user data |
| Auth strategy | JWT vs session cookies |
| API style | REST vs GraphQL |
| Caching | Redis vs in-memory |
| Queue | RabbitMQ vs Kafka vs SQS |
| File storage | S3 vs local disk |
| Search | PostgreSQL full-text vs Elasticsearch |
| ID generation | UUID vs ULID vs auto-increment |

---

## Step 6 — Generate OpenAPI Specification

Generate an OpenAPI 3.0+ specification from the API contracts designed in Step 2. This provides machine-readable API documentation for developers and integrators.

### OpenAPI Template

```yaml
openapi: 3.0.3
info:
  title: [Feature Name] API
  description: |
    API endpoints for [Scenario ID]: [Scenario Title]

    Generated from architecture design for scenario SC-xxx-001.
  version: 1.0.0
  contact:
    name: API Support

servers:
  - url: http://localhost:3000/api
    description: Local development
  - url: https://staging.example.com/api
    description: Staging environment
  - url: https://api.example.com
    description: Production

tags:
  - name: [Resource]
    description: Operations for [resource] management

paths:
  /[resource]:
    post:
      tags:
        - [Resource]
      summary: Create a new [resource]
      description: |
        Creates a new [resource] with the provided data.

        **Scenario:** SC-xxx-001
        **Test Cases:** TC-xxx-001, TC-xxx-002
      operationId: create[Resource]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Create[Resource]Request'
            examples:
              valid:
                summary: Valid request
                value:
                  fieldName: "validValue"
                  email: "user@example.com"
              invalid:
                summary: Invalid request (validation error)
                value:
                  fieldName: ""
                  email: "invalid"
      responses:
        '201':
          description: Resource created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/[Resource]Response'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Conflict (resource already exists)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /[resource]/{id}:
    get:
      tags:
        - [Resource]
      summary: Get [resource] by ID
      operationId: get[Resource]ById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Resource found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/[Resource]Response'
        '404':
          description: Resource not found

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Create[Resource]Request:
      type: object
      required:
        - fieldName
        - email
      properties:
        fieldName:
          type: string
          minLength: 3
          maxLength: 50
          pattern: '^[a-zA-Z0-9]+$'
          description: Display name (alphanumeric, 3-50 chars)
          example: "validValue"
        email:
          type: string
          format: email
          maxLength: 255
          description: Email address (must be unique)
          example: "user@example.com"
        optionalField:
          type: string
          nullable: true
          description: Optional field

    [Resource]Response:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier
        fieldName:
          type: string
        email:
          type: string
          format: email
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    ValidationError:
      type: object
      properties:
        code:
          type: string
          example: "VALIDATION_ERROR"
        message:
          type: string
          example: "One or more fields are invalid."
        errors:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              code:
                type: string
              message:
                type: string

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
```

### OpenAPI Generation Guidelines

| Guideline | Rationale |
|-----------|-----------|
| One spec per scenario (or feature) | Keep specs focused and manageable |
| Include examples | Helps developers understand expected data |
| Link to test cases | Traceability from spec to verification |
| Use `$ref` for reusable schemas | DRY principle, consistent types |
| Version the API | Breaking changes need version bumps |
| Document all error codes | Consumers need to handle errors |

### File Location

```
docs/
  openapi/
    [feature]-api.yaml        # OpenAPI spec for feature
    [feature]-api.json        # JSON version (auto-generated)
```

---

## Output Document Template

```markdown
# Architecture — [Scenario ID]: [Scenario Title]

## 1. Scope Summary
[From Step 1 — what this scenario needs]

## 2. API Contract
[All endpoints from Step 2]

## 3. Database Schema
[All tables and migrations from Step 3]

## 4. Integration Points
[External service contracts from Step 4, if any]

## 5. Architecture Decisions
[ADRs from Step 5, if any]

## 6. OpenAPI Specification
[Link to generated OpenAPI spec file from Step 6]
- File: `docs/openapi/[feature]-api.yaml`
- Interactive docs: [Swagger UI / Redoc link when deployed]

## 7. Test Traceability
| API / Table | Test Case | What it validates |
|-------------|-----------|-------------------|
| POST /users | TC-xxx-001 | Happy path — 201 with user body |
| POST /users | TC-xxx-002 | Duplicate email — 409 |
| users table | TC-xxx-003 | Email unique constraint enforced |

## 8. Notes for Implementation
- [Anything the developer needs to know]
- [Gotchas, edge cases, or assumptions]
```

---

## Traceability

Every architecture artifact must trace back to a scenario and forward to test cases:

```
SC-xxx-001 (Scenario)
    ↓
[software-architecture]
    ├── API: POST /api/users     → TC-xxx-001, TC-xxx-002
    ├── Table: users             → TC-xxx-003
    └── Integration: SendGrid    → TC-xxx-004

    ↓
[ai-orchestrator]
    Receives: API contract + schema + test cases
    Writes failing tests first (TDD Red)
    Implements to make tests pass (TDD Green)
```

This ensures no endpoint is designed without a scenario, and no test case exists without a design to validate.
