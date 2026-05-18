import { useState } from 'react';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/PageHeader';
import { mockEmployees } from '@/mocks/employees';
import type { Employee } from '@/types';

export function EmployeeListPage() {
  const navigate = useNavigate();
  const [importOpen, setImportOpen] = useState(false);

  const columns: ColumnsType<Employee> = [
    { title: 'Code', dataIndex: 'employeeCode', width: 100 },
    { title: 'Name', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email', render: (v) => v ?? '—' },
    { title: 'Department', dataIndex: 'department', render: (v) => v ?? '—' },
    { title: 'Joining', dataIndex: 'joiningDate', render: (v) => v ?? '—' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => (
        <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Button type="link" size="small" onClick={() => navigate(`/hr/staff/${row.id}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="ghr-page">
      <PageHeader
        title="Staff"
        subtitle="Employee master — individual entry or bulk CSV"
        extra={
          <Space>
            <Button icon={<DownloadOutlined />}>Download template</Button>
            <Button icon={<UploadOutlined />} onClick={() => setImportOpen(true)}>
              Import CSV
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/hr/staff/new')}>
              Add employee
            </Button>
          </Space>
        }
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={mockEmployees}
        pagination={{ pageSize: 10 }}
        style={{ background: '#fff', borderRadius: 12 }}
      />
      <Modal
        title="Import staff (CSV)"
        open={importOpen}
        onCancel={() => setImportOpen(false)}
        onOk={() => {
          message.success('Imported 3 employees, 0 failed (dummy)');
          setImportOpen(false);
        }}
      >
        <p>Upload a CSV with columns: employee_code, full_name, email, phone, department, joining_date, status</p>
        <Button type="dashed" block style={{ marginTop: 16 }}>
          Choose file (dummy)
        </Button>
      </Modal>
    </div>
  );
}
