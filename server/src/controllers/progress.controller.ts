import { Lesson } from '@/models'
import Progress from '@/models/progress.model'
import catchAsync from '@/utils/catchAsync'
import { Request, Response } from 'express'

const updateProgress = catchAsync(async (req: Request, res: Response) => {
  const { lessonId, watchedSeconds } = req.body
  console.log('req.body', req.body)
  // const userId = req.user.id

  // const lesson = await Lesson.findByPk(lessonId)
  // if (!lesson) return res.status(404).json({ message: 'Lesson not found' })

  // const isCompleted = watchedSeconds >= lesson.duration * 0.9

  // const [progress, created] = await Progress.findOrCreate({
  //   where: { user_id: userId, lesson_id: lessonId },
  //   defaults: { user_id: userId, lesson_id: lessonId, watched_seconds: watchedSeconds, is_completed: isCompleted }
  // })

  // if (!created) {
  //   await progress.update({
  //     watched_seconds: watchedSeconds,
  //     is_completed: isCompleted
  //   })
  // }

  // return res.status(200).json({
  //   success: true,
  //   data: progress,
  //   message: 'Cập nhật tiến độ thành công'
  // })
})

export default {
  updateProgress
}
