import { Tag } from 'antd';
import { getStatusOption } from '@/constants/candidateStatus';
import type { CandidateStatus } from '@/types';

export function CandidateStatusTag({ status }: { status: CandidateStatus }) {
  const opt = getStatusOption(status);
  return <Tag color={opt.color}>{opt.label}</Tag>;
}
