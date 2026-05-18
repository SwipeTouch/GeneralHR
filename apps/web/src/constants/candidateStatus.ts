import type { CandidateStatus } from '@/types';

export const CANDIDATE_STATUS_OPTIONS: { value: CandidateStatus; label: string; color: string }[] = [
  { value: 'NOT_STARTED', label: 'Not Started', color: 'default' },
  { value: 'SCREENED', label: 'Screened', color: 'blue' },
  { value: 'TECH_ROUND_1', label: 'Tech Round 1', color: 'cyan' },
  { value: 'TECH_ROUND_2', label: 'Tech Round 2', color: 'cyan' },
  { value: 'TECH_ROUND_3', label: 'Tech Round 3', color: 'cyan' },
  { value: 'FINAL_ROUND', label: 'Final Round', color: 'geekblue' },
  { value: 'OFFER_ROUND', label: 'Offer Round', color: 'purple' },
  { value: 'SELECTED', label: 'Selected', color: 'green' },
  { value: 'OFFERED', label: 'Offered', color: 'gold' },
  { value: 'JOINING', label: 'Joining', color: 'lime' },
  { value: 'JOINED', label: 'Joined', color: 'success' },
  { value: 'NOT_INTERESTED', label: 'Not Interested', color: 'orange' },
  { value: 'NOT_RESPONDING', label: 'Not Responding', color: 'red' },
];

export function getStatusOption(status: CandidateStatus) {
  return CANDIDATE_STATUS_OPTIONS.find((o) => o.value === status) ?? { value: status, label: status, color: 'default' };
}
