import { Router } from 'express'
import lessonController from '@/controllers/lesson.controller'
import upload from '../middleware/upload.middleware'

const router = Router()

router.post('/', upload.single('videoFile'), lessonController.createLesson)
router.get('/:id', lessonController.getLessonById)
router.put('/:id', upload.single('videoFile'), lessonController.updateLesson) // Assuming you have an update method

export default router
