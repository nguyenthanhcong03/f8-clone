import { fetchCourseById } from '@/store/courseSlice'
import { checkEnrollment, enrollCourse } from '@/store/enrollmentSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { translateLevel } from '@/utils/courseUtils'
import DevicesIcon from '@mui/icons-material/Devices'
import SchoolIcon from '@mui/icons-material/School'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CourseContent from './components/CourseContent'

const CourseDetail = () => {
  const courseId = useParams().id
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentCourse, totalSections, totalLessons } = useAppSelector((state) => state.courses)
  const { loading, enrolled, checkingEnrollment } = useAppSelector((state) => state.enrollment)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const handleEnrollCourse = (courseId: number) => {
    dispatch(enrollCourse(courseId))
  }

  const handleNavigateToStudy = async (courseId: number) => {
    try {
      const result = await dispatch(checkEnrollment(courseId)).unwrap()
      const isEnrolled = result.enrolled

      if (isEnrolled) {
        navigate(`/learning/${courseId}`)
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || 'Bạn chưa đăng ký khóa học này!',
        severity: 'error'
      })
    }
  }

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(parseInt(courseId)))
    }

    if (courseId && isAuthenticated && user) {
      dispatch(checkEnrollment(parseInt(courseId)))
    }
  }, [dispatch, courseId, isAuthenticated, user])

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ overflow: 'auto' }} flex={4}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
          {currentCourse?.title || 'Thông tin khóa học'}
        </Typography>
        <Typography variant='body1' sx={{ mt: 1 }}>
          {currentCourse?.description || 'Không có mô tả.'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              Nội dung khóa học
            </Typography>
            <Box sx={{ mt: 1, fontSize: '14px', display: 'flex', gap: 1 }}>
              <Box>
                <Box component='span' sx={{ fontWeight: 500 }}>
                  {totalSections}{' '}
                </Box>
                chương
              </Box>
              •
              <Box>
                <Box component='span' sx={{ fontWeight: 500 }}>
                  {totalLessons}{' '}
                </Box>
                bài học
              </Box>
            </Box>
          </Box>
          <CourseContent />
        </Box>
      </Box>
      <Box
        flex={2}
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyItems: 'center',
          alignItems: 'center',
          gap: 2,
          height: 'fit-content',
          position: 'sticky',
          top: '90px'
        }}
      >
        {/* Thumbnail with video overlay */}
        <Box
          sx={{
            overflow: 'hidden'
          }}
        >
          <Box
            component='img'
            src={currentCourse?.thumbnail || '/path/to/default-thumbnail.jpg'}
            alt={currentCourse?.title}
            sx={{
              borderRadius: 2,

              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Price */}
        <Typography
          variant='h5'
          sx={{
            textAlign: 'center',
            color: 'primary.main'
          }}
        >
          {currentCourse?.is_paid === true ? `${(currentCourse?.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </Typography>

        {enrolled ? (
          <Button
            variant='contained'
            color='secondary'
            sx={{ width: 200 }}
            loading={checkingEnrollment}
            onClick={() => courseId && handleNavigateToStudy(parseInt(courseId))}
          >
            VÀO HỌC
          </Button>
        ) : (
          <Button
            variant='contained'
            color='secondary'
            sx={{ width: 200 }}
            loading={loading}
            onClick={() => courseId && handleEnrollCourse(parseInt(courseId))}
          >
            ĐĂNG KÝ HỌC
          </Button>
        )}

        {/* Course stats */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SignalCellularAltIcon sx={{ color: '#666', fontSize: 20 }} />
            <Typography variant='body2'>Trình độ {translateLevel(currentCourse?.level)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ color: '#666', fontSize: 20 }} />
            <Typography variant='body2'>Tổng số {totalLessons || 0} bài học</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DevicesIcon sx={{ color: '#666', fontSize: 20 }} />
            <Typography variant='body2'>Học mọi lúc, mọi nơi</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CourseDetail
