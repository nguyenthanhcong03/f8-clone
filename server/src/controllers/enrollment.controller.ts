import { Request, Response } from 'express'
import catchAsync from '@/utils/catchAsync'
import enrollmentService from '../services/enrollment.service'
import ApiError from '@/utils/ApiError'

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const courseId = req.body.id

  if (!userId) {
    throw new ApiError(401, 'Unauthorized')
  }

  // Convert courseId to number if it's a string
  const courseIdNumber = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId

  const enrollment = await enrollmentService.enrollInCourse(userId, courseIdNumber)

  res.status(201).json({
    success: true,
    message: 'Đăng ký khóa học thành công',
    data: enrollment
  })
})

const checkEnrollment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const courseId = parseInt(req.params.courseId, 10)
  console.log('Checking enrollment for userId:', userId, 'and courseId:', courseId)

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const enrolled = await enrollmentService.isEnrolled(userId, courseId)

  res.status(200).json({
    success: true,
    data: { enrolled }
  })
})

const getUserEnrollments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const enrollments = await enrollmentService.getUserEnrollments(userId)

  res.status(200).json({
    success: true,
    data: enrollments
  })
})

const unenrollCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
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
