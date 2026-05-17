# GeneralHR — Requirements (Minimal Scope)

> **Supersedes** the full HRMS spec archived at [archive/v1-full-hrms/REQUIREMENTS.md](./archive/v1-full-hrms/REQUIREMENTS.md).

## 1. Product vision

A **lightweight** HR tool for small teams: track **candidates** through simple statuses and comments, collect **documents** from offered hires, maintain **staff** and **attendance**, define **salary structure**, and **hand off** to an existing **PHP payroll** system.

**Not included:** hiring workflows, leave, exit, lifetime portal, interviews, offer letters, configurable workflow engine, granular RBAC.

## 2. Modules

### 2.1 Recruitment — Candidate tracker

| Requirement | Detail |
|-------------|--------|
| Candidate list | Name, contact, status, comments summary, document status |
| Status | Enum: Not Started, Screened, Tech Round 1–3, Final Round, Offer Round, Selected, Offered, Joining, Joined, Not Interested, Not Responding |
| Comments | Append-only; timestamp + author; timeline view |
| Admin | Edit candidate; change status; add comments |
| Export | Export filtered list (CSV) |

### 2.2 Recruitment — Document upload (offered candidates)

| Requirement | Detail |
|-------------|--------|
| Portal | Simple login for offered candidate |
| File types | PDF, PNG, JPG, JPEG |
| Max size | 5 MB per file |
| Edit | Allowed until **Submit** |
| After submit | Locked; no candidate changes |
| Admin unlock | Unlock icon in HR list/detail → candidate can edit again until re-submit |
| Notification | Email HR/admin on successful submit |

### 2.3 HR view (recruitment)

| Requirement | Detail |
|-------------|--------|
| List | Same candidates; show if docs uploaded (draft/submitted) |
| Detail | Comments + documents; download; unlock |

### 2.4 Staff

| Requirement | Detail |
|-------------|--------|
| Entry | Individual screen + bulk CSV upload |
| Fields | Code, name, contact, department (simple), joining date, status |

### 2.5 Attendance

| Requirement | Detail |
|-------------|--------|
| Sources | Biometric (API/webhook), manual entry, file upload |
| File format | Assumed CSV (employee_code, date, in_time, out_time) — mapping configurable |

### 2.6 Settings — Compensation

| Requirement | Detail |
|-------------|--------|
| Salary heads | Admin creates earning/deduction heads |
| Allocation | Per-employee amount per head |
| Calculation | Preview gross, deductions, net |

### 2.7 Payroll integration

| Requirement | Detail |
|-------------|--------|
| Integration | Existing **PHP** payroll system |
| Approach | Pluggable adapter in Node; sync employees + salary; optional payslip read |
| This app | Does not run payroll |

## 3. Technical constraints

- React + Express + MySQL
- Multi-tenant (`tenant_id`)
- Deploy: Plesk / VPS friendly (local files, SMTP) — see [design/01-SYSTEM-ARCHITECTURE.md](./design/01-SYSTEM-ARCHITECTURE.md)

## 4. Design documents

Start at [design/00-INDEX.md](./design/00-INDEX.md).

## 5. Explicitly out of scope

- RAG / AI assistant (future optional)
- Leave management
- Exit / relieving / experience letters
- Interview scheduling
- Job postings
- Full workflow / case engine
- Employee self-service beyond document upload
