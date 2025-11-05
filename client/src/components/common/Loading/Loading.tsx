import React from 'react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Đang tải...', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  }

  const spinner = (
    <div
      className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
      role='status'
    />
  )

  if (fullScreen) {
    return (
      <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm'>
        {spinner}
        <p className='mt-3 text-sm text-muted-foreground'>{message}</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center py-6'>
      {spinner}
      <p className='mt-2 text-sm text-muted-foreground'>{message}</p>
    </div>
  )
}
