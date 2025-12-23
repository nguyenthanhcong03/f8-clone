import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { BookOpen, FolderTree, LayoutDashboard, ListChecks, Menu, Newspaper, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// Menu item type
type MenuItem = {
  name: string
  icon: React.ElementType
  href?: string
  children?: MenuItem[]
}

// Menu items with modular structure
const SIDEBAR_ITEMS: MenuItem[] = [
  {
    name: 'Tổng quan',
    icon: LayoutDashboard,
    href: '/admin/dashboard'
  },
  // {
  //   name: 'Khóa học',
  //   icon: BookOpen,
  //   href: '/admin/courses'
  // },
  {
    name: 'Bài viết',
    icon: Newspaper,
    children: [
      { name: 'Danh sách bài viết', icon: ListChecks, href: '/admin/blogs' },
      { name: 'Thể loại', icon: FolderTree, href: '/admin/blog-categories' }
    ]
  },
  {
    name: 'Người dùng',
    icon: Users,
    href: '/admin/users'
  },
  {
    name: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings'
  }
]

type AdminSidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 1024px)')

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && <div className='fixed inset-0 z-40 bg-black/50' onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'z-50 h-screen overflow-y-auto border-r border-border bg-background transition-all duration-300 ease-in-out',
          isMobile ? (isOpen ? 'fixed left-0 top-0 w-72' : 'static w-20') : isOpen ? 'w-72' : 'w-20'
        )}
      >
        {/* Header */}
        <div className='flex h-16 items-center justify-center border-b border-border'>
          {isOpen ? (
            <div className='flex items-center gap-3'>
              <img src='/src/assets/images/logo.png' alt='Logo' className='h-10 rounded-lg' />
              <h2 className='whitespace-nowrap text-lg font-semibold'>ADMIN</h2>
            </div>
          ) : (
            <img src='/src/assets/images/logo.png' alt='Logo' className='h-10 rounded-lg' />
          )}
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4'>
          <ul className='space-y-2'>
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon

              // Menun item với các mục con
              if (item && item.children) {
                const hasActiveChild = item.children.some((child) => isActive(child.href!))

                if (!isOpen) {
                  // Khi sidebar thu gọn, chỉ hiển thị icon
                  return (
                    <li key={item.name}>
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-lg p-3 transition-colors duration-200',
                          hasActiveChild
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                        title={item.name}
                      >
                        <Icon className='h-5 w-5 flex-shrink-0' />
                      </div>
                    </li>
                  )
                }

                return (
                  <li key={item.name}>
                    <Accordion type='single' collapsible defaultValue={hasActiveChild ? item.name : undefined}>
                      <AccordionItem value={item.name} className='border-none'>
                        <AccordionTrigger
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 hover:no-underline',
                            hasActiveChild
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <Icon className='h-5 w-5 flex-shrink-0' />
                            <span className='whitespace-nowrap font-medium'>{item.name}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='pb-0 pt-2'>
                          <ul className='space-y-1'>
                            {item.children.map((child) => {
                              const ChildIcon = child.icon
                              const active = isActive(child.href!)

                              return (
                                <li key={child.href}>
                                  <NavLink
                                    to={child.href!}
                                    className={cn(
                                      'ml-8 flex items-center gap-3 rounded-lg px-4 py-2 transition-colors duration-200',
                                      active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    )}
                                  >
                                    <ChildIcon className='h-4 w-4 flex-shrink-0' />
                                    <span className='whitespace-nowrap text-sm font-medium'>{child.name}</span>
                                  </NavLink>
                                </li>
                              )
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                )
              }

              // Menu item bình thường
              const active = isActive(item.href!)
              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href!}
                    className={cn(
                      'flex items-center rounded-lg transition-colors duration-200',
                      !isOpen ? 'justify-center p-3' : 'gap-3 px-4 py-3',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    title={!isOpen ? item.name : undefined}
                  >
                    <Icon className='h-5 w-5 flex-shrink-0' />
                    {isOpen && <span className='whitespace-nowrap font-medium'>{item.name}</span>}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default AdminSidebar
