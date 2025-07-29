import { Request, Response } from 'express'
import courseService from '../services/course.service'
import uploadService from '../services/upload.service'
import catchAsync from '@/utils/catchAsync'

interface CreateCourseData {
  title: string
  slug?: string
  description?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  is_paid: boolean
  price?: number
  thumbnail?: string
  thumbnail_public_id?: string
}

const createCourse = catchAsync(async (req: Request, res: Response) => {
  console.log('hello')
  const { title, slug, description, level, is_paid, price } = req.body

  // Tạo object course data
  const courseData: CreateCourseData = {
    title,
    slug,
    description,
    level,
    is_paid: is_paid === 'true' || is_paid === true,
    price: is_paid === 'true' || is_paid === true ? parseFloat(price) : undefined
  }

  console.log('course.controller.ts - createCourse - courseData:', courseData)
  console.log('course.controller.ts - createCourse - req.file:', req.file)

  // Nếu có file thumbnail được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadImage(req.file.buffer, 'course-thumbnails')
      courseData.thumbnail = uploadResult.url
      courseData.thumbnail_public_id = uploadResult.public_id
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to upload thumbnail',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const course = await courseService.createCourse(courseData)
  res.status(201).json({
    success: true,
    message: 'Tạo khóa học thành công',
    data: course
  })
})

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  console.log('Fetching all courses...')
  const courses = await courseService.getAllCourses()
  res.status(200).json({
    success: true,
    data: courses,
    count: courses.length
  })
})

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)
  const course = await courseService.getCourseById(courseId)
  res.status(200).json({
    success: true,
    data: course
  })
})

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)
  const course = await courseService.updateCourse(courseId, req.body)
  res.status(200).json({
    success: true,
    data: course,
    message: 'Course updated successfully'
  })
})

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)
  const result = await courseService.deleteCourse(courseId)
  res.status(200).json({
    success: true,
    message: result.message
  })
})

const uploadThumbnail = catchAsync(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    })
  }

  const course = await courseService.uploadThumbnail(courseId, req.file.buffer)
  res.status(200).json({
    success: true,
    data: course,
    message: 'Thumbnail uploaded successfully'
  })
})

const deleteThumbnail = catchAsync(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)
  const course = await courseService.deleteThumbnail(courseId)
  res.status(200).json({
    success: true,
    data: course,
    message: 'Thumbnail deleted successfully'
  })
})

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  deleteThumbnail
}
