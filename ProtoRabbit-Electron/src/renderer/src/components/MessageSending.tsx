import { Button, Col, Input, Row, Select, Space } from 'antd'

export const MessageSending = () => {
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
          <Input.TextArea placeholder="Json Message"></Input.TextArea>
        </Col>
        <Col span={12}>
          <Input.TextArea placeholder="Protofile"></Input.TextArea>
        </Col>
      </Row>
      <Button type="primary">Send</Button>
    </Space>
  )
}
