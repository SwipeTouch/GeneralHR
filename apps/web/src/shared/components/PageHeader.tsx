import { Breadcrumb, Flex, Typography } from 'antd';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: { title: string; href?: string }[];
  extra?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, extra }: Props) {
  return (
    <div className="ghr-page-header">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumbs.map((b) => ({
            title: b.href ? <a href={b.href}>{b.title}</a> : b.title,
          }))}
        />
      )}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
          )}
        </div>
        {extra}
      </Flex>
    </div>
  );
}
