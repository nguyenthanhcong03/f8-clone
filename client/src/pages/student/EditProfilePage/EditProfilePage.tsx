import { Loading } from '@/components/common/loading/Loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/lib/constants'
import { updateProfileSchema, type UpdateProfileFormData } from '@/schemas/user.schema'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/api/authApi'
import { getErrorMessage } from '@/services/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, Save } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: '',
      username: '',
      phone: ''
    }
  })

  // Load profile data when available
  useEffect(() => {
    if (profileData) {
      const user = profileData
      form.reset({
        fullName: user.fullName || '',
        username: user.username || '',
        phone: user.phone || ''
      })
      setEmail(user.email || '')
      setAvatarPreview(user.avatar || '')
    }
  }, [profileData, form])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn một tệp hình ảnh hợp lệ')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước tệp vượt quá giới hạn 5MB')
        return
      }

      setAvatarFile(file)

      // Preview image
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile({
        fullName: data.fullName,
        username: data.username,
        phone: data.phone || undefined,
        avatar: avatarFile || undefined
      }).unwrap()

      toast.success('Cập nhật thông tin thành công')

      // Navigate to public profile
      navigate(ROUTES.PUBLIC.PROFILE(data.username))
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error(getErrorMessage(error) || 'Cập nhật thông tin thất bại')
    }
  }

  if (isLoadingProfile) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading message='Đang tải thông tin...' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 dark:bg-inherit'>
      <div className='container mx-auto max-w-4xl px-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Chỉnh sửa hồ sơ</CardTitle>
            <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                {/* Avatar Section */}
                <div className='flex flex-col items-center space-y-4'>
                  <div className='relative'>
                    <Avatar className='h-32 w-32'>
                      <AvatarImage src={avatarPreview} alt={form.watch('fullName')} />
                      <AvatarFallback className='text-3xl'>{form.watch('fullName')?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button
                      type='button'
                      onClick={handleAvatarClick}
                      className='absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90'
                    >
                      <Camera className='h-5 w-5' />
                    </button>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <p className='text-sm text-muted-foreground'>Nhấp vào icon camera để thay đổi ảnh đại diện</p>
                  {avatarFile && <p className='text-sm text-green-600'>Đã chọn: {avatarFile.name}</p>}
                </div>

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Họ và tên <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập họ và tên' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên người dùng <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên người dùng' {...field} />
                      </FormControl>
                      <FormDescription>
                        URL của bạn: {window.location.origin}/{field.value}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email (Read only) */}
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input value={email} disabled className='bg-gray-100' />
                  </FormControl>
                  <FormDescription>Email không thể thay đổi</FormDescription>
                </FormItem>

                {/* Phone */}
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập số điện thoại' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className='flex gap-4'>
                  <Button type='submit' disabled={isUpdating} className='flex-1'>
                    {isUpdating ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                  <Button type='button' variant='outline' onClick={() => navigate(-1)} disabled={isUpdating}>
                    Hủy
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditProfilePage
