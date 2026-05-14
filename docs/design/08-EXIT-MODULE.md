# Exit Management Module Design

## 1. Overview

The Exit Management Module handles the complete employee separation process from resignation/termination through final settlement and transition to lifetime portal access.

## 2. Exit Workflow

### 2.1 Complete Exit Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXIT WORKFLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Employee Initiates
       │
       ▼
┌──────────────┐
│  INITIATED   │  Employee submits resignation
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   MANAGER    │  Manager acknowledges and approves
│    REVIEW    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  HR REVIEW   │  HR verifies notice period, LWD
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   NOTICE     │  Employee serves notice period
│   PERIOD     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  CLEARANCE   │  Department-wise clearance
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SETTLEMENT   │  Full & Final calculation
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    EXIT      │  Conduct exit interview
│  INTERVIEW   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  COMPLETED   │  Issue documents, close records
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  LIFETIME    │  Convert to lifetime portal access
│   ACCESS     │
└──────────────┘
```

### 2.2 Stage Definitions

| Stage | Owner | Description | Actions |
|-------|-------|-------------|---------|
| INITIATED | Employee | Resignation submitted | Submit, Withdraw |
| MANAGER_REVIEW | Manager | Manager reviews request | Acknowledge, Request revision |
| HR_REVIEW | HR | HR validates details | Approve, Reject, Modify LWD |
| NOTICE_PERIOD | - | Employee serving notice | Track days, Early release |
| CLEARANCE | Multiple | Clearances in progress | Clear items, Mark N/A |
| SETTLEMENT | Finance | F&F calculation | Calculate, Approve |
| EXIT_INTERVIEW | HR | Exit interview | Conduct, Record feedback |
| COMPLETED | HR | Process complete | Issue documents |
| LIFETIME_ACCESS | System | Account transition | Auto-convert |

## 3. Feature Specifications

### 3.1 Resignation Request (Employee)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUBMIT RESIGNATION                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚠️ Please note: This action will initiate your exit process.              │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  YOUR DETAILS                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Employee:          John Doe (EMP001)                                       │
│  Department:        Engineering                                              │
│  Designation:       Senior Software Engineer                                 │
│  Date of Joining:   March 15, 2020                                          │
│  Notice Period:     60 days (as per policy)                                 │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  RESIGNATION DETAILS                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Exit Type*:        ● Resignation                                           │
│                     ○ Retirement                                            │
│                                                                              │
│  Reason for Leaving*:                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ I have received a better career opportunity that aligns with my      │  │
│  │ long-term career goals.                                               │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Requested Last Working Day*:  [2024-04-15] 📅                              │
│                                                                              │
│  ℹ️ Based on 60-day notice period, minimum LWD is April 15, 2024           │
│                                                                              │
│  ☐ I request early release from notice period                               │
│     If yes, requested release date: [__________] 📅                         │
│     Reason for early release:                                               │
│     [________________________________________________]                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☑ I understand that this action cannot be undone after HR approval.       │
│  ☑ I confirm all information provided is accurate.                          │
│                                                                              │
│  [Cancel]                                         [Submit Resignation]      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Exit Dashboard (HR)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXIT MANAGEMENT                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │      12      │ │       3      │ │       5      │ │       2      │       │
│  │    Total     │ │   Pending    │ │   In Notice  │ │   Pending    │       │
│  │   Requests   │ │   Approval   │ │    Period    │ │  Clearances  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  Filters: Stage [All ▼]  Department [All ▼]  Date Range [This Month ▼]     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Employee      │ Dept      │ LWD       │ Stage        │ Days  │ Action│  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ John Doe      │ Engg      │ Apr 15    │ NOTICE_PERIOD│ 45    │ [View]│  │
│  │ Jane Smith    │ HR        │ Mar 31    │ CLEARANCE    │ 15    │ [View]│  │
│  │ Mike Brown    │ Finance   │ Apr 30    │ HR_REVIEW    │ -     │ [View]│  │
│  │ Sara Lee      │ Engg      │ Mar 25    │ COMPLETED    │ -     │ [View]│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  UPCOMING LWDs THIS WEEK                                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Mar 25 (Mon) │ Sara Lee      │ Engineering  │ Clearance Pending     │  │
│  │ Mar 28 (Thu) │ Tom Chen      │ Sales        │ Ready                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Exit Request Detail

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXIT REQUEST - John Doe                                    Status: Active  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ INITIATED ── MANAGER ── HR REVIEW ── NOTICE ── CLEARANCE ── ...        ││
│  │    ✓           ✓          ✓           ●                                 ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │ EMPLOYEE DETAILS               │  │ EXIT DETAILS                       │ │
│  ├────────────────────────────────┤  ├────────────────────────────────────┤ │
│  │ Name: John Doe                 │  │ Exit Type: Resignation             │ │
│  │ Code: EMP001                   │  │ Initiated: Feb 15, 2024            │ │
│  │ Dept: Engineering              │  │ Notice Period: 60 days             │ │
│  │ Desg: Sr. Software Engineer    │  │ Requested LWD: Apr 15, 2024        │ │
│  │ Manager: Jane Smith            │  │ Approved LWD: Apr 15, 2024         │ │
│  │ Joining: Mar 15, 2020          │  │ Days Remaining: 45                 │ │
│  │ Tenure: 4 years                │  │                                    │ │
│  └────────────────────────────────┘  └────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ [Timeline] [Clearances] [Documents] [Exit Interview]                    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  TIMELINE                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ● Mar 01, 9:00 AM - Stage changed to NOTICE_PERIOD                        │
│    By: HR Admin                                                              │
│    Notes: "Approved. LWD confirmed as April 15, 2024"                       │
│                                                                              │
│  ● Feb 28, 4:00 PM - Stage changed to HR_REVIEW                            │
│    By: Jane Smith (Manager)                                                  │
│    Notes: "Acknowledged. Requesting HR to process"                          │
│                                                                              │
│  ● Feb 15, 10:00 AM - Exit request initiated                                │
│    By: John Doe                                                              │
│    Reason: "Better career opportunity"                                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ACTIONS                                                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [Initiate Clearance]  [Grant Early Release]  [Add Note]                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4. Clearance Process

### 4.1 Clearance Configuration (Admin)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLEARANCE ITEMS CONFIGURATION                           [+ Add Item]       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Item                   │ Department │ Mandatory │ Cleared By │ ●    │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Laptop Return          │ IT         │ Yes       │ IT Admin   │ ●    │  │
│  │ Access Card Return     │ Admin      │ Yes       │ Admin      │ ●    │  │
│  │ Parking Pass           │ Admin      │ No        │ Admin      │ ●    │  │
│  │ Library Materials      │ Admin      │ No        │ Librarian  │ ●    │  │
│  │ Pending Expense Claims │ Finance    │ Yes       │ Finance    │ ●    │  │
│  │ Outstanding Advances   │ Finance    │ Yes       │ Finance    │ ●    │  │
│  │ Project Handover       │ Manager    │ Yes       │ Manager    │ ●    │  │
│  │ Knowledge Transfer     │ Manager    │ Yes       │ Manager    │ ●    │  │
│  │ HR Documentation       │ HR         │ Yes       │ HR         │ ●    │  │
│  │ ID Card Return         │ HR         │ Yes       │ HR         │ ●    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ● Active  ○ Inactive                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Clearance Status (HR View)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLEARANCE STATUS - John Doe                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Overall Progress: ████████░░░░░░░░ 6/10 items cleared                      │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Department │ Item                │ Status      │ By        │ Date   │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ IT         │ Laptop Return       │ ✓ Cleared   │ IT Admin  │ Apr 10 │  │
│  │ IT         │ Software Licenses   │ ✓ Cleared   │ IT Admin  │ Apr 10 │  │
│  │ Admin      │ Access Card         │ ✓ Cleared   │ Admin     │ Apr 11 │  │
│  │ Admin      │ Parking Pass        │ ⊘ N/A       │ Admin     │ Apr 11 │  │
│  │ Finance    │ Expense Claims      │ ✓ Cleared   │ Finance   │ Apr 12 │  │
│  │ Finance    │ Advances            │ ✓ Cleared   │ Finance   │ Apr 12 │  │
│  │ Manager    │ Project Handover    │ ⏳ Pending  │ -         │ -      │  │
│  │ Manager    │ Knowledge Transfer  │ ⏳ Pending  │ -         │ -      │  │
│  │ HR         │ HR Documentation    │ ⏳ Pending  │ -         │ -      │  │
│  │ HR         │ ID Card Return      │ ⏳ Pending  │ -         │ -      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [Send Reminder to Pending Approvers]                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Clearance Action (Department Head)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLEAR ITEM - Project Handover                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Employee: John Doe (EMP001)                                                │
│  Department: Engineering                                                     │
│  LWD: April 15, 2024                                                        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ITEM DETAILS                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Item: Project Handover                                                     │
│  Department: Manager/Team                                                   │
│  Mandatory: Yes                                                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ACTION                                                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Status*:  ○ Cleared  ○ Not Applicable                                      │
│                                                                              │
│  Remarks:                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ All projects handed over to team members. Documentation complete.    │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [Cancel]                                              [Submit Clearance]   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5. Exit Interview

### 5.1 Conduct Exit Interview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXIT INTERVIEW - John Doe                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Employee: John Doe                                                         │
│  Tenure: 4 years (Mar 2020 - Apr 2024)                                      │
│  Department: Engineering                                                     │
│  Last Designation: Senior Software Engineer                                 │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  INTERVIEW DETAILS                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Interview Date*:     [2024-04-14] 📅                                       │
│                                                                              │
│  Conducted By:        [HR Admin_______________________]                     │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  FEEDBACK                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Overall Experience Rating:  ★ ★ ★ ★ ☆  (4/5)                              │
│                                                                              │
│  Would you recommend this company to others?                                 │
│  ● Yes  ○ No  ○ Maybe                                                       │
│                                                                              │
│  Primary Reason for Leaving:                                                 │
│  [▼ Better Career Opportunity________________________]                      │
│                                                                              │
│  What did you like most about working here?                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Great team culture, excellent learning opportunities, supportive     │  │
│  │ management. The engineering team was particularly collaborative.     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  What could the company improve?                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Better career growth paths and more competitive compensation.        │  │
│  │ Remote work policies could be more flexible.                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Any suggestions or additional feedback?                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Consider implementing mentorship programs for junior developers.     │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [Save as Draft]                                    [Submit Interview]      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6. Exit Documents

### 6.1 Document Generation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXIT DOCUMENTS - John Doe                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Document              │ Status      │ Issued Date │ Action           │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Experience Letter     │ ✓ Issued    │ Apr 15      │ [View] [📥]      │  │
│  │ Relieving Letter      │ ✓ Issued    │ Apr 15      │ [View] [📥]      │  │
│  │ F&F Statement         │ ⏳ Pending  │ -           │ [Generate]       │  │
│  │ Form 16 (Provisional) │ ✓ Issued    │ Apr 15      │ [View] [📥]      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  [Generate Experience Letter]  [Generate Relieving Letter]                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Experience Letter Template

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                           [COMPANY LOGO]                                    │
│                                                                              │
│                         EXPERIENCE CERTIFICATE                              │
│                                                                              │
│  Date: {{issue_date}}                                                       │
│                                                                              │
│  TO WHOM IT MAY CONCERN                                                     │
│                                                                              │
│  This is to certify that {{employee_name}} was employed with                │
│  {{company_name}} from {{joining_date}} to {{relieving_date}}.             │
│                                                                              │
│  During this period, {{pronoun}} served in the following capacity:         │
│                                                                              │
│  Designation: {{last_designation}}                                          │
│  Department: {{department}}                                                 │
│                                                                              │
│  {{employee_name}}'s conduct and performance during the tenure was         │
│  found to be good. {{pronoun_cap}} is relieved from {{pronoun_possessive}} │
│  duties on {{relieving_date}}.                                              │
│                                                                              │
│  We wish {{pronoun_objective}} all the best in {{pronoun_possessive}}       │
│  future endeavors.                                                          │
│                                                                              │
│                                                                              │
│  For {{company_name}}                                                       │
│                                                                              │
│                                                                              │
│  ___________________________                                                │
│  {{hr_name}}                                                                │
│  {{hr_designation}}                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7. Account Transition

### 7.1 Transition to Lifetime Portal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACCOUNT TRANSITION                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Exit Completed
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ 1. Employee Status: active → exited                              │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. User Type: employee → lifetime                                │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. Role Assignment: Remove employee role, assign lifetime role   │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. Portal Access: Redirect to lifetime.company.com               │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. Send notification email with lifetime portal access details   │
└──────────────────────────────────────────────────────────────────┘
```

### 7.2 Transition Email

```
Subject: Lifetime Portal Access - {{company_name}}

Dear {{employee_name}},

Your tenure at {{company_name}} has officially ended as of {{relieving_date}}.
We thank you for your contributions during your time with us.

You now have lifetime access to our ex-employee portal where you can:
- Download your experience letter and relieving letter
- Access your payslips and Form 16 documents
- View your employment history
- Raise any queries or requests

Portal Access:
URL: https://lifetime.{{company_domain}}
Login: Your existing email and password

If you have any questions, please contact hr@{{company_domain}}.

Best wishes for your future endeavors!

Regards,
HR Team
{{company_name}}
```

## 8. Lifetime Portal

### 8.1 Lifetime Portal Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LIFETIME PORTAL                                                🔔          │
│  Welcome back, John!                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ EMPLOYMENT SUMMARY                                                      ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │                                                                          ││
│  │  Company:           {{company_name}}                                    ││
│  │  Tenure:            March 15, 2020 - April 15, 2024 (4 years)          ││
│  │  Last Designation:  Senior Software Engineer                            ││
│  │  Department:        Engineering                                         ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │ MY DOCUMENTS                   │  │ QUICK ACTIONS                      │ │
│  ├────────────────────────────────┤  ├────────────────────────────────────┤ │
│  │                                │  │                                    │ │
│  │ 📄 Experience Letter           │  │ [📄 Download All Documents]        │ │
│  │    [Download]                  │  │                                    │ │
│  │                                │  │ [❓ Raise a Query]                  │ │
│  │ 📄 Relieving Letter            │  │                                    │ │
│  │    [Download]                  │  │ [📧 Contact HR]                    │ │
│  │                                │  │                                    │ │
│  │ 📄 Full & Final Statement      │  │                                    │ │
│  │    [Download]                  │  │                                    │ │
│  │                                │  │                                    │ │
│  │ [View All Documents →]         │  │                                    │ │
│  │                                │  │                                    │ │
│  └────────────────────────────────┘  └────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ PAYSLIPS & TAX DOCUMENTS                                                ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │                                                                          ││
│  │  ┌────────────────────────────────────────────────────────────────┐    ││
│  │  │ Year       │ Document          │ Action                       │    ││
│  │  ├────────────────────────────────────────────────────────────────┤    ││
│  │  │ FY 2023-24 │ Form 16           │ [Download]                   │    ││
│  │  │ FY 2022-23 │ Form 16           │ [Download]                   │    ││
│  │  │ FY 2021-22 │ Form 16           │ [Download]                   │    ││
│  │  └────────────────────────────────────────────────────────────────┘    ││
│  │                                                                          ││
│  │  [View All Payslips →]                                                  ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Raise Query

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RAISE A QUERY                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Query Type*:        [▼ Document Request__________________]                 │
│                                                                              │
│                      Options:                                               │
│                      - Document Request                                     │
│                      - Salary Query                                         │
│                      - Tax Related                                          │
│                      - Background Verification                              │
│                      - Other                                                │
│                                                                              │
│  Subject*:           [Request for Salary Certificate_____]                  │
│                                                                              │
│  Description*:                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ I need a salary certificate for loan application. Please provide     │  │
│  │ a certificate for my last 6 months of employment.                    │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Attachment:         [Choose File] (optional)                               │
│                                                                              │
│  [Submit Query]                                                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  MY QUERIES                                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ #     │ Subject                    │ Status    │ Date      │         │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ Q-001 │ Request for Salary Cert    │ ⏳ Open   │ May 01    │ [View]  │  │
│  │ Q-002 │ Form 16 Correction         │ ✓ Resolved│ Apr 20    │ [View]  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9. Notifications & Reminders

### 9.1 Exit Process Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| Resignation submitted | Manager, HR | Email, In-app |
| Manager acknowledged | Employee, HR | Email, In-app |
| HR approved | Employee, Manager | Email, In-app |
| Clearance pending | Clearance approvers | Email |
| Clearance reminder | Pending approvers | Email (daily) |
| All clearances complete | HR, Employee | Email, In-app |
| Documents ready | Employee | Email |
| Exit completed | Employee | Email |

### 9.2 Automated Reminders

- Daily reminder to pending clearance approvers
- Weekly summary to HR for pending exits
- LWD reminder 3 days before
- Exit interview reminder 2 days before LWD

---

## Next Steps

1. Review and approve this exit module design
2. Proceed to [Configuration System Design](./09-CONFIGURATION-SYSTEM.md)
