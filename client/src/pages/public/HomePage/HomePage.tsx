import { register } from '@/store/authSlice'
import { useAppDispatch } from '@/store/hook'
import { Button } from '@mui/material'
import { useEffect } from 'react'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const handleRegister = async () => {
    dispatch(
      register({
        name: 'Nguyen Thanh Cong',
        email: 'user1@gmail.com',
        password: '123456'
      } as any)
    )
  }
  return (
    <div>
      HomePage
      <Button variant='contained' color='primary' onClick={handleRegister}>
        Register
      </Button>
    </div>
  )
}

export default HomePage
