import { Badge, Space, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileOutlined,
  LockOutlined,
} from '@ant-design/icons';

interface Props {
  total: number;
  submitted: number;
  hasDraft: boolean;
}

export function DocumentStatusBadge({ total, submitted, hasDraft }: Props) {
  if (total === 0) {
    return (
      <Tooltip title="No documents required yet">
        <FileOutlined style={{ color: '#94a3b8' }} />
      </Tooltip>
    );
  }

  const allSubmitted = submitted === total && !hasDraft;
  const partial = submitted > 0 || hasDraft;

  if (allSubmitted) {
    return (
      <Space size={4}>
        <CheckCircleOutlined style={{ color: '#16a34a' }} />
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {submitted}/{total}
        </span>
      </Space>
    );
  }

  return (
    <Tooltip title={hasDraft ? 'Draft uploads in progress' : 'Partially submitted'}>
      <Space size={4}>
        {hasDraft ? <ClockCircleOutlined style={{ color: '#d97706' }} /> : <LockOutlined style={{ color: '#64748b' }} />}
        <Badge
          count={`${submitted}/${total}`}
          style={{ backgroundColor: partial ? '#d97706' : '#94a3b8' }}
        />
      </Space>
    </Tooltip>
  );
}
