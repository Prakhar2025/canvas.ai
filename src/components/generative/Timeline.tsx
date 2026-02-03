'use client';

import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Milestone,
    Flag
} from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   TIMELINE COMPONENT
   
   A professional timeline/roadmap component with:
   - Horizontal scrolling timeline
   - Milestone markers
   - Status indicators (completed, in-progress, upcoming)
   - Add/remove milestones
   - Responsive design
   ============================================ */

/** Status type for milestones */
type MilestoneStatus = 'completed' | 'in-progress' | 'upcoming';

/** Zod schema for milestone */
const MilestoneSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    status: z.enum(['completed', 'in-progress', 'upcoming']),
});

/** Zod schema for type validation */
export const TimelineSchema = z.object({
    title: z.string().default('Project Timeline'),
    milestones: z.array(MilestoneSchema).default([]),
    showDates: z.boolean().default(true),
    allowEdit: z.boolean().default(true),
});

/** Props type inferred from Zod schema */
export type TimelineProps = z.infer<typeof TimelineSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;

const statusConfig: Record<MilestoneStatus, {
    label: string;
    icon: typeof CheckCircle2;
    color: string;
    bgColor: string;
    borderColor: string;
    lineColor: string;
}> = {
    'completed': {
        label: 'Completed',
        icon: CheckCircle2,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
        borderColor: 'border-emerald-500/50',
        lineColor: 'bg-emerald-500',
    },
    'in-progress': {
        label: 'In Progress',
        icon: Clock,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/50',
        lineColor: 'bg-amber-500',
    },
    'upcoming': {
        label: 'Upcoming',
        icon: Circle,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/50',
        lineColor: 'bg-gray-700',
    },
};

/**
 * Timeline - A professional timeline/roadmap component
 * 
 * @description Renders an interactive horizontal timeline with milestones,
 * progress tracking, and the ability to add/remove items.
 * 
 * @param {string} title - The timeline title
 * @param {Milestone[]} milestones - Array of milestone items
 * @param {boolean} showDates - Whether to show dates
 * @param {boolean} allowEdit - Whether to allow adding/removing
 * 
 * @example
 * <Timeline
 *   title="Product Launch"
 *   milestones={[
 *     { id: '1', title: 'Planning', date: 'Jan 2024', status: 'completed' },
 *     { id: '2', title: 'Development', date: 'Feb 2024', status: 'in-progress' },
 *   ]}
 * />
 */
export function Timeline({
    title = 'Project Timeline',
    milestones: initialMilestones = [],
    showDates = true,
    allowEdit = true,
}: TimelineProps) {
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
    const [isAddingMilestone, setIsAddingMilestone] = useState(false);
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        date: '',
        status: 'upcoming' as MilestoneStatus,
    });
    const [scrollPosition, setScrollPosition] = useState(0);
    const instanceId = useId();

    // Calculate progress
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

    /** Add a new milestone */
    const handleAddMilestone = useCallback(() => {
        if (!newMilestone.title.trim()) return;

        const milestone: Milestone = {
            id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: newMilestone.title.trim(),
            description: newMilestone.description.trim() || undefined,
            date: newMilestone.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            status: newMilestone.status,
        };

        setMilestones(prev => [...prev, milestone]);
        setNewMilestone({ title: '', description: '', date: '', status: 'upcoming' });
        setIsAddingMilestone(false);
    }, [newMilestone]);

    /** Delete a milestone */
    const handleDeleteMilestone = useCallback((id: string) => {
        setMilestones(prev => prev.filter(m => m.id !== id));
    }, []);

    /** Toggle milestone status */
    const handleToggleStatus = useCallback((id: string) => {
        setMilestones(prev => prev.map(m => {
            if (m.id !== id) return m;
            const statusOrder: MilestoneStatus[] = ['upcoming', 'in-progress', 'completed'];
            const currentIndex = statusOrder.indexOf(m.status);
            const nextIndex = (currentIndex + 1) % statusOrder.length;
            return { ...m, status: statusOrder[nextIndex] };
        }));
    }, []);

    /** Handle keyboard events */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddMilestone();
        } else if (e.key === 'Escape') {
            setIsAddingMilestone(false);
        }
    }, [handleAddMilestone]);

    /** Scroll controls */
    const handleScroll = useCallback((direction: 'left' | 'right') => {
        const container = document.getElementById(`timeline-container-${instanceId}`);
        if (container) {
            const scrollAmount = 300;
            const newPosition = direction === 'left'
                ? Math.max(0, scrollPosition - scrollAmount)
                : scrollPosition + scrollAmount;
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
            setScrollPosition(newPosition);
        }
    }, [scrollPosition, instanceId]);

    return (
        <GlassCard
            className="w-full"
            padding="none"
            role="region"
            aria-label={`${title}: ${completedCount} of ${milestones.length} milestones completed`}
        >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                            <Milestone className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                            <p className="text-sm text-gray-400">{completedCount}/{milestones.length} milestones completed</p>
                        </div>
                    </div>
                    {allowEdit && (
                        <button
                            onClick={() => setIsAddingMilestone(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 rounded-lg transition-colors"
                            aria-label="Add new milestone"
                        >
                            <Plus className="w-3 h-3" />
                            Add Milestone
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                <div
                    className="h-2 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <motion.div
                        className="h-full bg-linear-to-r from-violet-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Add Milestone Form */}
            <AnimatePresence>
                {isAddingMilestone && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-[rgba(255,255,255,0.06)] overflow-hidden"
                    >
                        <div className="p-4 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newMilestone.title}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Milestone title"
                                    className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                                    autoFocus
                                    aria-label="Milestone title"
                                />
                                <input
                                    type="text"
                                    value={newMilestone.date}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Date (e.g., Jan 2024)"
                                    className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                                    aria-label="Milestone date"
                                />
                            </div>
                            <input
                                type="text"
                                value={newMilestone.description}
                                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                                onKeyDown={handleKeyDown}
                                placeholder="Description (optional)"
                                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                                aria-label="Milestone description"
                            />
                            <div className="flex gap-2">
                                {(Object.keys(statusConfig) as MilestoneStatus[]).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setNewMilestone(prev => ({ ...prev, status }))}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all border",
                                            newMilestone.status === status
                                                ? `${statusConfig[status].bgColor} ${statusConfig[status].borderColor} ${statusConfig[status].color}`
                                                : "bg-[rgba(255,255,255,0.03)] border-transparent text-gray-400 hover:bg-[rgba(255,255,255,0.05)]"
                                        )}
                                    >
                                        {statusConfig[status].label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddMilestone}
                                    className="flex-1 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Add Milestone
                                </button>
                                <button
                                    onClick={() => setIsAddingMilestone(false)}
                                    className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 text-sm rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timeline Content */}
            <div className="relative">
                {/* Scroll Controls */}
                {milestones.length > 3 && (
                    <>
                        <button
                            onClick={() => handleScroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/80 border border-[rgba(255,255,255,0.1)] rounded-full text-gray-400 hover:text-white transition-colors"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/80 border border-[rgba(255,255,255,0.1)] rounded-full text-gray-400 hover:text-white transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Timeline */}
                {milestones.length > 0 ? (
                    <div
                        id={`timeline-container-${instanceId}`}
                        className="overflow-x-auto scrollbar-hide p-6 sm:p-8"
                        onScroll={(e) => setScrollPosition((e.target as HTMLDivElement).scrollLeft)}
                    >
                        <div className="relative min-w-max">
                            {/* Timeline Line */}
                            <div className="absolute top-8 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.1)]" />

                            {/* Milestones */}
                            <div className="relative flex gap-8" role="list">
                                <AnimatePresence>
                                    {milestones.map((milestone, index) => {
                                        const StatusIcon = statusConfig[milestone.status].icon;
                                        const config = statusConfig[milestone.status];

                                        return (
                                            <motion.div
                                                key={milestone.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="relative flex flex-col items-center w-40"
                                                role="listitem"
                                            >
                                                {/* Connector Line */}
                                                {index > 0 && (
                                                    <div
                                                        className={cn(
                                                            "absolute top-8 -left-8 w-8 h-0.5",
                                                            milestones[index - 1].status === 'completed' ? 'bg-emerald-500' : 'bg-[rgba(255,255,255,0.1)]'
                                                        )}
                                                    />
                                                )}

                                                {/* Status Icon */}
                                                <button
                                                    onClick={() => handleToggleStatus(milestone.id)}
                                                    className={cn(
                                                        "relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all",
                                                        config.bgColor,
                                                        config.borderColor,
                                                        "hover:scale-110"
                                                    )}
                                                    title="Click to change status"
                                                >
                                                    <StatusIcon className={cn("w-6 h-6", config.color)} />
                                                </button>

                                                {/* Content */}
                                                <div className="mt-4 text-center group">
                                                    <h4 className="text-sm font-medium text-white">{milestone.title}</h4>
                                                    {milestone.description && (
                                                        <p className="text-xs text-gray-500 mt-1 max-w-[150px]">{milestone.description}</p>
                                                    )}
                                                    {showDates && (
                                                        <p className={cn("text-xs mt-2 flex items-center justify-center gap-1", config.color)}>
                                                            <Calendar className="w-3 h-3" />
                                                            {milestone.date}
                                                        </p>
                                                    )}

                                                    {/* Delete Button */}
                                                    {allowEdit && (
                                                        <button
                                                            onClick={() => handleDeleteMilestone(milestone.id)}
                                                            className="opacity-0 group-hover:opacity-100 mt-2 p-1 text-gray-500 hover:text-red-400 transition-all rounded hover:bg-red-500/10"
                                                            aria-label={`Delete milestone: ${milestone.title}`}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                            <Flag className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-400">No milestones yet</p>
                        <p className="text-xs text-gray-500 mt-1">Add your first milestone to get started</p>
                        {allowEdit && (
                            <button
                                onClick={() => setIsAddingMilestone(true)}
                                className="mt-4 text-xs text-violet-400 hover:text-violet-300"
                            >
                                + Add Milestone
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Status Legend */}
            {milestones.length > 0 && (
                <div className="px-4 sm:px-6 py-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]">
                    <div className="flex items-center justify-center gap-6 text-xs">
                        {(Object.keys(statusConfig) as MilestoneStatus[]).map((status) => {
                            const config = statusConfig[status];
                            const count = milestones.filter(m => m.status === status).length;
                            return (
                                <div key={status} className="flex items-center gap-1.5">
                                    <div className={cn("w-2.5 h-2.5 rounded-full", config.lineColor)} />
                                    <span className="text-gray-400">{config.label}</span>
                                    <span className={cn("font-medium", config.color)}>({count})</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </GlassCard>
    );
}

export default Timeline;
