import { Router } from 'express'
import courseController from '@/controllers/course.controller'
import upload from '../middleware/upload.middleware'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

router.get('/', courseController.getAllPublishedCourses)

router.get('/slug/:slug', authMiddleware.authOptional, courseController.getCourseBySlug)

router.get('/:id/sections', courseController.getCourseSections)
router.get('/:course_id', courseController.getCourseById)

router.post('/', upload.single('thumbnail'), courseController.createCourse)

router.put('/:id', courseController.updateCourse)

router.post('/:id/thumbnail', upload.single('thumbnail'), courseController.uploadThumbnail)

router.delete('/:id/thumbnail', courseController.deleteThumbnail)

router.delete('/:id', courseController.deleteCourse)

export default router
