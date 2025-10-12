import Logo from '@/assets/images/logo.png'
import { fetchCourseById } from '@/store/features/courses/courseSlice'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import LessonContent from './components/LessonContent'
import LessonSidebar from './components/LessonSidebar'
import { ArrowLeft } from 'lucide-react' // thay thế MUI Icon
import { useAppDispatch, useAppSelector } from '@/store/hook'

const LearningPage = () => {
  const dispatch = useAppDispatch()
  const { courseId } = useParams()
  const [params, setParams] = useSearchParams()
  const { currentCourse } = useAppSelector((state) => state.courses)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(parseInt(courseId)))
      if (!params.get('lessonId') && currentCourse?.sections?.length && currentCourse?.sections[0].lessons?.length) {
        setParams({ lessonId: String(currentCourse.sections[0].lessons[0].id) })
      }
    }
  }, [dispatch, courseId])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <header className='border-b border-gray-200'>
        <div className='flex items-center justify-center bg-[#29303B] text-white h-[50px]'>
          {/* Back Button */}
          <Link to={`/${courseId}`} className='flex items-center justify-center w-[65px] h-[50px] hover:bg-[#252B35]'>
            <ArrowLeft className='w-5 h-5' />
          </Link>

          {/* Logo */}
          <Link to='/' className='mx-2 w-[30px] h-[30px] rounded overflow-hidden'>
            <img src={Logo} alt='Logo' className='w-[30px] h-[30px]' />
          </Link>

          {/* Title */}
          <h1 className='flex-grow font-bold text-[14px]'>{currentCourse?.title || 'Khóa học'}</h1>

          {/* User Avatar */}
          <div className='flex items-center gap-2 mr-2 cursor-pointer'>
            <img src='/path-to-avatar.jpg' alt='User avatar' className='w-8 h-8 rounded-full' />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden relative'>
        {/* Sidebar */}
        <nav
          className={`bg-white h-full transition-all duration-300 
            ${mobileOpen ? 'block absolute top-0 left-0 z-50 w-full shadow-lg' : 'hidden'} 
            lg:block lg:relative lg:w-[23%]`}
        >
          <LessonSidebar params={params} setParams={setParams} handleDrawerToggle={handleDrawerToggle} />
        </nav>

        {/* Overlay khi mở sidebar trên mobile */}
        {mobileOpen && <div onClick={handleDrawerToggle} className='fixed inset-0 bg-black/30 z-40 lg:hidden' />}

        {/* Lesson Content */}
        <main className='flex-1 overflow-auto'>
          <LessonContent handleDrawerToggle={handleDrawerToggle} />
        </main>
      </div>
    </div>
  )
}

export default LearningPage
