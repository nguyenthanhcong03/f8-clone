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
import { useAppSelector } from '@/store/hook'
import { Bell, BookOpen, ChevronLeft, LogOut, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ModalAuth from '../../auth/AuthModal/AuthModal'
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle'
import { useLogoutMutation } from '@/services/api/authApi'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isProfilePage = location.pathname === '/profile'
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
      navigate('/')
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error)
    }
  }

  return (
    <header className='fixed left-0 right-0 top-0 z-50 h-[66px] border-b bg-background shadow-sm'>
      <div className='mx-auto flex h-full items-center justify-between px-7'>
        {/* Logo */}
        <Link to='/' className='mr-2 flex items-center transition-opacity hover:opacity-80'>
          <div className='flex items-center'>
            <div className='h-[38px] w-[38px] overflow-hidden rounded-lg'>
              <img src={Logo} alt='Logo' width={38} height={38} />
            </div>

            {!isProfilePage ? (
              <span className='ml-4 hidden whitespace-nowrap text-sm font-bold sm:block md:block'>
                Học lập trình để đi làm
              </span>
            ) : (
              <div className='flex items-center text-[#808990]' onClick={() => navigate(-1)}>
                <ChevronLeft className='ml-2 h-4 w-4' />
                <p className='text-xs uppercase'>Quay lại</p>
              </div>
            )}
          </div>
        </Link>

        {/* Search bar */}
        <div className='mx-4 flex h-10 max-w-md flex-1 items-center overflow-hidden rounded-full border-2 border-[#e8e8e8] px-3 py-1'>
          <Search />
          <Input
            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
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
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                {/* Ảnh và tên người dùng */}
                <div className='flex cursor-pointer items-center gap-2'>
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
                  {user?.name}
                </div>
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
      <ModalAuth open={openModalAuth} onClose={handleCloseModalAuth} type={typeModalAuth} />
    </header>
  )
}

export default Header
