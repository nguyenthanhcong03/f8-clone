import { Request, Response } from 'express'
import courseService from '../services/course.service'
import sectionService from '../services/section.service'
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
  console.log('course.controller.ts - createCourse - course:', course)
  res.status(201).json({
    success: true,
    message: 'Tạo khóa học thành công',
    data: course
  })
})

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const courses = await courseService.getAllCourses()
  res.status(200).json({
    success: true,
    data: courses,
    message: 'Lấy danh sách khóa học thành công'
  })
})

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const course_id = req.params.course_id
  const response = await courseService.getCourseById(course_id)
  res.status(200).json({
    success: true,
    data: response
  })
})

const getCourseBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug
  const user = req?.user
  const response = await courseService.getCourseBySlug(slug, user)
  res.status(200).json({
    success: true,
    data: response
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

const getCourseSections = catchAsync(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)

  const sections = await sectionService.getCourseSectionsById(courseId)

  res.status(200).json({
    success: true,
    message: 'Lấy danh sách sections thành công',
    data: sections
  })
})

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  deleteThumbnail,
  getCourseSections
}
