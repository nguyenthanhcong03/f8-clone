import { Router } from 'express'
import courseController from '@/controllers/course.controller'
import upload from '../middleware/upload.middleware'
import authMiddleware from '@/middleware/auth.middleware'

const router = Router()

router.get('/', courseController.getAllPublishedCourses)
router.get('/admin', authMiddleware.authRequired, courseController.getAllCoursesAdmin)
router.get('/search', courseController.searchCourseAndBlog)

router.get('/slug/:slug', authMiddleware.authOptional, courseController.getCourseBySlug)

router.get('/:id/sections', courseController.getCourseSections)
router.get('/:courseId', courseController.getCourseByIdAdmin)

router.post('/', upload.single('thumbnail'), courseController.createCourse)

router.put('/:id', upload.single('thumbnail'), courseController.updateCourse)

router.post('/:id/thumbnail', upload.single('thumbnail'), courseController.uploadThumbnail)

router.delete('/:id/thumbnail', courseController.deleteThumbnail)

router.delete('/:id', courseController.deleteCourse)

export default router
