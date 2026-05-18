import { ApiOutlined } from '@ant-design/icons';
import { Alert, Card, Descriptions, Switch, Typography } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';

export function PayrollPage() {
  return (
    <div className="ghr-page">
      <PageHeader
        title="Payroll integration"
        subtitle="Connect to your existing PHP payroll system"
      />
      <Card>
        <Alert
          type="info"
          showIcon
          icon={<ApiOutlined />}
          message="Pluggable adapter (dummy)"
          description="This app syncs employee and salary data to your PHP payroll. Payslip read-back is optional."
          style={{ marginBottom: 24 }}
        />
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="PHP base URL">
            <Typography.Text code>https://payroll.example.com/api</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Sync enabled">
            <Switch defaultChecked disabled /> (configure in settings when API is ready)
          </Descriptions.Item>
          <Descriptions.Item label="Last sync">Never (dummy)</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
