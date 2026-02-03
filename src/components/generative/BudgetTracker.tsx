'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod'; // Import schema definition lib (though we use props directly)

/* ============================================
   BUDGET TRACKER COMPONENT
   
   A finance dashboard for tracking budget.
   Features:
   - Summary cards (Budget, Spent, Remaining)
   - Expense list
   - Category visualization (simulated)
   ============================================ */

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

type BudgetTrackerProps = z.infer<typeof BudgetTrackerSchema>;

export function BudgetTracker({
    categories = ["Groceries", "Rent", "Utilities", "Entertainment"],
    currency = "USD",
    trackingPeriod = "Monthly",
    startingBudget = 0,
    expenses = []
}: BudgetTrackerProps) {

    // Calculate totals
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remaining = startingBudget - totalSpent;
    const percentUsed = startingBudget > 0 ? (totalSpent / startingBudget) * 100 : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === '$' ? 'USD' : currency,
        }).format(amount);
    };

    return (
        <GlassCard className="w-full" padding="none">
            <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Wallet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Budget Tracker</h3>
                            <p className="text-sm text-gray-400">{trackingPeriod} Overview</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Budget</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(startingBudget)}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Budget</span>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{formatCurrency(startingBudget)}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-2 mb-2 text-rose-400">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Spent</span>
                        </div>
                        <p className="text-2xl font-bold text-rose-200 mb-1">{formatCurrency(totalSpent)}</p>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${Math.min(percentUsed, 100)}%` }} />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <Wallet className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Remaining</span>
                        </div>
                        <p className="text-2xl font-bold text-indigo-200 mb-1">{formatCurrency(remaining)}</p>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <div className="p-6 bg-[rgba(0,0,0,0.2)]">
                <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Recent Expenses</h4>

                {expenses.length > 0 ? (
                    <div className="space-y-3">
                        {expenses.map((expense) => (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
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
                                <span className="text-sm font-bold text-rose-400">
                                    -{formatCurrency(expense.amount)}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[rgba(255,255,255,0.05)] rounded-xl">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-400">No expenses recorded yet</p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
