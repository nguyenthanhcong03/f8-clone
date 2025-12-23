import { CourseStats, CourseTable } from './components'

const CourseManagementPage = () => {
  return (
    <div className='space-y-8 p-6'>
      {/* Thống kê tổng quan */}
      <CourseStats />

      {/* Bảng quản lý khóa học */}
      <CourseTable />
    </div>
  )
}

export default CourseManagementPage
