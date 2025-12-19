import CourseCard from '@/components/common/course-card/CourseCard'
import { ErrorState } from '@/components/common/error-state/ErrorState'
import { Loading } from '@/components/common/loading/Loading'
import { NoData } from '@/components/common/no-data/NoData'
import { Button } from '@/components/ui/button'
import { useGetAllPublishedCoursesQuery } from '@/services/api/courseApi'

const PublishedCourseList = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetAllPublishedCoursesQuery({
    page: 1,
    limit: 12,
    sort: 'createdAt',
    order: 'desc'
  })

  if (isLoading || isFetching) {
    return <Loading />
  }

  const courses = data?.data?.data

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }
  return (
    <>
      {courses && courses.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {courses.map((course) => (
            <CourseCard key={course.courseId} course={course} />
          ))}
        </div>
      ) : (
        <NoData message='Chưa có khóa học nào' action={<Button onClick={refetch}>Làm mới</Button>} />
      )}
    </>
  )
}

export default PublishedCourseList
