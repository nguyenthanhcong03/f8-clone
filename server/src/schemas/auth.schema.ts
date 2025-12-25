import { z } from 'zod'

export const RegisterAccountSchema = z.object({
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
export const LoginAccountSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
})
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'New password must not exceed 100 characters')
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID')
  })
})
export type RegisterAccountInput = z.infer<typeof RegisterAccountSchema>
export type LoginAccountInput = z.infer<typeof LoginAccountSchema>
export type ChangePasswordInput = z.TypeOf<typeof changePasswordSchema>
