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
  },
  background: {
    light: {
      default: '#fafafa',
      paper: '#ffffff'
      // sidebar: '#ffffff',
    },
    dark: {
      default: '#121212',
      paper: '#1e1e1e'
      // sidebar: '#2a2a2a',
    }
  },
  text: {
    light: {
      primary: '#212121',
      secondary: '#666666'
    },
    dark: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    }
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
    borderRadius: 8
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
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
    secondary: colors.secondary,
    background: {
      default: colors.background.light.default,
      paper: colors.background.light.paper
    },
    text: {
      primary: colors.text.light.primary,
      secondary: colors.text.light.secondary
    }
  }
})

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.background.dark.default,
      paper: colors.background.dark.paper
    },
    text: {
      primary: colors.text.dark.primary,
      secondary: colors.text.dark.secondary
    }
  }
})

// Theme mode type
export type ThemeMode = 'light' | 'dark'

// Export colors for custom usage
export { colors }
