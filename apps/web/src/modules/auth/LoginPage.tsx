import { useState } from 'react';
import {
  LockOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Typography, message } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/auth/AuthContext';
import '@/styles/login.css';

interface LoginForm {
  tenant: string;
  email: string;
  password: string;
  remember: boolean;
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await login(values.email, values.password, values.tenant);
      message.success('Welcome back');
      navigate(from, { replace: true });
    } catch {
      message.error('Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ghr-login-page">
      <div className="ghr-login-brand">
        <Typography.Text style={{ color: '#60a5fa', fontWeight: 600, letterSpacing: '0.05em', fontSize: 12 }}>
          GENERALHR
        </Typography.Text>
        <h1>Hire, onboard, and manage your team</h1>
        <p>
          Track candidates, collect documents with secure links, and manage staff & payroll in one
          place.
        </p>
        <div className="ghr-login-features">
          <div className="ghr-login-feature">
            <div className="ghr-login-feature-icon">
              <UserOutlined />
            </div>
            <div>
              <strong>Recruitment</strong>
              <p className="ghr-login-feature-desc">Candidates, comments, TTL upload links</p>
            </div>
          </div>
          <div className="ghr-login-feature">
            <div className="ghr-login-feature-icon">
              <TeamOutlined />
            </div>
            <div>
              <strong>Human Resource</strong>
              <p className="ghr-login-feature-desc">Staff, attendance, salary & payroll sync</p>
            </div>
          </div>
          <div className="ghr-login-feature">
            <div className="ghr-login-feature-icon">
              <SafetyCertificateOutlined />
            </div>
            <div>
              <strong>Secure uploads</strong>
              <p className="ghr-login-feature-desc">Time-limited links for candidate documents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ghr-login-panel">
        <Card className="ghr-login-card" bordered={false}>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
            Sign in
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
            HR & admin access
          </Typography.Paragraph>

          <Form<LoginForm>
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              tenant: 'demo',
              email: 'hr@demo.local',
              password: 'demo',
              remember: true,
            }}
            requiredMark={false}
          >
            <Form.Item name="tenant" label="Organization" rules={[{ required: true }]}>
              <Input prefix={<TeamOutlined style={{ color: '#94a3b8' }} />} placeholder="demo" size="large" />
            </Form.Item>
            <Form.Item name="email" label="Work email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="you@company.com" size="large" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 4 }]}>
              <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" size="large" />
            </Form.Item>
            <Form.Item>
              <div className="ghr-login-form-row">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Typography.Link onClick={() => message.info('Password reset — connect API later')}>
                  Forgot password?
                </Typography.Link>
              </div>
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0, textAlign: 'center' }}>
            <FileTextOutlined /> Candidates receive a unique upload link by email — no login required.
          </Typography.Paragraph>
        </Card>
      </div>
    </div>
  );
}
