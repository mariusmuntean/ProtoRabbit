import { Divider } from 'antd'
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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
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
          overflow: 'auto'
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
          display: 'flex',
          gap: '0.2rem',
          padding: '0.2em',
          alignItems: 'center',
          margin: '0'
        }}
      >
        <AppVersion />
        <AppInfo />
      </div>
    </div>
  )
}

export default App
