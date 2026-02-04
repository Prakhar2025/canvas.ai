'use client';

// ... imports
import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Clock, X } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { withInteractable, useTamboComponentState } from '@tambo-ai/react';

/* ============================================
   PROJECT BOARD COMPONENT
   ============================================ */

/** Priority color mappings for visual indicators */
const PRIORITY_COLORS = {
    High: 'bg-red-500/20 text-red-300 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-300 border-green-500/30',
} as const;

/** Zod schema for type validation */
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

/** State schema for synchronization */
const ProjectBoardStateSchema = z.object({
    tasks: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        priority: z.enum(['Low', 'Medium', 'High']).optional(),
    })),
});

/** Props type inferred from Zod schema */
export type ProjectBoardProps = z.infer<typeof ProjectBoardSchema>;

/** Task type for internal state management */
interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority?: 'Low' | 'Medium' | 'High';
}

/**
 * ProjectBoard - A Kanban-style project management component
 */
function ProjectBoardBase({
    title = "Project Board",
    columns = ["To Do", "In Progress", "Done"],
    tasks: initialTasks = []
}: ProjectBoardProps) {
    // Sync 'tasks' state with Tambo
    const [tasks, setTasks] = useTamboComponentState<Task[]>('tasks', initialTasks);

    const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const instanceId = useId();

    /** Get tasks filtered by column status */
    const getTasksByStatus = useCallback((status: string): Task[] => {
        return (tasks || []).filter(task => task.status === status);
    }, [tasks]);

    /** Add a new task to a specific column */
    const handleAddTask = useCallback((column: string) => {
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: newTaskTitle.trim(),
            status: column,
            priority: 'Medium',
        };

        const currentTasks = tasks || [];
        setTasks([...currentTasks, newTask]);
        setNewTaskTitle('');
        setAddingToColumn(null);
    }, [newTaskTitle, tasks, setTasks]);

    /** Delete a task by ID */
    const handleDeleteTask = useCallback((taskId: string) => {
        const currentTasks = tasks || [];
        setTasks(currentTasks.filter(task => task.id !== taskId));
    }, [tasks, setTasks]);

    /** Handle keyboard events for accessibility */
    const handleKeyDown = useCallback((e: React.KeyboardEvent, column: string) => {
        if (e.key === 'Enter') {
            handleAddTask(column);
        } else if (e.key === 'Escape') {
            setAddingToColumn(null);
            setNewTaskTitle('');
        }
    }, [handleAddTask]);

    return (
        <GlassCard
            className="w-full overflow-hidden"
            padding="none"
            role="region"
            aria-label={`Project board: ${title}`}
        >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <span className="text-indigo-300 font-bold text-sm">PB</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                </div>
                <button
                    className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                    aria-label="Board options"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Board Area - Responsive */}
            <div className="p-4 sm:p-6 overflow-x-auto">
                <div
                    className="flex gap-3 sm:gap-4 min-w-[280px]"
                    role="list"
                    aria-label="Board columns"
                >
                    {columns.map((column) => (
                        <div
                            key={column}
                            className="flex-1 min-w-[240px] sm:min-w-[280px] flex flex-col gap-3"
                            role="listitem"
                            aria-label={`Column: ${column}`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-300">{column}</span>
                                    <span
                                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,255,255,0.05)] text-gray-500"
                                        aria-label={`${getTasksByStatus(column).length} tasks`}
                                    >
                                        {getTasksByStatus(column).length}
                                    </span>
                                </div>
                                <button
                                    className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] text-gray-500 hover:text-gray-300 transition-colors"
                                    onClick={() => setAddingToColumn(column)}
                                    aria-label={`Add task to ${column}`}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Column Content */}
                            <div
                                className="flex-1 rounded-xl bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.03)] p-2 min-h-[200px] sm:min-h-[300px]"
                                role="list"
                                aria-label={`Tasks in ${column}`}
                            >
                                <AnimatePresence mode="popLayout">
                                    {getTasksByStatus(column).map((task, index) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-2 transition-colors"
                                            role="listitem"
                                            tabIndex={0}
                                            aria-label={`Task: ${task.title}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-medium border",
                                                    task.priority ? PRIORITY_COLORS[task.priority] : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                                                )}>
                                                    {task.priority || 'Normal'}
                                                </span>
                                                <button
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all rounded hover:bg-red-500/10"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    aria-label={`Delete task: ${task.title}`}
                                                >
                                                    <X className="w-3 h-3" />
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

                                    {/* Add Task Input */}
                                    {addingToColumn === column && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-2"
                                        >
                                            <input
                                                type="text"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, column)}
                                                placeholder="Task title..."
                                                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                                                autoFocus
                                                aria-label="New task title"
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAddTask(column)}
                                                    className="flex-1 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-lg transition-colors"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => { setAddingToColumn(null); setNewTaskTitle(''); }}
                                                    className="px-3 py-1.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 text-xs rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Empty State */}
                                    {getTasksByStatus(column).length === 0 && addingToColumn !== column && (
                                        <div className="h-20 flex items-center justify-center border-2 border-dashed border-[rgba(255,255,255,0.05)] rounded-lg">
                                            <span className="text-xs text-gray-600">No tasks</span>
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Add Button */}
                                {addingToColumn !== column && (
                                    <button
                                        onClick={() => setAddingToColumn(column)}
                                        className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-[rgba(255,255,255,0.03)] rounded-lg transition-colors border border-transparent hover:border-[rgba(255,255,255,0.05)]"
                                        aria-label={`Add task to ${column}`}
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Task
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}

// Export as interactable component
export const ProjectBoard = withInteractable(ProjectBoardBase, {
    componentName: "ProjectBoard",
    description: "A Kanban-style project board. Users can add, move, and complete tasks.",
    propsSchema: ProjectBoardSchema,
    stateSchema: ProjectBoardStateSchema
});

export default ProjectBoard;
