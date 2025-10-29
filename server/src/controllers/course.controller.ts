import { CreateCourseData } from '@/types/course.types'
import ApiError from '@/utils/ApiError'
import catchAsync from '@/utils/catchAsync'
import { responseHandler } from '@/utils/responseHandler'
import { Request, Response } from 'express'
import courseService from '../services/course.service'
import sectionService from '../services/section.service'
import uploadService from '../services/upload.service'
import enrollmentService from '@/services/enrollment.service'
import { Op } from 'sequelize'

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { title, slug, description, level, isPaid, price, isPublished } = req.body

  // Tạo object course data
  const courseData: CreateCourseData = {
    title,
    slug,
    description,
    level,
    isPaid: isPaid === 'true' || isPaid === true,
    price: isPaid === 'true' || isPaid === true ? parseFloat(price) : null,
    isPublished: isPublished === 'true' || isPublished === true,
    createdBy: req.user?.userId as string
  }

  // --- Kiểm tra trùng slug ---
  const existingCourse = await courseService.existsBySlug(slug)
  if (existingCourse) throw new ApiError(400, 'Slug đã tồn tại, vui lòng nhập slug khác.')

  // Nếu có file thumbnail được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadImage(req.file.buffer, 'course-thumbnails')
      courseData.thumbnail = uploadResult.url
      courseData.thumbnailPublicId = uploadResult.publicId
    } catch (error) {
      throw new ApiError(400, 'Lỗi khi upload thumbnail')
    }
  }

  // Tạo khóa học
  const newCourse = await courseService.create(courseData)
  responseHandler(res, 201, 'Tạo khóa học thành công', newCourse)
})

const getAllPublishedCourses = catchAsync(async (req: Request, res: Response) => {
  const {
    search,
    level,
    isPaid,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'DESC'
  } = req.query

  // Điều kiện lọc
  const where: any = {
    is_published: true
  }
  // Tìm kiếm theo tên khóa học
  if (search) {
    where.title = { [Op.like]: `%${search}%` }
  }
  // Lọc theo level
  if (level) {
    where.level = level
  }
  // Lọc theo miễn phí / trả phí
  if (isPaid !== undefined) {
    where.is_paid = isPaid === 'true'
  }
  // Lọc theo khoảng giá
  if (minPrice && maxPrice) {
    where.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] }
  } else if (minPrice) {
    where.price = { [Op.gte]: Number(minPrice) }
  } else if (maxPrice) {
    where.price = { [Op.lte]: Number(maxPrice) }
  }
  // Phân trang và sắp xếp
  const offset = (Number(page) - 1) * Number(limit)
  const response = await courseService.getAllPublished(where, {
    offset,
    limit: Number(limit),
    order: [[String(sort), String(order).toUpperCase()]]
  })

  const responseData = {
    total: response.total,
    page: Number(page),
    limit: Number(limit),
    data: response.data
  }
  responseHandler(res, 200, 'Lấy danh sách khóa học thành công', responseData)
})

const getAllCoursesAdmin = catchAsync(async (req: Request, res: Response) => {
  const courses = await courseService.getAllCoursesAdmin()
  responseHandler(res, 200, 'Lấy danh sách khóa học thành công', courses)
})

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.courseId
  const course = await courseService.getById(courseId)
  responseHandler(res, 200, 'Lấy khóa học thành công', course)
})

const getCourseBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug
  const course = await courseService.getBySlug(slug)
  if (!course) {
    throw new ApiError(404, 'Khóa học không tồn tại')
  }

  let isEnrolled = false
  if (req?.user) {
    isEnrolled = await enrollmentService.isEnrolled(req.user.userId, course.courseId)
  }

  const response = { ...course.toJSON(), isEnrolled }
  responseHandler(res, 200, 'Lấy khóa học thành công', response)
})

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.id
  const course = await courseService.updateCourse(courseId, req.body)
  res.status(200).json({
    success: true,
    data: course,
    message: 'Course updated successfully'
  })
})

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.id
  const result = await courseService.deleteCourse(courseId)
  res.status(200).json({
    success: true,
    message: result.message
  })
})

const uploadThumbnail = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.id

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
  const courseId = req.params.id
  const course = await courseService.deleteThumbnail(courseId)
  res.status(200).json({
    success: true,
    data: course,
    message: 'Thumbnail deleted successfully'
  })
})

const getCourseSections = catchAsync(async (req: Request, res: Response) => {
  const courseId = req.params.id

  const sections = await sectionService.getCourseSectionsById(courseId)

  res.status(200).json({
    success: true,
    message: 'Lấy danh sách sections thành công',
    data: sections
  })
})

export default {
  createCourse,
  getAllPublishedCourses,
  getAllCoursesAdmin,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  deleteThumbnail,
  getCourseSections
}
