import { TooltipProvider } from '@/components/ui/tooltip'
import router from '@/routes/routes'
import { useGetCurrentUserQuery } from '@/services/api/authApi'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import ThemeProvider from '@/theme/ThemeProvider'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppLoader from './components/common/loading/AppLoader'

function App() {
  const dispatch = useAppDispatch()
  // Kiểm tra xem có accessToken trong local storage không
  const hasToken = Boolean(localStorage.getItem('accessToken'))
const { isLoading } = useAppSelector((state) => state.auth)

  // Sử dụng RTK Query để lấy thông tin user hiện tại
  const { isFetching } = useGetCurrentUserQuery(undefined, {
    // Chỉ gọi API nếu có accessToken
    skip: !hasToken
  })

  if ((isFetching || isLoading) && hasToken) {
    return <AppLoader />
  }

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
