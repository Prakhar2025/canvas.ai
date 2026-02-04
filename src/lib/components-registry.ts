import { TamboComponent } from '@tambo-ai/react';
import { ProjectBoard } from '@/components/generative/ProjectBoard';
import { BudgetTracker } from '@/components/generative/BudgetTracker';
import { Checklist } from '@/components/generative/Checklist';
import { Timer } from '@/components/generative/Timer';
import { DataChart } from '@/components/generative/DataChart';
import { Timeline } from '@/components/generative/Timeline';
import { NotesEditor } from '@/components/generative/NotesEditor';
import { ComparisonTable } from '@/components/generative/ComparisonTable';
import { z } from 'zod';

/* ============================================
   COMPONENTS REGISTRY
   
   Central registry of all 8 generative UI components
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
    // ========== PRODUCTIVITY ==========
    {
        name: 'ProjectBoard',
        description: 'A Kanban-style project board. Use this when the user mentions "project", "tasks", "kanban", "board", "sprint", or "manage". Generate 3-5 realistic tasks.',
        component: ProjectBoard,
        propsDefinition: z.object({
            title: z.string().default('Project Board').describe('The title of the project board'),
            columns: z.array(z.string()).default(['To Do', 'In Progress', 'Done']).describe('Column names'),
            tasks: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional(),
                status: z.string(),
                priority: z.enum(['Low', 'Medium', 'High']).optional(),
            })).default([]).describe('Initial tasks. GENERATE 3-5 RELEVANT TASKS.'),
        }),
    },
    {
        name: 'Checklist',
        description: 'A simple interactive checklist. Use for "todo", "checklist", "grocery list", "steps", "guide", or "list". Always populate with items.',
        component: Checklist,
        propsDefinition: z.object({
            title: z.string().default('Checklist').describe('Checklist title'),
            items: z.array(z.object({
                id: z.string(),
                text: z.string(),
                completed: z.boolean().default(false),
            })).default([]).describe('Checklist items. GENERATE A COMPLETE LIST.'),
        }),
    },
    {
        name: 'Timer',
        description: 'A Pomodoro/focus timer. Use for "timer", "pomodoro", "focus", "productivity", "work session", or "time tracking".',
        component: Timer,
        propsDefinition: z.object({
            title: z.string().default('Focus Timer').describe('Timer title'),
            workDuration: z.number().default(25).describe('Work duration in minutes'),
            shortBreakDuration: z.number().default(5).describe('Short break in minutes'),
            longBreakDuration: z.number().default(15).describe('Long break in minutes'),
            sessionsBeforeLongBreak: z.number().default(4).describe('Sessions before long break'),
            autoStartBreaks: z.boolean().default(false).describe('Auto-start breaks'),
            autoStartWork: z.boolean().default(false).describe('Auto-start work'),
        }),
    },
    {
        name: 'Timeline',
        description: 'A project timeline/roadmap. Use for "timeline", "roadmap", "milestones", "schedule", "phases", or "project plan". GENERATE 4-6 milestones.',
        component: Timeline,
        propsDefinition: z.object({
            title: z.string().default('Project Timeline').describe('Timeline title'),
            milestones: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional(),
                date: z.string(),
                status: z.enum(['completed', 'in-progress', 'upcoming']),
            })).default([]).describe('Milestones. GENERATE 4-6 RELEVANT MILESTONES.'),
            showDates: z.boolean().default(true).describe('Show dates'),
            allowEdit: z.boolean().default(true).describe('Allow editing'),
        }),
    },

    // ========== FINANCE ==========
    {
        name: 'BudgetTracker',
        description: 'A finance dashboard for budget and expenses. Use for "budget", "finance", "money", "track", "spending", or "expenses".',
        component: BudgetTracker,
        propsDefinition: z.object({
            categories: z.array(z.string()).default(['Food', 'Rent', 'Utilities', 'Entertainment']).describe('Expense categories'),
            currency: z.string().default('USD').describe('Currency code'),
            trackingPeriod: z.enum(['Weekly', 'Monthly', 'Yearly']).default('Monthly').describe('Tracking period'),
            startingBudget: z.number().default(0).describe('Initial budget - SET THIS based on user input'),
            expenses: z.array(z.object({
                id: z.string(),
                category: z.string(),
                amount: z.number(),
                description: z.string(),
                date: z.string(),
            })).default([]).describe('Initial expenses'),
        }),
    },

    // ========== DATA & ANALYTICS ==========
    {
        name: 'DataChart',
        description: 'Data visualization chart. Use for "chart", "graph", "data", "visualization", "statistics", "analytics", or "metrics". Supports bar, line, area, pie charts.',
        component: DataChart,
        propsDefinition: z.object({
            title: z.string().default('Data Chart').describe('Chart title'),
            chartType: z.enum(['bar', 'line', 'area', 'pie']).default('bar').describe('Chart type'),
            data: z.array(z.object({
                name: z.string(),
                value: z.number(),
                category: z.string().optional(),
            })).default([]).describe('Data points. GENERATE REALISTIC DATA.'),
            xAxisLabel: z.string().optional().describe('X-axis label'),
            yAxisLabel: z.string().optional().describe('Y-axis label'),
            showLegend: z.boolean().default(true).describe('Show legend'),
            showGrid: z.boolean().default(true).describe('Show grid'),
        }),
    },
    {
        name: 'ComparisonTable',
        description: 'Feature comparison table. Use for "compare", "comparison", "features", "options", "alternatives", "pros cons", or "versus".',
        component: ComparisonTable,
        propsDefinition: z.object({
            title: z.string().default('Feature Comparison').describe('Table title'),
            items: z.array(z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().optional(),
                highlight: z.boolean().optional(),
            })).default([]).describe('Items to compare (columns). GENERATE 2-4 OPTIONS.'),
            features: z.array(z.object({
                id: z.string(),
                name: z.string(),
                category: z.string().optional(),
                values: z.record(z.string(), z.union([z.boolean(), z.string(), z.number(), z.literal('partial')])),
            })).default([]).describe('Feature rows. GENERATE 5-8 RELEVANT FEATURES.'),
            showWinner: z.boolean().default(true).describe('Show winner badge'),
            allowEdit: z.boolean().default(true).describe('Allow editing'),
        }),
    },

    // ========== NOTES & DOCUMENTS ==========
    {
        name: 'NotesEditor',
        description: 'Rich text notes editor. Use for "notes", "document", "write", "editor", "journal", or "memo".',
        component: NotesEditor,
        propsDefinition: z.object({
            title: z.string().default('Notes').describe('Notes title'),
            initialContent: z.string().default('').describe('Initial content'),
            placeholder: z.string().default('Start writing...').describe('Placeholder text'),
            showToolbar: z.boolean().default(true).describe('Show formatting toolbar'),
            showWordCount: z.boolean().default(true).describe('Show word count'),
            autoSave: z.boolean().default(true).describe('Enable auto-save'),
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
