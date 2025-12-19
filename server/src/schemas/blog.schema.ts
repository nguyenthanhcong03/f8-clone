import { z } from 'zod'

// Blog Category Schemas
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tên thể loại không được để trống').max(100, 'Tên thể loại không được quá 100 ký tự'),
    slug: z.string().min(1, 'Slug không được để trống').max(100, 'Slug không được quá 100 ký tự'),
    description: z.string().optional()
  })
})

export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Tên thể loại không được để trống')
      .max(100, 'Tên thể loại không được quá 100 ký tự')
      .optional(),
    slug: z.string().min(1, 'Slug không được để trống').max(100, 'Slug không được quá 100 ký tự').optional(),
    description: z.string().optional()
  })
})

// Blog Schemas
export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').max(255, 'Tiêu đề không được quá 255 ký tự'),
    slug: z.string().min(1, 'Slug không được để trống').max(255, 'Slug không được quá 255 ký tự'),
    content: z.string().min(1, 'Nội dung không được để trống'),
    categoryId: z.string().optional()
  })
})

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').max(255, 'Tiêu đề không được quá 255 ký tự').optional(),
    slug: z.string().min(1, 'Slug không được để trống').max(255, 'Slug không được quá 255 ký tự').optional(),
    content: z.string().min(1, 'Nội dung không được để trống').optional(),
    categoryId: z.string().optional()
  })
})
