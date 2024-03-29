import { useMemo } from 'react'
import { Image, Space } from 'antd'

import protobuf from './../assets/protobuf.svg'
import rabbitmq from './../assets/rabbitmq.svg'

export function AppHeader() {
  const appName = useMemo(() => {
    return window.ProtoRabbit.name()
  }, [])
  return (
    <div
      style={{
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Space direction="horizontal">
        <Image src={protobuf} height={40} preview={false} />
        <Image src={rabbitmq} height={30} preview={false} />
      </Space>
      <span style={{ lineHeight: '2em' }}>{appName}</span>
    </div>
  )
}
