import Logo from '@/assets/images/logo.png'
import ModalAuth from '@/components/auth/auth-modal/AuthModal'
import ThemeToggle from '@/components/common/theme-toggle/ThemeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useLogoutMutation } from '@/services/api/authApi'
import { useAppSelector } from '@/store/hook'
import { Bell, BookOpen, Briefcase, FileText, Home, LogOut, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const Header = () => {
  const location = useLocation()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [logout] = useLogoutMutation()

  const [openModalAuth, setOpenModalAuth] = useState(false)
  const [typeModalAuth, setTypeModalAuth] = useState<'login' | 'register'>('login')

  // Ngăn giao diện bị nhảy khi dropdown mở
  useEffect(() => {
    // Tính toán và đặt scrollbar width để tránh layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
  }, [])

  const handleOpenModalAuth = (type: 'register' | 'login') => {
    setTypeModalAuth(type)
    setOpenModalAuth(true)
  }
  const handleCloseModalAuth = () => setOpenModalAuth(false)

  const handleLogout = async () => {
    try {
      await logout({}).unwrap()
      toast.success('Đăng xuất thành công')
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error)
    }
  }

  // Navigation items
  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Khóa học', path: '/courses', icon: BookOpen },
    { label: 'Bài viết', path: '/blogs', icon: FileText }
  ]

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className='fixed left-0 right-0 top-0 z-50 border-b bg-background shadow-sm'>
      <div className='mx-auto flex h-16 items-center justify-between px-6'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-3 transition-opacity hover:opacity-80'>
          <div className='h-10 w-10 overflow-hidden rounded-lg'>
            <img src={Logo} alt='Logo' width={40} height={40} />
          </div>
          <div className='hidden flex-col sm:flex'>
            <span className='text-lg font-bold leading-tight'>F8 Learning</span>
            <span className='text-xs text-muted-foreground'>Code • Learn • Grow</span>
          </div>
        </Link>

        {/* Navigation Menu - Desktop */}
        <nav className='hidden flex-1 items-center justify-center gap-2 lg:flex'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActiveLink(item.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isActiveLink(item.path) ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span>{item.label}</span>

              {/* Active - border-b */}
              <span
                className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                  isActiveLink(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className='hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-muted/50 lg:flex'>
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='mx-4 hidden h-10 max-w-xs flex-1 items-center overflow-hidden rounded-full border bg-muted/50 px-4 xl:flex'>
          <Search className='h-4 w-4 text-muted-foreground' />
          <Input
            className='border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
            placeholder='Tìm kiếm khóa học, bài viết...'
            aria-label='search'
          />
        </div>

        <div className='flex items-center gap-2'>
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notification icon */}
          <Button variant='ghost' size='icon' className='relative'>
            <Bell className='h-5 w-5' />
            <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
              5
            </span>
          </Button>

          {/* User section */}
          {isAuthenticated && user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                {/* Ảnh và tên người dùng */}
                <div className='flex cursor-pointer items-center gap-2'>
                  <Button variant='ghost' size='icon' className='rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <div className='px-2 py-1.5'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col'>
                      <span className='text-sm font-medium'>{user?.name}</span>
                      <span className='text-xs text-muted-foreground'>{user?.email}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to='/profile' className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Thông tin cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/my-courses' className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4' />
                    Khóa học của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/liked-blogs' className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4' />
                    Bài viết đã thích
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='text-red-600 focus:text-red-600'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center gap-2'>
              <Button variant='ghost' className='hover:bg-transparent' onClick={() => handleOpenModalAuth('register')}>
                Đăng ký
              </Button>
              <Button onClick={() => handleOpenModalAuth('login')} className='rounded-full font-semibold'>
                Đăng nhập
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Auth */}
      {openModalAuth && typeModalAuth && (
        <ModalAuth open={openModalAuth} onClose={handleCloseModalAuth} type={typeModalAuth} />
      )}
    </header>
  )
}

export default Header
