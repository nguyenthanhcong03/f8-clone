import CTASection from './components/CTASection'
import FeaturesSection from './components/FeaturesSection'
import HeroSection from './components/HeroSection'
import PublishedCourseList from './components/PublishedCourseList'
import StatsSection from './components/StatsSection'
import TestimonialsSection from './components/TestimonialsSection'

const HomePage = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <HeroSection />
      {/* Published Courses */}
      <section className='container mx-auto px-4 py-16'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>Khóa học nổi bật</h2>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Khám phá những khóa học được yêu thích nhất từ cộng đồng
          </p>
        </div>
        <PublishedCourseList />
      </section>
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

export default HomePage
