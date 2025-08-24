import Logo from '@/assets/images/logo.png'
import { useAppSelector } from '@/store/hook'
import { AccountCircle, Notifications as NotificationsIcon, Search as SearchIcon } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModalAuth from '../ModalAuth'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

export const HEADER_HEIGHT = '66px'

// Styled components
const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  alignContent: 'center',
  borderRadius: 24,
  border: `2px solid #e8e8e8`,
  transition: 'border-color 0.3s ease',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  '&:focus-within': {
    border: '2px solid #444444'
  },
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#7C7C7C',
  '&:hover': {
    color: '#444444'
  }
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    fontSize: 14,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch'
    }
  }
}))

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center'
}))

// Main component
const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false)

  // State for user menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const [openModalAuth, setOpenModalAuth] = useState(false)
  const [typeModalAuth, setTypeModalAuth] = useState<'login' | 'register'>('login')
  const handleOpenModalAuth = (type: 'register' | 'login') => {
    setTypeModalAuth(type)
    setOpenModalAuth(true)
  }
  const handleCloseModalAuth = () => setOpenModalAuth(false)

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Handle user menu open/close
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // User menu for desktop
  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
          {user?.avatar ? (
            <Avatar alt={user.name} src={user.avatar} sx={{ width: 60, height: 60 }} />
          ) : (
            <AccountCircle sx={{ fontSize: 60 }} />
          )}
          <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
            {user?.name}
          </Typography>
        </Box>
        <MenuItem
          sx={{ borderRadius: 1 }}
          onClick={() => {
            handleMenuClose()
            navigate('/profile')
          }}
        >
          Trang cá nhân
        </MenuItem>
        <MenuItem
          sx={{ borderRadius: 1 }}
          onClick={() => {
            handleMenuClose()
            navigate('/dashboard')
          }}
        >
          Bảng điều khiển
        </MenuItem>
        <MenuItem
          sx={{ borderRadius: 1 }}
          onClick={() => {
            handleMenuClose()
            navigate('/settings')
          }}
        >
          Cài đặt
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ borderRadius: 1 }}
          onClick={() => {
            handleMenuClose()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
          }}
        >
          Đăng xuất
        </MenuItem>
      </Box>
    </Menu>
  )

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{ height: HEADER_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Logo */}
          <StyledLink to='/'>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Box sx={{ borderRadius: 2, width: 38, height: 38, overflow: 'hidden' }}>
                <img src={Logo} alt='Logo' width={38} height={38} />
              </Box>
              {!isMobile && (
                <Typography
                  noWrap
                  component='span'
                  sx={{ ml: 2, fontSize: 14, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}
                >
                  Học lập trình để đi làm
                </Typography>
              )}
            </Box>
          </StyledLink>

          {/* Search bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder='Tìm kiếm khóa học, bài viết...' inputProps={{ 'aria-label': 'search' }} />
          </Search>

          <Box>
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notification icon */}
            <IconButton disableRipple size='medium' color='inherit'>
              <Badge badgeContent={5} color='error'>
                <NotificationsIcon color='action' sx={{ '&:hover': { color: '#333' } }} />
              </Badge>
            </IconButton>

            {/* User section */}
            {isAuthenticated ? (
              <IconButton
                size='small'
                edge='end'
                aria-label='account of current user'
                aria-haspopup='true'
                onClick={handleProfileMenuOpen}
                color='inherit'
                disableRipple
              >
                {user?.avatar ? (
                  <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle fontSize='large' color='action' />
                )}
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color='inherit'
                  disableRipple
                  sx={{
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => handleOpenModalAuth('register')}
                >
                  Đăng ký
                </Button>

                <Button
                  variant='contained'
                  color='primary'
                  sx={{ borderRadius: 8, fontWeight: '600' }}
                  onClick={() => handleOpenModalAuth('login')}
                >
                  Đăng nhập
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* User menu */}
      {userMenu}

      {/* Modal Auth */}
      <ModalAuth open={openModalAuth} onClose={handleCloseModalAuth} type={typeModalAuth} />
    </AppBar>
  )
}

export default Header
