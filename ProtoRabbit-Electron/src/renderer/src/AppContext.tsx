import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { SendableMessageTemplate } from '../../shared/SendableMessageTemplate'

const defaultProtoRabbitContext = {
  ProtoRabbit: window.ProtoRabbit,
  host: '',
  setHost: (host: string) => {},
  port: 0,
  setPort: (host: number) => {},
  username: 'guest',
  setUsername: (username: string) => {},
  password: 'guest',
  setPassword: (password: string) => {},
  isConnected: false,
  sendableMessageTemplates: new Array<SendableMessageTemplate>(),
  addSendableMessageTemplate: (sendableMessageTemplate: SendableMessageTemplate) => {}
}
type ProtoRabbitContextType = typeof defaultProtoRabbitContext
export const ProtoRabbitContext = React.createContext<ProtoRabbitContextType>(defaultProtoRabbitContext)

export const AppContext = (props: PropsWithChildren) => {
  const protoRabbitApi = useMemo(() => window.ProtoRabbit, [])
  const [host, setHost] = useState<string>('localhost')
  const [port, setPort] = useState<number>(5672)
  const [username, setUsername] = useState<string>('guest')
  const [password, setPassword] = useState<string>('guest')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [sendableMessageTemplates, setSendableMessageTemplates] = useState<SendableMessageTemplate[]>([
    {
      name: 'Create',
      exchange: 'proto.data',
      routingKey: 'c',
      protofile: `package ProtoRabbit;
syntax = "proto3";

message AwesomeMessage {
    string name = 1;
    string email = 2;
}`,
      jsonSample: `{
  "name":" Marius",
  "email": "yes"
}`
    },
    {
      name: 'Delete',
      exchange: 'proto.data',
      routingKey: 'd',
      protofile: `package ProtoRabbit;
syntax = "proto3";

message AwesomeMessage {
    string user_id = 1; // becomes userId
}`,
      jsonSample: `{
  "userId": "123-xd-88"
}`
    }
  ])

  useEffect(() => {
    protoRabbitApi.addConnectionStatusChangeListener(setIsConnected)

    const loadSettings = async () => {
      setHost((await protoRabbitApi.settings.serverSettings.getHost()) ?? host)
      setPort((await protoRabbitApi.settings.serverSettings.getPort()) ?? port)
      setUsername((await protoRabbitApi.settings.serverSettings.getUsername()) ?? username)
      setPassword((await protoRabbitApi.settings.serverSettings.getPassword()) ?? password)

      setSendableMessageTemplates(await protoRabbitApi.settings.sendSettings.getSendableMessageTemplates())
    }
    loadSettings()

    return () => {
      protoRabbitApi.removeConnectionStatusChangeListener(setIsConnected)
    }
  }, [host, password, port, protoRabbitApi, setIsConnected, username])

  const ctx: ProtoRabbitContextType = useMemo(
    () => ({
      ProtoRabbit: protoRabbitApi,
      host,
      setHost: (newHost: string) => {
        protoRabbitApi.settings.serverSettings.setHost(newHost)
        setHost(newHost)
      },
      port,
      setPort: (newPort: number) => {
        protoRabbitApi.settings.serverSettings.setPort(newPort)
        setPort(newPort)
      },
      username,
      setUsername: (newUsername: string) => {
        protoRabbitApi.settings.serverSettings.setUsername(newUsername)
        setUsername(newUsername)
      },
      password,
      setPassword: (newPassword: string) => {
        protoRabbitApi.settings.serverSettings.setPassword(newPassword)
        setPassword(newPassword)
      },
      isConnected,
      sendableMessageTemplates,
      addSendableMessageTemplate: (newTemplate: SendableMessageTemplate) => {
        const newSendableMessageTemplates = [...sendableMessageTemplates, newTemplate]
        protoRabbitApi.settings.sendSettings.setSendableMessageTemplates(newSendableMessageTemplates)
        setSendableMessageTemplates(newSendableMessageTemplates)
      }
    }),
    [host, isConnected, password, port, protoRabbitApi, sendableMessageTemplates, username]
  )
  return <ProtoRabbitContext.Provider value={ctx}>{props.children}</ProtoRabbitContext.Provider>
}
