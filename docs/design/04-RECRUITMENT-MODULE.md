# Recruitment Module (Minimal)

## 1. Goals

- Store **candidates** with a single **status** field (enum).
- Append-only **comments** with timestamp and author (every interaction).
- **Export** candidate list (CSV/Excel).
- **Offered** candidates use a **simple upload portal** (no workflow engine).
- **HR list** shows document upload status; admin can **unlock** locked uploads.

No Kanban workflows, cases, interviews, or offer letter generation.

## 2. HR / Admin UI

### 2.1 Candidate list

| Column | Description |
|--------|-------------|
| Name | |
| Email / Phone | |
| Status | Dropdown or tag (admin can change) |
| Last comment | Preview + date |
| Documents | Icon: none / draft / submitted (e.g. 2/5 submitted) |
| Actions | Open detail, Export row, **Unlock** (if submitted & locked) |

**Filters:** status, search (name/email), has documents (yes/no/partial).

**Actions:**

- Add candidate
- Export all (filtered) → CSV

### 2.2 Candidate detail

- Header: name, contact, **status** (editable dropdown)
- **Comments timeline** (newest first): text, author, datetime
- Add comment form (HR only)
- **Documents** tab: table of uploads, lock state, download
- **Unlock** button per document or bulk unlock (admin)

### 2.3 Status change

- Admin selects new status from enum list.
- Optional: prompt for comment when status changes (auto-append comment: "Status changed to X").

## 3. Candidate statuses

```
Not Started → Screened → Tech Round 1/2/3 → Final Round → Offer Round
  → Selected → Offered → Joining → Joined

Terminal / side paths:
  Not Interested, Not Responding
```

No enforced transitions — any status → any status (admin discretion).

## 4. Comments

- Every HR interaction should be logged as a comment.
- Fields: `content`, `created_at`, `created_by` (display name).
- Display as vertical timeline.
- **Not editable or deletable** in v1.

## 5. Candidate upload portal

### 5.1 Access

- User account with `role = candidate` linked to `candidate_id`, **or**
- Magic link token (optional v1.1) — if not in v1, email + password after HR enables portal.

Portal enabled when:

- `portal_enabled = true` on candidate, and
- Status is at least **Offered** (recommended rule).

### 5.2 Upload rules

| Rule | Value |
|------|--------|
| Max size | **5 MB** per file |
| Types | PDF, PNG, JPG, JPEG |
| Before submit | Upload, replace, delete draft |
| After submit | **Locked** — no changes |
| Admin unlock | Sets `is_locked = false` — candidate can edit until submit again |

### 5.3 Submit flow

1. Candidate uploads required documents (checklist from tenant settings).
2. Clicks **Submit**.
3. API sets all draft docs to `submitted`, `is_locked = true`.
4. System sends **email notification** to HR/admin addresses.

### 5.4 UI (candidate)

- Checklist of document types
- Per row: file name, status (draft/submitted), upload/replace button (if allowed)
- Submit button (disabled until minimum docs met — configurable)
- Message after submit: "Documents submitted. Contact HR for changes."

## 6. HR document visibility

On candidate list:

- **No docs** — gray icon
- **Draft only** — yellow (in progress)
- **Submitted** — green check

Detail view: list with download links; unlock icon for admin.

## 7. Export

Export columns (minimum):

- Name, Email, Phone, Status, Created date, Last comment date, Last comment text, Document summary (e.g. "Submitted 5/5"), Joining-related fields if captured later

Format: **CSV** (v1); Excel optional.

## 8. Out of scope

- Job postings, interview scheduling, offer PDFs, case workflow, recruiter assignment, RAG assistant.

See [archive](../archive/v1-full-hrms/design/05-RECRUITMENT-MODULE.md) for the previous full design.
