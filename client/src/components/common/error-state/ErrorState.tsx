import { Button } from '@/components/ui/button'
import React from 'react'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Có lỗi xảy ra, vui lòng thử lại', onRetry }) => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <p className='mb-4 font-medium text-red-500'>{message}</p>
      <Button onClick={onRetry} variant={'outline'} className='rounded-md px-4 py-2 transition'>
        Thử lại
      </Button>
    </div>
  )
}
