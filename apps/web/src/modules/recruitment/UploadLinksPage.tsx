import { useMemo, useState } from 'react';
import { CopyOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  getPortalLinkUrl,
  listActivePortalLinks,
  revokePortalToken,
  type PortalTokenRecord,
} from '@/shared/utils/portalLink';

export function UploadLinksPage() {
  const [refresh, setRefresh] = useState(0);

  const links = useMemo(() => {
    void refresh;
    return listActivePortalLinks();
  }, [refresh]);

  const columns: ColumnsType<PortalTokenRecord> = [
    { title: 'Candidate', dataIndex: 'candidateName' },
    { title: 'Email', dataIndex: 'candidateEmail' },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      render: (v: string) => {
        const exp = dayjs(v);
        const hoursLeft = exp.diff(dayjs(), 'hour');
        return (
          <Space direction="vertical" size={0}>
            <span>{exp.format('DD MMM YYYY HH:mm')}</span>
            <Tag color={hoursLeft < 24 ? 'orange' : 'blue'}>{hoursLeft}h left</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (v: string) => dayjs(v).format('DD MMM YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={async () => {
              await navigator.clipboard.writeText(getPortalLinkUrl(row.token));
              message.success('Link copied');
            }}
          >
            Copy
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<StopOutlined />}
            onClick={() => {
              revokePortalToken(row.token);
              setRefresh((n) => n + 1);
              message.info('Link revoked');
            }}
          >
            Revoke
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="ghr-page">
      <PageHeader
        title="Upload links"
        subtitle="Active time-limited document upload links sent to candidates"
      />
      <Table
        rowKey="token"
        columns={columns}
        dataSource={links}
        locale={{ emptyText: 'No active links. Send a link from the Candidates list.' }}
        style={{ background: '#fff', borderRadius: 12 }}
      />
    </div>
  );
}
