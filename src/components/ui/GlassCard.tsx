'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ============================================
   GLASS CARD COMPONENT
   A premium glassmorphism card with smooth
   animations and multiple variants
   ============================================ */

export interface GlassCardProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps>, MotionProps {
  /** Card content */
  children: ReactNode;
  /** Visual variant of the card */
  variant?: 'default' | 'elevated' | 'outlined' | 'glow';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
  /** Custom className */
  className?: string;
  /** Animation variant */
  animate?: boolean;
  /** Animation delay in seconds */
  animationDelay?: number;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
  xl: 'p-6',
};

const variantStyles = {
  default: `
    bg-[rgba(255,255,255,0.03)]
    border border-[rgba(255,255,255,0.08)]
    shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]
  `,
  elevated: `
    bg-[rgba(255,255,255,0.05)]
    border border-[rgba(255,255,255,0.1)]
    shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]
  `,
  outlined: `
    bg-transparent
    border-2 border-[rgba(255,255,255,0.12)]
    shadow-none
  `,
  glow: `
    bg-[rgba(255,255,255,0.03)]
    border border-[rgba(99,102,241,0.3)]
    shadow-[0_0_30px_rgba(99,102,241,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]
  `,
};

const hoverStyles = {
  default: 'hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.12)]',
  elevated: 'hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]',
  outlined: 'hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]',
  glow: 'hover:border-[rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      interactive = false,
      className,
      animate = true,
      animationDelay = 0,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'relative rounded-2xl overflow-hidden',
      'backdrop-blur-xl',
      'transition-all duration-200 ease-out',
      // Variant styles
      variantStyles[variant],
      // Padding
      paddingStyles[padding],
      // Hover effects
      hoverable && hoverStyles[variant],
      // Interactive cursor
      interactive && 'cursor-pointer',
      // Custom classes
      className
    );

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        initial={animate ? { opacity: 0, y: 20, scale: 0.98 } : undefined}
        animate={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
        exit={animate ? { opacity: 0, y: -10, scale: 0.98 } : undefined}
        transition={animate ? {
          type: 'spring',
          stiffness: 100,
          damping: 15,
          delay: animationDelay
        } : undefined}
        whileHover={hoverable || interactive ? { scale: 1.01 } : undefined}
        whileTap={interactive ? { scale: 0.99 } : undefined}
        {...props}
      >
        {/* Subtle inner glow effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/* ============================================
   GLASS CARD HEADER
   ============================================ */

export interface GlassCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Header subtitle or description */
  subtitle?: string;
  /** Icon to display before the title */
  icon?: ReactNode;
  /** Action element (button, menu, etc.) */
  action?: ReactNode;
}

export const GlassCardHeader = forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ title, subtitle, icon, action, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between gap-4',
          'pb-4 mb-4',
          'border-b border-[rgba(255,255,255,0.06)]',
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {icon && (
            <div className="shrink-0 text-[#6366F1]">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base font-semibold text-[#F8FAFC] truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-[#94A3B8] truncate">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

GlassCardHeader.displayName = 'GlassCardHeader';

/* ============================================
   GLASS CARD CONTENT
   ============================================ */

export type GlassCardContentProps = HTMLAttributes<HTMLDivElement>;

export const GlassCardContent = forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardContent.displayName = 'GlassCardContent';

/* ============================================
   GLASS CARD FOOTER
   ============================================ */

export type GlassCardFooterProps = HTMLAttributes<HTMLDivElement>;

export const GlassCardFooter = forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          'pt-4 mt-4',
          'border-t border-[rgba(255,255,255,0.06)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardFooter.displayName = 'GlassCardFooter';

export default GlassCard;
