# HRMS Application - Complete Requirements Document

## 1. Executive Summary

A multi-tenant SaaS HRMS (Human Resource Management System) application covering the complete employee lifecycle from recruitment to exit. The system provides configurable workflows, granular Role-Based Access Control (RBAC), and integration capabilities for external systems like payroll.

### 1.1 Key Business Objectives

- Streamline hiring process from candidate application to onboarding
- Provide self-service portals for candidates, employees, and HR
- Enable configurable workflows without code changes
- Support multiple tenants with data isolation
- Integrate with external payroll systems
- Maintain lifetime access for ex-employees

---

## 2. System Architecture

### 2.1 High-Level Components

| Component | Description |
|-----------|-------------|
| **Recruitment Portal** | HR/Recruiter interface for managing hiring workflow |
| **Candidate Portal** | Pre-onboarding portal for document upload and offer acceptance |
| **HR Portal** | Administrative interface for employee and leave management |
| **Employee Portal** | Self-service for employees to manage profile, leaves, documents |
| **Lifetime Portal** | Ex-employee access to historical documents and certificates |
| **API Gateway** | Central entry point for all API requests |
| **Background Workers** | Async job processing for emails, notifications, reports |

### 2.2 Multi-Tenant Architecture

- **Tenant Isolation**: Each tenant has isolated data using tenant_id filtering
- **Schema Strategy**: Shared database with tenant_id column on all tables
- **Configuration**: Per-tenant configuration for branding, workflows, and features
- **Subdomain Routing**: Each tenant gets unique subdomain (tenant.hrms.com)

### 2.3 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React + TypeScript | 18.x |
| State Management | Zustand | 4.x |
| UI Framework | Ant Design | 5.x |
| Backend | Node.js + Express | 20.x LTS |
| ORM | Prisma | 5.x |
| Database | MySQL | 8.x |
| Cache | Redis | 7.x |
| Queue | BullMQ | 4.x |
| File Storage | AWS S3 / MinIO | - |
| Email | SendGrid / AWS SES | - |

---

## 3. Module Specifications

### 3.1 Authentication & Authorization Module

#### 3.1.1 Features

- JWT-based authentication with access and refresh tokens
- Multi-tenant login with tenant resolution from subdomain
- Password reset via email
- Session management with Redis
- Granular RBAC with CRUD permissions per menu item

#### 3.1.2 User Types

| Type | Description | Portal Access |
|------|-------------|---------------|
| SUPER_ADMIN | Platform administrator | All portals |
| HR_ADMIN | Tenant HR administrator | HR Portal, Recruitment |
| RECRUITER | Hiring team member | Recruitment Portal |
| MANAGER | Department/Team manager | HR Portal (limited) |
| EMPLOYEE | Active employee | Employee Portal |
| CANDIDATE | Pre-onboarding candidate | Candidate Portal |
| LIFETIME | Ex-employee | Lifetime Portal |

#### 3.1.3 RBAC Model

```
Role -> RolePermission -> Permission -> MenuItem
         (CRUD flags)     (action)     (resource)
```

Each permission defines:
- **Resource**: Menu item or API endpoint
- **Actions**: CREATE, READ, UPDATE, DELETE
- **Scope**: Own data only, department, or all

---

### 3.2 Recruitment Module

#### 3.2.1 Job Posting Management

**Features:**
- Create and manage job postings
- Set posting status (Draft, Active, Closed)
- Define requirements, skills, experience
- Track applications per posting
- Publish to career page

**Job Posting Fields:**
- Title, Description, Requirements
- Department, Location, Employment Type
- Salary Range (optional, hideable)
- Skills Required, Experience Level
- Application Deadline
- Number of Openings

#### 3.2.2 Candidate Management (Case-Based)

Each candidate application creates a **Recruitment Case** that encapsulates:

- Candidate profile and resume
- Application details
- Interview history and feedback
- Communications (emails, notes, chats)
- Documents (uploaded and verified)
- Offer history
- Stage transitions with audit trail

**Case Stages (Configurable per tenant):**

| Stage | Description | Actions Available |
|-------|-------------|-------------------|
| APPLIED | Initial application received | Review, Reject, Advance |
| SCREENING | HR screening in progress | Schedule, Reject, Advance |
| INTERVIEW | Interview process | Add feedback, Schedule next, Advance |
| OFFER_PENDING | Preparing offer | Generate offer, Reject |
| OFFER_SENT | Offer sent to candidate | Resend, Withdraw, Wait |
| OFFER_ACCEPTED | Candidate accepted | Create portal access |
| OFFER_REJECTED | Candidate rejected offer | Close case |
| DOCUMENT_UPLOAD | Awaiting documents | Review documents |
| VERIFICATION | Documents under verification | Approve, Reject, Request more |
| VERIFIED | All documents verified | Initiate onboarding |
| ONBOARDING | Onboarding in progress | Complete onboarding |
| ONBOARDED | Successfully hired | Convert to employee |
| REJECTED | Application rejected | Archive |
| WITHDRAWN | Candidate withdrew | Archive |

#### 3.2.3 Interview Management

- Schedule interviews with calendar integration
- Assign interviewers
- Collect structured feedback
- Multi-round interview support
- Video interview link integration (placeholder)

#### 3.2.4 Offer Management

- Generate offer letter from template
- Configurable offer components:
  - Base salary, Variable pay, Joining bonus
  - Benefits package, Stock options
  - Joining date, Reporting structure
- Offer approval workflow (optional)
- Send offer via email
- Track offer status and expiry
- Digital acceptance with e-signature placeholder

#### 3.2.5 Recruitment Dashboard

- Kanban view of cases by stage
- Pipeline metrics (time-to-hire, conversion rates)
- Recruiter workload distribution
- Stage-wise funnel visualization
- Quick actions and filters

---

### 3.3 Candidate Portal Module

#### 3.3.1 Access & Authentication

- Login credentials sent after offer acceptance
- Temporary access with CANDIDATE role
- Access expires after onboarding completion
- Automatic conversion to EMPLOYEE role

#### 3.3.2 Features

**Offer Management:**
- View offer letter details
- Download offer letter PDF
- Accept or reject offer digitally
- Request clarifications

**Document Upload:**
- Configurable document checklist
- Supported formats: PDF, JPG, PNG
- Upload progress and status tracking
- Re-upload for rejected documents
- Document verification status visibility

**Profile Completion:**
- Personal information form
- Emergency contacts
- Bank details for salary
- Address and contact information
- Profile photo upload

**Required Documents (Configurable):**
- Identity proof (Aadhar, Passport, etc.)
- Address proof
- Educational certificates
- Experience letters from previous employers
- Relieving letters
- Salary slips
- Bank account details
- PAN card
- Photographs

---

### 3.4 HR Portal Module

#### 3.4.1 Employee Management

**Employee Directory:**
- Searchable and filterable list
- Department and team hierarchy view
- Quick view cards with key information
- Export to Excel/CSV

**Employee Profile:**
- Personal details
- Employment details (dates, designation, department)
- Compensation (view based on permissions)
- Documents (offer letter, contracts, certificates)
- Leave balances
- Reporting structure
- Employment history

**Configurable Fields:**
- Add custom fields per tenant
- Set field visibility rules
- Define mandatory fields
- Field types: Text, Number, Date, Dropdown, File

#### 3.4.2 Department & Hierarchy Management

All organizational entities are configuration-driven:

| Entity | Description |
|--------|-------------|
| Department | Organizational units (Engineering, HR, Finance) |
| Designation | Job titles (Software Engineer, HR Manager) |
| Grade/Level | Pay grades or experience levels (L1, L2, L3) |
| Location | Office locations |
| Team | Sub-units within departments |

**Hierarchy Support:**
- Parent-child relationships for departments
- Reporting manager assignment
- Organization chart visualization

#### 3.4.3 Leave Management

**Leave Types (Configurable):**

| Type | Example Configuration |
|------|----------------------|
| Casual Leave | 12 days/year, no carry forward |
| Sick Leave | 12 days/year, requires medical certificate |
| Earned Leave | 15 days/year, can carry forward 30 days |
| Maternity/Paternity | As per policy |
| Compensatory Off | Earned on working holidays |
| Loss of Pay | Unpaid leave |

**Leave Policy Configuration:**
- Entitlement per leave type
- Accrual rules (annual, monthly, pro-rata)
- Carry forward limits
- Encashment rules
- Minimum service days required
- Applicable to specific grades/departments

**Leave Workflow:**
1. Employee applies for leave
2. Manager receives notification
3. Manager approves/rejects
4. HR gets notification (optional)
5. Leave balance updated
6. Calendar updated

**Leave Dashboard (HR):**
- Leave requests pending approval
- Team leave calendar
- Leave balance reports
- Trend analysis

#### 3.4.4 Attendance (Placeholder)

- Manual attendance entry
- Integration hooks for biometric systems
- Attendance reports

#### 3.4.5 Payroll Integration

**Integration Points:**
- Employee data sync
- Attendance data push
- Leave data push
- Fetch payslips for display

**Placeholder Features:**
- Connection status display
- Manual sync trigger
- Error logging
- Webhook configuration

#### 3.4.6 Notifications

- In-app notification center
- Email notifications (configurable)
- Notification types:
  - Leave requests and approvals
  - Document verification status
  - Onboarding tasks
  - Exit process updates
  - System announcements

---

### 3.5 Employee Portal Module

#### 3.5.1 Dashboard

- Welcome message with quick stats
- Leave balance summary
- Upcoming holidays
- Recent announcements
- Pending actions (document uploads, etc.)
- Quick links to common actions

#### 3.5.2 Profile Management

**View:**
- All personal and employment details
- Reporting structure
- Employment timeline

**Edit (Allowed Fields):**
- Address (current, permanent)
- Phone numbers (personal, emergency)
- Emergency contacts
- Profile photo
- Bank account (with verification)

#### 3.5.3 Leave Management

- Apply for leave with reason
- View leave balances by type
- Leave history with status
- Cancel pending requests
- View team leave calendar
- Holiday calendar

#### 3.5.4 Documents

- View all uploaded documents
- Download offer letter, appointment letter
- Access company policies
- Download payslips (from integration)
- Tax documents (Form 16, etc.)

#### 3.5.5 Company Information

- Organization chart
- Holiday calendar
- Company policies
- Employee directory (limited view)
- Announcements

---

### 3.6 Exit Management Module

#### 3.6.1 Exit Workflow

| Stage | Description | Owner |
|-------|-------------|-------|
| INITIATED | Employee submits resignation | Employee |
| MANAGER_REVIEW | Manager reviews and acknowledges | Manager |
| HR_REVIEW | HR reviews notice period, LWD | HR |
| NOTICE_PERIOD | Employee serving notice | - |
| CLEARANCE | Department clearances in progress | Multiple |
| SETTLEMENT | Full & final settlement calculation | Finance |
| EXIT_INTERVIEW | Conduct exit interview | HR |
| COMPLETED | All processes complete | HR |
| LIFETIME_ACCESS | Account converted to lifetime | System |

#### 3.6.2 Resignation Request

- Submit resignation with reason
- Last working day calculation based on notice period
- Option to request early release
- Manager acknowledgment required
- HR review and approval

#### 3.6.3 Clearance Process

**Configurable Clearance Items:**
- IT Assets (laptop, phone, access cards)
- Finance (expense claims, advances)
- Library (books, materials)
- Admin (parking, locker)
- HR (ID card, documents)
- Project handover
- Knowledge transfer

**Clearance Dashboard:**
- Checklist per department
- Status tracking
- Deadline management
- Reminder notifications

#### 3.6.4 Exit Documentation

- Generate experience letter
- Generate relieving letter
- Full & final settlement statement (integration)
- Download all documents

#### 3.6.5 Account Transition

- Employee account marked as exited
- Role changed to LIFETIME
- Portal access changed to lifetime.domain.com
- Limited permissions applied
- Historical data preserved

---

### 3.7 Lifetime Portal Module

#### 3.7.1 Access

- Separate subdomain: lifetime.company.com
- Login with existing credentials
- Read-only access
- No time limit on access

#### 3.7.2 Features

**Documents:**
- Download experience letter
- Download relieving letter
- Payslips history
- Tax documents (Form 16)
- Any uploaded certificates

**Employment History:**
- Tenure details
- Designation history
- Department history
- Reporting structure history

**Support:**
- Raise queries/requests
- Track request status
- Contact HR

---

### 3.8 Configuration Module

#### 3.8.1 Tenant Configuration

**Branding:**
- Logo (header, favicon)
- Primary and secondary colors
- Company name
- Custom CSS (enterprise only)

**Feature Flags:**
- Enable/disable modules
- Feature toggles within modules
- Beta feature access

**Workflow Configuration:**
- Recruitment stages
- Leave approval hierarchy
- Exit clearance items
- Document checklists

#### 3.8.2 Configurable Entities

All these entities are managed through configuration UI:

| Entity | Configuration Options |
|--------|----------------------|
| Departments | Name, code, parent, head |
| Designations | Name, code, grade, department |
| Grades | Name, level, salary band |
| Locations | Name, address, timezone |
| Leave Types | Name, code, entitlement, rules |
| Holiday Types | Name, is_mandatory |
| Document Types | Name, required, format |
| Interview Stages | Name, sequence, feedback form |
| Clearance Items | Name, department, mandatory |

#### 3.8.3 Email Templates

Configurable templates with variables:

| Template | Variables |
|----------|-----------|
| Offer Letter | {{candidate_name}}, {{position}}, {{salary}}, etc. |
| Credential Email | {{name}}, {{email}}, {{password}}, {{portal_url}} |
| Leave Approval | {{employee_name}}, {{leave_type}}, {{dates}} |
| Exit Confirmation | {{employee_name}}, {{lwd}}, {{reason}} |

#### 3.8.4 Document Templates

PDF templates for generating:
- Offer letters
- Appointment letters
- Experience letters
- Relieving letters
- Salary certificates

---

## 4. Database Schema

### 4.1 Core Tables

```sql
-- Tenant Management
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Management
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('super_admin', 'hr_admin', 'recruiter', 'manager', 'employee', 'candidate', 'lifetime') NOT NULL,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_email (tenant_id, email)
);

-- RBAC Tables
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_role (tenant_id, name)
);

CREATE TABLE menu_items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    parent_id VARCHAR(36),
    route VARCHAR(255),
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (parent_id) REFERENCES menu_items(id)
);

CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    menu_item_id VARCHAR(36) NOT NULL,
    action ENUM('create', 'read', 'update', 'delete') NOT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    UNIQUE KEY unique_menu_action (menu_item_id, action)
);

CREATE TABLE role_permissions (
    id VARCHAR(36) PRIMARY KEY,
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    is_granted BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

CREATE TABLE user_roles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    UNIQUE KEY unique_user_role (user_id, role_id)
);
```

### 4.2 Recruitment Tables

```sql
CREATE TABLE job_postings (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    department_id VARCHAR(36),
    location_id VARCHAR(36),
    employment_type ENUM('full_time', 'part_time', 'contract', 'intern') DEFAULT 'full_time',
    experience_min INT,
    experience_max INT,
    salary_min DECIMAL(15,2),
    salary_max DECIMAL(15,2),
    show_salary BOOLEAN DEFAULT FALSE,
    skills JSON,
    openings INT DEFAULT 1,
    status ENUM('draft', 'active', 'paused', 'closed') DEFAULT 'draft',
    application_deadline DATE,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE candidates (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    resume_url VARCHAR(500),
    source ENUM('direct', 'referral', 'job_board', 'linkedin', 'other') DEFAULT 'direct',
    source_details VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE recruitment_cases (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    case_number VARCHAR(50) NOT NULL,
    candidate_id VARCHAR(36) NOT NULL,
    job_posting_id VARCHAR(36) NOT NULL,
    current_stage VARCHAR(50) NOT NULL,
    status ENUM('active', 'on_hold', 'closed') DEFAULT 'active',
    assigned_recruiter_id VARCHAR(36),
    expected_joining_date DATE,
    actual_joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id),
    UNIQUE KEY unique_tenant_case (tenant_id, case_number)
);

CREATE TABLE case_stage_history (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES recruitment_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE case_communications (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    type ENUM('note', 'email', 'call', 'meeting', 'system') NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    sender_id VARCHAR(36),
    is_internal BOOLEAN DEFAULT TRUE,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES recruitment_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE interviews (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    round_number INT NOT NULL,
    round_name VARCHAR(100),
    scheduled_at TIMESTAMP,
    duration_minutes INT DEFAULT 60,
    location VARCHAR(255),
    meeting_link VARCHAR(500),
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    overall_rating INT,
    feedback TEXT,
    recommendation ENUM('strong_hire', 'hire', 'no_hire', 'strong_no_hire'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES recruitment_cases(id) ON DELETE CASCADE
);

CREATE TABLE interview_panelists (
    id VARCHAR(36) PRIMARY KEY,
    interview_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('interviewer', 'observer') DEFAULT 'interviewer',
    feedback TEXT,
    rating INT,
    submitted_at TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE offers (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    version INT DEFAULT 1,
    designation VARCHAR(100) NOT NULL,
    department_id VARCHAR(36),
    base_salary DECIMAL(15,2) NOT NULL,
    variable_pay DECIMAL(15,2),
    joining_bonus DECIMAL(15,2),
    other_benefits JSON,
    joining_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('draft', 'pending_approval', 'approved', 'sent', 'accepted', 'rejected', 'withdrawn', 'expired') DEFAULT 'draft',
    offer_letter_url VARCHAR(500),
    accepted_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    created_by VARCHAR(36),
    approved_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES recruitment_cases(id) ON DELETE CASCADE
);

CREATE TABLE candidate_documents (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    document_type_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT,
    verified_by VARCHAR(36),
    verified_at TIMESTAMP,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES recruitment_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);
```

### 4.3 HR Tables

```sql
CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    case_id VARCHAR(36),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    blood_group VARCHAR(10),
    nationality VARCHAR(50),
    department_id VARCHAR(36),
    designation_id VARCHAR(36),
    grade_id VARCHAR(36),
    location_id VARCHAR(36),
    reporting_manager_id VARCHAR(36),
    joining_date DATE NOT NULL,
    confirmation_date DATE,
    probation_end_date DATE,
    status ENUM('active', 'on_notice', 'exited', 'absconding') DEFAULT 'active',
    employment_type ENUM('full_time', 'part_time', 'contract', 'intern') DEFAULT 'full_time',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reporting_manager_id) REFERENCES employees(id),
    UNIQUE KEY unique_tenant_employee (tenant_id, employee_code)
);

CREATE TABLE employee_addresses (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    address_type ENUM('current', 'permanent') NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_same_as_permanent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE employee_emergency_contacts (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE employee_bank_details (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100),
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE employee_documents (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    document_type_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
```

### 4.4 Leave Tables

```sql
CREATE TABLE leave_types (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    is_paid BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT TRUE,
    requires_document BOOLEAN DEFAULT FALSE,
    min_days_notice INT DEFAULT 0,
    max_consecutive_days INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_leave_code (tenant_id, code)
);

CREATE TABLE leave_policies (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    leave_type_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    applicable_to ENUM('all', 'department', 'designation', 'grade') DEFAULT 'all',
    applicable_entity_id VARCHAR(36),
    entitlement DECIMAL(5,2) NOT NULL,
    accrual_type ENUM('annual', 'monthly', 'pro_rata') DEFAULT 'annual',
    carry_forward_enabled BOOLEAN DEFAULT FALSE,
    carry_forward_limit DECIMAL(5,2),
    carry_forward_expiry_months INT,
    encashment_enabled BOOLEAN DEFAULT FALSE,
    encashment_limit DECIMAL(5,2),
    min_service_days INT DEFAULT 0,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
);

CREATE TABLE leave_balances (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    leave_type_id VARCHAR(36) NOT NULL,
    year INT NOT NULL,
    opening_balance DECIMAL(5,2) DEFAULT 0,
    accrued DECIMAL(5,2) DEFAULT 0,
    used DECIMAL(5,2) DEFAULT 0,
    adjusted DECIMAL(5,2) DEFAULT 0,
    carried_forward DECIMAL(5,2) DEFAULT 0,
    current_balance DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    UNIQUE KEY unique_employee_leave_year (employee_id, leave_type_id, year)
);

CREATE TABLE leave_requests (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    leave_type_id VARCHAR(36) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id)
);

CREATE TABLE leave_approvals (
    id VARCHAR(36) PRIMARY KEY,
    leave_request_id VARCHAR(36) NOT NULL,
    approver_id VARCHAR(36) NOT NULL,
    level INT DEFAULT 1,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    comments TEXT,
    acted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id)
);

CREATE TABLE holidays (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    type ENUM('mandatory', 'optional', 'restricted') DEFAULT 'mandatory',
    applicable_locations JSON,
    description TEXT,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_holiday_date (tenant_id, date)
);
```

### 4.5 Exit Tables

```sql
CREATE TABLE exit_requests (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    exit_type ENUM('resignation', 'termination', 'retirement', 'absconding') NOT NULL,
    reason TEXT,
    notice_period_days INT NOT NULL,
    requested_last_date DATE NOT NULL,
    approved_last_date DATE,
    actual_last_date DATE,
    current_stage VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed', 'withdrawn') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE exit_stage_history (
    id VARCHAR(36) PRIMARY KEY,
    exit_request_id VARCHAR(36) NOT NULL,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exit_request_id) REFERENCES exit_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE exit_clearances (
    id VARCHAR(36) PRIMARY KEY,
    exit_request_id VARCHAR(36) NOT NULL,
    clearance_item_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'cleared', 'not_applicable') DEFAULT 'pending',
    cleared_by VARCHAR(36),
    cleared_at TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (exit_request_id) REFERENCES exit_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (cleared_by) REFERENCES users(id)
);

CREATE TABLE exit_documents (
    id VARCHAR(36) PRIMARY KEY,
    exit_request_id VARCHAR(36) NOT NULL,
    document_type ENUM('experience_letter', 'relieving_letter', 'fnf_statement', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    issued_date DATE,
    issued_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exit_request_id) REFERENCES exit_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (issued_by) REFERENCES users(id)
);

CREATE TABLE exit_interviews (
    id VARCHAR(36) PRIMARY KEY,
    exit_request_id VARCHAR(36) NOT NULL,
    conducted_by VARCHAR(36) NOT NULL,
    conducted_at TIMESTAMP,
    overall_experience_rating INT,
    would_recommend BOOLEAN,
    reason_for_leaving TEXT,
    feedback TEXT,
    suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exit_request_id) REFERENCES exit_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (conducted_by) REFERENCES users(id)
);
```

### 4.6 Configuration Tables

```sql
CREATE TABLE config_entities (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    entity_type ENUM('department', 'designation', 'grade', 'location', 'document_type', 'clearance_item') NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    parent_id VARCHAR(36),
    metadata JSON,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (parent_id) REFERENCES config_entities(id),
    UNIQUE KEY unique_tenant_entity_code (tenant_id, entity_type, code)
);

CREATE TABLE custom_field_definitions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(100) NOT NULL,
    field_type ENUM('text', 'number', 'date', 'dropdown', 'checkbox', 'file', 'textarea') NOT NULL,
    options JSON,
    is_required BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    validation_rules JSON,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_entity_field (tenant_id, entity, field_name)
);

CREATE TABLE custom_field_values (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    field_definition_id VARCHAR(36) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (field_definition_id) REFERENCES custom_field_definitions(id),
    UNIQUE KEY unique_entity_field (entity_id, field_definition_id)
);

CREATE TABLE email_templates (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_template_code (tenant_id, code)
);

CREATE TABLE document_templates (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL,
    variables JSON,
    format ENUM('html', 'pdf') DEFAULT 'pdf',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_doc_code (tenant_id, code)
);

CREATE TABLE workflow_configurations (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    workflow_type ENUM('recruitment', 'leave_approval', 'exit') NOT NULL,
    stages JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_tenant_workflow (tenant_id, workflow_type)
);
```

### 4.7 Notification & Audit Tables

```sql
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX idx_audit_entity (tenant_id, entity, entity_id),
    INDEX idx_audit_user (tenant_id, user_id),
    INDEX idx_audit_created (tenant_id, created_at)
);

CREATE TABLE email_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    template_code VARCHAR(50),
    to_email VARCHAR(255) NOT NULL,
    cc_emails JSON,
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

---

## 5. API Specifications

### 5.1 API Design Principles

- RESTful conventions
- Versioned endpoints (/api/v1/...)
- JSON request/response bodies
- Consistent error response format
- Pagination for list endpoints
- Rate limiting per tenant

### 5.2 Authentication Endpoints

```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
```

### 5.3 Recruitment Endpoints

```
# Job Postings
GET    /api/v1/recruitment/job-postings
POST   /api/v1/recruitment/job-postings
GET    /api/v1/recruitment/job-postings/:id
PUT    /api/v1/recruitment/job-postings/:id
DELETE /api/v1/recruitment/job-postings/:id
PATCH  /api/v1/recruitment/job-postings/:id/status

# Candidates
GET    /api/v1/recruitment/candidates
POST   /api/v1/recruitment/candidates
GET    /api/v1/recruitment/candidates/:id

# Cases
GET    /api/v1/recruitment/cases
POST   /api/v1/recruitment/cases
GET    /api/v1/recruitment/cases/:id
PATCH  /api/v1/recruitment/cases/:id/stage
GET    /api/v1/recruitment/cases/:id/timeline

# Communications
GET    /api/v1/recruitment/cases/:id/communications
POST   /api/v1/recruitment/cases/:id/communications

# Interviews
GET    /api/v1/recruitment/cases/:id/interviews
POST   /api/v1/recruitment/cases/:id/interviews
PATCH  /api/v1/recruitment/interviews/:id
POST   /api/v1/recruitment/interviews/:id/feedback

# Offers
POST   /api/v1/recruitment/cases/:id/offers
GET    /api/v1/recruitment/offers/:id
PATCH  /api/v1/recruitment/offers/:id
POST   /api/v1/recruitment/offers/:id/send
POST   /api/v1/recruitment/offers/:id/accept
POST   /api/v1/recruitment/offers/:id/reject

# Documents
GET    /api/v1/recruitment/cases/:id/documents
POST   /api/v1/recruitment/cases/:id/documents
PATCH  /api/v1/recruitment/documents/:id/verify
```

### 5.4 HR Endpoints

```
# Employees
GET    /api/v1/hr/employees
POST   /api/v1/hr/employees
GET    /api/v1/hr/employees/:id
PUT    /api/v1/hr/employees/:id
GET    /api/v1/hr/employees/:id/documents

# Departments
GET    /api/v1/hr/departments
POST   /api/v1/hr/departments
PUT    /api/v1/hr/departments/:id
DELETE /api/v1/hr/departments/:id

# Leave Management
GET    /api/v1/hr/leave-types
POST   /api/v1/hr/leave-types
GET    /api/v1/hr/leave-policies
POST   /api/v1/hr/leave-policies
GET    /api/v1/hr/leave-requests
PATCH  /api/v1/hr/leave-requests/:id/approve
GET    /api/v1/hr/leave-balances

# Holidays
GET    /api/v1/hr/holidays
POST   /api/v1/hr/holidays
PUT    /api/v1/hr/holidays/:id
DELETE /api/v1/hr/holidays/:id
```

### 5.5 Employee Portal Endpoints

```
GET    /api/v1/employee/profile
PATCH  /api/v1/employee/profile
GET    /api/v1/employee/documents
GET    /api/v1/employee/leave-balance
POST   /api/v1/employee/leave-requests
GET    /api/v1/employee/leave-requests
DELETE /api/v1/employee/leave-requests/:id
GET    /api/v1/employee/payslips
GET    /api/v1/employee/holidays
GET    /api/v1/employee/announcements
```

### 5.6 Exit Endpoints

```
POST   /api/v1/exit/requests
GET    /api/v1/exit/requests/:id
PATCH  /api/v1/exit/requests/:id/stage
GET    /api/v1/exit/requests/:id/clearances
PATCH  /api/v1/exit/clearances/:id
POST   /api/v1/exit/requests/:id/interview
GET    /api/v1/exit/requests/:id/documents
POST   /api/v1/exit/requests/:id/documents
```

### 5.7 Configuration Endpoints

```
# Entities
GET    /api/v1/config/entities
POST   /api/v1/config/entities
PUT    /api/v1/config/entities/:id
DELETE /api/v1/config/entities/:id

# Custom Fields
GET    /api/v1/config/custom-fields
POST   /api/v1/config/custom-fields
PUT    /api/v1/config/custom-fields/:id
DELETE /api/v1/config/custom-fields/:id

# Templates
GET    /api/v1/config/email-templates
PUT    /api/v1/config/email-templates/:id
GET    /api/v1/config/document-templates
PUT    /api/v1/config/document-templates/:id

# Workflows
GET    /api/v1/config/workflows
PUT    /api/v1/config/workflows/:type
```

### 5.8 Admin Endpoints

```
# Roles
GET    /api/v1/admin/roles
POST   /api/v1/admin/roles
PUT    /api/v1/admin/roles/:id
DELETE /api/v1/admin/roles/:id
GET    /api/v1/admin/roles/:id/permissions
PUT    /api/v1/admin/roles/:id/permissions

# Users
GET    /api/v1/admin/users
POST   /api/v1/admin/users
PUT    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id/status
GET    /api/v1/admin/users/:id/roles
PUT    /api/v1/admin/users/:id/roles

# Menu Items
GET    /api/v1/admin/menu-items
```

---

## 6. UI Components & Pages

### 6.1 Common Components

- Layout (Header, Sidebar, Footer)
- Navigation Menu (dynamic based on RBAC)
- Data Table with sorting, filtering, pagination
- Forms with validation
- File Upload with progress
- Date/Range Pickers
- Rich Text Editor
- Modal/Drawer
- Notification Center
- Breadcrumbs
- Status Tags/Badges
- Timeline View
- Kanban Board

### 6.2 Page List by Module

**Authentication:**
- Login Page
- Forgot Password
- Reset Password

**Recruitment Portal:**
- Dashboard (KPIs, Pipeline)
- Job Postings List
- Job Posting Form (Create/Edit)
- Candidates List
- Cases List (Kanban & Table view)
- Case Detail Page (Timeline, Tabs)
- Interview Scheduler
- Offer Generation Form
- Document Verification

**Candidate Portal:**
- Dashboard
- Offer View & Accept
- Document Upload Checklist
- Profile Completion Form

**HR Portal:**
- Dashboard (Team stats, pending actions)
- Employee Directory
- Employee Profile View/Edit
- Department Management
- Designation Management
- Leave Type Configuration
- Leave Policy Configuration
- Leave Requests List
- Holiday Calendar
- Onboarding Checklist
- Exit Requests List

**Employee Portal:**
- Dashboard
- My Profile
- Apply Leave
- Leave History
- Leave Balance
- My Documents
- Company Policies
- Holiday Calendar
- Organization Chart

**Exit Management:**
- Exit Request Form
- Exit Dashboard (HR)
- Clearance Checklist
- Exit Interview Form
- Document Generation

**Lifetime Portal:**
- Dashboard
- My Documents
- Employment History
- Raise Query

**Admin:**
- User Management
- Role Management
- Permission Matrix
- Configuration Dashboard
- Email Template Editor
- Audit Logs

---

## 7. Security Requirements

### 7.1 Authentication

- Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
- Password hashing using bcrypt (cost factor 12)
- JWT access token: 15 minutes expiry
- JWT refresh token: 7 days expiry, stored in httpOnly cookie
- Rate limiting: 5 failed login attempts = 15 min lockout

### 7.2 Authorization

- RBAC enforced at API level
- Frontend route guards based on permissions
- Data isolation by tenant_id
- Scope-based data access (own, department, all)

### 7.3 Data Protection

- All data encrypted in transit (TLS 1.3)
- PII encrypted at rest
- Audit logging for all sensitive operations
- Data retention policies
- GDPR compliance considerations

### 7.4 Input Validation

- Server-side validation for all inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- CSRF protection
- File upload validation (type, size, malware scan)

---

## 8. Integration Points

### 8.1 Payroll System

**Data Exchange:**
- Employee master data sync
- Attendance data push
- Leave data push
- Payslip fetch

**Integration Methods:**
- REST API webhooks
- Scheduled batch sync
- Real-time event triggers

### 8.2 Email Service

- SendGrid / AWS SES integration
- Template-based email sending
- Email tracking (delivered, opened)
- Bounce handling

### 8.3 File Storage

- AWS S3 / MinIO for document storage
- Pre-signed URLs for secure access
- File type validation
- Virus scanning

### 8.4 Calendar (Future)

- Google Calendar integration
- Outlook Calendar integration
- Interview scheduling sync

---

## 9. Deployment & DevOps

### 9.1 Environments

| Environment | Purpose |
|-------------|---------|
| Development | Local development |
| Staging | QA and UAT testing |
| Production | Live system |

### 9.2 Infrastructure

- Containerized deployment (Docker)
- Kubernetes orchestration (optional)
- Load balancer for API
- CDN for static assets
- Managed MySQL (RDS/PlanetScale)
- Managed Redis (ElastiCache)

### 9.3 CI/CD

- GitHub Actions / GitLab CI
- Automated testing on PR
- Staging deployment on merge
- Production deployment with approval

### 9.4 Monitoring

- Application logs (structured JSON)
- Error tracking (Sentry)
- Performance monitoring (APM)
- Uptime monitoring
- Alerting

---

## 10. Appendix

### 10.1 Glossary

| Term | Definition |
|------|------------|
| Tenant | A company/organization using the HRMS |
| Case | A recruitment case tracking candidate journey |
| Stage | A step in a workflow (recruitment, exit) |
| LWD | Last Working Day |
| FNF | Full and Final Settlement |

### 10.2 Default Workflow Stages

**Recruitment:**
1. APPLIED
2. SCREENING
3. INTERVIEW
4. OFFER_PENDING
5. OFFER_SENT
6. OFFER_ACCEPTED
7. DOCUMENT_UPLOAD
8. VERIFICATION
9. VERIFIED
10. ONBOARDING
11. ONBOARDED

**Exit:**
1. INITIATED
2. MANAGER_REVIEW
3. HR_REVIEW
4. NOTICE_PERIOD
5. CLEARANCE
6. SETTLEMENT
7. EXIT_INTERVIEW
8. COMPLETED
9. LIFETIME_ACCESS

### 10.3 Default Leave Types

1. Casual Leave (CL)
2. Sick Leave (SL)
3. Earned Leave (EL)
4. Compensatory Off (CO)
5. Maternity Leave (ML)
6. Paternity Leave (PL)
7. Loss of Pay (LOP)
