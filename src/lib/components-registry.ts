import { TamboComponent } from '@tambo-ai/react';
import { ProjectBoard } from '@/components/generative/ProjectBoard';
import { BudgetTracker } from '@/components/generative/BudgetTracker';
import { Checklist } from '@/components/generative/Checklist';
import { z } from 'zod';

/* ============================================
   COMPONENTS REGISTRY
   
   Central registry of all generative UI components
   that Tambo can render based on user intent.
   
   Each component is registered with:
   - name: Unique identifier
   - description: What the AI uses to decide when to render
   - component: The React component to render
   - propsDefinition: Schema for component props
   ============================================ */

/**
 * Registry of all generative components available in Canvas AI.
 * 
 * The AI will select components based on the 'description' field,
 * which should clearly describe when the component should be used.
 */
export const componentsRegistry: TamboComponent[] = [
    {
        name: 'ProjectBoard',
        description: 'A Kanban-style project board for managing tasks with columns like To Do, In Progress, and Done. Use this when the user wants to organize a project, track tasks, or manage workflow.',
        component: ProjectBoard,
        propsDefinition: z.object({
            title: z.string().default('Project Board').describe('The title of the project board'),
            columns: z.array(z.string()).default(['To Do', 'In Progress', 'Done']).describe('List of column names'),
            tasks: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional(),
                status: z.string(),
                priority: z.enum(['Low', 'Medium', 'High']).optional(),
            })).default([]).describe('Initial list of tasks to populate the board with'),
        }),
    },
    {
        name: 'BudgetTracker',
        description: 'A dashboard for tracking budget, expenses, income, and savings. Use this when the user wants to manage finances, track spending, or plan a budget.',
        component: BudgetTracker,
        propsDefinition: z.object({
            categories: z.array(z.string()).default(['Food', 'Rent', 'Utilities', 'Entertainment']).describe('List of expense categories'),
            currency: z.string().default('USD').describe('Currency symbol or code (e.g., "USD", "$", "EUR")'),
            trackingPeriod: z.enum(['Weekly', 'Monthly', 'Yearly']).default('Monthly').describe('The time period for tracking'),
            startingBudget: z.number().default(0).describe('The initial budget amount'),
            expenses: z.array(z.object({
                id: z.string(),
                category: z.string(),
                amount: z.number(),
                description: z.string(),
                date: z.string(),
            })).default([]).describe('List of initial expenses'),
        }),
    },
    {
        name: 'Checklist',
        description: 'A simple interactive checklist for TODOs, grocery lists, or step-by-step guides. Use this for simple lists that don\'t require a full Kanban board.',
        component: Checklist,
        propsDefinition: z.object({
            title: z.string().default('Checklist').describe('The title of the checklist'),
            items: z.array(z.object({
                id: z.string(),
                text: z.string(),
                completed: z.boolean().default(false),
            })).default([]).describe('List of checklist items'),
        }),
    },
];

/**
 * Helper to get a component by name from the registry
 */
export function getComponentByName(name: string): TamboComponent | undefined {
    return componentsRegistry.find((c) => c.name === name);
}

/**
 * Get all component names for debugging
 */
export function getRegisteredComponentNames(): string[] {
    return componentsRegistry.map((c) => c.name);
}

export default componentsRegistry;
