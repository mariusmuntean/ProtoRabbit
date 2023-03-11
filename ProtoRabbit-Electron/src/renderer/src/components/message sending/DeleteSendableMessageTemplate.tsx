import { useCallback, useContext } from 'react'
import { Button, Popconfirm, Tooltip } from 'antd'
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
      placement="topRight"
      okText="Yes"
      onConfirm={onDeleteTemplate}
      cancelText="No"
    >
      <Tooltip title="Delete the current template" placement="left" color={'volcano'}>
        <Button icon={<DeleteOutlined />} type="link" danger />
      </Tooltip>
    </Popconfirm>
  )
}
