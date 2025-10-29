import NotFound from '@/components/ui/auth/NotFound/NotFound'
import AddCoursePage from '@/pages/admin/CourseManagement/AddCoursePage'
import CourseIndex from '@/pages/admin/CourseManagement/CourseIndex'
import EditCoursePage from '@/pages/admin/CourseManagement/EditCoursePage'
import EditLessonPage from '@/pages/admin/CourseManagement/EditLessonPage'
import BlogPage from '@/pages/public/BlogPage/BlogPage'
import CourseDetail from '@/pages/public/CourseDetail/CourseDetail'
import HomePage from '@/pages/public/HomePage/HomePage'
import RoadMapPage from '@/pages/public/RoadMapPage/RoadMapPage'
import ProfilePage from '@/pages/student/ProfilePage/ProfilePage'
import LearningPage from '@/pages/student/StudyPage/LearningPage'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'
import DashboardPage from '@/pages/admin/DashboardPage/DashboardPage'

const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: ':slug', element: <CourseDetail /> },
  { path: 'roadmap', element: <RoadMapPage /> },
  { path: 'blog', element: <BlogPage /> }
]

// Khách hàng đã đăng nhập
const studentRoutes: RouteObject[] = [
  { path: 'learning/:slug', element: <LearningPage /> },
  { path: 'profile', element: <ProfilePage /> }
]

// Admin
const adminRoutes: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'courses', element: <CourseIndex /> },
  { path: 'courses/create', element: <AddCoursePage /> },
  { path: 'courses/:courseId', element: <EditCoursePage /> },
  { path: 'courses/:courseId/sections/:sectionId/lessons/:lessonId', element: <EditLessonPage /> }
]

// Main router
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: publicRoutes
  },
  {
    path: '/learning/:slug',
    element: <LearningPage />
  },
  {
    path: '',
    element: (
      // <ProtectedRoute roles={['student', 'admin']}>
      <MainLayout />
      // </ProtectedRoute>
    ),
    children: studentRoutes
  },
  {
    path: 'admin',
    element: (
      // <ProtectedRoute roles={['admin']}>
      <AdminLayout />
      // </ProtectedRoute>
    ),
    children: adminRoutes
  },
  {
    path: '*',
    element: <NotFound />
  }
]

const router = createBrowserRouter(routes)
export default router
