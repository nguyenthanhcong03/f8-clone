import { Request, Response } from 'express'
import courseService from '../services/course.service'

const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.createCourse(req.body)
    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created successfully'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses()
    res.status(200).json({
      success: true,
      data: courses,
      count: courses.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)
    const course = await courseService.getCourseById(courseId)
    res.status(200).json({
      success: true,
      data: course
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Course not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)
    const course = await courseService.updateCourse(courseId, req.body)
    res.status(200).json({
      success: true,
      data: course,
      message: 'Course updated successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Course not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)
    const result = await courseService.deleteCourse(courseId)
    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Course not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const uploadThumbnail = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    const course = await courseService.uploadThumbnail(courseId, req.file.buffer)
    res.status(200).json({
      success: true,
      data: course,
      message: 'Thumbnail uploaded successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Course not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)
    const course = await courseService.deleteThumbnail(courseId)
    res.status(200).json({
      success: true,
      data: course,
      message: 'Thumbnail deleted successfully'
    })
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Course not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    })
  }
}

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  deleteThumbnail
}
