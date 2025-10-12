import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// MUI components removed - using Tailwind instead

const AdSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      spaceBetween={20}
      slidesPerView={1}
      className='rounded-lg'
    >
      <SwiperSlide>
        <div className='bg-gray-300 h-48 flex items-center justify-center rounded-lg'>
          <span className='text-lg font-medium'>Slide 1</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='bg-gray-400 h-48 flex items-center justify-center rounded-lg'>
          <span className='text-lg font-medium'>Slide 2</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='bg-gray-500 h-48 flex items-center justify-center rounded-lg text-white'>
          <span className='text-lg font-medium'>Slide 3</span>
        </div>
      </SwiperSlide>
    </Swiper>
  )
}

export default AdSlider
