import { Enrollment, Lesson, Section, User } from '@/models'
import Course from '../models/course.model'
import uploadService from './upload.service'
import ApiError from '@/utils/ApiError'
import { Sequelize } from 'sequelize'
import sequelize from '@/config/database'

interface CreateCourseData {
  title: string
  slug: string
  description?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  is_paid: boolean
  price?: number
  thumbnail?: string
  thumbnail_public_id?: string
}

export const CourseService = {
  async createCourse(courseData: CreateCourseData) {
    try {
      const course = await Course.create(courseData)
      return course
    } catch (error) {
      console.log('course.service.ts - createCourse - error:', error)
      throw new ApiError(400, 'Lỗi khi tạo khóa học')
    }
  },

  async getAllCourses() {
    try {
      const courses = await Course.findAll({ raw: true, order: [['createdAt', 'ASC']] })
      return courses
    } catch (error) {
      console.log('course.service.ts - getAllCourses - error:', error)
      throw new ApiError(500, 'Lỗi khi lấy danh sách khóa học')
    }
  },

  async getCourseById(course_id: string) {
    console.log(course_id)
    const course = await Course.findByPk(course_id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              // Sắp xếp bài học trong mỗi chương theo 'order'
              separate: true,
              order: [['order', 'DESC']]
            }
          ],
          // Sắp xếp chương theo 'order'
          separate: true,
          order: [['order', 'DESC']]
        }
      ]
    })

    console.log(course)

    if (!course) {
      throw new ApiError(404, 'Khóa học không tồn tại')
    }
    return { course }
  },

  async getCourseBySlug(slug: string, req_user: any) {
    const course = await Course.findOne({
      where: { slug },
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              // Sắp xếp bài học trong mỗi chương theo 'order'
              separate: true,
              order: [['order', 'DESC']]
            }
          ],
          // Sắp xếp chương theo 'order'
          separate: true,
          order: [['order', 'DESC']]
        }
      ]
    })

    if (!course) {
      throw new ApiError(404, 'Khóa học không tồn tại')
    }

    let isEnrolled = false
    if (req_user) {
      const enrollment = await Enrollment.findOne({
        where: { user_id: req_user.id, course_id: course.course_id }
      })
      isEnrolled = !!enrollment // true nếu có dòng trong bảng enrollments
    }
    // console.log(course)

    return { course: { ...course.toJSON(), isEnrolled } }
  },

  async updateCourse(course_id: string, courseData: any) {
    const course = await Course.findByPk(course_id)
    if (!course) {
      throw new ApiError(404, 'Khóa học không tồn tại')
    }
    await course.update(courseData)
    return course
  },

  async deleteCourse(course_id: string) {
    const transaction = await sequelize.transaction()
    try {
      // 1. Kiểm tra khóa học tồn tại
      const course = await Course.findByPk(course_id, { transaction })
      if (!course) {
        throw new ApiError(404, 'Khóa học không tồn tại')
      }
      // Kiểm tra còn section hay không
      const sectionCount = await Section.count({
        where: { course_id },
        transaction
      })

      if (sectionCount > 0)
        throw new ApiError(400, 'Không thể xóa khóa học còn chương. Vui lòng xóa tất cả các chương trước.')

      // Xóa khóa học
      await Course.destroy({ where: { course_id }, transaction })
      await transaction.commit()

      if (course.thumbnail_public_id) {
        await uploadService.deleteFile(course.thumbnail_public_id)
      }

      // Xóa các liên quan (ví dụ Section, Lesson)
      await Section.destroy({ where: { course_id: course.course_id }, transaction })
      await Lesson.destroy({ where: { course_id: course.course_id }, transaction })

      await course.destroy({ transaction })

      await transaction.commit()
      return 'Xóa khóa học thành công'
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async uploadThumbnail(id: number, fileBuffer: Buffer) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }

    // Xóa thumbnail cũ nếu có
    const currentPublicId = course.thumbnail_public_id
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    // Upload thumbnail mới
    const uploadResult = await uploadService.uploadImage(fileBuffer, 'course-thumbnails')

    // Cập nhật course với thumbnail và public_id mới
    await course.update({
      thumbnail: uploadResult.url,
      thumbnail_public_id: uploadResult.public_id
    })

    return course
  },

  async deleteThumbnail(id: number) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }

    const currentPublicId = course.thumbnail_public_id
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    await course.update({
      thumbnail: undefined,
      thumbnail_public_id: undefined
    })

    return course
  }
}

export default CourseService
