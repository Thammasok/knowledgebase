---
name: software-tester-design
description: >
  Use this skill whenever the user needs to DESIGN tests — before writing any code.
  Covers: defining the System Under Test (SUT), mapping business flows, specifying
  input/output fields per action, designing test scenarios, applying test design
  techniques (EP, BVA, Decision Tables, State Transition, Pairwise, Error Guessing),
  and producing structured test cases with test data.
  Trigger when the user mentions: test design, test planning, test scenarios, test cases,
  test strategy, SUT, system under test, business flow, acceptance criteria, test data design,
  QA planning, shift-left, BDD, TDD, "what should I test", "design tests for", "create test
  cases for", "what are the test cases for", or when describing a feature/user story and
  asking what to test.
  Output of this skill feeds directly into the software-tester-automation skill.
  Always use this skill BEFORE writing any automation code — design first, automate second.
---

> **Artifact Reference:** All artifacts produced by this skill MUST follow the templates and storage locations defined in [`.opencode/artifacts/ARTIFACTS.md`](../../artifacts/ARTIFACTS.md). Store outputs in `docs/test-design/`.

# Software Tester — Test Design Skill

## Role & Responsibility

This skill covers **everything before writing automation code**:

```
[software-tester-design]              →     [software-tester-automation]
──────────────────────────                  ──────────────────────────────
Step 0: Define SUT                          Receives TC output from this skill
Step 1: Map Business Flow                   Translates TCs into runnable scripts
Step 1b: Input/Output Field Specs           per test level (Unit, API, Component, E2E)
Step 2: Design Test Scenarios
Step 3: Design Test Cases (techniques)
Step 4: Design Test Data
         ↓
  OUTPUT: Structured Test Cases (TC-xxx)
```

---

## Core Philosophy: Shift-Left Testing

**Shift-left** means moving testing as early as possible — before code is written, not after.

```
Traditional:   Requirements → Design → Code → [TEST] → Deploy
Shift-Left:  [TEST THINKING] → Requirements → [DESIGN TCs] → Code → [AUTOMATE] → Deploy
```

**Key practices:**

- Map business flows and define field specs _before_ implementation starts
- Derive test cases directly from acceptance criteria and domain rules
- Design test data alongside schema/domain modeling
- Tag every test case with its target automation level

---

## Step-by-Step Test Design Workflow

---

### Step 0 — Define the System Under Test (SUT)

Document **what system you are testing** before any scenario work. The SUT definition determines which test levels apply, what must be mocked, where service boundaries are, and what can run where.

#### SUT Definition Template

```
System Name:    [e.g. "E-Commerce Platform", "Auth Service"]
Version:        [e.g. v2.3.1 or sprint context]
Description:    [1-2 sentences — what it does and who uses it]

─────────────────────────────────────────────
ARCHITECTURE
─────────────────────────────────────────────
Architecture Style:
  [ ] Monolith       [ ] Microservices     [ ] Modular Monolith
  [ ] Serverless     [ ] Event-Driven      [ ] BFF + Services

Components:
  Name              | Type            | Responsibility
  ──────────────────|─────────────────|─────────────────────────────
  [component-name]  | Frontend        | [e.g. Customer-facing web UI]
  [component-name]  | Backend Service | [e.g. Handles order lifecycle]
  [component-name]  | Background Job  | [e.g. Sends email notifications]
  [component-name]  | Database        | [e.g. Stores user and order data]
  [component-name]  | Message Queue   | [e.g. Order events pub/sub]
  [component-name]  | Cache           | [e.g. Session and product cache]

Communication:
  [ ] REST API   [ ] GraphQL   [ ] gRPC   [ ] Message Queue   [ ] WebSocket
  Detail: [e.g. "REST between services; async events via RabbitMQ"]

─────────────────────────────────────────────
TECH STACK
─────────────────────────────────────────────
Frontend:   [e.g. React 18 / Next.js 14, Tailwind CSS, React Query]
Backend:    [e.g. Node.js 20, Express 4, Prisma + PostgreSQL 15]
Auth:       [e.g. JWT (15min) + Refresh Token (7d), HttpOnly cookies]
Cache:      [e.g. Redis 7]
Queue:      [e.g. RabbitMQ, Kafka, BullMQ]
Infra:      [e.g. Docker + K8s, Vercel + Railway, GitHub Actions]

─────────────────────────────────────────────
EXTERNAL DEPENDENCIES & INTEGRATION POINTS
─────────────────────────────────────────────
  Name               | Type              | Test Approach
  ───────────────────|───────────────────|───────────────────────────────
  [e.g. Stripe]      | Payment Gateway   | Mock in unit/API; sandbox in E2E
  [e.g. SendGrid]    | Email Service     | Mock in all automated tests
  [e.g. Google OAuth]| Auth Provider     | Mock token; real login in E2E only
  [e.g. AWS S3]      | File Storage      | Localstack in integration tests

─────────────────────────────────────────────
DATA STORES
─────────────────────────────────────────────
  Name             | Type       | Owned By        | Shared?
  ─────────────────|────────────|─────────────────|────────
  [e.g. user_db]   | PostgreSQL | User Service    | No
  [e.g. order_db]  | PostgreSQL | Order Service   | No
  [e.g. cache]     | Redis      | API Gateway     | Read-only for others

Rule: Never share a database between services — even in tests.

─────────────────────────────────────────────
ENVIRONMENTS
─────────────────────────────────────────────
  Environment | Purpose                   | Test Types Allowed
  ────────────|───────────────────────────|──────────────────────────────────
  local       | Developer machine         | Unit, Component, API
  dev         | Shared integration        | Unit, Component, API, Integration
  staging     | Pre-production mirror     | All types including E2E
  production  | Live system               | Smoke tests only (read-only)

─────────────────────────────────────────────
TEST SCOPE BOUNDARIES
─────────────────────────────────────────────
In scope:
  - [Components and flows covered by this test effort]

Out of scope:
  - [Third-party systems tested by their own suites]
  - [Legacy components not under active development]
  - [Infrastructure / DevOps concerns outside app layer]

─────────────────────────────────────────────
TEST LEVEL APPLICABILITY
─────────────────────────────────────────────
  Level               | Applicable? | Owner        | Trigger
  ────────────────────|─────────────|──────────────|──────────────────
  Unit                | Yes/No      | Developer    | Every commit
  Component (Backend) | Yes/No      | Developer    | Every commit
  API                 | Yes/No      | Dev / QA     | Every PR
  Contract            | Yes/No      | QA           | Every PR (shared APIs)
  Integration         | Yes/No      | QA           | Merge to main
  Frontend Component  | Yes/No      | Developer    | Every PR
  E2E                 | Yes/No      | QA           | Merge to main / nightly
```

#### How SUT Drives Test Design

| SUT Element                       | What It Drives                                             |
| --------------------------------- | ---------------------------------------------------------- |
| Microservices architecture        | Contract tests at every service boundary                   |
| External dependency (e.g. Stripe) | Mock strategy + mock contract definition                   |
| Shared cache (Redis)              | Cache invalidation tests; concurrency edge cases           |
| Message queue (RabbitMQ)          | Event-driven integration tests; consumer tests             |
| Multiple DB owners                | No cross-service DB access; isolated test DBs per service  |
| Environment matrix                | Which test types run where and who triggers them           |
| Out-of-scope components           | Prevents scope creep; avoids duplicating other teams' work |

---

### Step 1 — Understand the Business Flow

Map the domain **before** writing scenarios.

1. **Identify the feature/user story** — What problem does it solve? Who uses it?
2. **Map the happy path** — Primary flow when everything works
3. **Identify alternate flows** — Valid but non-primary paths (different roles, optional inputs)
4. **Identify exception flows** — Error conditions, invalid inputs, edge states
5. **List business rules** — Domain constraints (e.g. "orders over $10,000 require approval")
6. **Understand domain entities** — Key objects, their states, and lifecycle transitions

**Output: Business Flow Map**

```
Feature: [Feature name]

Happy Path:
  [Step 1] → [Step 2] → [Step 3] → [Output]

Alternate Flows:
  - [Valid variation A]
  - [Valid variation B]

Exception Flows:
  - [Error condition A]
  - [Error condition B]

Business Rules:
  - [Rule 1]
  - [Rule 2]
```

---

### Step 1b — Define Input & Output Fields Per Action

For **every action** in the flow, specify input field constraints and expected outputs. This is the direct source for BVA, EP, and test data.

#### Field Specification Format

```
Action: [e.g. "User submits registration form"]

Input Fields:
  field_name:
    type:     string | number | boolean | date | enum | file
    required: yes | no
    min:      [min value or min character length]
    max:      [max value or max character length]
    format:   [allowed characters, pattern, or regex]
    allowed:  [explicit list of valid values — for enums or whitelists]
    notes:    [business rule or domain constraint]

Output:
  success:          [HTTP status + response body shape, or UI state change]
  failure — [case]: [HTTP status + error code + message shape]
```

#### Example: User Registration

```
Action: User submits registration form

Input Fields:
  displayName:
    type:     string
    required: yes
    min:      3 characters
    max:      50 characters
    format:   letters (a-zA-Z), digits (0-9) — no spaces or symbols
    notes:    must be unique across all users

  email:
    type:     string
    required: yes
    min:      10 characters
    max:      50 characters
    format:   valid RFC email (local@domain)
    allowed:  public (@gmail.com, @hotmail.com, @yahoo.com)
              OR company domain (@company.com)
    notes:    domain must be in approved whitelist; must be unique

  password:
    type:     string
    required: yes
    min:      10 characters
    max:      64 characters
    format:   letters (a-zA-Z), digits (0-9), symbols (!@#$%^&*()_+)
    notes:    must contain at least 1 uppercase, 1 digit, 1 symbol

Output:
  success:              HTTP 201 | { userId, displayName, email, createdAt }
                        UI: redirect to /dashboard with welcome message
  failure — validation: HTTP 400 | { field, code, message } per failing field
                        UI: inline error below field; form stays populated
  failure — duplicate:  HTTP 409 | { code: "EMAIL_ALREADY_EXISTS" }
```

#### Field Spec → Test Case Derivation Rules

```
For each input field:
  BVA (range)      → min-1, min, min+1  ...  max-1, max, max+1
  EP (partitions)  → one value per valid partition, one per invalid partition
  Format           → valid chars sample | invalid chars | empty "" | whitespace-only
  Required         → field missing entirely vs. field present but empty ("")
  Allowed list     → each allowed value (one TC each) + one disallowed value

For outputs:
  success path     → assert status code + every field in response body shape
  each failure     → assert correct error code + human-readable message
                     assert NO sensitive data leaked (e.g. no password hash in error)
```

**BVA table — displayName (min: 3, max: 50):**

| Test Value       | Length | Expected                      |
| ---------------- | ------ | ----------------------------- |
| `""`             | 0      | 400 — required                |
| `"ab"`           | 2      | 400 — below min               |
| `"abc"`          | 3      | 201 — valid (min boundary)    |
| `"abcd"`         | 4      | 201 — valid (min+1)           |
| `"a".repeat(49)` | 49     | 201 — valid (max-1)           |
| `"a".repeat(50)` | 50     | 201 — valid (max boundary)    |
| `"a".repeat(51)` | 51     | 400 — exceeds max             |
| `"user name"`    | 9      | 400 — invalid format (space)  |
| `"user@name"`    | 9      | 400 — invalid format (symbol) |
| `"User123"`      | 7      | 201 — valid (mixed alphanum)  |

---

### Step 2 — Design Test Scenarios

A **test scenario** is a high-level description of _what_ to test (not yet _how_).

**Always cover these categories:**

| Category                  | Examples                                            |
| ------------------------- | --------------------------------------------------- |
| Functional (happy path)   | Successfully complete the main flow                 |
| Alternate paths           | Valid variations (different roles, optional inputs) |
| Boundary conditions       | Min/max values, empty/full states                   |
| Negative / error handling | Invalid input, unauthorized access                  |
| Business rule enforcement | Discounts, limits, approvals, quotas                |
| State transitions         | Object lifecycle (created → active → closed)        |
| Integration points        | External service calls, DB writes, events           |
| Security                  | Auth bypass, authorization, injection               |
| Performance edge          | Timeout behavior, max payload size                  |

**Scenario template:**

```
Scenario ID:   SC-[FEATURE]-[SEQ]
Feature:       [Feature name]
Scenario:      [What is being tested — one sentence]
Precondition:  [System state required before this scenario runs]
Expected:      [What should happen]
Priority:      High / Medium / Low
Type:          Functional | Boundary | Negative | Security | State
```

---

### Step 3 — Design Test Cases Using Test Design Techniques

#### Technique 1: Equivalence Partitioning (EP)

Divide input into partitions where all values behave identically. Test one representative per partition.

```
Field: User Age (valid: 18–65)
  Invalid low:   age < 18       → test: 17
  Valid:         18 ≤ age ≤ 65  → test: 30
  Invalid high:  age > 65       → test: 66
```

#### Technique 2: Boundary Value Analysis (BVA)

Test at and just beyond each boundary.

```
Field: Age (18–65)  →  test values: 17, 18, 19, 64, 65, 66
```

#### Technique 3: Decision Table Testing

For multiple conditions producing different outputs.

```
| Premium Member | Order > $100 | First Order | Discount |
|----------------|--------------|-------------|----------|
| Yes            | Yes          | —           | 20%      |
| Yes            | No           | —           | 10%      |
| No             | Yes          | Yes         | 15%      |
| No             | Yes          | No          | 5%       |
| No             | No           | —           | 0%       |
```

#### Technique 4: State Transition Testing

For objects with a defined lifecycle. Test valid transitions and invalid ones (must be rejected).

```
Order: DRAFT → PENDING → CONFIRMED → SHIPPED → DELIVERED
                               ↓
                           CANCELLED

Valid:   PENDING → CONFIRMED (payment success)
Valid:   CONFIRMED → CANCELLED (within window)
Invalid: DELIVERED → CANCELLED  ← must return error
```

#### Technique 5: Pairwise / Combinatorial Testing

Cover all 2-way variable combinations instead of exhaustive N-way.

```
Browser × OS × Role  →  18 full combinations  →  9 pairwise cases
Tools: allpairs, pict, pairwise.teremokgames.com
```

#### Technique 6: Error Guessing

Target likely failure points from domain experience:

- `null` / `undefined`, empty string `""`, whitespace-only `"   "`
- Duplicate submissions (double-click, double POST)
- Expired or revoked tokens / sessions
- Special chars: `<script>alert(1)</script>`, `'; DROP TABLE users;--`, `O'Brien`
- Oversized payloads, deeply nested JSON

---

### Step 4 — Design Test Data

#### Test Data Categories

| Category           | Purpose                    | Example                          |
| ------------------ | -------------------------- | -------------------------------- |
| Valid / happy path | Confirms main flow works   | Normal user, valid order         |
| Boundary           | Exercises min/max edges    | 3-char name, 64-char password    |
| Invalid            | Triggers validation errors | Negative price, malformed email  |
| Special characters | Security and parsing       | `O'Brien`, `<script>`, `日本語`  |
| Null / empty       | Null handling              | Missing required fields          |
| Oversized          | Overflow / truncation      | 1000-char name, 10,000-item list |
| Stale / expired    | Time-based logic           | Expired coupon, past-due date    |
| Domain-specific    | Business rule coverage     | See domain examples below        |

#### Domain-Specific Test Data Reference

**User / Auth:**

```
email:        valid@domain.com | invalid-no-at | a@b.c (too short) | unknown@domain.xyz
password:     ValidPass1! (valid) | short1! (too short) | "a".repeat(64) (max) | nouppercase1!
displayName:  abc (min) | "a".repeat(50) (max) | ab (below min) | "user name" (space — invalid)
role:         ADMIN | USER | GUEST | NONEXISTENT_ROLE
```

**E-Commerce / Orders:**

```
amount:       0.01 (min) | 9999.99 (below threshold) | 10000.00 (approval boundary) | -0.01 (invalid)
discountCode: VALID10 | EXPIRED20 | ALREADY_USED | NONEXISTENT | "" (empty — optional field)
quantity:     1 (min) | 99 (max) | 0 (invalid) | 100 (above max) | stock+1 (exceeds stock)
productId:    valid UUID | malformed string | non-existent UUID | deactivated product UUID
```

**Dates & Time:**

```
Feb 29 on leap year vs non-leap year
Dec 31 / Jan 1 (year rollover)
DST transition dates
Timezone boundaries (UTC+14, UTC-12)
Unix epoch: 0 | 2147483647 (Y2K38 boundary on 32-bit systems)
```

#### Test Data Rules

- Never use real customer PII — use anonymized or synthetic data
- Store fixtures close to tests (e.g. `__fixtures__/user.ts`)
- Use factory/builder patterns for complex object creation
- Tag data by environment: `dev`, `staging`, `perf`
- Document dependencies: (e.g. "requires existing user with PREMIUM role")

---

## Test Case Output Template (Input Contract for Automation Skill)

Every test case produced by this skill uses this format exactly.
The **software-tester-automation** skill reads this as its input.

```
TC-ID:         TC-[FEATURE]-[SEQ]        e.g. TC-AUTH-001
Title:         [One clear sentence — what is being tested]
Feature:       [Feature name]
Level:         Unit | Component | API | Frontend | E2E
Priority:      P1 (blocker) | P2 (major) | P3 (minor)
Technique:     EP | BVA | State Transition | Decision Table | Pairwise | Error Guessing

SUT Reference:
  Component:   [Which SUT component owns this test, from Step 0]
  Action:      [Which action from Step 1b this TC covers]

Preconditions:
  - [User role / auth state required]
  - [Required seed data or system state]
  - [Environment: local | dev | staging]

Input:
  [field_name]: [test value]   # [why — e.g. "max boundary = 50 chars"]
  [field_name]: [test value]

Steps:
  1. [Action]
  2. [Action]

Expected Output:
  Status:       [HTTP status or UI state]
  Response:     [Exact fields and values in response body]
  Side effects: [DB state change, event emitted, email sent, etc.]

Test Data Notes:
  - [Fixture file, factory call, or setup script reference]

Automation:
  Target file:  [e.g. src/tests/auth/register.api.test.ts]
  Mock needed:  [e.g. "mock SendGrid — email must not actually send"]
```

---

## Quick Reference

**Technique → Scenario Type:**

| Scenario Type                     | Technique                       |
| --------------------------------- | ------------------------------- |
| Input with numeric range          | BVA + EP                        |
| Input with character/format rules | EP + Error Guessing             |
| Multiple conditions → one outcome | Decision Table                  |
| Object with lifecycle states      | State Transition                |
| Many independent variables        | Pairwise                        |
| Auth / security / edge cases      | Error Guessing                  |
| Business rule enforcement         | Decision Table + Error Guessing |

**Coverage checklist per action:**

- [ ] Happy path with fully valid data
- [ ] Each required field — missing entirely
- [ ] Each required field — present but empty `""`
- [ ] Min boundary (BVA)
- [ ] Max boundary (BVA)
- [ ] Invalid format (EP)
- [ ] Each business rule that can be violated
- [ ] Each distinct failure output in the spec
- [ ] No sensitive data leaked in error responses
