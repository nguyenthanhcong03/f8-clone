import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import GroupsIcon from '@mui/icons-material/Groups'

interface CourseCardProps {
  course: {
    id: number
    title: string
    thumbnail: string
    enrollment_count?: number
    is_paid?: boolean
    price?: number
  }
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isDetailPage = location.pathname.includes(`/${course.id}`)
  const isAdminPage = location.pathname.includes('/admin')

  const handleNavigate = () => {
    if (!isDetailPage) {
      navigate(`/${course.id}`)
    }
    if (isAdminPage) {
      navigate(`/admin/courses/${course.id}`)
    }
  }

  return (
    <Card
      variant='outlined'
      sx={{ borderRadius: 3, bgcolor: '#F7F7F7', cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
      elevation={0}
      onClick={handleNavigate}
    >
      <CardMedia component='img' height='180' image={course.thumbnail} alt={course.title} />
      <CardContent sx={{ pb: '16px !important' }}>
        <Typography variant='h6' fontSize={16}>
          {course.title}
        </Typography>
        <Typography variant='body2' color='primary' fontWeight={600} sx={{ mt: 1 }}>
          {course.is_paid ? `${(course.price || 0).toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: '#666' }}>
            <GroupsIcon />
            {course.enrollment_count?.toLocaleString() || 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CourseCard
