# Canvas AI — Component Specifications

> Detailed specifications for all 8 generative UI components. Each component is designed to be self-contained, AI-friendly, and visually stunning.

---

## Table of Contents

1. [Component Overview](#component-overview)
2. [Component Standards](#component-standards)
3. [ProjectBoard](#1-projectboard)
4. [Checklist](#2-checklist)
5. [NotesEditor](#3-noteseditor)
6. [DataChart](#4-datachart)
7. [BudgetTracker](#5-budgettracker)
8. [Timeline](#6-timeline)
9. [Timer](#7-timer)
10. [ComparisonTable](#8-comparisontable)

---

## Component Overview

| # | Component | Purpose | Complexity |
|---|-----------|---------|------------|
| 1 | ProjectBoard | Kanban-style task management | High |
| 2 | Checklist | Interactive todo lists | Medium |
| 3 | NotesEditor | Rich text note-taking | Medium |
| 4 | DataChart | Dynamic data visualization | High |
| 5 | BudgetTracker | Financial tracking tables | Medium |
| 6 | Timeline | Horizontal event timelines | Medium |
| 7 | Timer | Focus/pomodoro sessions | Low |
| 8 | ComparisonTable | Feature comparison matrices | Medium |

---

## Component Standards

Every component MUST adhere to these standards:

### File Structure

```
components/generative/ComponentName/
├── index.tsx          # Main component
├── types.ts           # TypeScript interfaces
├── utils.ts           # Helper functions (if needed)
└── ComponentName.test.tsx  # Tests (future)
```

### Required Exports

```typescript
// Each component must export:
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
export { componentNameConfig } from './config';
```

### Props Interface Pattern

```typescript
interface BaseComponentProps {
  // Unique identifier (auto-generated)
  id: string;
  
  // Component title
  title?: string;
  
  // Callback when data changes
  onUpdate?: (data: any) => void;
  
  // Callback when component requests removal
  onRemove?: () => void;
}
```

### Tambo Registration Pattern

```typescript
const componentConfig = {
  name: 'ComponentName',
  description: 'Detailed description of what this component does',
  triggers: ['keyword1', 'keyword2', 'phrase'],
  propsSchema: z.object({
    // Zod schema for props
  }),
};
```

### Visual Standards

- **Container**: `GlassCard` wrapper with consistent padding
- **Animation**: Framer Motion entrance/exit animations
- **Responsive**: Mobile-first, works on all screen sizes
- **Interactive**: Hover states, focus states, loading states

---

## 1. ProjectBoard

### Purpose
A kanban-style project board for organizing tasks into customizable columns. Perfect for project planning, sprint management, and workflow visualization.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 Product Launch Plan                                    ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   To Do     │  │ In Progress │  │    Done     │             │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │             │
│  │ │Research │ │  │ │ Design  │ │  │ │Planning │ │             │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │             │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │             │             │
│  │ │ Testing │ │  │ │  Build  │ │  │             │             │
│  │ └─────────┘ │  │ └─────────┘ │  │             │             │
│  │             │  │             │  │             │             │
│  │  + Add Task │  │  + Add Task │  │  + Add Task │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface ProjectBoardProps {
  id: string;
  title?: string;
  columns?: Array<{
    id: string;
    name: string;
    color?: string;
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
    }>;
  }>;
  onUpdate?: (columns: Column[]) => void;
}
```

### Tambo Triggers

```
"project board", "kanban", "organize tasks", "plan project",
"task board", "sprint board", "workflow", "project management"
```

### Interactions

- **Add Column**: Click "+" to add new column
- **Add Task**: Click "+ Add Task" within column
- **Edit Task**: Click on task to edit inline
- **Move Task**: Drag and drop between columns (future)
- **Delete**: Click "✕" on task or column

---

## 2. Checklist

### Purpose
A simple, elegant checklist for tracking tasks, habits, or any list of items with completion states.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Daily Tasks                                             ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ☑  Morning standup meeting                                     │
│  ☑  Review pull requests                                        │
│  ☐  Write documentation                                         │
│  ☐  Code review for team                                        │
│  ☐  End of day summary                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ + Add new item...                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Progress: ████████░░░░░░░░░░░░ 40%                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface ChecklistProps {
  id: string;
  title?: string;
  items?: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt?: Date;
  }>;
  showProgress?: boolean;
  onUpdate?: (items: ChecklistItem[]) => void;
}
```

### Tambo Triggers

```
"checklist", "todo list", "task list", "to-do", "tasks",
"track", "items", "shopping list", "habit tracker"
```

### Interactions

- **Toggle**: Click checkbox to mark complete/incomplete
- **Add**: Type in input and press Enter
- **Edit**: Double-click item text to edit
- **Delete**: Hover and click delete icon
- **Reorder**: Drag handle to reorder (future)

---

## 3. NotesEditor

### Purpose
A rich text editor for taking notes, writing documents, or drafting content with basic formatting.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  📝 Meeting Notes                                          ✕   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  B   I   U   H1  H2  •  1.  ""  </>                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  # Weekly Sync - February 2, 2026                               │
│                                                                 │
│  ## Attendees                                                   │
│  - John (Product)                                               │
│  - Sarah (Engineering)                                          │
│  - Mike (Design)                                                │
│                                                                 │
│  ## Key Decisions                                               │
│  1. Launch date confirmed for March 15                          │
│  2. Budget approved for marketing campaign                      │
│                                                                 │
│  > "Move fast and ship things" - Team motto                     │
│                                                                 │
│                                                   Word count: 42│
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface NotesEditorProps {
  id: string;
  title?: string;
  content?: string;
  placeholder?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
  onUpdate?: (content: string) => void;
}
```

### Tambo Triggers

```
"notes", "write", "document", "draft", "memo", "journal",
"text editor", "notepad", "writing", "blog post"
```

### Interactions

- **Format**: Use toolbar buttons for formatting
- **Keyboard Shortcuts**: Ctrl+B (bold), Ctrl+I (italic), etc.
- **Auto-save**: Content saved on blur
- **Expand**: Click expand icon for full-screen editing

---

## 4. DataChart

### Purpose
Dynamic data visualization supporting bar, line, pie, and area charts with automatic data parsing.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Monthly Revenue                                [Bar ▼] ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   $50k ┤                                                        │
│        │                    ████                                │
│   $40k ┤              ████  ████                                │
│        │        ████  ████  ████  ████                          │
│   $30k ┤  ████  ████  ████  ████  ████  ████                    │
│        │  ████  ████  ████  ████  ████  ████                    │
│   $20k ┤  ████  ████  ████  ████  ████  ████                    │
│        │  ████  ████  ████  ████  ████  ████                    │
│   $10k ┤  ████  ████  ████  ████  ████  ████                    │
│        └──────────────────────────────────────────              │
│          Jan   Feb   Mar   Apr   May   Jun                      │
│                                                                 │
│  Total: $210,000    Avg: $35,000    Growth: +15%               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface DataChartProps {
  id: string;
  title?: string;
  type?: 'bar' | 'line' | 'pie' | 'area';
  data?: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  showLegend?: boolean;
  showStats?: boolean;
  onUpdate?: (data: ChartData[]) => void;
}
```

### Tambo Triggers

```
"chart", "graph", "visualize", "plot", "bar chart", "line chart",
"pie chart", "data", "statistics", "analytics", "metrics"
```

### Interactions

- **Chart Type**: Dropdown to switch visualization type
- **Hover**: Tooltip with exact values
- **Click**: Select data point for details
- **Edit Data**: Click data point to modify value

---

## 5. BudgetTracker

### Purpose
Financial tracking table for managing budgets, expenses, income, or any monetary tracking needs.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Project Budget                                         ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Category          │  Budgeted  │   Spent   │  Remaining │  │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Development       │   $10,000  │   $7,500  │   $2,500   │  │
│  │  Design            │    $5,000  │   $4,200  │     $800   │  │
│  │  Marketing         │    $8,000  │   $3,000  │   $5,000   │  │
│  │  Infrastructure    │    $2,000  │   $1,800  │     $200   │  │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  TOTAL             │   $25,000  │  $16,500  │   $8,500   │  │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Budget Used: ████████████████░░░░ 66%                         │
│                                                                 │
│  [+ Add Category]                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface BudgetTrackerProps {
  id: string;
  title?: string;
  currency?: string;
  categories?: Array<{
    id: string;
    name: string;
    budgeted: number;
    spent: number;
  }>;
  showProgress?: boolean;
  onUpdate?: (categories: BudgetCategory[]) => void;
}
```

### Tambo Triggers

```
"budget", "expenses", "spending", "costs", "money", "financial",
"finance tracker", "expense tracker", "income", "accounting"
```

### Interactions

- **Add Row**: Click "+ Add Category"
- **Edit Cell**: Click on any cell to edit
- **Delete Row**: Hover row and click delete
- **Sort**: Click column header to sort

---

## 6. Timeline

### Purpose
Horizontal timeline for visualizing events, milestones, project phases, or any chronological data.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  🗓️ Product Roadmap 2026                                   ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     Q1          Q2          Q3          Q4                      │
│  ────●───────────●───────────●───────────●────▶                │
│      │           │           │           │                      │
│      ▼           ▼           ▼           ▼                      │
│  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐                 │
│  │ MVP   │   │ Beta  │   │Launch │   │Scale  │                 │
│  │Launch │   │Testing│   │  V1   │   │ V2    │                 │
│  └───────┘   └───────┘   └───────┘   └───────┘                 │
│                                                                 │
│  Current: Q1 (MVP Launch) ━━━━━━━━━░░░░░░░░░░ 45%              │
│                                                                 │
│  [+ Add Milestone]                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface TimelineProps {
  id: string;
  title?: string;
  milestones?: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    status?: 'completed' | 'current' | 'upcoming';
    color?: string;
  }>;
  showProgress?: boolean;
  onUpdate?: (milestones: Milestone[]) => void;
}
```

### Tambo Triggers

```
"timeline", "roadmap", "schedule", "milestones", "phases",
"project timeline", "gantt", "deadlines", "calendar", "events"
```

### Interactions

- **Add Milestone**: Click "+ Add Milestone"
- **Edit**: Click milestone to edit details
- **Drag**: Drag milestone to reorder
- **Status**: Click to cycle through status

---

## 7. Timer

### Purpose
Focus timer for productivity sessions, pomodoro technique, or any timed activities.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  ⏱️ Focus Session                                          ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────────┐                          │
│                    │                 │                          │
│                    │     25:00       │                          │
│                    │                 │                          │
│                    └─────────────────┘                          │
│                                                                 │
│              ╭────────────────────────────╮                     │
│              │  ████████████░░░░░░░░░░░░  │                     │
│              ╰────────────────────────────╯                     │
│                                                                 │
│          [  ▶ Start  ]    [  ↺ Reset  ]                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Focus: 25 min  │  Short Break: 5 min  │  Long Break: 15│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Today: 4 sessions (100 min)    Streak: 🔥 5 days              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface TimerProps {
  id: string;
  title?: string;
  mode?: 'focus' | 'shortBreak' | 'longBreak';
  durations?: {
    focus: number;      // seconds
    shortBreak: number;
    longBreak: number;
  };
  sessionsBeforeLongBreak?: number;
  onComplete?: () => void;
  onUpdate?: (session: TimerSession) => void;
}
```

### Tambo Triggers

```
"timer", "pomodoro", "focus", "countdown", "stopwatch",
"time tracker", "focus session", "work timer", "break timer"
```

### Interactions

- **Start/Pause**: Toggle timer
- **Reset**: Reset to initial time
- **Mode Switch**: Click mode buttons
- **Settings**: Adjust durations

---

## 8. ComparisonTable

### Purpose
Side-by-side comparison matrix for evaluating options, features, products, or any multi-attribute comparison.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚖️ Framework Comparison                                   ✕   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Feature        │  React   │   Vue    │  Angular  │        │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Learning Curve │   ⭐⭐⭐   │  ⭐⭐⭐⭐⭐  │   ⭐⭐     │        │
│  │  Performance    │  ⭐⭐⭐⭐⭐  │  ⭐⭐⭐⭐   │  ⭐⭐⭐⭐   │        │
│  │  Ecosystem      │  ⭐⭐⭐⭐⭐  │   ⭐⭐⭐   │  ⭐⭐⭐⭐   │        │
│  │  TypeScript     │  ⭐⭐⭐⭐   │  ⭐⭐⭐⭐   │  ⭐⭐⭐⭐⭐  │        │
│  │  Bundle Size    │   ⭐⭐⭐   │  ⭐⭐⭐⭐⭐  │   ⭐⭐     │        │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Overall Score  │   4.0    │   4.2    │    3.6    │        │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [+ Add Row]  [+ Add Column]                                    │
│                                                                 │
│  Winner: Vue (4.2/5) 🏆                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Props Schema

```typescript
interface ComparisonTableProps {
  id: string;
  title?: string;
  columns?: Array<{
    id: string;
    name: string;
  }>;
  rows?: Array<{
    id: string;
    feature: string;
    values: Record<string, number | string>;
  }>;
  showScores?: boolean;
  scoreType?: 'stars' | 'numbers' | 'checkmarks';
  onUpdate?: (data: ComparisonData) => void;
}
```

### Tambo Triggers

```
"compare", "comparison", "versus", "vs", "evaluate", "pros cons",
"feature matrix", "side by side", "options", "alternatives"
```

### Interactions

- **Add Row/Column**: Click respective buttons
- **Edit Cell**: Click cell to edit value
- **Rating Input**: Click stars or enter number
- **Delete**: Hover and click delete icon
- **Highlight Winner**: Auto-highlights best option

---

## Implementation Priority

For the hackathon, implement in this order:

| Priority | Component | Reason |
|----------|-----------|--------|
| 1 | Checklist | Simple, high-impact, quick win |
| 2 | NotesEditor | Core productivity feature |
| 3 | DataChart | Visual wow factor |
| 4 | ProjectBoard | Complex but impressive |
| 5 | Timer | Easy to implement |
| 6 | BudgetTracker | Practical utility |
| 7 | Timeline | Visual impact |
| 8 | ComparisonTable | Nice to have |

---

<p align="center">
  <sub>8 components. Infinite possibilities. One canvas.</sub>
</p>
