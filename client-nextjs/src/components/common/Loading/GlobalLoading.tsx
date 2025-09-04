import { useAppSelector } from '@/store/hook'
import { Box, CircularProgress, Paper, Typography, alpha } from '@mui/material'
import { useEffect, useState } from 'react'
import Logo from '@/assets/images/logo.png'

const GlobalLoading = () => {
  const { globalLoading } = useAppSelector((state) => state.app)
  console.log('GlobalLoading component rendered with globalLoading:', globalLoading)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (globalLoading) {
      console.log('Global loading is active')
      setIsLoading(true)
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }, [globalLoading])

  return (
    <>
      <Paper
        sx={{
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? 'auto' : 'none',
          transition: 'all .5s ease',
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(135deg, 
          ${alpha('#000000', 0.95)} 0%, 
          ${alpha('#141414', 0.95)} 50%, 
          ${alpha('#000000', 0.95)} 100%
        )`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}
        >
          {/* Logo with pulse animation */}
          <Box
            sx={{
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
          >
            <img src={Logo} alt='Logo' />
          </Box>

          {/* Loading spinner */}
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }}
          />

          {/* Loading text */}
          <Typography
            variant='h6'
            sx={{
              color: 'primary.contrastText',
              fontWeight: 500,
              opacity: 0.8,
              animation: 'fadeInOut 2s infinite',
              '@keyframes fadeInOut': {
                '0%': { opacity: 0.5 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.5 }
              }
            }}
          >
            Đang tải...
          </Typography>
        </Box>
      </Paper>
    </>
  )
}

export default GlobalLoading
