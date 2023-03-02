import { Image } from 'antd'
import { useMemo } from 'react'
import protobuf from './../assets/protobuf.svg'
import rabbitmq from './../assets/rabbitmq.svg'

export function AppHeader() {
  const appName = useMemo(() => {
    return window.MYAPI.name()
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '0',
          padding: '0'
        }}
      >
        <Image src={protobuf} height={30} />
        <Image src={rabbitmq} height={60} />
      </div>
      <span
        style={{
          lineHeight: '2em'
        }}
      >
        {appName}
      </span>
    </div>
  )
}
