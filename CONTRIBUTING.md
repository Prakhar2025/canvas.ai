# Contributing to Canvas AI

Thank you for considering contributing to Canvas AI! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Commit Messages](#commit-messages)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, be helpful, and be constructive.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/canvas.ai.git
   cd canvas.ai
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

---

## Development Workflow

### Branch Naming

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation
- `refactor/` — Code refactoring
- `test/` — Test additions

### Running Tests

```bash
# Lint
npm run lint

# Type check
npm run type-check

# All checks
npm run check
```

---

## Pull Request Process

1. **Update documentation** if needed
2. **Write descriptive PR title** following commit conventions
3. **Fill out the PR template** completely
4. **Request review** from maintainers
5. **Address feedback** promptly

### PR Checklist

- [ ] Code follows the style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Responsive design verified

---

## Style Guide

### TypeScript

- Use explicit types (avoid `any`)
- Use interfaces over types where possible
- Document complex functions with JSDoc

### React

- Use functional components with hooks
- Use named exports
- Keep components small and focused
- Use Framer Motion for animations

### CSS

- Use Tailwind utility classes
- Follow the design system tokens
- Use CSS variables for custom values

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructuring |
| `test` | Tests |
| `chore` | Maintenance |

### Examples

```
feat(components): add Timer component
fix(canvas): resolve rendering issue on mobile
docs(readme): update installation steps
```

---

## Questions?

Open an issue or reach out to the maintainers.

**Happy contributing! 🎉**
