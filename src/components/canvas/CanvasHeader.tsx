'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

/* ============================================
   CANVAS HEADER
   The top navigation bar with branding,
   project info, and actions
   ============================================ */

export interface CanvasHeaderProps {
    /** Project name to display */
    projectName?: string;
    /** Whether to show the logo animation */
    animated?: boolean;
}

export function CanvasHeader({
    projectName = 'My Canvas',
    animated = true
}: CanvasHeaderProps) {
    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 h-16"
            initial={animated ? { y: -20, opacity: 0 } : undefined}
            animate={animated ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Glass background */}
            <div className="absolute inset-0 bg-[rgba(10,10,15,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]" />

            {/* Content */}
            <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Left section - Logo & Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    {/* Animated Logo */}
                    <motion.div
                        className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Sparkles className="w-5 h-5 text-white" />

                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                    </motion.div>

                    {/* Brand text */}
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-[#F8FAFC] group-hover:text-white transition-colors">
                            Canvas
                            <span className="bg-linear-to-r from-[#6366F1] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                                AI
                            </span>
                        </span>
                        <span className="text-[10px] font-medium text-[#64748B] tracking-wide uppercase">
                            Generative Workspace
                        </span>
                    </div>
                </Link>

                {/* Center section - Project name */}
                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-sm font-medium text-[#94A3B8]">
                        {projectName}
                    </span>
                </div>

                {/* Right section - Actions */}
                <div className="flex items-center gap-3">
                    {/* Status indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-xs font-medium text-[#10B981]">
                            AI Ready
                        </span>
                    </div>

                    {/* Keyboard shortcut hint */}
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#64748B] bg-[rgba(255,255,255,0.05)] rounded">
                            ⌘
                        </kbd>
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#64748B] bg-[rgba(255,255,255,0.05)] rounded">
                            K
                        </kbd>
                        <span className="text-xs text-[#64748B] ml-1">
                            to command
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#6366F1]/50 to-transparent" />
        </motion.header>
    );
}

export default CanvasHeader;
