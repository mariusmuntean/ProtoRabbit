import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Divider, Input, Modal, Space, Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { ulid } from 'ulid'

import { ProtoRabbitContext } from '@renderer/AppContext'
import { SendableMessageTemplate } from 'src/shared/SendableMessageTemplate'

const sampleProtoDefinition = `package ProtoRabbit;
syntax = "proto3";

message AwesomeMessage {
    string user_id = 1; // becomes userId
}`

const sampleJsonSample = `{
  "userId": "123-xd-88"
}`

interface Props {
  sendableMessageTemplateToUpdate?: SendableMessageTemplate
  tooltipPlacement?: TooltipPlacement
}

export const UpsertSendableMessageTemplate = ({ sendableMessageTemplateToUpdate, tooltipPlacement }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>()
  const [exchange, setExchange] = useState<string | undefined>()
  const [routingKey, setRoutingKey] = useState<string | undefined>()
  const [protofileContent, setProtofileContent] = useState<string | undefined>(sampleProtoDefinition)
  const [jsonSample, setJsonSample] = useState<string | undefined>(sampleJsonSample)
  useEffect(() => {
    setName((n) => sendableMessageTemplateToUpdate?.name ?? n)
    setExchange((e) => sendableMessageTemplateToUpdate?.exchange ?? e)
    setRoutingKey((r) => sendableMessageTemplateToUpdate?.routingKey ?? r)
    setProtofileContent((p) => sendableMessageTemplateToUpdate?.protofile ?? p)
    setJsonSample(sampleJsonSample)
  }, [sendableMessageTemplateToUpdate])

  const onToggleModalClicked = useCallback(() => {
    setIsModalOpen((v) => !v)
  }, [setIsModalOpen])

  const clearState = useCallback(() => {
    setIsModalOpen(false)

    // Clear fields only when not editing an existing template
    if (!sendableMessageTemplateToUpdate) {
      setName(undefined)
      setExchange(undefined)
      setRoutingKey(undefined)
      setProtofileContent(sampleProtoDefinition)
      setJsonSample(sampleJsonSample)
    }
  }, [sendableMessageTemplateToUpdate])

  const onModalCancel = useCallback(() => {
    clearState()
  }, [clearState])

  const canUpsertTemplate = useMemo<boolean>(() => {
    // ToDo check if protofile content is actually a valid protobuf definition
    return !!name && !!exchange && !!routingKey && !!protofileContent
  }, [exchange, name, protofileContent, routingKey])

  const { upsertSendableMessageTemplate } = useContext(ProtoRabbitContext)
  const onInsertNewTemplateClicked = useCallback(() => {
    if (!canUpsertTemplate) {
      return
    }

    upsertSendableMessageTemplate({
      id: sendableMessageTemplateToUpdate?.id ?? ulid(),
      name: name!,
      exchange: exchange!,
      routingKey: routingKey!,
      protofile: protofileContent!,
      jsonSample
    })
    clearState()
  }, [
    canUpsertTemplate,
    upsertSendableMessageTemplate,
    sendableMessageTemplateToUpdate,
    name,
    exchange,
    routingKey,
    protofileContent,
    jsonSample,
    clearState
  ])

  return (
    <>
      <Tooltip
        title={sendableMessageTemplateToUpdate ? 'Update current message template' : 'Add new message template'}
        placement={tooltipPlacement}
      >
        <Button
          icon={sendableMessageTemplateToUpdate ? <EditOutlined /> : <PlusCircleOutlined />}
          size="small"
          type="link"
          onClick={onToggleModalClicked}
        />
      </Tooltip>
      <Modal
        title={sendableMessageTemplateToUpdate ? `Edit ${sendableMessageTemplateToUpdate.name}` : 'Add new sendable message template'}
        open={isModalOpen}
        destroyOnClose={true}
        closable={true}
        onCancel={onModalCancel}
        onOk={onInsertNewTemplateClicked}
        okText="Create"
        okButtonProps={{ disabled: !canUpsertTemplate }}
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
