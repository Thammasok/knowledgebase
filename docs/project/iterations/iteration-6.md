# Iteration 6 — Link Management & Content Crawling

**Goal:** Free users can save links as bookmarks. Personal/Startup users can trigger content crawling with text indexed in Qdrant. Rate limiting prevents abuse.

**Duration:** 1–2 weeks
**Stories in scope:** US-LINK-001, US-LINK-002
**Priority:** Must Have (bookmark) / Should Have (crawling)

---

## Scenarios in Scope

- SC-LINK-001: Free user saves bookmark
- SC-LINK-002: Free user blocked from content fetch
- SC-LINK-003: Personal user saves link with content fetch
- SC-LINK-004: Crawl failure handling
- SC-LINK-005: Link auto-refresh rate limiting (1/hr)

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-LINK-001: Free user saves valid URL as bookmark; crawlStatus = bookmark; no crawl triggered
- TC-LINK-002: Free user triggers fetch on existing link — 403 PLAN_REQUIRED
- TC-LINK-003: Personal user saves URL; crawl enqueued; crawlStatus → crawled; title + description extracted
- TC-LINK-004: Crawled link has title and description from page content
- TC-LINK-005: URL unreachable — link saved with crawlStatus = crawl_failed; retry available
- TC-LINK-006: Manual re-crawl within 1hr rejected — 429 RECRAWL_TOO_SOON

**P2 (target):**
- robots.txt disallowed URL → crawl_failed with reason
- Content truncation at 500KB (very large pages)

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-LINK-006 | Link crawler service (axios + cheerio + robots.txt) | Domain | M |
| DEV-LINK-001 | Link schema + migration | DB | S |
| DEV-LINK-002 | POST /workspace/:id/links — save URL (tier-aware) | API+Domain | M |
| DEV-LINK-003 | GET /workspace/:id/links — list links | API | S |
| DEV-LINK-004 | DELETE /workspace/:id/links/:id + Qdrant cleanup | API | S |
| DEV-LINK-005 | POST /workspace/:id/links/:id/crawl — manual re-crawl | API | S |
| DEV-LINK-007 | Background job: crawl + chunk + embed + Qdrant upsert | Integration | M |
| DEV-LINK-008 | Frontend: Link library UI + save link dialog | Frontend | M |

> **Note:** DEV-LINK-006 (crawler service) has no backend dependencies — build it in parallel with schema/API tasks (Days 1–2). DEV-SEARCH-001 and DEV-SEARCH-002 from Iteration 4 are pre-requisites for DEV-LINK-007.

---

## NFRs Enforced This Iteration

- NFR-PERF: Crawler timeout = 10 seconds per URL
- NFR-SEC: robots.txt checked before crawling — Knowledgebase-Bot respects disallow rules
- Rate limit: 1 re-crawl per hour per link (enforced server-side via lastCrawledAt check)
- Content truncation: 500KB max extracted per page

---

## Increment

At the end of Iteration 6, the following works end-to-end:

> Free users can save any valid HTTP/HTTPS URL as a bookmark in their link library, with a clear indicator that content fetching requires a Personal plan. Personal and Startup users save a URL and the system automatically crawls it in the background — extracting title, description, and body text for search indexing. If crawling fails (unreachable URL, timeout, robots.txt block), the link is saved with a "crawl failed" status and the user can retry manually (once per hour). Link content is indexed in Qdrant and will be searchable in Iteration 7.
