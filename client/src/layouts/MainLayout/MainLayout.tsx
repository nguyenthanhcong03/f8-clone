import Header from '@/layouts/MainLayout/components/Header'
import GlobalLoading from '@/components/common/loading/GlobalLoading2'
import { Outlet } from 'react-router-dom'
import Footer from '@/layouts/MainLayout/components/Footer'

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
