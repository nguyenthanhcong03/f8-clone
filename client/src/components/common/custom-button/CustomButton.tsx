import React from 'react'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CustomButtonProps extends ButtonProps {
  variantType?: 'default' | 'danger' | 'ghost'
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variantType = 'default', className, ...props }, ref) => {
    const getVariant = (): ButtonProps['variant'] => {
      switch (variantType) {
        case 'danger':
          return 'destructive'
        case 'ghost':
          return 'ghost'
        default:
          return 'default'
      }
    }

    return (
      <Button
        ref={ref}
        variant={getVariant()}
        className={cn(
          'h-10 px-6 text-base font-semibold rounded-lg transition-all duration-300',
          'sm:text-sm sm:px-4 sm:h-9',
          className
        )}
        {...props}
      />
    )
  }
)

CustomButton.displayName = 'CustomButton'

export default CustomButton
