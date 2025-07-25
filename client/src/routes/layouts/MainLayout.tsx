import Header from '@/components/common/Header/Header'
import { Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default MainLayout
