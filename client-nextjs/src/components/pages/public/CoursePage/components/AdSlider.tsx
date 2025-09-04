import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Box, Paper, Typography } from '@mui/material'

const AdSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      spaceBetween={20}
      slidesPerView={1}
    >
      <SwiperSlide>
        <div style={{ background: '#ccc', height: 200 }}>Slide 1</div>
      </SwiperSlide>
      <SwiperSlide>
        <div style={{ background: '#aaa', height: 200 }}>Slide 2</div>
      </SwiperSlide>
      <SwiperSlide>
        <div style={{ background: '#888', height: 200 }}>Slide 3</div>
      </SwiperSlide>
    </Swiper>
  )
}

export default AdSlider
