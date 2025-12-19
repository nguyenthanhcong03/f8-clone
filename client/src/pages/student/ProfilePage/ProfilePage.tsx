import AppLoader from '@/components/common/loading/AppLoader'
import { useGetProfileQuery, useUpdateUserMutation } from '@/services/api/authApi'
import { useState } from 'react'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const [name, setName] = useState('')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const { data: user, isLoading, isError, error, refetch } = useGetProfileQuery()
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading }] = useUpdateUserMutation()

  const onChangeProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
    }
  }

  const handleUpdateProfile = async () => {
    const formData = new FormData()
    formData.append('name', name)
    if (profilePicture) {
      formData.append('profilePicture', profilePicture)
    }
    try {
      await updateUser(formData).unwrap()
      // Hiển thị thông báo thành công hoặc thực hiện các hành động khác
      refetch()
      toast.success('Cập nhật hồ sơ thành công')
    } catch (err) {
      // Xử lý lỗi nếu có
      toast.error('Cập nhật hồ sơ thất bại')
    }
  }

  if (isLoading) {
    return <AppLoader />
  }

  if (isError) {
    return (
      <div className='p-6 text-center'>
        <p className='text-red-600'>Không thể tải thông tin người dùng.</p>
        <button onClick={() => refetch()} className='mt-3 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
          Thử lại
        </button>
      </div>
    )
  }

  if (!user) {
    return <p className='text-center text-gray-600'>Không có dữ liệu người dùng.</p>
  }

  return (
    <div className='mx-auto max-w-md rounded-xl bg-white p-6 shadow'>
      <h1 className='mb-4 text-center text-2xl font-semibold'>Hồ sơ cá nhân</h1>

      <div className='flex flex-col items-center gap-3'>
        <img
          src={user.avatar || 'https://placehold.co/100x100'}
          alt='avatar'
          className='h-24 w-24 rounded-full object-cover'
        />
        <h2 className='text-xl font-medium'>{user.name}</h2>
        <p className='text-gray-600'>{user.email}</p>
      </div>

      <div className='mt-6 space-y-2 text-sm text-gray-700'>
        <p>
          <strong>Username:</strong> {user.email}
        </p>
      </div>

      <button
        onClick={() => refetch()}
        className='mt-6 w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700'
      >
        Làm mới
      </button>
    </div>
  )
}

export default ProfilePage
