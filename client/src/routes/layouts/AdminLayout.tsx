import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='flex w-full h-screen'>
      <AdminSidebar />
      <main className='flex-1 flex flex-col'>
        <AdminHeader />
        <div className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
