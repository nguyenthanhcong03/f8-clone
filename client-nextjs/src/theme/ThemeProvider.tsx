import { useAppSelector } from '@/store/hook'
import { darkTheme, lightTheme } from '@/theme/theme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeMode = useAppSelector((state) => state.theme.mode)

  const theme = themeMode === 'dark' ? darkTheme : lightTheme

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

export default ThemeProvider
