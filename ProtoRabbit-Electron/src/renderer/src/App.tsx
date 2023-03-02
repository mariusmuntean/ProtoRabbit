import { Divider, Layout, Space } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { AppHeader } from './components/AppHeader'
import { AppVersion } from './components/AppVersion'
import { MessageReceiving } from './components/MessageReceiving'
import { MessageSending } from './components/MessageSending'
import { ServerConnection } from './components/ServerConnection'

function App(): JSX.Element {
  return (
    <Layout style={{ height: '100%' }}>
      <Header style={{ backgroundColor: 'lightgray', padding: '0', height: 'auto' }}>
        <AppHeader />
      </Header>
      <Content style={{ height: '100%' }}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
          <ServerConnection />
          <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
          <MessageSending />
          <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
          <MessageReceiving />
          <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
        </Space>
      </Content>
      <Footer style={{ height: 'auto', padding: '0.2em', backgroundColor: 'lightgray' }}>
        <AppVersion />
      </Footer>
    </Layout>
  )
}

export default App
