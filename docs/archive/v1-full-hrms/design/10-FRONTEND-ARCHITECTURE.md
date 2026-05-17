# Frontend Architecture Design

## 1. Overview

The HRMS frontend is built with React 18, TypeScript, and Ant Design. It follows a modular architecture with feature-based organization and supports multiple portals (Recruitment, HR, Employee, Candidate, Lifetime).

## 2. Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 5.x | Build Tool & Dev Server |
| Ant Design | 5.x | UI Component Library |
| Zustand | 4.x | Global State Management |
| TanStack Query | 5.x | Server State Management |
| React Router | 6.x | Routing |
| Axios | 1.x | HTTP Client |
| Day.js | 1.x | Date Handling |
| Zod | 3.x | Runtime Validation |

## 3. Project Structure

```
apps/web/
├── public/
│   └── favicon.ico
├── src/
│   ├── modules/                    # Feature modules
│   │   ├── auth/                   # Authentication
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── ResetPasswordPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   └── auth.store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── recruitment/            # Recruitment module
│   │   │   ├── components/
│   │   │   │   ├── CaseCard.tsx
│   │   │   │   ├── CaseKanban.tsx
│   │   │   │   ├── CaseTimeline.tsx
│   │   │   │   ├── InterviewForm.tsx
│   │   │   │   ├── OfferForm.tsx
│   │   │   │   └── DocumentVerification.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── JobPostingsPage.tsx
│   │   │   │   ├── CasesPage.tsx
│   │   │   │   └── CaseDetailPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCases.ts
│   │   │   │   ├── useCase.ts
│   │   │   │   └── useJobPostings.ts
│   │   │   ├── services/
│   │   │   │   └── recruitment.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── hr/                     # HR module
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   ├── employee/               # Employee portal
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   ├── exit/                   # Exit management
│   │   ├── candidate/              # Candidate portal
│   │   ├── lifetime/               # Lifetime portal
│   │   └── admin/                  # Admin module
│   │
│   ├── shared/                     # Shared code
│   │   ├── components/             # Reusable components
│   │   │   ├── DataTable/
│   │   │   ├── FileUpload/
│   │   │   ├── PageHeader/
│   │   │   ├── StatusBadge/
│   │   │   ├── Timeline/
│   │   │   ├── PermissionGate/
│   │   │   └── index.ts
│   │   │
│   │   ├── layouts/                # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                  # Shared hooks
│   │   │   ├── usePermission.ts
│   │   │   ├── useTenant.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── contexts/               # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── TenantContext.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── utils/                  # Utility functions
│   │       ├── api.ts
│   │       ├── storage.ts
│   │       ├── date.ts
│   │       ├── format.ts
│   │       └── index.ts
│   │
│   ├── config/                     # App configuration
│   │   ├── routes.tsx
│   │   ├── menu.ts
│   │   ├── theme.ts
│   │   └── constants.ts
│   │
│   ├── services/                   # API services
│   │   ├── api.ts                  # Axios instance
│   │   └── index.ts
│   │
│   ├── store/                      # Global stores
│   │   ├── app.store.ts
│   │   └── index.ts
│   │
│   ├── types/                      # TypeScript types
│   │   └── index.ts
│   │
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js (optional)
```

## 4. State Management

### 4.1 State Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT STRATEGY                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVER STATE                                       │
│                        (TanStack Query)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  • API data (employees, cases, leaves, etc.)                                │
│  • Automatic caching and background refetching                              │
│  • Optimistic updates                                                       │
│  • Pagination and infinite scroll                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           GLOBAL STATE                                       │
│                           (Zustand)                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Authentication (user, tokens, permissions)                               │
│  • Tenant configuration (branding, features)                                │
│  • UI state (sidebar collapsed, theme)                                      │
│  • Notifications                                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOCAL STATE                                        │
│                      (useState, useReducer)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Form state                                                               │
│  • Modal visibility                                                         │
│  • Component-specific UI state                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Auth Store (Zustand)

```typescript
// store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@hrms/core';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  permissions: string[];
  
  // Actions
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
  updateAccessToken: (token: string) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      permissions: [],
      
      setAuth: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: true,
        permissions: user.permissions,
      }),
      
      clearAuth: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        permissions: [],
      }),
      
      updateAccessToken: (token) => set({ accessToken: token }),
      
      hasPermission: (permission) => {
        const { permissions } = get();
        const [resource, action] = permission.split(':');
        return (
          permissions.includes(permission) ||
          permissions.includes(`${resource}:*`) ||
          permissions.includes('*')
        );
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
```

### 4.3 Server State (TanStack Query)

```typescript
// hooks/useCases.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentService } from '../services/recruitment.service';
import { CaseListFilters, UpdateCaseStageRequest } from '@hrms/core';

export function useCases(filters: CaseListFilters) {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: () => recruitmentService.getCases(filters),
    staleTime: 30000, // 30 seconds
  });
}

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: () => recruitmentService.getCase(caseId),
    enabled: !!caseId,
  });
}

export function useUpdateCaseStage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, data }: { caseId: string; data: UpdateCaseStageRequest }) =>
      recruitmentService.updateCaseStage(caseId, data),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
```

## 5. Routing

### 5.1 Route Configuration

```typescript
// config/routes.tsx
import { RouteObject } from 'react-router-dom';
import { MainLayout, AuthLayout } from '../shared/layouts';
import { ProtectedRoute } from '../shared/components';

// Auth pages
import { LoginPage, ResetPasswordPage } from '../modules/auth';

// Recruitment pages
import {
  RecruitmentDashboard,
  JobPostingsPage,
  CasesPage,
  CaseDetailPage,
} from '../modules/recruitment';

// HR pages
import {
  HRDashboard,
  EmployeesPage,
  EmployeeDetailPage,
  LeaveRequestsPage,
} from '../modules/hr';

// Employee pages
import {
  EmployeeDashboard,
  MyProfilePage,
  MyLeavesPage,
} from '../modules/employee';

export const routes: RouteObject[] = [
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  
  // Protected routes
  {
    element: <MainLayout />,
    children: [
      // Dashboard
      {
        path: '/',
        element: <ProtectedRoute><DashboardRedirect /></ProtectedRoute>,
      },
      
      // Recruitment
      {
        path: '/recruitment',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute permission="RECRUITMENT_DASHBOARD:read">
                <RecruitmentDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'jobs',
            element: (
              <ProtectedRoute permission="JOB_POSTINGS:read">
                <JobPostingsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'cases',
            element: (
              <ProtectedRoute permission="RECRUITMENT_CASES:read">
                <CasesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'cases/:id',
            element: (
              <ProtectedRoute permission="RECRUITMENT_CASES:read">
                <CaseDetailPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      
      // HR
      {
        path: '/hr',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute permission="HR_DASHBOARD:read">
                <HRDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'employees',
            element: (
              <ProtectedRoute permission="EMPLOYEES:read">
                <EmployeesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'employees/:id',
            element: (
              <ProtectedRoute permission="EMPLOYEES:read">
                <EmployeeDetailPage />
              </ProtectedRoute>
            ),
          },
          // ... more routes
        ],
      },
      
      // Employee Self-Service
      {
        path: '/employee',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute permission="MY_PROFILE:read">
                <EmployeeDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute permission="MY_PROFILE:read">
                <MyProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'leaves',
            element: (
              <ProtectedRoute permission="MY_LEAVES:read">
                <MyLeavesPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
];
```

### 5.2 Protected Route Component

```typescript
// shared/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  permission?: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ permission, children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, hasPermission } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

## 6. Component Patterns

### 6.1 Page Component Pattern

```typescript
// modules/recruitment/pages/CasesPage.tsx
import { useState } from 'react';
import { Card, Button, Space, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageHeader, DataTable } from '../../../shared/components';
import { CaseKanban, CaseFilters } from '../components';
import { useCases } from '../hooks';
import { CaseListFilters } from '@hrms/core';

type ViewMode = 'kanban' | 'table';

export function CasesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<CaseListFilters>({});
  
  const { data, isLoading, error } = useCases(filters);
  
  return (
    <div className="cases-page">
      <PageHeader
        title="Recruitment Cases"
        subtitle="Manage candidate applications"
        actions={
          <Space>
            <Button icon={<PlusOutlined />} type="primary">
              Add Candidate
            </Button>
          </Space>
        }
      />
      
      <Card>
        <div className="cases-toolbar">
          <CaseFilters filters={filters} onChange={setFilters} />
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
        
        {viewMode === 'kanban' ? (
          <CaseKanban cases={data?.data ?? []} loading={isLoading} />
        ) : (
          <DataTable
            data={data?.data ?? []}
            loading={isLoading}
            pagination={data?.pagination}
          />
        )}
      </Card>
    </div>
  );
}
```

### 6.2 Form Component Pattern

```typescript
// modules/recruitment/components/OfferForm.tsx
import { Form, Input, InputNumber, DatePicker, Select, Button, Space } from 'antd';
import { CreateOfferRequest } from '@hrms/core';
import { useDepartments, useDesignations } from '../../hr/hooks';

interface OfferFormProps {
  caseId: string;
  onSubmit: (data: CreateOfferRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function OfferForm({ caseId, onSubmit, onCancel, loading }: OfferFormProps) {
  const [form] = Form.useForm();
  const { data: departments } = useDepartments();
  const { data: designations } = useDesignations();
  
  const handleSubmit = async (values: CreateOfferRequest) => {
    await onSubmit({
      ...values,
      joiningDate: values.joiningDate.format('YYYY-MM-DD'),
      expiryDate: values.expiryDate.format('YYYY-MM-DD'),
    });
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="designation"
        label="Designation"
        rules={[{ required: true, message: 'Designation is required' }]}
      >
        <Input placeholder="e.g., Senior Software Engineer" />
      </Form.Item>
      
      <Form.Item
        name="departmentId"
        label="Department"
      >
        <Select
          placeholder="Select department"
          options={departments?.map(d => ({ value: d.id, label: d.name }))}
        />
      </Form.Item>
      
      <Form.Item
        name="baseSalary"
        label="Base Salary (Annual)"
        rules={[{ required: true, message: 'Base salary is required' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/₹\s?|(,*)/g, '')}
        />
      </Form.Item>
      
      <Form.Item
        name="variablePay"
        label="Variable Pay (Annual)"
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/₹\s?|(,*)/g, '')}
        />
      </Form.Item>
      
      <Space style={{ width: '100%' }} size="large">
        <Form.Item
          name="joiningDate"
          label="Joining Date"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="expiryDate"
          label="Offer Expiry Date"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Space>
      
      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Generate Offer
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
```

### 6.3 Permission Gate Component

```typescript
// shared/components/PermissionGate.tsx
import { useAuthStore } from '../../store/auth.store';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission } = useAuthStore();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Usage
<PermissionGate permission="EMPLOYEES:create">
  <Button type="primary" onClick={handleAddEmployee}>
    Add Employee
  </Button>
</PermissionGate>
```

## 7. API Integration

### 7.1 Axios Instance

```typescript
// services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        useAuthStore.getState().updateAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };
```

### 7.2 Service Pattern

```typescript
// modules/recruitment/services/recruitment.service.ts
import { api } from '../../../services/api';
import {
  RecruitmentCase,
  CaseListFilters,
  UpdateCaseStageRequest,
  CreateOfferRequest,
  PaginatedResponse,
  ApiResponse,
} from '@hrms/core';

class RecruitmentService {
  async getCases(filters: CaseListFilters): Promise<PaginatedResponse<RecruitmentCase>> {
    const { data } = await api.get('/recruitment/cases', { params: filters });
    return data;
  }
  
  async getCase(id: string): Promise<ApiResponse<RecruitmentCase>> {
    const { data } = await api.get(`/recruitment/cases/${id}`);
    return data;
  }
  
  async updateCaseStage(id: string, payload: UpdateCaseStageRequest): Promise<ApiResponse<RecruitmentCase>> {
    const { data } = await api.patch(`/recruitment/cases/${id}/stage`, payload);
    return data;
  }
  
  async createOffer(caseId: string, payload: CreateOfferRequest): Promise<ApiResponse<any>> {
    const { data } = await api.post(`/recruitment/cases/${caseId}/offers`, payload);
    return data;
  }
}

export const recruitmentService = new RecruitmentService();
```

## 8. Theming

### 8.1 Ant Design Theme Configuration

```typescript
// config/theme.ts
import { ThemeConfig } from 'antd';

export const createTheme = (tenantConfig?: TenantBranding): ThemeConfig => ({
  token: {
    colorPrimary: tenantConfig?.primaryColor || '#1890ff',
    colorSuccess: tenantConfig?.secondaryColor || '#52c41a',
    colorLink: tenantConfig?.primaryColor || '#1890ff',
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#fff',
      siderBg: '#001529',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
    },
    Table: {
      headerBg: '#fafafa',
    },
  },
});
```

### 8.2 Dynamic Theme Provider

```typescript
// App.tsx
import { ConfigProvider, App as AntApp } from 'antd';
import { useTenantStore } from './store/tenant.store';
import { createTheme } from './config/theme';

function App() {
  const { config } = useTenantStore();
  const theme = createTheme(config?.branding);
  
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}
```

## 9. Layout Components

### 9.1 Main Layout

```typescript
// shared/layouts/MainLayout.tsx
import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px - 48px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
```

### 9.2 Dynamic Navigation

```typescript
// shared/layouts/Sidebar.tsx
import { Menu, Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useTenantStore } from '../../store/tenant.store';
import { menuConfig } from '../../config/menu';

const { Sider } = Layout;

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuthStore();
  const { config } = useTenantStore();
  
  // Filter menu items based on permissions
  const menuItems = menuConfig
    .filter(item => {
      // Check if feature is enabled
      if (item.featureFlag && !config?.features[item.featureFlag]) {
        return false;
      }
      // Check permission
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }
      return true;
    })
    .map(item => ({
      key: item.path,
      icon: item.icon,
      label: item.label,
      children: item.children?.filter(child => 
        !child.permission || hasPermission(child.permission)
      ),
    }));
  
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
    >
      <div className="logo">
        {collapsed ? (
          <img src={config?.branding?.logoSmallUrl || '/logo-small.png'} alt="Logo" />
        ) : (
          <img src={config?.branding?.logoUrl || '/logo.png'} alt="Logo" />
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}
```

## 10. Error Handling

### 10.1 Error Boundary

```typescript
// shared/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="An unexpected error occurred. Please try again."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          }
        />
      );
    }
    
    return this.props.children;
  }
}
```

### 10.2 API Error Handling

```typescript
// shared/hooks/useApiError.ts
import { message } from 'antd';
import { AxiosError } from 'axios';
import { ApiResponse } from '@hrms/core';

export function useApiError() {
  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const response = error.response?.data as ApiResponse;
      
      if (response?.errors?.length) {
        response.errors.forEach(err => {
          message.error(`${err.field}: ${err.message}`);
        });
      } else if (response?.message) {
        message.error(response.message);
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to perform this action');
      } else if (error.response?.status === 404) {
        message.error('Resource not found');
      } else {
        message.error('An unexpected error occurred');
      }
    } else {
      message.error('An unexpected error occurred');
    }
  };
  
  return { handleError };
}
```

---

## Next Steps

1. Review and approve this frontend architecture design
2. Proceed to [Multi-Tenancy Design](./11-MULTI-TENANCY.md)
