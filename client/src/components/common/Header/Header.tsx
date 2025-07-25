import Logo from '@/assets/images/logo.png'
import { useAppSelector } from '@/store/hook'
import ModalAuth from '../ModalAuth'
import {
  AccountCircle,
  Book as BookIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Route as RouteIcon,
  School as SchoolIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import ThemeToggle from '../ThemeToggle/ThemeToggle'

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

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

  // Drawer content for mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 240 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={Logo} alt='Logo' width={32} height={32} style={{ marginRight: 8 }} />
        <Typography variant='subtitle1' fontWeight='bold'>
          F8 Clone
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Trang chủ' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/learning-paths')}>
            <ListItemIcon>
              <RouteIcon />
            </ListItemIcon>
            <ListItemText primary='Lộ trình' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/courses')}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary='Khóa học' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/blog')}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary='Blog' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Avatar alt={user?.name} src={user?.avatar || undefined} />
            <Typography>{user?.name}</Typography>
            <Button variant='outlined' fullWidth onClick={() => handleNavigation('/dashboard')}>
              Bảng điều khiển
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant='contained' fullWidth onClick={() => handleNavigation('/login')}>
              Đăng nhập
            </Button>

            <Button variant='outlined' fullWidth onClick={() => handleNavigation('/register')}>
              Đăng ký
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )

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
      <MenuItem
        onClick={() => {
          handleMenuClose()
          navigate('/profile')
        }}
      >
        Trang cá nhân
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose()
          navigate('/dashboard')
        }}
      >
        Bảng điều khiển
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose()
          navigate('/settings')
        }}
      >
        Cài đặt
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Đăng xuất</MenuItem>
    </Menu>
  )

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ minHeight: '66px' }}>
          {/* Mobile hamburger menu */}
          {isMobile && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <StyledLink to='/'>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Box sx={{ borderRadius: 1, width: 38, height: 38, overflow: 'hidden' }}>
                <img src={Logo} alt='Logo' width={38} height={38} />
              </Box>
              {!isMobile && (
                <Typography
                  // variant='subtitle1'
                  noWrap
                  component='span'
                  sx={{ ml: 2, fontSize: 14, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}
                >
                  Học lập trình để đi làm
                </Typography>
              )}
            </Box>
          </StyledLink>

          {/* Desktop navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              <Button color='inherit' component={Link} to='/'>
                Trang chủ
              </Button>
              <Button color='inherit' component={Link} to='/learning-paths'>
                Lộ trình
              </Button>
              <Button color='inherit' component={Link} to='/courses'>
                Khóa học
              </Button>
              <Button color='inherit' component={Link} to='/blog'>
                Blog
              </Button>
            </Box>
          )}

          {/* Search bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder='Tìm kiếm khóa học, bài viết...' inputProps={{ 'aria-label': 'search' }} />
          </Search>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notification icon */}
          <IconButton size='large' aria-label='show notifications' color='inherit'>
            <Badge badgeContent={5} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User section */}
          {isAuthenticated ? (
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              {user?.avatar ? (
                <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
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
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawer}
      </Drawer>

      {/* User menu */}
      {userMenu}

      {/* Modal Auth */}
      <ModalAuth open={openModalAuth} onClose={handleCloseModalAuth} type={typeModalAuth} />
    </AppBar>
  )
}

export default Header
