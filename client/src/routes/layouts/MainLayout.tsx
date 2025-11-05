import Header from '@/components/student/Header/Header'
import GlobalLoading from '@/components/common/Loading/GlobalLoading2'
import NavigationDesktop from '@/components/student/Navigation/NavigationDesktop'
import NavigationMobile from '@/components/student/Navigation/NavigationMobile'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <GlobalLoading />

      <div className='min-h-screen'>
        <Header />

        <div className='mt-[66px]'>
          <div className='fixed left-0 top-[66px] hidden h-screen w-[96px] border-r bg-background md:block'>
            <NavigationDesktop />
          </div>
          <div className='mb-14 h-screen overflow-auto p-10 scrollbar-none md:mb-0 md:ml-24'>
            <Outlet />
          </div>

          <div className='fixed bottom-0 left-0 z-[1000] block w-full border-t bg-background md:hidden'>
            <NavigationMobile />
          </div>
        </div>
      </div>
    </>
  )
}

export default MainLayout
