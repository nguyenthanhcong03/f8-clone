import { z } from 'zod'

// Schema cho việc tạo course mới
export const createCourseSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(255, 'Title must not exceed 255 characters'),

    slug: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true // Allow empty slug
          return /^[a-z0-9-]+$/.test(val)
        },
        {
          message: 'Slug can only contain lowercase letters, numbers and hyphens'
        }
      ),

    description: z
      .string()
      .optional()
      .refine((val) => !val || val.length <= 1000, {
        message: 'Description must not exceed 1000 characters'
      }),

    level: z.enum(['beginner', 'intermediate', 'advanced'] as const).default('beginner'),

    is_paid: z.boolean().default(false),

    price: z.number().min(0, 'Price must be positive').optional(),

    thumbnail: z
      .union([z.instanceof(File), z.string()])
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          if (val instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            return allowedTypes.includes(val.type)
          }
          return true
        },
        {
          message: 'Thumbnail must be a valid image file (JPEG, PNG, WebP)'
        }
      )
  })
  .refine(
    (data) => {
      // If course is paid, price must be provided and > 0
      if (data.is_paid && (!data.price || data.price <= 0)) {
        return false
      }
      return true
    },
    {
      message: 'Paid courses must have a valid price greater than 0',
      path: ['price']
    }
  )

// Schema cho việc cập nhật course
export const updateCourseSchema = createCourseSchema.partial()

// Schema cho form input
export const courseFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().optional(),
    description: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced'] as const),
    is_paid: z.boolean(),
    price: z.union([z.string(), z.number()]).optional(),
    thumbnail: z
      .union([z.instanceof(File), z.string()])
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          if (val instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            return allowedTypes.includes(val.type)
          }
          return true
        },
        {
          message: 'Thumbnail must be a valid image file (JPEG, PNG, WebP)'
        }
      )
  })
  .refine(
    (data) => {
      if (data.is_paid) {
        const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price
        return price && price > 0
      }
      return true
    },
    {
      message: 'Paid courses must have a valid price greater than 0',
      path: ['price']
    }
  )

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
export type CourseFormInput = z.infer<typeof courseFormSchema>
