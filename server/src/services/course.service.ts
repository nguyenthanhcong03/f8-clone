import Course from '../models/course.model'
import uploadService from './upload.service'

export class CourseService {
  async createCourse(courseData: any) {
    const course = await Course.create(courseData)
    return course
  }

  async getAllCourses() {
    const courses = await Course.findAll()
    return courses
  }

  async getCourseById(id: number) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }
    return course
  }

  async updateCourse(id: number, courseData: any) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }
    await course.update(courseData)
    return course
  }

  async deleteCourse(id: number) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error('Course not found')
    }

    // Xóa thumbnail nếu có
    const currentPublicId = course.thumbnail_public_id
    if (currentPublicId) {
      await uploadService.deleteFile(currentPublicId)
    }

    await course.destroy()
    return { message: 'Course deleted successfully' }
  }

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
  }

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

export default new CourseService()
