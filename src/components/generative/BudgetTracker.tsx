'use client';

import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Plus, X } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   BUDGET TRACKER COMPONENT
   
   A finance dashboard for tracking budget.
   Features:
   - Summary cards (Budget, Spent, Remaining)
   - Add/remove expenses
   - Category visualization
   - Accessible keyboard navigation
   ============================================ */

/** Zod schema for type validation */
export const BudgetTrackerSchema = z.object({
    categories: z.array(z.string()),
    currency: z.string(),
    trackingPeriod: z.enum(['Weekly', 'Monthly', 'Yearly']),
    startingBudget: z.number(),
    expenses: z.array(z.object({
        id: z.string(),
        category: z.string(),
        amount: z.number(),
        description: z.string(),
        date: z.string(),
    })).optional(),
});

/** Props type inferred from Zod schema */
export type BudgetTrackerProps = z.infer<typeof BudgetTrackerSchema>;

/** Expense type for internal state management */
interface Expense {
    id: string;
    category: string;
    amount: number;
    description: string;
    date: string;
}

/**
 * BudgetTracker - A finance dashboard component
 * 
 * @description Renders an interactive budget tracker with summary cards,
 * expense list, and the ability to add/remove expenses.
 * 
 * @param {string[]} categories - List of expense categories
 * @param {string} currency - Currency code (e.g., "USD")
 * @param {'Weekly' | 'Monthly' | 'Yearly'} trackingPeriod - Time period for tracking
 * @param {number} startingBudget - The initial budget amount
 * @param {Expense[]} expenses - Initial list of expenses
 * 
 * @example
 * <BudgetTracker
 *   categories={["Food", "Rent"]}
 *   currency="USD"
 *   trackingPeriod="Monthly"
 *   startingBudget={3000}
 * />
 */
export function BudgetTracker({
    categories = ["Groceries", "Rent", "Utilities", "Entertainment"],
    currency = "USD",
    trackingPeriod = "Monthly",
    startingBudget = 0,
    expenses: initialExpenses = []
}: BudgetTrackerProps) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [budget, setBudget] = useState<number>(startingBudget);
    const [isEditingBudget, setIsEditingBudget] = useState(startingBudget === 0);
    const [budgetInput, setBudgetInput] = useState(startingBudget > 0 ? startingBudget.toString() : '');
    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: categories[0] || 'Other',
    });
    const instanceId = useId();

    // Calculate totals
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remaining = budget - totalSpent;
    const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

    /** Format number as currency */
    const formatCurrency = useCallback((amount: number): string => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency === '$' ? 'USD' : currency,
            }).format(amount);
        } catch {
            return `$${amount.toFixed(2)}`;
        }
    }, [currency]);

    /** Add a new expense */
    const handleAddExpense = useCallback(() => {
        const amount = parseFloat(newExpense.amount);
        if (!newExpense.description.trim() || isNaN(amount) || amount <= 0) return;

        const expense: Expense = {
            id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: newExpense.description.trim(),
            amount,
            category: newExpense.category,
            date: new Date().toLocaleDateString(),
        };

        setExpenses(prev => [expense, ...prev]);
        setNewExpense({ description: '', amount: '', category: categories[0] || 'Other' });
        setIsAddingExpense(false);
    }, [newExpense, categories]);

    /** Delete an expense */
    const handleDeleteExpense = useCallback((expenseId: string) => {
        setExpenses(prev => prev.filter(e => e.id !== expenseId));
    }, []);

    /** Save budget amount */
    const handleSaveBudget = useCallback(() => {
        const amount = parseFloat(budgetInput);
        if (!isNaN(amount) && amount >= 0) {
            setBudget(amount);
            setIsEditingBudget(false);
        }
    }, [budgetInput]);

    /** Handle keyboard events for expenses */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddExpense();
        } else if (e.key === 'Escape') {
            setIsAddingExpense(false);
        }
    }, [handleAddExpense]);

    /** Handle keyboard events for budget input */
    const handleBudgetKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveBudget();
        } else if (e.key === 'Escape') {
            setIsEditingBudget(false);
            setBudgetInput(budget.toString());
        }
    }, [handleSaveBudget, budget]);

    return (
        <GlassCard
            className="w-full"
            padding="none"
            role="region"
            aria-label={`Budget tracker: ${trackingPeriod} overview`}
        >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Wallet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">Budget Tracker</h3>
                            <p className="text-sm text-gray-400">{trackingPeriod} Overview</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Budget</p>
                        {isEditingBudget ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={budgetInput}
                                    onChange={(e) => setBudgetInput(e.target.value)}
                                    onKeyDown={handleBudgetKeyDown}
                                    placeholder="Enter budget"
                                    className="w-32 px-3 py-1.5 bg-[rgba(255,255,255,0.05)] border border-emerald-500/50 rounded-lg text-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    autoFocus
                                    aria-label="Budget amount"
                                />
                                <button
                                    onClick={handleSaveBudget}
                                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsEditingBudget(true); setBudgetInput(budget.toString()); }}
                                className="text-xl font-bold text-white hover:text-emerald-300 transition-colors"
                                title="Click to edit budget"
                            >
                                {formatCurrency(budget)}
                            </button>
                        )}
                    </div>
                </div>

                {/* Summary Cards - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div
                        className="p-3 sm:p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                        role="status"
                        aria-label={`Budget: ${formatCurrency(budget)}`}
                    >
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Budget</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(budget)}</p>
                    </div>

                    <div
                        className="p-3 sm:p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                        role="status"
                        aria-label={`Spent: ${formatCurrency(totalSpent)}, ${percentUsed.toFixed(0)}% of budget`}
                    >
                        <div className="flex items-center gap-2 mb-2 text-rose-400">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Spent</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-rose-200">{formatCurrency(totalSpent)}</p>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
                            <motion.div
                                className={cn("h-full", percentUsed > 90 ? "bg-red-500" : "bg-rose-500")}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div
                        className="p-3 sm:p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                        role="status"
                        aria-label={`Remaining: ${formatCurrency(remaining)}`}
                    >
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <Wallet className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Remaining</span>
                        </div>
                        <p className={cn(
                            "text-xl sm:text-2xl font-bold",
                            remaining < 0 ? "text-red-400" : "text-indigo-200"
                        )}>
                            {formatCurrency(remaining)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <div className="p-4 sm:p-6 bg-[rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recent Expenses</h4>
                    <button
                        onClick={() => setIsAddingExpense(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 rounded-lg transition-colors"
                        aria-label="Add new expense"
                    >
                        <Plus className="w-3 h-3" />
                        Add
                    </button>
                </div>

                {/* Add Expense Form */}
                <AnimatePresence>
                    {isAddingExpense && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Description"
                                    className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                                    autoFocus
                                    aria-label="Expense description"
                                />
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Amount"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                                    aria-label="Expense amount"
                                />
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    aria-label="Expense category"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddExpense}
                                    className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-lg transition-colors"
                                >
                                    Add Expense
                                </button>
                                <button
                                    onClick={() => setIsAddingExpense(false)}
                                    className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-400 text-xs rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Expenses List */}
                {expenses.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto" role="list" aria-label="Expense list">
                        <AnimatePresence>
                            {expenses.map((expense) => (
                                <motion.div
                                    key={expense.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="group flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    role="listitem"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{expense.description}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">{expense.category}</span>
                                                <span className="text-[10px] text-gray-600">•</span>
                                                <span className="text-xs text-gray-500">{expense.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-rose-400">
                                            -{formatCurrency(expense.amount)}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteExpense(expense.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all rounded hover:bg-red-500/10"
                                            aria-label={`Delete expense: ${expense.description}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-400">No expenses recorded yet</p>
                        <p className="text-xs text-gray-500 mt-1">Click "Add" to log your first expense</p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

export default BudgetTracker;
