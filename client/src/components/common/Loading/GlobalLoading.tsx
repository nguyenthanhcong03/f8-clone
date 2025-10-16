import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import Logo from '@/assets/images/logo.png'

const GlobalLoading = () => {
  const { globalLoading } = useAppSelector((state) => state.app)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true)
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }, [globalLoading])

  return (
    <div
      className={`
        fixed inset-0 z-[99999] 
        flex flex-col justify-center items-center
        transition-all duration-500 ease-in-out
        backdrop-blur-lg
        ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 50%, rgba(0,0,0,0.95) 100%)'
      }}
    >
      <div className='flex flex-col items-center gap-8'>
        {/* Logo with pulse animation */}
        <div className='animate-pulse'>
          <img src={Logo} alt='Logo' className='w-auto h-auto' />
        </div>

        {/* Loading spinner */}
        <div className='animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent'></div>

        {/* Loading text */}
        <h2 className='text-xl font-medium text-primary-foreground opacity-80 animate-pulse'>Đang tải...</h2>
      </div>
    </div>
  )
}

export default GlobalLoading
