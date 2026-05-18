import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from '@/shared/auth/AuthContext';
import { ProtectedRoute } from '@/shared/auth/ProtectedRoute';
import { AppLayout } from '@/shared/layout/AppLayout';
import { LoginPage } from '@/modules/auth/LoginPage';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { CandidateListPage } from '@/modules/recruitment/CandidateListPage';
import { CandidateDetailPage } from '@/modules/recruitment/CandidateDetailPage';
import { UploadLinksPage } from '@/modules/recruitment/UploadLinksPage';
import { EmployeeListPage } from '@/modules/staff/EmployeeListPage';
import { EmployeeFormPage } from '@/modules/staff/EmployeeFormPage';
import { SalaryHeadsPage } from '@/modules/settings/SalaryHeadsPage';
import { PayrollPage } from '@/modules/hr/PayrollPage';
import { PortalUploadPage } from '@/modules/portal/PortalUploadPage';

const theme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* TTL magic link — no HR login */}
            <Route path="/upload/:token" element={<PortalUploadPage />} />
            <Route path="/portal" element={<Navigate to="/login" replace />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/recruitment" element={<Navigate to="/recruitment/candidates" replace />} />
              <Route path="/recruitment/candidates" element={<CandidateListPage />} />
              <Route path="/recruitment/candidates/:id" element={<CandidateDetailPage />} />
              <Route path="/recruitment/upload-links" element={<UploadLinksPage />} />

              <Route path="/hr" element={<Navigate to="/hr/staff" replace />} />
              <Route path="/hr/staff" element={<EmployeeListPage />} />
              <Route path="/hr/staff/new" element={<EmployeeFormPage />} />
              <Route path="/hr/staff/:id" element={<EmployeeFormPage />} />
              <Route path="/hr/salary-heads" element={<SalaryHeadsPage />} />
              <Route path="/hr/payroll" element={<PayrollPage />} />

              {/* Legacy redirects */}
              <Route path="/staff/*" element={<Navigate to="/hr/staff" replace />} />
              <Route path="/settings/salary-heads" element={<Navigate to="/hr/salary-heads" replace />} />
              <Route path="/recruitment/:id" element={<LegacyCandidateRedirect />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

function LegacyCandidateRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/recruitment/candidates/${id}`} replace />;
}
