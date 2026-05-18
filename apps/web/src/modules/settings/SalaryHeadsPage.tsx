import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/shared/components/PageHeader';
import { mockSalaryHeads } from '@/mocks/salaryHeads';
import type { SalaryHead } from '@/types';

export function SalaryHeadsPage() {
  const columns: ColumnsType<SalaryHead> = [
    { title: 'Code', dataIndex: 'code', width: 100 },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (t: string) => (
        <Tag color={t === 'earning' ? 'green' : 'orange'}>{t}</Tag>
      ),
    },
    {
      title: 'Taxable',
      dataIndex: 'isTaxable',
      render: (v: boolean) => (v ? 'Yes' : 'No'),
    },
    { title: 'Order', dataIndex: 'sortOrder', width: 80 },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" onClick={() => message.info('Edit (dummy)')}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="ghr-page">
      <PageHeader
        title="Salary structure"
        subtitle="Earning and deduction heads for compensation"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Add head (dummy)')}>
            Add head
          </Button>
        }
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={mockSalaryHeads}
        pagination={false}
        style={{ background: '#fff', borderRadius: 12 }}
      />
    </div>
  );
}
