import Header from '@/components/student/Header/Header'
import GlobalLoading from '@/components/common/Loading/GlobalLoading2'
import NavigationDesktop from '@/components/student/Navigation/NavigationDesktop'
import NavigationMobile from '@/components/student/Navigation/NavigationMobile'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/student/Footer/Footer'

const MainLayout = () => {
  return (
    <>
      <GlobalLoading />

      <div className='min-h-screen'>
        <Header />

        <div className='relative mt-[66px]'>
          <div className='fixed left-0 top-[66px] hidden w-[96px] bg-background md:block'>
            <NavigationDesktop />
          </div>
          <div className='mb-14 overflow-auto scrollbar-none md:mb-0 md:ml-24'>
            <Outlet />
          </div>

          <div className='fixed bottom-0 left-0 z-[1000] block w-full border-t bg-background md:hidden'>
            <NavigationMobile />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default MainLayout
