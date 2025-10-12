import Logo from '@/assets/images/logo.png'
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
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Bell, BookOpen, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModalAuth from '../AuthModal/AuthModal'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { logout } from '@/store/features/auth/authSlice'

// Main component
const Header = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const [openModalAuth, setOpenModalAuth] = useState(false)
  const [typeModalAuth, setTypeModalAuth] = useState<'login' | 'register'>('login')
  const handleOpenModalAuth = (type: 'register' | 'login') => {
    setTypeModalAuth(type)
    setOpenModalAuth(true)
  }
  const handleCloseModalAuth = () => setOpenModalAuth(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className='sticky top-0 z-50 h-[66px] bg-background border-b shadow-sm'>
      <div className='h-full mx-auto px-7 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center mr-2 hover:opacity-80 transition-opacity'>
          <div className='flex items-center'>
            <div className='rounded-lg w-[38px] h-[38px] overflow-hidden'>
              <img src={Logo} alt='Logo' width={38} height={38} />
            </div>

            <span className='hidden md:block ml-4 text-sm font-bold sm:block whitespace-nowrap'>
              Học lập trình để đi làm
            </span>
          </div>
        </Link>

        {/* Search bar */}
        <div className='flex-1 max-w-md mx-4 h-10 flex items-center border-2 border-[#e8e8e8]  rounded-full px-3 py-1 overflow-hidden'>
          <Search />
          <Input
            className='border-0 focus-visible:ring-offset-0 focus-visible:ring-0'
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
            <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
              5
            </span>
          </Button>

          {/* User section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full'>
                  {user?.avatar ? (
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className='h-5 w-5' />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <div className='px-2 py-1.5'>
                  <div className='flex items-center gap-2'>
                    {user?.avatar ? (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className='h-5 w-5' />
                    )}
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='text-red-600 focus:text-red-600'>
                  <LogOut className='h-4 w-4 mr-2' />
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
      <ModalAuth open={openModalAuth} onClose={handleCloseModalAuth} type={typeModalAuth} />
    </header>
  )
}

export default Header
