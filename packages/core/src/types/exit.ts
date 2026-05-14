import { AuditFields } from './common.js';

export type ExitType = 'resignation' | 'termination' | 'retirement' | 'absconding';
export type ExitRequestStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'withdrawn';
export type ClearanceStatus = 'pending' | 'cleared' | 'not_applicable';
export type ExitDocumentType = 'experience_letter' | 'relieving_letter' | 'fnf_statement' | 'other';

export type ExitStage = 
  | 'INITIATED'
  | 'MANAGER_REVIEW'
  | 'HR_REVIEW'
  | 'NOTICE_PERIOD'
  | 'CLEARANCE'
  | 'SETTLEMENT'
  | 'EXIT_INTERVIEW'
  | 'COMPLETED'
  | 'LIFETIME_ACCESS';

export interface ExitRequest extends AuditFields {
  id: string;
  tenantId: string;
  employeeId: string;
  exitType: ExitType;
  reason?: string;
  noticePeriodDays: number;
  requestedLastDate: Date;
  approvedLastDate?: Date;
  actualLastDate?: Date;
  currentStage: ExitStage;
  status: ExitRequestStatus;
  employee?: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName?: string;
    email: string;
    department?: string;
    designation?: string;
  };
  stageHistory?: ExitStageHistory[];
  clearances?: ExitClearance[];
  documents?: ExitDocument[];
  interview?: ExitInterview;
}

export interface CreateExitRequestRequest {
  exitType: ExitType;
  reason?: string;
  requestedLastDate: string;
}

export interface ExitStageHistory {
  id: string;
  exitRequestId: string;
  fromStage?: ExitStage;
  toStage: ExitStage;
  notes?: string;
  updatedBy: string;
  createdAt: Date;
}

export interface UpdateExitStageRequest {
  stage: ExitStage;
  notes?: string;
  approvedLastDate?: string;
}

export interface ExitClearance {
  id: string;
  exitRequestId: string;
  clearanceItemId: string;
  clearanceItemName?: string;
  clearanceItemDepartment?: string;
  status: ClearanceStatus;
  clearedBy?: string;
  clearedAt?: Date;
  remarks?: string;
}

export interface UpdateClearanceRequest {
  status: ClearanceStatus;
  remarks?: string;
}

export interface ExitDocument {
  id: string;
  exitRequestId: string;
  documentType: ExitDocumentType;
  fileName: string;
  fileUrl: string;
  issuedDate?: Date;
  issuedBy?: string;
  createdAt: Date;
}

export interface GenerateExitDocumentRequest {
  documentType: ExitDocumentType;
}

export interface ExitInterview {
  id: string;
  exitRequestId: string;
  conductedBy: string;
  conductedAt?: Date;
  overallExperienceRating?: number;
  wouldRecommend?: boolean;
  reasonForLeaving?: string;
  feedback?: string;
  suggestions?: string;
  createdAt: Date;
}

export interface CreateExitInterviewRequest {
  overallExperienceRating?: number;
  wouldRecommend?: boolean;
  reasonForLeaving?: string;
  feedback?: string;
  suggestions?: string;
}

export interface ExitDashboardStats {
  totalExitRequests: number;
  pendingApprovals: number;
  inNoticePeriod: number;
  pendingClearances: number;
  completedThisMonth: number;
  avgNoticePeriod: number;
}

export interface ExitRequestListFilters {
  search?: string;
  exitType?: ExitType;
  stage?: ExitStage;
  status?: ExitRequestStatus;
  departmentId?: string;
  dateFrom?: string;
  dateTo?: string;
}
