import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className='flex flex-1 flex-col'>
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main className='flex-1 overflow-hidden overflow-y-auto bg-gray-50 bg-muted/20'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
