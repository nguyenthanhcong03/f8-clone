import { Op } from 'sequelize'
import Lesson from '../models/lesson.model'
import uploadService from './upload.service'
import { Section } from '@/models'

export class LessonService {
  async createLesson(lessonData: any) {
    const lesson = await Lesson.create(lessonData)
    return lesson
  }

  async getAllLessons() {
    const lessons = await Lesson.findAll()
    return lessons
  }

  async getLessonById(id: number) {
    const lesson = await Lesson.findByPk(id, {
      include: {
        model: Section,
        as: 'section',
        attributes: ['id', 'course_id']
      }
    })

    const courseId = lesson?.section.course_id

    // 2. Lấy tất cả sections của khóa học
    const sections = await Section.findAll({
      where: { course_id: courseId },
      attributes: ['id', 'order'],
      order: [['order', 'ASC']]
    })

    // Tạo map để lưu thứ tự của các section
    const sectionOrderMap: Record<number, number> = {}
    sections.forEach((section) => {
      if (section.id && section.order !== undefined) {
        sectionOrderMap[section.id] = section.order
      }
    })

    // 3. Lấy tất cả bài học trong các section của khóa học
    const courseLessons = await Lesson.findAll({
      where: {
        section_id: { [Op.in]: sections.map((s) => s.id || 0) }
      },
      attributes: ['id', 'title', 'section_id', 'order'],
      raw: true
    })

    // 4. Sắp xếp theo section.order rồi lesson.order
    const sortedLessons = courseLessons.sort((a, b) => {
      const secOrderA = sectionOrderMap[a.section_id] || 0
      const secOrderB = sectionOrderMap[b.section_id] || 0

      if (secOrderA === secOrderB) {
        return (a.order || 0) - (b.order || 0)
      }
      return secOrderA - secOrderB
    })

    // 5. Tìm vị trí bài học hiện tại
    const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id)

    const previousLessonId = currentIndex > 0 ? sortedLessons[currentIndex - 1].id : null
    const nextLessonId = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1].id : null

    return {
      ...lesson.toJSON(),
      previousLessonId,
      nextLessonId
    }
  }

  async updateLesson(id: number, lessonData: any) {
    const lesson = await Lesson.findByPk(id)
    if (!lesson) {
      throw new Error('Lesson not found')
    }
    await lesson.update(lessonData)
    return lesson
  }

  async deleteLesson(id: number) {
    const lesson = await Lesson.findByPk(id)
    if (!lesson) {
      throw new Error('Lesson not found')
    }

    // Xóa video nếu có
    const currentPublicId = lesson.video_public_id
    if (currentPublicId) {
      await uploadService.deleteVideo(currentPublicId)
    }

    await lesson.destroy()
    return { message: 'Lesson deleted successfully' }
  }

  async uploadVideo(id: number, fileBuffer: Buffer) {
    const lesson = await Lesson.findByPk(id)
    if (!lesson) {
      throw new Error('Lesson not found')
    }

    // Xóa video cũ nếu có
    const currentPublicId = lesson.video_public_id
    if (currentPublicId) {
      await uploadService.deleteVideo(currentPublicId)
    }

    // Upload video mới
    const uploadResult = await uploadService.uploadVideo(fileBuffer, 'lesson-videos')

    // Cập nhật lesson với video và public_id mới
    await lesson.update({
      video_url: uploadResult.url,
      video_public_id: uploadResult.public_id
    })

    return lesson
  }

  async deleteVideo(id: number) {
    const lesson = await Lesson.findByPk(id)
    if (!lesson) {
      throw new Error('Lesson not found')
    }

    const currentPublicId = lesson.video_public_id
    if (currentPublicId) {
      await uploadService.deleteVideo(currentPublicId)
    }

    await lesson.update({
      video_url: undefined,
      video_public_id: undefined
    })

    return lesson
  }

  async getLessonsBySectionId(sectionId: number) {
    const lessons = await Lesson.findAll({
      where: { section_id: sectionId },
      order: [['order', 'ASC']]
    })
    return lessons
  }
}

export default new LessonService()
