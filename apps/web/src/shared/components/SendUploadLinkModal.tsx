import { useEffect, useState } from 'react';
import { CopyOutlined, LinkOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Modal, Select, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import {
  createPortalLink,
  getPortalLinkUrl,
  type PortalLinkTtl,
} from '@/shared/utils/portalLink';

interface Props {
  open: boolean;
  candidate: { id: string; fullName: string; email: string } | null;
  onClose: () => void;
}

export function SendUploadLinkModal({ open, candidate, onClose }: Props) {
  const [form] = Form.useForm<{ ttl: PortalLinkTtl; email: string }>();
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    if (open && candidate) {
      form.setFieldsValue({ ttl: '72h', email: candidate.email });
      setGeneratedUrl(null);
      setExpiresAt(null);
    }
  }, [open, candidate, form]);

  const onGenerate = () => {
    if (!candidate) return;
    const { ttl, email } = form.getFieldsValue();
    const record = createPortalLink(candidate.id, candidate.fullName, email, ttl);
    const url = getPortalLinkUrl(record.token);
    setGeneratedUrl(url);
    setExpiresAt(record.expiresAt);
    message.success('Upload link created');
  };

  const copyLink = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    message.success('Link copied to clipboard');
  };

  const sendEmail = () => {
    if (!generatedUrl || !candidate) return;
    message.success(`Link emailed to ${form.getFieldValue('email')} (dummy — wire SMTP later)`);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <LinkOutlined />
          Send document upload link
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={520}
    >
      {candidate && (
        <>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
            Generate a unique, time-limited link for <strong>{candidate.fullName}</strong> to upload
            documents. The link expires automatically after the selected period.
          </Typography.Paragraph>

          <Form form={form} layout="vertical" initialValues={{ ttl: '72h', email: candidate.email }}>
            <Form.Item
              name="email"
              label="Send to email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder="candidate@example.com" />
            </Form.Item>
            <Form.Item name="ttl" label="Link expires after" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '24h', label: '24 hours' },
                  { value: '72h', label: '72 hours (3 days)' },
                  { value: '7d', label: '7 days' },
                ]}
              />
            </Form.Item>
            <Button type="primary" icon={<LinkOutlined />} onClick={onGenerate} block>
              Generate link
            </Button>
          </Form>

          {generatedUrl && (
            <Alert
              type="success"
              showIcon
              style={{ marginTop: 16 }}
              message="Link ready"
              description={
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Expires: {dayjs(expiresAt).format('DD MMM YYYY, HH:mm')}
                  </Typography.Text>
                  <Input.TextArea value={generatedUrl} readOnly rows={2} style={{ fontSize: 12 }} />
                  <Space wrap>
                    <Button icon={<CopyOutlined />} onClick={copyLink}>
                      Copy link
                    </Button>
                    <Button type="primary" icon={<MailOutlined />} onClick={sendEmail}>
                      Send email
                    </Button>
                  </Space>
                </Space>
              }
            />
          )}
        </>
      )}
    </Modal>
  );
}
