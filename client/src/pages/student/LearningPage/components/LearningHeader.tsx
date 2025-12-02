import Logo from '@/assets/images/logo.png'
import { useAppSelector } from '@/store/hook'
import { Link } from 'react-router-dom'

type LearningHeaderProps = {
  title?: string
}

const LearningHeader = ({ title }: LearningHeaderProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  return (
    <header className='flex h-[50px] items-center justify-center border-b border-gray-200 bg-[#29303B] px-2 text-white'>
      {/* Logo */}
      <Link to='/' className='mx-2 h-[30px] w-[30px] overflow-hidden rounded'>
        <img src={Logo} alt='Logo' className='h-[30px] w-[30px]' />
      </Link>

      {/* Title */}
      <h1 className='flex-grow text-[14px] font-bold'>{title || 'Khóa học'}</h1>

      {/* User Avatar */}
      <div className='mr-2 flex cursor-pointer items-center gap-2'>
        {isAuthenticated && user && (
          <>
            {user.avatar ? (
              <img src={user.avatar} alt='User Avatar' className='h-8 w-8 rounded-full object-cover' />
            ) : (
              <img src='/path-to-avatar.jpg' alt='User avatar' className='h-8 w-8 rounded-full' />
            )}
            <span className='text-sm'>{user.name}</span>
          </>
        )}
      </div>
    </header>
  )
}

export default LearningHeader
