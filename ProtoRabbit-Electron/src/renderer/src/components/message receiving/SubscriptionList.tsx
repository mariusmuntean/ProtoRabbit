import { useCallback, useEffect, useMemo, useState } from 'react'
import { List, Space } from 'antd'
import { SyncOutlined } from '@ant-design/icons'

import { Subscription } from 'src/shared/Subscription'

import style from './subscriptionList.module.scss'
import { SubscriptionManager } from 'src/preload/SubscriptionManager'

const getSubscriptionItemRenderFunc = (subscriptionManager: SubscriptionManager | undefined) => {
  const renderFunc = (sub: Subscription) => {
    return (
      <List.Item
        onClick={() => subscriptionManager?.setCurrentSubscription(sub)}
        className={sub?.id === window.ProtoRabbit.getSubscriptionManager()?.currentSubscription?.id ? style.selected : style.unselected}
      >
        <List.Item.Meta
          title={
            <>
              <SyncOutlined spin /> <span>sub.name</span>
            </>
          }
          description={
            <Space direction="vertical">
              {`Exchange: ${sub.exchange}`}
              {`Routing key: ${sub.routingKey}`}
            </Space>
          }
        />
      </List.Item>
    )
  }
  return renderFunc
}

export const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | undefined>([])
  const reloadSubs = useCallback(() => {
    return setSubscriptions(window.ProtoRabbit.getSubscriptionManager()?.subscriptions)
  }, [window.ProtoRabbit.getSubscriptionManager()?.subscriptions, window.ProtoRabbit.getSubscriptionManager()?.subscriptions?.length])

  const [currentSubscription, setCurrentSubscription] = useState<Subscription | undefined>()
  const reloadCurrentSubscription = useCallback(() => {
    return setCurrentSubscription(window.ProtoRabbit.getSubscriptionManager()?.currentSubscription)
  }, [])

  useEffect(() => {
    const currentSubManager = window.ProtoRabbit.getSubscriptionManager()
    currentSubManager?.registerForSubscriptionsChanged(reloadSubs)
    currentSubManager?.registerForCurrentSubscriptionChanged(reloadCurrentSubscription)
    return () => {
      currentSubManager?.unregisterForSubscriptionsChanged(reloadSubs)
      currentSubManager?.unregisterForCurrentSubscriptionChanged(reloadCurrentSubscription)
    }
  }, [window.ProtoRabbit.getSubscriptionManager(), reloadCurrentSubscription, reloadSubs])

  return <List dataSource={subscriptions} renderItem={getSubscriptionItemRenderFunc(window.ProtoRabbit.getSubscriptionManager())} />
}
