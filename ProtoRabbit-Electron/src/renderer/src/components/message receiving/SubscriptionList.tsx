import { useCallback, useContext } from 'react'
import { List, Space } from 'antd'
import { SyncOutlined } from '@ant-design/icons'

import { ProtoRabbitContext } from '@renderer/AppContext'
import { Subscription } from 'src/shared/Subscription'

import style from './subscriptionList.module.scss'

export const SubscriptionList = () => {
  const { subscriptions, currentSubscription, setCurrentSubscription } = useContext(ProtoRabbitContext)

  const onItemClicked = useCallback(
    (sub: Subscription) => {
      setCurrentSubscription(sub)
    },
    [setCurrentSubscription]
  )

  const renderSubscriptionItem = useCallback(
    (sub: Subscription, idx: number) => {
      return (
        <List.Item onClick={() => onItemClicked(sub)} className={sub === currentSubscription ? style.selected : style.unselected}>
          <List.Item.Meta
            avatar={<SyncOutlined spin />}
            title={<a href="https://ant.design">{sub.name}</a>}
            description={
              <Space direction="vertical">
                {`Exchange: ${sub.exchange}`}
                {`Routing key: ${sub.routingKey}`}
              </Space>
            }
          />
        </List.Item>
      )
    },
    [currentSubscription, onItemClicked]
  )

  return <List dataSource={subscriptions} renderItem={renderSubscriptionItem} />
}
