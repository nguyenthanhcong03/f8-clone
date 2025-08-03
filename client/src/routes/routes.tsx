import NotFound from '@/components/ui/auth/NotFound/NotFound'
import AddCourse from '@/pages/admin/CourseManagement/AddCourse'
import CourseIndex from '@/pages/admin/CourseManagement/CourseIndex'
import CourseInfo from '@/pages/admin/CourseManagement/CourseInfo'
import LessonForm from '@/pages/admin/CourseManagement/LessonForm'
import CourseDetail from '@/pages/public/CourseDetail/CourseDetail'
import CoursePage from '@/pages/public/CoursePage/CoursePage'
import HomePage from '@/pages/public/HomePage/HomePage'
import LearningPage from '@/pages/student/StudyPage/LearningPage'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import ProtectedRoute from './guards/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'

const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'courses', element: <CoursePage /> },
  { path: 'courses/:id', element: <CourseDetail /> }
]

// Khách hàng đã đăng nhập
// const customerProtectedRoutes: RouteObject[] = [{ path: 'learning/:courseId', element: <StudyPage /> }]

// Admin
const adminRoutes: RouteObject[] = [
  { path: 'courses', element: <CourseIndex /> },
  { path: 'courses/add', element: <AddCourse /> },
  { path: 'courses/:id', element: <CourseInfo /> },
  { path: 'courses/:courseId/sections/:sectionId/lessons/add', element: <LessonForm /> },
  { path: 'courses/:courseId/sections/:sectionId/lessons/:lessonId', element: <LessonForm /> }
]

// Main router configuration
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [...publicRoutes]
  },
  {
    path: '/learning/:courseId',
    element: <LearningPage />,
    errorElement: <NotFound />
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
