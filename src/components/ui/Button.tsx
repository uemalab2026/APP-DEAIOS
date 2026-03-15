import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-accent text-black hover:bg-accent-dim hover:shadow-glow focus:ring-accent/40 border border-transparent',
      secondary: 'bg-elevated text-primary hover:bg-hover hover:border-border-bright border border-border focus:ring-border-bright/40',
      ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-hover border border-transparent',
      outline: 'bg-transparent text-primary border border-border hover:border-accent hover:text-accent focus:ring-accent/40',
      danger: 'bg-error/10 text-error hover:bg-error/20 border border-error/20 focus:ring-error/40',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm rounded-lg',
      md: 'h-11 px-5 text-base rounded-xl',
      lg: 'h-14 px-8 text-lg rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
