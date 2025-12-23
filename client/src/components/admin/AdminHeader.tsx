import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hook'
import { Bell, BookOpen, LogOut, Menu, Search, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Link } from 'react-router-dom'
import { useLogoutMutation } from '@/services/api/authApi'
import { toast } from 'react-toastify'

type AdminHeaderProps = {
  onToggleSidebar: () => void
}

const AdminHeader = ({ onToggleSidebar }: AdminHeaderProps) => {
  // const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const user = {
    name: 'Nguyễn Thành Công',
    email: 'coongnguyenthanh@gmail.com',
    avatar: 'https://avatars.githubusercontent.com/u/49101236?v=4'
  }
  const isAuthenticated = true
  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    try {
      await logout({}).unwrap()
      toast.success('Đăng xuất thành công')
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error)
    }
  }

  return (
    <header className='flex h-16 items-center gap-2 border-b border-border bg-background px-2'>
      <Button variant='ghost' size='sm' onClick={onToggleSidebar} className='h-8 w-8'>
        <Menu className='h-4 w-4' />
      </Button>
      <div className='flex flex-1'>
        {/* Left side - Search */}
        <div className='flex flex-1 items-center'>
          <div className='relative w-full max-w-md'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <input
              type='text'
              placeholder='Tìm kiếm...'
              className='w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>
        {/* Right side - Actions */}
        <div className='flex items-center gap-2'>
          {/* Notifications */}
          <Button variant='ghost' size='sm' className='relative h-9 w-9 p-0'>
            <Bell className='h-4 w-4' />
            <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground'>
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant='ghost' size='sm' className='h-9 w-9 p-0'>
            <Settings className='h-4 w-4' />
          </Button>

          {/* Profile */}
          {isAuthenticated && user && (
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='text-red-600 focus:text-red-600'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
