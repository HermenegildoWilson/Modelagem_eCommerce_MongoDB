import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-300',
        variant === 'primary' &&
          'bg-[#5B5EFF] text-white shadow-lg shadow-[#5B5EFF]/25 hover:scale-[1.02] hover:bg-[#6B6EFF]',
        variant === 'secondary' &&
          'border border-[#334155] bg-[#1E293B]/70 text-[#E2E8F0] hover:border-[#06D6A0] hover:text-white',
        variant === 'ghost' && 'text-[#E2E8F0] hover:bg-white/10',
        disabled && 'opacity-60',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  )
}
