import React from 'react'
import { PackageX } from 'lucide-react'

interface NoDataProps {
  message?: string
  subMessage?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const NoData: React.FC<NoDataProps> = ({ message = 'Không có dữ liệu', subMessage, icon, action }) => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center text-muted-foreground'>
      <div className='mb-3 text-gray-400'>{icon ?? <PackageX size={48} />}</div>
      <p className='text-lg font-medium'>{message}</p>
      {subMessage && <p className='mt-1 text-sm'>{subMessage}</p>}
      {action && <div className='mt-4'>{action}</div>}
    </div>
  )
}
