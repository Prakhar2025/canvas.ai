import { TamboComponent } from '@tambo-ai/react';
import { ProjectBoard } from '@/components/generative/ProjectBoard';
import { BudgetTracker } from '@/components/generative/BudgetTracker';
import { Checklist } from '@/components/generative/Checklist';
import { Timer } from '@/components/generative/Timer';
import { DataChart } from '@/components/generative/DataChart';
import { Timeline } from '@/components/generative/Timeline';
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
        description: 'A Kanban-style project board. Use this when the user mentions "project", "tasks", "kanban", "board", or "manage". ALWAYS try to generate 3-5 realistic initial tasks based on the user\'s intent.',
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
            })).default([]).describe('List of initial tasks. GENERATE 3-5 RELEVANT TASKS based on user request.'),
        }),
    },
    {
        name: 'BudgetTracker',
        description: 'A finance dashboard for budget and expenses. Use this when the user mentions "budget", "finance", "money", "track", "spending", or "expenses".',
        component: BudgetTracker,
        propsDefinition: z.object({
            categories: z.array(z.string()).default(['Food', 'Rent', 'Utilities', 'Entertainment']).describe('List of expense categories'),
            currency: z.string().default('USD').describe('Currency symbol or code'),
            trackingPeriod: z.enum(['Weekly', 'Monthly', 'Yearly']).default('Monthly').describe('Time period for tracking'),
            startingBudget: z.number().default(0).describe('The initial budget amount - ALWAYS set this based on user input'),
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
        description: 'A simple interactive checklist. Use this for "todo list", "checklist", "grocery list", "steps", or "guide". ALWAYS populate with items.',
        component: Checklist,
        propsDefinition: z.object({
            title: z.string().default('Checklist').describe('The title of the checklist'),
            items: z.array(z.object({
                id: z.string(),
                text: z.string(),
                completed: z.boolean().default(false),
            })).default([]).describe('List of checklist items. GENERATE A COMPLETE LIST based on user request.'),
        }),
    },
    {
        name: 'Timer',
        description: 'A Pomodoro/focus timer. Use this when the user mentions "timer", "pomodoro", "focus", "productivity", "work session", or "time tracking".',
        component: Timer,
        propsDefinition: z.object({
            title: z.string().default('Focus Timer').describe('The title for the timer'),
            workDuration: z.number().default(25).describe('Work session duration in minutes'),
            shortBreakDuration: z.number().default(5).describe('Short break duration in minutes'),
            longBreakDuration: z.number().default(15).describe('Long break duration in minutes'),
            sessionsBeforeLongBreak: z.number().default(4).describe('Work sessions before a long break'),
            autoStartBreaks: z.boolean().default(false).describe('Auto-start breaks'),
            autoStartWork: z.boolean().default(false).describe('Auto-start work sessions'),
        }),
    },
    {
        name: 'DataChart',
        description: 'A data visualization chart. Use this when the user mentions "chart", "graph", "data", "visualization", "statistics", "analytics", or "metrics". Supports bar, line, area, and pie charts.',
        component: DataChart,
        propsDefinition: z.object({
            title: z.string().default('Data Chart').describe('The chart title'),
            chartType: z.enum(['bar', 'line', 'area', 'pie']).default('bar').describe('Type of chart to display'),
            data: z.array(z.object({
                name: z.string(),
                value: z.number(),
                category: z.string().optional(),
            })).default([]).describe('Array of data points. GENERATE REALISTIC DATA based on user context.'),
            xAxisLabel: z.string().optional().describe('Label for X-axis'),
            yAxisLabel: z.string().optional().describe('Label for Y-axis'),
            showLegend: z.boolean().default(true).describe('Whether to show legend'),
            showGrid: z.boolean().default(true).describe('Whether to show grid'),
        }),
    },
    {
        name: 'Timeline',
        description: 'A project timeline/roadmap. Use this when the user mentions "timeline", "roadmap", "milestones", "schedule", "phases", or "project plan". ALWAYS generate milestones.',
        component: Timeline,
        propsDefinition: z.object({
            title: z.string().default('Project Timeline').describe('The timeline title'),
            milestones: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional(),
                date: z.string(),
                status: z.enum(['completed', 'in-progress', 'upcoming']),
            })).default([]).describe('List of milestones. GENERATE 4-6 RELEVANT MILESTONES based on user request.'),
            showDates: z.boolean().default(true).describe('Whether to show dates'),
            allowEdit: z.boolean().default(true).describe('Whether to allow editing'),
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
