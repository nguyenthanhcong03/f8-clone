import { fetchCourses } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect } from 'react'
import AdSlider from './components/AdSlider'
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const CoursePage = () => {
  const { courses, loading, error } = useAppSelector((state) => state.courses)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleNavigateToCourseDetail = (courseId: string) => {
    navigate(`/courses/${courseId}`)
  }

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <AdSlider />
      <Box>
        <Grid container spacing={2} sx={{ padding: '20px' }}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
              <Card
                sx={{ borderRadius: 3, cursor: 'pointer' }}
                onClick={() => handleNavigateToCourseDetail(course.id.toString())}
              >
                <CardMedia component='img' height='180' image={course.thumbnail} alt={course.title} />
                <CardContent>
                  <Typography variant='h6'>{course.title}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {course.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default CoursePage
