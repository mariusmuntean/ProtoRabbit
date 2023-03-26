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
    render: (v, r, i) => {
      return dayjs.utc(r.createdAt).local().format('YYYY-MM-DD[ ]HH:mm:ss') // escape content by putting it in []
    }
  },
  {
    title: 'JSON Message',
    width: 'auto',
    render: (v, r, i) => r.messageJson
  }
]

export const SubscriptionMessages = () => {
  const [currentSub, setCurrentSub] = useState<Subscription>()
  const [currentSubMessages, setCurrentSubMessages] = useState<Message[]>()

  const onCurrentSubChanged = useCallback(() => {
    const subManager = window.ProtoRabbit.getSubscriptionManager()
    setCurrentSub(subManager?.currentSubscription)
    setCurrentSubMessages([...(subManager?.currentSubscription?.messages ?? [])])
  }, [])

  const onNewMessage = useCallback(() => {
    console.log('On new message. Length ', window.ProtoRabbit.getSubscriptionManager()?.currentSubscription?.messages?.length)
    setCurrentSubMessages([...(window.ProtoRabbit.getSubscriptionManager()?.currentSubscription?.messages ?? [])])
  }, [])

  useEffect(() => {
    currentSub?.addNewMessageHandler(onNewMessage)
    return () => {
      currentSub?.removeMessageHandler(onNewMessage)
    }
  }, [currentSub, onNewMessage])

  useEffect(() => {
    const subManager = window.ProtoRabbit.getSubscriptionManager()
    subManager?.registerForCurrentSubscriptionChanged(onCurrentSubChanged)
    return () => {
      subManager?.unregisterForCurrentSubscriptionChanged(onCurrentSubChanged)
    }
  }, [onCurrentSubChanged])

  return <Table dataSource={currentSubMessages} columns={columns} pagination={false} />
}
