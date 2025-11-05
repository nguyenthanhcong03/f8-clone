import ApiError from '@/utils/ApiError'
import Section from '../models/section.model'
import Lesson from '../models/lesson.model'

interface CreateSectionData {
  title: string
  courseId: string
  order?: number
}

const createSection = async (sectionData: CreateSectionData) => {
  const section = await Section.create(sectionData)
  return section
}

const updateSection = async (sectionId: string, sectionData: Partial<CreateSectionData>) => {
  const { title } = sectionData
  const section = await Section.findByPk(sectionId)
  if (!section) {
    throw new ApiError(404, 'Chương học không tồn tại')
  }
  // Cập nhật thông tin
  section.title = title ?? section.title
  await section.save()
  return section
}

const deleteSection = async (sectionId: string) => {
  const section = await Section.findByPk(sectionId)
  if (!section) {
    throw new ApiError(404, 'Chương học không tồn tại')
  }
  // Kiểm tra section có chứa lesson nào không
  const lessonCount = await Lesson.count({ where: { sectionId } })
  console.log('lessonCount: ', lessonCount)
  if (lessonCount > 0) {
    throw new ApiError(400, 'Không thể xóa chương chứa bài học')
  }
  // await section.destroy()
  return section
}

const getCourseSectionsById = async (id: string) => {
  const sections = await Section.findAll({
    where: { courseId: id },
    order: [['order', 'ASC']], // nếu có field order
    include: [
      {
        model: Lesson,
        as: 'lessons',
        order: [['order', 'ASC']]
      }
    ]
  })
  return sections
}

const updateSectionOrder = async (courseId: string, sectionIds: string[]) => {
  const sections = await Section.findAll({
    where: { courseId: courseId }
  })

  if (sections.length !== sectionIds.length) {
    throw new ApiError(400, 'Invalid section IDs provided')
  }

  const updatedSections = await Promise.all(
    sectionIds.map((id, index) => {
      const section = sections.find((s) => s.sectionId === id)
      if (!section) {
        throw new ApiError(404, `Section with ID ${id} not found`)
      }
      return section.update({ order: index + 1 })
    })
  )

  return updatedSections
}

export default {
  createSection,
  updateSection,
  deleteSection,
  getCourseSectionsById,
  updateSectionOrder
}
