import { register } from '@/store/authSlice'
import { useAppDispatch } from '@/store/hook'
import { Button } from '@mui/material'
import { useEffect } from 'react'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const handleRegister = async () => {
    dispatch(
      register({
        name: 'JohnDoe',
        email: 'user1234567@gamil.com',
        password: 'password@123'
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
