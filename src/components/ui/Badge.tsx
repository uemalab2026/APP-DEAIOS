import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'anuncio' | 'social' | 'recorrente' | 'indicacao' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    
    const variants = {
      default: 'bg-elevated text-primary',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      info: 'bg-info/10 text-info border-info/20',
      anuncio: 'bg-anuncio/10 text-anuncio border-anuncio/20',
      social: 'bg-social/10 text-social border-social/20',
      recorrente: 'bg-recorrente/10 text-recorrente border-recorrente/20',
      indicacao: 'bg-indicacao/10 text-indicacao border-indicacao/20',
      outline: 'bg-transparent text-secondary border-border',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs rounded-md',
      md: 'px-2.5 py-1 text-xs font-medium rounded-lg',
      lg: 'px-3 py-1.5 text-sm font-medium rounded-xl',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center border transition-all whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
