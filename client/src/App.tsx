import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import GlobalSnackbar from './components/common/GlobaSnackbar/GlobalSnackbar'
import router from './routes/routes'
import ThemeProvider from './theme/ThemeProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppLoader from './components/common/Loading/AppLoader'
import { useGetCurrentUserQuery } from './store/api/authApi'
import { useAppDispatch } from './store/hook'
import { logout } from './store/features/auth/authSlice'

function App() {
  const dispatch = useAppDispatch()
  // Kiểm tra xem có accessToken trong local storage không
  const hasToken = Boolean(localStorage.getItem('accessToken'))

  // Sử dụng RTK Query để lấy thông tin user hiện tại
  const { isLoading, isError } = useGetCurrentUserQuery(undefined, {
    // Chỉ gọi API nếu có accessToken
    skip: !hasToken
  })

  // Logout nếu có lỗi khi xác thực
  useEffect(() => {
    if (isError) {
      dispatch(logout())
    }
  }, [isError, dispatch])

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <ThemeProvider>
      <GlobalSnackbar />
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
