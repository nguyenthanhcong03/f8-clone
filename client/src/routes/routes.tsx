import NotFound from '@/components/auth/not-found/NotFound'
import BlogCategoryManagementPage from '@/pages/admin/BlogCategoryManagement/BlogCategoryManagementPage'
import { CreateCategoryPage, EditCategoryPage } from '@/pages/admin/BlogCategoryManagement/pages'
import BlogManagementPage from '@/pages/admin/BlogManagement/BlogManagementPage'
import ViewBlogPage from '@/pages/admin/BlogManagement/pages/ViewBlogPage'
import CourseManagementPage from '@/pages/admin/CourseManagement/CourseManagementPage'
import CreateCoursePage from '@/pages/admin/CourseManagement/pages/AddCoursePage/CreateCoursePage'
import EditCoursePage from '@/pages/admin/CourseManagement/pages/EditCoursePage/EditCoursePage'
import EditCourseStructurePage from '@/pages/admin/CourseManagement/pages/EditCourseStructure/EditCourseStructure'
import EditLessonPage from '@/pages/admin/CourseManagement/pages/EditLessonPage/EditLessonPage'
import DashboardPage from '@/pages/admin/Dashboard/DashboardPage'
import UserManagementPage from '@/pages/admin/UserManagement/UserManagementPage'
import BlogByTopicPage from '@/pages/client/BlogByTopicPage/BlogByTopicPage'
import BlogDetailPage from '@/pages/client/BlogDetailPage/BlogDetailPage'
import BlogPage from '@/pages/client/BlogPage/BlogPage'
import CourseDetail from '@/pages/client/CourseDetailPage/CourseDetailPage'
import HomePage from '@/pages/client/HomePage/HomePage'
import PublicProfilePage from '@/pages/client/PublicProfilePage/PublicProfilePage'
import CreateBlogPage from '@/pages/client/CreateBlogPage/CreateBlogPage'
import EditBlogPage from '@/pages/client/EditBlogPage/EditBlogPage'
import EditProfilePage from '@/pages/client/EditProfilePage/EditProfilePage'
import LearningPage from '@/pages/client/LearningPage/LearningPage'
import LikedBlogsPage from '@/pages/client/LikedBlogsPage/LikedBlogsPage'
import MyCoursesPage from '@/pages/client/MyCoursesPage/MyCoursesPage'
import MyPostsPage from '@/pages/client/MyPostsPage/MyPostsPage'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'

const publicRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'courses', element: <HomePage /> },
  { path: 'courses/:slug', element: <CourseDetail /> },
  { path: 'blogs', element: <BlogPage /> },
  { path: 'blogs/:slug', element: <BlogDetailPage /> },
  { path: 'blogs/topic/:topicSlug', element: <BlogByTopicPage /> },
  { path: ':username', element: <PublicProfilePage /> }
]

// Khách hàng đã đăng nhập
const studentRoutes: RouteObject[] = [
  { path: 'learning/:slug', element: <LearningPage /> },
  { path: 'liked-blogs', element: <LikedBlogsPage /> },
  { path: 'my-courses', element: <MyCoursesPage /> },
  { path: 'my-posts', element: <MyPostsPage /> },
  { path: 'blog/create', element: <CreateBlogPage /> },
  { path: 'blog/:slug/edit', element: <EditBlogPage /> },
  { path: 'profile/edit', element: <EditProfilePage /> }
]

// Admin
const adminRoutes: RouteObject[] = [
  { path: 'dashboard', element: <DashboardPage /> },
  {
    path: 'courses',
    children: [
      { index: true, element: <CourseManagementPage /> },
      { path: 'create', element: <CreateCoursePage /> },
      { path: ':courseId', element: <EditCoursePage /> },
      { path: 'edit-structure/:courseId', element: <EditCourseStructurePage /> },
      { path: ':courseId/sections/:sectionId/lessons/:lessonId', element: <EditLessonPage /> }
    ]
  },

  {
    path: 'blogs',
    children: [
      { index: true, element: <BlogManagementPage /> },
      { path: 'view/:blogId', element: <ViewBlogPage /> }
    ]
  },

  {
    path: 'blog-categories',
    children: [
      { index: true, element: <BlogCategoryManagementPage /> },
      { path: 'create', element: <CreateCategoryPage /> },
      { path: 'edit/:categoryId', element: <EditCategoryPage /> }
    ]
  },
  {
    path: 'users',
    children: [
      { index: true, element: <UserManagementPage /> },
      { path: 'create', element: <CreateBlogPage /> },
      { path: ':blogId', element: <EditBlogPage /> },
      { path: 'view/:blogId', element: <ViewBlogPage /> }
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
