# Compensation & Payroll Integration

## 1. Goals

- **Salary structure:** Admin defines **heads** (Basic, HRA, PF, etc.).
- **Per employee:** assign **amount** per head.
- **Calculate** gross / deductions / net in-app (preview only).
- **Payroll:** integrate with **existing PHP payroll system** — this Node app does not run payroll; it **syncs** master data and optionally reads payslips.

## 2. Salary heads (configuration)

### 2.1 Head fields

| Field | Description |
|-------|-------------|
| Code | Short unique code per tenant |
| Name | Display label |
| Type | `earning` or `deduction` |
| Sort order | Display order on screen |
| Active | Soft disable |

### 2.2 UI — Settings → Salary structure

Table of heads: add, edit, reorder, deactivate.

Example:

| Code | Name | Type |
|------|------|------|
| BASIC | Basic Salary | earning |
| HRA | House Rent Allowance | earning |
| PF | Provident Fund | deduction |
| PT | Professional Tax | deduction |

## 3. Employee salary allocation

### 3.1 UI — Employee → Compensation tab

Grid:

| Head | Type | Amount (₹) |
|------|------|------------|
| Basic | earning | 50,000 |
| HRA | earning | 20,000 |
| PF | deduction | 1,800 |
| … | | |

**Calculate** button shows:

```
Gross earnings:     ₹ 70,000
Total deductions:   ₹  2,500
Net (preview):      ₹ 67,500
```

This is **not** a legal payslip — preview for data entry only.

### 3.2 API

- `PUT /staff/employees/:id/salary` — replace lines
- `GET /staff/employees/:id/salary/calculate` — computed totals

## 4. PHP payroll integration (pluggable)

### 4.1 Design pattern

```
┌─────────────────────┐         HTTP (REST)          ┌─────────────────────┐
│  GeneralHR (Node)   │ ────────────────────────────▶│  Payroll PHP app    │
│  PayrollAdapter     │◀────────────────────────────│  (existing)         │
└─────────────────────┘         JSON                 └─────────────────────┘
```

**Adapter interface** (TypeScript):

```typescript
interface PayrollAdapter {
  testConnection(tenantId: string): Promise<{ ok: boolean; message?: string }>;
  syncEmployee(tenantId: string, employee: EmployeePayload): Promise<SyncResult>;
  syncEmployeeSalary(tenantId: string, employeeId: string, lines: SalaryLinePayload[]): Promise<SyncResult>;
  fetchPayslips?(tenantId: string, employeeId: string, year: number): Promise<PayslipSummary[]>;
}
```

Implementation: `PhpPayrollAdapter` reads from `tenant_settings`:

- `payroll_php_base_url` — e.g. `https://payroll.client.com/api`
- `payroll_api_key` — shared secret or Bearer token

### 4.2 Expected PHP API (contract to agree with PHP team)

Document as **integration contract** — exact paths may differ:

| Node calls | PHP endpoint (example) | Body |
|------------|------------------------|------|
| Test | `GET /health` or `POST /auth/verify` | API key |
| Sync employee | `POST /employees/upsert` | employee master JSON |
| Sync salary | `POST /employees/{code}/salary` | array of { headCode, amount } |
| Payslips | `GET /employees/{code}/payslips?year=2024` | |

PHP side remains source of truth for **pay runs, tax, statutory filings**.

### 4.3 Multi-tenant

Each tenant has its own PHP base URL (or same host with `tenant_id` in header). Node never mixes tenant data in sync calls.

### 4.4 Failure handling

- Log sync errors per employee.
- UI: "Last sync: failed" with message; retry button.
- No blocking of candidate/recruitment features if payroll is down.

### 4.5 Stub mode

`PAYROLL_ADAPTER=stub` for development — logs payloads, returns success.

## 5. What Node does NOT do

- Generate payslips
- Run monthly payroll batch
- Statutory calculations (unless duplicated in preview only)

## 6. Future optional

- Webhook from PHP → Node when payslip published (notify employee portal — out of current scope).
