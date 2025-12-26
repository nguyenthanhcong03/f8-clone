import ModalAuth from '@/components/auth/auth-modal/AuthModal'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import ActionButton from './components/ActionButton'
import AppLogo from './components/AppLogo'
import Navigation from './components/Navigation'
import SearchForm from './components/SearchForm'
import UserDropdownMenu from './components/UserDropdownMenu'

const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
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

  return (
    <header className='fixed left-0 right-0 top-0 z-50 border-b bg-background shadow-sm'>
      <div className='mx-auto flex h-16 items-center justify-between px-6 lg:gap-8'>
        <div className='flex gap-8'>
          {/* Logo */}
          <AppLogo />

          {/* Navigation Menu */}
          <Navigation />
        </div>

        {/* Search */}
        <SearchForm />

        <div className='flex items-center gap-2'>
          <ActionButton />

          {/* User section */}
          {isAuthenticated && user ? (
            <UserDropdownMenu user={user} />
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
      {openModalAuth && typeModalAuth && (
        <ModalAuth open={openModalAuth} onClose={handleCloseModalAuth} type={typeModalAuth} />
      )}
    </header>
  )
}

export default Header
