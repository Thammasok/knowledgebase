# Database Schema — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-scenarios.md
**Date:** 2026-03-28

All tables use PostgreSQL via Prisma ORM. UUID primary keys. `created_at` / `updated_at` on every table.

---

## AUTH — users, tokens

### Table: `users`

Stores registered user accounts for all tiers.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| display_name | VARCHAR(50) | No | — | CHECK(length ≥ 2) |
| email | VARCHAR(255) | No | — | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | Yes | NULL | NULL when OAuth-only user |
| tier | ENUM('free','personal','startup') | No | 'free' | NOT NULL |
| email_verified | BOOLEAN | No | false | — |
| oauth_provider | VARCHAR(50) | Yes | NULL | 'google' \| 'github' \| NULL |
| oauth_provider_id | VARCHAR(255) | Yes | NULL | — |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| users_pkey | id | PK | Primary key |
| users_email_unique | email | UNIQUE | Enforce email uniqueness |
| users_oauth_idx | oauth_provider, oauth_provider_id | BTREE | OAuth upsert lookup |

**Notes:**
- `password_hash` is bcrypt (cost 12); never returned in API responses
- `tier` drives all feature gates throughout the application
- Scenario: SC-AUTH-001, SC-AUTH-002, SC-AUTH-003

---

### Table: `email_verification_tokens`

Short-lived tokens for email address verification.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK → users.id ON DELETE CASCADE |
| token | VARCHAR(255) | No | — | UNIQUE |
| expires_at | TIMESTAMPTZ | No | — | now() + 24h |
| used_at | TIMESTAMPTZ | Yes | NULL | Set when consumed |
| created_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| evt_token_unique | token | UNIQUE |
| evt_user_id_idx | user_id | BTREE |

**Notes:**
- Token expires after 24 hours (BC-3 US-AUTH-001)
- Max 3 resend requests tracked via Redis (rate limit key: `verify_resend:{email}`)
- Scenario: SC-AUTH-009

---

### Table: `refresh_tokens`

Persistent refresh tokens for silent access token renewal.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK → users.id ON DELETE CASCADE |
| device_id | VARCHAR(255) | No | — | From `x-device-id` header |
| token_hash | VARCHAR(255) | No | — | UNIQUE (SHA-256 of raw token) |
| expires_at | TIMESTAMPTZ | No | — | now() + 30 days |
| revoked_at | TIMESTAMPTZ | Yes | NULL | Set on logout or rotation |
| created_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| rt_token_hash_unique | token_hash | UNIQUE |
| rt_user_device_idx | user_id, device_id | BTREE |

**Notes:**
- Raw token returned to client; only hash stored in DB
- One token per device_id; re-login on same device rotates token
- Scenario: SC-AUTH-007

---

## WORKSPACE — workspaces, membership

### Table: `workspaces`

Top-level container for all user content.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| name | VARCHAR(100) | No | — | CHECK(length ≥ 2) |
| slug | VARCHAR(120) | No | — | UNIQUE |
| type | ENUM('personal','shared') | No | 'personal' | — |
| owner_id | UUID | No | — | FK → users.id |
| block_count | INTEGER | No | 0 | CHECK(≥ 0) |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| workspaces_pkey | id | PK |
| workspaces_slug_unique | slug | UNIQUE |
| workspaces_owner_idx | owner_id | BTREE |

**Notes:**
- `block_count` is a denormalized counter updated on every block create/delete; avoids COUNT(*) queries
- `slug` auto-generated from name (kebab-case, unique suffix appended on collision)
- `type: "shared"` only allowed when owner tier = 'startup'
- Scenario: SC-WS-001, SC-WS-003, SC-WS-004

---

### Table: `workspace_members`

Tracks membership and roles for shared (Startup) workspaces.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| user_id | UUID | No | — | FK → users.id ON DELETE CASCADE |
| role | ENUM('owner','member','viewer') | No | 'member' | — |
| joined_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| wm_workspace_user_unique | workspace_id, user_id | UNIQUE |
| wm_workspace_idx | workspace_id | BTREE |
| wm_user_idx | user_id | BTREE |

**Notes:**
- Owner is auto-inserted on workspace creation
- Personal workspaces do not use this table; owner_id on workspaces suffices
- Scenario: SC-COLLAB-004, SC-COLLAB-005

---

### Table: `workspace_invitations`

Pending invitations sent to join a shared workspace.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| invited_by | UUID | No | — | FK → users.id |
| email | VARCHAR(255) | No | — | — |
| role | ENUM('member','viewer') | No | 'member' | — |
| token | VARCHAR(255) | No | — | UNIQUE |
| status | ENUM('pending','accepted','expired') | No | 'pending' | — |
| expires_at | TIMESTAMPTZ | No | — | now() + 7 days |
| accepted_at | TIMESTAMPTZ | Yes | NULL | — |
| created_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| wi_token_unique | token | UNIQUE |
| wi_workspace_email_idx | workspace_id, email | BTREE |
| wi_status_idx | status | BTREE |

**Unique constraint:** One pending invite per (workspace_id, email) — enforced at application level before insert.
- Scenario: SC-COLLAB-001, SC-COLLAB-002, SC-COLLAB-003

---

## CONTENT ORGANIZATION — folders, pages, blocks

### Table: `folders`

Hierarchical folder structure within a workspace.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| parent_folder_id | UUID | Yes | NULL | FK → folders.id (self-referential) |
| name | VARCHAR(100) | No | — | CHECK(length ≥ 1) |
| depth | INTEGER | No | 1 | CHECK(depth ≤ 3) |
| created_by | UUID | No | — | FK → users.id |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| folders_workspace_idx | workspace_id | BTREE |
| folders_parent_idx | parent_folder_id | BTREE |

**Notes:**
- `depth` is enforced at application layer before insert; max 3 (BC-2 US-ORG-001)
- Scenario: SC-ORG-001, SC-ORG-002

---

### Table: `pages`

Core content entity. Each page holds Editor.js block JSON.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| folder_id | UUID | Yes | NULL | FK → folders.id ON DELETE SET NULL |
| parent_page_id | UUID | Yes | NULL | FK → pages.id (self-referential) |
| title | VARCHAR(255) | No | 'Untitled' | CHECK(length ≥ 1) |
| content | JSONB | Yes | '{"blocks":[]}' | Editor.js block array |
| block_count | INTEGER | No | 0 | CHECK(≥ 0) — blocks in this page |
| depth | INTEGER | No | 1 | CHECK(depth ≤ 5) |
| created_by | UUID | No | — | FK → users.id |
| deleted_at | TIMESTAMPTZ | Yes | NULL | Soft delete |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| pages_workspace_idx | workspace_id | BTREE |
| pages_folder_idx | folder_id | BTREE |
| pages_parent_idx | parent_page_id | BTREE |
| pages_deleted_at_idx | deleted_at | BTREE | Filter soft-deleted |

**Notes:**
- `content` is full Editor.js JSON; block_count maintained via trigger or app logic
- Auto-save debounce: 2 seconds (BC-1 US-PAGE-001) — frontend responsibility
- Scenario: SC-ORG-001, SC-ORG-003, SC-ORG-004, SC-ORG-005

---

### Table: `page_versions`

Immutable snapshots created on every auto-save. Retained for 90 days.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| page_id | UUID | No | — | FK → pages.id ON DELETE CASCADE |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| content | JSONB | No | — | Snapshot of page.content at save time |
| block_count | INTEGER | No | 0 | Snapshot of block count |
| created_by | UUID | No | — | FK → users.id |
| created_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| pv_page_created_idx | page_id, created_at DESC | BTREE |

**Cleanup:** Cron job deletes rows where `created_at < now() - 90 days`.
- Scenario: SC-VERSION-001, SC-VERSION-002

---

## CONTENT CAPTURE — diary, files, links

### Table: `diary_entries`

Private, date-anchored entries per user per workspace.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| user_id | UUID | No | — | FK → users.id ON DELETE CASCADE |
| entry_date | DATE | No | — | — |
| content | JSONB | Yes | '{"blocks":[]}' | Editor.js block array |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| diary_user_date_unique | user_id, workspace_id, entry_date | UNIQUE |
| diary_user_ws_idx | user_id, workspace_id | BTREE |

**Notes:**
- One entry per (user_id, workspace_id, entry_date) — unique constraint enforces BC-1
- Diary is NEVER included in workspace-level queries scoped to a team
- Scenario: SC-DIARY-001, SC-DIARY-002, SC-DIARY-003, SC-DIARY-004

---

### Table: `files`

Metadata for uploaded files. Binaries stored in MongoDB (or S3).

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| page_id | UUID | Yes | NULL | FK → pages.id ON DELETE SET NULL |
| uploaded_by | UUID | No | — | FK → users.id |
| filename | VARCHAR(255) | No | — | — |
| mime_type | VARCHAR(100) | No | — | — |
| size_bytes | BIGINT | No | — | CHECK(≥ 0) |
| storage_key | VARCHAR(500) | No | — | Path/key in MongoDB/S3 |
| status | ENUM('uploading','processing','indexed','stored','failed') | No | 'uploading' | — |
| qdrant_collection | VARCHAR(100) | Yes | NULL | Collection name if indexed |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| files_workspace_idx | workspace_id | BTREE |
| files_status_idx | status | BTREE |

**Notes:**
- `status: "indexed"` only for PDF/MD/DOC/DOCX/XLSX (indexable types)
- Images get `status: "stored"` — never indexed for RAG
- Scenario: SC-FILE-001, SC-FILE-002, SC-FILE-003, SC-FILE-004

---

### Table: `links`

Saved URLs, optionally crawled and indexed for RAG.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| created_by | UUID | No | — | FK → users.id |
| url | TEXT | No | — | — |
| title | VARCHAR(500) | Yes | NULL | Extracted from crawl |
| description | TEXT | Yes | NULL | Extracted from crawl |
| status | ENUM('saved','crawled','crawl_failed','indexed') | No | 'saved' | — |
| last_crawled_at | TIMESTAMPTZ | Yes | NULL | — |
| last_indexed_at | TIMESTAMPTZ | Yes | NULL | — |
| qdrant_collection | VARCHAR(100) | Yes | NULL | — |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| links_workspace_idx | workspace_id | BTREE |
| links_status_idx | status | BTREE |
| links_last_crawled_idx | last_crawled_at | BTREE |

**Notes:**
- Free tier: `status` stays `"saved"` — no crawl, no indexing
- Manual recrawl throttle: `last_crawled_at > now() - 1 hour` checked at application level
- Scenario: SC-LINK-001, SC-LINK-002, SC-LINK-003, SC-LINK-004, SC-LINK-005

---

## AI — model configs, conversations, messages

### Table: `ai_model_configs`

BYOK API key configurations per user.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK → users.id ON DELETE CASCADE |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| provider | ENUM('openai','gemini','anthropic','ollama','platform') | No | — | — |
| api_key_encrypted | TEXT | Yes | NULL | AES-256 encrypted; NULL for Ollama |
| base_url | TEXT | Yes | NULL | For Ollama only |
| model_name | VARCHAR(100) | Yes | NULL | Optional model override |
| is_active | BOOLEAN | No | true | — |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| aimc_user_ws_idx | user_id, workspace_id | BTREE |
| aimc_user_provider_idx | user_id, provider | BTREE |

**Constraints:**
- Personal tier: max 1 active config per user (enforced at app layer)
- Startup tier: multiple configs allowed
- `api_key_encrypted` NEVER returned in API responses — masked as `"sk-****"`
- Scenario: SC-AI-002, SC-AI-003

---

### Table: `ai_conversations`

Chat session containers.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| workspace_id | UUID | No | — | FK → workspaces.id ON DELETE CASCADE |
| user_id | UUID | No | — | FK → users.id ON DELETE CASCADE |
| title | VARCHAR(255) | Yes | NULL | Auto-generated from first message |
| folder_scope_id | UUID | Yes | NULL | FK → folders.id — scoped RAG |
| model_config_id | UUID | Yes | NULL | FK → ai_model_configs.id |
| created_at | TIMESTAMPTZ | No | now() | — |
| updated_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| aic_user_ws_idx | user_id, workspace_id | BTREE |

**Retention:** Oldest conversations purged when count exceeds 30 (Free) or 100 (Personal/Startup) per user per workspace.
- Scenario: SC-AI-001, SC-AI-004

---

### Table: `ai_messages`

Individual messages within a conversation.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| conversation_id | UUID | No | — | FK → ai_conversations.id ON DELETE CASCADE |
| role | ENUM('user','assistant') | No | — | — |
| content | TEXT | No | — | — |
| sources | JSONB | Yes | NULL | Array of `{ type, title, url }` |
| created_at | TIMESTAMPTZ | No | now() | — |

**Indexes:**
| Name | Columns | Type |
|------|---------|------|
| aim_conversation_idx | conversation_id, created_at | BTREE |

- Scenario: SC-AI-001, SC-AI-004

---

## ERD — Key Relationships

```
users
  ├──< workspaces (owner_id)
  ├──< workspace_members (user_id)
  ├──< workspace_invitations (invited_by)
  ├──< refresh_tokens
  ├──< email_verification_tokens
  ├──< diary_entries
  ├──< ai_model_configs
  └──< ai_conversations

workspaces
  ├──< workspace_members
  ├──< workspace_invitations
  ├──< folders
  ├──< pages
  ├──< files
  ├──< links
  ├──< diary_entries
  ├──< ai_conversations
  └──< page_versions

folders
  ├──< folders (self: parent_folder_id)
  └──< pages (folder_id)

pages
  ├──< pages (self: parent_page_id)
  └──< page_versions

ai_conversations
  └──< ai_messages
```

---

## Prisma Enums

```prisma
enum Tier {
  free
  personal
  startup
}

enum WorkspaceType {
  personal
  shared
}

enum WorkspaceRole {
  owner
  member
  viewer
}

enum InvitationStatus {
  pending
  accepted
  expired
}

enum FileStatus {
  uploading
  processing
  indexed
  stored
  failed
}

enum LinkStatus {
  saved
  crawled
  crawl_failed
  indexed
}

enum AIProvider {
  openai
  gemini
  anthropic
  ollama
  platform
}

enum MessageRole {
  user
  assistant
}
```
