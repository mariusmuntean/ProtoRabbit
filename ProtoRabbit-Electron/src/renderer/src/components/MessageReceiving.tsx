import { Divider } from 'antd'

import { NewSubscription } from './message receiving/NewSubscription'
import { SubscriptionList } from './message receiving/SubscriptionList'
import { SubscriptionMessages } from './message receiving/SubscriptionMessages'

export const MessageReceiving = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        overflow: 'auto',
        backgroundColor: 'chocolate',
        borderRadius: '0.3rem'
      }}
    >
      <span style={{ alignSelf: 'self-start' }}>Receive</span>
      <div style={{ margin: '0.5em', display: 'flex', flex: '1', overflow: 'auto' }}>
        {/* Subscriptions */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '16rem' }}>
          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
            <div>Subscriptions</div>
            <NewSubscription />
          </div>
          <div style={{ overflow: 'auto' }}>
            <SubscriptionList />
          </div>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        {/* Subscription Messages */}
        <div style={{ display: 'flex', flex: '1', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{}}>
            <span>Messages</span>
          </div>
          <div style={{ flex: '1', backgroundColor: 'goldenrod', padding: '0.2em', overflow: 'auto' }}>
            <SubscriptionMessages />
          </div>
        </div>
      </div>
    </div>
  )
}
