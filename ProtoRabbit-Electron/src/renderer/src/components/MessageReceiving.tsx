import { useState } from 'react'
import { FileAddOutlined } from '@ant-design/icons'
import { Button, Layout, Radio, Space, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { NewSubscription } from './message receiving/NewSubscription'

const { Content, Sider } = Layout

export const MessageReceiving = () => {
  return (
    <Space direction="vertical" style={{ display: 'flex', height: 'auto' }}>
      <div style={{ alignSelf: 'self-start' }}>Receive</div>
      <Space direction="horizontal" style={{ background: 'none' }}>
        {/* Subscriptions */}
        <Layout style={{ background: 'none' }}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Space align="center" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
              <div>Subscriptions</div>
              <NewSubscription />
            </Space>
          </Header>
          <Content>
            <span>subscriptions </span>
          </Content>
        </Layout>

        {/* Subscription Messages */}
        <Layout style={{}}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Space style={{ width: '100%', justifyContent: 'start', alignContent: 'center' }}>
              <span>Messages</span>
            </Space>
          </Header>
          <Content>
            <span>subscription messages</span>
          </Content>
        </Layout>
      </Space>
    </Space>
  )
}
