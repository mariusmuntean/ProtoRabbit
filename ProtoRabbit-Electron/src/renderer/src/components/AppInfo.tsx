import { useCallback, useState, useEffect } from 'react'
import { Button, Divider, Modal, Space, Tooltip } from 'antd'
import { InfoCircleOutlined, TwitterOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import AnchorLink from 'antd/es/anchor/AnchorLink'

export const AppInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataStorePath, setDataStorePath] = useState<string>('')
  const [dataStoreContent, setDataStoreContent] = useState<string>('')
  useEffect(() => {
    const loadDataStoreInfo = async () => {
      setDataStorePath(await window.ProtoRabbit.dataStore.getDataStorePath())
      setDataStoreContent(await window.ProtoRabbit.dataStore.getDataStoreContent())
    }
    if (isModalOpen) {
      loadDataStoreInfo()
    }
  }, [setDataStorePath, setDataStoreContent, isModalOpen])

  const onModalToggle = useCallback(() => {
    setIsModalOpen((v) => !v)
  }, [setIsModalOpen])

  const onModalCancel = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  return (
    <>
      <Button icon={<InfoCircleOutlined />} type="link" onClick={onModalToggle} id="appInfoBtn" />
      <Modal
        open={isModalOpen}
        closable
        onCancel={onModalCancel}
        destroyOnClose={true}
        width="fit-content"
        bodyStyle={{ width: '43em' }}
        footer={null}
      >
        <Space style={{ display: 'flex', height: '100%' }} direction="vertical">
          <Space>
            <h1>{window.ProtoRabbit.name()}</h1>
            <h2>{window.ProtoRabbit.version()}</h2>
          </Space>

          <Space>
            <h3>Config Path</h3>
            <span style={{ wordWrap: 'normal', lineBreak: 'anywhere' }} id="appInfoConfigPath">
              {dataStorePath}
            </span>
          </Space>

          <Editor
            defaultLanguage="json"
            language="json"
            defaultValue={dataStoreContent}
            value={dataStoreContent}
            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, readOnly: true, automaticLayout: true }}
            height="36em"
          />
          <Tooltip title="Open the app configuration file in your own editor" placement="right">
            <Button onClick={async () => await window.ProtoRabbit.dataStore.openDataStoreInUserEditor()}>Open Config in Editor</Button>
          </Tooltip>
          <Divider></Divider>
          <AnchorLink
            href="https://twitter.com/munteanmarius"
            target="_blank"
            title={
              <Space>
                <TwitterOutlined />
                <span>{'@MunteanMarius'}</span>
              </Space>
            }
          ></AnchorLink>
        </Space>
      </Modal>
    </>
  )
}
