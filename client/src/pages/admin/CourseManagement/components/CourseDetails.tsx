import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import type { Course } from '@/types/course'

interface CourseDetailsProps {
  course: Course | null
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course }) => {
  if (!course) return null

  return (
    <Card variant='outlined' sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Thumbnail */}
          {course.thumbnail && (
            <Box sx={{ width: { xs: '100%', md: 280 }, height: { xs: 200, md: 170 } }}>
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </Box>
          )}

          {/* Course Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              {course.title}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
              {course.level && (
                <Chip
                  label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  color={
                    course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'primary' : 'secondary'
                  }
                  size='small'
                />
              )}

              <Chip
                label={course.is_paid ? `Paid - $${course.price}` : 'Free'}
                color={course.is_paid ? 'warning' : 'default'}
                size='small'
              />

              <Typography variant='body2' color='text.secondary'>
                Created: {new Date(course.createdAt || '').toLocaleDateString()}
              </Typography>
            </Box>

            <Typography variant='body1' sx={{ mb: 2 }}>
              {course.description || 'No description available'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CourseDetails
