import { Request, Response } from 'express'
import uploadService from '../services/upload.service'
import asyncHandler from '@/utils/asyncHandler'
import sectionService from '../services/section.service'

const createSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await sectionService.createSection(req.body)
  res.status(200).json({
    success: true,
    data: section,
    message: 'Tạo chương học thành công'
  })
})

const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const sectionId = req.params.id
  const section = await sectionService.updateSection(sectionId, req.body)
  res.status(200).json({
    success: true,
    data: section,
    message: 'Cập nhật chương học thành công'
  })
})

const deleteSection = asyncHandler(async (req: Request, res: Response) => {
  const sectionId = req.params.id
  console.log('sectionId: ', sectionId)
  const section = await sectionService.deleteSection(sectionId)
  res.status(200).json({
    success: true,
    data: section,
    message: 'Xóa chương học thành công'
  })
})

const getCourseSections = asyncHandler(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)
  const sections = await sectionService.getCourseSectionsById(courseId)
  res.status(200).json({
    success: true,
    data: sections,
    message: 'Lấy danh sách chương học thành công'
  })
})

const updateSectionOrder = asyncHandler(async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.id)
  const { sectionIds } = req.body
  const sections = await sectionService.updateSectionOrder(courseId, sectionIds)
  res.status(200).json({
    success: true,
    data: sections,
    message: 'Cập nhật thứ tự chương học thành công'
  })
})

export default {
  createSection,
  updateSection,
  deleteSection,
  getCourseSections,
  updateSectionOrder
}
