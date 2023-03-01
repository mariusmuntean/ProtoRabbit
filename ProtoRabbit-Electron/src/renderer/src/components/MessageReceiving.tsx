import { FileAddOutlined } from '@ant-design/icons'
import { Button, Layout, Radio, Space } from 'antd'
import { useState } from 'react'

const { Content, Sider } = Layout

export const MessageReceiving = () => {
  const [subscription, setSubscription] = useState<string>('Create')

  return (
    <Space direction="vertical" style={{ display: 'flex', height: 'auto' }}>
      <div style={{ alignSelf: 'self-start' }}>Receive</div>
      <Layout style={{ background: 'none' }}>
        <Sider style={{ background: 'none' }}>
          <Space direction="vertical">
            <Space>
              <div>Subscriptions</div>
              <Button type="primary" icon={<FileAddOutlined />} size="small"></Button>
            </Space>
            <Radio.Group value={subscription} onChange={(e) => setSubscription(e.target.value)}>
              <Space direction="vertical">
                <Radio.Button value="Create">Create</Radio.Button>
                <Radio.Button value="Delete">Delete</Radio.Button>
              </Space>
            </Radio.Group>
          </Space>
        </Sider>
        <Layout style={{ background: 'none' }}>
          <Content>Messages</Content>
        </Layout>
      </Layout>
    </Space>
  )
}
