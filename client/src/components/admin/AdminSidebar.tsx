import { BookOpen, Menu, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// Menu items
const SIDEBAR_ITEMS = [
  { name: 'Tạo khóa học', icon: PlusCircle, href: '/admin/courses/add' },
  { name: 'Khóa học', icon: BookOpen, href: '/admin/courses' }
]

const AdminSidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={cn(
        'h-screen bg-background border-r border-border overflow-hidden transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-80'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center py-4 border-b border-border',
          isCollapsed ? 'justify-center px-2' : 'justify-between px-6'
        )}
      >
        {!isCollapsed && (
          <div className='flex items-center gap-3'>
            <img src='/src/assets/images/logo.png' alt='Logo' className='h-10 rounded-lg' />
            <h2 className='text-lg font-semibold whitespace-nowrap'>F8 Admin</h2>
          </div>
        )}
        <Button variant='ghost' size='sm' onClick={handleToggle} className='h-8 w-8 p-0'>
          <Menu className='h-4 w-4' />
        </Button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4'>
        <ul className='space-y-2'>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-lg transition-colors duration-200',
                    isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn('flex-shrink-0', isCollapsed ? 'h-5 w-5' : 'h-5 w-5')} />
                  {!isCollapsed && <span className='font-medium whitespace-nowrap'>{item.name}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default AdminSidebar
