import ApiError from '@/utils/ApiError'
import Enrollment from '../models/enrollment.model'
import Course from '../models/course.model'
import User from '../models/user.model'

const enrollInCourse = async (userId: string, courseId: string): Promise<Enrollment> => {
  // Kiểm tra khóa học có tồn tại hay không
  const course = await Course.findByPk(courseId)
  console.log(courseId)
  if (!course) {
    throw new ApiError(404, 'Khóa học không tồn tại')
  }

  // Kiểm tra người dùng có tồn tại hay không
  const user = await User.findByPk(userId)
  if (!user) {
    throw new ApiError(404, 'Người dùng không tồn tại')
  }

  // Kiểm tra nếu người dùng đã đăng ký khóa học
  const existingEnrollment = await Enrollment.findOne({
    where: {
      userId: userId,
      courseId: courseId
    }
  })

  if (existingEnrollment) {
    throw new ApiError(409, 'Người dùng đã đăng ký khóa học này')
  }

  // Đăng ký khóa học
  const enrollment = await Enrollment.create({
    userId: userId,
    courseId: courseId
  })

  course.increment('enrollmentCount', { by: 1 })

  return enrollment
}

const isEnrolled = async (userId: string, courseId: string): Promise<boolean> => {
  const enrollment = await Enrollment.findOne({
    where: {
      userId,
      courseId
    }
  })

  return !!enrollment
}

const getUserEnrollments = async (userId: string): Promise<Enrollment[]> => {
  // Kiểm tra người dùng có tồn tại hay không
  const user = await User.findByPk(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const enrollments = await Enrollment.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['courseId', 'title', 'thumbnail', 'description']
      }
    ]
  })

  return enrollments
}

const unenrollFromCourse = async (userId: string, courseId: string): Promise<void> => {
  // Kiểm tra đã đăng ký khóa học hay chưa
  const enrollment = await Enrollment.findOne({
    where: {
      userId: userId,
      courseId: courseId
    }
  })

  if (!enrollment) {
    throw new ApiError(404, 'Người dùng chưa đăng ký khóa học này')
  }

  // Hủy đăng ký khóa học
  await enrollment.destroy()
}

export default {
  enrollInCourse,
  isEnrolled,
  getUserEnrollments,
  unenrollFromCourse
}
