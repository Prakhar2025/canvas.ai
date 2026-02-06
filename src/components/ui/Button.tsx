'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ============================================
   BUTTON COMPONENT
   A premium button with multiple variants,
   sizes, and smooth animations
   ============================================ */

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    /** Button content */
    children: ReactNode;
    /** Visual variant */
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    /** Icon to display before children */
    leftIcon?: ReactNode;
    /** Icon to display after children */
    rightIcon?: ReactNode;
    /** Loading state */
    isLoading?: boolean;
    /** Loading text */
    loadingText?: string;
    /** Full width button */
    fullWidth?: boolean;
    /** Disabled state */
    disabled?: boolean;
}

const sizeStyles = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
    md: 'h-10 px-4 text-sm gap-2 rounded-lg',
    lg: 'h-11 px-5 text-base gap-2 rounded-xl',
    xl: 'h-12 px-6 text-base gap-2.5 rounded-xl',
    icon: 'h-10 w-10 p-0 rounded-lg',
};

const variantStyles = {
    primary: `
    bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6]
    text-white font-medium
    border border-[rgba(255,255,255,0.1)]
    shadow-[0_0_20px_rgba(99,102,241,0.3)]
    hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
    hover:brightness-110
    active:brightness-95
  `,
    secondary: `
    bg-[rgba(255,255,255,0.05)]
    text-[#F8FAFC]
    border border-[rgba(255,255,255,0.1)]
    hover:bg-[rgba(255,255,255,0.08)]
    hover:border-[rgba(255,255,255,0.15)]
    active:bg-[rgba(255,255,255,0.1)]
  `,
    ghost: `
    bg-transparent
    text-[#94A3B8]
    border border-transparent
    hover:bg-[rgba(255,255,255,0.05)]
    hover:text-[#F8FAFC]
    active:bg-[rgba(255,255,255,0.08)]
  `,
    outline: `
    bg-transparent
    text-[#F8FAFC]
    border-2 border-[rgba(255,255,255,0.15)]
    hover:border-[rgba(255,255,255,0.25)]
    hover:bg-[rgba(255,255,255,0.03)]
    active:bg-[rgba(255,255,255,0.05)]
  `,
    danger: `
    bg-gradient-to-r from-[#EF4444] to-[#DC2626]
    text-white font-medium
    border border-[rgba(255,255,255,0.1)]
    shadow-[0_0_15px_rgba(239,68,68,0.2)]
    hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
    hover:brightness-110
    active:brightness-95
  `,
    success: `
    bg-gradient-to-r from-[#10B981] to-[#059669]
    text-white font-medium
    border border-[rgba(255,255,255,0.1)]
    shadow-[0_0_15px_rgba(16,185,129,0.2)]
    hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]
    hover:brightness-110
    active:brightness-95
  `,
};

const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    icon: 18,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            leftIcon,
            rightIcon,
            isLoading = false,
            loadingText,
            fullWidth = false,
            disabled = false,
            className,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <motion.button
                ref={ref}
                className={cn(
                    // Base styles
                    'relative inline-flex items-center justify-center',
                    'font-medium',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]',
                    // Size styles
                    sizeStyles[size],
                    // Variant styles
                    variantStyles[variant],
                    // Full width
                    fullWidth && 'w-full',
                    // Disabled styles
                    isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                    // Custom classes
                    className
                )}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02, y: -1 } : undefined}
                whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                {...props}
            >
                {/* Loading spinner */}
                {isLoading && (
                    <Loader2
                        className="animate-spin"
                        size={iconSizes[size]}
                    />
                )}

                {/* Left icon */}
                {!isLoading && leftIcon && (
                    <span className="shrink-0">
                        {leftIcon}
                    </span>
                )}

                {/* Button text */}
                {size !== 'icon' && (
                    <span className={cn(isLoading && loadingText ? 'ml-2' : '')}>
                        {isLoading && loadingText ? loadingText : children}
                    </span>
                )}

                {/* Icon-only button content */}
                {size === 'icon' && !isLoading && children}

                {/* Right icon */}
                {!isLoading && rightIcon && (
                    <span className="shrink-0">
                        {rightIcon}
                    </span>
                )}

                {/* Shine effect overlay */}
                {(variant === 'primary' || variant === 'danger' || variant === 'success') && (
                    <div
                        className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
                        style={{ borderRadius: 'inherit' }}
                    >
                        <div
                            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite',
                            }}
                        />
                    </div>
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

/* ============================================
   ICON BUTTON
   ============================================ */

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon' | 'size'> {
    /** Icon element */
    icon: ReactNode;
    /** Aria label for accessibility */
    'aria-label': string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

const iconButtonSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, size = 'md', className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                size="icon"
                className={cn(iconButtonSizes[size], className)}
                {...props}
            >
                {icon}
            </Button>
        );
    }
);

IconButton.displayName = 'IconButton';

export default Button;
