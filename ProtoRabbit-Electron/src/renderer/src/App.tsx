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
    <div
      style={{
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.15rem',
        backgroundColor: 'blueviolet',
        overflow: 'overflow'
      }}
    >
      <div style={{ padding: '0', height: '6rem', backgroundColor: 'darkslategray' }}>
        <AppHeader />
      </div>
      <div
        style={{
          padding: '0.15em',
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          overflow: 'auto',
          backgroundColor: 'palegreen'
        }}
      >
        <Divider type="horizontal" style={{ marginTop: '0.3em', marginBottom: '0.3em' }} />
        <ServerConnection />
        {isConnected && (
          <>
            <Divider type="horizontal" style={{ marginTop: '0.3em', marginBottom: '0.3em' }} />
            <MessageSending />
          </>
        )}
        {isConnected && (
          <>
            <Divider type="horizontal" style={{ marginTop: '0.3em', marginBottom: '0.3em' }} />
            <MessageReceiving />
          </>
        )}
        <Divider type="horizontal" style={{ marginTop: '0.3em', marginBottom: '0.3em' }} />
      </div>
      <div
        style={{
          backgroundColor: 'darkslategray',
          marginTop: 'auto',
          height: '1rem',
          padding: '0.4em',
          display: 'flex',
          gap: '0.2rem',
          alignItems: 'center'
        }}
      >
        <AppVersion />
        <AppInfo />
      </div>
    </div>
  )
}

export default App
