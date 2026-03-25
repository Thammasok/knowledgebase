---
name: ai-orchestrator
description: >
  Use this skill to DRIVE the TDD development loop for a single scenario. The AI Orchestrator
  receives a scenario (SC-xxx) with its test cases (TC-xxx) and architecture (API contract, DB
  schema) and autonomously implements it following strict TDD: write failing test first (Red),
  implement minimum code to pass (Green), refactor, integrate, run the full test suite, generate
  technical documentation, and signal ready for review.
  Covers: reading scenario scope and Definition of Done (TC-xxx), writing failing tests before
  any implementation, implementing just enough code to make tests pass, refactoring without
  changing behavior, integrating changes, running the full test suite, generating technical
  documentation (README, setup guides, inline code docs), and signaling ready for review.
  Trigger when the user mentions: implement scenario, TDD, test-driven development, red-green-
  refactor, write the test first, implement SC-xxx, build this scenario, "make TC-xxx pass",
  "implement the feature using TDD", "start the dev loop", "orchestrate development", technical
  documentation, README, setup guide, or when a scenario has architecture ready and needs to
  be implemented.
  Always run AFTER software-architecture — architecture defines what to build, orchestrator
  builds it. Never skip the test-first step. Never approve your own work — signal ready for
  human review.
---

> **Artifact Reference:** All artifacts consumed and produced by this skill MUST follow the templates and storage locations defined in [`.opencode/artifacts/ARTIFACTS.md`](../../artifacts/ARTIFACTS.md). Read from `docs/` directories; write to `src/` and `tests/`.

# AI Orchestrator — TDD Development Loop Skill

## Role & Responsibility

The AI Orchestrator is the autonomous implementation engine. It receives a scenario with its Definition of Done (test cases) and architecture, then drives the full TDD loop without human intervention until ready for review.

```
[project-management]         [software-architecture]      [software-tester-design]
────────────────────         ─────────────────────────    ─────────────────────────
SC-xxx Scenario       ──┐    API contract            ──┐  TC-xxx Test Cases     ──┐
Iteration scope       ──┤    DB schema               ──┤  Test data specs       ──┤
DEV-xxx Tasks         ──┘    Integration contracts   ──┘  Expected I/O          ──┘
                              ADRs + OpenAPI
                                        │
                                        ↓
                           [ai-orchestrator]
                           ─────────────────────────────────────
                           Step 1: Load scenario context (SC + TC + Architecture)
                           Step 2: Write failing test (TDD Red)
                           Step 3: Implement minimum code (TDD Green)
                           Step 4: Refactor
                           Step 5: Integrate
                           Step 6: Run full test suite
                           Step 7: Generate technical documentation
                           Step 8: Signal ready for review
                                        │
                                        ↓
                            [Human Review / UAT]
                            Accepts or rejects the implementation
```

---

## Core Philosophy — Test-Driven Development (TDD)

TDD is not "write tests after coding" — it is a design discipline where **tests come first**.

### The Red-Green-Refactor Cycle

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   RED          GREEN           REFACTOR                       │
│   ───          ─────           ────────                       │
│   Write a      Write the       Clean up                       │
│   failing      minimum code    the code                       │
│   test         to make it      without                        │
│                pass            changing                       │
│                                behavior                       │
│                                                               │
│   ↓            ↓               ↓                              │
│   Test FAILS   Test PASSES     Test STILL PASSES              │
│                                                               │
│   ────────────────────────────────────────────────────────    │
│                         REPEAT                                │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Why TDD Works

| Benefit | How |
|---------|-----|
| **Confidence** | You know the code works — you have a test |
| **Design pressure** | Hard-to-test code = poorly designed code |
| **Documentation** | Tests describe what the code does |
| **Regression safety** | Future changes can't break existing behavior silently |
| **Scope control** | You only write code that a test requires |

### TDD Rules

1. **Never write implementation code without a failing test first**
2. **Write only enough test to fail** — don't over-specify upfront
3. **Write only enough code to pass** — don't add features
4. **Refactor only when tests are green** — never refactor failing code
5. **Run all tests after every change** — catch regressions immediately

---

## Responsibility Boundaries

The AI Orchestrator has clear boundaries to prevent scope creep.

### DOES

| Responsibility | Detail |
|----------------|--------|
| Read TC-xxx → understand Definition of Done | Every test case defines an observable outcome |
| Write failing test first (TDD Red) | Test must fail before any implementation |
| Implement minimum code (TDD Green) | No extra features, no speculative code |
| Refactor | Clean up duplication, improve names, extract functions |
| Integrate | Ensure changes work with existing code |
| Run full test suite | All tests must pass, not just new ones |
| Commit and signal ready for review | Clear commit messages, ready for human inspection |

### DOES NOT

| Forbidden | Why |
|-----------|-----|
| Pick the next scenario | PM's job — orchestrator works on assigned scenario only |
| Make scope changes | BA/PM's job — if requirements are unclear, stop and ask |
| Approve its own work | Human's job — always require human review before done |
| Skip tests | TDD is mandatory, not optional |
| Add unrequested features | Violates YAGNI and scope discipline |
| Modify architecture | Requires architectural review, not autonomous decision |

---

## Step 1 — Load Scenario Context

Before writing any code, the orchestrator must load and understand the full context.

### Context Checklist

```
## Scenario Context — SC-xxx-001

─── From project-management ────────────────────────────────────
[ ] Scenario ID and title: SC-xxx-001 — [title]
[ ] Iteration:             Iteration N
[ ] Dev tasks in scope:    DEV-xxx-001, DEV-xxx-002, ...
[ ] Priority:              Must Have / Should Have

─── From software-tester-design ────────────────────────────────
[ ] Test cases (Definition of Done):
    [ ] TC-xxx-001: [title] — Priority P1
    [ ] TC-xxx-002: [title] — Priority P1
    [ ] TC-xxx-003: [title] — Priority P2
[ ] Test data specifications
[ ] Expected inputs and outputs per action

─── From software-architecture ─────────────────────────────────
[ ] API contract:
    [ ] POST /api/resource — request/response schema
    [ ] Error codes and messages
[ ] Database schema:
    [ ] Table: [table_name] — columns, constraints, indexes
    [ ] Migration script
[ ] Integration contracts (if any)
[ ] Architecture decisions (ADRs)

─── Existing codebase ──────────────────────────────────────────
[ ] Test framework: [Jest / Vitest / pytest / etc.]
[ ] Test directory structure: [e.g. src/__tests__/]
[ ] Existing patterns: [How are similar features tested?]
[ ] CI pipeline: [What runs on commit?]
```

### Context Verification

Before proceeding, verify:
- All test cases have clear expected outputs
- API contract matches test case expectations
- Database schema supports the required data
- No ambiguity in requirements (if unclear, STOP and ask)

---

## Step 2 — Write Failing Test (TDD Red)

For each test case, write a test that fails because the implementation doesn't exist yet.

### Test Writing Rules

1. **One test case = one test function** (may have multiple assertions)
2. **Test must fail on first run** — if it passes, something is wrong
3. **Test must fail for the right reason** — assertion failure, not syntax error
4. **Follow existing test patterns** — match the codebase style

### Test Structure Template

```typescript
// File: src/__tests__/[feature]/[action].[level].test.ts
// TC-xxx-001: [Test case title]

describe('[Feature] - [Action]', () => {
  // Setup (if needed)
  beforeEach(() => {
    // Reset state, seed data, configure mocks
  });

  it('TC-xxx-001: should [expected behavior] when [condition]', async () => {
    // Arrange — set up preconditions
    const input = {
      fieldName: 'validValue',
      email: 'user@example.com',
    };

    // Act — perform the action
    const result = await performAction(input);

    // Assert — verify expected output
    expect(result.status).toBe(201);
    expect(result.body).toMatchObject({
      id: expect.any(String),
      fieldName: 'validValue',
      email: 'user@example.com',
      createdAt: expect.any(String),
    });
  });

  it('TC-xxx-002: should return 400 when [invalid condition]', async () => {
    // Arrange
    const input = { fieldName: '', email: 'invalid' };

    // Act
    const result = await performAction(input);

    // Assert
    expect(result.status).toBe(400);
    expect(result.body.code).toBe('VALIDATION_ERROR');
  });
});
```

### Test Levels

Write tests at the appropriate level based on the test case specification:

| Level | What it tests | Speed | Isolation |
|-------|---------------|-------|-----------|
| **Unit** | Single function/module | Fast | Full (mocked dependencies) |
| **Component** | Service or module with real deps | Medium | Partial (real DB, mocked external) |
| **API** | HTTP endpoint | Medium | Partial (real server, mocked external) |
| **Integration** | Multiple services together | Slow | Minimal |
| **E2E** | Full user flow | Slowest | None (real everything) |

### Red Phase Checklist

- [ ] Test file created in correct location
- [ ] Test function named with TC-xxx prefix
- [ ] Test follows Arrange-Act-Assert pattern
- [ ] Test fails when run (implementation doesn't exist)
- [ ] Failure message is clear (assertion failed, not error)

---

## Step 3 — Implement Minimum Code (TDD Green)

Write the **minimum code** to make the failing test pass. No more, no less.

### Implementation Rules

1. **Only write code that makes the test pass** — nothing extra
2. **Hardcoding is allowed** to pass the first test, then generalize
3. **Don't optimize yet** — make it work, then make it right
4. **Follow existing patterns** — match codebase style
5. **No speculative features** — if no test requires it, don't build it

### Implementation Order

```
1. Database migration (if new table)
   ↓
2. Data model / entity
   ↓
3. Repository / data access
   ↓
4. Service / business logic
   ↓
5. Controller / endpoint handler
   ↓
6. Run test → should pass
```

### Green Phase Checklist

- [ ] Implementation follows architecture contract
- [ ] Code matches existing codebase patterns
- [ ] No extra features beyond test requirements
- [ ] Test now passes
- [ ] Only the targeted test was made to pass (no other tests affected)

---

## Step 4 — Refactor

With tests green, clean up the code without changing behavior.

### Refactoring Targets

| Smell | Refactoring |
|-------|-------------|
| Duplicate code | Extract function/method |
| Long function | Split into smaller functions |
| Magic numbers/strings | Extract constants |
| Poor naming | Rename for clarity |
| Deep nesting | Early returns, guard clauses |
| Large class | Extract class/module |

### Refactoring Rules

1. **Tests must stay green** — run after every change
2. **Small steps** — one refactoring at a time
3. **No new features** — only restructure existing code
4. **Commit after each refactoring** — easy to revert if needed

### Refactor Phase Checklist

- [ ] Code is clean and readable
- [ ] No duplication
- [ ] Functions are small and focused
- [ ] Names are clear and descriptive
- [ ] All tests still pass

---

## Step 5 — Integrate

Ensure the new code works with the existing system.

### Integration Checklist

```
─── Code Integration ───────────────────────────────────────────
[ ] New files are in correct directories
[ ] Imports/exports are correct
[ ] No circular dependencies
[ ] New routes are registered
[ ] New migrations are runnable

─── Dependency Integration ─────────────────────────────────────
[ ] Environment variables documented
[ ] External service mocks work in test environment
[ ] Database migrations run cleanly on fresh DB

─── Build Integration ──────────────────────────────────────────
[ ] Code compiles without errors
[ ] No TypeScript / lint errors
[ ] Build completes successfully
```

---

## Step 6 — Run Full Test Suite

All tests must pass, not just the new ones.

### Test Suite Execution

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/__tests__/feature/action.api.test.ts
```

### Failure Handling

| Situation | Action |
|-----------|--------|
| New test fails | Debug implementation, fix, re-run |
| Existing test fails (regression) | Fix the regression before proceeding |
| Flaky test | Investigate and stabilize, don't ignore |
| Environment issue | Fix environment, don't skip tests |

### Test Suite Checklist

- [ ] All P1 test cases pass
- [ ] All existing tests pass (no regressions)
- [ ] Code coverage meets threshold (if configured)
- [ ] No skipped tests (unless documented reason)
- [ ] No flaky tests

---

## Step 7 — Generate Technical Documentation

After tests pass, generate technical documentation to help developers understand and maintain the code.

### Documentation Types

| Type | Purpose | When to Generate |
|------|---------|------------------|
| **README** | Project/feature overview, setup instructions | New feature or significant change |
| **Inline comments** | Explain complex logic | Non-obvious code sections |
| **JSDoc / docstrings** | Function/method documentation | Public APIs and interfaces |
| **Setup guide** | Environment setup, dependencies | New dependencies added |
| **Migration guide** | Breaking changes, upgrade paths | Breaking API changes |

### README Template

```markdown
# [Feature Name]

## Overview

[Brief description of what this feature does and why it exists]

**Scenario:** SC-xxx-001
**Stories:** US-xxx-001, US-xxx-002

## Quick Start

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/[resource]` | Create new [resource] |
| GET | `/api/[resource]/{id}` | Get [resource] by ID |

See [OpenAPI specification](./docs/openapi/[feature]-api.yaml) for full API documentation.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `[VAR_NAME]` | [Description] | `[default]` |

## Database

### Tables

- `[table_name]` — [Description of what this table stores]

### Migrations

Run migrations with:

```bash
npm run migrate
```

## Testing

```bash
# Run all tests
npm test

# Run tests for this feature
npm test -- src/__tests__/[feature]/
```

## Architecture

[Brief description of how this feature is structured]

```
src/
  controllers/[feature].controller.ts  — HTTP handlers
  services/[feature].service.ts        — Business logic
  models/[feature].model.ts            — Data model
  __tests__/[feature]/                 — Test files
```

## Related

- [Architecture doc](./docs/architecture/[feature].md)
- [User documentation](./docs/user-guide/[feature].md)
```

### Inline Documentation Guidelines

```typescript
/**
 * Creates a new user account with email verification.
 *
 * @param input - User registration data
 * @param input.displayName - Display name (3-50 chars, alphanumeric)
 * @param input.email - Email address (must be unique)
 * @param input.password - Password (will be hashed)
 * @returns The created user (without password)
 * @throws {ValidationError} When input validation fails
 * @throws {ConflictError} When email already exists
 *
 * @example
 * const user = await createUser({
 *   displayName: 'alice',
 *   email: 'alice@example.com',
 *   password: 'SecurePass1!'
 * });
 *
 * @see TC-REG-001 — Happy path test
 * @see TC-REG-002 — Duplicate email test
 */
async function createUser(input: CreateUserInput): Promise<User> {
  // Implementation
}
```

### Documentation Checklist

- [ ] README updated with new feature/changes
- [ ] Public functions have JSDoc/docstrings
- [ ] Complex logic has inline comments explaining "why"
- [ ] Environment variables documented
- [ ] Database changes documented
- [ ] API endpoints listed with links to OpenAPI spec

---

## Step 8 — Signal Ready for Review

The orchestrator's job is done when all tests pass and documentation is generated. Now signal for human review.

### Commit Guidelines

```bash
# Format: [type](scope): description
# Types: feat, fix, refactor, test, docs, chore

# Example commits for a scenario:
git commit -m "test(auth): add failing tests for user registration (TC-REG-001, TC-REG-002)"
git commit -m "feat(auth): implement POST /api/auth/register endpoint"
git commit -m "refactor(auth): extract validation logic to separate module"
```

### Ready-for-Review Signal

```
## Ready for Review — SC-xxx-001

Scenario:     SC-xxx-001 — [Scenario title]
Iteration:    Iteration N
Branch:       feature/sc-xxx-001-[short-description]

─── Implementation Summary ─────────────────────────────────────
[ ] API endpoints implemented:
    - POST /api/resource — creates new resource
    - GET /api/resource/{id} — retrieves resource

[ ] Database changes:
    - Migration: 20250101_120000_create_resources
    - Table: resources (id, name, created_at, updated_at)

[ ] Test results:
    - TC-xxx-001: PASS ✓
    - TC-xxx-002: PASS ✓
    - TC-xxx-003: PASS ✓
    - Full suite: 47 passed, 0 failed

─── Files Changed ──────────────────────────────────────────────
  src/controllers/resource.controller.ts  (new)
  src/services/resource.service.ts        (new)
  src/models/resource.model.ts            (new)
  src/routes/resource.routes.ts           (new)
  src/__tests__/resource/create.api.test.ts (new)
  prisma/migrations/20250101_120000_create_resources/ (new)

─── Awaiting Human Review ──────────────────────────────────────
  - Code review required before merge
  - UAT verification required in staging
  - Do NOT merge without human approval
```

---

## Handling Edge Cases

### Unclear Requirements

```
STOP. Do not guess.
Ask the PM/BA:
  "The requirement says [X], but the test case expects [Y].
   Which is correct? I need clarification before proceeding."
```

### Architecture Mismatch

```
STOP. Do not deviate from architecture.
Ask the architect:
  "The architecture specifies [X], but to pass TC-xxx-001,
   I would need to [Y]. Should I update the architecture?"
```

### Test Case Conflict

```
STOP. Do not ignore test cases.
Ask the tester:
  "TC-xxx-001 expects [X], but TC-xxx-002 expects [Y] for the
   same input. These conflict. Which is the intended behavior?"
```

### Scope Creep Temptation

```
STOP. Do not add unrequested features.
The test cases define the scope. If it's not in a test case,
it's not in scope. Note it for future scenarios and move on.
```

---

## Development Loop State Machine

```
                    ┌──────────────────────────────────┐
                    │                                  │
                    ▼                                  │
            ┌───────────────┐                          │
            │  LOAD CONTEXT │                          │
            └───────┬───────┘                          │
                    │                                  │
                    ▼                                  │
            ┌───────────────┐                          │
            │  WRITE TEST   │ ◄─────────────────────┐  │
            │   (RED)       │                       │  │
            └───────┬───────┘                       │  │
                    │                               │  │
                    ▼                               │  │
            ┌───────────────┐                       │  │
            │  IMPLEMENT    │                       │  │
            │   (GREEN)     │                       │  │
            └───────┬───────┘                       │  │
                    │                               │  │
                    ▼                               │  │
            ┌───────────────┐                       │  │
            │   REFACTOR    │                       │  │
            └───────┬───────┘                       │  │
                    │                               │  │
                    ▼                               │  │
            ┌───────────────┐       More TCs?       │  │
            │   RUN TESTS   │ ──────── Yes ─────────┘  │
            └───────┬───────┘                          │
                    │                                  │
                    │ All TCs done                     │
                    ▼                                  │
            ┌───────────────┐                          │
            │   INTEGRATE   │                          │
            └───────┬───────┘                          │
                    │                                  │
                    ▼                                  │
            ┌───────────────┐                          │
            │  FULL SUITE   │ ──── Regression? ────────┘
            └───────┬───────┘        (fix and retry)
                    │
                    │ All pass
                    ▼
            ┌───────────────┐
            │  GENERATE     │
            │  TECH DOCS    │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ READY FOR     │
            │    REVIEW     │
            └───────────────┘
```

---

## Quality Gates

Before signaling ready for review, all gates must pass:

| Gate | Requirement |
|------|-------------|
| Tests | All P1 test cases pass |
| Regressions | No existing tests broken |
| Build | Compiles without errors |
| Lint | No lint/style errors |
| Types | No type errors (if typed language) |
| Coverage | Meets threshold (if configured) |
| Security | No obvious vulnerabilities introduced |
| Architecture | Implementation matches contract |
| Documentation | README updated, public APIs documented |

---

## Output Artifacts

The orchestrator produces these artifacts:

1. **Test files** — Automated tests for each TC-xxx
2. **Implementation code** — Feature code that makes tests pass
3. **Migrations** — Database changes (if any)
4. **Technical documentation** — README, inline docs, JSDoc/docstrings
5. **Commits** — Clean commit history with descriptive messages
6. **Ready-for-review signal** — Summary document for human reviewer

All artifacts trace back to the scenario:

```
SC-xxx-001 (Scenario)
    │
    ├── TC-xxx-001 → test file → implementation → commit
    ├── TC-xxx-002 → test file → implementation → commit
    └── TC-xxx-003 → test file → implementation → commit
    │
    ├── Technical docs → README.md, JSDoc, inline comments
    │
    └── Ready-for-Review signal → Human approval required
```
