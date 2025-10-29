import Header from '@/components/common/Header/Header'
import GlobalLoading from '@/components/common/Loading/GlobalLoading2'
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
          className='scrollbar-none mb-14 h-screen overflow-auto p-10 md:mb-0 md:ml-24'
          style={{
            minHeight: `calc(100vh - 66px)`
          }}
        >
          <Outlet />
          {/* <Loading /> */}
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <div
          className='fixed left-0 hidden border-r bg-background md:block'
          style={{
            top: '66px',
            width: NAVIGATION_WIDTH,
            height: `calc(100vh - 66px)`
          }}
        >
          <NavigationDesktop />
        </div>

        {/* Mobile Navigation - visible on mobile */}
        <div className='fixed bottom-0 left-0 z-[1000] block w-full border-t bg-background md:hidden'>
          <NavigationMobile />
        </div>
      </div>
    </>
  )
}

export default MainLayout
