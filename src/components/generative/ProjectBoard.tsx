'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   PROJECT BOARD COMPONENT
   
   A Kanban-style board for managing tasks.
   Features:
   - Multiple columns (To Do, In Progress, Done)
   - Task cards with tags and priority
   - Drag and drop visuals (simulated)
   ============================================ */

const PRIORITY_COLORS = {
    High: 'bg-red-500/20 text-red-300 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-300 border-green-500/30',
};

// Props Schema definition for Tambo
export const ProjectBoardSchema = z.object({
    title: z.string(),
    columns: z.array(z.string()),
    tasks: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        priority: z.enum(['Low', 'Medium', 'High']).optional(),
    })).optional(),
});

type ProjectBoardProps = z.infer<typeof ProjectBoardSchema>;

export function ProjectBoard({
    title = "Project Board",
    columns = ["To Do", "In Progress", "Done"],
    tasks: initialTasks = []
}: ProjectBoardProps) {
    const [tasks, setTasks] = useState(initialTasks);

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <GlassCard className="w-full overflow-hidden" padding="none">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <span className="text-indigo-300 font-bold">PB</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <button className="text-sm px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Board Area */}
            <div className="p-6 overflow-x-auto">
                <div className="flex gap-4 min-w-[800px]">
                    {columns.map((column, colIndex) => (
                        <div key={column} className="flex-1 min-w-[250px] flex flex-col gap-3">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-300">{column}</span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,255,255,0.05)] text-gray-500">
                                        {getTasksByStatus(column).length}
                                    </span>
                                </div>
                                <button className="p-1 rounded hover:bg-[rgba(255,255,255,0.05)] text-gray-500 hover:text-gray-300">
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Column Background */}
                            <div className="flex-1 rounded-xl bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.03)] p-2 min-h-[300px]">
                                <AnimatePresence>
                                    {getTasksByStatus(column).map((task, index) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group relative bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-colors"
                                            whileHover={{ y: -2 }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-medium border",
                                                    task.priority ? PRIORITY_COLORS[task.priority] : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                                                )}>
                                                    {task.priority || 'Normal'}
                                                </span>
                                                <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <h4 className="text-sm font-medium text-gray-200 mb-1 leading-snug">
                                                {task.title}
                                            </h4>

                                            {task.description && (
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Now</span>
                                                </div>
                                                <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-[8px] flex items-center justify-center text-white font-bold">
                                                    AI
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Empty State */}
                                    {getTasksByStatus(column).length === 0 && (
                                        <div className="h-20 flex items-center justify-center border-2 border-dashed border-[rgba(255,255,255,0.05)] rounded-lg">
                                            <span className="text-xs text-gray-600">Empty</span>
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Add Button */}
                                <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-[rgba(255,255,255,0.03)] rounded-lg transition-colors border border-transparent hover:border-[rgba(255,255,255,0.05)]">
                                    <Plus className="w-3 h-3" />
                                    Add Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
