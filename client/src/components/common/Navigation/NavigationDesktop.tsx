import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import { Box } from '@mui/material'
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

const NavigationDesktop = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        gap: 1,
        flexDirection: 'column',
        width: '96px',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '16px 0'
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
        <MapIcon sx={{ mb: 0.5 }} />
        Lộ trình
      </StyledNavLink>
      <StyledNavLink
        to='/blog'
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#E8EBED' : undefined
        })}
      >
        <NewspaperIcon sx={{ mb: 0.5 }} />
        Bài viết
      </StyledNavLink>
    </Box>
  )
}

export default NavigationDesktop
