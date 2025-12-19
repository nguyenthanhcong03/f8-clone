import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type MainContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'main' | 'section'
}

export default function MainContainer({ children, className, as = 'main' }: MainContainerProps) {
  const Component = as

  return <Component className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</Component>
}
