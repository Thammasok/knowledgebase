# ADR-004: AES-256 Encryption for BYOK API Keys at Rest

**Status:** Accepted
**Date:** 2026-03-28
**Scenario:** SC-AI-002, SC-AI-003
**Deciders:** Architecture team

---

## Context

Personal and Startup users supply their own API keys (OpenAI, Gemini, Anthropic). These keys must be:
- Stored in the database
- Used at runtime for AI API calls
- Never exposed in any API response
- Protected if the database is compromised

---

## Decision

Encrypt API keys using **AES-256-GCM** with a **per-record IV** before persisting to PostgreSQL.

- Encryption key sourced from environment variable `ENCRYPTION_KEY` (32-byte hex)
- IV (12 bytes) generated randomly per encryption operation; stored alongside ciphertext
- Storage format: `{iv_hex}:{ciphertext_hex}` in `api_key_encrypted` column
- API responses: key field returned as `"sk-****"` (masked) or omitted entirely

```typescript
// Encryption (service layer — never in controller)
function encryptApiKey(rawKey: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY_BUFFER, iv);
  const encrypted = Buffer.concat([cipher.update(rawKey, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${tag.toString('hex')}`;
}

function decryptApiKey(stored: string): string {
  const [ivHex, encHex, tagHex] = stored.split(':');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY_BUFFER, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return decipher.update(Buffer.from(encHex, 'hex')) + decipher.final('utf8');
}
```

---

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Store plaintext | Simple | Catastrophic if DB compromised |
| bcrypt hash | Irreversible (secure for passwords) | Cannot decrypt for use at runtime |
| AWS KMS / external key vault | Key never touches app server | External dependency; cost; latency |
| **AES-256-GCM + env key** ✓ | No external dependency; reversible; authenticated encryption | Key rotation requires re-encryption of all rows |

---

## Consequences

### Positive
- Keys cannot be read from a DB dump alone (requires both DB + `ENCRYPTION_KEY` env var)
- GCM mode provides integrity verification (detects tampering)
- No external dependencies

### Negative
- If `ENCRYPTION_KEY` is leaked alongside DB, keys are exposed — mitigate with secrets management (e.g. Vault, AWS Secrets Manager) in production
- Key rotation requires a migration job
- Encryption/decryption adds minor CPU overhead per AI request (negligible)

---

## Related

- SC-AI-003 (API key never returned in response)
- TC-AI-006 (Test: raw key not in GET /ai/settings response)
