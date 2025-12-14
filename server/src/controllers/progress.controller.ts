import { Lesson, Section } from '@/models'
import Progress from '@/models/progress.model'
import ApiError from '@/utils/ApiError'
import asyncHandler from '@/utils/asyncHandler'
import { responseHandler } from '@/utils/responseHandler'
import { Request, Response } from 'express'

const getProgressByCourse = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params
  const userId = req.user?.userId

  if (!userId) throw new ApiError(401, 'Unauthorized')

  // Lấy tất cả progress của user cho course này
  const progress = await Progress.findAll({
    include: [
      {
        model: Lesson,
        as: 'lesson',
        required: true,
        include: [
          {
            model: Section,
            as: 'section',
            where: { courseId },
            required: true
          }
        ]
      }
    ],
    where: { userId }
  })

  responseHandler(res, 200, 'Lấy danh sách tiến độ thành công', progress)
})

const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const { lessonId } = req.body
  const userId = req.user?.userId

  if (!userId) throw new ApiError(401, 'Unauthorized')

  const lesson = await Lesson.findByPk(lessonId)
  if (!lesson) throw new ApiError(404, 'Khóa học không tồn tại')

  const [progress, created] = await Progress.findOrCreate({
    where: { userId, lessonId },
    defaults: { userId, lessonId, isCompleted: true }
  })

  if (!created) {
    await progress.update({
      isCompleted: true
    })
  }

  responseHandler(res, 200, 'Cập nhật tiến độ bài học thành công', { progress })
})

export default {
  getProgressByCourse,
  updateProgress
}
