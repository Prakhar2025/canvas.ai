/**
 * Generative UI Components
 * 
 * These components are dynamically rendered by Tambo AI based on user intent.
 * Each component is registered in `lib/components-registry.ts`.
 * 
 * @module generative
 */

// Core generative components
export { ProjectBoard } from './ProjectBoard';
export type { ProjectBoardProps } from './ProjectBoard';

export { BudgetTracker } from './BudgetTracker';
export type { BudgetTrackerProps } from './BudgetTracker';

export { Checklist } from './Checklist';
export type { ChecklistProps } from './Checklist';

// Error handling
export { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';
