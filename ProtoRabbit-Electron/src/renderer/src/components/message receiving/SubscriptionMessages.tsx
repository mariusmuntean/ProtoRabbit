import { useCallback, useEffect, useState } from 'react'
import { Table } from 'antd'
import dayjs from 'dayjs'
import dayjsutc from 'dayjs/plugin/utc'

import { Message, Subscription } from 'src/shared/Subscription'
import { ColumnType } from 'antd/es/table'

dayjs.extend(dayjsutc)

const columns: ColumnType<Message>[] = [
  {
    title: 'Received At',
    width: '11rem',
    render: (_v, r, _i) => {
      return dayjs.utc(r.createdAt).local().format('YYYY-MM-DD[ ]HH:mm:ss') // escape content by putting it in []
    }
  },
  {
    title: 'JSON Message',
    width: 'auto',
    render: (_v, r, _i) => r.messageJson
  }
]

export const SubscriptionMessages = () => {
  const [_currentSub, setCurrentSub] = useState<Subscription>()
  const [currentSubMessages, setCurrentSubMessages] = useState<Message[]>()

  const onNewMessage = useCallback(() => {
    console.log('On new message. Length ', window.ProtoRabbit.getSubscriptionManager()?.currentSubscription?.messages?.length)
    setCurrentSubMessages([...(window.ProtoRabbit.getSubscriptionManager()?.currentSubscription?.messages ?? [])])
  }, [])

  const onCurrentSubChanged = useCallback(() => {
    const subManager = window.ProtoRabbit.getSubscriptionManager()
    setCurrentSub((prevCurrentSub) => {
      prevCurrentSub?.removeMessageHandler(onNewMessage)
      subManager?.currentSubscription?.addNewMessageHandler(onNewMessage)
      return subManager?.currentSubscription
    })
    setCurrentSubMessages([...(subManager?.currentSubscription?.messages ?? [])])
  }, [onNewMessage])

  useEffect(() => {
    const subManager = window.ProtoRabbit.getSubscriptionManager()
    subManager?.registerForCurrentSubscriptionChanged(onCurrentSubChanged)
    return () => {
      subManager?.unregisterForCurrentSubscriptionChanged(onCurrentSubChanged)
    }
  }, [onCurrentSubChanged])

  return <Table dataSource={currentSubMessages} columns={columns} pagination={false} />
}
