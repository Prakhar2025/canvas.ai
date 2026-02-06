<p align="center">
  <img src="public/logo.svg" alt="Canvas AI Logo" width="120" height="120" />
</p>

<h1 align="center">Canvas AI</h1>

<p align="center">
  <strong>The AI-Native Workspace That Builds Itself</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Tambo-AI-purple?style=for-the-badge" alt="Tambo" />
</p>

<p align="center">
  <a href="https://github.com/Prakhar2025/canvas.ai/stargazers"><img src="https://img.shields.io/github/stars/Prakhar2025/canvas.ai?style=social" alt="Stars" /></a>
  <a href="https://github.com/Prakhar2025/canvas.ai/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" /></a>
  <a href="https://canvas-ai.vercel.app"><img src="https://img.shields.io/badge/demo-live-brightgreen" alt="Demo" /></a>
</p>

---

## 🌟 Vision

**Canvas AI** reimagines how humans interact with software. Instead of navigating through menus, clicking buttons, and learning complex interfaces — you simply *describe* what you need, and the interface builds itself.

> "The best interface is no interface. The next best is one that creates itself."

This is not a chatbot. This is not a dashboard. This is **the future of human-computer interaction** — a blank canvas that transforms into any application based on natural language.

---

## 🎯 The Problem

Modern software is broken:

| Problem | Impact |
|---------|--------|
| **Interface Overload** | Users spend 30% of their time navigating, not working |
| **One-Size-Fits-All** | Every user sees the same UI regardless of their needs |
| **Learning Curve** | New tools require hours of training |
| **Context Switching** | Users juggle 10+ apps to complete one workflow |

---

## 💡 The Solution

Canvas AI introduces **Generative UI** — interfaces that construct themselves in real-time based on user intent.

```
┌─────────────────────────────────────────────────────────────────┐
│  USER: "I need to plan a product launch"                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  📋 Tasks    │  │  📅 Timeline │  │  💰 Budget   │          │
│  │  ━━━━━━━━    │  │  [Gantt]     │  │  [Pie Chart] │          │
│  │  □ Research  │  │              │  │              │          │
│  │  □ Design    │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  USER: "Add competitor analysis"                                │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │  📊 Competitor Matrix                               │        │
│  │  [Auto-generated comparison table]                  │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🧠 Generative UI Engine
Components render dynamically based on natural language. The AI understands context and chooses the right visualization.

### 🎨 8 Intelligent Components

| Component | Triggers | Capability |
|-----------|----------|------------|
| **ProjectBoard** | "plan", "organize", "tasks" | Kanban-style task management |
| **Checklist** | "todo", "list", "track" | Interactive task lists with progress |
| **NotesEditor** | "notes", "write", "document" | Rich text editing |
| **DataChart** | "chart", "visualize", "graph" | Dynamic bar/line/pie charts |
| **BudgetTracker** | "budget", "expenses", "costs" | Financial tables with totals |
| **Timeline** | "timeline", "schedule", "milestones" | Horizontal event timeline |
| **Timer** | "timer", "pomodoro", "focus" | Focus sessions with tracking |
| **ComparisonTable** | "compare", "versus", "analyze" | Feature comparison matrices |

### 🌌 Premium Design System
- **Glassmorphism** — Frosted glass cards with depth
- **Dark Mode First** — Easy on the eyes, premium feel
- **Micro-animations** — Every interaction feels alive
- **Responsive** — Seamless from mobile to desktop

### ⚡ Superpowers (Agentic OS)
- **Voice Control** — Speak your constraints naturally.
- **Bi-Directional Sync** — Drag a card, and the AI knows. Check a box, and the AI tracks progress.
- **Smart Tools** — The Agent can browse the web for real-time data or check the time to plan your schedule.

### 🚀 Built for Performance
- Server-side rendering with Next.js 14
- Optimized bundle with tree-shaking
- Lazy-loaded components
- Edge-ready deployment

---

## 🎬 Demo

**🔗 Live Demo:** [canvas-ai.vercel.app](https://canvas-ai.vercel.app) *(coming soon)*

**📺 Demo Video:** [Watch on YouTube](https://youtube.com) *(coming soon)*

### Try These Prompts:
```
✨ "Create a project board for my startup launch"
✨ "I need a budget tracker for $5000 monthly expenses"  
✨ "Build a comparison table for React vs Vue vs Angular"
✨ "Start a 25-minute focus timer"
✨ "Show me a timeline for product development"
✨ "Create a weekly grocery checklist"
```

### Preview:

> *Screenshot coming after deployment* 📸

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Tambo API key ([Get one here](https://tambo.co))

### Installation

```bash
# Clone the repository
git clone https://github.com/Prakhar2025/canvas.ai.git
cd canvas.ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your TAMBO_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Canvas AI in action.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TAMBO_API_KEY` | Your Tambo API key | Yes |

---

## 🏗️ Architecture

Canvas AI follows a modular, component-driven architecture optimized for AI-powered interfaces.

```
┌─────────────────────────────────────────────────────────────┐
│                        CANVAS AI                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Next.js   │  │   Tambo     │  │   Zustand   │         │
│  │   App Router│  │   SDK       │  │   State     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│  ┌──────▼────────────────▼────────────────▼──────┐         │
│  │              Component Registry               │         │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │         │
│  │  │Task │ │Chart│ │Notes│ │Timer│ │Table│    │         │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘    │         │
│  └───────────────────────────────────────────────┘         │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────┐         │
│  │              Canvas Renderer                   │         │
│  │         (Dynamic Component Orchestration)      │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed system design.

---

## 📁 Project Structure

```
canvas-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Main canvas page
│   │   └── globals.css         # Design system tokens
│   ├── components/
│   │   ├── canvas/             # Canvas container components
│   │   │   ├── Canvas.tsx
│   │   │   ├── CanvasHeader.tsx
│   │   │   └── CommandInput.tsx
│   │   ├── generative/         # AI-rendered components
│   │   │   ├── ProjectBoard.tsx
│   │   │   ├── Checklist.tsx
│   │   │   ├── NotesEditor.tsx
│   │   │   ├── DataChart.tsx
│   │   │   ├── BudgetTracker.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── Timer.tsx
│   │   │   └── ComparisonTable.tsx
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── GlassCard.tsx
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   └── lib/
│       ├── tambo.ts            # Tambo configuration
│       ├── registry.ts         # Component registry
│       └── store.ts            # Global state
├── docs/                       # Documentation
├── public/                     # Static assets
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 | SSR, routing, optimization |
| **Language** | TypeScript | Type safety, DX |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Animation** | Framer Motion | Fluid animations |
| **Charts** | Recharts | Data visualization |
| **Icons** | Lucide React | Consistent iconography |
| **State** | Zustand | Lightweight state management |
| **AI** | Tambo SDK | Generative UI engine |
| **Hosting** | Vercel | Edge deployment |

---

## 🧪 Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ Complete
- [x] Project setup with Next.js 14 + TypeScript
- [x] Documentation (Architecture, Components, Design System)
- [x] Premium glassmorphism design system
- [x] 8 generative UI components
- [x] Tambo AI integration
- [x] **Advanced Voice Control** 🎙️
- [x] **Interactable Components** (Two-way AI Sync) ↔️
- [x] **AI Agent Tools** (Web Search & Time Awareness) 🛠️
- [x] Error boundaries & accessibility
- [x] Responsive design
- [x] Deployment to Vercel

### Phase 2: Enhancement (Q2 2024)
- [ ] User authentication & accounts
- [ ] Workspace persistence (save/load)
- [ ] Component drag-and-drop reordering
- [ ] Global keyboard shortcuts
- [ ] Dark/light theme toggle

### Phase 3: Scale (Q3 2024)
- [ ] Real-time collaboration
- [ ] API integrations (Google Calendar, Notion, Slack)
- [ ] Custom component builder
- [ ] Mobile app (React Native)
- [ ] Enterprise features

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Tambo](https://tambo.co) — For the incredible Generative UI SDK
- [WeMakeDevs](https://wemakedevs.org) — For hosting "The UI Strikes Back" hackathon
- [Vercel](https://vercel.com) — For seamless deployment

---

<p align="center">
  Built with 💜 by <a href="https://github.com/Prakhar2025">Prakhar</a>
</p>

<p align="center">
  <sub>The future of interfaces is generative. The future is Canvas AI.</sub>
</p>
