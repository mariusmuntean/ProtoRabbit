import { useCallback, useContext, useEffect, useState } from 'react'
import { List } from 'antd'

import { ProtoRabbitContext } from '@renderer/AppContext'
import { Subscription } from 'src/shared/Subscription'

export const SubscriptionMessages = () => {
  const ctx = useContext(ProtoRabbitContext)
  const [currentSub, setCurrentSub] = useState<Subscription>()
  const reloadCurrentSub = useCallback(() => {
    setCurrentSub(window.ProtoRabbit.getSubscriptionManager()?.currentSubscription)
  }, [])

  useEffect(() => {
    window.ProtoRabbit.getSubscriptionManager()?.registerForCurrentSubscriptionChanged(reloadCurrentSub)
    const currentSubscription = window.ProtoRabbit.getSubscriptionManager()?.currentSubscription
    currentSubscription?.addNewMessageHandler(reloadCurrentSub)
    return () => {
      window.ProtoRabbit.getSubscriptionManager()?.unregisterForCurrentSubscriptionChanged(reloadCurrentSub)
      currentSubscription?.removeMessageHandler(reloadCurrentSub)
    }
  }, [ctx, reloadCurrentSub])

  return (
    <List
      dataSource={currentSub?.messages}
      renderItem={(msg) => {
        return (
          <List.Item>
            <List.Item.Meta title={msg.messageJson}></List.Item.Meta>
          </List.Item>
        )
      }}
    ></List>
  )
}
