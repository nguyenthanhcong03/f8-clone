import { createTheme } from '@mui/material/styles'

// Define color palette
const colors = {
  primary: {
    light: '#ff6b35',
    main: '#F05123',
    dark: '#ff6b35',
    // dark: '#c62828',
    contrastText: '#ffffff'
  },
  secondary: {
    light: '#2CCEFB',
    main: '#4fc3f7',
    dark: '#2CCEFB',
    // dark: '#0097a7',
    contrastText: '#ffffff'
  }
}

// Base theme options
const baseTheme = {
  typography: {
    fontSize: 14, // base font size (1rem = 14px)
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  shape: {
    // borderRadius: 8
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none' as const
          // borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    }
  }
}

// Light theme
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary
  }
})

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary
  }
})

// Theme mode type
export type ThemeMode = 'light' | 'dark'

// Export colors for custom usage
export { colors }
