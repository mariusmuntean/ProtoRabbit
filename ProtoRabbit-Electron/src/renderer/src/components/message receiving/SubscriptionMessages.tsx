import { useCallback, useContext, useEffect, useState } from 'react'
import { List } from 'antd'
import { ConsumeMessage } from 'amqplib'

import { ProtoRabbitContext } from '@renderer/AppContext'
import { Message } from 'src/shared/Subscription'

export const SubscriptionMessages = () => {
  const { currentSubscription } = useContext(ProtoRabbitContext)
  const ctx = useContext(ProtoRabbitContext)
  const [_, setCount] = useState<number>(0)
  const reRender = useCallback(() => {
    setCount((v) => v + 1)
  }, [setCount])

  useEffect(() => {
    currentSubscription?.addNewMessageHandler((msg: Message) => {
      console.log('new message ', msg)
      console.log(currentSubscription)
      console.log(ctx)
      reRender()
    })
    console.log('added handler')
    // return () => {
    //   currentSubscription?.removeMessageHandler(onNewMessage)
    //   console.log('Removed handler')
    // }
  }, [ctx, currentSubscription, reRender])

  return (
    <List
      dataSource={currentSubscription?.messages}
      renderItem={(msg, index) => {
        return (
          <List.Item>
            <List.Item.Meta title={msg.messageJson}></List.Item.Meta>
          </List.Item>
        )
      }}
    ></List>
  )
}
