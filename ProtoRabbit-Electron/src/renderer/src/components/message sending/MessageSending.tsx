import { ProtoRabbitContext } from '@renderer/AppContext'
import { Button, Col, Empty, Input, notification, Row, Select, Space } from 'antd'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'

import { CreateSendableMessageTemplate } from './CreateSendableMessageTemplate'
import { DeleteSendableMessageTemplate } from './DeleteSendableMessageTemplate'

export const MessageSending = () => {
  const { ProtoRabbit, sendableMessageTemplates, selectedSendableMessageTemplateId, setSelectedSendableMessageTemplateId } =
    useContext(ProtoRabbitContext)

  const sendableMessageTemplate = useMemo(() => {
    return sendableMessageTemplates.find((t) => t.id === selectedSendableMessageTemplateId)
  }, [selectedSendableMessageTemplateId, sendableMessageTemplates])

  const [message, setMessage] = useState<string>()
  useEffect(() => {
    setMessage(sendableMessageTemplate?.jsonSample)
  }, [sendableMessageTemplate])

  const send = useCallback(async () => {
    try {
      if (!sendableMessageTemplate || !message) {
        return
      }
      await ProtoRabbit.send(
        sendableMessageTemplate.exchange,
        sendableMessageTemplate.routingKey,
        sendableMessageTemplate.protofile,
        message
      )
      // setMessage('')
    } catch (error) {
      notification.error({ message: 'Sending failed', description: JSON.stringify(error), duration: 5 })
    }
  }, [ProtoRabbit, message, sendableMessageTemplate])

  const selectionOptions = sendableMessageTemplates.map((s) => ({ name: s.id, value: s.name }))
  const selectedOption = selectionOptions.find((o) => o.name === selectedSendableMessageTemplateId)
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <div style={{ alignSelf: 'self-start' }}>Send</div>
      <Space>
        <Select
          options={selectionOptions}
          value={selectedOption}
          onChange={(v, selection) => {
            if (Array.isArray(selection)) {
              setSelectedSendableMessageTemplateId(selection[0].name)
            } else {
              setSelectedSendableMessageTemplateId(selection.name)
            }
          }}
          style={{ width: '10em' }}
        />
        <CreateSendableMessageTemplate />
        {sendableMessageTemplate && (
          <span>{`Exchange: ${sendableMessageTemplate.exchange} Routing key: ${sendableMessageTemplate.routingKey}`}</span>
        )}
        {sendableMessageTemplate && <DeleteSendableMessageTemplate sendableMessageTemplate={sendableMessageTemplate} />}
      </Space>
      {!sendableMessageTemplate && <Empty description={'Choose a sendable message template'}></Empty>}
      {sendableMessageTemplate && (
        <>
          <Row gutter={5} style={{ margin: '0', height: '25vh' }}>
            <Col span={12}>
              <Editor
                defaultLanguage="json"
                defaultValue="Json Message"
                language="json"
                options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true }}
                value={sendableMessageTemplate?.jsonSample}
                onChange={(v, _) => setMessage(v ?? '')}
                height="100%"
              />
            </Col>
            <Col span={12}>
              <Editor
                defaultLanguage="proto"
                defaultValue="Protofile"
                language="proto"
                options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, readOnly: true, automaticLayout: true }}
                value={sendableMessageTemplate?.protofile}
                height="100%"
              />
            </Col>
          </Row>
        </>
      )}
      <Button type="primary" onClick={send}>
        Send
      </Button>
    </Space>
  )
}
