import lessonService from '@/services/lesson.service'
import uploadService from '@/services/upload.service'
import ApiError from '@/utils/ApiError'
import catchAsync from '@/utils/catchAsync'
import { Request, Response } from 'express'

const createLesson = catchAsync(async (req: Request, res: Response) => {
  console.log('jjj')
  const { course_id, section_id, title, content, video_url } = req.body

  // Tạo object course data
  const lessonData: {
    course_id: string
    section_id: string
    title: string
    content: string
    video_url?: string
    video_public_id?: string
  } = {
    course_id,
    section_id,
    title,
    content,
    video_url
  }

  // Nếu có file video được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadVideo(req.file.buffer, 'lesson-videos')
      lessonData.video_url = uploadResult.url
      lessonData.video_public_id = uploadResult.public_id
      console.log('Video uploaded successfully:', uploadResult)
    } catch (error) {
      throw new ApiError(400, 'Có lỗi khi upload video')
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

  const lessonId = req.params.lesson_id
  const { title, content, video_url } = req.body

  // Tạo object course data
  const lessonData: {
    title: string
    content: string
    video_url?: string
    video_public_id?: string
    duration?: number
  } = {
    title,
    content,
    video_url
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
  const lessonId = req.params.lesson_id

  const response = await lessonService.getLessonById(lessonId)

  res.status(200).json({
    success: true,
    message: 'Lấy bài học thành công',
    data: response
  })
})

export default {
  createLesson,
  updateLesson,
  getLessonById
}
