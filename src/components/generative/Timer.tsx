'use client';

import { useState, useEffect, useCallback, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Coffee, Brain, Target, Settings, Volume2, VolumeX } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   TIMER COMPONENT
   
   A professional Pomodoro/Focus timer with:
   - Work, Short Break, Long Break modes
   - Auto-start next session
   - Sound notifications
   - Session counter
   - Keyboard shortcuts
   - Accessible design
   ============================================ */

/** Zod schema for type validation */
export const TimerSchema = z.object({
    title: z.string().default('Focus Timer'),
    workDuration: z.number().default(25).describe('Work session duration in minutes'),
    shortBreakDuration: z.number().default(5).describe('Short break duration in minutes'),
    longBreakDuration: z.number().default(15).describe('Long break duration in minutes'),
    sessionsBeforeLongBreak: z.number().default(4).describe('Number of work sessions before a long break'),
    autoStartBreaks: z.boolean().default(false).describe('Automatically start breaks'),
    autoStartWork: z.boolean().default(false).describe('Automatically start work sessions'),
});

/** Props type inferred from Zod schema */
export type TimerProps = z.infer<typeof TimerSchema>;

/** Timer mode types */
type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const modeConfig: Record<TimerMode, { label: string; icon: typeof Clock; color: string; bgColor: string }> = {
    work: { label: 'Focus Time', icon: Brain, color: 'text-rose-400', bgColor: 'bg-rose-500/20 border-rose-500/30' },
    shortBreak: { label: 'Short Break', icon: Coffee, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20 border-emerald-500/30' },
    longBreak: { label: 'Long Break', icon: Target, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20 border-indigo-500/30' },
};

/**
 * Timer - A professional Pomodoro/Focus timer component
 * 
 * @description Renders an interactive timer with work sessions, breaks,
 * and session tracking. Supports keyboard shortcuts and accessibility.
 * 
 * @param {string} title - The title displayed in the timer header
 * @param {number} workDuration - Work session duration in minutes
 * @param {number} shortBreakDuration - Short break duration in minutes
 * @param {number} longBreakDuration - Long break duration in minutes
 * @param {number} sessionsBeforeLongBreak - Sessions before long break
 * @param {boolean} autoStartBreaks - Auto-start breaks
 * @param {boolean} autoStartWork - Auto-start work sessions
 * 
 * @example
 * <Timer
 *   title="Deep Work"
 *   workDuration={25}
 *   shortBreakDuration={5}
 * />
 */
export function Timer({
    title = 'Focus Timer',
    workDuration = 25,
    shortBreakDuration = 5,
    longBreakDuration = 15,
    sessionsBeforeLongBreak = 4,
    autoStartBreaks = false,
    autoStartWork = false,
}: TimerProps) {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(workDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [customWork, setCustomWork] = useState(workDuration);
    const [customShortBreak, setCustomShortBreak] = useState(shortBreakDuration);
    const [customLongBreak, setCustomLongBreak] = useState(longBreakDuration);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const instanceId = useId();

    /** Get duration based on mode */
    const getDuration = useCallback((m: TimerMode): number => {
        switch (m) {
            case 'work': return customWork * 60;
            case 'shortBreak': return customShortBreak * 60;
            case 'longBreak': return customLongBreak * 60;
        }
    }, [customWork, customShortBreak, customLongBreak]);

    /** Format time as MM:SS */
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /** Play notification sound */
    const playSound = useCallback(() => {
        if (soundEnabled && typeof window !== 'undefined') {
            try {
                // Create a simple beep using Web Audio API
                const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch {
                // Audio not available, fail silently
            }
        }
    }, [soundEnabled]);

    /** Handle session completion */
    const handleSessionComplete = useCallback(() => {
        playSound();

        if (mode === 'work') {
            const newCompletedSessions = completedSessions + 1;
            setCompletedSessions(newCompletedSessions);

            // Determine next break type
            if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                setTimeLeft(getDuration('longBreak'));
                if (autoStartBreaks) setIsRunning(true);
            } else {
                setMode('shortBreak');
                setTimeLeft(getDuration('shortBreak'));
                if (autoStartBreaks) setIsRunning(true);
            }
        } else {
            // Break is over, go back to work
            setMode('work');
            setTimeLeft(getDuration('work'));
            if (autoStartWork) setIsRunning(true);
        }
    }, [mode, completedSessions, sessionsBeforeLongBreak, getDuration, autoStartBreaks, autoStartWork, playSound]);

    /** Timer effect */
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        handleSessionComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, handleSessionComplete, timeLeft]);

    /** Toggle timer */
    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    /** Reset timer */
    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(getDuration(mode));
    }, [mode, getDuration]);

    /** Switch mode */
    const switchMode = useCallback((newMode: TimerMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(getDuration(newMode));
    }, [getDuration]);

    /** Save settings */
    const saveSettings = useCallback(() => {
        setTimeLeft(getDuration(mode));
        setShowSettings(false);
    }, [mode, getDuration]);

    /** Keyboard shortcuts */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    toggleTimer();
                    break;
                case 'r':
                    resetTimer();
                    break;
                case 'm':
                    setSoundEnabled((prev) => !prev);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleTimer, resetTimer]);

    // Calculate progress
    const totalTime = getDuration(mode);
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const ModeIcon = modeConfig[mode].icon;

    return (
        <GlassCard
            className="w-full max-w-md mx-auto"
            padding="none"
            role="region"
            aria-label={`${title}: ${modeConfig[mode].label}`}
        >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", modeConfig[mode].bgColor)}>
                            <Clock className={cn("w-5 h-5", modeConfig[mode].color)} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                            <p className={cn("text-sm", modeConfig[mode].color)}>{modeConfig[mode].label}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSoundEnabled((prev) => !prev)}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setShowSettings((prev) => !prev)}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                            aria-label="Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-2">
                    {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
                        const Icon = modeConfig[m].icon;
                        return (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={cn(
                                    "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                                    "flex items-center justify-center gap-1.5",
                                    mode === m
                                        ? `${modeConfig[m].bgColor} ${modeConfig[m].color}`
                                        : "bg-[rgba(255,255,255,0.03)] text-gray-400 hover:bg-[rgba(255,255,255,0.05)]"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{modeConfig[m].label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Timer Display */}
            <div className="p-6 sm:p-8">
                <div className="relative flex flex-col items-center">
                    {/* Circular Progress */}
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="6"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={mode === 'work' ? '#f43f5e' : mode === 'shortBreak' ? '#10b981' : '#6366f1'}
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                initial={false}
                                animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>

                        {/* Time Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                key={timeLeft}
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl sm:text-5xl font-bold text-white font-mono"
                            >
                                {formatTime(timeLeft)}
                            </motion.span>
                            <div className="flex items-center gap-1 mt-2">
                                <ModeIcon className={cn("w-4 h-4", modeConfig[mode].color)} />
                                <span className="text-xs text-gray-400">{modeConfig[mode].label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 mt-6">
                        <button
                            onClick={resetTimer}
                            className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all"
                            aria-label="Reset timer"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>

                        <motion.button
                            onClick={toggleTimer}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "p-4 rounded-2xl border transition-all",
                                isRunning
                                    ? "bg-rose-500/20 border-rose-500/30 text-rose-400 hover:bg-rose-500/30"
                                    : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                            )}
                            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
                        >
                            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </motion.button>

                        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
                            <span className="text-sm font-medium text-white">{completedSessions}</span>
                            <span className="text-xs text-gray-500 ml-1">sessions</span>
                        </div>
                    </div>

                    {/* Keyboard shortcuts hint */}
                    <p className="mt-4 text-xs text-gray-500">
                        Press <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.1)] rounded text-gray-400">Space</kbd> to {isRunning ? 'pause' : 'start'},
                        <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.1)] rounded text-gray-400 ml-1">R</kbd> to reset
                    </p>
                </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-[rgba(255,255,255,0.06)] overflow-hidden"
                    >
                        <div className="p-4 sm:p-6 space-y-4">
                            <h4 className="text-sm font-medium text-white">Timer Settings</h4>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Work (min)</label>
                                    <input
                                        type="number"
                                        value={customWork}
                                        onChange={(e) => setCustomWork(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white"
                                        min="1"
                                        max="120"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Short (min)</label>
                                    <input
                                        type="number"
                                        value={customShortBreak}
                                        onChange={(e) => setCustomShortBreak(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white"
                                        min="1"
                                        max="30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Long (min)</label>
                                    <input
                                        type="number"
                                        value={customLongBreak}
                                        onChange={(e) => setCustomLongBreak(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white"
                                        min="1"
                                        max="60"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={saveSettings}
                                className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium rounded-lg transition-colors"
                            >
                                Apply Settings
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}

export default Timer;
