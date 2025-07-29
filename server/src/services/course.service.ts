import Course from '../models/course.model'
import uploadService from './upload.service'

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

export class CourseService {
  // Helper function to generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  async createCourse(courseData: CreateCourseData) {
    // Generate slug if not provided
    const slug = courseData.slug || this.generateSlug(courseData.title)

    // Prepare data for course creation
    const courseCreateData = {
      ...courseData,
      slug
    }

    const course = await Course.create(courseCreateData)
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
