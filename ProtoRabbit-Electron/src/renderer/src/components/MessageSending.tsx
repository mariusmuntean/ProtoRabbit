import { ProtoRabbitContext } from '@renderer/AppContext'
import { Button, Col, Input, notification, Row, Select, Space } from 'antd'
import { useCallback, useContext, useState } from 'react'

import Editor from '@monaco-editor/react'

export const MessageSending = () => {
  const { ProtoRabbit } = useContext(ProtoRabbitContext)
  const [message, setMessage] = useState<string>(`{
    "awesomeField":" hey"
    }`)
  const [protofile, setProtofile] = useState<string>(`package ProtoRabbit;
  syntax = "proto3";

  message AwesomeMessage {
      string awesome_field = 1; // becomes awesomeField
  }
  `)

  const send = useCallback(async () => {
    try {
      console.log('')
      await ProtoRabbit.send('proto.data', 'c', protofile, message)
      // setMessage('')
    } catch (error) {
      notification.error({ message: 'Sending failed', description: JSON.stringify(error), duration: 5 })
    }
  }, [ProtoRabbit, message, protofile])

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <div style={{ alignSelf: 'self-start' }}>Send</div>
      <Select
        options={[
          { value: 'Create', label: 'Create' },
          { value: 'Delete', label: 'Delete' }
        ]}
        defaultValue={'Create'}
        style={{ width: '10em' }}
      ></Select>
      <Row gutter={5} style={{ margin: '0', height: '25vh' }}>
        <Col span={12}>
          <Editor
            defaultLanguage="json"
            defaultValue="Json Message"
            language="json"
            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
            value={message}
            onChange={(v, _) => setMessage(v ?? '')}
            height="100%"
          ></Editor>
        </Col>
        <Col span={12}>
          <Editor
            defaultLanguage="proto"
            defaultValue="Protofile"
            language="proto"
            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
            value={protofile}
            onChange={(v, _) => setProtofile(v ?? '')}
            height="100%"
          ></Editor>
        </Col>
      </Row>
      <Button type="primary" onClick={send}>
        Send
      </Button>
    </Space>
  )
}
