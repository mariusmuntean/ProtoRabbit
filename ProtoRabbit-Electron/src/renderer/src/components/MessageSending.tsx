import { ProtoRabbitContext } from '@renderer/AppContext'
import { Button, Col, Input, notification, Row, Select, Space } from 'antd'
import { useCallback, useContext, useState } from 'react'

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
      <Row gutter={5} style={{ margin: '0' }}>
        <Col span={12}>
          <Input.TextArea placeholder="Json Message" rows={8} value={message} onChange={(e) => setMessage(e.target.value)}></Input.TextArea>
        </Col>
        <Col span={12}>
          <Input.TextArea
            placeholder="Protofile"
            rows={8}
            value={protofile}
            onChange={(e) => {
              setProtofile(e.target.value)
            }}
          ></Input.TextArea>
        </Col>
      </Row>
      <Button type="primary" onClick={send}>
        Send
      </Button>
    </Space>
  )
}
