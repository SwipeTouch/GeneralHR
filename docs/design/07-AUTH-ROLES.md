# Auth & Roles (Simplified)

## 1. Roles

| Role | Code | Access |
|------|------|--------|
| System admin | `system_admin` | All tenants (if platform owner) or tenant setup |
| HR / Admin | `hr_admin` | Candidates, staff, attendance, salary heads, payroll sync, unlock docs |
| Candidate | `candidate` | Own document upload portal only |

No granular CRUD matrix in v1 — role checks on routes only.

## 2. Authentication

- JWT access token (15 min)
- Refresh token in HttpOnly cookie or DB table
- Login: email + password
- Password: bcrypt

## 3. Route guards (examples)

| Route prefix | Roles |
|--------------|-------|
| `/recruitment/*` | hr_admin |
| `/portal/*` | candidate |
| `/staff/*` | hr_admin |
| `/settings/*` | hr_admin, system_admin |
| `/payroll/*` | hr_admin |

## 4. Candidate portal user

When status becomes **Offered** (or HR enables portal):

1. HR clicks "Enable portal" on candidate.
2. System creates `user` with `role=candidate`, `candidate_id`, sends email with temp password (or invite link in v1.1).

## 5. Multi-tenant

- `tenant_id` on user and all data.
- Login subdomain: `acme.yourdomain.com` → tenant `acme`.

## 6. Removed vs v1

Custom roles, permission matrix per menu item — see [archive](../archive/v1-full-hrms/design/04-AUTH-RBAC-DESIGN.md).
