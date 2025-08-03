export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published'

export interface Lesson {
  id: number
  section_id: number
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
  id: number
  title: string
  course_id: number
  order?: number
  createdAt?: string
  updatedAt?: string
  lessons?: Lesson[]
}

export interface Course {
  id: number
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnail_public_id?: string
  level?: CourseLevel
  is_paid?: boolean
  price?: number
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
