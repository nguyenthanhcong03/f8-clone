import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Play, Users } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-10 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900'>
      <div className='container mx-auto px-4 py-20 lg:py-32'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Content */}
          <div className='text-center lg:text-left'>
            <div className='mb-6'>
              <span className='inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100'>
                🚀 Học lập trình miễn phí
              </span>
            </div>

            <h1 className='mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white lg:text-6xl'>
              Học lập trình
              <br />
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                để đi làm
              </span>
            </h1>

            <p className='mb-8 text-lg text-gray-600 dark:text-gray-300 lg:text-xl'>
              Với hàng nghìn khóa học chất lượng cao, được thiết kế bởi các chuyên gia hàng đầu, chúng tôi cam kết đem
              đến cho bạn kiến thức thực tế nhất để thành công trong ngành lập trình.
            </p>

            <div className='flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start'>
              <Button size='lg' className='group'>
                Bắt đầu học ngay
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>

              <Button variant='outline' size='lg' className='group'>
                <Play className='mr-2 h-4 w-4' />
                Xem video giới thiệu
              </Button>
            </div>

            {/* Stats */}
            <div className='mt-12 grid grid-cols-3 gap-6 text-center lg:text-left'>
              <div>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>100K+</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Học viên</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>500+</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Khóa học</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>95%</div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Hài lòng</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className='relative'>
            <div className='relative mx-auto max-w-md lg:max-w-none'>
              {/* Main card */}
              <div className='relative z-10 mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800'>
                <div className='mb-6 flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800'>
                    <BookOpen className='h-6 w-6 text-blue-600 dark:text-blue-300' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>React.js từ cơ bản</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>32 bài học • 8 giờ</p>
                  </div>
                </div>

                <div className='mb-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700'>
                  <div className='h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></div>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>Tiến độ: 75%</span>
                  <div className='flex items-center gap-1 text-yellow-500'>
                    <span>⭐</span>
                    <span className='font-medium'>4.9</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className='absolute -right-4 -top-4 z-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-xl'></div>
              <div className='absolute -bottom-8 -left-8 z-0 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-20 blur-xl'></div>

              {/* Mini cards */}
              <div className='absolute -left-6 top-8 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800'>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-green-500' />
                  <span className='text-xs font-medium text-gray-900 dark:text-white'>1.2K đang học</span>
                </div>
              </div>

              <div className='absolute -right-8 bottom-8 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                  <span className='text-xs font-medium text-gray-900 dark:text-white'>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className='absolute inset-0 -z-10 opacity-30'>
        <div className='absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl'></div>
      </div>
    </section>
  )
}

export default HeroSection
