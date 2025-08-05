import Loader from '@/components/common/Loading/Loader'
import { fetchCourses } from '@/store/courseSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdSlider from './components/AdSlider'
import CourseCard from './components/CourseCard'

const CoursePage = () => {
  const { courses, loading, error } = useAppSelector((state) => state.courses)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleNavigateToCourseDetail = (courseId: string) => {
    navigate(`/courses/${courseId}`)
  }

  useEffect(() => {
    const getCourses = async () => {
      await dispatch(fetchCourses())
    }

    getCourses()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <AdSlider />
      <Box>
        <Grid container spacing={2} sx={{ padding: '20px' }}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default CoursePage
