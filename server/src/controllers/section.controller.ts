import { Request, Response } from 'express'
import uploadService from '../services/upload.service'
import catchAsync from '@/utils/catchAsync'
import sectionService from '../services/section.service'

const createSection = catchAsync(async (req: Request, res: Response) => {
  const section = await sectionService.createSection(req.body)
  res.status(200).json({
    success: true,
    data: section,
    message: 'Tạo chương học thành công'
  })
})

const getCourseSections = catchAsync(async (req: Request, res: Response) => {
  console.log('hahah')
  const courseId = parseInt(req.params.id)
  const sections = await sectionService.getCourseSectionsById(courseId)
  res.status(200).json({
    success: true,
    data: sections,
    message: 'Lấy danh sách chương học thành công'
  })
})

const updateSectionOrder = catchAsync(async (req: Request, res: Response) => {
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
  getCourseSections,
  updateSectionOrder
}
