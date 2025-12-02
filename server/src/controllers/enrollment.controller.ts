import { Request, Response } from 'express'
import catchAsync from '@/utils/catchAsync'
import enrollmentService from '@/services/enrollment.service'
import { responseHandler } from '@/utils/responseHandler'
import ApiError from '@/utils/ApiError'

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const courseId = req.body.courseId

  const enrollment = await enrollmentService.enrollInCourse(userId!, courseId)

  res.status(201).json({
    success: true,
    message: 'Đăng ký khóa học thành công',
    data: { enrollment }
  })
})

const checkEnrollment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const courseId = req.params.courseId

  if (!userId) throw new ApiError(401, 'Unauthorized')

  const enrolled = await enrollmentService.isEnrolled(userId, courseId)

  responseHandler(res, 200, 'Kiểm tra đăng ký thành công', { enrolled })
})

const getUserEnrollments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId

  if (!userId) throw new ApiError(401, 'Unauthorized')

  const enrollments = await enrollmentService.getUserEnrollments(userId)

  responseHandler(res, 200, 'Lấy danh sách đăng ký thành công', { enrollments })
})

const unenrollCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const courseId = parseInt(req.params.courseId, 10)

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await enrollmentService.unenrollFromCourse(userId, courseId)

  res.status(200).json({
    success: true,
    message: 'Unenrolled from course successfully'
  })
})

export default {
  enrollCourse,
  checkEnrollment,
  getUserEnrollments,
  unenrollCourse
}
