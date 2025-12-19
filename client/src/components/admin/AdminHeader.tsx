import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hook'
import { Bell, Search, Settings, User } from 'lucide-react'

const AdminHeader = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  return (
    <header className='flex h-16 items-center justify-between border-b border-border bg-background px-6'>
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
        <Button variant='ghost' size='sm' className='flex items-center gap-2 px-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className='h-8 w-8 rounded-full object-cover' />
            ) : (
              <User className='h-5 w-5' />
            )}
          </div>
          <div className='hidden text-left md:block'>
            <div className='text-sm font-medium'>{user?.name}</div>
            <div className='text-xs text-muted-foreground'>{user?.email}</div>
          </div>
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
