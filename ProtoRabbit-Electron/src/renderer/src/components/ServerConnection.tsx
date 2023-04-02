import { useCallback, useContext } from 'react'
import { Button, Col, Input, notification, Row, Space } from 'antd'
import { DisconnectOutlined, LinkOutlined } from '@ant-design/icons'

import { ProtoRabbitContext } from '@renderer/AppContext'

export const ServerConnection = () => {
  const { ProtoRabbit, host, setHost, password, setPassword, port, setPort, username, setUsername, isConnected } =
    useContext(ProtoRabbitContext)

  const connect = useCallback(async () => {
    try {
      await ProtoRabbit.connect({ hostname: host, port, username, password })
    } catch (e) {
      notification.error({
        message: 'Connection failed',
        description: JSON.stringify(e),
        duration: 5
      })
    }
  }, [ProtoRabbit, host, password, port, username])

  const disconnect = useCallback(async () => {
    try {
      await ProtoRabbit.disconnect()
    } catch (e) {
      notification.error({
        message: 'Disconnect failed',
        description: JSON.stringify(e),
        duration: 5
      })
    }
  }, [ProtoRabbit])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2em' }}>
        <div>Connection</div>
        <Space direction="horizontal" style={{ justifyContent: 'center' }}>
          <Row gutter={[5, 5]} justify={'center'}>
            <Col span={12}>
              <Input placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
            </Col>
            <Col span={12}>
              <Input placeholder="Port" value={port} onChange={(e) => setPort(Number.parseInt(e.target.value, 10))} />
            </Col>

            <Col span={12}>
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Col>
            <Col span={12}>
              <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Col>
          </Row>
          {isConnected ? (
            <Button type="primary" size="small" onClick={disconnect} icon={<DisconnectOutlined />} danger>
              Disconnect
            </Button>
          ) : (
            <Button type="primary" size="small" onClick={connect} icon={<LinkOutlined />}>
              Connect
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}
