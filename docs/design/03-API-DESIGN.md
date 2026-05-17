# API Design (Minimal Scope)

Base: `/api/v1`  
Auth: `Authorization: Bearer <jwt>`  
All list endpoints support `page`, `limit`, `search`, `sortBy`, `sortOrder`.

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | email, password |
| GET | `/auth/me` | Current user + role |
| POST | `/auth/logout` | |

## Recruitment — Candidates (HR / Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/recruitment/candidates` | List; filter `status`, `search`, `hasDocuments` |
| POST | `/recruitment/candidates` | Create |
| GET | `/recruitment/candidates/:id` | Detail + comments + document summary |
| PATCH | `/recruitment/candidates/:id` | Update fields, **status** |
| DELETE | `/recruitment/candidates/:id` | Optional soft-delete |
| GET | `/recruitment/candidates/export` | CSV/Excel download (same filters as list) |

## Recruitment — Comments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/recruitment/candidates/:id/comments` | Chronological (newest first) |
| POST | `/recruitment/candidates/:id/comments` | `{ "content": "..." }` |

## Recruitment — Documents (HR view)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/recruitment/candidates/:id/documents` | List uploads + lock state |
| GET | `/recruitment/documents/:id/download` | Authorized download |
| POST | `/recruitment/documents/:id/unlock` | Admin unlock for re-edit |
| POST | `/recruitment/documents/:id/lock` | Admin force lock (optional) |

## Candidate portal (role = candidate)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/portal/me` | Candidate profile + upload checklist |
| GET | `/portal/documents` | Own documents |
| POST | `/portal/documents` | Multipart upload (type, file); max 5MB; PDF/PNG/JPG/JPEG |
| PUT | `/portal/documents/:id` | Replace file if not locked |
| POST | `/portal/documents/submit` | Lock all draft docs; trigger HR notification |

Allowed MIME: `application/pdf`, `image/png`, `image/jpeg`, `image/jpg`

## Staff — Employees

| Method | Path | Description |
|--------|------|-------------|
| GET | `/staff/employees` | List |
| POST | `/staff/employees` | Create one |
| POST | `/staff/employees/bulk` | CSV upload |
| GET | `/staff/employees/:id` | Detail |
| PATCH | `/staff/employees/:id` | Update |
| DELETE | `/staff/employees/:id` | |

## Staff — Attendance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/staff/attendance` | Filter employeeId, dateFrom, dateTo |
| POST | `/staff/attendance` | Manual single day entry |
| POST | `/staff/attendance/bulk` | File import (assumed format) |
| POST | `/staff/attendance/biometric` | Webhook/push from biometric system (payload TBD) |

### Assumed file import columns (v1)

CSV headers (configurable in `tenant_settings.attendance_import_format`):

```json
{
  "employeeCode": "emp_code",
  "date": "date",
  "checkIn": "in_time",
  "checkOut": "out_time"
}
```

Date format: `YYYY-MM-DD`. Time: `HH:mm`.

## Compensation — Salary heads (Settings)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/settings/salary-heads` | List active heads |
| POST | `/settings/salary-heads` | Create head |
| PATCH | `/settings/salary-heads/:id` | Update |
| DELETE | `/settings/salary-heads/:id` | Deactivate |

## Compensation — Employee salary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/staff/employees/:id/salary` | Lines per head |
| PUT | `/staff/employees/:id/salary` | Replace all lines `[{ headId, amount }]` |
| GET | `/staff/employees/:id/salary/calculate` | Returns gross, deductions, net (preview) |

Calculation (v1):

- `gross` = sum of earning heads  
- `deductions` = sum of deduction heads  
- `net` = gross - deductions  

## Payroll integration (pluggable)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/payroll/status` | Connection test to PHP system |
| POST | `/payroll/sync/employees` | Push employee master |
| POST | `/payroll/sync/salary` | Push salary lines for employee(s) |
| GET | `/payroll/employees/:id/payslips` | Proxy read from PHP (optional) |

Adapter implemented in `apps/api/src/integrations/payroll-php/` — see [06-COMPENSATION-PAYROLL.md](./06-COMPENSATION-PAYROLL.md).

## Notifications

| Event | Action |
|-------|--------|
| Candidate submits documents | Email to tenant HR notification addresses |

## Error codes

Standard: `VALIDATION_ERROR`, `FORBIDDEN`, `NOT_FOUND`, `UPLOAD_TOO_LARGE`, `UPLOAD_LOCKED`, `INVALID_FILE_TYPE`.
