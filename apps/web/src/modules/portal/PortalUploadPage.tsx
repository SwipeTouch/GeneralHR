import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LockOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  List,
  Row,
  Tag,
  Typography,
  Upload,
  message,
  Alert,
  Result,
} from 'antd';
import dayjs from 'dayjs';
import { resolvePortalToken } from '@/shared/utils/portalLink';
import { getCandidateById } from '@/mocks/candidates';

const DEFAULT_DOCS = ['ID Proof', 'PAN', 'Address Proof', 'Photo'];

export function PortalUploadPage() {
  const { token } = useParams<{ token: string }>();
  const [submitted, setSubmitted] = useState(false);

  const session = useMemo(() => {
    if (!token) return null;
    return resolvePortalToken(token);
  }, [token]);

  const candidate = session ? getCandidateById(session.candidateId) : null;

  const uploadProps = {
    beforeUpload: () => false,
    accept: '.pdf,.png,.jpg,.jpeg',
    maxCount: 1,
    onChange: () => message.info('File selected (dummy — max 5 MB)'),
  };

  if (!token || !session) {
    return (
      <div className="ghr-portal-shell">
        <Card className="ghr-portal-card">
          <Result
            status="error"
            title="Link invalid or expired"
            subTitle="Ask your HR contact to send a new document upload link."
          />
        </Card>
      </div>
    );
  }

  const displayName = candidate?.fullName ?? session.candidateName;
  const expiresLabel = dayjs(session.expiresAt).format('DD MMM YYYY, HH:mm');

  const docItems =
    candidate?.documents.length
      ? candidate.documents.map((d) => ({
          type: d.documentType,
          status: d.status,
          locked: d.isLocked,
        }))
      : DEFAULT_DOCS.map((type) => ({ type, status: 'draft' as const, locked: false }));

  return (
    <div className="ghr-portal-shell">
      <Card className="ghr-portal-card" title={null}>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Document upload
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Welcome, <strong>{displayName}</strong>. Upload required documents before joining.
        </Typography.Paragraph>

        <Alert
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          message={`This link expires on ${expiresLabel}`}
          style={{ marginBottom: 16 }}
        />

        {submitted ? (
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            message="Documents submitted"
            description="Your uploads are locked. Contact HR if you need to make changes."
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Alert
            type="info"
            message="You can edit uploads until you click Submit. Max 5 MB per file (PDF, PNG, JPG)."
            style={{ marginBottom: 16 }}
          />
        )}

        <List
          dataSource={docItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                item.locked ? (
                  <Tag icon={<LockOutlined />} color="default">
                    Locked
                  </Tag>
                ) : (
                  <Upload {...uploadProps} disabled={submitted}>
                    <Button size="small">Upload</Button>
                  </Upload>
                ),
              ]}
            >
              <List.Item.Meta
                title={item.type}
                description={
                  <Tag color={item.status === 'submitted' ? 'green' : 'orange'}>{item.status}</Tag>
                }
              />
            </List.Item>
          )}
        />

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col>
            <Button
              type="primary"
              disabled={submitted}
              onClick={() => {
                setSubmitted(true);
                message.success('Documents submitted — HR notified (dummy)');
              }}
            >
              Submit all documents
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
