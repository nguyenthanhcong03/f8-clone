import NotFound from '@/components/auth/not-found/NotFound'
import BlogCategoryIndex from '@/pages/admin/BlogCategoryManagement/BlogCategoryIndex'
import { CreateCategoryPage, EditCategoryPage } from '@/pages/admin/BlogCategoryManagement/pages'
import BlogIndex from '@/pages/admin/BlogManagement/BlogIndex'
import { CreateBlogPage, EditBlogPage, ViewBlogPage } from '@/pages/admin/BlogManagement/pages'
import CourseIndex from '@/pages/admin/CourseManagement/CourseIndex'
import CreateCoursePage from '@/pages/admin/CourseManagement/pages/AddCoursePage/CreateCoursePage'
import EditCoursePage from '@/pages/admin/CourseManagement/pages/EditCoursePage/EditCoursePage'
import EditCourseStructurePage from '@/pages/admin/CourseManagement/pages/EditCourseStructure/EditCourseStructure'
import EditLessonPage from '@/pages/admin/CourseManagement/pages/EditLessonPage/EditLessonPage'
import DashboardPage from '@/pages/admin/DashboardPage/DashboardPage'
import BlogDetailPage from '@/pages/public/BlogPage/BlogDetailPage'
import BlogPage from '@/pages/public/BlogPage/BlogPage'
import CourseDetail from '@/pages/public/CourseDetail/CourseDetail'
import HomePage from '@/pages/public/HomePage/HomePage'
import RoadMapPage from '@/pages/public/RoadMapPage/RoadMapPage'
import LearningPage from '@/pages/student/LearningPage/LearningPage'
import LikedBlogsPage from '@/pages/student/LikedBlogsPage/LikedBlogsPage'
import MyCoursesPage from '@/pages/student/MyCoursesPage/MyCoursesPage'
import ProfilePage from '@/pages/student/ProfilePage/ProfilePage'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../components/auth/protected-route/ProtectedRoute'
import AdminLayout from '../layouts/AdminLayout'
import MainLayout from '../layouts/MainLayout'

const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'courses', element: <HomePage /> },
  { path: 'courses/:slug', element: <CourseDetail /> },
  { path: 'roadmap', element: <RoadMapPage /> },
  { path: 'blogs', element: <BlogPage /> },
  { path: 'blogs/:slug', element: <BlogDetailPage /> }
]

// Khách hàng đã đăng nhập
const studentRoutes: RouteObject[] = [
  { path: 'learning/:slug', element: <LearningPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'liked-blogs', element: <LikedBlogsPage /> },
  { path: 'my-courses', element: <MyCoursesPage /> }
]

// Admin
const adminRoutes: RouteObject[] = [
  { path: 'dashboard', element: <DashboardPage /> },
  {
    path: 'courses',
    children: [
      { index: true, element: <CourseIndex /> },
      { path: 'create', element: <CreateCoursePage /> },
      { path: ':courseId', element: <EditCoursePage /> },
      { path: 'edit-structure/:courseId', element: <EditCourseStructurePage /> },
      { path: ':courseId/sections/:sectionId/lessons/:lessonId', element: <EditLessonPage /> }
    ]
  },

  {
    path: 'blogs',
    children: [
      { index: true, element: <BlogIndex /> },
      { path: 'create', element: <CreateBlogPage /> },
      { path: ':blogId', element: <EditBlogPage /> },
      { path: 'view/:blogId', element: <ViewBlogPage /> }
    ]
  },

  {
    path: 'blog-categories',
    children: [
      { index: true, element: <BlogCategoryIndex /> },
      { path: 'create', element: <CreateCategoryPage /> },
      { path: 'edit/:categoryId', element: <EditCategoryPage /> }
    ]
  }
]

// Main router
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: publicRoutes
  },
  {
    path: '',
    element: (
      <ProtectedRoute roles={['student', 'admin']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: studentRoutes
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
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
