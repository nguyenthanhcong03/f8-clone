import { useEffect, useCallback } from 'react'
import { useAppSelector } from '@/store/hook'
import { closeSnackbar } from '@/store/snackbarSlice'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDispatch } from 'react-redux'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function GlobalSnackbar() {
  const dispatch = useDispatch()
  const { open, message, severity } = useAppSelector((state) => state.snackbar)

  const handleClose = useCallback(() => {
    dispatch(closeSnackbar())
  }, [dispatch])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [open, handleClose])

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle className='h-4 w-4' />
      case 'error':
        return <AlertCircle className='h-4 w-4' />
      case 'warning':
        return <AlertTriangle className='h-4 w-4' />
      case 'info':
        return <Info className='h-4 w-4' />
      default:
        return <Info className='h-4 w-4' />
    }
  }

  const getVariant = () => {
    switch (severity) {
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  if (!open) return null

  return (
    <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4'>
      <Alert
        variant={getVariant()}
        className={cn(
          'relative shadow-lg border',
          severity === 'success' &&
            'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
          severity === 'warning' &&
            'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
          severity === 'info' &&
            'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200'
        )}
      >
        <div className='flex items-center gap-2'>
          {getIcon()}
          <AlertDescription className='flex-1'>{message}</AlertDescription>
          <button
            onClick={handleClose}
            className='absolute right-2 top-2 opacity-70 hover:opacity-100 transition-opacity'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </Alert>
    </div>
  )
}
