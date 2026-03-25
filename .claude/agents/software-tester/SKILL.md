---
name: software-tester
description: >
  Use this skill whenever the user needs software testing assistance, including:
  designing test scenarios, test cases, and test data; writing automation tests;
  applying test design techniques (equivalence partitioning, boundary value analysis,
  decision tables, state transition, pairwise); shift-left testing strategy; test planning
  for microservice architectures; and coverage across all test levels (unit, integration,
  component, API, frontend component, E2E).
  Trigger when the user mentions: test cases, test scenarios, test data, automation testing,
  QA, quality assurance, shift-left, BDD, TDD, acceptance criteria, regression, smoke test,
  test coverage, Playwright, Cypress, Jest, Vitest, Supertest, Pact, test design, or asks
  to "write tests", "design tests", "create test cases", or "how do I test X".
  Always use this skill for any structured testing workflow — from business flow analysis
  through test design to automation code generation.
---

> **Artifact Reference:** All artifacts produced by this skill MUST follow the templates and storage locations defined in [`.opencode/artifacts/ARTIFACTS.md`](../../artifacts/ARTIFACTS.md). Store outputs in `docs/test-design/`.

# Software Tester Skill

## Core Philosophy: Shift-Left Testing

**Shift-left** means moving testing as early as possible in the development lifecycle — before code is written, not after.

```
Traditional (shift-right):
  Requirements → Design → Code → [TEST] → Deploy

Shift-Left:
  [TEST THINKING] → Requirements → [TEST DESIGN] → Code → [AUTOMATE] → Deploy
```

**Key shift-left practices:**
- Review requirements and business flows *before* writing code
- Write test cases from acceptance criteria before implementation starts
- Design test data alongside schema/domain modeling
- Automate regression at the lowest feasible test level

---

## Step-by-Step Testing Workflow

### Step 0 — Define the System Under Test (SUT)

Before any test design, document **what system you are testing**. This shapes which test levels apply, what can be mocked, where integration points are, and what environments exist.

A SUT definition answers four questions:
1. What are the components and how do they connect?
2. What tech stack and versions are in use?
3. What are the external dependencies and integration points?
4. What environments exist and what is testable in each?

---

#### SUT Definition Template

```
System Name:    [e.g. "E-Commerce Platform", "Payment Gateway", "Auth Service"]
Version:        [e.g. v2.3.1 or sprint/release context]
Description:    [1–2 sentences — what the system does and who uses it]

─────────────────────────────────────────────
ARCHITECTURE
─────────────────────────────────────────────
Architecture Style:
  [ ] Monolith          [ ] Microservices       [ ] Modular Monolith
  [ ] Serverless        [ ] Event-Driven        [ ] BFF + Services

Components:
  Name              | Type            | Responsibility
  ──────────────────|─────────────────|──────────────────────────────
  [component-name]  | Frontend        | [e.g. Customer-facing web UI]
  [component-name]  | Backend Service | [e.g. Handles order lifecycle]
  [component-name]  | Background Job  | [e.g. Sends email notifications]
  [component-name]  | Database        | [e.g. Stores user and order data]
  [component-name]  | Message Queue   | [e.g. Order events pub/sub]
  [component-name]  | Cache           | [e.g. Session and product cache]

Communication:
  [ ] REST API        [ ] GraphQL         [ ] gRPC
  [ ] Message Queue   [ ] WebSocket       [ ] Event Bus
  Protocol detail: [e.g. "Services communicate via REST; async events via RabbitMQ"]

─────────────────────────────────────────────
TECH STACK
─────────────────────────────────────────────
Frontend:
  Framework:    [e.g. React 18, Next.js 14, Vue 3]
  State:        [e.g. Zustand, Redux, React Query]
  UI Library:   [e.g. Tailwind CSS, Material UI]
  Build Tool:   [e.g. Vite, Webpack]

Backend:
  Language:     [e.g. Node.js 20, Python 3.12, Java 21]
  Framework:    [e.g. Express 4, FastAPI, Spring Boot 3]
  ORM / DB:     [e.g. Prisma + PostgreSQL 15, Mongoose + MongoDB 7]
  Auth:         [e.g. JWT + Refresh Token, OAuth2, NextAuth.js]
  Cache:        [e.g. Redis 7]
  Queue:        [e.g. RabbitMQ, Kafka, BullMQ]

Infrastructure:
  Deployment:   [e.g. Docker + Kubernetes, Vercel + Railway, AWS ECS]
  CI/CD:        [e.g. GitHub Actions, GitLab CI, Jenkins]
  Monitoring:   [e.g. Datadog, Sentry, CloudWatch]

─────────────────────────────────────────────
EXTERNAL DEPENDENCIES & INTEGRATION POINTS
─────────────────────────────────────────────
  Name                | Type              | Test Approach
  ────────────────────|───────────────────|──────────────────────────────
  [e.g. Stripe]       | Payment Gateway   | Mock in unit/API; sandbox in E2E
  [e.g. SendGrid]     | Email Service     | Mock in all automated tests
  [e.g. Google OAuth] | Auth Provider     | Mock token; real login in E2E only
  [e.g. AWS S3]       | File Storage      | Localstack in integration tests
  [e.g. Twilio]       | SMS Gateway       | Mock always; manual check in staging

─────────────────────────────────────────────
DATA STORES
─────────────────────────────────────────────
  Name             | Type        | Owned By         | Shared?
  ─────────────────|─────────────|──────────────────|────────
  [e.g. user_db]   | PostgreSQL  | User Service     | No
  [e.g. order_db]  | PostgreSQL  | Order Service    | No
  [e.g. cache]     | Redis       | API Gateway      | Yes (read-only for others)

Rule: Never share a database between services — even in tests.

─────────────────────────────────────────────
ENVIRONMENTS
─────────────────────────────────────────────
  Environment | Purpose                        | Test Types Allowed
  ────────────|────────────────────────────────|─────────────────────────────────
  local       | Developer machine              | Unit, Component, API
  dev         | Shared dev integration         | Unit, Component, API, Integration
  staging     | Pre-production mirror          | All types including E2E
  production  | Live system                    | Smoke tests only (read-only)

─────────────────────────────────────────────
TEST SCOPE BOUNDARIES
─────────────────────────────────────────────
In scope:
  - [List components, services, and flows covered by this test effort]

Out of scope:
  - [Third-party systems tested only via their own test suites]
  - [Legacy components not under active development]
  - [Infrastructure / DevOps concerns outside app layer]

─────────────────────────────────────────────
TEST LEVEL APPLICABILITY
─────────────────────────────────────────────
  Level               | Applicable? | Owner         | Run On
  ────────────────────|─────────────|───────────────|─────────────────
  Unit                | Yes         | Developer     | Every commit
  Component (Backend) | Yes         | Developer     | Every commit
  API                 | Yes         | Developer/QA  | Every PR
  Contract            | Yes         | QA            | Every PR (shared APIs)
  Integration         | Yes         | QA            | Merge to main
  Frontend Component  | Yes         | Developer     | Every PR
  E2E                 | Yes         | QA            | Merge to main / nightly
```

---

#### Example SUT Definition: E-Commerce Platform

```
System Name:    E-Commerce Platform
Version:        v3.1 (Sprint 24)
Description:    B2C online store allowing customers to browse products,
                manage carts, check out, and track orders. Operated by
                internal merchants via an admin portal.

ARCHITECTURE
  Style: Microservices

  Components:
    storefront-web      | Frontend        | Customer-facing Next.js app
    admin-web           | Frontend        | Merchant/admin portal (React)
    user-service        | Backend Service | Registration, login, profiles
    product-service     | Backend Service | Catalog, inventory, pricing
    order-service       | Backend Service | Cart, checkout, order lifecycle
    notification-worker | Background Job  | Email/SMS on order events
    api-gateway         | Gateway         | Auth, routing, rate limiting
    postgres-user       | Database        | User accounts and sessions
    postgres-order      | Database        | Orders and order items
    mongodb-product     | Database        | Product catalog (document model)
    redis-cache         | Cache           | Sessions, product cache (TTL 10m)
    rabbitmq            | Message Queue   | order.created, order.updated events

  Communication: REST between services; async events via RabbitMQ

TECH STACK
  Frontend:  Next.js 14 (App Router), Tailwind CSS, React Query
  Backend:   Node.js 20, Express 4, Prisma ORM, Mongoose
  Auth:      JWT (15min) + Refresh Token (7d), stored in HttpOnly cookies
  Cache:     Redis 7
  Queue:     RabbitMQ 3.12

EXTERNAL DEPENDENCIES
  Stripe          | Payment Gateway | Mock in unit/API; Stripe test mode in E2E
  SendGrid        | Email           | Mock always; inspect in staging manually
  Google OAuth    | Social Login    | Mock token in API tests; real login in E2E
  Cloudinary      | Image Storage   | Mock in unit; real account in staging

DATA STORES
  postgres-user   | PostgreSQL | user-service   | Not shared
  postgres-order  | PostgreSQL | order-service  | Not shared
  mongodb-product | MongoDB    | product-service| Not shared
  redis-cache     | Redis      | api-gateway    | Read-only for other services

ENVIRONMENTS
  local    → Unit, Component, API tests (Docker Compose for DB)
  dev      → Integration tests (all services deployed)
  staging  → E2E, performance, security tests
  prod     → Smoke tests only (health checks, no writes)

TEST SCOPE BOUNDARIES
  In scope:  user-service, product-service, order-service, storefront-web
  Out of scope: admin-web (separate team), notification-worker (manual in staging),
                Stripe internals, infrastructure/k8s configuration
```

---

#### How the SUT Definition Drives Test Design

| SUT Element | Drives |
|---|---|
| Architecture (microservices) | Need contract tests at every service boundary |
| External dependency (Stripe) | Must mock in unit/API; define mock contract |
| Shared cache (Redis) | Cache invalidation tests; concurrency edge cases |
| Message queue (RabbitMQ) | Event-driven integration tests; consumer tests |
| Multiple DB owners | No cross-DB joins; each service tests its own DB |
| Environment matrix | Which test types run where and who triggers them |
| Out-of-scope components | Stops scope creep; avoids duplicating other teams' work |

---

### Step 1 — Understand the Business Flow

Before writing a single test case, map the business domain:

1. **Identify the feature/user story**: What problem does it solve? Who uses it?
2. **Map the happy path**: The primary flow when everything works correctly
3. **Identify alternate flows**: Valid but non-primary paths (e.g., different user roles, optional inputs)
4. **Identify exception flows**: Error conditions, invalid inputs, edge states
5. **List business rules**: Constraints, validations, domain logic (e.g., "orders over $10,000 require approval")
6. **Understand domain entities**: Key objects, their states, and transitions

**Output: Business Flow Map (example)**
```
Feature: Online Order Checkout

Happy Path:
  User selects items → Reviews cart → Enters payment → Confirms order → Receives confirmation

Alternate Flows:
  - Apply discount code
  - Use saved payment method
  - Guest checkout (no account)

Exception Flows:
  - Payment declined
  - Item out of stock at confirmation
  - Session timeout mid-checkout

Business Rules:
  - Discount codes cannot be stacked
  - Max 10 unique items per order
  - Orders > $10,000 require identity verification
  - Prices locked at time of add-to-cart
```

---

### Step 1b — Define Input & Output Fields Per Action

For every action in the flow, explicitly define the **input fields** (with constraints) and **expected output** before designing test cases. This is the foundation for BVA, EP, and test data generation.

#### Input Field Specification Format

```
Action: [Action name, e.g. "User submits registration form"]

Input Fields:
  field_name:
    type:     string | number | boolean | date | enum | file
    required: yes | no
    min:      [minimum value or length]
    max:      [maximum value or length]
    format:   [allowed characters, pattern, or regex]
    allowed:  [list of allowed values — for enum/constrained fields]
    notes:    [business rule or domain constraint]

Output:
  success:  [HTTP status + response body shape or UI state]
  failure:  [HTTP status + error message shape or UI state]
```

#### Example: User Registration Form

```
Action: User enters and submits the registration form

Input Fields:
  displayName:
    type:     string
    required: yes
    min:      3 characters
    max:      50 characters
    format:   letters (a-zA-Z), digits (0-9)
    notes:    no spaces or special characters; must be unique

  email:
    type:     string
    required: yes
    min:      10 characters
    max:      50 characters
    format:   valid email format (local@domain)
    allowed:  public domains (@gmail.com, @hotmail.com, @yahoo.com)
              OR company domain (@company.com)
    notes:    domain must be in the approved domain whitelist; must be unique

  password:
    type:     string
    required: yes
    min:      10 characters
    max:      64 characters
    format:   letters (a-zA-Z), digits (0-9), symbols (!@#$%^&*()_+)
    notes:    must contain at least 1 uppercase, 1 digit, 1 symbol (if enforced)

Output:
  success:  HTTP 201 | { userId, displayName, email, createdAt }
            UI: redirect to /dashboard with welcome message
  failure:  HTTP 400 | { field, code, message } per validation error
            UI: inline error below the offending field; form stays populated
```

#### Example: Login Action

```
Action: User submits login credentials

Input Fields:
  email:
    type:     string
    required: yes
    format:   valid email
    notes:    must match a registered, active account

  password:
    type:     string
    required: yes
    min:      1 character (no trim — spaces are significant)
    max:      64 characters
    notes:    compared against stored bcrypt hash

Output:
  success:  HTTP 200 | { accessToken, refreshToken, expiresIn }
            UI: redirect to intended page or /dashboard
  failure — wrong credentials:  HTTP 401 | { code: "INVALID_CREDENTIALS" }
  failure — account locked:     HTTP 403 | { code: "ACCOUNT_LOCKED", unlocksAt }
  failure — unverified email:   HTTP 403 | { code: "EMAIL_NOT_VERIFIED" }
```

#### Example: Place Order Action

```
Action: User places an order

Input Fields:
  items[].productId:
    type:     string
    required: yes
    format:   UUID v4
    notes:    must reference an existing, active product

  items[].quantity:
    type:     number (integer)
    required: yes
    min:      1
    max:      99
    notes:    must not exceed current stock level

  discountCode:
    type:     string
    required: no
    min:      6 characters
    max:      20 characters
    format:   alphanumeric, uppercase (A-Z0-9)
    notes:    must be active, not expired, not already used by this user

  shippingAddressId:
    type:     string
    required: yes
    format:   UUID v4
    notes:    must belong to the authenticated user

Output:
  success:  HTTP 201 | { orderId, status: "PENDING", total, estimatedDelivery }
  failure — out of stock:     HTTP 409 | { code: "INSUFFICIENT_STOCK", productId }
  failure — invalid coupon:   HTTP 400 | { code: "INVALID_DISCOUNT_CODE" }
  failure — order limit:      HTTP 422 | { code: "ORDER_LIMIT_EXCEEDED", max: 10 }
```

#### Input Field Spec → Test Case Derivation

Once fields are specified, apply techniques mechanically:

```
For each input field:

  BVA  → test: min-1, min, min+1, max-1, max, max+1
  EP   → test: one value per valid partition, one per invalid partition
  Format → test: valid chars, invalid chars (e.g. spaces in displayName), empty string
  Required → test: field missing entirely vs. field present but empty
  Allowed values → test: each allowed value, one disallowed value

For outputs:
  success path   → assert status code + every field in response body
  each failure   → assert correct error code + meaningful message
                   assert NO sensitive data leaked in error (e.g. no password hash)
```

**BVA derivation example for displayName (min: 3, max: 50):**

| Test Value | Length | Expected Result |
|---|---|---|
| `""` | 0 | 400 — required field |
| `"ab"` | 2 | 400 — below minimum |
| `"abc"` | 3 | 201 — valid (min boundary) |
| `"abcd"` | 4 | 201 — valid (min+1) |
| `"a".repeat(49)` | 49 | 201 — valid (max-1) |
| `"a".repeat(50)` | 50 | 201 — valid (max boundary) |
| `"a".repeat(51)` | 51 | 400 — exceeds maximum |
| `"user name"` | 9 | 400 — invalid format (space) |
| `"user@name"` | 9 | 400 — invalid format (symbol) |
| `"User123"` | 7 | 201 — valid (mixed alphanum) |

---

### Step 2 — Design Test Scenarios

A **test scenario** is a high-level description of what to test (not yet how).

**Scenario categories to always cover:**

| Category | Examples |
|---|---|
| Functional (happy path) | Successfully complete the main flow |
| Alternate paths | Valid variations of the main flow |
| Boundary conditions | Min/max values, empty/full states |
| Negative / error handling | Invalid input, unauthorized access |
| Business rule enforcement | Discounts, limits, approvals |
| State transitions | Object lifecycle (created → active → closed) |
| Integration points | External service calls, DB writes |
| Security | Auth, authorization, injection |
| Performance | Load limits, timeout behavior |

**Scenario template:**
```
Scenario ID: SC-001
Feature: [Feature name]
Scenario: [What is being tested]
Precondition: [System state required before test]
Expected Outcome: [What should happen]
Priority: High / Medium / Low
Test Type: Functional / Boundary / Negative / Security
```

---

### Step 3 — Design Test Cases Using Test Design Techniques

Apply the right technique to each scenario.

#### Technique 1: Equivalence Partitioning (EP)
Divide input space into partitions where all values behave the same. Test one value per partition.

```
Field: User Age (must be 18–65)

Partitions:
  - Invalid low:   age < 18      → test with 17
  - Valid:         18 ≤ age ≤ 65 → test with 30
  - Invalid high:  age > 65      → test with 66
```

#### Technique 2: Boundary Value Analysis (BVA)
Test at and around the edges of each partition.

```
Field: Age boundaries (18–65)

Test values: 17, 18, 19, 64, 65, 66
```

#### Technique 3: Decision Table Testing
For features with multiple conditions producing different actions.

```
Discount Eligibility:
| Premium Member | Order > $100 | First Order | Discount Applied |
|----------------|--------------|-------------|------------------|
| Yes            | Yes          | -           | 20%              |
| Yes            | No           | -           | 10%              |
| No             | Yes          | Yes         | 15%              |
| No             | Yes          | No          | 5%               |
| No             | No           | -           | 0%               |
```

#### Technique 4: State Transition Testing
For objects with a defined lifecycle.

```
Order States: DRAFT → PENDING → CONFIRMED → SHIPPED → DELIVERED
                                    ↓
                                CANCELLED

Test cases:
  - DRAFT → PENDING (submit order)
  - PENDING → CONFIRMED (payment success)
  - PENDING → CANCELLED (payment failed)
  - CONFIRMED → CANCELLED (within cancellation window)
  - DELIVERED → CANCELLED (invalid — should fail)
```

#### Technique 5: Pairwise / Combinatorial Testing
When many input combinations exist, test all pairs at minimum (reduces cases from N! to O(N log N)).

Use pairwise tools: `allpairs`, `pict`, or online pairwise generators.

```
Inputs: Browser (Chrome, Firefox, Safari) × OS (Win, Mac, Linux) × Role (Admin, User)
Full combinations: 18 cases
Pairwise:          9 cases covering all 2-way interactions
```

#### Technique 6: Error Guessing
Based on experience and domain knowledge, guess likely failure points:
- NULL / undefined inputs
- Empty strings vs. whitespace-only strings
- Duplicate submissions (double-click)
- Concurrent access (race conditions)
- Expired tokens / sessions
- Special characters in text fields (`<script>`, `'; DROP TABLE`)

---

### Step 4 — Design Test Data

Test data should be designed with the business domain in mind.

#### Test Data Categories

| Category | Purpose | Example |
|---|---|---|
| Valid data | Happy path execution | Normal user, valid order |
| Boundary data | Edge of valid range | Min/max age, exactly at limit |
| Invalid data | Trigger validation errors | Negative price, invalid email |
| Special characters | Security & parsing | `<script>`, `O'Brien`, `日本語` |
| Null/empty | Null handling | Missing required fields |
| Large/long data | Overflow, truncation | 1000-char name, 10,000 items |
| Historical/stale | Time-based logic | Expired coupon, past due date |
| Domain-specific | Business rule testing | See domain examples below |

#### Domain-Specific Test Data Examples

**E-commerce / Orders:**
```
- orderId: ORD-000001 (minimum), ORD-999999 (maximum)
- amount: 0.01 (min), 9999.99 (below threshold), 10000.00 (approval threshold), 99999.99 (max)
- discountCode: VALID10, EXPIRED20, ALREADY_USED, NONEXISTENT
- paymentCard: 4111111111111111 (test Visa), 4000000000000002 (decline), 4000000000000069 (expired)
```

**User / Authentication:**
```
- email: valid@domain.com, invalid-email, a@b.c (min valid), 254-char email (max RFC)
- password: "P@ssw0rd" (valid), "short" (too short), 72-char (bcrypt boundary)
- username: "alice" (valid), "a" (too short), reserved words ("admin", "root")
- role: ADMIN, USER, GUEST, <nonexistent_role>
```

**Financial / Banking:**
```
- amount: 0.00 (zero), 0.01 (min), 1000000.00 (large), negative values
- accountNumber: valid IBAN, invalid checksum, closed account
- currency: USD, EUR, unsupported (XYZ)
- transactionDate: today, future date, 7 years ago (retention limit)
```

**Healthcare:**
```
- patientId: valid, non-existent, deactivated
- dateOfBirth: today (newborn), 120 years ago (max age), future date (invalid)
- dosage: within therapeutic range, below min effective, above toxic threshold
- medicationCode: valid ICD-10, invalid code, expired drug
```

**Dates & Time:**
```
- Feb 29 (leap year vs non-leap year)
- Dec 31 / Jan 1 (year boundary)
- DST transitions
- Timezone edge cases (UTC±14)
- Unix epoch: 0, 2147483647 (Y2K38 for 32-bit)
```

#### Test Data Management Rules
- Never use real customer PII in tests — use anonymized or synthetic data
- Store test data as fixtures close to test files
- Use factories/builders for complex object creation
- Tag data by environment: `dev`, `staging`, `perf`
- Document data dependencies (e.g., "requires existing user with PREMIUM role")

---

### Step 5 — Write Automation Tests

Map test cases to the right test level and automation approach.

---

## Test Levels & Automation Guide

### Level 1: Unit Tests
**What:** Single function, class, or module in isolation. All I/O mocked.
**When to automate:** Every business logic function, validator, transformer, utility.
**Speed:** < 1ms per test
**Tools:** Vitest, Jest (JS/TS), pytest (Python), JUnit (Java)

```typescript
// Example: Testing an order total calculation
describe('calculateOrderTotal', () => {
  it('applies percentage discount correctly', () => {
    const items = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }]
    const discount = { type: 'PERCENT', value: 10 }
    expect(calculateOrderTotal(items, discount)).toBe(225) // 250 - 10%
  })

  it('does not apply expired discount', () => {
    const discount = { type: 'PERCENT', value: 10, expiresAt: new Date('2020-01-01') }
    expect(() => calculateOrderTotal([], discount)).toThrow('Discount expired')
  })

  it('returns zero for empty cart', () => {
    expect(calculateOrderTotal([], null)).toBe(0)
  })
})
```

**Unit test checklist:**
- [ ] All branches covered (if/else, switch cases)
- [ ] All error/exception paths tested
- [ ] Boundary values included
- [ ] No real DB, HTTP, or filesystem calls

---

### Level 2: Component Tests (Backend)
**What:** A single service or module tested with its real dependencies (DB, cache) but no external HTTP calls.
**When to automate:** Service layer functions that interact with the database.
**Speed:** 100ms–1s per test
**Tools:** Vitest/Jest + real test DB (Docker), Testcontainers

```typescript
// Example: UserService component test with real DB
describe('UserService - createUser', () => {
  beforeEach(async () => {
    await db.user.deleteMany() // clean state
  })

  it('saves user with hashed password', async () => {
    const result = await userService.createUser({ email: 'a@b.com', password: 'secret' })
    const saved = await db.user.findUnique({ where: { id: result.id } })
    expect(saved.password).not.toBe('secret')
    expect(saved.password).toMatch(/^\$2[ab]\$/) // bcrypt hash
  })

  it('throws on duplicate email', async () => {
    await userService.createUser({ email: 'a@b.com', password: 'x' })
    await expect(userService.createUser({ email: 'a@b.com', password: 'y' }))
      .rejects.toThrow('Email already exists')
  })
})
```

---

### Level 3: API Tests
**What:** Full HTTP request/response cycle through one service (real DB, no external service calls).
**When to automate:** Every API endpoint — happy path, validation errors, auth checks.
**Speed:** 200ms–2s per test
**Tools:** Supertest (Node.js), REST Assured (Java), httpx/pytest (Python)

```typescript
// Example: API test for POST /orders
describe('POST /api/orders', () => {
  it('creates order and returns 201', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ items: [{ productId: 'P001', qty: 2 }] })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      id: expect.any(String),
      status: 'PENDING',
      total: expect.any(Number)
    })
  })

  it('returns 400 for empty items array', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ items: [] })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/items.*required/i)
  })

  it('returns 401 without auth token', async () => {
    const res = await request(app).post('/api/orders').send({ items: [] })
    expect(res.status).toBe(401)
  })
})
```

**API test checklist per endpoint:**
- [ ] Happy path with valid data → correct 2xx status + response shape
- [ ] Each required field missing → 400 with meaningful error
- [ ] Invalid field values → 400 with field-level error
- [ ] No auth token → 401
- [ ] Wrong role → 403
- [ ] Non-existent resource → 404
- [ ] Idempotency (for PUT/PATCH) — same call twice = same result

---

### Level 4: Integration Tests
**What:** Test interactions between two or more services or a service and an external system (DB, message queue, third-party API).
**When to automate:** Critical cross-service workflows, event-driven flows.
**Speed:** Seconds per test
**Tools:** Docker Compose for multi-service setup, Testcontainers

```typescript
// Example: Integration test — order creation triggers inventory reservation
describe('Order + Inventory integration', () => {
  it('reserves inventory when order is created', async () => {
    // Arrange
    await inventoryService.setStock('PROD-1', 10)
    
    // Act
    await orderService.createOrder({ items: [{ productId: 'PROD-1', qty: 3 }] })
    
    // Assert
    const stock = await inventoryService.getStock('PROD-1')
    expect(stock.available).toBe(7)
    expect(stock.reserved).toBe(3)
  })
})
```

---

### Level 5: Contract Tests
**What:** Verify that service A's API matches what service B expects. Consumer defines contract; provider verifies it.
**When to automate:** All inter-service API boundaries. Run on every PR that changes a shared API.
**Tools:** Pact.js, Spring Cloud Contract

```typescript
// Consumer (OrderService expects UserService to return this)
it('fetches user by id', async () => {
  await provider
    .given('user 123 exists')
    .uponReceiving('GET /users/123')
    .withRequest({ method: 'GET', path: '/users/123' })
    .willRespondWith({
      status: 200,
      body: {
        id: MatchersV3.string(),
        email: MatchersV3.email(),
        role: MatchersV3.string('USER')
      }
    })
    .executeTest(async (mock) => {
      const user = await fetchUser(mock.url, '123')
      expect(user.role).toBeDefined()
    })
})
```

---

### Level 6: Component Tests (Frontend)
**What:** Test a React/Vue/Angular component in isolation — rendered in a fake browser (jsdom or real browser), with mocked API calls.
**When to automate:** Every interactive UI component with logic — forms, tables, modals, state-driven UIs.
**Tools:** Vitest + React Testing Library, Storybook + Chromatic (visual)

```typescript
// Example: Testing a checkout form component
describe('CheckoutForm', () => {
  it('disables submit when cart is empty', () => {
    render()
    expect(screen.getByRole('button', { name: /place order/i })).toBeDisabled()
  })

  it('shows validation error for missing email', async () => {
    render()
    await userEvent.click(screen.getByRole('button', { name: /place order/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with correct payload', async () => {
    const onSubmit = vi.fn()
    render()
    await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com')
    await userEvent.click(screen.getByRole('button', { name: /place order/i }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: 'user@test.com' }))
  })
})
```

**Frontend component test checklist:**
- [ ] Component renders without crashing (smoke)
- [ ] Props variations (empty, minimal, full data)
- [ ] User interactions: click, type, select, drag
- [ ] Loading state displayed during async operations
- [ ] Error state displayed on failure
- [ ] Accessibility: keyboard nav, ARIA roles, focus management

---

### Level 7: E2E Tests
**What:** Full user journey across the real, fully deployed system (all services running).
**When to automate:** Critical business flows only. Keep this layer small.
**Speed:** Seconds to minutes per test
**Tools:** Playwright (recommended), Cypress

```typescript
// Example: E2E test for complete checkout flow
test('user can complete checkout', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name=email]', 'buyer@test.com')
  await page.fill('[name=password]', 'Password123!')
  await page.click('button[type=submit]')

  // Add to cart
  await page.goto('/products/widget-pro')
  await page.click('[data-testid=add-to-cart]')
  await expect(page.locator('[data-testid=cart-count]')).toHaveText('1')

  // Checkout
  await page.goto('/checkout')
  await page.fill('[name=cardNumber]', '4111111111111111')
  await page.fill('[name=expiry]', '12/26')
  await page.fill('[name=cvv]', '123')
  await page.click('[data-testid=place-order]')

  // Assert confirmation
  await expect(page).toHaveURL(/\/orders\/\w+\/confirmation/)
  await expect(page.locator('h1')).toContainText('Order Confirmed')
})
```

**E2E principles:**
- Test only the **critical path** — registration, login, purchase, key workflows
- Use **dedicated test accounts** and **seed data scripts**
- Add `data-testid` attributes on key elements (don't test by CSS class)
- Run against a **stable staging environment**, not production
- Keep the E2E suite under 30 minutes total runtime

---

## Test Level Selection Guide

```
Question: What level should I write this test at?

Is it a pure function / calculation / validator?
  → Unit Test

Does it need a database but no HTTP?
  → Component Test (Backend)

Is it a single HTTP endpoint end-to-end through one service?
  → API Test

Does it cross a service boundary (two services talking)?
  → Contract Test + Integration Test

Is it a UI component with logic?
  → Frontend Component Test

Is it a full user journey through the deployed system?
  → E2E Test
```

**Coverage targets by level:**

| Level | Target Coverage |
|---|---|
| Unit | 100% of business logic |
| API | 100% of endpoints × key scenarios |
| Contract | 100% of inter-service APIs |
| Frontend Component | 100% of interactive components |
| Integration | Critical cross-service flows |
| E2E | Top 5–10 user journeys only |

---

## Test Case Template

```
TC-ID:      [Feature code]-[sequence, e.g. TC-ORD-001]
Title:      [Short description of what is being tested]
Level:      Unit / Component / API / Contract / Frontend / E2E
Priority:   P1 (blocker) / P2 (major) / P3 (minor)
Technique:  EP / BVA / State Transition / Decision Table / Error Guessing

Preconditions:
  - [System state, user role, seed data required]

Test Steps:
  1. [Action]
  2. [Action]
  ...

Test Data:
  - input_field_1: [value and why this value was chosen]
  - input_field_2: [value]

Expected Result:
  - [Exact expected behavior / response / state change]

Automation Target: Yes / No / Later
Automation File: [path/to/test/file.test.ts]
```

---

## Automation Code Quality Standards

- **Arrange-Act-Assert (AAA)**: Every test has clear setup, execution, and assertion sections
- **One assertion concept per test**: Test one behavior per `it()` block
- **Descriptive names**: `it('returns 404 when user does not exist')` not `it('test user')`
- **No test interdependency**: Each test can run in isolation in any order
- **Fast feedback**: Prefer lower-level tests; avoid E2E for anything testable at unit/API level
- **Stable selectors**: Use `data-testid`, ARIA roles, or text — never CSS classes for E2E
- **CI integration**: All tests run on every PR; E2E on merge to main
- **Test coverage gates**: Block PR merge if coverage drops below threshold

---

## Quick Reference: Technique → Scenario Mapping

| Scenario Type | Recommended Technique(s) |
|---|---|
| Input fields with ranges | BVA + EP |
| Multiple conditions → single outcome | Decision Table |
| Object lifecycle / state machine | State Transition |
| Multi-variable feature flags | Pairwise |
| Auth / security checks | Error Guessing |
| API response shapes | Contract Testing |
| UI interactions | Frontend Component + E2E |
| Business rule enforcement | Decision Table + Error Guessing |