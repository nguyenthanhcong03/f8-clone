import Logo from '@/assets/images/logo.png'
import { login, register } from '@/store/authSlice'
import { useAppDispatch } from '@/store/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowBack, Close, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  Modal,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface ModalAuthProps {
  open: boolean
  onClose: () => void
  type: 'login' | 'register'
}

// Schema for login form
const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

// Schema for register form
const registerSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

const StyledInput = styled(Input)(({ theme }) => ({
  width: '100%',
  padding: '6px 14px',
  borderRadius: 24,
  fontSize: 16,
  backgroundColor: '#f9f9f9',
  border: '1px solid #ccc',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: '#4fc3f7'
  },
  '&.Mui-focused': {
    borderColor: '#4fc3f7',
    backgroundColor: '#fff'
  },
  '&.Mui-error': {
    borderColor: '#f44336'
  }
}))

const ModalAuth = ({ open, onClose, type: initialType }: ModalAuthProps) => {
  const dispatch = useAppDispatch()
  const [type, setType] = useState<'login' | 'register'>(initialType)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Setup react-hook-form with zod validation for login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Setup react-hook-form with zod validation for registration
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleBack = () => {
    setShowEmailForm(false)
    if (type === 'login') {
      resetLoginForm()
    } else {
      resetRegisterForm()
    }
  }

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await dispatch(login({ email: data.email, password: data.password })).unwrap()
      onClose()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await dispatch(
        register({
          name: data.name,
          email: data.email,
          password: data.password
        })
      ).unwrap()
      // Switch to login after successful registration
      setType('login')
      resetLoginForm({ email: data.email, password: '' })
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const toggleAuthType = () => {
    const newType = type === 'login' ? 'register' : 'login'
    setType(newType)
    if (newType === 'login') {
      resetLoginForm()
    } else {
      resetRegisterForm()
    }
  }

  return (
    <Modal
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      open={open}
      onClose={onClose}
      aria-labelledby='modal-auth-title'
      aria-describedby='modal-auth-description'
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 2,
          height: '70%',
          width: '100%',
          maxWidth: 576,
          bgcolor: '#fff',
          borderRadius: 2,
          p: { xs: 4, sm: 10 },
          boxShadow: 24
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#F5F5F5' }} onClick={onClose}>
          <Close />
        </IconButton>
        {showEmailForm && (
          <IconButton sx={{ position: 'absolute', top: 16, left: 16, bgcolor: '#F5F5F5' }} onClick={handleBack}>
            <ArrowBack />
          </IconButton>
        )}
        <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ borderRadius: 1, width: 38, height: 38, overflow: 'hidden', mb: 2 }}>
              <img src={Logo} alt='Logo' width={38} height={38} />
            </Box>
            <Typography variant='h6' component='h2'>
              {type === 'login' ? 'Đăng nhập vào F8' : 'Đăng ký tài khoản F8'}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung sẽ bị khóa.
            </Typography>
          </Box>
          {showEmailForm ? (
            type === 'login' ? (
              <Box component='form' onSubmit={handleLoginSubmit(onLoginSubmit)} sx={{ width: '100%' }}>
                <FormControl fullWidth margin='normal' error={!!loginErrors.email} variant='standard'>
                  {/* <InputLabel htmlFor='email'>Email</InputLabel> */}
                  <StyledInput
                    id='email'
                    disableUnderline
                    autoComplete='email'
                    placeholder='Email'
                    {...registerLogin('email')}
                  />
                  {loginErrors.email && <FormHelperText sx={{ ml: 1 }}>{loginErrors.email.message}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth margin='normal' error={!!loginErrors.password} variant='standard'>
                  {/* <InputLabel htmlFor='password'>Mật khẩu</InputLabel> */}
                  <StyledInput
                    id='password'
                    disableUnderline
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    placeholder='Mật khẩu'
                    {...registerLogin('password')}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleTogglePasswordVisibility}
                          edge='end'
                          size='small'
                        >
                          {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {loginErrors.password && (
                    <FormHelperText sx={{ ml: 1 }}>{loginErrors.password.message}</FormHelperText>
                  )}
                </FormControl>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='secondary'
                  sx={{ mt: 2, py: 1, borderRadius: 8, fontSize: 16 }}
                >
                  Đăng nhập
                </Button>
              </Box>
            ) : (
              <Box component='form' onSubmit={handleRegisterSubmit(onRegisterSubmit)} sx={{ width: '100%' }}>
                <FormControl fullWidth margin='normal' error={!!registerErrors.name} variant='standard'>
                  {/* <InputLabel htmlFor='register-name'>Họ và tên</InputLabel> */}
                  <StyledInput
                    id='register-name'
                    disableUnderline
                    placeholder='Họ và tên'
                    autoComplete='name'
                    {...registerRegister('name')}
                  />
                  {registerErrors.name && <FormHelperText>{registerErrors.name.message}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth margin='normal' error={!!registerErrors.email} variant='standard'>
                  {/* <InputLabel htmlFor='register-email'>Email</InputLabel> */}
                  <StyledInput
                    id='register-email'
                    disableUnderline
                    placeholder='Email'
                    autoComplete='email'
                    {...registerRegister('email')}
                  />
                  {registerErrors.email && <FormHelperText>{registerErrors.email.message}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth margin='normal' error={!!registerErrors.password} variant='standard'>
                  {/* <InputLabel htmlFor='register-password'>Mật khẩu</InputLabel> */}
                  <StyledInput
                    id='register-password'
                    disableUnderline
                    placeholder='Mật khẩu'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    {...registerRegister('password')}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleTogglePasswordVisibility}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {registerErrors.password && <FormHelperText>{registerErrors.password.message}</FormHelperText>}
                </FormControl>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='secondary'
                  sx={{ mt: 2, py: 1, borderRadius: 8, fontSize: 16 }}
                >
                  Đăng ký
                </Button>
              </Box>
            )
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant='outlined'
                startIcon={
                  <Box
                    component='span'
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width='16' height='16'>
                      <path d='M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48z' />
                      <path d='M0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z' />
                    </svg>
                  </Box>
                }
                onClick={() => setShowEmailForm(true)}
                sx={{
                  borderRadius: '9999px',
                  textTransform: 'none',
                  color: 'inherit',
                  border: '1px solid #e8e8e8',
                  py: 1
                }}
              >
                Sử dụng email / số điện thoại
              </Button>

              <Button
                fullWidth
                variant='outlined'
                startIcon={
                  <Box
                    component='span'
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
                  >
                    <svg width='16' height='16' viewBox='0 0 48 48'>
                      <path
                        fill='#FFC107'
                        d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                      ></path>
                      <path
                        fill='#FF3D00'
                        d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                      ></path>
                      <path
                        fill='#4CAF50'
                        d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                      ></path>
                      <path
                        fill='#1976D2'
                        d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                      ></path>
                    </svg>
                  </Box>
                }
                sx={{
                  borderRadius: '9999px',
                  textTransform: 'none',
                  color: 'inherit',
                  border: '1px solid #e8e8e8',
                  py: 1
                }}
              >
                {type === 'login' ? 'Đăng nhập với Google' : 'Đăng ký với Google'}
              </Button>

              <Button
                fullWidth
                variant='outlined'
                startIcon={
                  <Box
                    component='span'
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512' width='16' height='16'>
                      <path
                        fill='#1877f2'
                        d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                      />
                    </svg>
                  </Box>
                }
                sx={{
                  borderRadius: '9999px',
                  textTransform: 'none',
                  color: 'inherit',
                  border: '1px solid #e8e8e8',
                  py: 1
                }}
              >
                {type === 'login' ? 'Đăng nhập với Facebook' : 'Đăng ký với Facebook'}
              </Button>

              <Button
                fullWidth
                variant='outlined'
                startIcon={
                  <Box
                    component='span'
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512' width='16' height='16'>
                      <path
                        fill='#333'
                        d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
                      />
                    </svg>
                  </Box>
                }
                sx={{
                  borderRadius: '9999px',
                  textTransform: 'none',
                  color: 'inherit',
                  border: '1px solid #e8e8e8',
                  py: 1
                }}
              >
                {type === 'login' ? 'Đăng nhập với Github' : 'Đăng ký với Github'}
              </Button>
            </Box>
          )}
          <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {type === 'login' ? (
              <Typography variant='body2'>
                Bạn chưa có tài khoản?{' '}
                <Link href='#' underline='hover' color='primary' onClick={toggleAuthType}>
                  Đăng ký
                </Link>
              </Typography>
            ) : (
              <Typography variant='body2'>
                Bạn đã có tài khoản?{' '}
                <Link href='#' underline='hover' color='primary' onClick={toggleAuthType}>
                  Đăng nhập
                </Link>
              </Typography>
            )}
            <Typography variant='body2' sx={{ textAlign: 'right', mb: 2 }}>
              <Link href='#' underline='hover' color='primary' onClick={() => {}}>
                Quên mật khẩu?
              </Link>
            </Typography>
          </Box>

          <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 3 }}>
            Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với{' '}
            <Link href='#' underline='hover' color='primary'>
              điều khoản sử dụng
            </Link>{' '}
            của chúng tôi.
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}

export default ModalAuth
