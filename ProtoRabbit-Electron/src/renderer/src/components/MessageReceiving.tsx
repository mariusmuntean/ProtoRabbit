import { Divider, Layout, Space } from 'antd'
import { Header } from 'antd/es/layout/layout'

import { NewSubscription } from './message receiving/NewSubscription'
import { SubscriptionList } from './message receiving/SubscriptionList'
import { SubscriptionMessages } from './message receiving/SubscriptionMessages'

const { Content } = Layout

export const MessageReceiving = () => {
  return (
    <Space direction="vertical" style={{ display: 'flex', height: 'auto' }}>
      <div style={{ alignSelf: 'self-start' }}>Receive</div>
      <Space
        direction="horizontal"
        style={{ background: 'none', margin: '0.5em', display: 'flex', alignItems: 'stretch', alignContent: 'stretch' }}
      >
        {/* Subscriptions */}
        <Layout>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Space align="center" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
              <div>Subscriptions</div>
              <NewSubscription />
            </Space>
          </Header>
          <Content>
            <SubscriptionList />
          </Content>
        </Layout>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Subscription Messages */}
        <Layout style={{}}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Space style={{ width: '100%', justifyContent: 'start', alignContent: 'center' }}>
              <span>Messages</span>
            </Space>
          </Header>
          <Content>
            <SubscriptionMessages />
          </Content>
        </Layout>
      </Space>
    </Space>
  )
}
