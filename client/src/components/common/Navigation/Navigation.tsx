import HomeIcon from '@mui/icons-material/Home'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { NavLink } from 'react-router-dom'

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  color: '#000',
  fontSize: '12px',
  width: 70,
  height: 70,
  borderRadius: 15,
  '&:hover': {
    backgroundColor: '#F5F5F5'
  }
}))

const Navigation = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box
      sx={{
        height: isMobile ? 'auto' : '100%',
        display: 'flex',
        gap: 1,
        flexDirection: isMobile ? 'row' : 'column',
        width: isMobile ? '100%' : '96px',
        justifyContent: isMobile ? 'space-around' : 'flex-start',
        alignItems: 'center',
        padding: isMobile ? '8px 0' : '16px 0'
      }}
    >
      <StyledNavLink
        to='/'
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#E8EBED' : undefined
        })}
      >
        <HomeIcon sx={{ mb: 0.5 }} />
        Trang chủ
      </StyledNavLink>
      <StyledNavLink
        to='/learning-paths'
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#E8EBED' : undefined
        })}
      >
        <HomeIcon sx={{ mb: 0.5 }} />
        Lộ trình
      </StyledNavLink>
      <StyledNavLink
        to='/courses'
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#E8EBED' : undefined
        })}
      >
        <HomeIcon sx={{ mb: 0.5 }} />
        Khóa học
      </StyledNavLink>
      <StyledNavLink
        to='/blog'
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#E8EBED' : undefined
        })}
      >
        <HomeIcon sx={{ mb: 0.5 }} />
        Bài viết
      </StyledNavLink>
    </Box>
  )
}

export default Navigation
