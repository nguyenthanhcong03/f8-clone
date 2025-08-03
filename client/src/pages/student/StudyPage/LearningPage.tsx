import { fetchCourseById } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreIcon from '@mui/icons-material/MoreVert'
import { AppBar, Avatar, Box, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(parseInt(courseId)))
    }
  }, [dispatch, courseId])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
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

          <Box
            component='img'
            src='/src/assets/images/logo.png'
            alt='Logo'
            sx={{ height: 30, borderRadius: 2, mx: 2 }}
          />

          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: 14, display: { xs: 'none', sm: 'block' } }}
          >
            {currentCourse?.title || 'Khóa học'}
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Avatar alt='User avatar' src='/path-to-avatar.jpg' sx={{ width: 32, height: 32 }} />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleMenuOpen} color='inherit'>
              <MoreIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Hồ sơ cá nhân</MenuItem>
              <MenuItem onClick={handleMenuClose}>Đăng xuất</MenuItem>
            </Menu>
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
