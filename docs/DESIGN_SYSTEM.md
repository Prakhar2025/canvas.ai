# Canvas AI — Design System

> A comprehensive design system for building consistent, beautiful, and accessible interfaces. Inspired by the best practices from Apple, Google, and modern design systems.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Effects & Animations](#effects--animations)
7. [Iconography](#iconography)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [CSS Variables Reference](#css-variables-reference)

---

## Design Philosophy

Canvas AI's design is built on four core principles:

### 1. **Depth Through Glass**
We use glassmorphism to create layers of depth. Each component floats above the canvas, creating a sense of dimensionality without sacrificing clarity.

### 2. **Motion With Purpose**
Every animation serves a purpose — to guide attention, provide feedback, or enhance the feeling of direct manipulation. No gratuitous movement.

### 3. **Dark First, Light Ready**
Dark mode is the primary experience, optimized for long focus sessions. Light mode exists as an accessible alternative.

### 4. **Invisible Interface**
The best interface is one that disappears. Components should feel natural, interactions should be intuitive, and the user should focus on their work, not the tools.

---

## Color System

### Primary Palette

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRIMARY COLORS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │ #6366F1 │  │ #8B5CF6 │  │ #A855F7 │  │ #D946EF │           │
│  │ Indigo  │  │ Violet  │  │ Purple  │  │ Fuchsia │           │
│  │ Primary │  │Secondary│  │ Accent  │  │Highlight│           │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#6366F1` | `99, 102, 241` | Primary actions, links, focus states |
| `--color-secondary` | `#8B5CF6` | `139, 92, 246` | Secondary actions, hover states |
| `--color-accent` | `#A855F7` | `168, 85, 247` | Highlights, badges, tags |
| `--color-highlight` | `#D946EF` | `217, 70, 239` | Special emphasis, notifications |

### Semantic Colors

```
┌─────────────────────────────────────────────────────────────────┐
│                       SEMANTIC COLORS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │ #10B981 │  │ #F59E0B │  │ #EF4444 │  │ #3B82F6 │           │
│  │ Success │  │ Warning │  │  Error  │  │  Info   │           │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#10B981` | Completed states, positive feedback |
| `--color-warning` | `#F59E0B` | Warnings, pending states |
| `--color-error` | `#EF4444` | Errors, destructive actions |
| `--color-info` | `#3B82F6` | Informational messages |

### Background Colors (Dark Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-canvas` | `#030303` | Page background |
| `--bg-primary` | `#0A0A0F` | Primary surfaces |
| `--bg-secondary` | `#12121A` | Elevated surfaces |
| `--bg-tertiary` | `#1A1A24` | Highest elevation |
| `--bg-glass` | `rgba(255,255,255,0.03)` | Glass effect base |
| `--bg-glass-hover` | `rgba(255,255,255,0.06)` | Glass hover state |

### Text Colors

| Token | Hex | Opacity | Usage |
|-------|-----|---------|-------|
| `--text-primary` | `#F8FAFC` | 100% | Headings, important text |
| `--text-secondary` | `#94A3B8` | 60% | Body text, descriptions |
| `--text-tertiary` | `#64748B` | 40% | Placeholders, hints |
| `--text-muted` | `#475569` | 30% | Disabled text |

### Gradients

```css
/* Primary gradient - for CTAs and highlights */
--gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);

/* Glow gradient - for hover effects */
--gradient-glow: radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);

/* Mesh gradient - for backgrounds */
--gradient-mesh: 
  radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
  radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
  radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
  radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
```

---

## Typography

### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
```

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-xs` | 12px | 16px | 400 | Labels, captions |
| `--text-sm` | 14px | 20px | 400 | Secondary text |
| `--text-base` | 16px | 24px | 400 | Body text |
| `--text-lg` | 18px | 28px | 500 | Large body |
| `--text-xl` | 20px | 28px | 600 | Small headings |
| `--text-2xl` | 24px | 32px | 600 | Section headings |
| `--text-3xl` | 30px | 36px | 700 | Page headings |
| `--text-4xl` | 36px | 40px | 700 | Hero headings |
| `--text-5xl` | 48px | 48px | 800 | Display text |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-normal` | 400 | Body text |
| `--font-medium` | 500 | Emphasis |
| `--font-semibold` | 600 | Subheadings |
| `--font-bold` | 700 | Headings |
| `--font-extrabold` | 800 | Display |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.025em | Headings |
| `--tracking-normal` | 0 | Body |
| `--tracking-wide` | 0.025em | Labels |

---

## Spacing & Layout

### Spacing Scale

Based on a 4px base unit for precise alignment.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | None |
| `--space-1` | 4px | Minimal |
| `--space-2` | 8px | Tight |
| `--space-3` | 12px | Compact |
| `--space-4` | 16px | Default |
| `--space-5` | 20px | Comfortable |
| `--space-6` | 24px | Spacious |
| `--space-8` | 32px | Section |
| `--space-10` | 40px | Large section |
| `--space-12` | 48px | Major |
| `--space-16` | 64px | Hero |
| `--space-20` | 80px | Maximum |

### Layout Grid

```
┌────────────────────────────────────────────────────────────────────┐
│  ◀───────────────────── Container (max-width: 1280px) ──────────▶ │
│                                                                    │
│  │ Margin │                    Content                   │ Margin │
│  │  24px  │◀─────────────────────────────────────────────▶│  24px  │
│  │        │                                              │        │
│  │        │    ┌─────┐  gap  ┌─────┐  gap  ┌─────┐      │        │
│  │        │    │ Col │ 24px │ Col │ 24px │ Col │      │        │
│  │        │    └─────┘      └─────┘      └─────┘      │        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

| Token | Value | Usage |
|-------|-------|-------|
| `--container-max` | 1280px | Maximum content width |
| `--container-padding` | 24px | Horizontal padding |
| `--grid-gap` | 24px | Grid column gap |
| `--card-padding` | 20px | Card internal padding |

---

## Components

### GlassCard

The foundational component for all surfaces.

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}
```

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small elements, badges |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, dialogs |
| `--radius-xl` | 16px | Large cards |
| `--radius-2xl` | 24px | Hero sections |
| `--radius-full` | 9999px | Pills, avatars |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Dropdowns |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Modals |
| `--shadow-glow` | `0 0 30px rgba(99,102,241,0.3)` | Focus glow |

---

## Effects & Animations

### Timing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General animations |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounce |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Spring effect |

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 100ms | Micro-interactions |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Complex animations |
| `--duration-slower` | 500ms | Page transitions |

### Animation Presets

```css
/* Fade in from below */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Pulse glow */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
  }
}

/* Shimmer loading */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### Framer Motion Variants

```typescript
// Standard entrance
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

// Staggered children
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale on hover
export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};
```

---

## Iconography

### Icon System

We use **Lucide React** for consistent, beautiful icons.

### Sizes

| Size | Value | Usage |
|------|-------|-------|
| `xs` | 14px | Inline with small text |
| `sm` | 16px | Buttons, inputs |
| `md` | 20px | Default |
| `lg` | 24px | Headers, emphasis |
| `xl` | 32px | Feature highlights |
| `2xl` | 48px | Hero sections |

### Icon Colors

- **Default**: Inherit from text color
- **Interactive**: Use `--color-primary` on hover
- **Muted**: Use `--text-tertiary`
- **Semantic**: Use semantic colors for status

---

## Responsive Design

### Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `--screen-sm` | 640px | Large phones |
| `--screen-md` | 768px | Tablets |
| `--screen-lg` | 1024px | Laptops |
| `--screen-xl` | 1280px | Desktops |
| `--screen-2xl` | 1536px | Large screens |

### Responsive Patterns

```css
/* Mobile first approach */
.component {
  padding: var(--space-4);  /* 16px on mobile */
}

@media (min-width: 768px) {
  .component {
    padding: var(--space-6);  /* 24px on tablet+ */
  }
}

@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);  /* 32px on desktop+ */
  }
}
```

---

## Accessibility

### Focus States

All interactive elements must have visible focus states:

```css
.interactive:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}
```

### Color Contrast

- **Text on backgrounds**: Minimum 4.5:1 ratio
- **Large text (18px+)**: Minimum 3:1 ratio
- **Interactive elements**: Minimum 3:1 ratio

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## CSS Variables Reference

Complete reference of all CSS custom properties:

```css
:root {
  /* Colors - Primary */
  --color-primary: #6366F1;
  --color-secondary: #8B5CF6;
  --color-accent: #A855F7;
  --color-highlight: #D946EF;
  
  /* Colors - Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Backgrounds */
  --bg-canvas: #030303;
  --bg-primary: #0A0A0F;
  --bg-secondary: #12121A;
  --bg-tertiary: #1A1A24;
  --bg-glass: rgba(255, 255, 255, 0.03);
  --bg-glass-hover: rgba(255, 255, 255, 0.06);
  
  /* Text */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;
  --text-muted: #475569;
  
  /* Borders */
  --border-default: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-focus: rgba(99, 102, 241, 0.5);
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Borders */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 30px rgba(99, 102, 241, 0.3);
  
  /* Animation */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  
  /* Z-index */
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-modal: 200;
  --z-tooltip: 300;
  --z-toast: 400;
}
```

---

<p align="center">
  <sub>Designed with precision. Built with purpose. Made for the future.</sub>
</p>
