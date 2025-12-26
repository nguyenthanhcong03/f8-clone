import ThemeToggle from '@/components/common/theme-toggle/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Bell, Search } from 'lucide-react'
import React from 'react'

const ActionButton: React.FC = () => {
  return (
    <div>
      {/* Search mobile */}
      <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-muted/50 lg:hidden'>
        <Search className='h-4 w-4 text-muted-foreground' />
      </div>
      {/* Theme toggle */}
      <ThemeToggle />

      {/* Notification icon */}
      <Button variant='ghost' size='icon' className='relative'>
        <Bell className='h-5 w-5' />
        <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
          5
        </span>
      </Button>
    </div>
  )
}

export default ActionButton
