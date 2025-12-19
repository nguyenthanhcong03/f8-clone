export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published'

export interface Lesson {
  lessonId: string
  sectionId: string
  title: string
  videoUrl?: string
  videoPublicId?: string
  content?: string
  order?: number
  createdAt?: string
  updatedAt?: string
  type?: string
}

export interface Section {
  sectionId: string
  title: string
  courseId: string
  order?: number
  createdAt?: string
  updatedAt?: string
  lessons?: Lesson[]
}

export interface Course {
  courseId: string
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnailPublicId?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  isPaid?: boolean
  price?: number
  enrollmentCount?: number
  isPublished?: boolean
  createdBy?: number
  createdAt?: string
  updatedAt?: string
  sections?: Section[]
  isEnrolled?: boolean
}

export interface CourseCreateInput {
  title: string
  slug?: string
  description?: string
  level?: CourseLevel
  isPaid?: boolean
  price?: number
}

export interface CourseUpdateInput {
  title?: string
  slug?: string
  description?: string
  level?: CourseLevel
  isPaid?: boolean
  price?: number
}
