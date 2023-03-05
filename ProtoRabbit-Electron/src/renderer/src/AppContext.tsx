import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'

const defaultProtoRabbitContext = {
  ProtoRabbit: window.ProtoRabbit,
  host: '',
  setHost: (host: string) => {},
  port: '0',
  setPort: (host: string) => {},
  username: 'guest',
  setUsername: (username: string) => {},
  password: 'guest',
  setPassword: (password: string) => {},
  isConnected: false
}
type ProtoRabbitContextType = typeof defaultProtoRabbitContext
export const ProtoRabbitContext =
  React.createContext<ProtoRabbitContextType>(defaultProtoRabbitContext)

export const AppContext = (props: PropsWithChildren) => {
  const protoRabbitApi = useMemo(() => window.ProtoRabbit, [])
  const [host, setHost] = useState<string>('localhost')
  const [port, setPort] = useState<string>('5672')
  const [username, setUsername] = useState<string>('guest')
  const [password, setPassword] = useState<string>('guest')
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    protoRabbitApi.addConnectionStatusChangeListener(setIsConnected)
    return () => {
      protoRabbitApi.removeConnectionStatusChangeListener(setIsConnected)
    }
  }, [protoRabbitApi, setIsConnected])

  const ctx: ProtoRabbitContextType = {
    ProtoRabbit: protoRabbitApi,
    host,
    setHost,
    port,
    setPort,
    username,
    setUsername,
    password,
    setPassword,
    isConnected
  }
  return <ProtoRabbitContext.Provider value={ctx}>{props.children}</ProtoRabbitContext.Provider>
}
