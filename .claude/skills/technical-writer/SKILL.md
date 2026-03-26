---
name: technical-writer
description: >
  Use this skill to GENERATE user-facing documentation after a feature passes UAT. The Technical
  Writer receives completed scenarios with their test cases and produces documentation that helps
  end users understand and use the feature effectively.
  Covers: writing user guides, help documentation, tutorials, onboarding materials, FAQ sections,
  troubleshooting guides, and in-app help text. Documentation is written from the user's perspective,
  focusing on tasks they want to accomplish (jobs-to-be-done), not technical implementation details.
  Trigger when the user mentions: user documentation, user guide, help docs, help center, tutorial,
  onboarding, FAQ, troubleshooting guide, how-to guide, user manual, end-user docs, help text,
  in-app help, "write documentation for users", "create a user guide", "document how to use",
  "write help content", or when a feature has passed UAT and needs user-facing documentation.
  Always run AFTER UAT passes — only document features that work and are approved. Never document
  unfinished or untested features. Output is for end users, not developers.
---

> **Artifact Reference:** All artifacts produced by this skill MUST follow the templates and storage locations defined in [`.opencode/artifacts/ARTIFACTS.md`](../../artifacts/ARTIFACTS.md). Store outputs in `docs/user-guide/`.

# Technical Writer — User Documentation Skill

## Role & Responsibility

The Technical Writer produces documentation for end users. This skill runs after UAT passes and a feature is ready for users.

```
[ai-orchestrator]              [Human Review / UAT]
─────────────────              ────────────────────
Implementation complete  ──┐    Feature approved   ──┐
Tests passing            ──┤    Ready for users    ──┘
Technical docs ready     ──┘
                              ↓
                   [technical-writer]
                   ─────────────────────────────────────
                   Step 1: Understand feature from user perspective
                   Step 2: Identify documentation needs
                   Step 3: Write user guide
                   Step 4: Create tutorials / how-to guides
                   Step 5: Write FAQ and troubleshooting
                   Step 6: Create in-app help text
                              ↓
                   [End Users]
                   Can understand and use the feature
                   without needing developer support
```

---

## Core Philosophy — User-Centered Documentation

Documentation should be written from the **user's perspective**, not the developer's. Focus on what users want to accomplish (jobs-to-be-done), not how the system works internally.

### Good vs Bad Documentation

```
❌ Developer-focused:
   "The POST /api/auth/register endpoint accepts a JSON body with
   displayName, email, and password fields and returns a 201 status
   with the created user object."

✓  User-focused:
   "To create your account:
   1. Enter your display name (3-50 characters)
   2. Enter your email address
   3. Create a password (at least 10 characters with uppercase, number, and symbol)
   4. Click 'Create Account'
   You'll receive a verification email within a few minutes."
```

### Documentation Principles

| Principle | Application |
|-----------|-------------|
| **Task-oriented** | Organize by what users want to do, not by system features |
| **Scannable** | Use headings, bullets, numbered steps — users don't read, they scan |
| **Progressive disclosure** | Start simple, reveal complexity as needed |
| **Consistent** | Same terms, same structure, same voice throughout |
| **Verifiable** | Users can confirm they did it right at each step |
| **Accessible** | Clear language, no jargon, consider all users |

---

## Step 1 — Understand Feature from User Perspective

Before writing, understand who the users are and what they're trying to accomplish.

### User Analysis

```
## User Analysis — [Feature Name]

─── Target Users ───────────────────────────────────────────────
Who uses this feature?
  - [User persona 1]: [Brief description, goals, tech comfort level]
  - [User persona 2]: [Brief description, goals, tech comfort level]

─── User Goals (Jobs-to-be-Done) ───────────────────────────────
What are users trying to accomplish?
  - [Goal 1]: [e.g. "Create an account to access the platform"]
  - [Goal 2]: [e.g. "Verify my email to complete registration"]
  - [Goal 3]: [e.g. "Recover access if I forget my password"]

─── Entry Points ───────────────────────────────────────────────
How do users find/access this feature?
  - [Entry 1]: [e.g. "Sign Up button on homepage"]
  - [Entry 2]: [e.g. "Invitation email link"]

─── Success Criteria ───────────────────────────────────────────
How do users know they succeeded?
  - [Indicator 1]: [e.g. "Welcome message on dashboard"]
  - [Indicator 2]: [e.g. "Verification email received"]

─── Common Mistakes ────────────────────────────────────────────
What mistakes might users make?
  - [Mistake 1]: [e.g. "Password doesn't meet requirements"]
  - [Mistake 2]: [e.g. "Email already registered"]
```

### Mapping Scenarios to User Tasks

| Scenario (SC-xxx) | User Task | Documentation Type |
|-------------------|-----------|-------------------|
| SC-REG-001 | Create an account | User guide + Tutorial |
| SC-REG-002 | Verify email address | User guide + FAQ |
| SC-REG-003 | Handle registration errors | Troubleshooting |

---

## Step 2 — Identify Documentation Needs

Determine what types of documentation are needed for this feature.

### Documentation Types

| Type | Purpose | When to Use |
|------|---------|-------------|
| **User Guide** | Comprehensive reference for a feature | Every feature |
| **Quick Start** | Get started in minutes | New users, onboarding |
| **Tutorial** | Step-by-step walkthrough with context | Complex workflows |
| **How-To Guide** | Focused task completion | Specific tasks |
| **FAQ** | Common questions answered | After support patterns emerge |
| **Troubleshooting** | Fix common problems | Error-prone features |
| **In-App Help** | Contextual help in the UI | Forms, complex actions |
| **Glossary** | Define terms | When jargon is unavoidable |

### Documentation Matrix

```
## Documentation Matrix — [Feature Name]

| User Task | Guide | Tutorial | How-To | FAQ | Troubleshoot | In-App |
|-----------|-------|----------|--------|-----|--------------|--------|
| Create account | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Verify email | ✓ | — | ✓ | ✓ | ✓ | — |
| Reset password | ✓ | — | ✓ | ✓ | ✓ | ✓ |
```

---

## Step 3 — Write User Guide

The user guide is the comprehensive reference for a feature.

### User Guide Template

```markdown
# [Feature Name]

## Overview

[1-2 sentences: What this feature does and why you'd use it]

## Before You Begin

Before using [feature], make sure you have:
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

## [Task 1 Name]

[Brief intro: When and why you'd do this task]

### Steps

1. **[Action]**
   - [Detail or sub-step if needed]
   - [Screenshot placeholder: ![Step 1](./images/step-1.png)]

2. **[Action]**
   - [Detail]

3. **[Action]**
   - [Detail]

### Result

When complete, you'll see [description of success state].

[Screenshot placeholder: ![Success state](./images/success.png)]

### Tips

- [Helpful tip 1]
- [Helpful tip 2]

---

## [Task 2 Name]

[Same structure as above]

---

## Related

- [Link to related guide]
- [Link to FAQ]
- [Link to troubleshooting]
```

### Writing Guidelines

| Guideline | Example |
|-----------|---------|
| **Use active voice** | "Click Submit" not "The Submit button should be clicked" |
| **Use second person** | "You can..." not "Users can..." |
| **Be specific** | "Enter your 10-digit phone number" not "Enter your phone number" |
| **Use numbered steps** | 1, 2, 3 — not bullets for sequences |
| **Include results** | "A confirmation message appears" |
| **Add visual cues** | "Click the blue **Save** button in the top right" |

---

## Step 4 — Create Tutorials / How-To Guides

Tutorials walk users through a task with context and explanation.

### Tutorial Template

```markdown
# Tutorial: [Task Name]

**Time:** ~[X] minutes
**Level:** Beginner / Intermediate / Advanced

## What You'll Learn

By the end of this tutorial, you'll be able to:
- [Outcome 1]
- [Outcome 2]

## Prerequisites

- [What you need before starting]
- [Prior knowledge required]

## Step 1: [First Major Step]

[Context: Why we're doing this step]

[Detailed instructions]

```example
[Code or input example if applicable]
```

**Checkpoint:** At this point, you should see [expected state].

## Step 2: [Second Major Step]

[Continue pattern...]

## Step 3: [Third Major Step]

[Continue pattern...]

## Summary

Congratulations! You've successfully [what they accomplished].

### What You Learned

- [Key takeaway 1]
- [Key takeaway 2]

### Next Steps

- [What to try next]
- [Related tutorials]

### Need Help?

If you ran into issues, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](mailto:support@example.com).
```

### How-To Guide Template (Shorter, Task-Focused)

```markdown
# How to [Specific Task]

## Quick Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Detailed Instructions

### Step 1: [Action]

[Details...]

### Step 2: [Action]

[Details...]

### Step 3: [Action]

[Details...]

## Troubleshooting

**Problem:** [Common issue]
**Solution:** [How to fix it]
```

---

## Step 5 — Write FAQ and Troubleshooting

Address common questions and problems before users need to contact support.

### FAQ Template

```markdown
# Frequently Asked Questions: [Feature Name]

## General

### What is [feature]?

[Clear, simple explanation]

### Who can use [feature]?

[Access/permission requirements]

### How much does [feature] cost?

[Pricing or "included in your plan"]

## Using [Feature]

### How do I [common task]?

[Brief answer with link to detailed guide]

See: [Detailed Guide](./guide.md#task)

### Can I [common question about capability]?

[Yes/No with explanation]

### What happens if [common concern]?

[Clear answer addressing the concern]

## Account & Access

### I forgot my password. How do I reset it?

[Steps or link to guide]

### Why can't I access [feature]?

[Common reasons and solutions]

## Troubleshooting

### I'm getting an error that says "[error message]"

[Explanation and solution]

### [Feature] isn't working as expected

[Diagnostic steps]

---

**Still have questions?** [Contact Support](mailto:support@example.com)
```

### Troubleshooting Guide Template

```markdown
# Troubleshooting: [Feature Name]

## Quick Fixes

Before diving into specific issues, try these common solutions:

1. **Refresh the page** — Clears temporary issues
2. **Clear your browser cache** — Removes outdated data
3. **Try a different browser** — Rules out browser-specific issues
4. **Check your internet connection** — Ensures connectivity

---

## Common Issues

### [Issue 1: Error Message or Symptom]

**Symptoms:**
- [What the user sees]
- [What happens or doesn't happen]

**Cause:**
[Why this happens]

**Solution:**

1. [Step to fix]
2. [Step to fix]
3. [Step to fix]

**Still not working?** [Contact support](mailto:support@example.com) with error code: `[ERROR_CODE]`

---

### [Issue 2: Error Message or Symptom]

[Same structure...]

---

## Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| `ERR_001` | [Description] | [Quick fix or link] |
| `ERR_002` | [Description] | [Quick fix or link] |

---

## Contact Support

If you've tried the solutions above and still need help:

- **Email:** support@example.com
- **Include:** Your username, what you were trying to do, and any error messages
```

---

## Step 6 — Create In-App Help Text

Write contextual help that appears within the application UI.

### In-App Help Types

| Type | Purpose | Example |
|------|---------|---------|
| **Field labels** | Identify form fields | "Email address" |
| **Placeholder text** | Show expected format | "name@example.com" |
| **Helper text** | Explain requirements | "Must be at least 10 characters" |
| **Tooltips** | Additional context on hover/tap | "We'll send a verification link to this address" |
| **Inline validation** | Real-time feedback | "Password strength: Strong" |
| **Empty states** | Guide when no data | "No orders yet. Create your first order." |
| **Error messages** | Explain what went wrong | "This email is already registered. Try logging in." |
| **Success messages** | Confirm completion | "Account created! Check your email to verify." |

### In-App Help Catalog

```
## In-App Help — [Feature Name]

─── Form: [Form Name] ──────────────────────────────────────────

Field: displayName
  Label:       "Display name"
  Placeholder: "e.g., Alex Smith"
  Helper:      "3-50 characters, letters and numbers only"
  Error:       "Display name must be 3-50 characters with no special characters"

Field: email
  Label:       "Email address"
  Placeholder: "name@example.com"
  Helper:      "We'll send a verification link to this address"
  Tooltip:     "Use an email you have access to — you'll need to verify it"
  Error:       "Enter a valid email address"
  Error:       "This email is already registered. [Log in instead?](#login)"

Field: password
  Label:       "Password"
  Placeholder: "Create a strong password"
  Helper:      "At least 10 characters with uppercase, number, and symbol"
  Strength:    "Weak" / "Fair" / "Good" / "Strong"
  Error:       "Password needs at least 10 characters"
  Error:       "Add an uppercase letter, number, and symbol"

─── Actions ────────────────────────────────────────────────────

Button: Submit
  Label:       "Create Account"
  Loading:     "Creating your account..."
  Success:     "Account created! Check your email to verify."

─── Empty States ───────────────────────────────────────────────

No data: [Page/Section name]
  Title:       "No [items] yet"
  Description: "[What the user can do to add items]"
  Action:      "[Button text]"
```

### Error Message Guidelines

| Guideline | Bad | Good |
|-----------|-----|------|
| **Be specific** | "Invalid input" | "Email must include @ and a domain" |
| **Be helpful** | "Error 400" | "This email is already registered. Try logging in." |
| **Use plain language** | "Validation failed" | "Please fix the highlighted fields" |
| **Offer next steps** | "Request failed" | "Something went wrong. Try again or contact support." |
| **Don't blame users** | "You entered wrong data" | "Please check your email format" |

---

## Output Document Template

```markdown
# User Documentation — [Feature Name]

## 1. User Analysis
[From Step 1 — who uses this and what they want to accomplish]

## 2. Documentation Matrix
[From Step 2 — what types of docs are needed]

## 3. User Guide
[From Step 3 — comprehensive feature reference]

## 4. Tutorials / How-To Guides
[From Step 4 — step-by-step walkthroughs]

## 5. FAQ
[From Step 5 — common questions and answers]

## 6. Troubleshooting Guide
[From Step 5 — common problems and solutions]

## 7. In-App Help Catalog
[From Step 6 — all UI text, labels, messages]

## 8. Assets Needed
| Asset | Description | Status |
|-------|-------------|--------|
| [screenshot-1.png] | [What it shows] | Needed |
| [video-tutorial.mp4] | [What it demonstrates] | Needed |

## 9. Review Checklist
- [ ] All user tasks are documented
- [ ] Language is clear and jargon-free
- [ ] Steps are numbered and verifiable
- [ ] Screenshots/visuals are included or noted
- [ ] FAQ covers known support questions
- [ ] In-app text is concise and helpful
- [ ] Documentation reviewed by non-technical reader
```

---

## Traceability

User documentation traces back to scenarios and test cases:

```
SC-xxx-001 (Scenario: User registers account)
    │
    ├── TC-xxx-001 (Happy path)    → User Guide: "Create Account" section
    ├── TC-xxx-002 (Validation)    → In-App: Error messages
    ├── TC-xxx-003 (Duplicate)     → Troubleshooting: "Email already registered"
    │
    └── User Documentation
        ├── User Guide
        ├── Tutorial: "Getting Started"
        ├── FAQ: "How do I create an account?"
        ├── Troubleshooting: "Registration issues"
        └── In-App Help: Form fields, buttons, messages
```

This ensures every tested scenario has corresponding user documentation, and users can find help for any situation covered by the test suite.
