export type BlogStatus = 'draft' | 'published'

export interface BlogCategory {
  categoryId: string
  name: string
  slug: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Blog {
  blogId: string
  title: string
  slug: string
  content: string
  categoryId?: string
  category?: BlogCategory
  authorId: string
  author?: {
    userId: string
    name: string
    avatar?: string
  }
  thumbnail?: string
  thumbnailPublicId?: string
  status: BlogStatus
  likes?: number
  publishedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateBlogData {
  title: string
  slug: string
  content: string
  categoryId?: string
  thumbnail?: string
  thumbnailPublicId?: string
  status?: BlogStatus
}

export interface UpdateBlogData {
  title?: string
  slug?: string
  content?: string
  categoryId?: string
  thumbnail?: string
  thumbnailPublicId?: string
  status?: BlogStatus
}
