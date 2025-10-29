import AdSlider from './components/AdSlider'
import CourseList from './components/CourseList'

const HomePage = () => {
  return (
    <div className='w-full'>
      <AdSlider />

      <div className='mt-6'>
        <CourseList />
      </div>
    </div>
  )
}

export default HomePage
