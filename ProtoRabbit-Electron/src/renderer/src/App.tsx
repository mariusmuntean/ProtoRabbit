import { Divider, Layout, Space } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { useContext } from 'react'
import { ProtoRabbitContext } from './AppContext'

import { AppHeader } from './components/AppHeader'
import { AppVersion } from './components/AppVersion'
import { MessageReceiving } from './components/MessageReceiving'
import { MessageSending } from './components/message sending/MessageSending'
import { ServerConnection } from './components/ServerConnection'
import { configMonacoEditor } from './MonacoConfig'
import { AppInfo } from './components/AppInfo'

// config monaco editor
configMonacoEditor()

function App(): JSX.Element {
  const { isConnected } = useContext(ProtoRabbitContext)

  return (
    <Layout style={{ height: '100%' }}>
      <Header style={{ backgroundColor: 'lightgray', padding: '0', height: 'auto' }}>
        <AppHeader />
      </Header>
      <Content style={{ height: '100%' }}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          <Divider type="horizontal" style={{ backgroundColor: 'lightgray', marginTop: '0.3em', marginBottom: '0.3em' }} />
          <ServerConnection />
          {isConnected && (
            <>
              <Divider type="horizontal" style={{ backgroundColor: 'lightgray', marginTop: '0.3em', marginBottom: '0.3em' }} />
              <MessageSending />
            </>
          )}
          {isConnected && (
            <>
              <Divider type="horizontal" style={{ backgroundColor: 'lightgray', marginTop: '0.3em', marginBottom: '0.3em' }} />
              <MessageReceiving />
            </>
          )}
          <Divider type="horizontal" style={{ backgroundColor: 'lightgray', marginTop: '0.3em', marginBottom: '0.3em' }} />
        </Space>
      </Content>
      <Footer style={{ height: 'auto', padding: '0.2em', backgroundColor: 'lightgray' }}>
        <Space>
          <AppVersion />
          <AppInfo />
        </Space>
      </Footer>
    </Layout>
  )
}

export default App
