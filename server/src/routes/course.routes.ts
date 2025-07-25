import { Router } from 'express'
import courseController from '../controllers/course.controller'
import upload from '../middleware/upload.middleware'

const router = Router()

// GET /courses - Get all courses
router.get('/', courseController.getAllCourses.bind(courseController))

// GET /courses/:id - Get course by ID
router.get('/:id', courseController.getCourseById.bind(courseController))

// POST /courses - Create new course
router.post('/', courseController.createCourse.bind(courseController))

// PUT /courses/:id - Update course
router.put('/:id', courseController.updateCourse.bind(courseController))

// POST /courses/:id/thumbnail - Upload thumbnail
router.post('/:id/thumbnail', upload.single('thumbnail'), courseController.uploadThumbnail.bind(courseController))

// DELETE /courses/:id/thumbnail - Delete thumbnail
router.delete('/:id/thumbnail', courseController.deleteThumbnail.bind(courseController))

// DELETE /courses/:id - Delete course
router.delete('/:id', courseController.deleteCourse.bind(courseController))

export default router
