'use client';

import { motion } from 'framer-motion';

/* ============================================
   ANIMATED BACKGROUND
   Premium animated background with gradient
   orbs, grid pattern, and mesh gradients
   ============================================ */

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030303]">
            {/* Base gradient mesh */}
            <div
                className="absolute inset-0 opacity-80"
                style={{
                    background: `
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)
          `,
                }}
            />

            {/* Animated gradient orbs */}
            <motion.div
                className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full opacity-40"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    x: [0, 30, -20, 20, 0],
                    y: [0, -30, 20, 10, 0],
                    scale: [1, 1.05, 0.95, 1.02, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute top-1/2 -right-[150px] w-[500px] h-[500px] rounded-full opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    x: [0, -40, 30, -20, 0],
                    y: [0, 40, -30, 20, 0],
                    scale: [1, 0.95, 1.05, 0.98, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 5,
                }}
            />

            <motion.div
                className="absolute -bottom-[100px] left-[30%] w-[400px] h-[400px] rounded-full opacity-25"
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    x: [0, 50, -30, 40, 0],
                    y: [0, -20, 30, -10, 0],
                    scale: [1, 1.03, 0.97, 1.01, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 10,
                }}
            />

            {/* Top highlight */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
                }}
            />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                }}
            />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 3, 3, 0.4) 100%)',
                }}
            />
        </div>
    );
}

export default AnimatedBackground;
