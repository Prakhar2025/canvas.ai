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

export { Timer } from './Timer';
export type { TimerProps } from './Timer';

export { DataChart } from './DataChart';
export type { DataChartProps } from './DataChart';

export { Timeline } from './Timeline';
export type { TimelineProps } from './Timeline';

export { NotesEditor } from './NotesEditor';
export type { NotesEditorProps } from './NotesEditor';

export { ComparisonTable } from './ComparisonTable';
export type { ComparisonTableProps } from './ComparisonTable';

// Error handling
export { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';
