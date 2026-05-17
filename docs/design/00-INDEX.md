# GeneralHR — Design Index (Minimal Scope)

## Product summary

A **minimal** multi-tenant HR application:

1. **Recruitment** — Candidate list with status and timestamped comments; export; simple document upload for offered candidates.
2. **HR** — Same candidate list with document-upload visibility; admin unlock for locked uploads.
3. **Staff & attendance** — Employee entry (single or bulk); attendance via biometric hook, manual entry, or file upload.
4. **Compensation** — Configurable salary structure heads and per-employee amounts with calculation preview.
5. **Payroll** — Pluggable integration with an **existing PHP payroll system** (not built here).

No hiring workflows, leave management, exit portals, or lifetime access in this scope.

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [System Architecture](./01-SYSTEM-ARCHITECTURE.md) | Stack, deployment (Plesk/VPS), modules at a glance |
| 02 | [Database Design](./02-DATABASE-DESIGN.md) | Tables and relationships for minimal scope |
| 03 | [API Design](./03-API-DESIGN.md) | REST endpoints |
| 04 | [Recruitment Module](./04-RECRUITMENT-MODULE.md) | Candidates, comments, uploads, export |
| 05 | [Staff & Attendance](./05-STAFF-ATTENDANCE.md) | Employees, bulk import, attendance sources |
| 06 | [Compensation & Payroll](./06-COMPENSATION-PAYROLL.md) | Salary heads, calculation, PHP payroll plug-in |
| 07 | [Auth & Roles](./07-AUTH-ROLES.md) | Simple roles and permissions |

## Archive

Full v1 design: [../archive/v1-full-hrms/](../archive/v1-full-hrms/)

## Review checklist

- [ ] Candidate statuses and comment model match business needs
- [ ] Upload lock / admin unlock behavior is clear
- [ ] Attendance import assumptions are acceptable for v1
- [ ] Salary head model supports your payroll handoff
- [ ] PHP payroll integration boundaries are clear
