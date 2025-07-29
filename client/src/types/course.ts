export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

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
  created_by?: number
  createdAt?: string
  updatedAt?: string
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
