'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Layers, Palette, Terminal } from 'lucide-react';
import { AnimatedBackground, CanvasHeader } from '@/components/canvas';
import { GlassCard, Button, Input } from '@/components/ui';

/* ============================================
   HOME PAGE
   Landing page showcasing Canvas AI's
   capabilities before the AI canvas
   ============================================ */

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Generative UI',
    description: 'Components render dynamically based on what you describe.',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Smart Components',
    description: '8 intelligent components that adapt to your needs.',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Premium Design',
    description: 'Glassmorphism aesthetics with smooth animations.',
  },
  {
    icon: <Terminal className="w-5 h-5" />,
    title: 'Natural Language',
    description: 'Just describe what you want. The AI handles the rest.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <CanvasHeader projectName="Welcome" />

      <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-[#6366F1]" />
              <span className="text-sm font-medium text-[#A5B4FC]">
                Powered by Tambo Generative UI
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] mb-6">
              The Workspace That
              <br />
              <span className="bg-linear-to-r from-[#6366F1] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                Builds Itself
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10">
              Describe what you need, and watch the interface come to life.
              Canvas AI transforms your words into functional components instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => window.location.href = '/canvas'}
              >
                Launch Canvas
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open('https://github.com/Prakhar2025/canvas.ai', '_blank')}
              >
                View on GitHub
              </Button>
            </div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassCard variant="glow" padding="lg" className="relative overflow-hidden">
              {/* Fake command input */}
              <div className="mb-6">
                <Input
                  placeholder="Try: 'Create a task board for my product launch'"
                  size="lg"
                  leftIcon={<Sparkles className="w-5 h-5 text-[#6366F1]" />}
                  className="bg-[rgba(0,0,0,0.3)]"
                />
              </div>

              {/* Placeholder for future canvas preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Tasks', 'Timeline', 'Budget'].map((item, index) => (
                  <motion.div
                    key={item}
                    className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="w-8 h-1 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] mb-3" />
                    <p className="text-sm font-medium text-[#94A3B8]">{item}</p>
                    <div className="mt-3 space-y-2">
                      {[1, 2].map((line) => (
                        <div
                          key={line}
                          className="h-2 rounded-full bg-[rgba(255,255,255,0.05)]"
                          style={{ width: line === 1 ? '75%' : '60%' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative gradient */}
              <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-linear-to-br from-[#6366F1]/20 to-transparent blur-3xl pointer-events-none" />
            </GlassCard>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <GlassCard
                  variant="default"
                  padding="lg"
                  hoverable
                  className="h-full"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[rgba(99,102,241,0.2)] flex items-center justify-center text-[#6366F1]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-[#64748B]">
              Built for{' '}
              <span className="text-[#94A3B8] font-medium">
                The UI Strikes Back
              </span>{' '}
              hackathon by WeMakeDevs × Tambo
            </p>
          </motion.footer>
        </div>
      </main>
    </>
  );
}
