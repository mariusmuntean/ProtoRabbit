import { ProtoRabbitContext } from '@renderer/AppContext'
import { Layout, Radio, Space, Table, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { ColumnType } from 'antd/es/table'
import { useContext } from 'react'
import { Subscription } from 'src/shared/Subscription'
import { NewSubscription } from './message receiving/NewSubscription'

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
  const { subscriptions, setCurrentSubscription, currentSubscription } = useContext(ProtoRabbitContext)
  return (
    <Space direction="vertical" style={{ display: 'flex', height: 'auto' }}>
      <div style={{ alignSelf: 'self-start' }}>Receive</div>
      <Space direction="vertical" style={{ background: 'none' }}>
        {/* Subscriptions */}

        <Space align="center" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
          <div>Subscriptions</div>
          <NewSubscription />
        </Space>

        <Radio.Group defaultValue={currentSubscription?.id}>
          {subscriptions?.map((s) => (
            <Radio.Button key={s.id} value={s.id}>
              <Tooltip title={<SubscriptionTooltipTitle subscription={s} />}>{s.name}</Tooltip>
            </Radio.Button>
          ))}
        </Radio.Group>

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
