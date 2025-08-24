import { store } from '@/store/store'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import ThemeProvider from './theme/ThemeProvider'
import GlobalSnackbar from './components/common/GlobaSnackbar/GlobalSnackbar'

function App() {
  const user
  // console.log('🚀 ~ App.tsx:11 ~ App ~ user:', user)
  // console.log('🚀 ~ App.tsx:12 ~ App ~ tsx:', tsx)

  // console.log('🚀 ~ App.tsx:14 ~ App ~ user:', user)
  console.log('hahhah')

  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <GlobalSnackbar />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
