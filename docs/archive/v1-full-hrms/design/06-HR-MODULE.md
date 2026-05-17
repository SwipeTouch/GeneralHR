# HR Module Design

## 1. Overview

The HR Module provides comprehensive human resource management capabilities including employee management, organizational structure, leave management, and administrative functions.

## 2. Employee Management

### 2.1 Employee Directory

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EMPLOYEE DIRECTORY                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Search: [_________________________] 🔍                                      │
│                                                                              │
│  Filters:                                                                    │
│  Department: [All ▼]  Designation: [All ▼]  Status: [Active ▼]             │
│                                                                              │
│  [+ Add Employee]                                      [Export CSV] [📊]    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Employee       │ Department  │ Designation      │ Location  │ Status │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ 👤 John Doe    │ Engineering │ Sr. Software Eng │ Bangalore │ Active │  │
│  │    EMP001      │             │                  │           │        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ 👤 Jane Smith  │ Engineering │ Eng. Manager     │ Bangalore │ Active │  │
│  │    EMP002      │             │                  │           │        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ 👤 Mike Brown  │ HR          │ HR Manager       │ Mumbai    │ Active │  │
│  │    EMP003      │             │                  │           │        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ 👤 Sara Lee    │ Finance     │ Accountant       │ Bangalore │On Leave│  │
│  │    EMP004      │             │                  │           │        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Showing 1-20 of 150 employees                    [< Prev] [1] [2] [Next >] │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Employee Profile

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EMPLOYEE PROFILE                                              [Edit] 📝    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────┐                                                             │
│  │            │  John Doe                                                   │
│  │   Photo    │  Senior Software Engineer                                   │
│  │            │  Engineering Department                                     │
│  │            │  EMP001                           Status: ● Active          │
│  └────────────┘                                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ [Personal] [Employment] [Documents] [Leave] [History]                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  PERSONAL INFORMATION                                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ┌────────────────────────────┐  ┌────────────────────────────┐            │
│  │ Email                      │  │ Phone                      │            │
│  │ john@company.com           │  │ +91-9876543210             │            │
│  └────────────────────────────┘  └────────────────────────────┘            │
│  ┌────────────────────────────┐  ┌────────────────────────────┐            │
│  │ Date of Birth              │  │ Gender                     │            │
│  │ May 15, 1990               │  │ Male                       │            │
│  └────────────────────────────┘  └────────────────────────────┘            │
│  ┌────────────────────────────┐  ┌────────────────────────────┐            │
│  │ Marital Status             │  │ Blood Group                │            │
│  │ Married                    │  │ O+                         │            │
│  └────────────────────────────┘  └────────────────────────────┘            │
│                                                                              │
│  CURRENT ADDRESS                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  123 Main Street, Apt 4B                                                    │
│  Koramangala, Bangalore, Karnataka 560034                                   │
│  India                                                                       │
│                                                                              │
│  EMERGENCY CONTACT                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Jane Doe (Spouse) - +91-9876543211                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Employee Data Model

```typescript
interface Employee {
  // Basic Information
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Personal Details
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  bloodGroup: string;
  nationality: string;
  
  // Organization Details
  departmentId: string;
  designationId: string;
  gradeId: string;
  locationId: string;
  reportingManagerId: string;
  
  // Employment Details
  joiningDate: Date;
  confirmationDate: Date;
  probationEndDate: Date;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  status: 'active' | 'on_notice' | 'exited' | 'absconding';
  
  // Relations
  addresses: EmployeeAddress[];
  emergencyContacts: EmergencyContact[];
  bankDetails: BankDetails;
  documents: EmployeeDocument[];
  leaveBalances: LeaveBalance[];
}
```

## 3. Organizational Structure

### 3.1 Configuration-Driven Entities

All organizational entities are managed through the Configuration system:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONFIGURABLE ENTITIES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ DEPARTMENTS  │  │ DESIGNATIONS │  │   GRADES     │  │  LOCATIONS   │    │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤    │
│  │ Engineering  │  │ Software Eng │  │ L1 (Entry)   │  │ Bangalore    │    │
│  │ ├─ Frontend  │  │ Sr. Software │  │ L2           │  │ Mumbai       │    │
│  │ ├─ Backend   │  │ Lead         │  │ L3           │  │ Delhi        │    │
│  │ └─ DevOps    │  │ Manager      │  │ L4 (Senior)  │  │ Remote       │    │
│  │ HR           │  │ Director     │  │ L5 (Lead)    │  │              │    │
│  │ Finance      │  │              │  │ L6 (Manager) │  │              │    │
│  │ Sales        │  │              │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                              │
│  All entities support:                                                       │
│  • Hierarchical structure (parent-child)                                     │
│  • Custom metadata (JSON)                                                    │
│  • Active/Inactive status                                                    │
│  • Sort ordering                                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Department Hierarchy Example

```
Engineering (ENG)
├── Frontend (ENG-FE)
│   └── UI/UX (ENG-FE-UX)
├── Backend (ENG-BE)
│   ├── APIs (ENG-BE-API)
│   └── Database (ENG-BE-DB)
└── DevOps (ENG-DO)
    ├── Infrastructure (ENG-DO-INF)
    └── Security (ENG-DO-SEC)
```

### 3.3 Organization Chart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORGANIZATION CHART                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌──────────────┐                                   │
│                          │   CEO        │                                   │
│                          │  John Smith  │                                   │
│                          └──────┬───────┘                                   │
│                                 │                                            │
│         ┌───────────────────────┼───────────────────────┐                   │
│         │                       │                       │                   │
│  ┌──────┴──────┐        ┌──────┴──────┐        ┌──────┴──────┐            │
│  │ CTO         │        │ HR Director │        │ CFO         │            │
│  │ Jane Doe    │        │ Mike Brown  │        │ Sara Lee    │            │
│  └──────┬──────┘        └──────┬──────┘        └─────────────┘            │
│         │                      │                                            │
│    ┌────┴────┐            ┌────┴────┐                                      │
│    │         │            │         │                                      │
│ ┌──┴───┐ ┌──┴───┐    ┌───┴──┐ ┌───┴──┐                                   │
│ │Eng   │ │Prod  │    │ HR   │ │Recruit│                                   │
│ │Lead  │ │Lead  │    │ Mgr  │ │ Lead  │                                   │
│ └──┬───┘ └──────┘    └──────┘ └───────┘                                   │
│    │                                                                        │
│ ┌──┴───┐                                                                   │
│ │Dev 1 │                                                                   │
│ │Dev 2 │                                                                   │
│ │Dev 3 │                                                                   │
│ └──────┘                                                                   │
│                                                                              │
│  [Expand All] [Collapse All] [Export]                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4. Leave Management

### 4.1 Leave Types Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEAVE TYPES                                             [+ Add Leave Type] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Type    │ Code │ Paid │ Approval │ Document │ Notice │ Max Days │ ● │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Casual  │ CL   │ Yes  │ Required │ No       │ 1 day  │ 3        │ ● │  │
│  │ Sick    │ SL   │ Yes  │ Required │ Yes*     │ 0 days │ 7        │ ● │  │
│  │ Earned  │ EL   │ Yes  │ Required │ No       │ 7 days │ 15       │ ● │  │
│  │ Comp Off│ CO   │ Yes  │ Required │ No       │ 1 day  │ 1        │ ● │  │
│  │ LOP     │ LOP  │ No   │ Required │ No       │ 1 day  │ -        │ ● │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  *Document required for more than 2 consecutive days                        │
│  ● Active  ○ Inactive                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Leave Policy Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEAVE POLICY: Casual Leave - Standard Policy                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Policy Name*:        [CL Standard Policy_____________________]             │
│                                                                              │
│  Leave Type*:         [▼ Casual Leave (CL)___________________]              │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  APPLICABILITY                                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Applicable To:       ○ All Employees                                        │
│                       ○ Specific Department: [▼ Select_______]              │
│                       ○ Specific Designation: [▼ Select______]              │
│                       ○ Specific Grade: [▼ Select____________]              │
│                                                                              │
│  Minimum Service:     [__0__] days                                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ENTITLEMENT                                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Annual Entitlement*: [__12__] days                                         │
│                                                                              │
│  Accrual Type:        ○ Annual (credited at start of year)                  │
│                       ● Monthly (1 day per month)                           │
│                       ○ Pro-rata (based on joining date)                    │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  CARRY FORWARD                                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☐ Enable carry forward                                                      │
│     Maximum carry forward: [____] days                                       │
│     Expiry: [____] months after year end                                    │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ENCASHMENT                                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☐ Enable encashment                                                         │
│     Maximum encashable: [____] days                                          │
│                                                                              │
│  Effective From*:     [2024-01-01] 📅                                       │
│  Effective To:        [__________] 📅  (leave blank for no end date)        │
│                                                                              │
│  [Cancel]                              [Save Policy]                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Leave Request Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LEAVE APPROVAL WORKFLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

Employee Applies
       │
       ▼
┌──────────────┐
│   PENDING    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   Manager    │────>│   APPROVED   │
│   Review     │     └──────────────┘
└──────┬───────┘
       │
       │ (if rejected)
       ▼
┌──────────────┐
│   REJECTED   │
└──────────────┘

Employee can CANCEL while in PENDING status
```

### 4.4 Leave Dashboard (HR View)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEAVE MANAGEMENT                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │     12       │ │      5       │ │      3       │ │     18       │       │
│  │   Pending    │ │  On Leave    │ │   Upcoming   │ │  This Month  │       │
│  │   Requests   │ │    Today     │ │  (Next 7d)   │ │   Approved   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  PENDING APPROVALS                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Employee     │ Type  │ From      │ To        │ Days │ Actions      │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ John Doe     │ CL    │ Feb 15    │ Feb 16    │ 2    │ [✓] [✗]     │  │
│  │ Jane Smith   │ SL    │ Feb 14    │ Feb 14    │ 1    │ [✓] [✗]     │  │
│  │ Mike Brown   │ EL    │ Mar 01    │ Mar 05    │ 5    │ [✓] [✗]     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  TEAM LEAVE CALENDAR - February 2024                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌────┬────┬────┬────┬────┬────┬────┐                                      │
│  │ Su │ Mo │ Tu │ We │ Th │ Fr │ Sa │                                      │
│  ├────┼────┼────┼────┼────┼────┼────┤                                      │
│  │    │    │    │    │ 1  │ 2  │ 3  │                                      │
│  ├────┼────┼────┼────┼────┼────┼────┤                                      │
│  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │                                      │
│  ├────┼────┼────┼────┼────┼────┼────┤                                      │
│  │ 11 │ 12 │ 13 │●14 │●15 │●16 │ 17 │  ● = Leave requests                  │
│  ├────┼────┼────┼────┼────┼────┼────┤                                      │
│  │ 18 │ 19 │ 20 │ 21 │ 22 │ 23 │ 24 │                                      │
│  ├────┼────┼────┼────┼────┼────┼────┤                                      │
│  │ 25 │●26 │ 27 │ 28 │ 29 │    │    │  ★ = Holiday                         │
│  └────┴────┴────┴────┴────┴────┴────┘                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Leave Balance Report

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEAVE BALANCE REPORT - 2024                                    [Export]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Department: [All ▼]    As of: [2024-02-15] 📅                              │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Employee     │ CL        │ SL        │ EL        │ CO       │        │  │
│  │              │ Used/Bal  │ Used/Bal  │ Used/Bal  │ Used/Bal │        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ John Doe     │ 2/10      │ 1/11      │ 0/15      │ 0/0      │        │  │
│  │ Jane Smith   │ 0/12      │ 0/12      │ 3/12      │ 1/0      │        │  │
│  │ Mike Brown   │ 3/9       │ 2/10      │ 5/10      │ 0/2      │        │  │
│  │ Sara Lee     │ 1/11      │ 0/12      │ 0/15      │ 0/0      │        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5. Holiday Management

### 5.1 Holiday Calendar

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HOLIDAY CALENDAR - 2024                                   [+ Add Holiday]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Location: [All ▼]    Type: [All ▼]                                         │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Date         │ Holiday              │ Type       │ Locations         │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Jan 26, Fri  │ Republic Day         │ Mandatory  │ All               │  │
│  │ Mar 08, Fri  │ Maha Shivaratri      │ Optional   │ All               │  │
│  │ Mar 25, Mon  │ Holi                 │ Mandatory  │ All               │  │
│  │ Mar 29, Fri  │ Good Friday          │ Restricted │ All               │  │
│  │ Apr 11, Thu  │ Ugadi                │ Optional   │ Bangalore         │  │
│  │ Apr 14, Sun  │ Ambedkar Jayanti     │ Mandatory  │ All               │  │
│  │ May 23, Thu  │ Buddha Purnima       │ Optional   │ All               │  │
│  │ Aug 15, Thu  │ Independence Day     │ Mandatory  │ All               │  │
│  │ Aug 26, Mon  │ Janmashtami          │ Optional   │ All               │  │
│  │ Oct 02, Wed  │ Gandhi Jayanti       │ Mandatory  │ All               │  │
│  │ Oct 12, Sat  │ Dussehra             │ Mandatory  │ All               │  │
│  │ Nov 01, Fri  │ Diwali               │ Mandatory  │ All               │  │
│  │ Dec 25, Wed  │ Christmas            │ Mandatory  │ All               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Legend:                                                                     │
│  🔴 Mandatory - All employees    🔵 Optional - Choose any 2               │
│  🟡 Restricted - Specific groups                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6. Onboarding Management

### 6.1 Pending Onboardings

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PENDING ONBOARDINGS                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Candidate    │ Position         │ Joining   │ Docs    │ Action      │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ John Doe     │ Software Engineer│ Mar 01    │ ✓ 8/8   │ [Onboard]   │  │
│  │ Jane Smith   │ Product Manager  │ Mar 15    │ ⏳ 6/8   │ [View]      │  │
│  │ Mike Brown   │ Designer         │ Mar 20    │ ⏳ 4/8   │ [View]      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Onboarding Completion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPLETE ONBOARDING - John Doe                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  VERIFICATION CHECKLIST                                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☑ Identity Proof verified                                                   │
│  ☑ Address Proof verified                                                    │
│  ☑ Educational Certificates verified                                        │
│  ☑ Experience Letters verified                                              │
│  ☑ Bank Details verified                                                     │
│  ☑ Background Verification completed                                        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  EMPLOYEE DETAILS                                                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Employee Code*:       [EMP045_______________]  [Auto Generate]             │
│                                                                              │
│  Department*:          [▼ Engineering_________]                              │
│                                                                              │
│  Designation*:         [▼ Software Engineer___]                              │
│                                                                              │
│  Grade*:               [▼ L3__________________]                              │
│                                                                              │
│  Location*:            [▼ Bangalore___________]                              │
│                                                                              │
│  Reporting Manager*:   [▼ Jane Smith__________]                              │
│                                                                              │
│  Joining Date*:        [2024-03-01] 📅                                      │
│                                                                              │
│  Confirmation Date:    [2024-09-01] 📅  (6 months probation)                │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☑ Send welcome email to employee                                           │
│  ☑ Notify IT for asset allocation                                           │
│  ☑ Notify Admin for ID card                                                  │
│  ☑ Add to company communication channels                                    │
│                                                                              │
│  [Cancel]                                    [Complete Onboarding]          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7. Payroll Integration (Placeholder)

### 7.1 Integration Status

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAYROLL INTEGRATION                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │   Status: ● Connected to [External Payroll System]                   │  │
│  │                                                                       │  │
│  │   Last Sync: Feb 15, 2024 at 2:00 AM                                 │  │
│  │                                                                       │  │
│  │   [Manual Sync]  [View Sync Logs]  [Configure]                       │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  SYNC CONFIGURATION                                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☑ Sync employee data (daily at 2:00 AM)                                    │
│  ☑ Push attendance data (daily at 11:00 PM)                                 │
│  ☑ Push leave data (on approval)                                            │
│  ☑ Fetch payslips (monthly on 5th)                                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  RECENT SYNC HISTORY                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Timestamp           │ Type          │ Status  │ Records  │          │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Feb 15, 02:00 AM    │ Employee Sync │ Success │ 150      │          │  │
│  │ Feb 14, 11:00 PM    │ Attendance    │ Success │ 145      │          │  │
│  │ Feb 14, 03:15 PM    │ Leave Data    │ Success │ 3        │          │  │
│  │ Feb 05, 10:00 AM    │ Payslips      │ Success │ 150      │          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Integration API Interface

```typescript
interface PayrollIntegration {
  // Outbound - Push to payroll system
  syncEmployeeData(employees: Employee[]): Promise<SyncResult>;
  pushAttendanceData(attendance: AttendanceRecord[]): Promise<SyncResult>;
  pushLeaveData(leaveRequest: LeaveRequest): Promise<SyncResult>;
  
  // Inbound - Fetch from payroll system
  fetchPayslips(employeeId: string, year: number, month: number): Promise<Payslip>;
  fetchAllPayslips(year: number, month: number): Promise<Payslip[]>;
  fetchTaxDocuments(employeeId: string, year: number): Promise<TaxDocument[]>;
  
  // Webhooks - Receive from payroll system
  onPayslipGenerated(callback: (payslip: Payslip) => void): void;
  onSalaryRevision(callback: (revision: SalaryRevision) => void): void;
}
```

## 8. HR Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HR DASHBOARD                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │    150       │ │      5       │ │      3       │ │     12       │       │
│  │   Total      │ │    New       │ │    On        │ │   Pending    │       │
│  │  Employees   │ │  This Month  │ │   Notice     │ │   Requests   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  PENDING ACTIONS                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ⏳ 5 Leave requests pending approval                                  │  │
│  │ 📄 3 Documents pending verification                                   │  │
│  │ 👤 2 Employees pending onboarding                                     │  │
│  │ 🚪 1 Exit request pending review                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  DEPARTMENT DISTRIBUTION          │  UPCOMING                               │
│  ─────────────────────────────────│─────────────────────────────────────── │
│                                   │                                         │
│  Engineering ████████████ 60      │  📅 Mar 01 - John Doe joining          │
│  HR          ███ 15               │  📅 Mar 08 - Maha Shivaratri (Holiday) │
│  Finance     ████ 20              │  📅 Mar 15 - Jane Smith joining        │
│  Sales       ██████ 30            │  🎂 Mar 20 - 5 Birthdays               │
│  Marketing   █████ 25             │  📆 Mar 25 - Holi (Holiday)            │
│                                   │                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. Review and approve this HR module design
2. Proceed to [Employee Portal Design](./07-EMPLOYEE-PORTAL.md)
