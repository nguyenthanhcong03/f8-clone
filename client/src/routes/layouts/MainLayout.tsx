import Header from '@/components/common/Header/Header'
import GlobalLoading from '@/components/common/Loading/GlobalLoading'
import NavigationDesktop from '@/components/common/Navigation/NavigationDesktop'
import NavigationMobile from '@/components/common/Navigation/NavigationMobile'
import { Outlet } from 'react-router-dom'

const NAVIGATION_WIDTH = '96px'

const MainLayout = () => {
  return (
    <>
      <GlobalLoading />

      <div className='min-h-screen'>
        <Header />

        {/* Main content area */}
        <div
          className='p-10 overflow-auto md:ml-24 mb-14 md:mb-0'
          style={{
            minHeight: `calc(100vh - 66px)`
          }}
        >
          <Outlet />
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <div
          className='hidden md:block fixed left-0 bg-background border-r'
          style={{
            top: '66px',
            width: NAVIGATION_WIDTH,
            height: `calc(100vh - 66px)`
          }}
        >
          <NavigationDesktop />
        </div>

        {/* Mobile Navigation - visible on mobile */}
        <div className='block md:hidden fixed left-0 bottom-0 w-full bg-background border-t z-[1000]'>
          <NavigationMobile />
        </div>
      </div>
    </>
  )
}

export default MainLayout
