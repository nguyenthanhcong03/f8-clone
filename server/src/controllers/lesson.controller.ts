import { Request, Response } from 'express'
import lessonService from '@/services/lesson.service'
import catchAsync from '@/utils/catchAsync'
import uploadService from '@/services/upload.service'

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const { section_id, title, content } = req.body

  // Tạo object course data
  const lessonData = {
    section_id: parseInt(section_id),
    title,
    content
  }

  // Nếu có file thumbnail được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadVideo(req.file.buffer, 'lesson-videos')
      lessonData.video_url = uploadResult.url
      lessonData.video_public_id = uploadResult.public_id
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Có lỗi khi upload video',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const newLesson = await lessonService.createLesson(lessonData)
  res.status(201).json({
    success: true,
    message: 'Tạo bài học thành công',
    data: newLesson
  })
})

const getLessonById = catchAsync(async (req: Request, res: Response) => {
  const lessonId = parseInt(req.params.id)

  const response = await lessonService.getLessonById(lessonId)

  res.status(200).json({
    success: true,
    message: 'Lấy danh sách bài học thành công',
    data: response
  })
})

export default {
  createLesson,
  getLessonById
}
