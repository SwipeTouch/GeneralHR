import { AuditFields } from './common.js';

export type JobPostingStatus = 'draft' | 'active' | 'paused' | 'closed';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type CandidateSource = 'direct' | 'referral' | 'job_board' | 'linkedin' | 'other';
export type CaseStatus = 'active' | 'on_hold' | 'closed';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type InterviewRecommendation = 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
export type OfferStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
export type DocumentVerificationStatus = 'pending' | 'verified' | 'rejected';
export type CommunicationType = 'note' | 'email' | 'call' | 'meeting' | 'system';

export type RecruitmentStage = 
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER_PENDING'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'DOCUMENT_UPLOAD'
  | 'VERIFICATION'
  | 'VERIFIED'
  | 'ONBOARDING'
  | 'ONBOARDED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface JobPosting extends AuditFields {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  requirements?: string;
  departmentId?: string;
  locationId?: string;
  employmentType: EmploymentType;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  showSalary: boolean;
  skills?: string[];
  openings: number;
  status: JobPostingStatus;
  applicationDeadline?: Date;
  createdBy?: string;
}

export interface CreateJobPostingRequest {
  title: string;
  description?: string;
  requirements?: string;
  departmentId?: string;
  locationId?: string;
  employmentType?: EmploymentType;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  showSalary?: boolean;
  skills?: string[];
  openings?: number;
  applicationDeadline?: string;
}

export interface Candidate extends AuditFields {
  id: string;
  tenantId: string;
  userId?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  source: CandidateSource;
  sourceDetails?: string;
}

export interface CreateCandidateRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  source?: CandidateSource;
  sourceDetails?: string;
  jobPostingId: string;
}

export interface RecruitmentCase extends AuditFields {
  id: string;
  tenantId: string;
  caseNumber: string;
  candidateId: string;
  jobPostingId: string;
  currentStage: RecruitmentStage;
  status: CaseStatus;
  assignedRecruiterId?: string;
  expectedJoiningDate?: Date;
  actualJoiningDate?: Date;
  candidate?: Candidate;
  jobPosting?: JobPosting;
  stageHistory?: CaseStageHistory[];
  communications?: CaseCommunication[];
  interviews?: Interview[];
  offers?: Offer[];
  documents?: CandidateDocument[];
}

export interface CaseStageHistory {
  id: string;
  caseId: string;
  fromStage?: RecruitmentStage;
  toStage: RecruitmentStage;
  notes?: string;
  updatedBy: string;
  createdAt: Date;
}

export interface UpdateCaseStageRequest {
  stage: RecruitmentStage;
  notes?: string;
}

export interface CaseCommunication {
  id: string;
  caseId: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  senderId?: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: Date;
}

export interface CreateCommunicationRequest {
  type: CommunicationType;
  subject?: string;
  content: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface Interview {
  id: string;
  caseId: string;
  roundNumber: number;
  roundName?: string;
  scheduledAt?: Date;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  status: InterviewStatus;
  overallRating?: number;
  feedback?: string;
  recommendation?: InterviewRecommendation;
  panelists?: InterviewPanelist[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewPanelist {
  id: string;
  interviewId: string;
  userId: string;
  role: 'interviewer' | 'observer';
  feedback?: string;
  rating?: number;
  submittedAt?: Date;
}

export interface ScheduleInterviewRequest {
  roundNumber: number;
  roundName?: string;
  scheduledAt: string;
  durationMinutes?: number;
  location?: string;
  meetingLink?: string;
  panelistIds: string[];
}

export interface SubmitFeedbackRequest {
  rating: number;
  feedback: string;
  recommendation: InterviewRecommendation;
}

export interface Offer {
  id: string;
  caseId: string;
  version: number;
  designation: string;
  departmentId?: string;
  baseSalary: number;
  variablePay?: number;
  joiningBonus?: number;
  otherBenefits?: Record<string, unknown>;
  joiningDate: Date;
  expiryDate: Date;
  status: OfferStatus;
  offerLetterUrl?: string;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdBy?: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOfferRequest {
  designation: string;
  departmentId?: string;
  baseSalary: number;
  variablePay?: number;
  joiningBonus?: number;
  otherBenefits?: Record<string, unknown>;
  joiningDate: string;
  expiryDate: string;
}

export interface AcceptOfferRequest {
  acceptedAt?: string;
}

export interface RejectOfferRequest {
  reason: string;
}

export interface CandidateDocument {
  id: string;
  caseId: string;
  documentTypeId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  uploadedAt: Date;
}

export interface VerifyDocumentRequest {
  status: 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface RecruitmentDashboardStats {
  totalOpenPositions: number;
  totalActiveCases: number;
  casesByStage: Record<RecruitmentStage, number>;
  offersPending: number;
  offersAccepted: number;
  interviewsThisWeek: number;
  avgTimeToHire: number;
}

export interface CaseListFilters {
  search?: string;
  stage?: RecruitmentStage;
  status?: CaseStatus;
  jobPostingId?: string;
  recruiterId?: string;
  dateFrom?: string;
  dateTo?: string;
}
