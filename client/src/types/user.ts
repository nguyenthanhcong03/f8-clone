export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'student'
}
