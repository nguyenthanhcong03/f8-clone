export interface User {
  userId: number
  fullName: string
  username: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'student'
}
