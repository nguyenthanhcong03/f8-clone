import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

const slides = [
  {
    title: 'Khóa học JavaScript từ Zero đến Hero',
    description: 'Học JavaScript một cách bài bản từ cơ bản đến nâng cao với các dự án thực tế',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    cta: 'Xem chi tiết',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    title: 'Thành thạo React.js trong 30 ngày',
    description: 'Khóa học React.js toàn diện với hooks, context API và các best practices',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    cta: 'Học ngay',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Node.js & Express - Backend Development',
    description: 'Xây dựng API mạnh mẽ với Node.js, Express và MongoDB',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    cta: 'Tham gia ngay',
    gradient: 'from-green-500 to-emerald-500'
  }
]

const AdSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{
        clickable: true,
        bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
      }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }}
      loop={true}
      spaceBetween={0}
      slidesPerView={1}
      className='overflow-hidden rounded-2xl shadow-2xl'
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={`relative h-64 bg-gradient-to-r md:h-80 lg:h-96 ${slide.gradient} overflow-hidden`}>
            {/* Background Image */}
            <div className='absolute inset-0 opacity-20'>
              <img src={slide.image} alt={slide.title} className='h-full w-full object-cover' />
            </div>

            {/* Content */}
            <div className='relative z-10 flex h-full items-center'>
              <div className='container mx-auto px-8'>
                <div className='max-w-2xl text-white'>
                  <h3 className='mb-4 text-2xl font-bold md:text-3xl lg:text-4xl'>{slide.title}</h3>

                  <p className='mb-6 text-lg opacity-90 md:text-xl'>{slide.description}</p>

                  <Button size='lg' className='group bg-white text-gray-900 hover:bg-gray-100'>
                    {slide.cta}
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-xl'></div>
            <div className='absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-xl'></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default AdSlider
