import { Op } from 'sequelize'
import Lesson from '../models/lesson.model'
import uploadService from './upload.service'
import { Section } from '@/models'
import ApiError from '@/utils/ApiError'

export class LessonService {
  async createLesson(lessonData: any) {
    const lesson = await Lesson.create(lessonData)
    return lesson
  }

  async getAllLessons() {
    const lessons = await Lesson.findAll()
    return lessons
  }

  async getLessonById(lesson_id: string) {
    const lesson = await Lesson.findByPk(lesson_id)

    if (!lesson) {
      throw new ApiError(404, 'Bài học không tồn tại')
    }

    // Lấy bài trước và sau trong cùng course
    const [prevLesson, nextLesson] = await Promise.all([
      Lesson.findOne({
        where: {
          course_id: lesson.course_id,
          order: { [Op.lt]: lesson.order }
        },
        order: [['order', 'DESC']]
      }),
      Lesson.findOne({
        where: {
          course_id: lesson.course_id,
          order: { [Op.gt]: lesson.order }
        },
        order: [['order', 'ASC']]
      })
    ])

    return {
      ...lesson.toJSON(),
      prevLesson: prevLesson ? { id: prevLesson.lesson_id, title: prevLesson.title } : null,
      nextLesson: nextLesson ? { id: nextLesson.lesson_id, title: nextLesson.title } : null
    }
  }

  async updateLesson(lesson_id: string, lessonData: any) {
    const lesson = await Lesson.findByPk(lesson_id)
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
