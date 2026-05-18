export type CandidateStatus =
  | 'NOT_STARTED'
  | 'SCREENED'
  | 'TECH_ROUND_1'
  | 'TECH_ROUND_2'
  | 'TECH_ROUND_3'
  | 'FINAL_ROUND'
  | 'OFFER_ROUND'
  | 'SELECTED'
  | 'OFFERED'
  | 'JOINING'
  | 'JOINED'
  | 'NOT_INTERESTED'
  | 'NOT_RESPONDING';

export type DocumentStatus = 'draft' | 'submitted' | 'none';

export interface CandidateComment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface CandidateDocument {
  id: string;
  documentType: string;
  fileName: string;
  status: 'draft' | 'submitted';
  isLocked: boolean;
  uploadedAt: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: CandidateStatus;
  notes?: string;
  portalEnabled: boolean;
  lastComment?: { preview: string; createdAt: string; authorName: string };
  documentsSummary: { total: number; submitted: number; hasDraft: boolean };
  comments: CandidateComment[];
  documents: CandidateDocument[];
}

export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  department?: string;
  joiningDate?: string;
  status: EmployeeStatus;
}

export type SalaryHeadType = 'earning' | 'deduction';

export interface SalaryHead {
  id: string;
  code: string;
  name: string;
  type: SalaryHeadType;
  isTaxable: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  source: 'biometric' | 'manual' | 'file_import';
}
