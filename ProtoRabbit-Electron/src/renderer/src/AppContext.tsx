import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Subscription } from './../../shared/Subscription'
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
  deleteSendableMessageTemplate: (tempalteId: string) => {},
  upsertSendableMessageTemplate: (sendableMessageTemplate: SendableMessageTemplate) => {},
  selectedSendableMessageTemplateId: '',
  setSelectedSendableMessageTemplateId: (id: string) => {},

  subscriptions: new Array<Subscription>(),
  addNewSubscription: async (
    name: string,
    exchange: string,
    routingKey: string,
    queueName: string,
    protofileData: string
  ): Promise<void> => {
    return Promise.resolve()
  },
  currentSubscription: {} as Subscription,
  setCurrentSubscription: (subscription: Subscription) => {}
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
      id: '1',
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
      id: '2',
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
  const [selectedSendableMessageTemplateId, setSelectedSendableMessageTemplateId] = useState<string>('')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>()

  useEffect(() => {
    protoRabbitApi.addConnectionStatusChangeListener(setIsConnected)

    const loadSettings = async () => {
      setHost((await protoRabbitApi.settings.serverSettings.getHost()) ?? host)
      setPort((await protoRabbitApi.settings.serverSettings.getPort()) ?? port)
      setUsername((await protoRabbitApi.settings.serverSettings.getUsername()) ?? username)
      setPassword((await protoRabbitApi.settings.serverSettings.getPassword()) ?? password)

      setSendableMessageTemplates(await protoRabbitApi.settings.sendSettings.getSendableMessageTemplates())
      setSelectedSendableMessageTemplateId(await protoRabbitApi.settings.sendSettings.getSelectedSendableMessageTemplateId())
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
      deleteSendableMessageTemplate: (templateId: string) => {
        const templateToDelete = sendableMessageTemplates.find((t) => t.id === templateId)
        if (!templateToDelete) {
          return
        }

        const newSendableMessageTemplates = sendableMessageTemplates.filter((t) => t.id !== templateId)
        protoRabbitApi.settings.sendSettings.setSendableMessageTemplates(newSendableMessageTemplates)
        setSendableMessageTemplates(newSendableMessageTemplates)
      },
      upsertSendableMessageTemplate: (sendableMessageTemplate: SendableMessageTemplate) => {
        const otherSendableMessageTemplates = sendableMessageTemplates.filter((t) => t.id !== sendableMessageTemplate.id)
        const newSendableMessageTemplates = [...otherSendableMessageTemplates, sendableMessageTemplate]
        protoRabbitApi.settings.sendSettings.setSendableMessageTemplates(newSendableMessageTemplates)
        setSendableMessageTemplates(newSendableMessageTemplates)
      },
      selectedSendableMessageTemplateId: selectedSendableMessageTemplateId,
      setSelectedSendableMessageTemplateId: (id: string) => {
        protoRabbitApi.settings.sendSettings.setSelectedSendableMessageTemplateId(id)
        setSelectedSendableMessageTemplateId(id)
      },

      subscriptions,
      addNewSubscription: async (
        name: string,
        exchange: string,
        routingKey: string,
        queueName: string,
        protofileData: string
      ): Promise<void> => {
        const sub = await window.ProtoRabbit.addNewSubscription(name, exchange, routingKey, queueName, protofileData)
        setSubscriptions([...subscriptions, sub])
      },
      currentSubscription,
      setCurrentSubscription: setCurrentSubscription
    }),
    [
      currentSubscription,
      host,
      isConnected,
      password,
      port,
      protoRabbitApi,
      selectedSendableMessageTemplateId,
      sendableMessageTemplates,
      subscriptions,
      username
    ]
  )
  return <ProtoRabbitContext.Provider value={ctx}>{props.children}</ProtoRabbitContext.Provider>
}
