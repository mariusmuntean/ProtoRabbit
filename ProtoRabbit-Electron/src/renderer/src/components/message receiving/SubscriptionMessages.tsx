import { useCallback, useEffect, useState } from 'react'
import { Table } from 'antd'

import { Message } from 'src/shared/Subscription'
import { ColumnType } from 'antd/es/table'

const columns: ColumnType<Message>[] = [
  {
    title: 'Received At',
    render: (v, r, i) => {
      console.log(r)
      return r.rabbitMqMsg?.properties?.timestamp
    }
  },
  {
    title: 'JSON Message',
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
    subManager?.currentSubscription?.addNewMessageHandler(reloadCurrentSubMessages)
    return () => {
      window.ProtoRabbit.getSubscriptionManager()?.unregisterForCurrentSubscriptionChanged(reloadCurrentSubMessages)
      subManager?.currentSubscription?.removeMessageHandler(reloadCurrentSubMessages)
    }
  }, [reloadCurrentSubMessages])

  return <Table dataSource={currentSubMessages} columns={columns} />
}
