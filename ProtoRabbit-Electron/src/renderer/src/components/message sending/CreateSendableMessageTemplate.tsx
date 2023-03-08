import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Divider, Input, Modal, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { ProtoRabbitContext } from '@renderer/AppContext'
import Editor from '@monaco-editor/react'

const sampleProtoDefinition = `package ProtoRabbit;
syntax = "proto3";

message AwesomeMessage {
    string user_id = 1; // becomes userId
}`

const sampleJsonSample = `{
  "userId": "123-xd-88"
}`

export const CreateSendableMessageTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>()
  const [exchange, setExchange] = useState<string>()
  const [routingKey, setRoutingKey] = useState<string | undefined>()
  const [protofileContent, setProtofileContent] = useState<string | undefined>(sampleProtoDefinition)
  const [jsonSample, setJsonSample] = useState<string | undefined>(sampleJsonSample)

  const onToggleModalClicked = useCallback(() => {
    setIsModalOpen((v) => !v)
  }, [setIsModalOpen])

  const clearState = useCallback(() => {
    setIsModalOpen(false)
    setName(undefined)
    setExchange(undefined)
    setRoutingKey(undefined)
    setProtofileContent(sampleProtoDefinition)
    setJsonSample(sampleJsonSample)
  }, [setIsModalOpen, setName, setExchange, setRoutingKey, setProtofileContent, setJsonSample])

  const onModalCancel = useCallback(() => {
    clearState()
  }, [clearState])

  const canCreateNewTemplate = useMemo<boolean>(() => {
    // ToDo check if protofile content is actually a valid protobuf definition
    return !!name && !!exchange && !!routingKey && !!protofileContent
  }, [exchange, name, protofileContent, routingKey])

  const { addSendableMessageTemplate } = useContext(ProtoRabbitContext)
  const onOkClicked = useCallback(() => {
    if (!canCreateNewTemplate) {
      return
    }

    addSendableMessageTemplate({
      name: name!,
      exchange: exchange!,
      routingKey: routingKey!,
      protofile: protofileContent!,
      jsonSample
    })
    clearState()
  }, [addSendableMessageTemplate, canCreateNewTemplate, clearState, exchange, jsonSample, name, protofileContent, routingKey])

  return (
    <>
      <Button icon={<PlusCircleOutlined />} size="small" type="link" onClick={onToggleModalClicked}></Button>
      <Modal
        title="Add new sendable message template"
        open={isModalOpen}
        destroyOnClose={true}
        closable={true}
        onCancel={onModalCancel}
        onOk={onOkClicked}
        okText="Create"
        okButtonProps={{ disabled: !canCreateNewTemplate }}
        style={{ minHeight: '60em', height: '60em', overflow: 'auto', resize: 'vertical' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Exchange" value={exchange} onChange={(e) => setExchange(e.target.value)} />
          <Input placeholder="Routing key" value={routingKey} onChange={(e) => setRoutingKey(e.target.value)} />
          <span style={{ color: 'GrayText' }}>Protofile</span>
          <Editor
            defaultLanguage="proto"
            defaultValue={protofileContent}
            language="proto"
            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
            value={protofileContent}
            onChange={(v, _) => setProtofileContent(v)}
            height="12em"
          />
          <Divider style={{ margin: '0.5em' }}></Divider>
          <span style={{ color: 'GrayText' }}>Sample JSON</span>
          <Editor
            defaultLanguage="json"
            defaultValue={jsonSample}
            language="json"
            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true }}
            value={jsonSample}
            onChange={(v, _) => setJsonSample(v)}
            height="12em"
          />
        </Space>
      </Modal>
    </>
  )
}
