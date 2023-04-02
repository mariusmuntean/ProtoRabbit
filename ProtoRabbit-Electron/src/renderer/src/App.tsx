import { useContext } from 'react'
import { ProtoRabbitContext } from './AppContext'

import { AppHeader } from './components/AppHeader'
import { AppVersion } from './components/AppVersion'
import { MessageReceiving } from './components/MessageReceiving'
import { MessageSending } from './components/message sending/MessageSending'
import { ServerConnection } from './components/ServerConnection'
import { configMonacoEditor } from './MonacoConfig'
import { AppInfo } from './components/AppInfo'
import { SectionDivider } from './components/SectionDivider'

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
      <div style={{ padding: '0', height: '6rem', backgroundColor: 'darkslateblue' }}>
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
        <SectionDivider type="horizontal" />
        <ServerConnection />
        {isConnected && (
          <>
            <SectionDivider type="horizontal" />
            <MessageSending />
          </>
        )}
        {isConnected && (
          <>
            <SectionDivider type="horizontal" />
            <MessageReceiving />
          </>
        )}
        <SectionDivider type="horizontal" />
      </div>
      <div
        style={{
          backgroundColor: 'darkslateblue',
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
