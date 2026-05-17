# Database Design

## 1. Overview

The HRMS application uses MySQL 8.x as the primary database with Prisma ORM for type-safe database access. The schema is designed for multi-tenancy with tenant isolation at the row level.

## 2. Entity Relationship Diagram

### 2.1 Core Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE & RBAC ENTITIES                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   TENANTS    │       │    USERS     │       │    ROLES     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │◄──────│ tenant_id    │       │ id           │
│ name         │       │ id           │◄──┐   │ tenant_id    │──────►│TENANTS│
│ subdomain    │       │ email        │   │   │ name         │
│ status       │       │ password_hash│   │   │ is_system    │
│ config (JSON)│       │ user_type    │   │   │ is_active    │
│ created_at   │       │ status       │   │   └──────────────┘
└──────────────┘       └──────────────┘   │          │
                              │           │          │
                              ▼           │          ▼
                       ┌──────────────┐   │   ┌──────────────┐
                       │  USER_ROLES  │   │   │ROLE_PERMISSIONS│
                       ├──────────────┤   │   ├──────────────┤
                       │ user_id      │───┘   │ role_id      │
                       │ role_id      │───────│ permission_id│
                       └──────────────┘       └──────────────┘
                                                     │
                                                     ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  MENU_ITEMS  │       │ PERMISSIONS  │       │              │
├──────────────┤       ├──────────────┤       │   Actions:   │
│ id           │◄──────│ menu_item_id │       │   - create   │
│ name         │       │ action       │       │   - read     │
│ code         │       │ id           │       │   - update   │
│ module       │       └──────────────┘       │   - delete   │
│ parent_id    │───┐                          └──────────────┘
│ route        │   │
│ icon         │   │
└──────────────┘   │
       ▲           │
       └───────────┘ (self-reference for hierarchy)
```

### 2.2 Recruitment Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RECRUITMENT ENTITIES                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ JOB_POSTINGS │       │  CANDIDATES  │       │RECRUITMENT   │
├──────────────┤       ├──────────────┤       │   _CASES     │
│ id           │◄──┐   │ id           │◄──┐   ├──────────────┤
│ tenant_id    │   │   │ tenant_id    │   │   │ id           │
│ title        │   │   │ user_id      │   │   │ tenant_id    │
│ description  │   │   │ first_name   │   │   │ case_number  │
│ department_id│   │   │ last_name    │   │   │ candidate_id │───┘
│ location_id  │   │   │ email        │   │   │ job_posting_id│──┘
│ employment_  │   │   │ phone        │   │   │ current_stage│
│   type       │   │   │ resume_url   │   │   │ status       │
│ salary_range │   │   │ source       │   │   │ assigned_    │
│ skills (JSON)│   │   └──────────────┘   │   │   recruiter_id│
│ status       │   │                      │   └──────────────┘
│ deadline     │   │                      │          │
└──────────────┘   │                      │          │
                   │                      │          │
                   └──────────────────────┼──────────┤
                                          │          │
                   ┌──────────────────────┼──────────┼─────────────────┐
                   │                      │          │                 │
                   ▼                      ▼          ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│CASE_STAGE    │  │CASE_COMMUNI- │  │  INTERVIEWS  │  │   OFFERS     │
│  _HISTORY    │  │  CATIONS     │  ├──────────────┤  ├──────────────┤
├──────────────┤  ├──────────────┤  │ id           │  │ id           │
│ id           │  │ id           │  │ case_id      │  │ case_id      │
│ case_id      │  │ case_id      │  │ round_number │  │ version      │
│ from_stage   │  │ type         │  │ scheduled_at │  │ designation  │
│ to_stage     │  │ subject      │  │ status       │  │ base_salary  │
│ notes        │  │ content      │  │ feedback     │  │ joining_date │
│ updated_by   │  │ sender_id    │  │ recommendation│ │ expiry_date  │
│ created_at   │  │ is_internal  │  └──────────────┘  │ status       │
└──────────────┘  │ attachments  │         │          │ offer_letter │
                  └──────────────┘         │          │   _url       │
                                           ▼          └──────────────┘
                                  ┌──────────────┐
                                  │  INTERVIEW   │
                                  │  _PANELISTS  │
                                  ├──────────────┤
                                  │ interview_id │
                                  │ user_id      │
                                  │ role         │
                                  │ feedback     │
                                  │ rating       │
                                  └──────────────┘

┌──────────────┐
│  CANDIDATE   │
│  _DOCUMENTS  │
├──────────────┤
│ id           │
│ case_id      │
│ doc_type_id  │
│ file_name    │
│ file_url     │
│ status       │ (pending/verified/rejected)
│ verified_by  │
│ verified_at  │
└──────────────┘
```

### 2.3 HR Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HR ENTITIES                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  EMPLOYEES   │       │  EMPLOYEE    │       │  EMPLOYEE    │
├──────────────┤       │  _ADDRESSES  │       │  _EMERGENCY  │
│ id           │◄──┬───├──────────────┤       │  _CONTACTS   │
│ tenant_id    │   │   │ employee_id  │       ├──────────────┤
│ user_id      │   │   │ address_type │       │ employee_id  │
│ employee_code│   │   │ address_line1│       │ name         │
│ first_name   │   │   │ city         │       │ relationship │
│ last_name    │   │   │ state        │       │ phone        │
│ email        │   │   │ country      │       │ is_primary   │
│ phone        │   │   │ postal_code  │       └──────────────┘
│ date_of_birth│   │   └──────────────┘
│ gender       │   │
│ department_id│   │   ┌──────────────┐
│ designation_ │   │   │  EMPLOYEE    │
│   id         │   └───│  _BANK_      │
│ grade_id     │       │   DETAILS    │
│ location_id  │       ├──────────────┤
│ reporting_   │       │ employee_id  │
│   manager_id │───┐   │ bank_name    │
│ joining_date │   │   │ account_no   │
│ status       │   │   │ ifsc_code    │
└──────────────┘   │   │ is_verified  │
       ▲           │   └──────────────┘
       └───────────┘ (self-reference for reporting hierarchy)


┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│CONFIG_ENTITIES│      │ DEPARTMENTS  │       │ DESIGNATIONS │
├──────────────┤       │ (view)       │       │ (view)       │
│ id           │       ├──────────────┤       ├──────────────┤
│ tenant_id    │       │ Filtered by  │       │ Filtered by  │
│ entity_type  │◄──────│ entity_type  │       │ entity_type  │
│ name         │       │ ='department'│       │='designation'│
│ code         │       └──────────────┘       └──────────────┘
│ parent_id    │
│ metadata     │       ┌──────────────┐       ┌──────────────┐
│ sort_order   │       │   GRADES     │       │  LOCATIONS   │
│ is_active    │       │ (view)       │       │ (view)       │
└──────────────┘       └──────────────┘       └──────────────┘
```

### 2.4 Leave Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             LEAVE ENTITIES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ LEAVE_TYPES  │       │LEAVE_POLICIES│       │LEAVE_BALANCES│
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │◄──┬───│ leave_type_id│   ┌───│ leave_type_id│
│ tenant_id    │   │   │ tenant_id    │   │   │ employee_id  │
│ name         │   │   │ name         │   │   │ year         │
│ code         │   │   │ applicable_to│   │   │ opening_bal  │
│ is_paid      │   │   │ entitlement  │   │   │ accrued      │
│ requires_    │   │   │ accrual_type │   │   │ used         │
│   approval   │   │   │ carry_forward│   │   │ adjusted     │
│ requires_doc │   │   │   _enabled   │   │   │ current_bal  │
│ min_days_    │   │   │ carry_forward│   │   └──────────────┘
│   notice     │   │   │   _limit     │   │
│ max_consec_  │   │   │ effective_   │   │
│   days       │   │   │   from       │   │
│ is_active    │   │   │ is_active    │   │
└──────────────┘   │   └──────────────┘   │
                   │                      │
                   └──────────────────────┼─────────────────────┐
                                          │                     │
                                          ▼                     │
┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│LEAVE_REQUESTS│       │LEAVE_APPROVALS│      │   HOLIDAYS   │ │
├──────────────┤       ├──────────────┤       ├──────────────┤ │
│ id           │◄──────│ leave_request│       │ id           │ │
│ tenant_id    │       │   _id        │       │ tenant_id    │ │
│ employee_id  │       │ approver_id  │       │ name         │ │
│ leave_type_id│───────│ level        │       │ date         │ │
│ from_date    │   ▲   │ status       │       │ type         │ │
│ to_date      │   │   │ comments     │       │ applicable_  │ │
│ days         │   │   │ acted_at     │       │   locations  │ │
│ reason       │   │   └──────────────┘       │ year         │ │
│ status       │   │                          └──────────────┘ │
│ document_url │   │                                           │
└──────────────┘   └───────────────────────────────────────────┘
```

### 2.5 Exit Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXIT ENTITIES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│EXIT_REQUESTS │       │EXIT_STAGE    │       │EXIT_CLEARANCES│
├──────────────┤       │  _HISTORY    │       ├──────────────┤
│ id           │◄──┬───├──────────────┤   ┌───│ exit_request │
│ tenant_id    │   │   │ exit_request │   │   │   _id        │
│ employee_id  │   │   │   _id        │   │   │ clearance_   │
│ exit_type    │   │   │ from_stage   │   │   │   item_id    │
│ reason       │   │   │ to_stage     │   │   │ status       │
│ notice_period│   │   │ notes        │   │   │ cleared_by   │
│   _days      │   │   │ updated_by   │   │   │ cleared_at   │
│ requested_   │   │   │ created_at   │   │   │ remarks      │
│   last_date  │   │   └──────────────┘   │   └──────────────┘
│ approved_    │   │                      │
│   last_date  │   │                      │
│ current_stage│   │   ┌──────────────┐   │
│ status       │   │   │EXIT_DOCUMENTS│   │
└──────────────┘   │   ├──────────────┤   │
                   ├───│ exit_request │   │
                   │   │   _id        │   │
                   │   │ document_type│   │
                   │   │ file_name    │   │
                   │   │ file_url     │   │
                   │   │ issued_date  │   │
                   │   │ issued_by    │   │
                   │   └──────────────┘   │
                   │                      │
                   │   ┌──────────────┐   │
                   │   │EXIT_INTERVIEWS│  │
                   │   ├──────────────┤   │
                   └───│ exit_request │   │
                       │   _id        │   │
                       │ conducted_by │   │
                       │ conducted_at │   │
                       │ overall_     │   │
                       │   rating     │   │
                       │ feedback     │   │
                       │ suggestions  │   │
                       └──────────────┘   │
                                          │
                                          │
                       ┌──────────────┐   │
                       │CONFIG_ENTITIES│◄─┘
                       │(clearance_   │
                       │ item type)   │
                       └──────────────┘
```

### 2.6 Configuration Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONFIGURATION ENTITIES                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│CUSTOM_FIELD  │       │CUSTOM_FIELD  │       │EMAIL_TEMPLATES│
│ _DEFINITIONS │       │  _VALUES     │       ├──────────────┤
├──────────────┤       ├──────────────┤       │ id           │
│ id           │◄──────│ field_def_id │       │ tenant_id    │
│ tenant_id    │       │ entity       │       │ code         │
│ entity       │       │ entity_id    │       │ name         │
│ field_name   │       │ value        │       │ subject      │
│ field_label  │       └──────────────┘       │ body         │
│ field_type   │                              │ variables    │
│ options(JSON)│                              │ is_active    │
│ is_required  │                              └──────────────┘
│ is_visible   │
│ validation   │       ┌──────────────┐       ┌──────────────┐
│   _rules     │       │DOCUMENT_     │       │WORKFLOW_     │
│ sort_order   │       │ TEMPLATES    │       │ CONFIGURATIONS│
└──────────────┘       ├──────────────┤       ├──────────────┤
                       │ id           │       │ id           │
                       │ tenant_id    │       │ tenant_id    │
                       │ code         │       │ workflow_type│
                       │ name         │       │ stages (JSON)│
                       │ template_    │       │ is_active    │
                       │   content    │       └──────────────┘
                       │ variables    │
                       │ format       │
                       │ is_active    │
                       └──────────────┘


┌──────────────┐       ┌──────────────┐
│ NOTIFICATIONS│       │ AUDIT_LOGS   │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ tenant_id    │       │ tenant_id    │
│ user_id      │       │ user_id      │
│ type         │       │ action       │
│ title        │       │ entity       │
│ message      │       │ entity_id    │
│ data (JSON)  │       │ old_values   │
│ is_read      │       │ new_values   │
│ read_at      │       │ ip_address   │
│ created_at   │       │ user_agent   │
└──────────────┘       │ created_at   │
                       └──────────────┘
```

## 3. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

model Tenant {
  id        String       @id @default(uuid())
  name      String       @db.VarChar(255)
  subdomain String       @unique @db.VarChar(100)
  status    TenantStatus @default(active)
  config    Json?
  createdAt DateTime     @default(now()) @map("created_at")
  updatedAt DateTime     @updatedAt @map("updated_at")

  // Relations
  users                  User[]
  roles                  Role[]
  jobPostings            JobPosting[]
  candidates             Candidate[]
  recruitmentCases       RecruitmentCase[]
  employees              Employee[]
  leaveTypes             LeaveType[]
  leavePolicies          LeavePolicy[]
  leaveRequests          LeaveRequest[]
  holidays               Holiday[]
  exitRequests           ExitRequest[]
  configEntities         ConfigEntity[]
  customFieldDefinitions CustomFieldDefinition[]
  emailTemplates         EmailTemplate[]
  documentTemplates      DocumentTemplate[]
  workflowConfigurations WorkflowConfiguration[]
  notifications          Notification[]
  auditLogs              AuditLog[]

  @@map("tenants")
}

enum TenantStatus {
  active
  inactive
  suspended
}

model User {
  id            String     @id @default(uuid())
  tenantId      String     @map("tenant_id")
  email         String     @db.VarChar(255)
  passwordHash  String     @map("password_hash") @db.VarChar(255)
  userType      UserType   @map("user_type")
  status        UserStatus @default(pending)
  emailVerified Boolean    @default(false) @map("email_verified")
  lastLogin     DateTime?  @map("last_login")
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  // Relations
  tenant              Tenant              @relation(fields: [tenantId], references: [id])
  userRoles           UserRole[]
  candidate           Candidate?
  employee            Employee?
  caseStageHistory    CaseStageHistory[]
  caseCommunications  CaseCommunication[]
  interviewPanelists  InterviewPanelist[]
  offersCreated       Offer[]             @relation("OfferCreatedBy")
  offersApproved      Offer[]             @relation("OfferApprovedBy")
  documentsVerified   CandidateDocument[] @relation("DocumentVerifiedBy")
  leaveApprovals      LeaveApproval[]
  exitStageHistory    ExitStageHistory[]
  exitClearances      ExitClearance[]
  exitDocumentsIssued ExitDocument[]
  exitInterviews      ExitInterview[]
  notifications       Notification[]
  auditLogs           AuditLog[]

  @@unique([tenantId, email])
  @@map("users")
}

enum UserType {
  super_admin
  hr_admin
  recruiter
  manager
  employee
  candidate
  lifetime
}

enum UserStatus {
  active
  inactive
  pending
}

// ============================================================================
// RBAC ENTITIES
// ============================================================================

model Role {
  id           String   @id @default(uuid())
  tenantId     String   @map("tenant_id")
  name         String   @db.VarChar(100)
  description  String?  @db.Text
  isSystemRole Boolean  @default(false) @map("is_system_role")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  tenant          Tenant           @relation(fields: [tenantId], references: [id])
  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@unique([tenantId, name])
  @@map("roles")
}

model MenuItem {
  id        String  @id @default(uuid())
  name      String  @db.VarChar(100)
  code      String  @unique @db.VarChar(50)
  module    String  @db.VarChar(50)
  parentId  String? @map("parent_id")
  route     String? @db.VarChar(255)
  icon      String? @db.VarChar(50)
  sortOrder Int     @default(0) @map("sort_order")
  isActive  Boolean @default(true) @map("is_active")

  // Relations
  parent      MenuItem?    @relation("MenuHierarchy", fields: [parentId], references: [id])
  children    MenuItem[]   @relation("MenuHierarchy")
  permissions Permission[]

  @@map("menu_items")
}

model Permission {
  id         String           @id @default(uuid())
  menuItemId String           @map("menu_item_id")
  action     PermissionAction

  // Relations
  menuItem        MenuItem         @relation(fields: [menuItemId], references: [id])
  rolePermissions RolePermission[]

  @@unique([menuItemId, action])
  @@map("permissions")
}

enum PermissionAction {
  create
  read
  update
  delete
}

model RolePermission {
  id           String  @id @default(uuid())
  roleId       String  @map("role_id")
  permissionId String  @map("permission_id")
  isGranted    Boolean @default(true) @map("is_granted")

  // Relations
  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}

model UserRole {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  roleId     String   @map("role_id")
  assignedAt DateTime @default(now()) @map("assigned_at")
  assignedBy String?  @map("assigned_by")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id])

  @@unique([userId, roleId])
  @@map("user_roles")
}

// ============================================================================
// RECRUITMENT ENTITIES
// ============================================================================

model JobPosting {
  id                  String           @id @default(uuid())
  tenantId            String           @map("tenant_id")
  title               String           @db.VarChar(255)
  description         String?          @db.Text
  requirements        String?          @db.Text
  departmentId        String?          @map("department_id")
  locationId          String?          @map("location_id")
  employmentType      EmploymentType   @default(full_time) @map("employment_type")
  experienceMin       Int?             @map("experience_min")
  experienceMax       Int?             @map("experience_max")
  salaryMin           Decimal?         @map("salary_min") @db.Decimal(15, 2)
  salaryMax           Decimal?         @map("salary_max") @db.Decimal(15, 2)
  showSalary          Boolean          @default(false) @map("show_salary")
  skills              Json?
  openings            Int              @default(1)
  status              JobPostingStatus @default(draft)
  applicationDeadline DateTime?        @map("application_deadline")
  createdBy           String?          @map("created_by")
  createdAt           DateTime         @default(now()) @map("created_at")
  updatedAt           DateTime         @updatedAt @map("updated_at")

  // Relations
  tenant           Tenant            @relation(fields: [tenantId], references: [id])
  recruitmentCases RecruitmentCase[]

  @@map("job_postings")
}

enum JobPostingStatus {
  draft
  active
  paused
  closed
}

enum EmploymentType {
  full_time
  part_time
  contract
  intern
}

model Candidate {
  id            String          @id @default(uuid())
  tenantId      String          @map("tenant_id")
  userId        String?         @unique @map("user_id")
  firstName     String          @map("first_name") @db.VarChar(100)
  lastName      String?         @map("last_name") @db.VarChar(100)
  email         String          @db.VarChar(255)
  phone         String?         @db.VarChar(20)
  resumeUrl     String?         @map("resume_url") @db.VarChar(500)
  source        CandidateSource @default(direct)
  sourceDetails String?         @map("source_details") @db.VarChar(255)
  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt @map("updated_at")

  // Relations
  tenant           Tenant            @relation(fields: [tenantId], references: [id])
  user             User?             @relation(fields: [userId], references: [id])
  recruitmentCases RecruitmentCase[]

  @@map("candidates")
}

enum CandidateSource {
  direct
  referral
  job_board
  linkedin
  other
}

model RecruitmentCase {
  id                  String     @id @default(uuid())
  tenantId            String     @map("tenant_id")
  caseNumber          String     @map("case_number") @db.VarChar(50)
  candidateId         String     @map("candidate_id")
  jobPostingId        String     @map("job_posting_id")
  currentStage        String     @map("current_stage") @db.VarChar(50)
  status              CaseStatus @default(active)
  assignedRecruiterId String?    @map("assigned_recruiter_id")
  expectedJoiningDate DateTime?  @map("expected_joining_date")
  actualJoiningDate   DateTime?  @map("actual_joining_date")
  createdAt           DateTime   @default(now()) @map("created_at")
  updatedAt           DateTime   @updatedAt @map("updated_at")

  // Relations
  tenant         Tenant              @relation(fields: [tenantId], references: [id])
  candidate      Candidate           @relation(fields: [candidateId], references: [id])
  jobPosting     JobPosting          @relation(fields: [jobPostingId], references: [id])
  stageHistory   CaseStageHistory[]
  communications CaseCommunication[]
  interviews     Interview[]
  offers         Offer[]
  documents      CandidateDocument[]
  employee       Employee?

  @@unique([tenantId, caseNumber])
  @@map("recruitment_cases")
}

enum CaseStatus {
  active
  on_hold
  closed
}

model CaseStageHistory {
  id        String   @id @default(uuid())
  caseId    String   @map("case_id")
  fromStage String?  @map("from_stage") @db.VarChar(50)
  toStage   String   @map("to_stage") @db.VarChar(50)
  notes     String?  @db.Text
  updatedBy String   @map("updated_by")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  case      RecruitmentCase @relation(fields: [caseId], references: [id], onDelete: Cascade)
  updatedByUser User        @relation(fields: [updatedBy], references: [id])

  @@map("case_stage_history")
}

model CaseCommunication {
  id          String            @id @default(uuid())
  caseId      String            @map("case_id")
  type        CommunicationType
  subject     String?           @db.VarChar(255)
  content     String            @db.Text
  senderId    String?           @map("sender_id")
  isInternal  Boolean           @default(true) @map("is_internal")
  attachments Json?
  createdAt   DateTime          @default(now()) @map("created_at")

  // Relations
  case   RecruitmentCase @relation(fields: [caseId], references: [id], onDelete: Cascade)
  sender User?           @relation(fields: [senderId], references: [id])

  @@map("case_communications")
}

enum CommunicationType {
  note
  email
  call
  meeting
  system
}

model Interview {
  id              String          @id @default(uuid())
  caseId          String          @map("case_id")
  roundNumber     Int             @map("round_number")
  roundName       String?         @map("round_name") @db.VarChar(100)
  scheduledAt     DateTime?       @map("scheduled_at")
  durationMinutes Int             @default(60) @map("duration_minutes")
  location        String?         @db.VarChar(255)
  meetingLink     String?         @map("meeting_link") @db.VarChar(500)
  status          InterviewStatus @default(scheduled)
  overallRating   Int?            @map("overall_rating")
  feedback        String?         @db.Text
  recommendation  String?         @db.VarChar(50)
  createdAt       DateTime        @default(now()) @map("created_at")
  updatedAt       DateTime        @updatedAt @map("updated_at")

  // Relations
  case       RecruitmentCase     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  panelists  InterviewPanelist[]

  @@map("interviews")
}

enum InterviewStatus {
  scheduled
  completed
  cancelled
  no_show
}

model InterviewPanelist {
  id          String    @id @default(uuid())
  interviewId String    @map("interview_id")
  userId      String    @map("user_id")
  role        String    @default("interviewer") @db.VarChar(20)
  feedback    String?   @db.Text
  rating      Int?
  submittedAt DateTime? @map("submitted_at")

  // Relations
  interview Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id])

  @@map("interview_panelists")
}

model Offer {
  id              String      @id @default(uuid())
  caseId          String      @map("case_id")
  version         Int         @default(1)
  designation     String      @db.VarChar(100)
  departmentId    String?     @map("department_id")
  baseSalary      Decimal     @map("base_salary") @db.Decimal(15, 2)
  variablePay     Decimal?    @map("variable_pay") @db.Decimal(15, 2)
  joiningBonus    Decimal?    @map("joining_bonus") @db.Decimal(15, 2)
  otherBenefits   Json?       @map("other_benefits")
  joiningDate     DateTime    @map("joining_date")
  expiryDate      DateTime    @map("expiry_date")
  status          OfferStatus @default(draft)
  offerLetterUrl  String?     @map("offer_letter_url") @db.VarChar(500)
  acceptedAt      DateTime?   @map("accepted_at")
  rejectedAt      DateTime?   @map("rejected_at")
  rejectionReason String?     @map("rejection_reason") @db.Text
  createdBy       String?     @map("created_by")
  approvedBy      String?     @map("approved_by")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  // Relations
  case           RecruitmentCase @relation(fields: [caseId], references: [id], onDelete: Cascade)
  createdByUser  User?           @relation("OfferCreatedBy", fields: [createdBy], references: [id])
  approvedByUser User?           @relation("OfferApprovedBy", fields: [approvedBy], references: [id])

  @@map("offers")
}

enum OfferStatus {
  draft
  pending_approval
  approved
  sent
  accepted
  rejected
  withdrawn
  expired
}

model CandidateDocument {
  id              String                     @id @default(uuid())
  caseId          String                     @map("case_id")
  documentTypeId  String                     @map("document_type_id")
  fileName        String                     @map("file_name") @db.VarChar(255)
  fileUrl         String                     @map("file_url") @db.VarChar(500)
  fileSize        Int?                       @map("file_size")
  status          DocumentVerificationStatus @default(pending)
  rejectionReason String?                    @map("rejection_reason") @db.Text
  verifiedBy      String?                    @map("verified_by")
  verifiedAt      DateTime?                  @map("verified_at")
  uploadedAt      DateTime                   @default(now()) @map("uploaded_at")

  // Relations
  case           RecruitmentCase @relation(fields: [caseId], references: [id], onDelete: Cascade)
  verifiedByUser User?           @relation("DocumentVerifiedBy", fields: [verifiedBy], references: [id])

  @@map("candidate_documents")
}

enum DocumentVerificationStatus {
  pending
  verified
  rejected
}

// ============================================================================
// HR ENTITIES
// ============================================================================

model Employee {
  id                 String         @id @default(uuid())
  tenantId           String         @map("tenant_id")
  userId             String         @unique @map("user_id")
  employeeCode       String         @map("employee_code") @db.VarChar(50)
  caseId             String?        @unique @map("case_id")
  firstName          String         @map("first_name") @db.VarChar(100)
  lastName           String?        @map("last_name") @db.VarChar(100)
  email              String         @db.VarChar(255)
  phone              String?        @db.VarChar(20)
  dateOfBirth        DateTime?      @map("date_of_birth")
  gender             String?        @db.VarChar(10)
  maritalStatus      String?        @map("marital_status") @db.VarChar(20)
  bloodGroup         String?        @map("blood_group") @db.VarChar(10)
  nationality        String?        @db.VarChar(50)
  departmentId       String?        @map("department_id")
  designationId      String?        @map("designation_id")
  gradeId            String?        @map("grade_id")
  locationId         String?        @map("location_id")
  reportingManagerId String?        @map("reporting_manager_id")
  joiningDate        DateTime       @map("joining_date")
  confirmationDate   DateTime?      @map("confirmation_date")
  probationEndDate   DateTime?      @map("probation_end_date")
  status             EmployeeStatus @default(active)
  employmentType     EmploymentType @default(full_time) @map("employment_type")
  createdAt          DateTime       @default(now()) @map("created_at")
  updatedAt          DateTime       @updatedAt @map("updated_at")

  // Relations
  tenant             Tenant                  @relation(fields: [tenantId], references: [id])
  user               User                    @relation(fields: [userId], references: [id])
  recruitmentCase    RecruitmentCase?        @relation(fields: [caseId], references: [id])
  reportingManager   Employee?               @relation("ReportingHierarchy", fields: [reportingManagerId], references: [id])
  directReports      Employee[]              @relation("ReportingHierarchy")
  addresses          EmployeeAddress[]
  emergencyContacts  EmployeeEmergencyContact[]
  bankDetails        EmployeeBankDetails?
  documents          EmployeeDocument[]
  leaveBalances      LeaveBalance[]
  leaveRequests      LeaveRequest[]
  exitRequests       ExitRequest[]

  @@unique([tenantId, employeeCode])
  @@map("employees")
}

enum EmployeeStatus {
  active
  on_notice
  exited
  absconding
}

model EmployeeAddress {
  id               String   @id @default(uuid())
  employeeId       String   @map("employee_id")
  addressType      String   @map("address_type") @db.VarChar(20)
  addressLine1     String   @map("address_line1") @db.VarChar(255)
  addressLine2     String?  @map("address_line2") @db.VarChar(255)
  city             String   @db.VarChar(100)
  state            String?  @db.VarChar(100)
  country          String   @db.VarChar(100)
  postalCode       String?  @map("postal_code") @db.VarChar(20)
  isSameAsPermanent Boolean @default(false) @map("is_same_as_permanent")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  // Relations
  employee Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_addresses")
}

model EmployeeEmergencyContact {
  id             String   @id @default(uuid())
  employeeId     String   @map("employee_id")
  name           String   @db.VarChar(100)
  relationship   String   @db.VarChar(50)
  phone          String   @db.VarChar(20)
  alternatePhone String?  @map("alternate_phone") @db.VarChar(20)
  isPrimary      Boolean  @default(false) @map("is_primary")
  createdAt      DateTime @default(now()) @map("created_at")

  // Relations
  employee Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_emergency_contacts")
}

model EmployeeBankDetails {
  id                String   @id @default(uuid())
  employeeId        String   @unique @map("employee_id")
  bankName          String   @map("bank_name") @db.VarChar(100)
  branchName        String?  @map("branch_name") @db.VarChar(100)
  accountNumber     String   @map("account_number") @db.VarChar(50)
  ifscCode          String   @map("ifsc_code") @db.VarChar(20)
  accountHolderName String   @map("account_holder_name") @db.VarChar(100)
  isVerified        Boolean  @default(false) @map("is_verified")
  verifiedBy        String?  @map("verified_by")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  // Relations
  employee Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_bank_details")
}

model EmployeeDocument {
  id             String   @id @default(uuid())
  employeeId     String   @map("employee_id")
  documentTypeId String   @map("document_type_id")
  fileName       String   @map("file_name") @db.VarChar(255)
  fileUrl        String   @map("file_url") @db.VarChar(500)
  fileSize       Int?     @map("file_size")
  uploadedAt     DateTime @default(now()) @map("uploaded_at")

  // Relations
  employee Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_documents")
}

// ============================================================================
// LEAVE ENTITIES
// ============================================================================

model LeaveType {
  id                String   @id @default(uuid())
  tenantId          String   @map("tenant_id")
  name              String   @db.VarChar(100)
  code              String   @db.VarChar(20)
  description       String?  @db.Text
  isPaid            Boolean  @default(true) @map("is_paid")
  requiresApproval  Boolean  @default(true) @map("requires_approval")
  requiresDocument  Boolean  @default(false) @map("requires_document")
  minDaysNotice     Int      @default(0) @map("min_days_notice")
  maxConsecutiveDays Int?    @map("max_consecutive_days")
  isActive          Boolean  @default(true) @map("is_active")
  createdAt         DateTime @default(now()) @map("created_at")

  // Relations
  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  policies      LeavePolicy[]
  balances      LeaveBalance[]
  leaveRequests LeaveRequest[]

  @@unique([tenantId, code])
  @@map("leave_types")
}

model LeavePolicy {
  id                      String   @id @default(uuid())
  tenantId                String   @map("tenant_id")
  leaveTypeId             String   @map("leave_type_id")
  name                    String   @db.VarChar(100)
  applicableTo            String   @default("all") @map("applicable_to") @db.VarChar(20)
  applicableEntityId      String?  @map("applicable_entity_id")
  entitlement             Decimal  @db.Decimal(5, 2)
  accrualType             String   @default("annual") @map("accrual_type") @db.VarChar(20)
  carryForwardEnabled     Boolean  @default(false) @map("carry_forward_enabled")
  carryForwardLimit       Decimal? @map("carry_forward_limit") @db.Decimal(5, 2)
  carryForwardExpiryMonths Int?    @map("carry_forward_expiry_months")
  encashmentEnabled       Boolean  @default(false) @map("encashment_enabled")
  encashmentLimit         Decimal? @map("encashment_limit") @db.Decimal(5, 2)
  minServiceDays          Int      @default(0) @map("min_service_days")
  effectiveFrom           DateTime @map("effective_from")
  effectiveTo             DateTime? @map("effective_to")
  isActive                Boolean  @default(true) @map("is_active")
  createdAt               DateTime @default(now()) @map("created_at")

  // Relations
  tenant    Tenant    @relation(fields: [tenantId], references: [id])
  leaveType LeaveType @relation(fields: [leaveTypeId], references: [id])

  @@map("leave_policies")
}

model LeaveBalance {
  id              String   @id @default(uuid())
  employeeId      String   @map("employee_id")
  leaveTypeId     String   @map("leave_type_id")
  year            Int
  openingBalance  Decimal  @default(0) @map("opening_balance") @db.Decimal(5, 2)
  accrued         Decimal  @default(0) @db.Decimal(5, 2)
  used            Decimal  @default(0) @db.Decimal(5, 2)
  adjusted        Decimal  @default(0) @db.Decimal(5, 2)
  carriedForward  Decimal  @default(0) @map("carried_forward") @db.Decimal(5, 2)
  currentBalance  Decimal  @default(0) @map("current_balance") @db.Decimal(5, 2)
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  employee  Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  leaveType LeaveType @relation(fields: [leaveTypeId], references: [id])

  @@unique([employeeId, leaveTypeId, year])
  @@map("leave_balances")
}

model LeaveRequest {
  id          String             @id @default(uuid())
  tenantId    String             @map("tenant_id")
  employeeId  String             @map("employee_id")
  leaveTypeId String             @map("leave_type_id")
  fromDate    DateTime           @map("from_date")
  toDate      DateTime           @map("to_date")
  days        Decimal            @db.Decimal(5, 2)
  reason      String?            @db.Text
  status      LeaveRequestStatus @default(pending)
  documentUrl String?            @map("document_url") @db.VarChar(500)
  createdAt   DateTime           @default(now()) @map("created_at")
  updatedAt   DateTime           @updatedAt @map("updated_at")

  // Relations
  tenant    Tenant          @relation(fields: [tenantId], references: [id])
  employee  Employee        @relation(fields: [employeeId], references: [id])
  leaveType LeaveType       @relation(fields: [leaveTypeId], references: [id])
  approvals LeaveApproval[]

  @@map("leave_requests")
}

enum LeaveRequestStatus {
  pending
  approved
  rejected
  cancelled
}

model LeaveApproval {
  id             String    @id @default(uuid())
  leaveRequestId String    @map("leave_request_id")
  approverId     String    @map("approver_id")
  level          Int       @default(1)
  status         String    @default("pending") @db.VarChar(20)
  comments       String?   @db.Text
  actedAt        DateTime? @map("acted_at")
  createdAt      DateTime  @default(now()) @map("created_at")

  // Relations
  leaveRequest LeaveRequest @relation(fields: [leaveRequestId], references: [id], onDelete: Cascade)
  approver     User         @relation(fields: [approverId], references: [id])

  @@map("leave_approvals")
}

model Holiday {
  id                  String   @id @default(uuid())
  tenantId            String   @map("tenant_id")
  name                String   @db.VarChar(100)
  date                DateTime @db.Date
  type                String   @default("mandatory") @db.VarChar(20)
  applicableLocations Json?    @map("applicable_locations")
  description         String?  @db.Text
  year                Int
  createdAt           DateTime @default(now()) @map("created_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, date])
  @@map("holidays")
}

// ============================================================================
// EXIT ENTITIES
// ============================================================================

model ExitRequest {
  id                String            @id @default(uuid())
  tenantId          String            @map("tenant_id")
  employeeId        String            @map("employee_id")
  exitType          String            @map("exit_type") @db.VarChar(20)
  reason            String?           @db.Text
  noticePeriodDays  Int               @map("notice_period_days")
  requestedLastDate DateTime          @map("requested_last_date")
  approvedLastDate  DateTime?         @map("approved_last_date")
  actualLastDate    DateTime?         @map("actual_last_date")
  currentStage      String            @map("current_stage") @db.VarChar(50)
  status            ExitRequestStatus @default(pending)
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")

  // Relations
  tenant       Tenant             @relation(fields: [tenantId], references: [id])
  employee     Employee           @relation(fields: [employeeId], references: [id])
  stageHistory ExitStageHistory[]
  clearances   ExitClearance[]
  documents    ExitDocument[]
  interview    ExitInterview?

  @@map("exit_requests")
}

enum ExitRequestStatus {
  pending
  approved
  rejected
  completed
  withdrawn
}

model ExitStageHistory {
  id            String   @id @default(uuid())
  exitRequestId String   @map("exit_request_id")
  fromStage     String?  @map("from_stage") @db.VarChar(50)
  toStage       String   @map("to_stage") @db.VarChar(50)
  notes         String?  @db.Text
  updatedBy     String   @map("updated_by")
  createdAt     DateTime @default(now()) @map("created_at")

  // Relations
  exitRequest   ExitRequest @relation(fields: [exitRequestId], references: [id], onDelete: Cascade)
  updatedByUser User        @relation(fields: [updatedBy], references: [id])

  @@map("exit_stage_history")
}

model ExitClearance {
  id              String    @id @default(uuid())
  exitRequestId   String    @map("exit_request_id")
  clearanceItemId String    @map("clearance_item_id")
  status          String    @default("pending") @db.VarChar(20)
  clearedBy       String?   @map("cleared_by")
  clearedAt       DateTime? @map("cleared_at")
  remarks         String?   @db.Text

  // Relations
  exitRequest   ExitRequest @relation(fields: [exitRequestId], references: [id], onDelete: Cascade)
  clearedByUser User?       @relation(fields: [clearedBy], references: [id])

  @@map("exit_clearances")
}

model ExitDocument {
  id            String    @id @default(uuid())
  exitRequestId String    @map("exit_request_id")
  documentType  String    @map("document_type") @db.VarChar(50)
  fileName      String    @map("file_name") @db.VarChar(255)
  fileUrl       String    @map("file_url") @db.VarChar(500)
  issuedDate    DateTime? @map("issued_date")
  issuedBy      String?   @map("issued_by")
  createdAt     DateTime  @default(now()) @map("created_at")

  // Relations
  exitRequest  ExitRequest @relation(fields: [exitRequestId], references: [id], onDelete: Cascade)
  issuedByUser User?       @relation(fields: [issuedBy], references: [id])

  @@map("exit_documents")
}

model ExitInterview {
  id                      String    @id @default(uuid())
  exitRequestId           String    @unique @map("exit_request_id")
  conductedBy             String    @map("conducted_by")
  conductedAt             DateTime? @map("conducted_at")
  overallExperienceRating Int?      @map("overall_experience_rating")
  wouldRecommend          Boolean?  @map("would_recommend")
  reasonForLeaving        String?   @map("reason_for_leaving") @db.Text
  feedback                String?   @db.Text
  suggestions             String?   @db.Text
  createdAt               DateTime  @default(now()) @map("created_at")

  // Relations
  exitRequest     ExitRequest @relation(fields: [exitRequestId], references: [id], onDelete: Cascade)
  conductedByUser User        @relation(fields: [conductedBy], references: [id])

  @@map("exit_interviews")
}

// ============================================================================
// CONFIGURATION ENTITIES
// ============================================================================

model ConfigEntity {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  entityType String   @map("entity_type") @db.VarChar(50)
  name       String   @db.VarChar(100)
  code       String   @db.VarChar(50)
  parentId   String?  @map("parent_id")
  metadata   Json?
  sortOrder  Int      @default(0) @map("sort_order")
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  tenant   Tenant        @relation(fields: [tenantId], references: [id])
  parent   ConfigEntity? @relation("EntityHierarchy", fields: [parentId], references: [id])
  children ConfigEntity[] @relation("EntityHierarchy")

  @@unique([tenantId, entityType, code])
  @@map("config_entities")
}

model CustomFieldDefinition {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  entity          String   @db.VarChar(50)
  fieldName       String   @map("field_name") @db.VarChar(100)
  fieldLabel      String   @map("field_label") @db.VarChar(100)
  fieldType       String   @map("field_type") @db.VarChar(20)
  options         Json?
  isRequired      Boolean  @default(false) @map("is_required")
  isVisible       Boolean  @default(true) @map("is_visible")
  validationRules Json?    @map("validation_rules")
  sortOrder       Int      @default(0) @map("sort_order")
  createdAt       DateTime @default(now()) @map("created_at")

  // Relations
  tenant Tenant             @relation(fields: [tenantId], references: [id])
  values CustomFieldValue[]

  @@unique([tenantId, entity, fieldName])
  @@map("custom_field_definitions")
}

model CustomFieldValue {
  id                String   @id @default(uuid())
  tenantId          String   @map("tenant_id")
  entity            String   @db.VarChar(50)
  entityId          String   @map("entity_id")
  fieldDefinitionId String   @map("field_definition_id")
  value             String?  @db.Text
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  // Relations
  fieldDefinition CustomFieldDefinition @relation(fields: [fieldDefinitionId], references: [id])

  @@unique([entityId, fieldDefinitionId])
  @@map("custom_field_values")
}

model EmailTemplate {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  code      String   @db.VarChar(50)
  name      String   @db.VarChar(100)
  subject   String   @db.VarChar(255)
  body      String   @db.Text
  variables Json?
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, code])
  @@map("email_templates")
}

model DocumentTemplate {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  code            String   @db.VarChar(50)
  name            String   @db.VarChar(100)
  templateContent String   @map("template_content") @db.LongText
  variables       Json?
  format          String   @default("pdf") @db.VarChar(10)
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, code])
  @@map("document_templates")
}

model WorkflowConfiguration {
  id           String   @id @default(uuid())
  tenantId     String   @map("tenant_id")
  workflowType String   @map("workflow_type") @db.VarChar(50)
  stages       Json
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, workflowType])
  @@map("workflow_configurations")
}

model Notification {
  id        String    @id @default(uuid())
  tenantId  String    @map("tenant_id")
  userId    String    @map("user_id")
  type      String    @db.VarChar(50)
  title     String    @db.VarChar(255)
  message   String?   @db.Text
  data      Json?
  isRead    Boolean   @default(false) @map("is_read")
  readAt    DateTime? @map("read_at")
  createdAt DateTime  @default(now()) @map("created_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id])
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId, userId, isRead])
  @@map("notifications")
}

model AuditLog {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  userId    String?  @map("user_id")
  action    String   @db.VarChar(50)
  entity    String   @db.VarChar(50)
  entityId  String   @map("entity_id")
  oldValues Json?    @map("old_values")
  newValues Json?    @map("new_values")
  ipAddress String?  @map("ip_address") @db.VarChar(45)
  userAgent String?  @map("user_agent") @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id])
  user   User?  @relation(fields: [userId], references: [id])

  @@index([tenantId, entity, entityId])
  @@index([tenantId, userId])
  @@index([tenantId, createdAt])
  @@map("audit_logs")
}

model EmailLog {
  id           String    @id @default(uuid())
  tenantId     String    @map("tenant_id")
  templateCode String?   @map("template_code") @db.VarChar(50)
  toEmail      String    @map("to_email") @db.VarChar(255)
  ccEmails     Json?     @map("cc_emails")
  subject      String    @db.VarChar(255)
  body         String?   @db.Text
  status       String    @default("pending") @db.VarChar(20)
  errorMessage String?   @map("error_message") @db.Text
  sentAt       DateTime? @map("sent_at")
  createdAt    DateTime  @default(now()) @map("created_at")

  @@map("email_logs")
}
```

## 4. Indexing Strategy

### 4.1 Primary Indexes (Auto-created by Prisma)

All primary keys are indexed automatically.

### 4.2 Foreign Key Indexes

All foreign keys are indexed automatically by Prisma.

### 4.3 Additional Indexes

| Table | Columns | Type | Purpose |
|-------|---------|------|---------|
| users | (tenant_id, email) | UNIQUE | Login lookup |
| users | (tenant_id, status) | INDEX | Active user queries |
| recruitment_cases | (tenant_id, current_stage) | INDEX | Stage filtering |
| recruitment_cases | (tenant_id, status, created_at) | INDEX | Dashboard queries |
| employees | (tenant_id, status) | INDEX | Active employee queries |
| employees | (tenant_id, department_id) | INDEX | Department filtering |
| leave_requests | (tenant_id, employee_id, status) | INDEX | Employee leave queries |
| leave_requests | (tenant_id, status, created_at) | INDEX | HR approval queue |
| notifications | (tenant_id, user_id, is_read) | INDEX | Unread notifications |
| audit_logs | (tenant_id, entity, entity_id) | INDEX | Entity audit history |
| audit_logs | (tenant_id, created_at) | INDEX | Time-based queries |

## 5. Data Migration Strategy

### 5.1 Initial Setup

```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Run seed data
npx prisma db seed
```

### 5.2 Seed Data

The seed script will create:
1. Default menu items
2. Default permissions
3. System roles with permissions
4. Default tenant for development
5. Admin user for default tenant
6. Default email templates
7. Default document templates
8. Default workflow configurations

---

## Next Steps

1. Review and approve this database design
2. Proceed to [API Design](./03-API-DESIGN.md)
