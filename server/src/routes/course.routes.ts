import { Router } from 'express'
import courseController from '@/controllers/course.controller'
import upload from '../middleware/upload.middleware'

const router = Router()

// GET /courses - Get all courses
router.get('/', courseController.getAllCourses)

// GET /courses/:id - Get course by ID
router.get('/:id', courseController.getCourseById)

// GET /courses/:id/sections - Get sections of a course
router.get('/:id/sections', courseController.getCourseSections)

// POST /courses - Create new course with optional thumbnail
router.post('/', upload.single('thumbnail'), courseController.createCourse)

// PUT /courses/:id - Update course
router.put('/:id', courseController.updateCourse)

// POST /courses/:id/thumbnail - Upload thumbnail
router.post('/:id/thumbnail', upload.single('thumbnail'), courseController.uploadThumbnail)

// DELETE /courses/:id/thumbnail - Delete thumbnail
router.delete('/:id/thumbnail', courseController.deleteThumbnail)

// DELETE /courses/:id - Delete course
router.delete('/:id', courseController.deleteCourse)

export default router
