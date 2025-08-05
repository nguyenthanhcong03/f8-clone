import ApiError from '@/utils/ApiError'
import Enrollment from '../models/enrollment.model'
import Course from '../models/course.model'
import User from '../models/user.model'

const enrollInCourse = async (userId: number, courseId: number): Promise<Enrollment> => {
  // Kiểm tra khóa học có tồn tại hay không
  const course = await Course.findByPk(courseId)
  if (!course) {
    throw new ApiError(404, 'Khóa học không tồn tại')
  }

  // Kiểm trangười dùng có tồn tại hay không
  const user = await User.findByPk(userId)
  if (!user) {
    throw new ApiError(404, 'Người dùng không tồn tại')
  }

  // Kiểm tra nếu người dùng đã đăng ký khóa học
  const existingEnrollment = await Enrollment.findOne({
    where: {
      user_id: userId,
      course_id: courseId
    }
  })

  if (existingEnrollment) {
    throw new ApiError(409, 'Người dùng đã đăng ký khóa học này')
  }

  // Đăng ký khóa học
  const enrollment = await Enrollment.create({
    user_id: userId,
    course_id: courseId
  })

  course.increment('enrollment_count', { by: 1 })

  return enrollment
}

const isEnrolled = async (userId: number, courseId: number): Promise<boolean> => {
  const enrollment = await Enrollment.findOne({
    where: {
      user_id: userId,
      course_id: courseId
    }
  })

  return !!enrollment
}

const getUserEnrollments = async (userId: number): Promise<Enrollment[]> => {
  // Kiểm tra người dùng có tồn tại hay không
  const user = await User.findByPk(userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const enrollments = await Enrollment.findAll({
    where: {
      user_id: userId
    },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'thumbnail', 'description']
      }
    ]
  })

  return enrollments
}

const unenrollFromCourse = async (userId: number, courseId: number): Promise<void> => {
  // Kiểm tra đã đăng ký khóa học hay chưa
  const enrollment = await Enrollment.findOne({
    where: {
      user_id: userId,
      course_id: courseId
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
