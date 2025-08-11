import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';

const { Title } = Typography;
const { Paragraph } = Typography;
const { Text } = Typography;

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'欢迎使用,最新的框架已经发布到GitHub上了'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        {/* <Paragraph>https://github.com/digitalwayhk/core</Paragraph>
        <Typography.Text strong>{'快速开始,服务中运行的api,请点击左下方的OpenApi文档查阅并测试'}</Typography.Text> */}
        {/* <CodePreview></CodePreview> */}
      </Card>
    </PageContainer>
     
  );
};

export default Welcome;
