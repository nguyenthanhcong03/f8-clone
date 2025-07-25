// CustomButton.tsx
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

// Define props riêng để truyền biến thể
interface CustomButtonProps {
  variantType?: 'default' | 'danger' | 'ghost'
}

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'variantType'
})<CustomButtonProps>(({ theme, variantType = 'default' }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease',
  boxShadow: 'none',

  ...(variantType === 'default' && {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }),

  ...(variantType === 'danger' && {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }),

  ...(variantType === 'ghost' && {
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }),

  // Responsive fontSize, padding
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2)
  }
}))

export default CustomButton
