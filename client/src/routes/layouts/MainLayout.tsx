import Header from '@/components/common/Header/Header'
import { Box, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Box sx={{ padding: '20px', minHeight: 'calc(100vh - 64px)', bgcolor: '#fff' }}>
        <Outlet />
      </Box>
    </div>
  )
}

export default MainLayout
