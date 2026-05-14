import { UserType, MenuItem } from '../types/auth.js';

export const USER_TYPES: { value: UserType; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'hr_admin', label: 'HR Admin' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'lifetime', label: 'Lifetime' },
];

export const PERMISSION_ACTIONS = ['create', 'read', 'update', 'delete'] as const;

export const DEFAULT_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  // Recruitment Module
  { name: 'Recruitment', code: 'RECRUITMENT', module: 'recruitment', sortOrder: 1, isActive: true },
  { name: 'Dashboard', code: 'RECRUITMENT_DASHBOARD', module: 'recruitment', route: '/recruitment/dashboard', sortOrder: 1, isActive: true },
  { name: 'Job Postings', code: 'JOB_POSTINGS', module: 'recruitment', route: '/recruitment/jobs', sortOrder: 2, isActive: true },
  { name: 'Candidates', code: 'CANDIDATES', module: 'recruitment', route: '/recruitment/candidates', sortOrder: 3, isActive: true },
  { name: 'Cases', code: 'RECRUITMENT_CASES', module: 'recruitment', route: '/recruitment/cases', sortOrder: 4, isActive: true },
  { name: 'Interviews', code: 'INTERVIEWS', module: 'recruitment', route: '/recruitment/interviews', sortOrder: 5, isActive: true },
  { name: 'Offers', code: 'OFFERS', module: 'recruitment', route: '/recruitment/offers', sortOrder: 6, isActive: true },
  
  // HR Module
  { name: 'HR', code: 'HR', module: 'hr', sortOrder: 2, isActive: true },
  { name: 'Dashboard', code: 'HR_DASHBOARD', module: 'hr', route: '/hr/dashboard', sortOrder: 1, isActive: true },
  { name: 'Employees', code: 'EMPLOYEES', module: 'hr', route: '/hr/employees', sortOrder: 2, isActive: true },
  { name: 'Departments', code: 'DEPARTMENTS', module: 'hr', route: '/hr/departments', sortOrder: 3, isActive: true },
  { name: 'Designations', code: 'DESIGNATIONS', module: 'hr', route: '/hr/designations', sortOrder: 4, isActive: true },
  { name: 'Leave Types', code: 'LEAVE_TYPES', module: 'hr', route: '/hr/leave-types', sortOrder: 5, isActive: true },
  { name: 'Leave Policies', code: 'LEAVE_POLICIES', module: 'hr', route: '/hr/leave-policies', sortOrder: 6, isActive: true },
  { name: 'Leave Requests', code: 'LEAVE_REQUESTS', module: 'hr', route: '/hr/leave-requests', sortOrder: 7, isActive: true },
  { name: 'Holidays', code: 'HOLIDAYS', module: 'hr', route: '/hr/holidays', sortOrder: 8, isActive: true },
  { name: 'Onboarding', code: 'ONBOARDING', module: 'hr', route: '/hr/onboarding', sortOrder: 9, isActive: true },
  
  // Exit Module
  { name: 'Exit Management', code: 'EXIT', module: 'exit', sortOrder: 3, isActive: true },
  { name: 'Exit Requests', code: 'EXIT_REQUESTS', module: 'exit', route: '/exit/requests', sortOrder: 1, isActive: true },
  { name: 'Clearances', code: 'CLEARANCES', module: 'exit', route: '/exit/clearances', sortOrder: 2, isActive: true },
  { name: 'Exit Interviews', code: 'EXIT_INTERVIEWS', module: 'exit', route: '/exit/interviews', sortOrder: 3, isActive: true },
  
  // Employee Module (Self-Service)
  { name: 'My Info', code: 'MY_INFO', module: 'employee', sortOrder: 4, isActive: true },
  { name: 'My Profile', code: 'MY_PROFILE', module: 'employee', route: '/employee/profile', sortOrder: 1, isActive: true },
  { name: 'My Leaves', code: 'MY_LEAVES', module: 'employee', route: '/employee/leaves', sortOrder: 2, isActive: true },
  { name: 'My Documents', code: 'MY_DOCUMENTS', module: 'employee', route: '/employee/documents', sortOrder: 3, isActive: true },
  { name: 'My Payslips', code: 'MY_PAYSLIPS', module: 'employee', route: '/employee/payslips', sortOrder: 4, isActive: true },
  
  // Admin Module
  { name: 'Administration', code: 'ADMIN', module: 'admin', sortOrder: 5, isActive: true },
  { name: 'Users', code: 'USERS', module: 'admin', route: '/admin/users', sortOrder: 1, isActive: true },
  { name: 'Roles', code: 'ROLES', module: 'admin', route: '/admin/roles', sortOrder: 2, isActive: true },
  { name: 'Configuration', code: 'CONFIGURATION', module: 'admin', route: '/admin/config', sortOrder: 3, isActive: true },
  { name: 'Email Templates', code: 'EMAIL_TEMPLATES', module: 'admin', route: '/admin/email-templates', sortOrder: 4, isActive: true },
  { name: 'Document Templates', code: 'DOCUMENT_TEMPLATES', module: 'admin', route: '/admin/document-templates', sortOrder: 5, isActive: true },
  { name: 'Workflows', code: 'WORKFLOWS', module: 'admin', route: '/admin/workflows', sortOrder: 6, isActive: true },
  { name: 'Audit Logs', code: 'AUDIT_LOGS', module: 'admin', route: '/admin/audit-logs', sortOrder: 7, isActive: true },
];

export const DEFAULT_SYSTEM_ROLES = [
  {
    name: 'Super Admin',
    description: 'Full system access',
    permissions: '*', // All permissions
  },
  {
    name: 'HR Admin',
    description: 'Full HR module access',
    permissions: [
      'RECRUITMENT:*',
      'HR:*',
      'EXIT:*',
      'EMPLOYEES:*',
      'LEAVE_REQUESTS:*',
    ],
  },
  {
    name: 'Recruiter',
    description: 'Recruitment module access',
    permissions: [
      'RECRUITMENT_DASHBOARD:read',
      'JOB_POSTINGS:*',
      'CANDIDATES:*',
      'RECRUITMENT_CASES:*',
      'INTERVIEWS:*',
      'OFFERS:*',
    ],
  },
  {
    name: 'Manager',
    description: 'Team management access',
    permissions: [
      'HR_DASHBOARD:read',
      'EMPLOYEES:read',
      'LEAVE_REQUESTS:read,update',
      'EXIT_REQUESTS:read,update',
      'MY_PROFILE:read,update',
      'MY_LEAVES:*',
      'MY_DOCUMENTS:read',
    ],
  },
  {
    name: 'Employee',
    description: 'Employee self-service access',
    permissions: [
      'MY_PROFILE:read,update',
      'MY_LEAVES:*',
      'MY_DOCUMENTS:read',
      'MY_PAYSLIPS:read',
    ],
  },
  {
    name: 'Candidate',
    description: 'Candidate portal access',
    permissions: [
      'MY_PROFILE:read,update',
      'MY_DOCUMENTS:read,create',
    ],
  },
  {
    name: 'Lifetime',
    description: 'Ex-employee limited access',
    permissions: [
      'MY_PROFILE:read',
      'MY_DOCUMENTS:read',
      'MY_PAYSLIPS:read',
    ],
  },
];
