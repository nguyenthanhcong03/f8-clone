import AdminHeader from '@/layouts/AdminLayout/components/AdminHeader'
import AdminSidebar from '@/layouts/AdminLayout/components/AdminSidebar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Main content area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Page content with scroll */}
        <main className='flex-1 overflow-y-auto bg-muted/20 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
