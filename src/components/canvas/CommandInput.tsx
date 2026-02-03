'use client';

import { forwardRef, useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ============================================
   COMMAND INPUT
   
   The AI-powered input field where users describe
   what they want to create. This is the heart of
   Canvas AI's generative interface.
   ============================================ */

export interface CommandInputProps {
    /** Callback when user submits a command */
    onSubmit?: (message: string) => void;
    /** Whether AI is processing */
    isLoading?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Custom className */
    className?: string;
}

const suggestions = [
    'Create a task board for my project',
    'Show me a budget tracker',
    'Build a timeline for product launch',
    'Make a checklist for daily tasks',
];

export const CommandInput = forwardRef<HTMLTextAreaElement, CommandInputProps>(
    (
        {
            onSubmit,
            isLoading = false,
            placeholder = "Describe what you want to create...",
            disabled = false,
            className,
        },
        ref
    ) => {
        const [value, setValue] = useState('');
        const [isFocused, setIsFocused] = useState(false);
        const [showSuggestions, setShowSuggestions] = useState(false);
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        // Auto-resize textarea
        useEffect(() => {
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto';
                textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
            }
        }, [value]);

        const handleSubmit = () => {
            if (!value.trim() || isLoading || disabled) return;
            onSubmit?.(value.trim());
            setValue('');
            setShowSuggestions(false);
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        };

        const handleSuggestionClick = (suggestion: string) => {
            setValue(suggestion);
            setShowSuggestions(false);
            textareaRef.current?.focus();
        };

        return (
            <div className={cn('relative w-full', className)}>
                {/* Main Input Container */}
                <motion.div
                    className={cn(
                        'relative flex items-end gap-3',
                        'bg-[rgba(255,255,255,0.03)]',
                        'border border-[rgba(255,255,255,0.08)]',
                        'rounded-2xl',
                        'p-4',
                        'transition-all duration-300',
                        isFocused && 'border-[#6366F1]/50 bg-[rgba(255,255,255,0.05)]',
                        isFocused && 'shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                    )}
                    animate={{
                        boxShadow: isFocused
                            ? '0 0 40px rgba(99, 102, 241, 0.2)'
                            : '0 0 0px transparent',
                    }}
                >
                    {/* AI Icon */}
                    <div className="shrink-0 mb-1">
                        <motion.div
                            className={cn(
                                'w-10 h-10 rounded-xl',
                                'bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7]',
                                'flex items-center justify-center',
                                'shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                            )}
                            animate={{
                                scale: isLoading ? [1, 1.05, 1] : 1,
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: isLoading ? Infinity : 0,
                                ease: 'easeInOut',
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 text-white" />
                            )}
                        </motion.div>
                    </div>

                    {/* Textarea */}
                    <div className="flex-1 min-w-0">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                setIsFocused(true);
                                if (!value) setShowSuggestions(true);
                            }}
                            onBlur={() => {
                                setIsFocused(false);
                                // Delay hiding suggestions to allow click
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            placeholder={placeholder}
                            disabled={disabled || isLoading}
                            rows={1}
                            className={cn(
                                'w-full resize-none',
                                'bg-transparent',
                                'text-[#F8FAFC] text-base',
                                'placeholder:text-[#64748B]',
                                'outline-none',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'max-h-[150px]'
                            )}
                        />

                        {/* Keyboard hint */}
                        <div className="flex items-center gap-2 mt-2">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[rgba(255,255,255,0.05)] rounded border border-[rgba(255,255,255,0.08)]">
                                Enter
                            </kbd>
                            <span className="text-[10px] text-[#64748B]">to send</span>
                            <span className="text-[10px] text-[#475569]">•</span>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[rgba(255,255,255,0.05)] rounded border border-[rgba(255,255,255,0.08)]">
                                Shift + Enter
                            </kbd>
                            <span className="text-[10px] text-[#64748B]">for new line</span>
                        </div>
                    </div>

                    {/* Send Button */}
                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!value.trim() || isLoading || disabled}
                        className={cn(
                            'shrink-0 mb-1',
                            'w-10 h-10 rounded-xl',
                            'flex items-center justify-center',
                            'bg-[rgba(255,255,255,0.05)]',
                            'border border-[rgba(255,255,255,0.1)]',
                            'text-[#94A3B8]',
                            'transition-all duration-200',
                            'hover:bg-[#6366F1] hover:text-white hover:border-[#6366F1]',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(255,255,255,0.05)] disabled:hover:text-[#94A3B8]'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </motion.div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && !value && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                'absolute top-full left-0 right-0 mt-2 z-50',
                                'bg-[rgba(10,10,15,0.95)]',
                                'backdrop-blur-xl',
                                'border border-[rgba(255,255,255,0.08)]',
                                'rounded-xl',
                                'overflow-hidden',
                                'shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
                            )}
                        >
                            <div className="p-2">
                                <p className="px-3 py-2 text-xs font-medium text-[#64748B] uppercase tracking-wider">
                                    Try saying...
                                </p>
                                {suggestions.map((suggestion, index) => (
                                    <motion.button
                                        key={suggestion}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={cn(
                                            'w-full px-3 py-2.5 rounded-lg',
                                            'text-left text-sm text-[#94A3B8]',
                                            'hover:bg-[rgba(99,102,241,0.1)] hover:text-[#F8FAFC]',
                                            'transition-colors duration-150',
                                            'flex items-center gap-3'
                                        )}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Command className="w-4 h-4 text-[#6366F1]" />
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Focus glow effect */}
                <motion.div
                    className="absolute -inset-1 rounded-2xl pointer-events-none"
                    animate={{
                        opacity: isFocused ? 1 : 0,
                    }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(168,85,247,0.1) 100%)',
                        filter: 'blur(20px)',
                    }}
                />
            </div>
        );
    }
);

CommandInput.displayName = 'CommandInput';

export default CommandInput;
