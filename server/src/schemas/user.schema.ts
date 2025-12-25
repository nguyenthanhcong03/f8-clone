import { z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .max(50, 'Username must not exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters'),
    avatar: z.string().url('Invalid avatar URL').optional(),
    role: z.enum(['admin', 'student']).optional()
  })
})

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .optional(),
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .max(50, 'Username must not exceed 50 characters')
      .optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters')
      .optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    role: z.enum(['admin', 'student']).optional()
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
})

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
})

export const updateAvatarSchema = z.object({
  body: z.object({
    avatarUrl: z.string().url('Invalid avatar URL')
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>
export type GetUserInput = z.TypeOf<typeof getUserSchema>
export type UpdateAvatarInput = z.TypeOf<typeof updateAvatarSchema>
