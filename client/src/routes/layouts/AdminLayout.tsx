import AdminHeader from '@/components/common/Header/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <Box component='main' sx={{ flexGrow: 1 }}>
        <AdminHeader />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
