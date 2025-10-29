export interface CourseAttributes {
  courseId: string
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnailPublicId?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  isPaid: boolean
  price: number | null
  isPublished: boolean
  enrollmentCount: number
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateCourseData = Omit<CourseAttributes, 'courseId' | 'createdAt' | 'updatedAt' | 'enrollmentCount'>

export type UpdateCourseData = Partial<CreateCourseData>
