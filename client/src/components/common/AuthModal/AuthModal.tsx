'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Logo from '@/assets/images/logo.png'
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi'
import { toast } from 'react-toastify'

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
  const [type, setType] = useState<'login' | 'register'>(initialType)
  const [showPassword, setShowPassword] = useState(false)
  const [register, { isLoading: registerIsLoading }] = useRegisterMutation()
  const [login, { isLoading: loginIsLoading }] = useLoginMutation()

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
      await login(data).unwrap()
      toast.success('Đăng nhập thành công!')
      onClose()
    } catch (err) {
      console.log(err)
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    }
  }

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data).unwrap()
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      setType('login')
      loginForm.reset({ email: data.email, password: '' })
    } catch (err) {
      console.log(err)
      toast.error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md rounded-2xl p-6'>
        <div className='flex justify-between'>
          <DialogClose className='absolute right-4 top-4 rounded-full bg-[#E9F1F8] p-2'>
            <X className='h-5 w-5' />
          </DialogClose>
        </div>
        <DialogHeader>
          <DialogTitle>
            <div className='flex flex-col items-center justify-center gap-4'>
              <img src={Logo} alt='Logo' className='h-10 w-10 rounded-lg' />
              <h1 className='text-3xl font-bold'>{type === 'login' ? 'Đăng nhập vào F8' : 'Đăng ký tài khoản F8'}</h1>
            </div>
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-muted-foreground'>
            Mỗi người nên sử dụng riêng một tài khoản, tài khoản dùng chung sẽ bị khóa.
          </DialogDescription>
        </DialogHeader>
        {type === 'login' ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className='mt-4 flex flex-col gap-4'>
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
              <Button type='submit' className='w-full rounded-lg' disabled={loginIsLoading}>
                {loginIsLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Đăng nhập'}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className='mt-4 flex flex-col gap-4'>
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
              <Button type='submit' className='w-full rounded-lg' disabled={registerIsLoading}>
                {registerIsLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Đăng ký'}
              </Button>
            </form>
          </Form>
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
        <p className='mt-4 text-center text-xs text-muted-foreground'>
          Việc bạn tiếp tục sử dụng đồng nghĩa bạn đồng ý với{' '}
          <span className='cursor-pointer text-primary hover:underline'>điều khoản sử dụng</span>.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default ModalAuth
