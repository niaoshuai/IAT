import { Timeline, Card } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Timeline pending={true}>
        <Timeline.Item>第一个版本(基于开源项目) 2019-05-18</Timeline.Item>
        <Timeline.Item>增加压测管理 2019-05-30</Timeline.Item>
      </Timeline>
    </Card>
  </PageHeaderWrapper>
);
