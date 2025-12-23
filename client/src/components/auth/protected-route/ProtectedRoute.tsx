import AppLoader from '@/components/common/loading/AppLoader'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

interface IProps {
  children: React.ReactNode
  requireAuth?: boolean
  roles?: string[]
  redirectPath?: string
  fallbackComponent?: React.ReactNode
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  roles = [],
  redirectPath = '/login',
  fallbackComponent = null
}: IProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return fallbackComponent || <AppLoader />
  }

  // Chuyển hướng người dùng không được xác thực đến trang đăng nhập với đường dẫn trở về
  // Chỉ khi đã hoàn thành việc kiểm tra xác thực (isLoading = false) và user thực sự chưa đăng nhập
  if (requireAuth && !isAuthenticated && !isLoading) {
    return <Navigate to={'/'} state={{ from: location.pathname }} replace />
  }
  // Kiểm tra quyền truy cập dựa trên vai trò người dùng
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    // Chuyển hướng đến trang unauthorized nếu người dùng không có quyền truy cập
    return <Navigate to='/unauthorized' replace />
  }

  // Chuyển hướng người dùng đã đăng nhập khi họ cố gắng truy cập trang đăng nhập/đăng ký
  if (!requireAuth && isAuthenticated) {
    // Lấy đường dẫn từ state nếu có, nếu không thì điều hướng theo role của user
    const fromPath = location.state?.from
    const defaultRedirectPath = user?.role === 'admin' ? '/admin' : '/'
    const redirectTo = fromPath || defaultRedirectPath

    return <Navigate to={redirectTo} replace />
  }

  return children
}

ProtectedRoute.displayName = 'ProtectedRoute'

export default ProtectedRoute
