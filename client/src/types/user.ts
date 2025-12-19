export interface User {
  userId: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'student'
}
