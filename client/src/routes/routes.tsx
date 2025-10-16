import NotFound from '@/components/ui/auth/NotFound/NotFound'
import CourseIndex from '@/pages/admin/CourseManagement/CourseIndex'
import EditCoursePage from '@/pages/admin/CourseManagement/EditCoursePage'
import EditLessonPage from '@/pages/admin/CourseManagement/EditLessonPage'
import QuickAddCoursePage from '@/pages/admin/CourseManagement/QuickAddCoursePage'
import BlogPage from '@/pages/public/BlogPage/BlogPage'
import CourseDetail from '@/pages/public/CourseDetail/CourseDetail'
import HomePage from '@/pages/public/HomePage/HomePage'
import RoadMapPage from '@/pages/public/RoadMapPage/RoadMapPage'
import LearningPage from '@/pages/student/StudyPage/LearningPage'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import ProtectedRoute from './guards/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'

const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: ':slug', element: <CourseDetail /> },
  { path: 'roadmap', element: <RoadMapPage /> },
  { path: 'blog', element: <BlogPage /> }
]

// Khách hàng đã đăng nhập
// const customerProtectedRoutes: RouteObject[] = [{ path: 'learning/:courseId', element: <StudyPage /> }]

// Admin
const adminRoutes: RouteObject[] = [
  { path: 'courses', element: <CourseIndex /> },
  { path: 'courses/add', element: <QuickAddCoursePage /> },
  { path: 'courses/:courseId', element: <EditCoursePage /> },
  { path: 'courses/:courseId/sections/:sectionId/lessons/:lessonId', element: <EditLessonPage /> }
]

// Main router
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [...publicRoutes]
  },
  {
    path: '/learning/:slug',
    element: <LearningPage />,
    errorElement: <NotFound />
  },
  {
    path: 'admin',
    element: (
      // <ProtectedRoute roles={['admin']}>
      <AdminLayout />
      // </ProtectedRoute>
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
