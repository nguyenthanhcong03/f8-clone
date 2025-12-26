import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/lib/constants'
import { useLogoutMutation } from '@/services/api/authApi'
import { BookOpen, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const UserDropdownMenu = ({ user }: { user: any }) => {
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* Ảnh và tên người dùng */}
        <div className='flex cursor-pointer items-center gap-2'>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='px-2 py-1.5'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className='flex flex-col'>
              <span className='text-sm font-medium'>{user?.fullName}</span>
              <span className='text-xs text-muted-foreground'>{user?.email}</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={ROUTES.PUBLIC.PROFILE(user.username)} className='flex items-center gap-2'>
            <User className='h-4 w-4' />
            Trang cá nhân
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.STUDENT.BLOG.CREATE} className='flex items-center gap-2'>
            <BookOpen className='h-4 w-4' />
            Viết blog
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.STUDENT.MY_POSTS} className='flex items-center gap-2'>
            <BookOpen className='h-4 w-4' />
            Bài viết của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.STUDENT.MY_COURSES} className='flex items-center gap-2'>
            <BookOpen className='h-4 w-4' />
            Khóa học của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.STUDENT.LIKED_BLOGS} className='flex items-center gap-2'>
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
  )
}

export default UserDropdownMenu
