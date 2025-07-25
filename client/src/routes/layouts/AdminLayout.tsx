import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-white text-primaryColor'>
      <Outlet />
    </div>
  )
}

export default AdminLayout
