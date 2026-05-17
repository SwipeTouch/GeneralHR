# Staff & Attendance Module

## 1. Goals

- Maintain **employee (staff) master** data.
- Add staff **one-by-one** or **bulk CSV upload**.
- Record **attendance** via:
  1. **Biometric** integration (webhook/API — format TBD),
  2. **Manual** entry (HR screen),
  3. **File upload** (assumed CSV format).

No leave module, org chart, or employee self-service in this scope.

## 2. Employee master UI

### 2.1 List

Columns: employee code, name, email, phone, department (text), status, joining date.

Actions: Add, Import CSV, Export CSV (optional).

### 2.2 Individual entry screen

Fields:

- Employee code (required, unique per tenant)
- Full name
- Email, phone (optional)
- Department (optional text)
- Joining date
- Status: active / inactive

Save → available for attendance and salary allocation.

### 2.3 Bulk upload

**CSV template** (download from UI):

```csv
employee_code,full_name,email,phone,department,joining_date,status
EMP001,John Doe,john@example.com,+91...,Engineering,2024-01-15,active
```

Validation:

- Duplicate `employee_code` in file → error row report
- Invalid dates → skip or fail row (configurable: fail-fast vs partial import)

Response: `{ imported: 45, failed: 2, errors: [...] }`

## 3. Attendance

### 3.1 Manual entry

Screen: select employee, date, check-in time, check-out time (optional).

Source stored as `manual`.

### 3.2 File upload (assumed format)

**Default CSV** (documented in settings):

```csv
employee_code,date,in_time,out_time
EMP001,2024-03-01,09:15,18:30
EMP002,2024-03-01,09:00,
```

- `employee_code` must match existing employee.
- `date`: YYYY-MM-DD
- Times: HH:mm (24h)
- Missing `out_time` allowed (half day / still in office)

Mapping stored in `tenant_settings.attendance_import_format` so columns can be renamed without code change.

Source: `file_import`.

### 3.3 Biometric integration (pluggable)

**Assumption for v1:** external system POSTs punches to:

`POST /api/v1/staff/attendance/biometric`

Example payload (to be confirmed with vendor):

```json
{
  "employeeCode": "EMP001",
  "timestamp": "2024-03-01T09:15:00+05:30",
  "direction": "in",
  "deviceId": "BIO-01"
}
```

Adapter logic:

- Resolve employee by code + tenant (from API key header).
- Upsert attendance for that date (merge in/out from multiple punches).
- Store `external_ref` for idempotency.

If vendor format unknown: implement **stub adapter** + log raw payload table for later mapping.

### 3.4 Attendance list / report (simple)

Filter by employee, date range. Table: date, in, out, source, hours (computed).

No payroll processing here — attendance may be synced to PHP payroll separately if needed.

## 4. Settings (staff section)

Under **Settings → Staff**:

- Default department list (optional simple tags)
- Attendance CSV column mapping (JSON editor or form)
- Biometric API key for webhook auth

## 5. Out of scope

- Shift planning, overtime rules, geo-fencing, leave balance.
