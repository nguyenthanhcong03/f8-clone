import { AppBar, Toolbar, Typography } from '@mui/material'

const AdminHeader = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Header</Typography>
      </Toolbar>
    </AppBar>
  )
}
export default AdminHeader
