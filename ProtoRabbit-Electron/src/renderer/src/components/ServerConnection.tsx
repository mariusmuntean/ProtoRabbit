import { Button, Col, Input, Row, Space } from 'antd'

export const ServerConnection = () => {
  return (
    <div>
      <Space direction="vertical">
        <div>Connection</div>
        <Space direction="horizontal" align="center">
          <Row gutter={[5, 5]} justify={'center'}>
            <Col span={12}>
              <Input placeholder="Host" />
            </Col>
            <Col span={12}>
              <Input placeholder="Port" />
            </Col>

            <Col span={12}>
              <Input placeholder="Username" />
            </Col>
            <Col span={12}>
              <Input placeholder="Password" />
            </Col>
          </Row>
          <Button type="primary">Connect</Button>
        </Space>
      </Space>
    </div>
  )
}
