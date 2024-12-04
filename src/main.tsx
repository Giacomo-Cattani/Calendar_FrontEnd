import { createRoot } from 'react-dom/client'
import AppRouter from './routes.tsx'

import { Provider } from 'react-redux'
import store from './redux/store.tsx'
import './index.css'



createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
)
