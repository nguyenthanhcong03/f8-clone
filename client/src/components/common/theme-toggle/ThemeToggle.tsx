import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '../../../hooks/useTheme'

interface ThemeToggleProps {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'default', variant = 'ghost' }) => {
  const { mode, toggleTheme } = useTheme()

  return (
    <Button variant={variant} size={size} onClick={toggleTheme} aria-label='toggle theme' className='h-10 w-10 p-0'>
      {mode === 'dark' ? <Sun className='h-[1.2rem] w-[1.2rem]' /> : <Moon className='h-[1.2rem] w-[1.2rem]' />}
    </Button>
  )
}

export default ThemeToggle
