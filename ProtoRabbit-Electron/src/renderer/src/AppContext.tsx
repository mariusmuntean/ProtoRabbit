import React, { PropsWithChildren, useState } from 'react'

const defaultProtoRabbitContext = {
  host: '',
  setHost: (host: string) => {},
  port: '0',
  setPort: (host: string) => {},
  username: 'guest',
  setUsername: (username: string) => {},
  password: 'guest',
  setPassword: (password: string) => {}
}
type ProtoRabbitContextType = typeof defaultProtoRabbitContext
export const ProtoRabbitContext =
  React.createContext<ProtoRabbitContextType>(defaultProtoRabbitContext)

export const AppContext = (props: PropsWithChildren) => {
  const [host, setHost] = useState<string>('localhost')
  const [port, setPort] = useState<string>('5672')
  const [username, setUsername] = useState<string>('guest')
  const [password, setPassword] = useState<string>('guest')

  const ctx: ProtoRabbitContextType = {
    host,
    setHost,
    port,
    setPort,
    username,
    setUsername,
    password,
    setPassword
  }
  return <ProtoRabbitContext.Provider value={ctx}>{props.children}</ProtoRabbitContext.Provider>
}
