import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setTheme, toggleTheme } from '../store/features/theme/themeSlice'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector((state) => state.theme.mode)

  const handleToggleTheme = () => {
    dispatch(toggleTheme())
  }

  const handleSetTheme = (mode: 'light' | 'dark') => {
    dispatch(setTheme(mode))
  }

  return {
    mode: themeMode,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light'
  }
}

export default useTheme
