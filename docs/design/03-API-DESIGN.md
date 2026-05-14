# API Design

## 1. Overview

The HRMS API follows RESTful conventions with JSON request/response bodies. All endpoints are versioned and require authentication unless specified otherwise.

## 2. API Conventions

### 2.1 Base URL Structure

```
https://{tenant-subdomain}.hrms.com/api/v1/{module}/{resource}
```

### 2.2 HTTP Methods

| Method | Usage |
|--------|-------|
| GET | Retrieve resource(s) |
| POST | Create new resource |
| PUT | Full update of resource |
| PATCH | Partial update of resource |
| DELETE | Remove resource |

### 2.3 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ],
  "code": "VALIDATION_ERROR"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2.4 Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Permission denied |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (e.g., duplicate) |
| 422 | UNPROCESSABLE | Business logic error |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### 2.5 Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| sortBy | string | Field to sort by |
| sortOrder | string | 'asc' or 'desc' |
| search | string | Search term |
| filters | object | Filter criteria |

### 2.6 Headers

| Header | Description |
|--------|-------------|
| Authorization | Bearer {access_token} |
| X-Tenant-ID | Tenant identifier (alternative to subdomain) |
| Content-Type | application/json |
| X-Request-ID | Request tracking ID |

---

## 3. Authentication Endpoints

### 3.1 Login

**POST** `/api/v1/auth/login`

```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "userType": "employee",
      "permissions": ["EMPLOYEES:read", "MY_PROFILE:read,update"],
      "employee": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "employeeCode": "EMP001",
        "designation": "Software Engineer",
        "department": "Engineering"
      }
    }
  }
}
```

### 3.2 Refresh Token

**POST** `/api/v1/auth/refresh`

```json
// Request
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### 3.3 Logout

**POST** `/api/v1/auth/logout`

```json
// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 3.4 Forgot Password

**POST** `/api/v1/auth/forgot-password`

```json
// Request
{
  "email": "user@example.com"
}

// Response
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 3.5 Reset Password

**POST** `/api/v1/auth/reset-password`

```json
// Request
{
  "token": "reset-token",
  "password": "newPassword123!",
  "confirmPassword": "newPassword123!"
}

// Response
{
  "success": true,
  "message": "Password reset successful"
}
```

### 3.6 Get Current User

**GET** `/api/v1/auth/me`

```json
// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "userType": "employee",
    "permissions": [...],
    "employee": {...}
  }
}
```

### 3.7 Change Password

**POST** `/api/v1/auth/change-password`

```json
// Request
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123!",
  "confirmPassword": "newPassword123!"
}

// Response
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 4. Recruitment Endpoints

### 4.1 Job Postings

**GET** `/api/v1/recruitment/job-postings`

Query params: `status`, `departmentId`, `search`, `page`, `limit`

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Software Engineer",
      "department": { "id": "uuid", "name": "Engineering" },
      "location": { "id": "uuid", "name": "Bangalore" },
      "employmentType": "full_time",
      "status": "active",
      "openings": 3,
      "applicationsCount": 45,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

**POST** `/api/v1/recruitment/job-postings`

```json
// Request
{
  "title": "Software Engineer",
  "description": "We are looking for...",
  "requirements": "5+ years experience...",
  "departmentId": "uuid",
  "locationId": "uuid",
  "employmentType": "full_time",
  "experienceMin": 3,
  "experienceMax": 7,
  "salaryMin": 1000000,
  "salaryMax": 2000000,
  "showSalary": false,
  "skills": ["JavaScript", "React", "Node.js"],
  "openings": 3,
  "applicationDeadline": "2024-03-31"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    ...
  },
  "message": "Job posting created successfully"
}
```

**GET** `/api/v1/recruitment/job-postings/:id`

**PUT** `/api/v1/recruitment/job-postings/:id`

**PATCH** `/api/v1/recruitment/job-postings/:id/status`

```json
// Request
{
  "status": "active"
}
```

**DELETE** `/api/v1/recruitment/job-postings/:id`

### 4.2 Candidates

**GET** `/api/v1/recruitment/candidates`

**POST** `/api/v1/recruitment/candidates`

```json
// Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "source": "linkedin",
  "sourceDetails": "LinkedIn Jobs",
  "jobPostingId": "uuid"
}
```

**GET** `/api/v1/recruitment/candidates/:id`

### 4.3 Recruitment Cases

**GET** `/api/v1/recruitment/cases`

Query params: `stage`, `status`, `jobPostingId`, `recruiterId`, `search`, `page`, `limit`

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "caseNumber": "RC-2024-0001",
      "candidate": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "jobPosting": {
        "id": "uuid",
        "title": "Software Engineer"
      },
      "currentStage": "INTERVIEW",
      "status": "active",
      "assignedRecruiter": {
        "id": "uuid",
        "name": "HR Person"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {...}
}
```

**POST** `/api/v1/recruitment/cases`

```json
// Request (creates candidate + case)
{
  "candidate": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "source": "direct"
  },
  "jobPostingId": "uuid",
  "assignedRecruiterId": "uuid"
}
```

**GET** `/api/v1/recruitment/cases/:id`

Returns full case details including stage history, communications, interviews, offers, documents.

**PATCH** `/api/v1/recruitment/cases/:id/stage`

```json
// Request
{
  "stage": "INTERVIEW",
  "notes": "Passed screening, moving to technical interview"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "currentStage": "INTERVIEW",
    "stageHistory": [...]
  },
  "message": "Stage updated successfully"
}
```

**GET** `/api/v1/recruitment/cases/:id/timeline`

Returns chronological timeline of all case activities.

### 4.4 Communications

**GET** `/api/v1/recruitment/cases/:caseId/communications`

**POST** `/api/v1/recruitment/cases/:caseId/communications`

```json
// Request
{
  "type": "note",
  "subject": "Initial Call",
  "content": "Had a good initial conversation with the candidate...",
  "isInternal": true
}
```

### 4.5 Interviews

**GET** `/api/v1/recruitment/cases/:caseId/interviews`

**POST** `/api/v1/recruitment/cases/:caseId/interviews`

```json
// Request
{
  "roundNumber": 1,
  "roundName": "Technical Interview",
  "scheduledAt": "2024-02-01T14:00:00Z",
  "durationMinutes": 60,
  "meetingLink": "https://meet.google.com/xyz",
  "panelistIds": ["uuid1", "uuid2"]
}
```

**PATCH** `/api/v1/recruitment/interviews/:id`

```json
// Request (update status)
{
  "status": "completed"
}
```

**POST** `/api/v1/recruitment/interviews/:id/feedback`

```json
// Request
{
  "rating": 4,
  "feedback": "Strong technical skills, good communication...",
  "recommendation": "hire"
}
```

### 4.6 Offers

**POST** `/api/v1/recruitment/cases/:caseId/offers`

```json
// Request
{
  "designation": "Senior Software Engineer",
  "departmentId": "uuid",
  "baseSalary": 1500000,
  "variablePay": 300000,
  "joiningBonus": 100000,
  "otherBenefits": {
    "healthInsurance": true,
    "stockOptions": 1000
  },
  "joiningDate": "2024-03-01",
  "expiryDate": "2024-02-15"
}
```

**GET** `/api/v1/recruitment/offers/:id`

**PATCH** `/api/v1/recruitment/offers/:id`

```json
// Request (update status)
{
  "status": "approved"
}
```

**POST** `/api/v1/recruitment/offers/:id/send`

Sends offer letter to candidate via email.

**POST** `/api/v1/recruitment/offers/:id/accept`

(Candidate portal endpoint)

**POST** `/api/v1/recruitment/offers/:id/reject`

```json
// Request
{
  "reason": "Accepted another offer"
}
```

### 4.7 Documents

**GET** `/api/v1/recruitment/cases/:caseId/documents`

**POST** `/api/v1/recruitment/cases/:caseId/documents`

(Multipart form data with file)

```
documentTypeId: uuid
file: [binary]
```

**PATCH** `/api/v1/recruitment/documents/:id/verify`

```json
// Request
{
  "status": "verified"
}
// or
{
  "status": "rejected",
  "rejectionReason": "Document is not clear, please re-upload"
}
```

### 4.8 Dashboard

**GET** `/api/v1/recruitment/dashboard/stats`

```json
// Response
{
  "success": true,
  "data": {
    "totalOpenPositions": 12,
    "totalActiveCases": 87,
    "casesByStage": {
      "APPLIED": 25,
      "SCREENING": 18,
      "INTERVIEW": 22,
      "OFFER_PENDING": 8,
      "OFFER_SENT": 5,
      "DOCUMENT_UPLOAD": 4,
      "VERIFICATION": 3,
      "ONBOARDING": 2
    },
    "offersPending": 8,
    "offersAccepted": 15,
    "interviewsThisWeek": 12,
    "avgTimeToHire": 28
  }
}
```

---

## 5. HR Endpoints

### 5.1 Employees

**GET** `/api/v1/hr/employees`

Query params: `departmentId`, `designationId`, `status`, `search`, `page`, `limit`

**POST** `/api/v1/hr/employees`

```json
// Request
{
  "employeeCode": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com",
  "phone": "+91-9876543210",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "departmentId": "uuid",
  "designationId": "uuid",
  "gradeId": "uuid",
  "locationId": "uuid",
  "reportingManagerId": "uuid",
  "joiningDate": "2024-01-15",
  "employmentType": "full_time"
}
```

**GET** `/api/v1/hr/employees/:id`

**PUT** `/api/v1/hr/employees/:id`

**GET** `/api/v1/hr/employees/:id/documents`

**POST** `/api/v1/hr/employees/:id/documents`

**GET** `/api/v1/hr/employees/:id/leave-balance`

### 5.2 Departments

**GET** `/api/v1/hr/departments`

**POST** `/api/v1/hr/departments`

```json
// Request
{
  "name": "Engineering",
  "code": "ENG",
  "parentId": null,
  "headId": "uuid"
}
```

**PUT** `/api/v1/hr/departments/:id`

**DELETE** `/api/v1/hr/departments/:id`

### 5.3 Designations

**GET** `/api/v1/hr/designations`

**POST** `/api/v1/hr/designations`

**PUT** `/api/v1/hr/designations/:id`

**DELETE** `/api/v1/hr/designations/:id`

### 5.4 Leave Types

**GET** `/api/v1/hr/leave-types`

**POST** `/api/v1/hr/leave-types`

```json
// Request
{
  "name": "Casual Leave",
  "code": "CL",
  "description": "Casual leave for personal work",
  "isPaid": true,
  "requiresApproval": true,
  "requiresDocument": false,
  "minDaysNotice": 1,
  "maxConsecutiveDays": 3
}
```

**PUT** `/api/v1/hr/leave-types/:id`

**DELETE** `/api/v1/hr/leave-types/:id`

### 5.5 Leave Policies

**GET** `/api/v1/hr/leave-policies`

**POST** `/api/v1/hr/leave-policies`

```json
// Request
{
  "leaveTypeId": "uuid",
  "name": "Standard CL Policy",
  "applicableTo": "all",
  "entitlement": 12,
  "accrualType": "annual",
  "carryForwardEnabled": false,
  "minServiceDays": 0,
  "effectiveFrom": "2024-01-01"
}
```

**PUT** `/api/v1/hr/leave-policies/:id`

### 5.6 Leave Requests (HR View)

**GET** `/api/v1/hr/leave-requests`

Query params: `employeeId`, `departmentId`, `leaveTypeId`, `status`, `fromDate`, `toDate`, `page`, `limit`

**PATCH** `/api/v1/hr/leave-requests/:id/approve`

```json
// Request
{
  "status": "approved",
  "comments": "Approved"
}
// or
{
  "status": "rejected",
  "comments": "Team has critical deliverable during this period"
}
```

**GET** `/api/v1/hr/leave-balances`

Query params: `departmentId`, `year`

### 5.7 Holidays

**GET** `/api/v1/hr/holidays`

Query params: `year`, `type`

**POST** `/api/v1/hr/holidays`

```json
// Request
{
  "name": "Republic Day",
  "date": "2024-01-26",
  "type": "mandatory",
  "applicableLocations": ["uuid1", "uuid2"],
  "description": "National holiday"
}
```

**PUT** `/api/v1/hr/holidays/:id`

**DELETE** `/api/v1/hr/holidays/:id`

### 5.8 Onboarding

**GET** `/api/v1/hr/onboarding/pending`

Returns cases in ONBOARDING stage.

**POST** `/api/v1/hr/onboarding/:caseId/complete`

Completes onboarding and converts candidate to employee.

---

## 6. Employee Portal Endpoints

### 6.1 Profile

**GET** `/api/v1/employee/profile`

```json
// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@company.com",
    "phone": "+91-9876543210",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "department": { "id": "uuid", "name": "Engineering" },
    "designation": { "id": "uuid", "name": "Senior Software Engineer" },
    "grade": { "id": "uuid", "name": "L4" },
    "location": { "id": "uuid", "name": "Bangalore" },
    "reportingManager": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "designation": "Engineering Manager"
    },
    "joiningDate": "2020-03-15",
    "status": "active",
    "addresses": [...],
    "emergencyContacts": [...],
    "bankDetails": {...}
  }
}
```

**PATCH** `/api/v1/employee/profile`

```json
// Request (only allowed fields)
{
  "phone": "+91-9876543211",
  "addresses": [
    {
      "addressType": "current",
      "addressLine1": "123 Main Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "country": "India",
      "postalCode": "560001"
    }
  ],
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+91-9876543212",
      "isPrimary": true
    }
  ]
}
```

### 6.2 Leave

**GET** `/api/v1/employee/leave-balance`

```json
// Response
{
  "success": true,
  "data": [
    {
      "leaveTypeId": "uuid",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CL",
      "entitlement": 12,
      "used": 3,
      "pending": 1,
      "available": 8
    },
    {
      "leaveTypeId": "uuid",
      "leaveTypeName": "Sick Leave",
      "leaveTypeCode": "SL",
      "entitlement": 12,
      "used": 2,
      "pending": 0,
      "available": 10
    }
  ]
}
```

**POST** `/api/v1/employee/leave-requests`

```json
// Request
{
  "leaveTypeId": "uuid",
  "fromDate": "2024-02-15",
  "toDate": "2024-02-16",
  "reason": "Personal work"
}
```

**GET** `/api/v1/employee/leave-requests`

Query params: `status`, `year`, `page`, `limit`

**DELETE** `/api/v1/employee/leave-requests/:id`

(Cancel pending request)

### 6.3 Documents

**GET** `/api/v1/employee/documents`

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "documentType": "Offer Letter",
      "fileName": "offer_letter.pdf",
      "fileUrl": "https://...",
      "uploadedAt": "2020-03-01T10:00:00Z"
    }
  ]
}
```

### 6.4 Payslips

**GET** `/api/v1/employee/payslips`

Query params: `year`, `month`

(Integration endpoint - returns data from external payroll system)

### 6.5 Holidays

**GET** `/api/v1/employee/holidays`

Query params: `year`

### 6.6 Announcements

**GET** `/api/v1/employee/announcements`

### 6.7 Organization Chart

**GET** `/api/v1/employee/org-chart`

Query params: `rootEmployeeId` (optional)

---

## 7. Exit Endpoints

### 7.1 Exit Requests

**POST** `/api/v1/exit/requests`

```json
// Request (Employee initiates)
{
  "exitType": "resignation",
  "reason": "Career growth opportunity",
  "requestedLastDate": "2024-04-15"
}
```

**GET** `/api/v1/exit/requests`

(HR view - all exit requests)

Query params: `stage`, `status`, `departmentId`, `page`, `limit`

**GET** `/api/v1/exit/requests/:id`

**PATCH** `/api/v1/exit/requests/:id/stage`

```json
// Request
{
  "stage": "HR_REVIEW",
  "notes": "Approved by manager",
  "approvedLastDate": "2024-04-30"
}
```

### 7.2 Clearances

**GET** `/api/v1/exit/requests/:id/clearances`

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clearanceItemId": "uuid",
      "clearanceItemName": "Laptop Return",
      "clearanceItemDepartment": "IT",
      "status": "pending",
      "remarks": null
    },
    {
      "id": "uuid",
      "clearanceItemId": "uuid",
      "clearanceItemName": "Finance Clearance",
      "clearanceItemDepartment": "Finance",
      "status": "cleared",
      "clearedBy": "uuid",
      "clearedAt": "2024-04-20T10:00:00Z",
      "remarks": "No pending dues"
    }
  ]
}
```

**PATCH** `/api/v1/exit/clearances/:id`

```json
// Request
{
  "status": "cleared",
  "remarks": "All assets returned"
}
```

### 7.3 Exit Interview

**POST** `/api/v1/exit/requests/:id/interview`

```json
// Request
{
  "overallExperienceRating": 4,
  "wouldRecommend": true,
  "reasonForLeaving": "Better opportunity",
  "feedback": "Great team culture, learning opportunities...",
  "suggestions": "Better remote work policies"
}
```

### 7.4 Exit Documents

**GET** `/api/v1/exit/requests/:id/documents`

**POST** `/api/v1/exit/requests/:id/documents/generate`

```json
// Request
{
  "documentType": "experience_letter"
}
```

---

## 8. Configuration Endpoints

### 8.1 Config Entities

**GET** `/api/v1/config/entities`

Query params: `entityType`, `isActive`

**POST** `/api/v1/config/entities`

```json
// Request
{
  "entityType": "department",
  "name": "Engineering",
  "code": "ENG",
  "parentId": null,
  "metadata": { "costCenter": "CC001" }
}
```

**PUT** `/api/v1/config/entities/:id`

**DELETE** `/api/v1/config/entities/:id`

### 8.2 Custom Fields

**GET** `/api/v1/config/custom-fields`

Query params: `entity`

**POST** `/api/v1/config/custom-fields`

```json
// Request
{
  "entity": "employee",
  "fieldName": "t_shirt_size",
  "fieldLabel": "T-Shirt Size",
  "fieldType": "dropdown",
  "options": [
    { "value": "S", "label": "Small" },
    { "value": "M", "label": "Medium" },
    { "value": "L", "label": "Large" },
    { "value": "XL", "label": "Extra Large" }
  ],
  "isRequired": false,
  "isVisible": true
}
```

**PUT** `/api/v1/config/custom-fields/:id`

**DELETE** `/api/v1/config/custom-fields/:id`

### 8.3 Email Templates

**GET** `/api/v1/config/email-templates`

**GET** `/api/v1/config/email-templates/:id`

**PUT** `/api/v1/config/email-templates/:id`

```json
// Request
{
  "subject": "Offer Letter - {{company_name}}",
  "body": "<html>Dear {{candidate_name}},\n\nWe are pleased to offer you..."
}
```

### 8.4 Document Templates

**GET** `/api/v1/config/document-templates`

**GET** `/api/v1/config/document-templates/:id`

**PUT** `/api/v1/config/document-templates/:id`

### 8.5 Workflows

**GET** `/api/v1/config/workflows`

**GET** `/api/v1/config/workflows/:type`

**PUT** `/api/v1/config/workflows/:type`

```json
// Request
{
  "stages": [
    {
      "code": "APPLIED",
      "name": "Applied",
      "sequence": 1,
      "isRequired": true,
      "nextStages": ["SCREENING", "REJECTED"],
      "actions": [
        { "code": "advance", "name": "Move to Screening", "targetStage": "SCREENING" },
        { "code": "reject", "name": "Reject", "targetStage": "REJECTED" }
      ]
    }
  ]
}
```

---

## 9. Admin Endpoints

### 9.1 Users

**GET** `/api/v1/admin/users`

Query params: `userType`, `status`, `roleId`, `search`, `page`, `limit`

**POST** `/api/v1/admin/users`

```json
// Request
{
  "email": "newuser@company.com",
  "password": "initialPassword123!",
  "userType": "employee",
  "roleIds": ["uuid1", "uuid2"]
}
```

**PUT** `/api/v1/admin/users/:id`

**PATCH** `/api/v1/admin/users/:id/status`

```json
// Request
{
  "status": "inactive"
}
```

**GET** `/api/v1/admin/users/:id/roles`

**PUT** `/api/v1/admin/users/:id/roles`

```json
// Request
{
  "roleIds": ["uuid1", "uuid2"]
}
```

### 9.2 Roles

**GET** `/api/v1/admin/roles`

**POST** `/api/v1/admin/roles`

```json
// Request
{
  "name": "Team Lead",
  "description": "Team lead with limited HR access"
}
```

**PUT** `/api/v1/admin/roles/:id`

**DELETE** `/api/v1/admin/roles/:id`

**GET** `/api/v1/admin/roles/:id/permissions`

```json
// Response
{
  "success": true,
  "data": {
    "roleId": "uuid",
    "roleName": "Team Lead",
    "permissions": [
      {
        "menuItemId": "uuid",
        "menuItemCode": "EMPLOYEES",
        "menuItemName": "Employees",
        "permissions": {
          "create": false,
          "read": true,
          "update": false,
          "delete": false
        }
      }
    ]
  }
}
```

**PUT** `/api/v1/admin/roles/:id/permissions`

```json
// Request
{
  "permissions": [
    {
      "menuItemId": "uuid",
      "create": false,
      "read": true,
      "update": true,
      "delete": false
    }
  ]
}
```

### 9.3 Menu Items

**GET** `/api/v1/admin/menu-items`

Returns all menu items with hierarchy.

### 9.4 Audit Logs

**GET** `/api/v1/admin/audit-logs`

Query params: `userId`, `action`, `entity`, `entityId`, `fromDate`, `toDate`, `page`, `limit`

---

## 10. Notifications Endpoints

**GET** `/api/v1/notifications`

Query params: `isRead`, `page`, `limit`

**PATCH** `/api/v1/notifications/:id/read`

**POST** `/api/v1/notifications/mark-all-read`

**GET** `/api/v1/notifications/unread-count`

---

## 11. File Upload Endpoints

**POST** `/api/v1/files/upload`

Multipart form data:
```
file: [binary]
purpose: "resume" | "document" | "profile_picture"
```

**GET** `/api/v1/files/:id`

Returns pre-signed URL for file download.

**DELETE** `/api/v1/files/:id`

---

## 12. Health & Utility Endpoints

**GET** `/api/v1/health`

```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "storage": "healthy"
  }
}
```

**GET** `/api/v1/version`

```json
{
  "version": "1.0.0",
  "environment": "production"
}
```

---

## Next Steps

1. Review and approve this API design
2. Proceed to [Authentication & RBAC Design](./04-AUTH-RBAC-DESIGN.md)
