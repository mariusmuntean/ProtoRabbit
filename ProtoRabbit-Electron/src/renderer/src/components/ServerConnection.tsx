import { useContext } from 'react'
import { Button, Col, Input, Row, Space } from 'antd'

import { ProtoRabbitContext } from '@renderer/AppContext'

export const ServerConnection = () => {
  const { host, setHost, password, setPassword, port, setPort, username, setUsername } =
    useContext(ProtoRabbitContext)
  return (
    <div>
      <Space direction="vertical">
        <div>Connection</div>
        <Space direction="horizontal" align="center">
          <Row gutter={[5, 5]} justify={'center'}>
            <Col span={12}>
              <Input placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
            </Col>
            <Col span={12}>
              <Input placeholder="Port" value={port} onChange={(e) => setPort(e.target.value)} />
            </Col>

            <Col span={12}>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
          </Row>
          <Button type="primary">Connect</Button>
        </Space>
      </Space>
    </div>
  )
}
