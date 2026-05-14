import { RecruitmentStage } from '../types/recruitment.js';

export const RECRUITMENT_STAGES: { code: RecruitmentStage; name: string; sequence: number }[] = [
  { code: 'APPLIED', name: 'Applied', sequence: 1 },
  { code: 'SCREENING', name: 'Screening', sequence: 2 },
  { code: 'INTERVIEW', name: 'Interview', sequence: 3 },
  { code: 'OFFER_PENDING', name: 'Offer Pending', sequence: 4 },
  { code: 'OFFER_SENT', name: 'Offer Sent', sequence: 5 },
  { code: 'OFFER_ACCEPTED', name: 'Offer Accepted', sequence: 6 },
  { code: 'OFFER_REJECTED', name: 'Offer Rejected', sequence: 7 },
  { code: 'DOCUMENT_UPLOAD', name: 'Document Upload', sequence: 8 },
  { code: 'VERIFICATION', name: 'Verification', sequence: 9 },
  { code: 'VERIFIED', name: 'Verified', sequence: 10 },
  { code: 'ONBOARDING', name: 'Onboarding', sequence: 11 },
  { code: 'ONBOARDED', name: 'Onboarded', sequence: 12 },
  { code: 'REJECTED', name: 'Rejected', sequence: 99 },
  { code: 'WITHDRAWN', name: 'Withdrawn', sequence: 99 },
];

export const RECRUITMENT_STAGE_TRANSITIONS: Record<RecruitmentStage, RecruitmentStage[]> = {
  APPLIED: ['SCREENING', 'REJECTED', 'WITHDRAWN'],
  SCREENING: ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW: ['OFFER_PENDING', 'REJECTED', 'WITHDRAWN'],
  OFFER_PENDING: ['OFFER_SENT', 'REJECTED', 'WITHDRAWN'],
  OFFER_SENT: ['OFFER_ACCEPTED', 'OFFER_REJECTED', 'WITHDRAWN'],
  OFFER_ACCEPTED: ['DOCUMENT_UPLOAD', 'WITHDRAWN'],
  OFFER_REJECTED: [],
  DOCUMENT_UPLOAD: ['VERIFICATION', 'WITHDRAWN'],
  VERIFICATION: ['VERIFIED', 'DOCUMENT_UPLOAD', 'WITHDRAWN'],
  VERIFIED: ['ONBOARDING', 'WITHDRAWN'],
  ONBOARDING: ['ONBOARDED', 'WITHDRAWN'],
  ONBOARDED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
];

export const CANDIDATE_SOURCES = [
  { value: 'direct', label: 'Direct Application' },
  { value: 'referral', label: 'Employee Referral' },
  { value: 'job_board', label: 'Job Board' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
];

export const INTERVIEW_RECOMMENDATIONS = [
  { value: 'strong_hire', label: 'Strong Hire', color: 'green' },
  { value: 'hire', label: 'Hire', color: 'blue' },
  { value: 'no_hire', label: 'No Hire', color: 'orange' },
  { value: 'strong_no_hire', label: 'Strong No Hire', color: 'red' },
];

export const OFFER_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'pending_approval', label: 'Pending Approval', color: 'processing' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'sent', label: 'Sent', color: 'processing' },
  { value: 'accepted', label: 'Accepted', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'warning' },
  { value: 'expired', label: 'Expired', color: 'default' },
];

export const DOCUMENT_VERIFICATION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'processing' },
  { value: 'verified', label: 'Verified', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];
