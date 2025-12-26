import Logo from '@/assets/images/logo.png'
import React from 'react'
import { Link } from 'react-router-dom'

const AppLogo: React.FC = () => {
  return (
    <Link to='/' className='flex items-center gap-3 transition-opacity hover:opacity-80'>
      <div className='h-10 w-10 overflow-hidden rounded-lg'>
        <img src={Logo} alt='Logo' width={40} height={40} />
      </div>
      <div className='hidden flex-col sm:flex'>
        <span className='text-lg font-bold leading-tight'>F8 Learning</span>
        <span className='text-xs text-muted-foreground'>Code • Learn • Grow</span>
      </div>
    </Link>
  )
}

export default AppLogo
