import { ExitStage } from '../types/exit.js';

export const EXIT_STAGES: { code: ExitStage; name: string; sequence: number }[] = [
  { code: 'INITIATED', name: 'Initiated', sequence: 1 },
  { code: 'MANAGER_REVIEW', name: 'Manager Review', sequence: 2 },
  { code: 'HR_REVIEW', name: 'HR Review', sequence: 3 },
  { code: 'NOTICE_PERIOD', name: 'Notice Period', sequence: 4 },
  { code: 'CLEARANCE', name: 'Clearance', sequence: 5 },
  { code: 'SETTLEMENT', name: 'Settlement', sequence: 6 },
  { code: 'EXIT_INTERVIEW', name: 'Exit Interview', sequence: 7 },
  { code: 'COMPLETED', name: 'Completed', sequence: 8 },
  { code: 'LIFETIME_ACCESS', name: 'Lifetime Access', sequence: 9 },
];

export const EXIT_STAGE_TRANSITIONS: Record<ExitStage, ExitStage[]> = {
  INITIATED: ['MANAGER_REVIEW'],
  MANAGER_REVIEW: ['HR_REVIEW', 'INITIATED'],
  HR_REVIEW: ['NOTICE_PERIOD', 'MANAGER_REVIEW'],
  NOTICE_PERIOD: ['CLEARANCE'],
  CLEARANCE: ['SETTLEMENT'],
  SETTLEMENT: ['EXIT_INTERVIEW'],
  EXIT_INTERVIEW: ['COMPLETED'],
  COMPLETED: ['LIFETIME_ACCESS'],
  LIFETIME_ACCESS: [],
};

export const EXIT_TYPES = [
  { value: 'resignation', label: 'Resignation' },
  { value: 'termination', label: 'Termination' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'absconding', label: 'Absconding' },
];

export const EXIT_REQUEST_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'processing' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'completed', label: 'Completed', color: 'default' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'warning' },
];

export const CLEARANCE_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'processing' },
  { value: 'cleared', label: 'Cleared', color: 'success' },
  { value: 'not_applicable', label: 'Not Applicable', color: 'default' },
];

export const DEFAULT_CLEARANCE_ITEMS = [
  { code: 'IT_ASSETS', name: 'IT Assets', department: 'IT' },
  { code: 'LAPTOP', name: 'Laptop Return', department: 'IT' },
  { code: 'ACCESS_CARD', name: 'Access Card', department: 'Admin' },
  { code: 'PARKING', name: 'Parking Pass', department: 'Admin' },
  { code: 'LIBRARY', name: 'Library Materials', department: 'Admin' },
  { code: 'FINANCE', name: 'Finance Clearance', department: 'Finance' },
  { code: 'EXPENSE_CLAIMS', name: 'Pending Expense Claims', department: 'Finance' },
  { code: 'ADVANCES', name: 'Outstanding Advances', department: 'Finance' },
  { code: 'PROJECT_HANDOVER', name: 'Project Handover', department: 'Manager' },
  { code: 'KT', name: 'Knowledge Transfer', department: 'Manager' },
  { code: 'HR_DOCS', name: 'HR Documentation', department: 'HR' },
  { code: 'ID_CARD', name: 'ID Card Return', department: 'HR' },
];

export const EXIT_DOCUMENT_TYPES = [
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'relieving_letter', label: 'Relieving Letter' },
  { value: 'fnf_statement', label: 'Full & Final Statement' },
  { value: 'other', label: 'Other' },
];
