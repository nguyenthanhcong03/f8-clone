import { Home, Map, Newspaper } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NavigationDesktop = () => {
  return (
    <div className='flex h-auto w-[96px] flex-col items-center justify-start gap-2 py-4'>
      <NavLink
        to='/'
        className={({ isActive }) =>
          cn(
            'flex h-[70px] w-[70px] flex-col items-center justify-center rounded-2xl text-xs text-foreground no-underline transition-colors hover:bg-muted',
            isActive && 'bg-muted'
          )
        }
      >
        <Home className='mb-1 h-5 w-5' />
        Trang chủ
      </NavLink>

      <NavLink
        to='/roadmap'
        className={({ isActive }) =>
          cn(
            'flex h-[70px] w-[70px] flex-col items-center justify-center rounded-2xl text-xs text-foreground no-underline transition-colors hover:bg-muted',
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
            'flex h-[70px] w-[70px] flex-col items-center justify-center rounded-2xl text-xs text-foreground no-underline transition-colors hover:bg-muted',
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
