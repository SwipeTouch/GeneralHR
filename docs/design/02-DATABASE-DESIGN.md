# Database Design (Minimal Scope)

## 1. Entity overview

```
Tenant ──┬── User
         ├── Candidate ──┬── CandidateComment
         │               └── CandidateDocument
         ├── Employee ──┬── EmployeeSalaryLine
         │               └── AttendanceRecord
         ├── SalaryHead
         └── TenantSettings (payroll URL, attendance defaults, …)
```

## 2. Candidate status enum

Stored as `ENUM` or string with application validation:

| Value | Label |
|-------|--------|
| `NOT_STARTED` | Not Started |
| `SCREENED` | Screened |
| `TECH_ROUND_1` | Tech Round - 1 |
| `TECH_ROUND_2` | Tech Round - 2 |
| `TECH_ROUND_3` | Tech Round - 3 |
| `FINAL_ROUND` | Final Round |
| `OFFER_ROUND` | Offer Round |
| `SELECTED` | Selected |
| `OFFERED` | Offered |
| `JOINING` | Joining |
| `JOINED` | Joined |
| `NOT_INTERESTED` | Not Interested |
| `NOT_RESPONDING` | Not Responding |

Portal upload access: typically when status is `OFFERED` or later (`JOINING`, `JOINED`) — configurable in app settings if needed; default **`OFFERED` and above except terminal negatives**.

## 3. Core tables

### tenants

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| name | VARCHAR | |
| subdomain | VARCHAR | UNIQUE |
| status | ENUM | active, inactive |
| created_at, updated_at | DATETIME | |

### users

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| email | VARCHAR | UNIQUE per tenant |
| password_hash | VARCHAR | |
| role | ENUM | system_admin, hr_admin, candidate |
| candidate_id | UUID | NULL; set when role=candidate |
| is_active | BOOLEAN | |
| created_at, updated_at | DATETIME | |

### candidates

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| full_name | VARCHAR | |
| email | VARCHAR | |
| phone | VARCHAR | NULL |
| status | ENUM | See status list |
| notes | TEXT | NULL optional short note |
| portal_enabled | BOOLEAN | Allow upload portal |
| created_at, updated_at | DATETIME | |
| created_by | UUID | FK users |

Indexes: `(tenant_id, status)`, `(tenant_id, email)`

### candidate_comments

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| candidate_id | UUID | FK |
| content | TEXT | Interaction note |
| created_by | UUID | FK users |
| created_at | DATETIME | **Immutable** — sort DESC for timeline |

No edit/delete in v1 (append-only audit trail).

### candidate_documents

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| candidate_id | UUID | FK |
| document_type | VARCHAR | e.g. ID_PROOF, PAN, … from tenant config or free label |
| file_name | VARCHAR | |
| file_path | VARCHAR | Server path |
| mime_type | VARCHAR | |
| file_size | INT | Max 5 MB enforced in API |
| status | ENUM | draft, submitted |
| is_locked | BOOLEAN | TRUE after submit; FALSE if admin unlocked |
| unlocked_by | UUID | NULL |
| unlocked_at | DATETIME | NULL |
| submitted_at | DATETIME | NULL |
| uploaded_at | DATETIME | |
| updated_at | DATETIME | |

**Rules:**

- While `status = draft` and `is_locked = false`: candidate may upload/replace.
- On **Submit**: set `status = submitted`, `is_locked = true`, `submitted_at = now`.
- **Admin unlock**: set `is_locked = false`, record `unlocked_by` / `unlocked_at`; candidate may edit again until next submit.

### document_upload_notifications (optional log)

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | |
| candidate_id | UUID | |
| notified_at | DATETIME | |
| channel | VARCHAR | email |

Or derive from `submitted_at` + email log table — keep simple in v1.

### employees

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| employee_code | VARCHAR | UNIQUE per tenant |
| full_name | VARCHAR | |
| email | VARCHAR | NULL |
| phone | VARCHAR | NULL |
| department | VARCHAR | NULL simple text or FK later |
| joining_date | DATE | NULL |
| status | ENUM | active, inactive |
| created_at, updated_at | DATETIME | |

### salary_heads

Configurable compensation components (system admin / settings).

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| code | VARCHAR | e.g. BASIC, HRA |
| name | VARCHAR | |
| type | ENUM | earning, deduction |
| is_taxable | BOOLEAN | optional |
| sort_order | INT | |
| is_active | BOOLEAN | |

### employee_salary_lines

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| employee_id | UUID | FK |
| salary_head_id | UUID | FK |
| amount | DECIMAL(12,2) | |
| effective_from | DATE | NULL |
| updated_at | DATETIME | |

Unique: `(employee_id, salary_head_id)` for current row or version by effective_from.

### attendance_records

| Column | Type | Notes |
|--------|------|--------|
| id | UUID | PK |
| tenant_id | UUID | FK |
| employee_id | UUID | FK |
| date | DATE | |
| check_in | TIME | NULL |
| check_out | TIME | NULL |
| source | ENUM | biometric, manual, file_import |
| external_ref | VARCHAR | NULL biometric punch id |
| created_at | DATETIME | |

Unique: `(tenant_id, employee_id, date)` — last write wins on re-import.

### tenant_settings

| Column | Type | Notes |
|--------|------|--------|
| tenant_id | UUID | PK |
| payroll_php_base_url | VARCHAR | |
| payroll_api_key | VARCHAR | encrypted at rest recommended |
| payroll_sync_enabled | BOOLEAN | |
| attendance_import_format | JSON | Assumed column mapping |
| allowed_document_types | JSON | |
| max_upload_mb | INT | default 5 |

## 4. Prisma notes

- Use `@@index([tenantId, status])` on candidates.
- Cascade delete comments/documents when candidate deleted (admin only).

## 5. Out of scope (tables not created)

Recruitment cases, interviews, offers workflow, leave, exit, lifetime, RBAC permission matrix, workflow_configurations, etc. — see [archive](../archive/v1-full-hrms/).
