import ReactDOM from 'react-dom/client'

import App from './App'
import { AppContext } from './AppContext'

import './assets/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppContext>
    <App />
  </AppContext>
)
