import { useCallback, useEffect, useState } from 'react'
import { Table } from 'antd'
import dayjs from 'dayjs'
import dayjsutc from 'dayjs/plugin/utc'

import { Message } from 'src/shared/Subscription'
import { ColumnType } from 'antd/es/table'

dayjs.extend(dayjsutc)

const columns: ColumnType<Message>[] = [
  {
    title: 'Received At',
    width: '11rem',
    render: (v, r, i) => {
      console.log(r)
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
  const [currentSubMessages, setCurrentSubMessages] = useState<Message[]>()
  const reloadCurrentSubMessages = useCallback(() => {
    const currentSubscription = window.ProtoRabbit.getSubscriptionManager()?.currentSubscription
    setCurrentSubMessages([...(currentSubscription?.messages ?? [])])
  }, [])

  useEffect(() => {
    const subManager = window.ProtoRabbit.getSubscriptionManager()
    subManager?.registerForCurrentSubscriptionChanged(reloadCurrentSubMessages)
    const currentSubscription = subManager?.currentSubscription
    currentSubscription?.addNewMessageHandler(reloadCurrentSubMessages)
    return () => {
      window.ProtoRabbit.getSubscriptionManager()?.unregisterForCurrentSubscriptionChanged(reloadCurrentSubMessages)
      currentSubscription?.removeMessageHandler(reloadCurrentSubMessages)
    }
  }, [reloadCurrentSubMessages])

  return <Table dataSource={currentSubMessages} columns={columns} pagination={false} />
}
