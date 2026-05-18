import { useState } from 'react';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  UnlockOutlined,
  SendOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  message,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageHeader } from '@/shared/components/PageHeader';
import { CandidateStatusTag } from '@/shared/components/CandidateStatusTag';
import { CANDIDATE_STATUS_OPTIONS } from '@/constants/candidateStatus';
import { SendUploadLinkModal } from '@/shared/components/SendUploadLinkModal';
import { getCandidateById } from '@/mocks/candidates';
import type { CandidateStatus } from '@/types';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const candidate = getCandidateById(id ?? '');
  const [status, setStatus] = useState(candidate?.status);
  const [commentForm] = Form.useForm();
  const [linkOpen, setLinkOpen] = useState(false);

  if (!candidate) {
    return (
      <Card>
        <p>Candidate not found.</p>
        <Link to="/recruitment/candidates">Back to list</Link>
      </Card>
    );
  }

  const onAddComment = (values: { content: string }) => {
    message.success(`Comment added (dummy): ${values.content.slice(0, 40)}…`);
    commentForm.resetFields();
  };

  const docColumns = [
    { title: 'Type', dataIndex: 'documentType' },
    { title: 'File', dataIndex: 'fileName', render: (v: string) => v || '—' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v: string, row: { isLocked: boolean }) => (
        <Space>
          <Tag color={v === 'submitted' ? 'green' : 'orange'}>{v}</Tag>
          {row.isLocked && <Tag icon={<UnlockOutlined />} color="default">locked</Tag>}
        </Space>
      ),
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploadedAt',
      render: (v: string) => (v ? dayjs(v).format('DD MMM YYYY HH:mm') : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, row: { fileName: string; isLocked: boolean; status: string }) => (
        <Space>
          {row.fileName && (
            <Button type="link" size="small" icon={<DownloadOutlined />}>
              Download
            </Button>
          )}
          {row.status === 'submitted' && row.isLocked && (
            <Button
              type="link"
              size="small"
              icon={<UnlockOutlined />}
              onClick={() => message.info('Document unlocked (dummy)')}
            >
              Unlock
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="ghr-page">
      <PageHeader
        title={candidate.fullName}
        breadcrumbs={[
          { title: 'Candidates', href: '/recruitment/candidates' },
          { title: candidate.fullName },
        ]}
        extra={
          <Space>
            {(candidate.portalEnabled ||
              ['OFFERED', 'JOINING', 'JOINED', 'SELECTED', 'OFFER_ROUND'].includes(
                candidate.status,
              )) && (
              <Button icon={<LinkOutlined />} onClick={() => setLinkOpen(true)}>
                Send upload link
              </Button>
            )}
            <Link to="/recruitment/candidates">
              <Button icon={<ArrowLeftOutlined />}>Back</Button>
            </Link>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Profile" style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Email">{candidate.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{candidate.phone ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Portal">
                {candidate.portalEnabled ? <Tag color="green">Enabled</Tag> : <Tag>Disabled</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Notes">{candidate.notes ?? '—'}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <span style={{ marginRight: 8, fontWeight: 500 }}>Status</span>
              <Select
                style={{ width: 220 }}
                value={status}
                onChange={(v: CandidateStatus) => {
                  setStatus(v);
                  message.success(`Status updated to ${v} (dummy)`);
                }}
                options={CANDIDATE_STATUS_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
              {status && <span style={{ marginLeft: 12 }}><CandidateStatusTag status={status} /></span>}
            </div>
          </Card>

          <Card title="Comments" className="ghr-comment-timeline">
            <Timeline
              mode="left"
              items={[...candidate.comments]
                .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
                .map((c) => ({
                  label: dayjs(c.createdAt).format('DD MMM YYYY HH:mm'),
                  children: (
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{c.authorName}</div>
                      <div>{c.content}</div>
                    </div>
                  ),
                }))}
            />
            <Form form={commentForm} onFinish={onAddComment} style={{ marginTop: 24 }}>
              <Form.Item name="content" rules={[{ required: true, message: 'Enter a comment' }]}>
                <Input.TextArea rows={3} placeholder="Add interaction note…" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Add comment
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Documents">
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              columns={docColumns}
              dataSource={candidate.documents}
            />
          </Card>
        </Col>
      </Row>

      <SendUploadLinkModal
        open={linkOpen}
        candidate={candidate}
        onClose={() => setLinkOpen(false)}
      />
    </div>
  );
}
