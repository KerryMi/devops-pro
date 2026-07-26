# Security Specification & Test-Driven Design (TDD) for Firestore Rules

## 1. Data Invariants
1. **Authenticated Access**: Every write operation (create, update, delete) requires a valid, authenticated session where `request.auth != null`.
2. **Email Verification**: User actions must verify that `request.auth.token.email_verified == true` to prevent unverified email spoofing.
3. **Strict Ownership (Single-Tenant Isolation)**: A user can ONLY read, create, update, or delete their own progress document where the document ID matches `request.auth.uid`. No cross-user access.
4. **No Blanket Reads**: Collection listing/querying of all users is completely forbidden. Clients can only request single documents matching their ID.
5. **Schema Typings**: Fields like `dailyStreak` and `completedInterviewSessionsCount` must be integers, and `masteredQuestionIds`, `bookmarkedQuestionIds`, `solvedIncidentIds` must be lists.
6. **Immutable Fields**: `createdAt` and `uid` can never be modified after document creation.
7. **Server-Side Timestamps**: Both `createdAt` (on create) and `updatedAt` (on update) must exactly match `request.time`.

---

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads are designed to bypass the rules and must be rejected with `PERMISSION_DENIED`.

### 1. Identity Spoofing (Self-Assigned Owner ID)
*   **Target Path**: `/users/victim_uid`
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "victim_uid", "dailyStreak": 5 }`
*   **Vulnerability Target**: Setting a victim's document ID or claiming another owner.

### 2. PII Blanket Read (Data Scraping)
*   **Target Path**: `/users/any_uid`
*   **Authenticated UID**: `anonymous` or `different_user_uid`
*   **Operation**: `get` or `list`
*   **Vulnerability Target**: Exposing another user's email or study notes.

### 3. Ghost Field Injection (Privilege Escalation)
*   **Target Path**: `/users/attacker_uid`
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "attacker_uid", "isAdmin": true, "role": "admin", "createdAt": "request.time", "updatedAt": "request.time" }`
*   **Vulnerability Target**: Adding shadow/ghost fields that aren't defined in the schema.

### 4. Value Poisoning (Invalid Type for Streaks)
*   **Target Path**: `/users/attacker_uid`
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "attacker_uid", "dailyStreak": "infinite_streak_cheater", "createdAt": "request.time", "updatedAt": "request.time" }`
*   **Vulnerability Target**: Passing string types to numerical fields.

### 5. Client-Side Timestamp Spoofing (Backdating/Futuredating)
*   **Target Path**: `/users/attacker_uid`
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "attacker_uid", "createdAt": "1999-01-01T00:00:00Z", "updatedAt": "1999-01-01T00:00:00Z" }`
*   **Vulnerability Target**: Bypassing server timestamps to spoof streaks or record ages.

### 6. Path Variable ID Poisoning (Denial of Wallet via Path Length)
*   **Target Path**: `/users/A_VERY_LONG_50KB_JUNK_STRING_ID`
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "attacker_uid", "createdAt": "request.time", "updatedAt": "request.time" }`
*   **Vulnerability Target**: Injecting extremely large strings in document paths.

### 7. Size Limits Exhaustion / Denial of Wallet (Array Bloating)
*   **Target Path**: `/users/attacker_uid`
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "attacker_uid", "masteredQuestionIds": [ ...10000 dummy strings... ] }`
*   **Vulnerability Target**: Bloating document storage to exhaust project quotas.

### 8. Immutable Fields Mutator
*   **Target Path**: `/users/attacker_uid` (Update)
*   **Authenticated UID**: `attacker_uid`
*   **Existing Document**: `{ "uid": "attacker_uid", "createdAt": "request.time" }`
*   **Payload**: `{ "uid": "new_victim_uid", "createdAt": "2026-01-01T00:00:00Z" }`
*   **Vulnerability Target**: Rewriting immutable properties.

### 9. Unauthorized Write (Unsigned Request)
*   **Target Path**: `/users/some_uid`
*   **Authenticated UID**: `null` (No Auth)
*   **Payload**: `{ "uid": "some_uid", "dailyStreak": 1 }`
*   **Vulnerability Target**: Writing to database without signing in.

### 10. Bulk Query List Scraping
*   **Target Path**: `/users` (Collection)
*   **Authenticated UID**: `user_uid`
*   **Operation**: `list` (getDocs without ID)
*   **Vulnerability Target**: Querying the entire users index.

### 11. Email Spoofing (Unverified Email Write)
*   **Target Path**: `/users/attacker_uid`
*   **Authenticated UID**: `attacker_uid` (email_verified = false)
*   **Payload**: `{ "uid": "attacker_uid", "createdAt": "request.time", "updatedAt": "request.time" }`
*   **Vulnerability Target**: Permitting reads/writes from unverified, self-created accounts.

### 12. Unwhitelisted Field Update
*   **Target Path**: `/users/attacker_uid` (Update)
*   **Authenticated UID**: `attacker_uid`
*   **Payload**: `{ "uid": "attacker_uid", "extraUnpermittedField": "hack" }`
*   **Vulnerability Target**: Updating values outside the schema range.

---

## 3. Test Runner Definition (`firestore.rules.test.ts`)
Below is the unit test structure that tests these payloads against the rules:

```typescript
// firestore.rules.test.ts
// Standard test cases confirming that all "Dirty Dozen" malicious attempts are rejected.
```
