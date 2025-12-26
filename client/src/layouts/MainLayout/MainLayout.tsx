import GlobalLoading from '@/components/common/loading/GlobalLoading2'
import Footer from '@/layouts/MainLayout/components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import Header from '@/layouts/MainLayout/components/Header/Header'

const MainLayout = () => {
  return (
    <>
      <GlobalLoading />

      <div className='flex min-h-screen flex-col'>
        <Header />

        <main className='mx-auto mt-16 w-full flex-1'>
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  )
}

export default MainLayout
