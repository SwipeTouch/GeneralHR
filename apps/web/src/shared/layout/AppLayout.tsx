import {
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SolutionOutlined,
  LinkOutlined,
  DollarOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/auth/AuthContext';

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  {
    key: 'recruitment',
    icon: <SolutionOutlined />,
    label: 'Recruitment',
    children: [
      { key: '/recruitment/candidates', icon: <UserOutlined />, label: 'Candidates' },
      { key: '/recruitment/upload-links', icon: <LinkOutlined />, label: 'Upload links' },
    ],
  },
  {
    key: 'hr',
    icon: <TeamOutlined />,
    label: 'Human Resource',
    children: [
      { key: '/hr/staff', label: 'Staff' },
      { key: '/hr/salary-heads', icon: <DollarOutlined />, label: 'Salary structure' },
      { key: '/hr/payroll', icon: <ApiOutlined />, label: 'Payroll integration' },
    ],
  },
];

function getSelectedKey(pathname: string): string {
  if (pathname.startsWith('/recruitment')) {
    if (pathname.startsWith('/recruitment/upload-links')) return '/recruitment/upload-links';
    return '/recruitment/candidates';
  }
  if (pathname.startsWith('/hr/staff')) return '/hr/staff';
  if (pathname.startsWith('/hr/salary-heads')) return '/hr/salary-heads';
  if (pathname.startsWith('/hr/payroll')) return '/hr/payroll';
  return pathname;
}

function getOpenKeys(pathname: string): string[] {
  if (pathname.startsWith('/recruitment')) return ['recruitment'];
  if (pathname.startsWith('/hr')) return ['hr'];
  return [];
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const selectedKey = getSelectedKey(location.pathname);
  const openKeys = getOpenKeys(location.pathname);

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={248}
        style={{
          background: 'var(--ghr-sidebar-bg)',
          borderRight: '1px solid #1e293b',
        }}
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
          <Typography.Title level={4} style={{ margin: 0, color: '#f8fafc' }}>
            GeneralHR
          </Typography.Title>
          <Typography.Text style={{ color: '#94a3b8', fontSize: 12 }}>
            {user?.tenantName ?? 'Demo Company'}
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={onMenuClick}
          style={{ background: 'transparent', border: 'none', marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #e2e8f0',
            height: 56,
          }}
        >
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: user?.email ?? 'Profile' },
                { type: 'divider' },
                {
                  key: 'logout',
                  label: 'Sign out',
                  icon: <LogoutOutlined />,
                  danger: true,
                  onClick: () => {
                    logout();
                    navigate('/login');
                  },
                },
              ],
            }}
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ background: 'var(--ghr-accent)' }}>
                {(user?.name ?? 'HR').slice(0, 2).toUpperCase()}
              </Avatar>
              <span style={{ fontWeight: 500 }}>{user?.name ?? 'HR User'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
