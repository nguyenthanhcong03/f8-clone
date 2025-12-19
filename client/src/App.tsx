import { TooltipProvider } from '@/components/ui/tooltip'
import router from '@/routes/routes'
import { useGetCurrentUserQuery } from '@/services/api/authApi'
import { logout } from '@/store/features/auth/authSlice'
import { useAppDispatch } from '@/store/hook'
import ThemeProvider from '@/theme/ThemeProvider'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

  // if (isLoading) {
  //   return <AppLoader />
  // }

  return (
    <ThemeProvider>
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
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
