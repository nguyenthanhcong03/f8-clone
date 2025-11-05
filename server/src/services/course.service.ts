import { Enrollment, Lesson, Section } from '@/models'
import Course from '../models/course.model'
import uploadService from './upload.service'
import ApiError from '@/utils/ApiError'
import sequelize from '@/config/database'
import { CreateCourseData } from '@/types/course.types'

export const CourseService = {
  async create(data: CreateCourseData) {
    return await Course.create(data)
  },

  async existsBySlug(slug: string) {
    const course = await Course.findOne({ where: { slug } })
    return !!course
  },

  async getAllPublished(where: any, options: any) {
    const { count, rows } = await Course.findAndCountAll({
      where,
      limit: options.limit,
      offset: options.offset,
      order: options.order
    })
    return { total: count, data: rows }
  },

  async getAllCoursesAdmin(where: any, options: any) {
    const { count, rows } = await Course.findAndCountAll({
      where,
      limit: options.limit,
      offset: options.offset,
      order: options.order
    })
    return { total: count, data: rows }
  },

  async getById(courseId: string) {
    console.log('👉check: ', courseId)
    const course = await Course.findByPk(courseId, {
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
    return course
  },

  async getBySlug(slug: string) {
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

    return course
  },

  async updateCourse(courseId: string, courseData: Partial<CreateCourseData>) {
    const course = await Course.findByPk(courseId)
    if (!course) {
      throw new ApiError(404, 'Khóa học không tồn tại')
    }
    await course.update(courseData)
    return course
  },

  async deleteCourse(courseId: string) {
    const transaction = await sequelize.transaction()
    try {
      // 1. Kiểm tra khóa học tồn tại
      const course = await Course.findByPk(courseId, { transaction })
      if (!course) {
        throw new ApiError(404, 'Khóa học không tồn tại')
      }
      // Kiểm tra còn section hay không
      const sectionCount = await Section.count({
        where: { courseId },
        transaction
      })

      if (sectionCount > 0)
        throw new ApiError(400, 'Không thể xóa khóa học còn chương. Vui lòng xóa tất cả các chương trước.')

      if (course.thumbnailPublicId) {
        await uploadService.deleteFile(course.thumbnailPublicId)
      }

      // Xóa các liên quan (ví dụ Section, Lesson)
      await Section.destroy({ where: { courseId: course.courseId }, transaction })
      await Lesson.destroy({ where: { courseId: course.courseId }, transaction })

      // Xóa khóa học
      await course.destroy({ transaction })

      await course.destroy({ transaction })

      await transaction.commit()
      return { message: 'Xóa khóa học thành công' }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async uploadThumbnail(id: string, fileBuffer: Buffer) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }

    // Xóa thumbnail cũ nếu có
    const currentPublicId = course.thumbnailPublicId
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    // Upload thumbnail mới
    const uploadResult = await uploadService.uploadImage(fileBuffer, 'course-thumbnails')

    // Cập nhật course với thumbnail và publicId mới
    await course.update({
      thumbnail: uploadResult.url,
      thumbnailPublicId: uploadResult.publicId
    })

    return course
  },

  async deleteThumbnail(id: string) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }

    const currentPublicId = course.thumbnailPublicId
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    await course.update({
      thumbnail: undefined,
      thumbnailPublicId: undefined
    })

    return course
  }
}

export default CourseService
