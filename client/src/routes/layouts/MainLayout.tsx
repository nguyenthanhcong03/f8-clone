import Header, { HEADER_HEIGHT } from '@/components/common/Header/Header'
import GlobalLoading from '@/components/common/Loading/GlobalLoading'
import Navigation from '@/components/common/Navigation/Navigation'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'

const NAVIGATION_WIDTH = '96px'

const MainLayout = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <GlobalLoading />

      <Box sx={{ minHeight: '100vh' }}>
        <Header />

        {/* Main content area */}
        <Box
          sx={{
            padding: '40px',
            marginLeft: isMobile ? 0 : NAVIGATION_WIDTH,
            marginBottom: isMobile ? '56px' : 0,
            minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>

        {/* Navigation - fixed position */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            ...(isMobile
              ? { bottom: 0, width: '100%' }
              : { top: HEADER_HEIGHT, width: NAVIGATION_WIDTH, height: `calc(100vh - ${HEADER_HEIGHT})` }),
            zIndex: 1000,
            bgcolor: '#fff'
          }}
        >
          <Navigation />
        </Box>
      </Box>
    </>
  )
}

export default MainLayout
