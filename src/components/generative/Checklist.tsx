'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListChecks } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   CHECKLIST COMPONENT
   
   A simple interactive checklist.
   Features:
   - Check/uncheck items
   - Progress bar
   - Add/remove items (visual only)
   ============================================ */

export const ChecklistSchema = z.object({
    title: z.string(),
    items: z.array(z.object({
        id: z.string(),
        text: z.string(),
        completed: z.boolean(),
    })),
});

type ChecklistProps = z.infer<typeof ChecklistSchema>;

export function Checklist({
    title = "Checklist",
    items: initialItems = []
}: ChecklistProps) {
    const [items, setItems] = useState(initialItems);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const completedCount = items.filter(i => i.completed).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
        <GlassCard className="w-full max-w-md mx-auto" padding="none">
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <ListChecks className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-xs text-gray-400">{completedCount}/{items.length} completed</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                                "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                item.completed
                                    ? "bg-transparent text-gray-500"
                                    : "hover:bg-[rgba(255,255,255,0.03)] text-gray-200"
                            )}
                            onClick={() => toggleItem(item.id)}
                        >
                            <div className={cn(
                                "shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                item.completed
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : "border-gray-600 group-hover:border-indigo-400 text-transparent"
                            )}>
                                <motion.svg
                                    viewBox="0 0 12 10"
                                    fill="none"
                                    className="w-3 h-2.5"
                                    initial={false}
                                    animate={item.completed ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                                >
                                    <path
                                        d="M1 5L4.5 8.5L11 1"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            </div>

                            <span className={cn(
                                "flex-1 text-sm font-medium transition-all",
                                item.completed && "line-through text-gray-600"
                            )}>
                                {item.text}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                        No items in list
                    </div>
                )}

                <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors border border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]">
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>
        </GlassCard>
    );
}
