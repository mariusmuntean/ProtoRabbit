import { ProtoRabbitContext } from '@renderer/AppContext'
import { Divider, Layout, Radio, Space, Table, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { ColumnType } from 'antd/es/table'
import { useContext } from 'react'
import { Subscription } from 'src/shared/Subscription'
import { NewSubscription } from './message receiving/NewSubscription'
import { SubscriptionList } from './message receiving/SubscriptionList'

const { Content, Sider } = Layout

const cols: ColumnType<Subscription>[] = [
  {
    title: '',
    render: (v, r, i) => r.name
  }
]
interface Props {
  subscription: Subscription
}
const SubscriptionTooltipTitle = ({ subscription }: Props) => {
  return (
    <>
      Tag {subscription.consumerTag}
      <br />
      Exchange {subscription.exchange}
      <br />
      Routing key {subscription.routingKey}
      <br />
      Queue {subscription.queueName}
      <br />
    </>
  )
}

export const MessageReceiving = () => {
  return (
    <Space direction="vertical" style={{ display: 'flex', height: 'auto' }}>
      <div style={{ alignSelf: 'self-start' }}>Receive</div>
      <Space
        direction="horizontal"
        style={{ background: 'none', margin: '0.5em', display: 'flex', alignItems: 'stretch', alignContent: 'stretch', gap: '1em' }}
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
            <span>subscription messages</span>
          </Content>
        </Layout>
      </Space>
    </Space>
  )
}
