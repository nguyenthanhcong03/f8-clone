import BlogCard from '@/pages/client/components/BlogCard/BlogCard'
import { Loading } from '@/components/common/loading/Loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useGetPublicProfileByUsernameQuery } from '@/services/api/authApi'
import { useAppSelector } from '@/store/hook'
import { BookOpen, CalendarDays, GraduationCap, PlayCircle, Star, Users } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type TabType = 'blogs' | 'courses'

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const isMe: boolean = currentUser?.username === username
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('blogs')

  // Fetch user data by username
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser
  } = useGetPublicProfileByUsernameQuery(username || '', { skip: !username })

  const user = userData?.data

  const handleNavigateToBlog = (slug: string) => {
    navigate(`/blogs/${slug}`)
  }

  const handleNavigateToCourse = (slug: string) => {
    navigate(`/courses/${slug}`)
  }

  if (isLoadingUser) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading message='Đang tải thông tin...' />
      </div>
    )
  }

  if (isErrorUser || !user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Không tìm thấy người dùng</h2>
          <p className='mt-2 text-gray-600'>Username này không tồn tại</p>
          <Button className='mt-4' onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white py-8'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Left Sidebar - User Profile */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              {/* Profile Card */}
              <Card className='border-0 shadow-sm'>
                <CardContent className='p-6'>
                  <div className='flex flex-col items-center space-y-4'>
                    {/* Avatar */}
                    <Avatar className='h-32 w-32 border-4 border-gray-100'>
                      <AvatarImage src={user?.avatar} alt={user?.fullName} />
                      <AvatarFallback className='text-2xl'>{user?.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    {/* Name & Username */}
                    <div className='text-center'>
                      <h1 className='text-xl font-bold text-gray-900'>{user?.fullName}</h1>
                      <p className='text-sm text-gray-500'>@{user?.username}</p>
                    </div>

                    {/* Follow Button - Only show if not viewing own profile */}
                    {!isMe && (
                      <Button variant='outline' className='w-full'>
                        <Users className='mr-2 h-4 w-4' />
                        Theo dõi
                      </Button>
                    )}

                    {/* Edit Profile Button - Only show if viewing own profile */}
                    {isMe && (
                      <Button
                        variant='default'
                        className='w-full'
                        onClick={() => navigate(ROUTES.STUDENT.PROFILE.EDIT)}
                      >
                        Chỉnh sửa hồ sơ
                      </Button>
                    )}

                    {/* Stats */}
                    <div className='flex w-full items-center justify-center gap-2 text-sm text-gray-600'>
                      <span>
                        <strong className='text-gray-900'>0</strong> người theo dõi
                      </span>
                      <span>•</span>
                      <span>
                        <strong className='text-gray-900'>0</strong> đang theo dõi
                      </span>
                    </div>

                    {/* Join Date */}
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <CalendarDays className='h-4 w-4' />
                      <span>Thành viên F8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Tabs */}
          <div className='lg:col-span-3'>
            {/* Tabs */}
            <div className='mb-6 flex gap-2 border-b'>
              <button
                onClick={() => setActiveTab('blogs')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'blogs'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                📝 Bài viết ({user.blogs.length})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'courses'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                🎓 Khóa học ({user.enrolledCourses.length})
              </button>
            </div>

            {/* Blog Tab Content */}
            {activeTab === 'blogs' && (
              <>
                {user.blogs.length === 0 ? (
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-12 text-center'>
                    <BookOpen className='mx-auto h-16 w-16 text-gray-400' />
                    <h3 className='mt-4 text-lg font-semibold text-gray-900'>Chưa có bài viết nào</h3>
                    <p className='mt-2 text-gray-600'>
                      {isMe
                        ? 'Bạn chưa có bài viết nào. Hãy bắt đầu viết bài đầu tiên!'
                        : 'Người dùng này chưa xuất bản bài viết nào.'}
                    </p>
                    {isMe && (
                      <Button className='mt-4' onClick={() => navigate('/blogs/create')}>
                        Viết bài mới
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Blog Grid */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
                      {user.blogs.map((blog) => (
                        <BlogCard key={blog.blogId} blog={blog} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Courses Tab Content */}
            {activeTab === 'courses' && (
              <>
                {user.enrolledCourses.length === 0 ? (
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-12 text-center'>
                    <GraduationCap className='mx-auto h-16 w-16 text-gray-400' />
                    <h3 className='mt-4 text-lg font-semibold text-gray-900'>Chưa đăng ký khóa học nào</h3>
                    <p className='mt-2 text-gray-600'>
                      {isMe
                        ? 'Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học!'
                        : 'Người dùng này chưa đăng ký khóa học nào.'}
                    </p>
                    {isMe && (
                      <Button className='mt-4' onClick={() => navigate('/courses')}>
                        Khám phá khóa học
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
                    {user.enrolledCourses.map((enrollment: any) => {
                      const course = enrollment.course
                      if (!course) return null

                      return (
                        <Card
                          key={course.courseId}
                          className='group cursor-pointer overflow-hidden border-0 bg-[#F7F7F7] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md'
                          onClick={() => handleNavigateToCourse(course.slug)}
                        >
                          {/* Thumbnail */}
                          <div className='relative overflow-hidden'>
                            <img
                              src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                              alt={course.title}
                              className='h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-105'
                            />
                            <div className='absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                            {/* Badge */}
                            <div className='absolute left-3 top-3'>
                              {!course.isPaid ? (
                                <Badge className='bg-green-500 text-white hover:bg-green-600'>Miễn phí</Badge>
                              ) : (
                                <Badge className='bg-yellow-400 text-yellow-900 hover:bg-yellow-400'>
                                  {course.level === 'beginner'
                                    ? 'Cơ bản'
                                    : course.level === 'intermediate'
                                      ? 'Trung cấp'
                                      : 'Nâng cao'}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <CardContent className='p-5'>
                            {/* Title */}
                            <h3 className='mb-3 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-primary'>
                              {course.title}
                            </h3>

                            {/* Price */}
                            <div className='mb-3'>
                              {course.isPaid && course.price ? (
                                <span className='text-lg font-bold text-primary'>
                                  {course.price.toLocaleString('vi-VN')}₫
                                </span>
                              ) : (
                                <span className='text-lg font-bold text-green-600'>Miễn phí</span>
                              )}
                            </div>

                            {/* Stats */}
                            <div className='flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600'>
                              <div className='flex items-center gap-1'>
                                <Users className='h-4 w-4' />
                                <span>{course.enrollmentCount || 0}</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <PlayCircle className='h-4 w-4' />
                                <span>Khóa học</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                                <span className='font-medium'>5.0</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage
