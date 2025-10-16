import Logo from '@/assets/images/logo.png'
import { fetchCourseBySlug } from '@/store/features/courses/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import LessonContent from './components/LessonContent'
import LessonSidebar from './components/LessonSidebar'

const LearningPage = () => {
  const dispatch = useAppDispatch()
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const { currentCourse } = useAppSelector((state) => state.courses)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (slug) {
      dispatch(fetchCourseBySlug(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (!params.get('lessonId') && currentCourse?.sections?.length && currentCourse?.sections[0].lessons?.length) {
      setParams({ lessonId: String(currentCourse.sections[0].lessons[0].lesson_id) })
    }
  }, [params, setParams])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className='flex h-screen flex-col'>
      {/* Header */}
      <header className='flex h-[50px] items-center justify-center border-b border-gray-200 bg-[#29303B] px-2 text-white'>
        {/* Logo */}
        <Link to='/' className='mx-2 h-[30px] w-[30px] overflow-hidden rounded'>
          <img src={Logo} alt='Logo' className='h-[30px] w-[30px]' />
        </Link>

        {/* Title */}
        <h1 className='flex-grow text-[14px] font-bold'>{currentCourse?.title || 'Khóa học'}</h1>

        {/* User Avatar */}
        <div className='mr-2 flex cursor-pointer items-center gap-2'>
          <img src='/path-to-avatar.jpg' alt='User avatar' className='h-8 w-8 rounded-full' />
        </div>
      </header>

      {/* Main Content */}
      <div className='relative flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <nav
          className={`h-full bg-white transition-all duration-300 ${mobileOpen ? 'absolute left-0 top-0 z-50 block w-full shadow-lg' : 'hidden'} lg:relative lg:block lg:w-[23%]`}
        >
          <LessonSidebar params={params} setParams={setParams} handleDrawerToggle={handleDrawerToggle} />
        </nav>

        {/* Overlay khi mở sidebar trên mobile */}
        {mobileOpen && <div onClick={handleDrawerToggle} className='fixed inset-0 z-40 bg-black/30 lg:hidden' />}

        {/* Lesson Content */}
        <main className='flex-1 overflow-auto'>
          <LessonContent handleDrawerToggle={handleDrawerToggle} />
        </main>
      </div>
    </div>
  )
}

export default LearningPage
