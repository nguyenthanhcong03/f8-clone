import lessonService from '@/services/lesson.service'
import uploadService from '@/services/upload.service'
import ApiError from '@/utils/ApiError'
import asyncHandler from '@/utils/asyncHandler'
import { Request, Response } from 'express'

const createLesson = asyncHandler(async (req: Request, res: Response) => {
  console.log('jjj')
  const { sectionId, title, content, videoUrl } = req.body

  // Tạo object course data
  const lessonData: {
    sectionId: string
    title: string
    content: string
    videoUrl?: string
    videoPublicId?: string
  } = {
    sectionId,
    title,
    content,
    videoUrl
  }

  // Nếu có file video được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadVideo(req.file.buffer, 'lesson-videos')
      lessonData.videoUrl = uploadResult.url
      lessonData.videoPublicId = uploadResult.publicId
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

const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const lessonId = req.params.id
  const { title, content, videoUrl } = req.body

  // Tạo object course data
  const lessonData: {
    title: string
    content: string
    videoUrl?: string
    videoPublicId?: string
    duration?: number
  } = {
    title,
    content,
    videoUrl
  }

  // Nếu có file thumbnail được upload
  if (req.file) {
    try {
      const uploadResult = await uploadService.uploadVideo(req.file.buffer, 'lesson-videos')
      lessonData.videoUrl = uploadResult.url
      lessonData.videoPublicId = uploadResult.publicId
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

const getLessonById = asyncHandler(async (req: Request, res: Response) => {
  const lessonId = req.params.id
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
