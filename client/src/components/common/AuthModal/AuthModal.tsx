'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Eye, EyeOff, X } from 'lucide-react'

import Logo from '@/assets/images/logo.png'
import { useAppDispatch } from '@/store/hook'
import { showSnackbar } from '@/store/snackbarSlice'
import { login, register } from '@/store/features/auth/authSlice'

interface ModalAuthProps {
  open: boolean
  onClose: () => void
  type: 'login' | 'register'
}

// schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

const registerSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

const ModalAuth = ({ open, onClose, type: initialType }: ModalAuthProps) => {
  const dispatch = useAppDispatch()
  const [type, setType] = useState<'login' | 'register'>(initialType)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' }
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await dispatch(login(data)).unwrap()
      dispatch(showSnackbar({ message: 'Đăng nhập thành công.', severity: 'success' }))
      onClose()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await dispatch(register(data)).unwrap()
      dispatch(showSnackbar({ message: 'Đăng ký thành công! Vui lòng đăng nhập.', severity: 'success' }))
      setType('login')
      loginForm.reset({ email: data.email, password: '' })
    } catch (err) {
      console.error('Register failed:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md p-6 rounded-2xl'>
        <div className='flex justify-between'>
          {showEmailForm && (
            <Button variant='ghost' onClick={() => setShowEmailForm(false)}>
              Quay lại
            </Button>
          )}
          <DialogClose className='absolute right-4 top-4 bg-[#E9F1F8] p-2 rounded-full'>
            <X className='h-5 w-5' />
          </DialogClose>
        </div>
        <DialogHeader>
          <DialogTitle>
            <div className='flex items-center flex-col justify-center gap-4 '>
              <img src={Logo} alt='Logo' className='w-10 h-10 rounded-lg' />
              <h1 className='text-3xl font-bold'>{type === 'login' ? 'Đăng nhập vào F8' : 'Đăng ký tài khoản F8'}</h1>
            </div>
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            Mỗi người nên sử dụng riêng một tài khoản, tài khoản dùng chung sẽ bị khóa.
          </DialogDescription>
        </DialogHeader>

        {/* Form chính */}
        {showEmailForm ? (
          type === 'login' ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className='flex flex-col gap-4 mt-4'>
                <FormField
                  control={loginForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <Input placeholder='Email' type='email' {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Mật khẩu</Label>
                      <div className='relative'>
                        <Input placeholder='Mật khẩu' type={showPassword ? 'text' : 'password'} {...field} />
                        <button
                          type='button'
                          className='absolute right-2 top-1/2 -translate-y-1/2'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full rounded-lg'>
                  Đăng nhập
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className='flex flex-col gap-4 mt-4'>
                <FormField
                  control={registerForm.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Họ và tên</Label>
                      <Input placeholder='Họ và tên' {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <Input placeholder='Email' type='email' {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Mật khẩu</Label>
                      <div className='relative'>
                        <Input placeholder='Mật khẩu' type={showPassword ? 'text' : 'password'} {...field} />
                        <button
                          type='button'
                          className='absolute right-2 top-1/2 -translate-y-1/2'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full rounded-lg'>
                  Đăng ký
                </Button>
              </form>
            </Form>
          )
        ) : (
          <div className='flex flex-col gap-3 mt-4'>
            <Button variant='outline' className='rounded-full' onClick={() => setShowEmailForm(true)}>
              Sử dụng email / số điện thoại
            </Button>
            <Button variant='outline' className='rounded-full'>
              {type === 'login' ? 'Đăng nhập với Google' : 'Đăng ký với Google'}
            </Button>
            <Button variant='outline' className='rounded-full'>
              {type === 'login' ? 'Đăng nhập với Facebook' : 'Đăng ký với Facebook'}
            </Button>
            <Button variant='outline' className='rounded-full'>
              {type === 'login' ? 'Đăng nhập với Github' : 'Đăng ký với Github'}
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className='mt-6 text-center text-sm'>
          {type === 'login' ? (
            <p>
              Bạn chưa có tài khoản?{' '}
              <button className='text-primary hover:underline' onClick={() => setType('register')}>
                Đăng ký
              </button>
            </p>
          ) : (
            <p>
              Bạn đã có tài khoản?{' '}
              <button className='text-primary hover:underline' onClick={() => setType('login')}>
                Đăng nhập
              </button>
            </p>
          )}
          <p className='mt-2'>
            <button className='text-primary hover:underline'>Quên mật khẩu?</button>
          </p>
        </div>

        <p className='text-xs text-muted-foreground mt-4 text-center'>
          Việc bạn tiếp tục sử dụng đồng nghĩa bạn đồng ý với{' '}
          <span className='text-primary hover:underline cursor-pointer'>điều khoản sử dụng</span>.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default ModalAuth
