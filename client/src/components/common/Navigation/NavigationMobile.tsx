import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import { Box, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { NavLink } from 'react-router-dom'

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  color: '#797979',
  fontSize: '12px',
  fontWeight: 500,
  width: 70,
  height: 70,
  borderRadius: 15,
  '&:hover': {
    backgroundColor: '#F5F5F5'
  }
}))

const NavigationMobile = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '60px',
        gap: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '16px 0'
      }}
    >
      <StyledNavLink to='/'>
        {({ isActive }) => (
          <>
            <HomeIcon color={isActive ? 'primary' : 'inherit'} sx={{ mb: 0.5 }} />
            <Typography variant='caption' fontWeight={500} color={isActive ? '#000' : 'inherit'}>
              Trang chủ
            </Typography>
          </>
        )}
      </StyledNavLink>
      <StyledNavLink to='/learning-paths'>
        {({ isActive }) => (
          <>
            <MapIcon color={isActive ? 'primary' : 'inherit'} sx={{ mb: 0.5 }} />
            <Typography variant='caption' fontWeight={500} color={isActive ? '#000' : 'inherit'}>
              Lộ trình
            </Typography>
          </>
        )}
      </StyledNavLink>
      <StyledNavLink to='/blog'>
        {({ isActive }) => (
          <>
            <NewspaperIcon color={isActive ? 'primary' : 'inherit'} sx={{ mb: 0.5 }} />
            <Typography variant='caption' fontWeight={500} color={isActive ? '#000' : 'inherit'}>
              Bài viết
            </Typography>
          </>
        )}
      </StyledNavLink>
    </Box>
  )
}

export default NavigationMobile
