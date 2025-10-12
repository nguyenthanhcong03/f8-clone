import { Home, Map, Newspaper } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NavigationDesktop = () => {
  return (
    <div className='h-full flex flex-col gap-2 w-[96px] justify-start items-center py-4'>
      <NavLink
        to='/'
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center no-underline text-foreground text-xs w-[70px] h-[70px] rounded-2xl transition-colors hover:bg-muted',
            isActive && 'bg-muted'
          )
        }
      >
        <Home className='mb-1 h-5 w-5' />
        Trang chủ
      </NavLink>

      <NavLink
        to='/learning-paths'
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center no-underline text-foreground text-xs w-[70px] h-[70px] rounded-2xl transition-colors hover:bg-muted',
            isActive && 'bg-muted'
          )
        }
      >
        <Map className='mb-1 h-5 w-5' />
        Lộ trình
      </NavLink>

      <NavLink
        to='/blog'
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center no-underline text-foreground text-xs w-[70px] h-[70px] rounded-2xl transition-colors hover:bg-muted',
            isActive && 'bg-muted'
          )
        }
      >
        <Newspaper className='mb-1 h-5 w-5' />
        Bài viết
      </NavLink>
    </div>
  )
}

export default NavigationDesktop
