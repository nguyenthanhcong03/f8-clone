import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchLessonById } from '@/store/lessonSlice'
import { Menu } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import { Box, Button, CircularProgress, IconButton, Paper, Typography } from '@mui/material'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom'

const LessonArea = ({ handleDrawerToggle }: { handleDrawerToggle?: () => void }) => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const { currentLesson, lessonLoading } = useAppSelector((state) => state.lessons)
  const { currentCourse } = useAppSelector((state) => state.courses)

  const previousLessonId = currentLesson?.previousLessonId
  const nextLessonId = currentLesson?.nextLessonId

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(parseInt(lessonId)))
    }
  }, [dispatch, lessonId])

  // Get section title
  const getSectionTitle = () => {
    if (!currentLesson) return ''
    const section =
      currentCourse?.sections && currentCourse.sections.find((section) => section.id === currentLesson.section_id)
    return section?.title || ''
  }

  const navigateToLesson = (lessonId: number) => {
    if (lessonId) {
      setSearchParams({ lessonId: String(lessonId) })
    }
  }

  if (lessonLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentLesson && !lessonLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          p: 3
        }}
      >
        <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
          Chọn bài học từ danh sách để bắt đầu
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 400, textAlign: 'center' }}>
          Hãy chọn một bài học từ menu bên trái để xem nội dung
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Lesson header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          {getSectionTitle()}
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          {currentLesson?.title}
        </Typography>
      </Box>

      {/* Lesson content */}
      <Box
        sx={{
          p: 3,
          overflow: 'auto',
          flex: 1,
          bgcolor: 'background.default'
        }}
      >
        {currentLesson?.video_url ? (
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              width: '100%',
              maxWidth: '100%',
              mb: 3,
              overflow: 'hidden',
              borderRadius: 1
            }}
          >
            <iframe
              src={currentLesson.video_url}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </Box>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              flexDirection: 'column'
            }}
          >
            <PlayCircleFilledIcon sx={{ fontSize: 60, opacity: 0.7 }} />
            <Typography variant='body1' sx={{ mt: 2 }}>
              Video không khả dụng
            </Typography>
          </Box>
        )}

        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          {currentLesson?.content ? (
            <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
          ) : (
            <Typography variant='body1'>Không có nội dung cho bài học này.</Typography>
          )}
        </Paper>
      </Box>

      {/* Lesson navigation */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Mobile Drawer Toggle Button */}

        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              border: '1px solid'
            }}
          >
            <Menu fontSize='small' />
          </IconButton>
          <Typography sx={{ fontWeight: 'bold', fontSize: 14, width: 'max-content' }}>
            {currentLesson?.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: { xs: 'end', lg: 'space-between' } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            disabled={!previousLessonId}
            onClick={() => navigateToLesson(previousLessonId)}
            variant='outlined'
          >
            Bài trước
          </Button>

          <Button
            endIcon={<ArrowForwardIcon />}
            disabled={!nextLessonId}
            onClick={() => navigateToLesson(nextLessonId)}
            variant='contained'
          >
            Bài tiếp theo
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default LessonArea
