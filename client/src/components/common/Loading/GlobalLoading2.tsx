import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import Logo from '@/assets/images/logo.png'

const GlobalLoading2 = () => {
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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center backdrop-blur-lg transition-all duration-500 ease-in-out ${isLoading ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} `}
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 50%, rgba(0,0,0,0.95) 100%)'
      }}
    >
      <div className='flex flex-col items-center gap-8'>
        {/* Logo with pulse animation */}
        <div className='animate-pulse'>
          <img src={Logo} alt='Logo' className='h-auto w-auto' />
        </div>

        {/* Loading spinner */}
        <div className='h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>

        {/* Loading text */}
        <h2 className='animate-pulse text-xl font-medium text-primary-foreground opacity-80'>Đang tải...</h2>
      </div>
    </div>
  )
}

export default GlobalLoading2
