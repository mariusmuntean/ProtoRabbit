import { useCallback, useContext } from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { SendableMessageTemplate } from 'src/shared/SendableMessageTemplate'
import { ProtoRabbitContext } from '@renderer/AppContext'

interface Props {
  sendableMessageTemplate: SendableMessageTemplate
}

export const DeleteSendableMessageTemplate = ({ sendableMessageTemplate }: Props) => {
  const { deleteSendableMessageTemplate } = useContext(ProtoRabbitContext)

  const onDeleteTemplate = useCallback(() => {
    deleteSendableMessageTemplate(sendableMessageTemplate.id)
  }, [deleteSendableMessageTemplate, sendableMessageTemplate?.id])

  return (
    <Popconfirm
      title={`Delete '${sendableMessageTemplate?.name}'`}
      description="Are you sure to delete this template?"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      okButtonProps={{ danger: true }}
      okText="Yes"
      cancelText="No"
    >
      <Button icon={<DeleteOutlined />} type="link" danger onClick={onDeleteTemplate} />
    </Popconfirm>
  )
}
