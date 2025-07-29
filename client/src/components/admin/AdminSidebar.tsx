import { useAppSelector } from '@/store/hook'
import { Category, Menu as MenuIcon, ShoppingBag } from '@mui/icons-material'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

// Định nghĩa chiều rộng của sidebar
const drawerWidth = 240
const collapsedWidth = 65

// Menu items
const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: <ShoppingBag />, href: '/admin/dashboard' },
  { name: 'Khóa học', icon: <Category />, href: '/admin/courses' }
]

const AdminSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if menu item is active
  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Drawer
      variant='permanent'
      sx={{
        '& .MuiDrawer-paper': {
          position: 'static',
          height: '100vh',
          width: isCollapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }}
      open
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          py: 1,
          px: isCollapsed ? 1 : 2
        }}
      >
        {!isCollapsed && (
          <>
            <Box component='img' src='/src/assets/images/logo.png' alt='Logo' sx={{ height: 40, borderRadius: 1 }} />
            <Typography variant='h6' noWrap component='div'>
              F8 Admin
            </Typography>
          </>
        )}
        <IconButton onClick={handleToggle}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {SIDEBAR_ITEMS.map((item) => (
          <ListItem key={item.href} disablePadding>
            {isCollapsed ? (
              <Tooltip title={item.name} placement='right'>
                <ListItemButton
                  component={NavLink}
                  to={item.href}
                  selected={isActive(item.href)}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      '&:hover': {
                        bgcolor: 'primary.light'
                      }
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: isActive(item.href) ? 'primary.main' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton
                component={NavLink}
                to={item.href}
                selected={isActive(item.href)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.href) ? '#fff' : 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} sx={{ color: isActive(item.href) ? '#fff' : 'inherit' }} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default AdminSidebar
