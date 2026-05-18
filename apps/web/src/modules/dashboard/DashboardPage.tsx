import { UserOutlined, TeamOutlined, FileDoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { PageHeader } from '@/shared/components/PageHeader';
import { mockCandidates } from '@/mocks/candidates';
import { mockEmployees } from '@/mocks/employees';

export function DashboardPage() {
  const activeCandidates = mockCandidates.filter(
    (c) => !['JOINED', 'NOT_INTERESTED', 'NOT_RESPONDING'].includes(c.status),
  ).length;
  const pendingDocs = mockCandidates.filter((c) => c.documentsSummary.hasDraft).length;
  const activeStaff = mockEmployees.filter((e) => e.status === 'active').length;

  return (
    <div className="ghr-page">
      <PageHeader title="Dashboard" subtitle="Overview — dummy data" />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="ghr-stat-card">
            <Statistic title="Active candidates" value={activeCandidates} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="ghr-stat-card">
            <Statistic title="Staff (active)" value={activeStaff} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="ghr-stat-card">
            <Statistic title="Doc uploads pending" value={pendingDocs} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="ghr-stat-card">
            <Statistic title="Joined this month" value={1} prefix={<FileDoneOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
