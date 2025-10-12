export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published'

export interface Lesson {
  lesson_id: string
  section_id: string
  title?: string
  video_url?: string
  video_public_id?: string
  content?: string
  order?: number
  createdAt?: string
  updatedAt?: string
  type?: string
}

export interface Section {
  section_id: string
  title: string
  course_id: string
  order?: number
  createdAt?: string
  updatedAt?: string
  lessons?: Lesson[]
}

export interface Course {
  course_id: string
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnail_public_id?: string
  level?: CourseLevel
  is_paid?: boolean
  price?: number
  enrollment_count?: number
  status?: CourseStatus
  created_by?: number
  createdAt?: string
  updatedAt?: string
  sections?: Section[]
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
