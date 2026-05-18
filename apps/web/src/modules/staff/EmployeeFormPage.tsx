import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Select, Space, Tabs, Table, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { PageHeader } from '@/shared/components/PageHeader';
import { mockEmployees, mockAttendance } from '@/mocks/employees';
import { mockEmployeeSalary } from '@/mocks/salaryHeads';

export function EmployeeFormPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const employee = isNew ? undefined : mockEmployees.find((e) => e.id === id);
  const salaryLines = employee ? mockEmployeeSalary[employee.id] ?? [] : [];

  const earnings = salaryLines.filter((l) => l.type === 'earning').reduce((s, l) => s + l.amount, 0);
  const deductions = salaryLines.filter((l) => l.type === 'deduction').reduce((s, l) => s + l.amount, 0);

  const attendanceForEmployee = employee
    ? mockAttendance.filter((a) => a.employeeCode === employee.employeeCode)
    : [];

  return (
    <div className="ghr-page">
      <PageHeader
        title={isNew ? 'Add employee' : `Edit — ${employee?.fullName ?? 'Unknown'}`}
        breadcrumbs={[
          { title: 'Staff', href: '/hr/staff' },
          { title: isNew ? 'New' : employee?.fullName ?? '' },
        ]}
        extra={
          <Link to="/hr/staff">
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
        }
      />
      <Card>
        <Tabs
          items={[
            {
              key: 'profile',
              label: 'Profile',
              children: (
                <Form
                  layout="vertical"
                  initialValues={
                    employee
                      ? {
                          ...employee,
                          joiningDate: employee.joiningDate ? dayjs(employee.joiningDate) : undefined,
                        }
                      : { status: 'active' }
                  }
                  onFinish={() => message.success('Saved (dummy)')}
                  style={{ maxWidth: 560 }}
                >
                  <Form.Item name="employeeCode" label="Employee code" rules={[{ required: true }]}>
                    <Input disabled={!isNew} />
                  </Form.Item>
                  <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone">
                    <Input />
                  </Form.Item>
                  <Form.Item name="department" label="Department">
                    <Input />
                  </Form.Item>
                  <Form.Item name="joiningDate" label="Joining date">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="status" label="Status">
                    <Select
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form>
              ),
            },
            ...(employee
              ? [
                  {
                    key: 'compensation',
                    label: 'Compensation',
                    children: (
                      <>
                        <Table
                          size="small"
                          pagination={false}
                          rowKey="headCode"
                          dataSource={salaryLines}
                          columns={[
                            { title: 'Head', dataIndex: 'headName' },
                            { title: 'Type', dataIndex: 'type' },
                            {
                              title: 'Amount (₹)',
                              dataIndex: 'amount',
                              render: (v: number) => v.toLocaleString('en-IN'),
                            },
                          ]}
                          style={{ marginBottom: 16 }}
                        />
                        <Space direction="vertical">
                          <span>Gross earnings: ₹{earnings.toLocaleString('en-IN')}</span>
                          <span>Deductions: ₹{deductions.toLocaleString('en-IN')}</span>
                          <strong>Net preview: ₹{(earnings - deductions).toLocaleString('en-IN')}</strong>
                        </Space>
                        <Button style={{ marginTop: 16 }} onClick={() => message.info('Calculate (dummy)')}>
                          Recalculate
                        </Button>
                      </>
                    ),
                  },
                  {
                    key: 'attendance',
                    label: 'Attendance',
                    children: (
                      <Table
                        size="small"
                        rowKey="id"
                        dataSource={attendanceForEmployee}
                        columns={[
                          { title: 'Date', dataIndex: 'date' },
                          { title: 'In', dataIndex: 'checkIn' },
                          { title: 'Out', dataIndex: 'checkOut' },
                          { title: 'Source', dataIndex: 'source' },
                        ]}
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}
