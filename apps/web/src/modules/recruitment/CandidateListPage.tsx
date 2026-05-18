import { useMemo, useState } from 'react';
import {
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  UnlockOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Space, Table, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageHeader } from '@/shared/components/PageHeader';
import { CandidateStatusTag } from '@/shared/components/CandidateStatusTag';
import { DocumentStatusBadge } from '@/shared/components/DocumentStatusBadge';
import { SendUploadLinkModal } from '@/shared/components/SendUploadLinkModal';
import { CANDIDATE_STATUS_OPTIONS } from '@/constants/candidateStatus';
import { mockCandidates } from '@/mocks/candidates';
import type { Candidate, CandidateStatus } from '@/types';

const UPLOAD_LINK_STATUSES: CandidateStatus[] = [
  'OFFERED',
  'JOINING',
  'JOINED',
  'SELECTED',
  'OFFER_ROUND',
];

export function CandidateListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [linkCandidate, setLinkCandidate] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    return mockCandidates.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  const canSendUploadLink = (c: Candidate) =>
    c.portalEnabled || UPLOAD_LINK_STATUSES.includes(c.status);

  const columns: ColumnsType<Candidate> = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      render: (name, row) => (
        <Link to={`/recruitment/candidates/${row.id}`} style={{ fontWeight: 500 }}>
          {name}
        </Link>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, row) => (
        <div>
          <div>{row.email}</div>
          {row.phone && <div style={{ fontSize: 12, color: '#64748b' }}>{row.phone}</div>}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: CandidateStatus) => <CandidateStatusTag status={status} />,
    },
    {
      title: 'Last comment',
      key: 'lastComment',
      render: (_, row) =>
        row.lastComment ? (
          <div style={{ maxWidth: 220 }}>
            <div style={{ fontSize: 13 }}>{row.lastComment.preview}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {row.lastComment.authorName} · {dayjs(row.lastComment.createdAt).format('DD MMM')}
            </div>
          </div>
        ) : (
          <span style={{ color: '#94a3b8' }}>—</span>
        ),
    },
    {
      title: 'Documents',
      key: 'docs',
      align: 'center',
      render: (_, row) => (
        <DocumentStatusBadge
          total={row.documentsSummary.total}
          submitted={row.documentsSummary.submitted}
          hasDraft={row.documentsSummary.hasDraft}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, row) => {
        const hasLocked = row.documents.some((d) => d.isLocked && d.status === 'submitted');
        return (
          <Space wrap size={0}>
            <Button type="link" size="small" onClick={() => navigate(`/recruitment/candidates/${row.id}`)}>
              View
            </Button>
            {canSendUploadLink(row) && (
              <Tooltip title="Generate time-limited upload link">
                <Button
                  type="link"
                  size="small"
                  icon={<LinkOutlined />}
                  onClick={() => setLinkCandidate(row)}
                >
                  Send link
                </Button>
              </Tooltip>
            )}
            {hasLocked && (
              <Button
                type="link"
                size="small"
                icon={<UnlockOutlined />}
                onClick={() => message.info(`Unlock requested for ${row.fullName} (dummy)`)}
              >
                Unlock
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="ghr-page">
      <PageHeader
        title="Candidates"
        subtitle="Track hiring status, comments, and document uploads"
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={() => message.success('Export CSV (dummy)')}>
              Export
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Add candidate modal (coming soon)')}>
              Add candidate
            </Button>
          </Space>
        }
      />
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search name, email, phone"
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 280 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          style={{ width: 200 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All statuses' },
            ...CANDIDATE_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        style={{ background: '#fff', borderRadius: 12 }}
      />

      <SendUploadLinkModal
        open={!!linkCandidate}
        candidate={linkCandidate}
        onClose={() => setLinkCandidate(null)}
      />
    </div>
  );
}
