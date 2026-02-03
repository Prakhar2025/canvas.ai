'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ============================================
   INPUT COMPONENT
   A premium input with multiple variants,
   states, and smooth focus animations
   ============================================ */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Label text */
    label?: string;
    /** Helper text below the input */
    helperText?: string;
    /** Error message (also sets error state) */
    error?: string;
    /** Success state */
    success?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Icon to display at the start */
    leftIcon?: ReactNode;
    /** Icon to display at the end */
    rightIcon?: ReactNode;
    /** Full width input */
    fullWidth?: boolean;
}

const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-4 text-base',
};

const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            success,
            size = 'md',
            leftIcon,
            rightIcon,
            fullWidth = true,
            className,
            type,
            disabled,
            onFocus,
            onBlur,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const [isFocused, setIsFocused] = useState(false);

        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        const hasError = !!error;
        const hasSuccess = success && !hasError;

        return (
            <div className={cn('relative', fullWidth && 'w-full')}>
                {/* Label */}
                {label && (
                    <label
                        className={cn(
                            'block mb-2 font-medium text-[#94A3B8]',
                            labelSizes[size],
                            hasError && 'text-[#EF4444]',
                            hasSuccess && 'text-[#10B981]'
                        )}
                    >
                        {label}
                    </label>
                )}

                {/* Input container */}
                <div className="relative">
                    {/* Left icon */}
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    {/* Input field */}
                    <input
                        ref={ref}
                        type={inputType}
                        disabled={disabled}
                        className={cn(
                            // Base styles
                            'w-full font-sans',
                            'bg-[rgba(255,255,255,0.03)]',
                            'border border-[rgba(255,255,255,0.08)]',
                            'rounded-xl',
                            'text-[#F8FAFC]',
                            'placeholder:text-[#64748B]',
                            'outline-none',
                            'transition-all duration-200 ease-out',
                            // Size
                            sizeStyles[size],
                            // Icons padding
                            leftIcon && 'pl-10',
                            (rightIcon || isPassword) && 'pr-10',
                            // States
                            'hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)]',
                            'focus:border-[#6366F1] focus:bg-[rgba(255,255,255,0.05)]',
                            'focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
                            // Error state
                            hasError && 'border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
                            // Success state
                            hasSuccess && 'border-[#10B981] focus:border-[#10B981] focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]',
                            // Disabled
                            disabled && 'opacity-50 cursor-not-allowed',
                            // Custom
                            className
                        )}
                        onFocus={(e) => {
                            setIsFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        }}
                        {...props}
                    />

                    {/* Right icon / Password toggle / Status icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {hasError && !isPassword && (
                            <AlertCircle className="text-[#EF4444]" size={18} />
                        )}
                        {hasSuccess && !isPassword && (
                            <CheckCircle className="text-[#10B981]" size={18} />
                        )}
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#64748B] hover:text-[#94A3B8] transition-colors focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        )}
                        {rightIcon && !isPassword && !hasError && !hasSuccess && (
                            <div className="text-[#64748B]">
                                {rightIcon}
                            </div>
                        )}
                    </div>

                    {/* Focus glow effect */}
                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        initial={false}
                        animate={{
                            boxShadow: isFocused
                                ? hasError
                                    ? '0 0 20px rgba(239, 68, 68, 0.2)'
                                    : hasSuccess
                                        ? '0 0 20px rgba(16, 185, 129, 0.2)'
                                        : '0 0 20px rgba(99, 102, 241, 0.2)'
                                : '0 0 0px transparent',
                        }}
                        transition={{ duration: 0.2 }}
                    />
                </div>

                {/* Helper text / Error message */}
                {(helperText || error) && (
                    <p
                        className={cn(
                            'mt-2 text-xs',
                            hasError ? 'text-[#EF4444]' : 'text-[#64748B]'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

/* ============================================
   SEARCH INPUT
   ============================================ */

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
    /** Callback when search value changes */
    onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ onSearch, onChange, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                type="search"
                leftIcon={<Search size={18} />}
                placeholder="Search..."
                onChange={(e) => {
                    onChange?.(e);
                    onSearch?.(e.target.value);
                }}
                {...props}
            />
        );
    }
);

SearchInput.displayName = 'SearchInput';

/* ============================================
   TEXTAREA
   ============================================ */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Label text */
    label?: string;
    /** Helper text below the textarea */
    helperText?: string;
    /** Error message */
    error?: string;
    /** Full width */
    fullWidth?: boolean;
    /** Auto-resize based on content */
    autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            helperText,
            error,
            fullWidth = true,
            autoResize = false,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const hasError = !!error;

        return (
            <div className={cn('relative', fullWidth && 'w-full')}>
                {label && (
                    <label
                        className={cn(
                            'block mb-2 text-sm font-medium text-[#94A3B8]',
                            hasError && 'text-[#EF4444]'
                        )}
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    disabled={disabled}
                    className={cn(
                        // Base styles
                        'w-full min-h-[100px] p-4 font-sans text-base',
                        'bg-[rgba(255,255,255,0.03)]',
                        'border border-[rgba(255,255,255,0.08)]',
                        'rounded-xl',
                        'text-[#F8FAFC]',
                        'placeholder:text-[#64748B]',
                        'outline-none',
                        'transition-all duration-200 ease-out',
                        'resize-y',
                        // States
                        'hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)]',
                        'focus:border-[#6366F1] focus:bg-[rgba(255,255,255,0.05)]',
                        'focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
                        // Error
                        hasError && 'border-[#EF4444] focus:border-[#EF4444]',
                        // Disabled
                        disabled && 'opacity-50 cursor-not-allowed resize-none',
                        // Auto resize
                        autoResize && 'resize-none overflow-hidden',
                        // Custom
                        className
                    )}
                    {...props}
                />

                {(helperText || error) && (
                    <p
                        className={cn(
                            'mt-2 text-xs',
                            hasError ? 'text-[#EF4444]' : 'text-[#64748B]'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Input;
