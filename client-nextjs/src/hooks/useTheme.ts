import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import { setTheme, toggleTheme } from '../store/themeSlice'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector((state) => state.theme.mode)
  const muiTheme = useMuiTheme()

  const handleToggleTheme = () => {
    dispatch(toggleTheme())
  }

  const handleSetTheme = (mode: 'light' | 'dark') => {
    dispatch(setTheme(mode))
  }

  return {
    mode: themeMode,
    theme: muiTheme,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light'
  }
}

export default useTheme
