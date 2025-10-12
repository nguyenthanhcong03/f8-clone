import React from 'react'
import { useAppSelector } from '@/store/hook'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeMode = useAppSelector((state) => state.theme.mode)

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (themeMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  }, [themeMode])

  return <>{children}</>
}

export default ThemeProvider
