'use client';

import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListChecks, X, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   CHECKLIST COMPONENT
   
   A simple interactive checklist.
   Features:
   - Check/uncheck items with animations
   - Add/remove items
   - Progress bar visualization
   - Accessible keyboard navigation
   ============================================ */

/** Zod schema for type validation */
export const ChecklistSchema = z.object({
    title: z.string(),
    items: z.array(z.object({
        id: z.string(),
        text: z.string(),
        completed: z.boolean(),
    })),
});

/** Props type inferred from Zod schema */
export type ChecklistProps = z.infer<typeof ChecklistSchema>;

/** Item type for internal state management */
interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

/**
 * Checklist - An interactive todo/checklist component
 * 
 * @description Renders an interactive checklist with progress tracking,
 * the ability to add/remove/toggle items, and smooth animations.
 * 
 * @param {string} title - The title displayed in the checklist header
 * @param {ChecklistItem[]} items - Initial list of checklist items
 * 
 * @example
 * <Checklist
 *   title="Grocery Shopping"
 *   items={[
 *     { id: "1", text: "Milk", completed: false },
 *     { id: "2", text: "Eggs", completed: true },
 *   ]}
 * />
 */
export function Checklist({
    title = "Checklist",
    items: initialItems = []
}: ChecklistProps) {
    const [items, setItems] = useState<ChecklistItem[]>(initialItems);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const instanceId = useId();

    /** Toggle item completion status */
    const toggleItem = useCallback((id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    }, []);

    /** Add a new item to the list */
    const handleAddItem = useCallback(() => {
        if (!newItemText.trim()) return;

        const newItem: ChecklistItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: newItemText.trim(),
            completed: false,
        };

        setItems(prev => [...prev, newItem]);
        setNewItemText('');
        setIsAddingItem(false);
    }, [newItemText]);

    /** Delete an item by ID */
    const handleDeleteItem = useCallback((itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    }, []);

    /** Handle keyboard events for accessibility */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddItem();
        } else if (e.key === 'Escape') {
            setIsAddingItem(false);
            setNewItemText('');
        }
    }, [handleAddItem]);

    // Calculate progress
    const completedCount = items.filter(i => i.completed).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
        <GlassCard
            className="w-full max-w-md mx-auto"
            padding="none"
            role="region"
            aria-label={`Checklist: ${title}`}
        >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <ListChecks className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                            <p className="text-xs text-gray-400">{completedCount}/{items.length} completed</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 transition-colors"
                        aria-label="Add new item"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div
                    className="h-2 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress: ${completedCount} of ${items.length} items completed`}
                >
                    <motion.div
                        className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Items List */}
            <div className="p-2 max-h-[400px] overflow-y-auto" role="list" aria-label="Checklist items">
                <AnimatePresence mode="popLayout">
                    {/* Add Item Input */}
                    {isAddingItem && (
                        <motion.div
                            key="add-item-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 mb-2"
                        >
                            <input
                                type="text"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="New item..."
                                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                                autoFocus
                                aria-label="New item text"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleAddItem}
                                    className="flex-1 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-lg transition-colors"
                                >
                                    Add Item
                                </button>
                                <button
                                    onClick={() => { setIsAddingItem(false); setNewItemText(''); }}
                                    className="px-3 py-1.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 text-xs rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Checklist Items */}
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            layout
                            className={cn(
                                "group flex items-center gap-3 p-3 rounded-lg transition-colors",
                                item.completed
                                    ? "bg-transparent"
                                    : "hover:bg-[rgba(255,255,255,0.03)]"
                            )}
                            role="listitem"
                        >
                            <button
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                    "shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                                    item.completed
                                        ? "bg-indigo-500 border-indigo-500 text-white"
                                        : "border-gray-600 hover:border-indigo-400"
                                )}
                                aria-label={item.completed ? `Mark "${item.text}" as incomplete` : `Mark "${item.text}" as complete`}
                                aria-pressed={item.completed}
                            >
                                <AnimatePresence mode="wait">
                                    {item.completed && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            <span className={cn(
                                "flex-1 text-sm font-medium transition-all",
                                item.completed ? "line-through text-gray-600" : "text-gray-200"
                            )}>
                                {item.text}
                            </span>

                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all rounded hover:bg-red-500/10"
                                aria-label={`Delete item: ${item.text}`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty State */}
                {items.length === 0 && !isAddingItem && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                            <ListChecks className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-400">No items yet</p>
                        <button
                            onClick={() => setIsAddingItem(true)}
                            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300"
                        >
                            Add your first item
                        </button>
                    </div>
                )}

                {/* Add Button */}
                {items.length > 0 && !isAddingItem && (
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="w-full mt-2 py-2.5 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors border border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
                        aria-label="Add new item"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                )}
            </div>
        </GlassCard>
    );
}

export default Checklist;
