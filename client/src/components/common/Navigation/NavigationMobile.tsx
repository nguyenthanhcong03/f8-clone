import { Home, Map, Newspaper } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NavigationMobile = () => {
  return (
    <div className='flex w-full h-[60px] gap-1 border-t justify-evenly items-center py-4'>
      <NavLink
        to='/'
        className='flex flex-col items-center justify-center no-underline text-muted-foreground text-xs font-medium w-[70px] h-[70px] rounded-2xl transition-colors hover:bg-muted'
      >
        {({ isActive }) => (
          <>
            <Home className={cn('mb-1 h-5 w-5', isActive && 'text-primary')} />
            <span className={cn('text-xs font-medium', isActive && 'text-foreground')}>Trang chủ</span>
          </>
        )}
      </NavLink>

      <NavLink
        to='/learning-paths'
        className='flex flex-col items-center justify-center no-underline text-muted-foreground text-xs font-medium w-[70px] h-[70px] rounded-2xl transition-colors hover:bg-muted'
      >
        {({ isActive }) => (
          <>
            <Map className={cn('mb-1 h-5 w-5', isActive && 'text-primary')} />
            <span className={cn('text-xs font-medium', isActive && 'text-foreground')}>Lộ trình</span>
          </>
        )}
      </NavLink>

      <NavLink
        to='/blog'
        className='flex flex-col items-center justify-center no-underline text-muted-foreground text-xs font-medium w-[70px] h-[70px] rounded-2xl transition-colors hover:bg-muted'
      >
        {({ isActive }) => (
          <>
            <Newspaper className={cn('mb-1 h-5 w-5', isActive && 'text-primary')} />
            <span className={cn('text-xs font-medium', isActive && 'text-foreground')}>Bài viết</span>
          </>
        )}
      </NavLink>
    </div>
  )
}

export default NavigationMobile
