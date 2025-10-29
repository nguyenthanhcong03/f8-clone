export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published'

export interface Lesson {
  lessonId: string
  sectionId: string
  title?: string
  video_url?: string
  video_publicId?: string
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
  thumbnail_publicId?: string
  level?: CourseLevel
  is_paid?: boolean
  price?: number
  enrollment_count?: number
  status?: CourseStatus
  created_by?: number
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
  is_paid?: boolean
  price?: number
}

export interface CourseUpdateInput {
  title?: string
  slug?: string
  description?: string
  level?: CourseLevel
  is_paid?: boolean
  price?: number
}
