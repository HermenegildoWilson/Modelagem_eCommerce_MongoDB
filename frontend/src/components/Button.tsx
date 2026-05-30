import MuiButton from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import type { ReactNode } from 'react'

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
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
  const muiVariant = variant === 'primary' ? 'contained' : variant === 'secondary' ? 'outlined' : 'text'

  return (
    <MuiButton
      variant={muiVariant}
      className={className}
      disabled={disabled || isLoading}
      sx={{
        gap: 1,
        px: 2,
        py: 1.25,
        fontSize: '0.875rem',
        transition: 'transform 300ms ease, background-color 300ms ease, border-color 300ms ease, color 300ms ease',
        ...(variant === 'primary' && {
          bgcolor: 'var(--color-primary)',
          color: '#fff',
          boxShadow: '0 10px 28px color-mix(in srgb, var(--color-primary) 28%, transparent)',
          '&:hover': {
            bgcolor: 'var(--color-primary-hover)',
            transform: 'scale(1.02)',
          },
        }),
        ...(variant === 'secondary' && {
          borderColor: 'var(--color-border-strong)',
          bgcolor: 'var(--color-surface-solid)',
          color: 'var(--color-text-soft)',
          '&:hover': {
            borderColor: 'var(--color-accent)',
            bgcolor: 'var(--color-surface-solid)',
            color: 'var(--color-text)',
          },
        }),
        ...(variant === 'ghost' && {
          color: 'var(--color-text-soft)',
          '&:hover': {
            bgcolor: 'var(--color-surface-muted)',
          },
        }),
        '&.Mui-disabled': {
          opacity: 0.6,
          color: variant === 'primary' ? '#fff' : 'var(--color-muted)',
        },
      }}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={16} sx={{ color: 'currentColor' }} aria-hidden="true" />
      ) : null}
      {children}
    </MuiButton>
  )
}
