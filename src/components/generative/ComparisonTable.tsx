'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table2,
    Plus,
    X,
    Check,
    Minus,
    ArrowUpDown,
    Star,
    Sparkles
} from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   COMPARISON TABLE COMPONENT
   
   A professional feature comparison table with:
   - Multiple items/products to compare
   - Feature rows with check/x/partial indicators
   - Sortable columns
   - Highlight winner per feature
   - Add/remove items and features
   ============================================ */

/** Feature value types */
type FeatureValue = boolean | string | number | 'partial';

/** Zod schema for comparison item */
const ComparisonItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    highlight: z.boolean().optional(),
});

/** Zod schema for feature row */
const FeatureRowSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string().optional(),
    values: z.record(z.string(), z.union([z.boolean(), z.string(), z.number(), z.literal('partial')])),
});

/** Zod schema for type validation */
export const ComparisonTableSchema = z.object({
    title: z.string().default('Feature Comparison'),
    items: z.array(ComparisonItemSchema).default([]),
    features: z.array(FeatureRowSchema).default([]),
    showWinner: z.boolean().default(true),
    allowEdit: z.boolean().default(true),
});

/** Props type inferred from Zod schema */
export type ComparisonTableProps = z.infer<typeof ComparisonTableSchema>;
export type ComparisonItem = z.infer<typeof ComparisonItemSchema>;
export type FeatureRow = z.infer<typeof FeatureRowSchema>;

/**
 * ComparisonTable - A professional feature comparison component
 * 
 * @description Renders an interactive comparison table for products,
 * features, or options with visual indicators and sorting.
 * 
 * @param {string} title - The table title
 * @param {ComparisonItem[]} items - Items to compare (columns)
 * @param {FeatureRow[]} features - Feature rows
 * @param {boolean} showWinner - Whether to show winner badges
 * @param {boolean} allowEdit - Whether to allow editing
 * 
 * @example
 * <ComparisonTable
 *   title="Plan Comparison"
 *   items={[{ id: '1', name: 'Basic' }, { id: '2', name: 'Pro' }]}
 *   features={[{ id: 'f1', name: 'Storage', values: { '1': '10GB', '2': '100GB' }}]}
 * />
 */
export function ComparisonTable({
    title = 'Feature Comparison',
    items: initialItems = [],
    features: initialFeatures = [],
    showWinner = true,
    allowEdit = true,
}: ComparisonTableProps) {
    const [items, setItems] = useState<ComparisonItem[]>(initialItems);
    const [features, setFeatures] = useState<FeatureRow[]>(initialFeatures);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isAddingFeature, setIsAddingFeature] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newFeatureName, setNewFeatureName] = useState('');

    // Calculate scores for each item
    const itemScores = useMemo(() => {
        const scores: Record<string, number> = {};
        items.forEach(item => {
            scores[item.id] = features.reduce((score, feature) => {
                const value = feature.values[item.id];
                if (value === true) return score + 1;
                if (value === 'partial') return score + 0.5;
                if (typeof value === 'number') return score + value;
                return score;
            }, 0);
        });
        return scores;
    }, [items, features]);

    // Find winner (highest score)
    const winnerId = useMemo(() => {
        if (!showWinner || items.length === 0) return null;
        return Object.entries(itemScores).reduce((a, b) =>
            (itemScores[a[0]] || 0) > (itemScores[b[0]] || 0) ? a : b
        )[0];
    }, [itemScores, showWinner, items]);

    /** Add new item */
    const handleAddItem = useCallback(() => {
        if (!newItemName.trim()) return;

        const newItem: ComparisonItem = {
            id: `item-${Date.now()}`,
            name: newItemName.trim(),
        };

        setItems(prev => [...prev, newItem]);

        // Initialize all feature values for new item
        setFeatures(prev => prev.map(f => ({
            ...f,
            values: { ...f.values, [newItem.id]: false }
        })));

        setNewItemName('');
        setIsAddingItem(false);
    }, [newItemName]);

    /** Add new feature */
    const handleAddFeature = useCallback(() => {
        if (!newFeatureName.trim()) return;

        const newFeature: FeatureRow = {
            id: `feature-${Date.now()}`,
            name: newFeatureName.trim(),
            values: items.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
        };

        setFeatures(prev => [...prev, newFeature]);
        setNewFeatureName('');
        setIsAddingFeature(false);
    }, [newFeatureName, items]);

    /** Delete item */
    const handleDeleteItem = useCallback((itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
        setFeatures(prev => prev.map(f => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [itemId]: _removed, ...rest } = f.values;
            return { ...f, values: rest };
        }));
    }, []);

    /** Delete feature */
    const handleDeleteFeature = useCallback((featureId: string) => {
        setFeatures(prev => prev.filter(f => f.id !== featureId));
    }, []);

    /** Toggle feature value */
    const toggleFeatureValue = useCallback((featureId: string, itemId: string) => {
        setFeatures(prev => prev.map(f => {
            if (f.id !== featureId) return f;
            const currentValue = f.values[itemId];
            // Cycle: false -> true -> partial -> false
            let newValue: FeatureValue;
            if (currentValue === false || currentValue === undefined) newValue = true;
            else if (currentValue === true) newValue = 'partial';
            else newValue = false;

            return { ...f, values: { ...f.values, [itemId]: newValue } };
        }));
    }, []);

    /** Sort features by item */
    const handleSort = useCallback((itemId: string) => {
        if (sortBy === itemId) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(itemId);
            setSortOrder('desc');
        }
    }, [sortBy]);

    /** Render feature value cell */
    const renderValue = (value: FeatureValue | undefined, itemId: string, featureId: string) => {
        const isClickable = allowEdit;
        const baseClasses = cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            isClickable && "cursor-pointer hover:scale-110"
        );

        if (value === true) {
            return (
                <button
                    onClick={() => isClickable && toggleFeatureValue(featureId, itemId)}
                    className={cn(baseClasses, "bg-emerald-500/20 text-emerald-400")}
                    aria-label="Yes"
                >
                    <Check className="w-4 h-4" />
                </button>
            );
        }

        if (value === 'partial') {
            return (
                <button
                    onClick={() => isClickable && toggleFeatureValue(featureId, itemId)}
                    className={cn(baseClasses, "bg-amber-500/20 text-amber-400")}
                    aria-label="Partial"
                >
                    <Minus className="w-4 h-4" />
                </button>
            );
        }

        if (value === false || value === undefined) {
            return (
                <button
                    onClick={() => isClickable && toggleFeatureValue(featureId, itemId)}
                    className={cn(baseClasses, "bg-rose-500/10 text-rose-400/60")}
                    aria-label="No"
                >
                    <X className="w-4 h-4" />
                </button>
            );
        }

        // For string or number values
        return (
            <span className="text-sm font-medium text-white">
                {value}
            </span>
        );
    };

    // Sort features
    const sortedFeatures = useMemo(() => {
        if (!sortBy) return features;

        return [...features].sort((a, b) => {
            const aVal = a.values[sortBy];
            const bVal = b.values[sortBy];

            const aScore = aVal === true ? 2 : aVal === 'partial' ? 1 : 0;
            const bScore = bVal === true ? 2 : bVal === 'partial' ? 1 : 0;

            return sortOrder === 'asc' ? aScore - bScore : bScore - aScore;
        });
    }, [features, sortBy, sortOrder]);

    return (
        <GlassCard
            className="w-full"
            padding="none"
            role="region"
            aria-label={`${title}: comparing ${items.length} items`}
        >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                            <Table2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                            <p className="text-sm text-gray-400">
                                {items.length} items • {features.length} features
                            </p>
                        </div>
                    </div>
                    {allowEdit && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsAddingItem(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
                                aria-label="Add item"
                            >
                                <Plus className="w-3 h-3" />
                                Add Item
                            </button>
                            <button
                                onClick={() => setIsAddingFeature(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-lg transition-colors"
                                aria-label="Add feature"
                            >
                                <Plus className="w-3 h-3" />
                                Add Feature
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Item Form */}
            <AnimatePresence>
                {isAddingItem && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-[rgba(255,255,255,0.06)] overflow-hidden"
                    >
                        <div className="p-4 flex gap-2">
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                placeholder="Item name..."
                                className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                                autoFocus
                            />
                            <button
                                onClick={handleAddItem}
                                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-sm rounded-lg transition-colors"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsAddingItem(false)}
                                className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 text-sm rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Feature Form */}
            <AnimatePresence>
                {isAddingFeature && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-[rgba(255,255,255,0.06)] overflow-hidden"
                    >
                        <div className="p-4 flex gap-2">
                            <input
                                type="text"
                                value={newFeatureName}
                                onChange={(e) => setNewFeatureName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                placeholder="Feature name..."
                                className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                                autoFocus
                            />
                            <button
                                onClick={handleAddFeature}
                                className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-sm rounded-lg transition-colors"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsAddingFeature(false)}
                                className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 text-sm rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            {items.length > 0 || features.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full" role="table">
                        {/* Header Row - Items */}
                        <thead>
                            <tr className="border-b border-[rgba(255,255,255,0.06)]">
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                    Features
                                </th>
                                {items.map((item) => (
                                    <th key={item.id} className="p-4 text-center min-w-[120px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                {showWinner && item.id === winnerId && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full"
                                                    >
                                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                                        <span className="text-xs text-amber-300">Winner</span>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleSort(item.id)}
                                                className="flex items-center gap-1 text-sm font-semibold text-white hover:text-cyan-300 transition-colors group"
                                            >
                                                {item.name}
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                            {item.description && (
                                                <span className="text-xs text-gray-500">{item.description}</span>
                                            )}
                                            {allowEdit && (
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-1 text-gray-600 hover:text-rose-400 transition-colors"
                                                    aria-label={`Delete ${item.name}`}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Feature Rows */}
                        <tbody>
                            <AnimatePresence>
                                {sortedFeatures.map((feature, index) => (
                                    <motion.tr
                                        key={feature.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-300">{feature.name}</span>
                                                {allowEdit && (
                                                    <button
                                                        onClick={() => handleDeleteFeature(feature.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-rose-400 transition-all"
                                                        aria-label={`Delete feature: ${feature.name}`}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        {items.map((item) => (
                                            <td key={item.id} className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    {renderValue(feature.values[item.id] as FeatureValue | undefined, item.id, feature.id)}
                                                </div>
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>

                        {/* Score Row */}
                        {showWinner && items.length > 0 && features.length > 0 && (
                            <tfoot>
                                <tr className="bg-[rgba(0,0,0,0.2)]">
                                    <td className="p-4 text-sm font-medium text-gray-400">Score</td>
                                    {items.map((item) => (
                                        <td key={item.id} className="p-4 text-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold",
                                                item.id === winnerId
                                                    ? "bg-amber-500/20 text-amber-300"
                                                    : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                                            )}>
                                                {item.id === winnerId && <Star className="w-3 h-3" />}
                                                {itemScores[item.id]?.toFixed(1) || 0}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            ) : (
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                        <Table2 className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-400">No items to compare</p>
                    <p className="text-xs text-gray-500 mt-1">Add items and features to get started</p>
                    {allowEdit && (
                        <div className="flex gap-2 justify-center mt-4">
                            <button
                                onClick={() => setIsAddingItem(true)}
                                className="text-xs text-cyan-400 hover:text-cyan-300"
                            >
                                + Add Item
                            </button>
                            <span className="text-gray-600">•</span>
                            <button
                                onClick={() => setIsAddingFeature(true)}
                                className="text-xs text-indigo-400 hover:text-indigo-300"
                            >
                                + Add Feature
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Legend */}
            {(items.length > 0 && features.length > 0) && (
                <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]">
                    <div className="flex items-center justify-center gap-6 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                            <span className="text-gray-400">Included</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <Minus className="w-2.5 h-2.5 text-amber-400" />
                            </div>
                            <span className="text-gray-400">Partial</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                                <X className="w-2.5 h-2.5 text-rose-400/60" />
                            </div>
                            <span className="text-gray-400">Not included</span>
                        </div>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}

export default ComparisonTable;
