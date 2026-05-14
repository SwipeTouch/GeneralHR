# Recruitment Module Design

## 1. Overview

The Recruitment Module manages the complete hiring workflow from job posting to employee onboarding. It uses a case-based approach where each candidate application creates a "case" that tracks their entire journey.

## 2. Core Concepts

### 2.1 Case-Based Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RECRUITMENT CASE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  A "Case" is the central object that encapsulates:                          │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Candidate  │  │    Job      │  │  Interview  │  │   Offer     │        │
│  │   Profile   │  │  Posting    │  │   History   │  │   History   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Stage     │  │ Communica-  │  │  Documents  │  │ Verification│        │
│  │   History   │  │   tions     │  │  Uploaded   │  │   Status    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  Case Number: RC-2024-0001                                                   │
│  Current Stage: INTERVIEW                                                    │
│  Status: Active                                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Workflow Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RECRUITMENT WORKFLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

 ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ APPLIED  │───>│SCREENING │───>│INTERVIEW │───>│  OFFER   │───>│  OFFER   │
 └──────────┘    └──────────┘    └──────────┘    │ PENDING  │    │   SENT   │
                                                 └──────────┘    └──────────┘
                                                                       │
                 ┌─────────────────────────────────────────────────────┤
                 │                                                     │
                 ▼                                                     ▼
          ┌──────────┐                                          ┌──────────┐
          │  OFFER   │                                          │  OFFER   │
          │ REJECTED │                                          │ ACCEPTED │
          └──────────┘                                          └──────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────┐
                                                                │ DOCUMENT │
                                                                │  UPLOAD  │
                                                                └──────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────┐
                                                                │VERIFICA- │
                                                                │   TION   │
                                                                └──────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────┐
                                                                │ VERIFIED │
                                                                └──────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────┐
                                                                │ONBOARDING│
                                                                └──────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────┐
                                                                │ONBOARDED │
                                                                └──────────┘

 At any point (except terminal stages):
 ┌──────────┐    ┌──────────┐
 │ REJECTED │    │WITHDRAWN │
 └──────────┘    └──────────┘
```

### 2.3 Stage Definitions

| Stage | Description | Actions | Next Stages |
|-------|-------------|---------|-------------|
| APPLIED | Application received | Review, Reject, Advance | SCREENING, REJECTED |
| SCREENING | Initial HR review | Schedule, Reject, Advance | INTERVIEW, REJECTED |
| INTERVIEW | Interview in progress | Schedule rounds, Add feedback | OFFER_PENDING, REJECTED |
| OFFER_PENDING | Preparing offer | Generate offer, Approve | OFFER_SENT, REJECTED |
| OFFER_SENT | Offer sent to candidate | Wait for response | OFFER_ACCEPTED, OFFER_REJECTED |
| OFFER_ACCEPTED | Candidate accepted | Create portal access | DOCUMENT_UPLOAD |
| OFFER_REJECTED | Candidate declined | Close case | - |
| DOCUMENT_UPLOAD | Awaiting documents | Review uploads | VERIFICATION |
| VERIFICATION | Documents under review | Verify, Reject docs | VERIFIED, DOCUMENT_UPLOAD |
| VERIFIED | All docs verified | Initiate onboarding | ONBOARDING |
| ONBOARDING | Onboarding in progress | Complete steps | ONBOARDED |
| ONBOARDED | Successfully hired | Convert to employee | - |
| REJECTED | Application rejected | Archive | - |
| WITHDRAWN | Candidate withdrew | Archive | - |

## 3. Feature Specifications

### 3.1 Job Posting Management

#### Create/Edit Job Posting

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CREATE JOB POSTING                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Job Title*: [________________________________]                              │
│                                                                              │
│  Department: [▼ Engineering________________]                                 │
│                                                                              │
│  Location:   [▼ Bangalore__________________]                                 │
│                                                                              │
│  Employment Type: ○ Full Time  ○ Part Time  ○ Contract  ○ Intern            │
│                                                                              │
│  Experience:  Min [__3__] years    Max [__7__] years                        │
│                                                                              │
│  Salary Range:  Min [₹10,00,000]    Max [₹20,00,000]                        │
│                 ☐ Show salary in job posting                                │
│                                                                              │
│  Description*:                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ We are looking for a talented Software Engineer to join our team...  │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Requirements*:                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ • 3+ years experience in web development                             │  │
│  │ • Strong proficiency in React and Node.js                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Skills: [JavaScript] [React] [Node.js] [+Add]                              │
│                                                                              │
│  Number of Openings: [__3__]                                                │
│                                                                              │
│  Application Deadline: [2024-03-31] 📅                                      │
│                                                                              │
│  [Save as Draft]                              [Publish]                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Recruitment Dashboard

#### Kanban View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RECRUITMENT DASHBOARD                    [List View] [📊 Kanban View]      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Search: [_________________________] 🔍   Filter: [All Jobs ▼] [All ▼]      │
│                                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│  │  APPLIED  │ │ SCREENING │ │ INTERVIEW │ │   OFFER   │ │  JOINING  │    │
│  │    (25)   │ │    (12)   │ │    (18)   │ │   (8)     │ │    (5)    │    │
│  ├───────────┤ ├───────────┤ ├───────────┤ ├───────────┤ ├───────────┤    │
│  │┌─────────┐│ │┌─────────┐│ │┌─────────┐│ │┌─────────┐│ │┌─────────┐│    │
│  ││John Doe ││ ││Jane Smi ││ ││Mike Bro ││ ││Sara Lee ││ ││Tom Cruz ││    │
│  ││SE Role  ││ ││PM Role  ││ ││DE Role  ││ ││SE Role  ││ ││SE Role  ││    │
│  ││2 days   ││ ││1 day    ││ ││5 days   ││ ││Pending  ││ ││Mar 1    ││    │
│  │└─────────┘│ │└─────────┘│ │└─────────┘│ │└─────────┘│ │└─────────┘│    │
│  │┌─────────┐│ │┌─────────┐│ │┌─────────┐│ │┌─────────┐│ │           │    │
│  ││Amy Wong ││ ││Bob Chen ││ ││Lisa Park││ ││         ││ │           │    │
│  ││DE Role  ││ ││SE Role  ││ ││PM Role  ││ ││         ││ │           │    │
│  ││1 day    ││ ││3 days   ││ ││2 days   ││ ││         ││ │           │    │
│  │└─────────┘│ │└─────────┘│ │└─────────┘│ │         ││ │           │    │
│  │    ...    │ │    ...    │ │    ...    │ │         ││ │           │    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Dashboard Stats

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  QUICK STATS                                                                 │
├────────────────┬────────────────┬────────────────┬────────────────┬─────────┤
│                │                │                │                │         │
│       12       │       87       │       15       │       12       │   28    │
│  Open Positions│  Active Cases  │ Offers Accepted│ Interviews This│  Avg    │
│                │                │   This Month   │      Week      │ Days to │
│                │                │                │                │  Hire   │
└────────────────┴────────────────┴────────────────┴────────────────┴─────────┘
```

### 3.3 Case Detail View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CASE: RC-2024-0001                                    Status: ● Active     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ APPLIED ─── SCREENING ─── INTERVIEW ─── OFFER ─── DOCUMENT ─── ONBOARD ││
│  │   ✓           ✓             ●                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────────┐ │
│  │ CANDIDATE INFO           │  │ JOB DETAILS                              │ │
│  ├──────────────────────────┤  ├──────────────────────────────────────────┤ │
│  │ 👤 John Doe              │  │ Software Engineer                        │ │
│  │ 📧 john@email.com        │  │ Department: Engineering                  │ │
│  │ 📱 +91-9876543210        │  │ Location: Bangalore                      │ │
│  │ 📄 [View Resume]         │  │ Exp: 3-7 years                           │ │
│  │ Source: LinkedIn         │  │ Type: Full Time                          │ │
│  │ Applied: Jan 15, 2024    │  │                                          │ │
│  └──────────────────────────┘  └──────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ [Timeline] [Interviews] [Documents] [Communications] [Offers]          ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │                                                                          ││
│  │  TIMELINE                                                                ││
│  │  ─────────────────────────────────────────────────────────────────────  ││
│  │                                                                          ││
│  │  ● Jan 20, 10:30 AM - Stage changed to INTERVIEW                        ││
│  │    By: HR Admin                                                          ││
│  │    Notes: "Passed screening, moving to technical round"                  ││
│  │                                                                          ││
│  │  ● Jan 18, 2:00 PM - Interview Scheduled                                ││
│  │    Technical Round with Engineering Team                                 ││
│  │    Scheduled: Jan 22, 2:00 PM                                           ││
│  │                                                                          ││
│  │  ● Jan 17, 11:00 AM - Note added                                        ││
│  │    By: HR Admin                                                          ││
│  │    "Had initial call, candidate seems strong"                           ││
│  │                                                                          ││
│  │  ● Jan 15, 9:00 AM - Application received                               ││
│  │    Stage: APPLIED                                                        ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────┐                                       │
│  │ QUICK ACTIONS                    │                                       │
│  ├──────────────────────────────────┤                                       │
│  │ [Schedule Interview]             │                                       │
│  │ [Add Note]                       │                                       │
│  │ [Send Email]                     │                                       │
│  │ [Advance to Next Stage]          │                                       │
│  │ [Reject Application]             │                                       │
│  └──────────────────────────────────┘                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Interview Management

#### Schedule Interview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SCHEDULE INTERVIEW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Round Number:  [__1__]                                                      │
│                                                                              │
│  Round Name:    [Technical Interview_____________________]                   │
│                                                                              │
│  Date & Time:   [2024-01-22] 📅  [14:00] ⏰                                 │
│                                                                              │
│  Duration:      [60] minutes                                                 │
│                                                                              │
│  Location:      [Conference Room A_______________________]                   │
│                 or                                                           │
│  Meeting Link:  [https://meet.google.com/xyz_____________]                   │
│                                                                              │
│  Interview Panel:                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ [✓] John Manager    - Engineering Lead    (Interviewer)              │  │
│  │ [✓] Jane Tech       - Senior Engineer     (Interviewer)              │  │
│  │ [ ] Bob HR          - HR Manager          (Observer)                 │  │
│  │ [+ Add Panelist]                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ☐ Send calendar invite to candidate                                        │
│  ☐ Send calendar invite to panelists                                        │
│                                                                              │
│  [Cancel]                                    [Schedule Interview]            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Submit Feedback

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTERVIEW FEEDBACK                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Candidate: John Doe                                                         │
│  Round: Technical Interview                                                  │
│  Date: Jan 22, 2024                                                         │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Overall Rating:  ★ ★ ★ ★ ☆  (4/5)                                         │
│                                                                              │
│  Technical Skills:     [████████░░] 8/10                                    │
│  Communication:        [██████████] 10/10                                   │
│  Problem Solving:      [███████░░░] 7/10                                    │
│  Cultural Fit:         [█████████░] 9/10                                    │
│                                                                              │
│  Detailed Feedback:                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Strong technical skills in React and Node.js. Demonstrated good      │  │
│  │ understanding of system design. Communication was excellent.          │  │
│  │ Could improve on database optimization knowledge.                     │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Recommendation:                                                             │
│  ○ Strong Hire  ● Hire  ○ No Hire  ○ Strong No Hire                        │
│                                                                              │
│  [Cancel]                                           [Submit Feedback]        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Offer Generation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GENERATE OFFER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Candidate: John Doe                                                         │
│  Position: Software Engineer                                                 │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Designation*:     [Senior Software Engineer_______________]                 │
│                                                                              │
│  Department*:      [▼ Engineering_________________________]                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  COMPENSATION                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Base Salary (Annual)*:    ₹ [15,00,000_______]                             │
│                                                                              │
│  Variable Pay (Annual):    ₹ [3,00,000________]                             │
│                                                                              │
│  Joining Bonus:            ₹ [1,00,000________]                             │
│                                                                              │
│  Other Benefits:                                                             │
│  ☑ Health Insurance (Employee + Family)                                     │
│  ☑ Life Insurance                                                           │
│  ☐ Stock Options: [______] units                                            │
│  ☐ Relocation Allowance: ₹ [______]                                         │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  JOINING DETAILS                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Proposed Joining Date*:   [2024-03-01] 📅                                  │
│                                                                              │
│  Offer Expiry Date*:       [2024-02-15] 📅                                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  TOTAL CTC: ₹ 19,00,000 per annum                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [Preview Offer Letter]     [Save as Draft]     [Submit for Approval]       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4. Workflow Actions

### 4.1 Stage Transition Rules

```typescript
// Workflow configuration (configurable per tenant)
const recruitmentWorkflow = {
  stages: [
    {
      code: 'APPLIED',
      name: 'Applied',
      sequence: 1,
      actions: [
        { code: 'advance', name: 'Move to Screening', targetStage: 'SCREENING', requiresNote: false },
        { code: 'reject', name: 'Reject', targetStage: 'REJECTED', requiresNote: true }
      ],
      autoActions: []
    },
    {
      code: 'SCREENING',
      name: 'Screening',
      sequence: 2,
      actions: [
        { code: 'advance', name: 'Move to Interview', targetStage: 'INTERVIEW', requiresNote: false },
        { code: 'reject', name: 'Reject', targetStage: 'REJECTED', requiresNote: true }
      ],
      autoActions: []
    },
    {
      code: 'OFFER_ACCEPTED',
      name: 'Offer Accepted',
      sequence: 6,
      actions: [
        { code: 'advance', name: 'Request Documents', targetStage: 'DOCUMENT_UPLOAD', requiresNote: false }
      ],
      autoActions: [
        { trigger: 'on_enter', action: 'create_candidate_portal_access' },
        { trigger: 'on_enter', action: 'send_document_checklist_email' }
      ]
    },
    // ... more stages
  ]
};
```

### 4.2 Automated Actions

| Trigger | Stage | Action |
|---------|-------|--------|
| Offer Accepted | OFFER_ACCEPTED → DOCUMENT_UPLOAD | Create candidate portal credentials |
| Offer Accepted | OFFER_ACCEPTED → DOCUMENT_UPLOAD | Send document checklist email |
| All Docs Verified | VERIFICATION → VERIFIED | Notify HR for onboarding |
| Onboarding Complete | ONBOARDING → ONBOARDED | Create employee record |
| Onboarding Complete | ONBOARDING → ONBOARDED | Convert user type to 'employee' |

## 5. Notifications

### 5.1 Email Notifications

| Event | Recipients | Template |
|-------|------------|----------|
| New Application | Assigned Recruiter | new_application |
| Interview Scheduled | Candidate, Panelists | interview_scheduled |
| Offer Generated | HR Admin (for approval) | offer_pending_approval |
| Offer Sent | Candidate | offer_letter |
| Offer Accepted | HR, Recruiter | offer_accepted |
| Documents Uploaded | HR | documents_uploaded |
| Document Rejected | Candidate | document_rejected |
| Onboarding Complete | IT, Admin, Finance | new_employee_onboarded |

### 5.2 In-App Notifications

| Event | Recipients |
|-------|------------|
| New application received | Assigned Recruiter |
| Stage changed | Case followers |
| Interview feedback submitted | HR, Recruiter |
| Document uploaded | HR |
| Offer response received | HR, Recruiter |

## 6. Document Verification

### 6.1 Required Documents (Configurable)

```typescript
const defaultDocumentChecklist = [
  { code: 'ID_PROOF', name: 'Identity Proof', description: 'Aadhar/Passport/Voter ID', required: true },
  { code: 'ADDRESS_PROOF', name: 'Address Proof', description: 'Utility bill/Bank statement', required: true },
  { code: 'PAN_CARD', name: 'PAN Card', description: 'Permanent Account Number', required: true },
  { code: 'EDUCATION', name: 'Educational Certificates', description: 'Highest degree certificate', required: true },
  { code: 'EXPERIENCE', name: 'Experience Letters', description: 'From previous employers', required: false },
  { code: 'RELIEVING', name: 'Relieving Letters', description: 'From previous employers', required: false },
  { code: 'PAYSLIPS', name: 'Salary Slips', description: 'Last 3 months', required: false },
  { code: 'BANK_DETAILS', name: 'Bank Details', description: 'Cancelled cheque/Passbook', required: true },
  { code: 'PHOTOS', name: 'Photographs', description: 'Passport size photos', required: true }
];
```

### 6.2 Verification Workflow

```
Document Uploaded
       │
       ▼
  ┌─────────┐
  │ PENDING │
  └────┬────┘
       │
       ├────────────────┬────────────────┐
       ▼                ▼                ▼
  ┌─────────┐    ┌───────────┐    ┌─────────┐
  │VERIFIED │    │ REJECTED  │    │RE-UPLOAD│
  │         │    │ (Reason)  │    │ REQUIRED│
  └─────────┘    └───────────┘    └─────────┘
                       │                │
                       └────────────────┘
                              │
                              ▼
                       Candidate uploads
                       new document
```

## 7. Candidate Portal Integration

### 7.1 Portal Access Flow

```
Offer Accepted
       │
       ▼
System creates User account
(userType: 'candidate')
       │
       ▼
Generate temporary password
       │
       ▼
Send credentials via email
       │
       ▼
Candidate logs in to portal
       │
       ▼
Upload required documents
       │
       ▼
Complete profile information
       │
       ▼
HR verifies documents
       │
       ▼
Onboarding complete
       │
       ▼
User type changes to 'employee'
Portal redirects to Employee Portal
```

### 7.2 Candidate Portal Features

- View offer letter and accept/reject
- Upload documents from checklist
- Track document verification status
- Complete personal information
- View joining instructions
- Contact HR for queries

## 8. Reporting & Analytics

### 8.1 Key Metrics

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Time to Hire | Days from application to onboarding | Avg(onboarded_date - applied_date) |
| Conversion Rate | % of applications that result in hire | (Onboarded / Applied) * 100 |
| Offer Acceptance Rate | % of offers accepted | (Accepted / Sent) * 100 |
| Interview-to-Offer Ratio | Interviews needed per offer | Interviews / Offers |
| Source Effectiveness | Hires by source | Group by source |

### 8.2 Dashboard Reports

- Pipeline funnel visualization
- Time-in-stage analysis
- Recruiter workload
- Source analysis
- Monthly hiring trends

---

## Next Steps

1. Review and approve this recruitment module design
2. Proceed to [HR Module Design](./06-HR-MODULE.md)
