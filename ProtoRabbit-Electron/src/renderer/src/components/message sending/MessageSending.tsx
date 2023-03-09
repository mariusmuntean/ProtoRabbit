import { ProtoRabbitContext } from '@renderer/AppContext'
import { Button, Col, Empty, Input, notification, Row, Select, Space } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'

import Editor from '@monaco-editor/react'
import { SendableMessageTemplate } from '@renderer/data/SendableMessageTemplate'
import { CreateSendableMessageTemplate } from './CreateSendableMessageTemplate'

export const MessageSending = () => {
  const { ProtoRabbit, sendableMessageTemplates } = useContext(ProtoRabbitContext)
  const [sendableMessageTemplate, setSendableMessageTemplate] = useState<SendableMessageTemplate>()
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

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <div style={{ alignSelf: 'self-start' }}>Send</div>
      <Space>
        <CreateSendableMessageTemplate />
        <Select
          options={sendableMessageTemplates.map((s) => ({ name: s.name, value: s.name }))}
          onChange={(v, o) => {
            setSendableMessageTemplate(sendableMessageTemplates.find((s) => s.name == v))
          }}
          style={{ width: '10em' }}
        />
        {sendableMessageTemplate && (
          <span>{`Exchange: ${sendableMessageTemplate.exchange} Routing key: ${sendableMessageTemplate.routingKey}`}</span>
        )}
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
