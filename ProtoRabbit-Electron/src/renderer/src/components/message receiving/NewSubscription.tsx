import { useCallback, useState } from 'react'
import { Tooltip, Button, Modal, Form, Input } from 'antd'
import { FileAddOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'

interface NewSubscriptionType {
  name: string
  exchange: string
  routingKey: string
  queueName: string
  protobufDefinition: string
}

export const NewSubscription = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const onToggleModalVisibilityClicked = useCallback(() => {
    setIsModalVisible((v) => !v)
  }, [])

  const onModalCancelled = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const [form] = Form.useForm<NewSubscriptionType>()
  const onFinish = async (values: NewSubscriptionType) => {
    await window.ProtoRabbit.getSubscriptionManager()?.addNewSubscription(
      values.name,
      values.exchange,
      values.routingKey,
      values.queueName,
      values.protobufDefinition
    )
    form?.resetFields()
    setIsModalVisible(false)
  }

  const onFinishFailed = (errorInfo: ValidateErrorEntity<NewSubscriptionType>) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Tooltip title="Add a new subscription">
        <Button type="link" icon={<FileAddOutlined />} size="small" onClick={onToggleModalVisibilityClicked}></Button>
      </Tooltip>
      <Modal
        title="New Subscription"
        open={isModalVisible}
        closable
        onCancel={onModalCancelled}
        footer={null}
        width="50em"
        // style={{ minHeight: '60em', height: '60em', width: '100%', overflow: 'auto', resize: 'vertical' }}
        bodyStyle={{ width: '100%' }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 800 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          layout="horizontal"
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Give your subscription a name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Exchange" name="exchange" rules={[{ required: true, message: 'The name of the source exchange' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Routing Key" name="routingKey" rules={[{ required: true, message: 'The name of the source exchange' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Queue name" name="queueName" rules={[{ required: true, message: 'The name of the destination queue' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Protobuf definition"
            name="protobufDefinition"
            rules={[{ required: false, message: 'The protobuf definition to use for message deserialization' }]}
          >
            <Editor
              defaultLanguage="proto"
              defaultValue="Protofile"
              language="proto"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                lineNumbersMinChars: 3,
                lineDecorationsWidth: 0
              }}
              value={''}
              height="20em"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ justifyContent: 'center', display: 'flex' }}>
            <Button type="primary" htmlType="submit">
              Create and Start
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
