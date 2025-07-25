import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import NotFound from '@/components/ui/auth/NotFound/NotFound'
import HomePage from '@/pages/public/HomePage/HomePage'
import ProtectedRoute from './guards/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'

const publicRoutes: RouteObject[] = [{ index: true, element: <HomePage /> }]

// Khách hàng đã đăng nhập
const customerProtectedRoutes: RouteObject[] = []

// Admin
const adminRoutes: RouteObject[] = []

// Main router configuration
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [...publicRoutes, ...customerProtectedRoutes]
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: adminRoutes
  },
  {
    path: '*',
    element: <NotFound />
  }
]

const router = createBrowserRouter(routes)
export default router
