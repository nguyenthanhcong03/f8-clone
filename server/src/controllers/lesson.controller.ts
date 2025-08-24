import lessonService from '@/services/lesson.service'
import uploadService from '@/services/upload.service'
import catchAsync from '@/utils/catchAsync'
import { Request, Response } from 'express'

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const { section_id, title, content } = req.body

  // Tạo object course data
  const lessonData: {
    section_id: number
    title: string
    content: string
    video_url?: string
    video_public_id?: string
  } = {
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
      console.log('Video uploaded successfully:', uploadResult)
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

const updateLesson = catchAsync(async (req: Request, res: Response) => {
  console.log('--------------------------------')

  const lessonId = parseInt(req.params.id)
  const { title, content } = req.body

  // Tạo object course data
  const lessonData: {
    title: string
    content: string
    video_url?: string
    video_public_id?: string
    duration?: number
  } = {
    title,
    content
  }

  // Nếu có file thumbnail được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadVideo(req.file.buffer, 'lesson-videos')
      lessonData.video_url = uploadResult.url
      lessonData.video_public_id = uploadResult.public_id
      lessonData.duration = uploadResult.duration
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Có lỗi khi upload video',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const updatedLesson = await lessonService.updateLesson(lessonId, lessonData)
  res.status(201).json({
    success: true,
    message: 'Cập nhật bài học thành công',
    data: updatedLesson
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
  updateLesson,
  getLessonById
}
