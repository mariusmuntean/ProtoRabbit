import { Divider, Space } from 'antd'
import { MessageReceiving } from './components/MessageReceiving'
import { MessageSending } from './components/MessageSending'
import { ServerConnection } from './components/ServerConnection'

function App(): JSX.Element {
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
      <ServerConnection />
      <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
      <MessageSending />
      <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
      <MessageReceiving />
      <Divider type="horizontal" style={{ backgroundColor: 'lightgray', margin: '0.3em' }} />
    </Space>
  )
}

export default App
