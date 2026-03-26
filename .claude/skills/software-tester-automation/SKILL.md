---
name: software-tester-automation
description: >
  Use this skill whenever the user needs to WRITE automation test scripts — converting
  test cases into runnable code. Covers all test levels: Unit, Component (Backend),
  Integration, API, Frontend Component, and E2E (Playwright/Cypress). Reads structured
  test cases produced by the software-tester-design skill as its input contract.
  For Integration tests, supports SUT configuration via service URL: point to
  http://localhost:8089 to route through WireMock (API mock/stub server), or to the real
  domain to hit sandbox endpoints — no code changes needed, only the URL differs.
  Also supports infrastructure emulators as the SUT: LocalStack (AWS services),
  Google PubSub Emulator, Firebase Emulator, and similar local emulators configured
  via their respective service URL env vars.
  Supports IS_API_TESTING=true flag to enable or disable API-level assertions and
  integration with real or emulated external services during test runs.
  Trigger when the user mentions: write test code, automate tests, test script, unit test,
  API test, integration test, component test, E2E test, Playwright, Cypress, Vitest, Jest,
  React Testing Library, Supertest, WireMock, LocalStack, PubSub emulator, IS_API_TESTING,
  "convert test cases to code", "write automation for", "implement tests for",
  "add tests to", or provides a TC-xxx test case and asks to automate it.
  Always check if test cases from software-tester-design exist before writing scripts.
  If no TCs exist yet, ask the user to run the design skill first or provide TC details.
---

> **Artifact Reference:** All artifacts consumed by this skill MUST follow the templates defined in [`.opencode/artifacts/ARTIFACTS.md`](../../artifacts/ARTIFACTS.md). Read test cases from `docs/test-design/`; write test code to `src/__tests__/` and `e2e/`.

# Software Tester — Automation Skill

## Role & Responsibility

This skill takes **structured test cases as input** and produces **runnable automation code**.

```
[software-tester-design]              →     [software-tester-automation]
──────────────────────────                  ──────────────────────────────
Produces: TC-xxx test cases                 INPUT: TC-xxx test cases
  with Level, Input, Expected Output,         reads: Level, Component, Action,
  SUT Reference, Mock needed,                        Input, Expected Output,
  Automation target file                             Mock needed, Target file
                                            OUTPUT: Runnable test scripts
                                              per level: Unit | Component |
                                              API | Frontend Component | E2E
```

---

## Input Contract — Reading a Test Case

Before writing any code, locate and parse the TC fields:

```
TC-ID:         → becomes the test name / describe block label
Level:         → determines which template and tools to use
Component:     → determines which service/module the test lives in
Input:         → becomes test data values in Arrange section
Expected Output→ becomes assertions in Assert section
Preconditions: → becomes beforeEach / test setup
Mock needed:   → becomes vi.mock() / jest.mock() declarations
Target file:   → the file to write the test into
```

**If a TC is missing Level, Component, or Expected Output — ask for clarification before coding.**

---

## Automation Code Standards (All Levels)

- **Arrange – Act – Assert (AAA)**: Every test has three clearly separated sections
- **One behavior per test**: Single `it()` = single assertion concept
- **TC-linked test names**: Always include the TC ID and describe the behavior in plain human language — `it('[TC-AUTH-010] registering with an email that already exists is rejected with a conflict error')` not `it('returns 409 when email already exists')` or `it('test register')`
- **No test interdependency**: Each test runs in isolation, in any order
- **Prefer lower levels**: If testable at unit level, don't write an E2E for it
- **Clean state**: Each test starts from a known, clean state — use `beforeEach` resets
- **No hardcoded environment values**: Use env vars or config for base URLs, credentials

---

## System Under Test (SUT) Configuration

Before writing any integration test, decide **how the external dependency will be provided**. There are three strategies, chosen based on what is available:

```
Do we have an API doc / contract from the 3rd party?
  YES → Option 1: WireMock  (stub HTTP responses from the spec)

No API doc — is there an emulator for the service (AWS, GCP, etc.)?
  YES → Option 2: Emulator  (LocalStack, PubSub Emulator, etc. via Docker)

No API doc and no emulator available?
  YES → Option 3: IS_API_TESTING flag  (skip or gate tests that need the real service)
```

---

### Option 1 — WireMock (when you have an API contract)

**Use when:** A 3rd-party gives you their API documentation or OpenAPI spec. You know the request shape and expected responses, so you can stub them precisely.

The URL itself is the configuration — no separate mode flag. Point the service URL at WireMock to stub calls; point it at the real domain to hit sandbox. Tests need no branching logic.

```
# .env.test  (local / CI — WireMock stubs)
PAYMENT_API_URL=http://localhost:8089

# .env.staging  (pre-release — real sandbox)
PAYMENT_API_URL=https://api.sandbox.stripe.com
```

The stub helpers auto-detect from the URL. If the URL is not localhost, `stubPost` and `resetStubs` are no-ops — the test simply hits the real endpoint.

```typescript
// src/tests/helpers/wiremock.helper.ts
const WIREMOCK_ADMIN = 'http://localhost:8089/__admin'

function isWireMock(serviceUrl: string) {
  return serviceUrl.startsWith('http://localhost')
}

export async function stubPost(
  serviceUrl: string,
  urlPath: string,
  responseBody: object,
  statusCode = 200,
) {
  if (!isWireMock(serviceUrl)) return // real API — skip stub registration
  await fetch(`${WIREMOCK_ADMIN}/mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      request: { method: 'POST', url: urlPath },
      response: {
        status: statusCode,
        jsonBody: responseBody,
        headers: { 'Content-Type': 'application/json' },
      },
    }),
  })
}

export async function resetStubs(serviceUrl: string) {
  if (!isWireMock(serviceUrl)) return
  await fetch(`${WIREMOCK_ADMIN}/mappings/reset`, { method: 'POST' })
}
```

**WireMock Docker setup:**

```bash
docker pull wiremock/wiremock:latest
```

```typescript
// src/tests/setup/wiremock.setup.ts
import { execSync, spawn } from 'child_process'

export async function startWireMock() {
  spawn('docker', ['run', '--rm', '-p', '8089:8080', '--name', 'wiremock-test', 'wiremock/wiremock:latest'])
  await waitForReady()
}

export async function stopWireMock() {
  execSync('docker stop wiremock-test', { stdio: 'ignore' })
}

async function waitForReady(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try { await fetch('http://localhost:8089/__admin/health'); return }
    catch { await new Promise(r => setTimeout(r, 300)) }
  }
  throw new Error('WireMock did not start on port 8089')
}
```

**Using WireMock in a test:**

```typescript
// src/payment/__tests__/payment.integration.test.ts
import { stubPost, resetStubs } from '../../tests/helpers/wiremock.helper'

const PAYMENT_URL = process.env.PAYMENT_API_URL! // http://localhost:8089 or real URL

beforeEach(async () => {
  await resetStubs(PAYMENT_URL)
  await stubPost(PAYMENT_URL, '/v1/charges', { id: 'ch_test_123', status: 'succeeded' })
})

it('[TC-PAY-001] a valid payment request is charged and returns a confirmation', async () => {
  const result = await PaymentService.charge({ amount: 1000, currency: 'USD' })
  expect(result.status).toBe('succeeded')
})
```

No `if` branches in tests. Change the URL in `.env` to switch between WireMock and sandbox.

---

### Option 2 — Emulator (when there is no HTTP API to stub)

**Use when:** The dependency is a cloud infrastructure service (message queue, object storage, database, etc.) that has no REST API you can stub — but an official local emulator exists. The emulator runs in Docker and behaves like the real service.

| Service                  | Emulator                          | Docker image                          | Default URL / port          |
| ------------------------ | --------------------------------- | ------------------------------------- | --------------------------- |
| AWS SQS / S3 / SNS / ... | LocalStack                        | `localstack/localstack`               | `http://localhost:4566`     |
| Google Cloud PubSub      | Google PubSub Emulator            | `gcr.io/google.com/cloudsdktool/cloud-sdk` | `localhost:8085`       |
| Firebase (Firestore, Auth, ...) | Firebase Emulator Suite    | `andreysenov/firebase-tools`          | `http://localhost:4000`     |
| Azure Service Bus        | Azure Service Bus Emulator        | `mcr.microsoft.com/azure-messaging/servicebus-emulator` | `localhost:5672` |

**Setup pattern — same as WireMock but for the emulator:**

Set the service SDK endpoint URL to the emulator's localhost address via env var. The SDK connects to the emulator instead of the real cloud.

```
# .env.test
AWS_ENDPOINT_URL=http://localhost:4566
PUBSUB_EMULATOR_HOST=localhost:8085
```

```typescript
// src/tests/setup/emulators.setup.ts
import { execSync, spawn } from 'child_process'

export async function startLocalStack() {
  spawn('docker', ['run', '--rm', '-p', '4566:4566', '--name', 'localstack-test', 'localstack/localstack'])
  await waitForUrl('http://localhost:4566/_localstack/health')
}

export async function startPubSubEmulator() {
  spawn('docker', [
    'run', '--rm', '-p', '8085:8085', '--name', 'pubsub-emulator',
    'gcr.io/google.com/cloudsdktool/cloud-sdk',
    'gcloud', 'beta', 'emulators', 'pubsub', 'start', '--host-port=0.0.0.0:8085',
  ])
  await waitForUrl('http://localhost:8085')
}

export async function stopEmulator(name: string) {
  execSync(`docker stop ${name}`, { stdio: 'ignore' })
}

async function waitForUrl(url: string, retries = 20) {
  for (let i = 0; i < retries; i++) {
    try { await fetch(url); return }
    catch { await new Promise(r => setTimeout(r, 500)) }
  }
  throw new Error(`Emulator did not start at ${url}`)
}
```

```typescript
// src/tests/setup/integration.global.setup.ts
import { startWireMock, stopWireMock } from './wiremock.setup'
import { startLocalStack, startPubSubEmulator, stopEmulator } from './emulators.setup'

const PAYMENT_URL   = process.env.PAYMENT_API_URL ?? ''
const AWS_URL       = process.env.AWS_ENDPOINT_URL ?? ''
const PUBSUB_HOST   = process.env.PUBSUB_EMULATOR_HOST ?? ''

export async function setup() {
  if (PAYMENT_URL.startsWith('http://localhost:8089')) await startWireMock()
  if (AWS_URL.startsWith('http://localhost:4566'))     await startLocalStack()
  if (PUBSUB_HOST.startsWith('localhost:8085'))        await startPubSubEmulator()
}

export async function teardown() {
  if (PAYMENT_URL.startsWith('http://localhost:8089')) await stopWireMock()
  if (AWS_URL.startsWith('http://localhost:4566'))     await stopEmulator('localstack-test')
  if (PUBSUB_HOST.startsWith('localhost:8085'))        await stopEmulator('pubsub-emulator')
}
```

**Using an emulator in a test (LocalStack SQS example):**

```typescript
// src/notifications/__tests__/queue.integration.test.ts
import { SQSClient, SendMessageCommand, ReceiveMessageCommand } from '@aws-sdk/client-sqs'

// SDK picks up AWS_ENDPOINT_URL from env — points to LocalStack when set to localhost
const sqs = new SQSClient({ region: 'us-east-1' })
const QUEUE_URL = process.env.SQS_QUEUE_URL!

it('[TC-NOTIFY-INT-001] publishing an order event places a message on the queue for the notification service to consume', async () => {
  // Act
  await OrderService.placeOrder({ id: 'order-1' }) // internally publishes to SQS

  // Assert — read from the emulated queue
  const response = await sqs.send(new ReceiveMessageCommand({ QueueUrl: QUEUE_URL, MaxNumberOfMessages: 1 }))
  expect(response.Messages).toHaveLength(1)
  expect(JSON.parse(response.Messages![0].Body!)).toMatchObject({ orderId: 'order-1', event: 'ORDER_PLACED' })
})
```

---

### Option 3 — IS_API_TESTING Flag (when no mock or emulator is available)

**Use when:** There is no API doc to stub (Option 1) and no emulator for the service (Option 2). The only way to test is to call the real external service. Gate these tests behind `IS_API_TESTING=true` so they are skipped in CI and local development by default and only run in a controlled environment where the real service is reachable.

```
# .env.test (default — skip API-dependent tests)
IS_API_TESTING=false

# .env.integration (run only when real service is reachable)
IS_API_TESTING=true
LEGACY_PAYMENT_API_URL=https://partner-internal.legacy-bank.com/api
LEGACY_PAYMENT_API_KEY=xxx
```

```typescript
// src/tests/helpers/api-testing.helper.ts
export const IS_API_TESTING = process.env.IS_API_TESTING === 'true'

/**
 * Skips the test when IS_API_TESTING is false.
 * Use for tests that call a real external service with no mock or emulator available.
 */
export function itIfApiTesting(name: string, fn: () => Promise<void>) {
  if (IS_API_TESTING) {
    it(name, fn)
  } else {
    it.skip(`[SKIPPED — set IS_API_TESTING=true to run] ${name}`, fn)
  }
}
```

**Using the flag in a test:**

```typescript
// src/legacy/__tests__/legacy-payment.integration.test.ts
import { itIfApiTesting } from '../../tests/helpers/api-testing.helper'

describe('Legacy Bank Payment — Integration', () => {
  // Skipped locally and in CI unless IS_API_TESTING=true
  itIfApiTesting(
    '[TC-LEGACY-INT-001] submitting a payment to the legacy bank system returns an approval code',
    async () => {
      const result = await LegacyPaymentService.submit({
        accountNumber: process.env.TEST_ACCOUNT_NUMBER!,
        amount: 100,
      })
      expect(result.status).toBe('APPROVED')
      expect(result.approvalCode).toBeDefined()
    },
  )
})
```

> Tests gated by `IS_API_TESTING=true` must never run in CI by default. Only add them to a separate pipeline step that has network access to the real service and explicit approval to run.

---

## Test Level Templates

---

### Level 1 — Unit Tests

**When:** Pure functions, business logic, validators, transformers, utilities.
All external dependencies (DB, HTTP, queue) are mocked.

**Tools:** Vitest (preferred) or Jest
**Speed:** < 5ms per test

#### Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
})
```

#### Template

```typescript
// src/[module]/__tests__/[function].unit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { functionUnderTest } from '../functionUnderTest'

// Mock external dependencies declared at top of file
vi.mock('../lib/externalDep', () => ({
  externalDep: { method: vi.fn() },
}))

describe('[FunctionName]', () => {
  beforeEach(() => {
    vi.clearAllMocks() // reset mocks between tests
  })

  // Format: '[TC-ID] plain human description of what should happen'
  it('[TC-FEATURE-001] <subject> <condition> <outcome in plain language>', () => {
    // Arrange — from TC Input
    const input = { field: 'value' }

    // Act
    const result = functionUnderTest(input)

    // Assert — from TC Expected Output
    expect(result).toEqual({ expected: 'output' })
  })

  it('[TC-FEATURE-002] <subject> with <invalid condition> is rejected with an error', () => {
    // Arrange
    const invalidInput = { field: null }

    // Act & Assert
    expect(() => functionUnderTest(invalidInput)).toThrow('Expected error message')
  })
})
```

#### Example — Register User (TC-AUTH-001 to TC-AUTH-010)

```typescript
// src/auth/__tests__/register.unit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateRegistrationInput } from '../register.validator'

describe('validateRegistrationInput', () => {
  it('[TC-AUTH-001] a display name with exactly 3 characters is accepted as valid', () => {
    const result = validateRegistrationInput({
      displayName: 'abc', // min boundary
      email: 'user@gmail.com',
      password: 'ValidPass1!',
    })
    expect(result.valid).toBe(true)
  })

  it('[TC-AUTH-002] a display name shorter than 3 characters is rejected with a minimum length error', () => {
    const result = validateRegistrationInput({
      displayName: 'ab', // min - 1
      email: 'user@gmail.com',
      password: 'ValidPass1!',
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'displayName', code: 'MIN_LENGTH' }),
    )
  })

  it('[TC-AUTH-003] a display name containing spaces is rejected with an invalid format error', () => {
    const result = validateRegistrationInput({
      displayName: 'user name', // invalid format
      email: 'user@gmail.com',
      password: 'ValidPass1!',
    })
    expect(result.valid).toBe(false)
    expect(result.errors[0].field).toBe('displayName')
    expect(result.errors[0].code).toBe('INVALID_FORMAT')
  })

  it('[TC-AUTH-004] an email address from a domain that is not on the allowed list is rejected', () => {
    const result = validateRegistrationInput({
      displayName: 'validuser',
      email: 'user@unknown.xyz', // not in whitelist
      password: 'ValidPass1!',
    })
    expect(result.valid).toBe(false)
    expect(result.errors[0].code).toBe('DOMAIN_NOT_ALLOWED')
  })
})
```

**Unit test checklist:**

- [ ] All branches covered (if/else, switch, ternary)
- [ ] All error/exception paths
- [ ] Boundary values from BVA table
- [ ] No real DB, HTTP, or filesystem calls anywhere

---

### Level 2 — Component Tests (Backend)

**When:** Service-layer functions that interact with a real database but no external HTTP calls.
**Tools:** Vitest/Jest + real test DB via Docker or Testcontainers
**Speed:** 100ms–1s per test

#### Setup

```typescript
// vitest.config.ts — component tests use real DB
export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: './src/tests/setup/db.setup.ts',
  },
})

// src/tests/setup/db.setup.ts
import { execSync } from 'child_process'
export async function setup() {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL!
  execSync('npx prisma migrate deploy')
}
```

#### Template

```typescript
// src/[module]/__tests__/[service].component.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { ServiceUnderTest } from '../service'
import { db } from '../../lib/db'

describe('[ServiceName]', () => {
  beforeEach(async () => {
    // Clean state before each test — order matters for FK constraints
    await db.dependentTable.deleteMany()
    await db.mainTable.deleteMany()
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  // Format: '[TC-ID] plain human description of what should happen'
  it('[TC-FEATURE-001] <subject> <condition> <outcome in plain language>', async () => {
    // Arrange — seed required data
    const seedData = await db.mainTable.create({
      data: {
        /* ... */
      },
    })

    // Act
    const result = await ServiceUnderTest.method(seedData.id)

    // Assert — check return value AND DB side effects
    expect(result).toMatchObject({ expected: 'shape' })
    const dbRecord = await db.mainTable.findUnique({ where: { id: seedData.id } })
    expect(dbRecord?.status).toBe('EXPECTED_STATE')
  })
})
```

#### Example — Create User Service

```typescript
// src/auth/__tests__/user.service.component.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { UserService } from '../user.service'
import { db } from '../../lib/db'

describe('UserService.createUser', () => {
  beforeEach(async () => {
    await db.user.deleteMany()
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  it('[TC-AUTH-005] a newly registered user is saved to the database with a hashed password and no plaintext password exposed', async () => {
    const result = await UserService.createUser({
      displayName: 'Alice',
      email: 'alice@gmail.com',
      password: 'ValidPass1!',
    })

    const saved = await db.user.findUnique({ where: { id: result.userId } })
    expect(saved).not.toBeNull()
    expect(saved!.password).not.toBe('ValidPass1!') // must not store plaintext
    expect(saved!.password).toMatch(/^\$2[ab]\$/) // bcrypt hash pattern
    expect(result).not.toHaveProperty('password') // not exposed in response
  })

  it('[TC-AUTH-006] trying to create a second account with the same email address raises a duplicate email conflict', async () => {
    await UserService.createUser({
      displayName: 'First',
      email: 'alice@gmail.com',
      password: 'ValidPass1!',
    })

    await expect(
      UserService.createUser({
        displayName: 'Second',
        email: 'alice@gmail.com', // duplicate
        password: 'AnotherPass1!',
      }),
    ).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' })
  })
})
```

---

### Level 3 — Integration Tests

**When:** Multiple modules or services working together — real DB, internal service calls are real, external HTTP APIs are either WireMock stubs (localhost URL) or real sandbox (real URL).
**Tools:** Vitest/Jest + real test DB + WireMock (auto-started when service URL is localhost)
**Speed:** 500ms–3s per test

#### Setup

```typescript
// vitest.config.integration.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.integration.test.ts'],
    globalSetup: './src/tests/setup/integration.global.setup.ts',
  },
})
```

The `integration.global.setup.ts` from the SUT Configuration section above handles WireMock startup automatically based on the service URLs in env.

#### Template

```typescript
// src/[module]/__tests__/[flow].integration.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { stubPost, resetStubs } from '../../tests/helpers/wiremock.helper'
import { db } from '../../lib/db'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL!

describe('[Flow Name] — Integration', () => {
  beforeEach(async () => {
    await db.relevantTable.deleteMany()
    await resetStubs(EXTERNAL_API_URL)
    // Register stubs for all external calls this flow makes
    // No-op if EXTERNAL_API_URL is not localhost
    await stubPost(EXTERNAL_API_URL, '/external/endpoint', { result: 'stubbed-response' })
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  // Format: '[TC-ID] plain human description of what the flow does end to end'
  it('[TC-FEATURE-INT-001] <multi-step flow description> results in <expected final state>', async () => {
    // Arrange — seed data needed across services
    const seedData = await db.mainTable.create({ data: { /* ... */ } })

    // Act — trigger the flow that crosses module boundaries
    const result = await OrchestrationService.runFlow(seedData.id)

    // Assert — verify outcome across all affected tables and return value
    expect(result).toMatchObject({ status: 'completed' })
    const dbRecord = await db.mainTable.findUnique({ where: { id: seedData.id } })
    expect(dbRecord?.status).toBe('PROCESSED')
  })
})
```

#### Example — Order Processing Integration (PaymentService + InventoryService)

```typescript
// src/orders/__tests__/order-checkout.integration.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { stubPost, resetStubs } from '../../tests/helpers/wiremock.helper'
import { OrderService } from '../order.service'
import { db } from '../../lib/db'

const PAYMENT_API_URL = process.env.PAYMENT_API_URL!
// .env.test (local / CI): PAYMENT_API_URL=http://localhost:8089
// .env.staging:           PAYMENT_API_URL=https://api.sandbox.stripe.com

describe('Order Checkout — Integration', () => {
  beforeEach(async () => {
    await db.order.deleteMany()
    await db.inventory.deleteMany()
    await resetStubs(PAYMENT_API_URL)
    await stubPost(PAYMENT_API_URL, '/v1/charges', { id: 'ch_test_123', status: 'succeeded' })
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  it('[TC-ORDER-INT-001] placing a valid order charges the payment gateway and reduces inventory stock', async () => {
    // Arrange
    await db.inventory.create({ data: { productId: 'p-1', stock: 10 } })

    // Act — crosses OrderService → PaymentService → InventoryService
    const order = await OrderService.checkout({ productId: 'p-1', quantity: 2, userId: 'u-1' })

    // Assert — return value
    expect(order.status).toBe('confirmed')
    expect(order.paymentId).toBe('ch_test_123')

    // Assert — DB side effects across services
    const inventory = await db.inventory.findUnique({ where: { productId: 'p-1' } })
    expect(inventory?.stock).toBe(8) // reduced by 2
  })

  it('[TC-ORDER-INT-002] when the payment gateway declines the charge the order is not created and stock is not changed', async () => {
    await db.inventory.create({ data: { productId: 'p-1', stock: 10 } })
    await resetStubs(PAYMENT_API_URL)
    await stubPost(PAYMENT_API_URL, '/v1/charges', { error: 'card_declined' }, 402)

    await expect(
      OrderService.checkout({ productId: 'p-1', quantity: 2, userId: 'u-1' }),
    ).rejects.toMatchObject({ code: 'PAYMENT_DECLINED' })

    const inventory = await db.inventory.findUnique({ where: { productId: 'p-1' } })
    expect(inventory?.stock).toBe(10) // unchanged — rollback verified
  })
})
```

**Integration test checklist:**

- [ ] Happy path flow completes and all affected DB tables reflect the correct final state
- [ ] Failure in one service rolls back or isolates state in all other services
- [ ] `resetStubs` called in `beforeEach` — no stubs bleed between tests
- [ ] Changing the service URL in `.env` is all that is needed to run against the real sandbox — no code changes
- [ ] Service URL read from env — never hardcoded in test files

---

### Level 4 — API Tests

**When:** Full HTTP request/response through one service — real DB, middleware, auth, no external calls.
**Tools:** Supertest + Vitest/Jest + isolated test DB
**Speed:** 200ms–2s per test

#### Template

```typescript
// src/[module]/__tests__/[route].api.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { db } from '../../lib/db'
import { generateTestToken } from '../helpers/auth.helper'

describe('[METHOD] /api/[route]', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = generateTestToken({ userId: 'test-user-1', role: 'USER' })
  })

  beforeEach(async () => {
    await db.relevantTable.deleteMany()
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  // Format: '[TC-ID] plain human description of what should happen'
  it('[TC-FEATURE-001] a valid request creates the resource and returns the new record', async () => {
    const res = await request(app)
      .post('/api/route')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        /* TC Input fields */
      })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      // TC Expected Output fields
    })
  })

  it('[TC-FEATURE-002] submitting the form without a required field returns a validation error for that field', async () => {
    const res = await request(app)
      .post('/api/route')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        /* input with field omitted */
      })

    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('fieldName')
    expect(res.body.errors[0].code).toBe('REQUIRED')
  })

  it('[TC-FEATURE-003] a request without an authentication token is rejected as unauthorized', async () => {
    const res = await request(app).post('/api/route').send({})
    expect(res.status).toBe(401)
  })

  it('[TC-FEATURE-004] a user without the required role is denied access to this action', async () => {
    const limitedToken = generateTestToken({ userId: 'guest-1', role: 'GUEST' })
    const res = await request(app)
      .post('/api/route')
      .set('Authorization', `Bearer ${limitedToken}`)
      .send({
        /* valid input */
      })
    expect(res.status).toBe(403)
  })
})
```

#### Example — POST /api/auth/register

```typescript
// src/auth/__tests__/register.api.test.ts
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { db } from '../../lib/db'

// TC Mock: SendGrid must not send real emails
vi.mock('../../lib/mailer', () => ({
  mailer: { send: vi.fn().mockResolvedValue({ accepted: ['email@test.com'] }) },
}))

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await db.user.deleteMany()
  })
  afterAll(async () => {
    await db.$disconnect()
  })

  const validPayload = {
    displayName: 'Alice',
    email: 'alice@gmail.com',
    password: 'ValidPass1!',
  }

  it('[TC-AUTH-007] a valid registration request creates the user account and returns the new user details', async () => {
    const res = await request(app).post('/api/auth/register').send(validPayload)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      userId: expect.any(String),
      displayName: 'Alice',
      email: 'alice@gmail.com',
      createdAt: expect.any(String),
    })
    expect(res.body).not.toHaveProperty('password') // never expose password
  })

  it('[TC-AUTH-008] registering with a 2-character display name is rejected because it is below the minimum length', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validPayload, displayName: 'ab' }) // 2 chars — below min of 3

    expect(res.status).toBe(400)
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({ field: 'displayName', code: 'MIN_LENGTH' }),
    )
  })

  it('[TC-AUTH-009] registering with an email from a domain that is not on the allowed list is rejected', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validPayload, email: 'user@unknown.xyz' })

    expect(res.status).toBe(400)
    expect(res.body.errors[0].code).toBe('DOMAIN_NOT_ALLOWED')
  })

  it('[TC-AUTH-010] registering with an email address that already has an account is rejected as a conflict', async () => {
    await request(app).post('/api/auth/register').send(validPayload) // first registration
    const res = await request(app).post('/api/auth/register').send(validPayload) // duplicate

    expect(res.status).toBe(409)
    expect(res.body.code).toBe('EMAIL_ALREADY_EXISTS')
  })
})
```

**API test checklist per endpoint:**

- [ ] Happy path → correct 2xx + response body shape
- [ ] Each required field missing → 400 + field-level error
- [ ] Each field at invalid boundary → 400 + correct error code
- [ ] No auth token → 401
- [ ] Insufficient role → 403
- [ ] Non-existent resource → 404
- [ ] Duplicate / conflict → 409
- [ ] No sensitive data (passwords, tokens) in any response body

---

### Level 5 — Frontend Component Tests

**When:** Interactive UI components — forms, tables, modals, any component with logic or state.
All API calls are mocked at the network or handler layer.

**Tools:** Vitest + React Testing Library (RTL) + jsdom
**Speed:** 50ms–500ms per test

#### Setup

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup/rtl.setup.ts'],
  },
})

// src/tests/setup/rtl.setup.ts
import '@testing-library/jest-dom'
```

#### Template

```typescript
// src/components/__tests__/[Component].component.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentUnderTest } from '../ComponentUnderTest'

// Mock API calls from TC "Mock needed" field
vi.mock('../../api/someApi', () => ({
  someApi: { method: vi.fn() },
}))

describe('[ComponentName]', () => {
  const defaultProps = {
    /* minimum valid props */
  }

  // Format: '[TC-ID] plain human description of what should happen'
  it('the component loads and displays on screen without any errors', () => {
    render()
    expect(screen.getByRole('form')).toBeInTheDocument()
  })

  it('[TC-FEATURE-001] <subject> <condition> <outcome in plain language>', async () => {
    const user = userEvent.setup()

    // Arrange
    render()

    // Act — from TC Steps
    await user.type(screen.getByLabelText(/field label/i), 'input value')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Assert — from TC Expected Output
    await waitFor(() => {
      expect(screen.getByText(/expected text/i)).toBeInTheDocument()
    })
  })
})
```

#### Example — RegisterForm Component

```typescript
// src/components/__tests__/RegisterForm.component.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '../RegisterForm'
import * as authApi from '../../api/auth'

vi.mock('../../api/auth')
const mockRegister = vi.mocked(authApi.register)

describe('RegisterForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('[TC-AUTH-UI-001] the registration form shows the display name, email, and password fields', () => {
    render()
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('[TC-AUTH-UI-002] submitting the form without filling in any fields shows a required error under each field', async () => {
    render()
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText(/display name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled() // API must not be called
  })

  it('[TC-AUTH-UI-003] typing only 2 characters in the display name field shows a minimum length error inline', async () => {
    render()
    await user.type(screen.getByLabelText(/display name/i), 'ab') // 2 chars
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument()
  })

  it('[TC-AUTH-UI-004] filling in all valid fields and clicking register sends the correct data to the API', async () => {
    mockRegister.mockResolvedValue({ userId: '123', displayName: 'Alice' })
    render()

    await user.type(screen.getByLabelText(/display name/i), 'Alice')
    await user.type(screen.getByLabelText(/email/i), 'alice@gmail.com')
    await user.type(screen.getByLabelText(/password/i), 'ValidPass1!')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        displayName: 'Alice',
        email: 'alice@gmail.com',
        password: 'ValidPass1!',
      })
    })
  })

  it('[TC-AUTH-UI-005] when the server says the email is already taken the form shows an inline error on the email field', async () => {
    mockRegister.mockRejectedValue({ code: 'EMAIL_ALREADY_EXISTS' })
    render()

    await user.type(screen.getByLabelText(/display name/i), 'Alice')
    await user.type(screen.getByLabelText(/email/i), 'alice@gmail.com')
    await user.type(screen.getByLabelText(/password/i), 'ValidPass1!')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText(/email already in use/i)).toBeInTheDocument()
  })

  it('[TC-AUTH-UI-006] the register button is disabled and not clickable while the registration request is still in progress', async () => {
    mockRegister.mockImplementation(() => new Promise(() => {})) // never resolves
    render()

    await user.type(screen.getByLabelText(/display name/i), 'Alice')
    await user.type(screen.getByLabelText(/email/i), 'alice@gmail.com')
    await user.type(screen.getByLabelText(/password/i), 'ValidPass1!')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled()
  })
})
```

**Frontend component test checklist:**

- [ ] Component renders without crashing (smoke)
- [ ] Empty / missing props state
- [ ] Each user interaction (type, click, select, clear)
- [ ] Form validation errors shown inline
- [ ] Loading state during async operation
- [ ] Error state on API failure
- [ ] Successful completion / redirect / success message
- [ ] API called with exactly the correct payload
- [ ] No real HTTP calls (all mocked)

---

### Level 6 — E2E Tests

**When:** Full user journeys through the deployed system. Keep this layer thin.
**Tools:** Playwright (preferred), Cypress
**Speed:** Seconds to minutes per test. Run on merge to main or nightly.

#### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
```

#### Template

```typescript
// e2e/[feature]/[flow].e2e.test.ts
import { test, expect } from '@playwright/test'
import { seedTestUser, cleanupTestUser } from '../helpers/db.helper'

test.describe('[Feature] — [Flow Name]', () => {
  test.beforeEach(async () => {
    await seedTestUser({ email: 'e2e-user@gmail.com', password: 'ValidPass1!' })
  })

  test.afterEach(async () => {
    await cleanupTestUser('e2e-user@gmail.com')
  })

  // Format: '[TC-ID] plain human description of what the user does and what they should see'
  test('[TC-FEATURE-001] <actor> <action> and <expected outcome in plain language>', async ({ page }) => {
    // Arrange — navigate to starting point
    await page.goto('/starting-path')

    // Act — follow TC Steps using data-testid selectors
    await page.getByTestId('field-name').fill('value')
    await page.getByRole('button', { name: /action/i }).click()

    // Assert — from TC Expected Output
    await expect(page).toHaveURL(/expected-url-pattern/)
    await expect(page.getByTestId('result-element')).toContainText('Expected text')
  })
})
```

#### Example — User Registration E2E Flow

```typescript
// e2e/auth/register.e2e.test.ts
import { test, expect } from '@playwright/test'
import { cleanupTestUser } from '../helpers/db.helper'

test.describe('User Registration — E2E', () => {
  const testEmail = `e2e-${Date.now()}@gmail.com` // unique per run

  test.afterEach(async () => {
    await cleanupTestUser(testEmail)
  })

  test('[TC-AUTH-E2E-001] a new user fills in the registration form and is taken to their dashboard after submitting', async ({ page }) => {
    // Navigate
    await page.goto('/register')
    await expect(page).toHaveTitle(/register/i)

    // Fill form — using data-testid for stable selectors
    await page.getByTestId('input-displayName').fill('E2EUser')
    await page.getByTestId('input-email').fill(testEmail)
    await page.getByTestId('input-password').fill('ValidPass1!')

    // Submit
    await page.getByRole('button', { name: /create account/i }).click()

    // Assert redirect to dashboard with welcome message
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByTestId('welcome-message')).toContainText('E2EUser')
  })

  test('[TC-AUTH-E2E-002] a user who tries to register with an email that is already in use sees an error and stays on the registration page', async ({ page }) => {
    // Pre-register the email
    await page.goto('/register')
    await page.getByTestId('input-displayName').fill('FirstUser')
    await page.getByTestId('input-email').fill(testEmail)
    await page.getByTestId('input-password').fill('ValidPass1!')
    await page.getByRole('button', { name: /create account/i }).click()
    await page.waitForURL(/\/dashboard/)

    // Try to register again with same email
    await page.goto('/register')
    await page.getByTestId('input-displayName').fill('SecondUser')
    await page.getByTestId('input-email').fill(testEmail)
    await page.getByTestId('input-password').fill('ValidPass1!')
    await page.getByRole('button', { name: /create account/i }).click()

    // Should stay on register page with error
    await expect(page).toHaveURL(/\/register/)
    await expect(page.getByTestId('error-email')).toContainText(/already in use/i)
  })
})
```

**E2E principles:**

- Test **critical paths only** — registration, login, checkout, key user journeys
- Use **`data-testid`** for all selectors — never CSS classes or XPath
- Use **unique test data per run** (e.g. timestamp in email) to avoid state collisions
- **Seed and clean up** test data with helper scripts — never rely on leftover state
- Run against **staging**, never production
- Keep total E2E suite under **30 minutes**

---

## Test Level Selection Guide

```
Question: What level should I write this test at?

Is it a pure function / validator / calculation with no I/O?
  → Unit Test (Level 1)

Does it need a real database but no HTTP requests?
  → Component Test — Backend (Level 2)

Does it involve multiple services or modules working together,
with external HTTP APIs that should be stubbed or verified?
  → Integration Test (Level 3) — set service URL to localhost:8089 for WireMock, or the real domain for sandbox

Is it testing a single HTTP endpoint through one service?
  → API Test (Level 4)

Is it testing a UI component's behavior and interactions?
  → Frontend Component Test (Level 5)

Is it testing a full user journey through the deployed system?
  → E2E Test (Level 6)
```

---

## File Naming Conventions

```
Unit:                src/[module]/__tests__/[name].unit.test.ts
Component (Backend): src/[module]/__tests__/[name].component.test.ts
Integration:         src/[module]/__tests__/[flow].integration.test.ts
API:                 src/[module]/__tests__/[name].api.test.ts
Frontend Component:  src/components/__tests__/[Name].component.test.tsx
E2E:                 e2e/[feature]/[flow].e2e.test.ts
Fixtures:            src/tests/__fixtures__/[domain].fixture.ts
Helpers:             src/tests/helpers/[name].helper.ts
WireMock stubs:      src/tests/stubs/[domain].stub.ts
WireMock setup:      src/tests/setup/wiremock.setup.ts
Integration setup:   src/tests/setup/integration.global.setup.ts
```

---

## Mock Strategy by Level

| Level               | What to Mock                                               | What to Keep Real                         | Service URL                          |
| ------------------- | ---------------------------------------------------------- | ----------------------------------------- | ------------------------------------ |
| Unit                | DB, HTTP, queue, filesystem — everything                   | Only the function under test              | n/a                                  |
| Component (Backend) | External HTTP, queue, email                                | Database (use real test DB)               | n/a                                  |
| Integration         | External HTTP APIs via WireMock (when URL = localhost)     | DB, internal services, module wiring      | `http://localhost:8089` or real URL  |
| API                 | External services (Stripe, SendGrid, OAuth)                | DB, middleware, auth, routing             | n/a                                  |
| Frontend Component  | All API/HTTP calls                                         | DOM, component logic, state               | n/a                                  |
| E2E                 | Nothing — use real sandbox accounts                        | Entire deployed stack                     | real sandbox URL only                |
