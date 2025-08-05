import { store } from '@/store/store'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import ThemeProvider from './theme/ThemeProvider'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
