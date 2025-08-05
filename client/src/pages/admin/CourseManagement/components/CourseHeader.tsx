import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

interface CourseHeaderProps {
  navigateBack: () => void
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ navigateBack }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={navigateBack} variant='outlined'>
          Trở về danh sách khóa học
        </Button>
        <Typography variant='h4' component='h1'>
          Thông tin khóa học
        </Typography>
      </Box>
    </Box>
  )
}

export default CourseHeader
