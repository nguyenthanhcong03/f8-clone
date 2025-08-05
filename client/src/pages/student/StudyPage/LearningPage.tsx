import Logo from '@/assets/images/logo.png'
import { fetchCourseById } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AppBar, Avatar, Box, CssBaseline, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import LessonArea from './components/LessonArea'
import SidebarLesson from './components/SidebarLesson'

const LearningPage = () => {
  const dispatch = useAppDispatch()
  const { courseId } = useParams()
  const [params, setParams] = useSearchParams()
  const { currentCourse } = useAppSelector((state) => state.courses)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(parseInt(courseId)))
      if (
        !params.get('lessonId') &&
        currentCourse?.sections &&
        currentCourse?.sections.length > 0 &&
        currentCourse?.sections[0].lessons &&
        currentCourse?.sections[0].lessons.length > 0
      ) {
        setParams({ lessonId: String(currentCourse?.sections[0].lessons[0].id) })
      }
    }
  }, [dispatch, courseId])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />

      {/* Header */}
      <AppBar
        position='static'
        color='default'
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#29303B',
            color: '#fff',
            height: 50
          }}
        >
          <IconButton
            component={Link}
            disableRipple
            color='inherit'
            to={`/courses/${courseId}`}
            edge='end'
            sx={{ width: 65, height: 50, borderRadius: 0, '&:hover': { bgcolor: '#252B35' } }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box component={Link} to={'/'} sx={{ borderRadius: 2, width: 30, height: 30, overflow: 'hidden', mx: 2 }}>
            <img src={Logo} alt='Logo' width={30} height={30} />
          </Box>

          <Typography variant='h6' component='div' sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: 14 }}>
            {currentCourse?.title || 'Khóa học'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2, cursor: 'pointer' }}>
            <Avatar alt='User avatar' src='/path-to-avatar.jpg' sx={{ width: 32, height: 32 }} />
          </Box>
        </Box>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Mobile Drawer Toggle */}
        <Box
          component='nav'
          sx={{
            width: { xs: '100%', md: '40%', lg: '23%' },
            bgcolor: '#fff',
            boxShadow: mobileOpen ? 1 : 0,
            flexShrink: { sm: 0 },
            display: { xs: mobileOpen ? 'block' : 'none', lg: 'block' },
            height: '100%',
            position: { xs: 'absolute', lg: 'relative' },
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1200
          }}
        >
          <SidebarLesson params={params} setParams={setParams} handleDrawerToggle={handleDrawerToggle} />
        </Box>
        {/* Overlay */}
        {mobileOpen && (
          <Box
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: 'block', lg: 'none' },
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1100
            }}
          />
        )}

        {/* Lesson Content */}
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            height: '100%',
            overflow: 'auto'
          }}
        >
          <LessonArea handleDrawerToggle={handleDrawerToggle} />
        </Box>
      </Box>
    </Box>
  )
}

export default LearningPage
