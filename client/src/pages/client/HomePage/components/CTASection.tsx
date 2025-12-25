import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'

const CTASection = () => {
  return (
    <section className='bg-gradient-to-r from-blue-600 to-purple-600 py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-8 flex justify-center'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm'>
              <BookOpen className='h-10 w-10 text-white' />
            </div>
          </div>

          <h2 className='mb-6 text-3xl font-bold text-white lg:text-5xl'>
            Bắt đầu hành trình lập trình của bạn ngay hôm nay
          </h2>

          <p className='mb-8 text-xl text-blue-100 lg:text-2xl'>
            Tham gia cùng hàng nghìn học viên đã thành công trong sự nghiệp lập trình
          </p>

          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Button size='lg' className='group bg-white text-blue-600 hover:bg-gray-100'>
              Đăng ký miễn phí
              <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
            </Button>

            <Button variant='outline' size='lg' className='text-blue-600'>
              Xem khóa học miễn phí
            </Button>
          </div>

          <div className='mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-3'>
            <div className='text-white'>
              <div className='mb-2 text-2xl font-bold'>✨</div>
              <div className='text-lg font-semibold'>Học miễn phí</div>
              <div className='text-blue-200'>Nhiều khóa học không mất phí</div>
            </div>

            <div className='text-white'>
              <div className='mb-2 text-2xl font-bold'>🎯</div>
              <div className='text-lg font-semibold'>Thực tế</div>
              <div className='text-blue-200'>Dự án thực tế từ doanh nghiệp</div>
            </div>

            <div className='text-white'>
              <div className='mb-2 text-2xl font-bold'>🚀</div>
              <div className='text-lg font-semibold'>Cộng đồng</div>
              <div className='text-blue-200'>Hỗ trợ 24/7 từ cộng đồng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
