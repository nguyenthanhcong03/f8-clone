import { BookOpen, FileText, Home } from 'lucide-react'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navigation: React.FC = () => {
  // Navigation items
  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Khóa học', path: '/courses', icon: BookOpen },
    { label: 'Bài viết', path: '/blogs', icon: FileText }
  ]

  return (
    <nav className='hidden items-center justify-center gap-2 md:flex'>
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path}>
          {({ isActive }) => (
            <div
              className={`group relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <item.icon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span>{item.label}</span>

              {/* Active - border-b */}
              <span
                className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navigation
