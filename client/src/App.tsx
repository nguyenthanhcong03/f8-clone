import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import GlobalSnackbar from './components/common/GlobaSnackbar/GlobalSnackbar'
import router from './routes/routes'
import ThemeProvider from './theme/ThemeProvider'
import Loader from './components/common/Loading/Loader'
import { getCurrentUser, logout } from './store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from './store/hook'

function App() {
  const dispatch = useAppDispatch()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(getCurrentUser()).unwrap()
      } catch (error) {
        console.error('Error verifying auth:', error)
        dispatch(logout())
      } finally {
        setIsCheckingAuth(false)
      }
    }

    if (!user && !isAuthenticated && localStorage.getItem('accessToken')) {
      checkAuth()
    } else {
      setIsCheckingAuth(false)
    }
  }, [user, isAuthenticated, dispatch])

  if (isLoading || isCheckingAuth) {
    return <Loader />
  }

  return (
    <ThemeProvider>
      <GlobalSnackbar />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
