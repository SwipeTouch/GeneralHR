# Configuration System Design

## 1. Overview

The Configuration System enables tenant-specific customization without code changes. It covers branding, feature flags, workflow configuration, templates, and custom fields.

## 2. Configuration Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CONFIGURATION HIERARCHY                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM DEFAULTS                                      │
│  • Built-in default values for all configurations                           │
│  • Applied when tenant doesn't override                                     │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TENANT CONFIGURATION                                 │
│  • Per-tenant overrides                                                     │
│  • Stored in database (tenants.config JSON)                                │
│  • Managed via Admin UI                                                     │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RUNTIME CONFIG                                      │
│  • Merged system defaults + tenant overrides                                │
│  • Cached in Redis for performance                                          │
│  • Invalidated on config changes                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Configuration Categories

### 3.1 Tenant Configuration Structure

```typescript
interface TenantConfig {
  // Branding
  branding: {
    logoUrl: string;
    logoSmallUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    companyName: string;
    tagline?: string;
  };
  
  // Feature Flags
  features: {
    recruitment: {
      enabled: boolean;
      offerApprovalRequired: boolean;
      backgroundVerification: boolean;
    };
    hr: {
      leaveManagementEnabled: boolean;
      attendanceEnabled: boolean;
      payrollIntegrationEnabled: boolean;
    };
    exit: {
      enabled: boolean;
      exitInterviewRequired: boolean;
      lifetimePortalEnabled: boolean;
    };
    customFields: {
      enabled: boolean;
      maxFieldsPerEntity: number;
    };
  };
  
  // General Settings
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    fiscalYearStart: string; // "01-04" for April
    weekStartDay: number; // 0=Sunday, 1=Monday
    noticePeriodDays: number;
    probationPeriodMonths: number;
    workingHoursPerDay: number;
  };
  
  // Password Policy
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
    requireSpecialChar: boolean;
    expiryDays: number;
    preventReuse: number;
  };
  
  // Notification Settings
  notifications: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
    reminderFrequency: 'daily' | 'weekly';
  };
}
```

### 3.2 Branding Configuration UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BRANDING SETTINGS                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  LOGO & IDENTITY                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌────────────────┐  Company Logo                                           │
│  │                │  Recommended: 200x60px, PNG/SVG                         │
│  │   [Logo]       │  [Upload New Logo]                                      │
│  │                │                                                          │
│  └────────────────┘                                                          │
│                                                                              │
│  ┌────────────┐      Favicon                                                │
│  │  [Icon]    │      Recommended: 32x32px, ICO/PNG                          │
│  └────────────┘      [Upload Favicon]                                       │
│                                                                              │
│  Company Name*:     [Acme Corporation________________]                      │
│                                                                              │
│  Tagline:           [Building the future, together__]                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  COLORS                                                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Primary Color:     [#1890FF] 🎨    ████████                                │
│                     Used for: headers, buttons, links                       │
│                                                                              │
│  Secondary Color:   [#52C41A] 🎨    ████████                                │
│                     Used for: success states, accents                       │
│                                                                              │
│  Accent Color:      [#722ED1] 🎨    ████████                                │
│                     Used for: highlights, special elements                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  PREVIEW                                                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  [Logo] Acme Corporation                              [User Menu]    │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │  Dashboard     ┌─────────────────────────────────────────────────┐  │  │
│  │  Recruitment   │                                                  │  │  │
│  │  HR            │         Preview of branded interface            │  │  │
│  │  Employees     │                                                  │  │  │
│  │                │  [Primary Button]  [Secondary]                  │  │  │
│  │                │                                                  │  │  │
│  │                └─────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [Reset to Default]                                    [Save Changes]       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Feature Flags UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FEATURE CONFIGURATION                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  RECRUITMENT MODULE                                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [●] Enable Recruitment Module                                              │
│                                                                              │
│      [●] Offer Approval Workflow                                            │
│          Offers require manager/HR approval before sending                  │
│                                                                              │
│      [○] Background Verification                                            │
│          Enable background check integration                                │
│                                                                              │
│      [●] Interview Feedback Required                                        │
│          Panelists must submit feedback to proceed                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  HR MODULE                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [●] Leave Management                                                       │
│                                                                              │
│      [●] Manager Approval Required                                          │
│                                                                              │
│      [○] HR Final Approval                                                  │
│          Two-level approval for leaves                                      │
│                                                                              │
│  [○] Attendance Tracking                                                    │
│      Currently placeholder - requires integration                           │
│                                                                              │
│  [○] Payroll Integration                                                    │
│      Connect to external payroll system                                     │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  EXIT MODULE                                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [●] Enable Exit Management                                                 │
│                                                                              │
│      [●] Exit Interview Required                                            │
│                                                                              │
│      [●] Lifetime Portal Access                                             │
│          Ex-employees retain read-only portal access                        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  CUSTOM FIELDS                                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [●] Enable Custom Fields                                                   │
│                                                                              │
│      Max fields per entity: [10_____]                                       │
│                                                                              │
│  [Save Changes]                                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4. Configurable Entities

### 4.1 Entity Management UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONFIGURATION > ENTITIES                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ [Departments] [Designations] [Grades] [Locations] [Document Types]      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  DEPARTMENTS                                             [+ Add Department] │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Name              │ Code   │ Parent         │ Head      │ ●  │ Action│  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Engineering       │ ENG    │ -              │ John Doe  │ ●  │ [Edit]│  │
│  │ ├─ Frontend       │ ENG-FE │ Engineering    │ Jane Smi  │ ●  │ [Edit]│  │
│  │ ├─ Backend        │ ENG-BE │ Engineering    │ Mike Bro  │ ●  │ [Edit]│  │
│  │ └─ DevOps         │ ENG-DO │ Engineering    │ Sara Lee  │ ●  │ [Edit]│  │
│  │ Human Resources   │ HR     │ -              │ Tom Chen  │ ●  │ [Edit]│  │
│  │ Finance           │ FIN    │ -              │ Amy Wong  │ ●  │ [Edit]│  │
│  │ Sales             │ SALES  │ -              │ Bob Park  │ ●  │ [Edit]│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ● Active  ○ Inactive                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Add/Edit Entity

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ADD DEPARTMENT                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Name*:              [Quality Assurance__________________]                  │
│                                                                              │
│  Code*:              [QA_________________________________]                  │
│                      Used for internal reference, must be unique            │
│                                                                              │
│  Parent Department:  [▼ Engineering_____________________]                   │
│                      Leave empty for top-level department                   │
│                                                                              │
│  Department Head:    [▼ Select Employee_________________]                   │
│                                                                              │
│  Sort Order:         [5__________________________________]                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ADDITIONAL METADATA (Optional)                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Cost Center:        [CC-ENG-QA_________________________]                   │
│                                                                              │
│  Budget Code:        [BUD-2024-QA_______________________]                   │
│                                                                              │
│  Location:           [▼ Bangalore_______________________]                   │
│                                                                              │
│  Status:             ● Active  ○ Inactive                                   │
│                                                                              │
│  [Cancel]                                              [Save Department]    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5. Custom Fields

### 5.1 Custom Field Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CUSTOM FIELDS                                         [+ Add Custom Field] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Entity: [▼ Employee_____________________]                                  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Field Name      │ Label          │ Type     │ Required │ ●  │ Action│  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ t_shirt_size    │ T-Shirt Size   │ Dropdown │ No       │ ●  │ [Edit]│  │
│  │ linkedin_url    │ LinkedIn       │ Text     │ No       │ ●  │ [Edit]│  │
│  │ skills          │ Skills         │ Textarea │ No       │ ●  │ [Edit]│  │
│  │ certifications  │ Certifications │ Textarea │ No       │ ●  │ [Edit]│  │
│  │ emergency_notes │ Medical Notes  │ Textarea │ No       │ ○  │ [Edit]│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Available for: Employee (5 of 10 max)                                      │
│  Other entities: Candidate (2), Job Posting (3)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Add Custom Field

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ADD CUSTOM FIELD                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Entity*:            [▼ Employee________________________]                   │
│                                                                              │
│  Field Name*:        [vehicle_type_____________________]                    │
│                      Alphanumeric and underscore only                       │
│                                                                              │
│  Display Label*:     [Vehicle Type_____________________]                    │
│                                                                              │
│  Field Type*:        [▼ Dropdown_______________________]                    │
│                                                                              │
│                      ○ Text           - Single line text                    │
│                      ○ Textarea       - Multi-line text                     │
│                      ○ Number         - Numeric value                       │
│                      ○ Date           - Date picker                         │
│                      ● Dropdown       - Single select                       │
│                      ○ Checkbox       - Yes/No                              │
│                      ○ File           - File upload                         │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  DROPDOWN OPTIONS (for Dropdown type)                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Value            │ Label                │ [Remove]                   │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ two_wheeler      │ Two Wheeler          │ [×]                        │  │
│  │ four_wheeler     │ Four Wheeler         │ [×]                        │  │
│  │ none             │ None                 │ [×]                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [+ Add Option]                                                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  SETTINGS                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☐ Required field                                                           │
│  ☑ Visible on profile                                                       │
│  ☐ Editable by employee                                                     │
│                                                                              │
│  Sort Order:         [10_________________________________]                  │
│                                                                              │
│  [Cancel]                                              [Save Field]         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6. Workflow Configuration

### 6.1 Recruitment Workflow Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WORKFLOW CONFIGURATION > RECRUITMENT                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  STAGES                                                          [+ Add]    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Drag to reorder stages                                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ≡ │ 1. APPLIED        │ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 2. SCREENING      │ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 3. INTERVIEW      │ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 4. OFFER_PENDING  │ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 5. OFFER_SENT     │ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 6. DOCUMENT_UPLOAD│ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 7. VERIFICATION   │ Required │ [Edit] [×]                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ≡ │ 8. ONBOARDING     │ Required │ [Edit] [×]                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Terminal stages (cannot be modified):                                      │
│  • ONBOARDED (success)                                                      │
│  • REJECTED (failure)                                                       │
│  • WITHDRAWN (cancelled)                                                    │
│  • OFFER_REJECTED (candidate declined)                                      │
│  • OFFER_ACCEPTED (auto-advance to DOCUMENT_UPLOAD)                         │
│  • VERIFIED (auto-advance to ONBOARDING)                                    │
│                                                                              │
│  [Reset to Default]                                    [Save Workflow]      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Edit Stage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EDIT STAGE: INTERVIEW                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Stage Code:         INTERVIEW (cannot be changed)                          │
│                                                                              │
│  Display Name*:      [Interview________________________]                    │
│                                                                              │
│  Sequence:           3                                                      │
│                                                                              │
│  ☑ Required stage (cannot be skipped)                                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ALLOWED TRANSITIONS                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  From this stage, can move to:                                              │
│                                                                              │
│  ☑ OFFER_PENDING    (Advance to offer stage)                               │
│  ☑ REJECTED         (Reject candidate)                                     │
│  ☐ WITHDRAWN        (Only if candidate withdraws)                          │
│  ☐ SCREENING        (Send back for re-screening)                           │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ACTIONS                                                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Available actions at this stage:                                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Action          │ Target Stage   │ Note Required │ Notification     │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Schedule Int.   │ (stays)        │ No            │ Candidate, Panel │  │
│  │ Add Feedback    │ (stays)        │ Yes           │ Recruiter        │  │
│  │ Move to Offer   │ OFFER_PENDING  │ No            │ HR               │  │
│  │ Reject          │ REJECTED       │ Yes           │ Candidate        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [+ Add Action]                                                             │
│                                                                              │
│  [Cancel]                                              [Save Stage]         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7. Email Templates

### 7.1 Template Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EMAIL TEMPLATES                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Category: [All ▼]                                                          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Template           │ Category    │ Subject              │ ●  │ Action│  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ offer_letter       │ Recruitment │ Offer Letter - {c... │ ●  │ [Edit]│  │
│  │ interview_schedule │ Recruitment │ Interview Schedu...  │ ●  │ [Edit]│  │
│  │ candidate_portal   │ Recruitment │ Portal Access De...  │ ●  │ [Edit]│  │
│  │ document_reminder  │ Recruitment │ Document Upload ...  │ ●  │ [Edit]│  │
│  │ leave_approved     │ Leave       │ Leave Request Ap...  │ ●  │ [Edit]│  │
│  │ leave_rejected     │ Leave       │ Leave Request Re...  │ ●  │ [Edit]│  │
│  │ exit_initiated     │ Exit        │ Resignation Ack...   │ ●  │ [Edit]│  │
│  │ exit_completed     │ Exit        │ Relieving Letter...  │ ●  │ [Edit]│  │
│  │ welcome_employee   │ HR          │ Welcome to {com...   │ ●  │ [Edit]│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Edit Email Template

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EDIT EMAIL TEMPLATE: offer_letter                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Template Code:      offer_letter (system defined)                          │
│                                                                              │
│  Template Name*:     [Offer Letter Email________________]                   │
│                                                                              │
│  Subject*:           [Offer Letter - {{company_name}}___]                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  AVAILABLE VARIABLES                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Click to insert:                                                           │
│  [{{candidate_name}}] [{{company_name}}] [{{position}}] [{{salary}}]       │
│  [{{joining_date}}] [{{offer_expiry}}] [{{hr_name}}] [{{portal_url}}]      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  EMAIL BODY (HTML)                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ [B] [I] [U] | [H1] [H2] [P] | [Link] [Image] | [Code]               │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │ Dear {{candidate_name}},                                             │  │
│  │                                                                       │  │
│  │ We are pleased to extend an offer of employment to you for the      │  │
│  │ position of <strong>{{position}}</strong> at {{company_name}}.      │  │
│  │                                                                       │  │
│  │ Please find the offer details below:                                 │  │
│  │ • Position: {{position}}                                             │  │
│  │ • Annual CTC: {{salary}}                                             │  │
│  │ • Joining Date: {{joining_date}}                                     │  │
│  │                                                                       │  │
│  │ Please review and respond by {{offer_expiry}}.                       │  │
│  │                                                                       │  │
│  │ To accept this offer, please log in to our candidate portal:         │  │
│  │ {{portal_url}}                                                        │  │
│  │                                                                       │  │
│  │ Best regards,                                                         │  │
│  │ {{hr_name}}                                                           │  │
│  │ {{company_name}}                                                      │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  PREVIEW                                                             [Test] │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [Show Preview with Sample Data]                                            │
│                                                                              │
│  [Cancel]  [Reset to Default]                          [Save Template]      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8. Document Templates

### 8.1 Template Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DOCUMENT TEMPLATES                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Template           │ Type        │ Format │ ●  │ Action              │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ offer_letter       │ Recruitment │ PDF    │ ●  │ [Edit] [Preview]    │  │
│  │ appointment_letter │ HR          │ PDF    │ ●  │ [Edit] [Preview]    │  │
│  │ confirmation_letter│ HR          │ PDF    │ ●  │ [Edit] [Preview]    │  │
│  │ experience_letter  │ Exit        │ PDF    │ ●  │ [Edit] [Preview]    │  │
│  │ relieving_letter   │ Exit        │ PDF    │ ●  │ [Edit] [Preview]    │  │
│  │ salary_certificate │ HR          │ PDF    │ ●  │ [Edit] [Preview]    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Note: Document templates use HTML format and are converted to PDF          │
│  during generation. Use {{variable}} syntax for dynamic content.            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9. Configuration API

### 9.1 Get Tenant Configuration

```typescript
// GET /api/v1/config/tenant
interface TenantConfigResponse {
  success: true;
  data: {
    tenantId: string;
    config: TenantConfig;
    lastUpdated: string;
  };
}
```

### 9.2 Update Configuration

```typescript
// PATCH /api/v1/config/tenant
interface UpdateTenantConfigRequest {
  branding?: Partial<TenantConfig['branding']>;
  features?: Partial<TenantConfig['features']>;
  settings?: Partial<TenantConfig['settings']>;
}
```

### 9.3 Configuration Service

```typescript
class ConfigurationService {
  // Get merged config (defaults + tenant overrides)
  async getTenantConfig(tenantId: string): Promise<TenantConfig>;
  
  // Update specific config sections
  async updateBranding(tenantId: string, branding: Partial<TenantBranding>): Promise<void>;
  async updateFeatures(tenantId: string, features: Partial<TenantFeatures>): Promise<void>;
  async updateSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<void>;
  
  // Cache management
  async invalidateCache(tenantId: string): Promise<void>;
  
  // Feature flag checks
  isFeatureEnabled(tenantId: string, feature: string): Promise<boolean>;
}
```

## 10. Configuration Caching

### 10.1 Cache Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION CACHING                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                     ┌─────────────────┐
                     │   API Request   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Check Redis    │
                     │  Cache          │
                     └────────┬────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
          CACHE HIT                       CACHE MISS
              │                               │
              ▼                               ▼
     ┌─────────────────┐            ┌─────────────────┐
     │ Return cached   │            │  Load from DB   │
     │ config          │            │  + merge with   │
     │                 │            │  defaults       │
     └─────────────────┘            └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Store in Redis │
                                    │  (TTL: 5 min)   │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Return config   │
                                    └─────────────────┘

Cache Key: config:tenant:{tenantId}
TTL: 5 minutes (configurable)
Invalidation: On any config update
```

---

## Next Steps

1. Review and approve this configuration system design
2. Proceed to [Frontend Architecture Design](./10-FRONTEND-ARCHITECTURE.md)
