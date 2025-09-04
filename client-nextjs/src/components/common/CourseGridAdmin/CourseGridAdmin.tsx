import { useAppSelector } from '@/store/hook'
import { Grid } from '@mui/material'
import CourseCard from '../CourseCard/CourseCard'

const CourseGrid = () => {
  const { courses, loading, error } = useAppSelector((state) => state.courses)
  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      {courses && courses.length > 0 && courses.map((course) => <CourseCard key={course.id} course={course} />)}
    </Grid>
  )
}

export default CourseGrid
