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

**Canvas AI** reimagines how developers and teams work with data. Instead of navigating through multiple apps (GitHub, Notion, Jira, Trello) — you simply *describe* what you need, and the interface builds itself while **staying synchronized with your tools**.

This is not just Generative UI. This is **Generative UI + MCP** — where interfaces don't just appear, they **connect to your real workflow**.

> "The best interface is no interface. The next best is one that creates itself *and integrates with everything*."

**Perfect for:**
- 🚀 **Developers**: "Show my GitHub issues" → Visual board synced with your repo
- 📊 **Product Managers**: "Track Q1 roadmap" → Timeline with real data
- 💰 **Founders**: "Budget tracker for seed round" → Live financial dashboard
- 🎯 **Teams**: Save workspaces, share with team, resume from any device

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

### 🔥 Model Context Protocol (MCP) Integration
**Zero-setup MCP features that work instantly:**
- **GitHub MCP**: Fetch issues from ANY public repo (React, Next.js, TypeScript, etc.) - **No tokens needed!**
- **File System MCP**: Save/load workspaces with browser LocalStorage
- **Graceful fallbacks**: All features work with or without API keys

### 🎨 10 Intelligent Components

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
| **CodeSnippet** | "code", "function", "script" | Syntax-highlighted code with copy/download |
| **Whiteboard** | "draw", "diagram", "sketch" | Interactive drawing canvas |

### 🛠️ 10 AI-Powered Tools (Real Integrations!)

| Tool | What It Does | Setup Required | Example |
|------|--------------|----------------|--------|
| **Calculator** | Math & percentages | ❌ None | "What's 20% of $15000?" |
| **Weather** ⚡ | Real-time weather | ⚠️ API key (optional) | "Weather in Tokyo" |
| **Time** | Current date/time | ❌ None | "What time is it?" |
| **Quote** | Inspirational quotes | ❌ None | "Give me a motivation quote" |
| **Memory** | Context persistence | ❌ None | "Remember my budget is $5000" |
| **Export** | Share workspace | ❌ None | "Export as markdown" |
| **Web Search** ⚡ | Google results | ⚠️ API key (optional) | "Search latest AI news" |
| **GitHub Issues** 🔥 | Fetch repo issues | ❌ **No token needed!** | "Show React issues" |
| **Save Workspace** 🔥 | Persistent storage | ❌ None (LocalStorage) | "Save my workspace" |
| **Load Workspace** 🔥 | Restore sessions | ❌ None (LocalStorage) | "Load my last project" |

> **🔥 GitHub Integration:** Uses public GitHub API - works for ANY popular repo without authentication!
> Try: "Show React issues", "Show Next.js issues", "Show TypeScript issues"

### 🌌 Premium Design System
- **Glassmorphism** — Frosted glass cards with depth
- **Dark Mode First** — Easy on the eyes, premium feel
- **Micro-animations** — Every interaction feels alive
- **Responsive** — Seamless from mobile to desktop

### ⚡ Superpowers (Agentic OS)
- **Voice Control** — Speak your commands naturally
- **Bi-Directional Sync** — Drag a card, and the AI knows. Check a box, and the AI tracks progress
- **Smart Tools** — Calculator, weather, time, quotes, memory, export & web search
- **Keyboard Shortcuts** — Ctrl+K command palette, Ctrl+/ voice toggle, Ctrl+Enter submit
- **Auto-Save** — Workspace persistence with localStorage

### 🚀 Built for Performance
- Server-side rendering with Next.js 16
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
✨ "Show me a Python function for fibonacci"
✨ "Create a whiteboard for brainstorming"
✨ "What's 15% tip on $85?"
✨ "Show React issues" 🔥 NEW - Works instantly, no setup!
✨ "Show Next.js issues" 🔥 Live GitHub data
✨ "Show TypeScript issues" 🔥 Any popular repo
✨ "Save my workspace as 'Product Launch Plan'"
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

Create a `.env.local` file in the root directory:

```bash
# ============================================
# REQUIRED - Core Functionality
# ============================================
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here

# ============================================
# OPTIONAL - Enhanced Features (Recommended for Hackathon)
# ============================================

# Real Weather Data (Get free key: https://openweathermap.org/api)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

# Real Web Search (Get key: https://serpapi.com/)
NEXT_PUBLIC_SERPAPI_KEY=your_serpapi_key

# ============================================
# MCP INTEGRATIONS - GitHub (Highly Recommended!)
# ============================================

# GitHub Personal Access Token (https://github.com/settings/tokens)
# Required scopes: 'repo', 'read:org'
GITHUB_TOKEN=ghp_your_github_personal_access_token

# Your GitHub repository details
GITHUB_REPO_OWNER=Prakhar2025
GITHUB_REPO_NAME=canvas.ai
```

**⚠️ Important:** Without API keys, tools will run in demo mode with simulated data. For the **full experience and hackathon judging**, configure at least:
1. ✅ `NEXT_PUBLIC_TAMBO_API_KEY` (Required)
2. ✅ `GITHUB_TOKEN` (Highly recommended - enables MCP features)
3. ✅ `NEXT_PUBLIC_OPENWEATHER_API_KEY` (Shows real API integration)

---

### Quick Start Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build (test before deployment)
npm run build
npm start

# Lint check
npm run lint
```

**Test MCP Features:**
```
Try in the app:
1. "Show my GitHub issues" (requires GITHUB_TOKEN)
2. "Create issue: Add dark mode toggle"
3. "Save workspace as 'My Project'"
4. "Weather in London" (requires OPENWEATHER_API_KEY)
```

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

## 🏆 Hackathon Submission

### **"The UI Strikes Back" — WeMakeDevs**

Canvas AI showcases the **complete power of Tambo SDK** with cutting-edge MCP integrations:

#### 🔥 Submission Highlights:

**Complete Tambo Coverage:**
- ✅ 10 Generative Components
- ✅ 4 Interactable Components (bi-directional sync)
- ✅ 11 AI Tools (including MCP)
- ✅ Voice Input + Thread Management
- ✅ **4 MCP Integrations** (GitHub + File System)
- ✅ **3 Real APIs** (Weather, Search, GitHub)

**Production Quality:**
- ✅ TypeScript strict + Zod validation
- ✅ 0 build errors
- ✅ Complete documentation (5 MD files)
- ✅ Responsive + Accessible

**→ Full submission details:** [HACKATHON.md](./HACKATHON.md)

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
