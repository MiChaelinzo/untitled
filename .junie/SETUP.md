# Junie AI Setup Instructions

This document explains how to initialize and connect Junie AI to the C9 Reflex Arena project.

## Prerequisites

Before setting up Junie AI integration, ensure you have:

- JetBrains IDE (IntelliJ IDEA, WebStorm, or compatible IDE) with Junie plugin installed
- Node.js 18+ installed
- Git configured with repository access
- Project cloned and dependencies installed

## Quick Start

### 1. Install Junie Plugin

1. Open your JetBrains IDE
2. Go to **Settings → Plugins → Marketplace**
3. Search for "Junie" and install the official JetBrains Junie plugin
4. Restart the IDE

### 2. Configure Junie for This Project

Junie automatically detects the `.junie/` folder and loads configuration:

```
.junie/
├── guidelines.md      # Coding standards and best practices
├── SETUP.md           # This setup guide
├── AGENTS.md          # Agent workflows and rules
├── CONTRIBUTING.md    # Developer documentation
└── junie.config.yaml  # Structured configuration
```

### 3. Verify Configuration

1. Open the project in your JetBrains IDE
2. Navigate to **Settings → Tools → Junie → Project Settings**
3. Verify that `.junie/guidelines.md` is detected as the guidelines file
4. Confirm the project context is loaded correctly

## Environment Setup

### Development Environment

```bash
# Clone the repository
git clone https://github.com/MiChaelinzo/untitled.git
cd untitled

# Install dependencies
npm install

# Start development server
npm run dev
```

### IDE Configuration

Junie works best with these IDE settings:

1. **TypeScript Service**: Ensure TypeScript language service is enabled
2. **ESLint Integration**: Enable ESLint for real-time linting feedback
3. **Tailwind CSS IntelliSense**: Install Tailwind CSS plugin for styling assistance

## Project Context for Junie

When Junie analyzes this project, it should understand:

### Technology Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **UI Library**: shadcn/ui v4 with Radix UI primitives
- **Animation**: Framer Motion
- **State**: React Hooks + Spark KV Storage

### Key Directories
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `src/styles/` - CSS and styling

### Important Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Tailwind customization
- `theme.json` - Application theme definition
- `tsconfig.json` - TypeScript configuration

## Junie Workflows

### Code Generation

When asking Junie to generate code:

1. Reference the `guidelines.md` for coding standards
2. Use existing components as templates
3. Follow the cyberpunk esports aesthetic for UI
4. Ensure TypeScript strict mode compliance

### Code Review

Junie can review code against:

- TypeScript best practices
- React component patterns
- Performance optimization guidelines
- Accessibility requirements

### Refactoring

For refactoring tasks:

1. Maintain existing API contracts
2. Update related tests and documentation
3. Preserve performance characteristics
4. Keep UI/UX consistency

## Troubleshooting

### Junie Not Detecting Configuration

1. Ensure `.junie/` folder is in the project root
2. Check that `guidelines.md` exists and is readable
3. Restart the IDE to reload configuration
4. Verify IDE plugin is updated to latest version

### Performance Issues

1. Close unused projects in IDE
2. Increase IDE memory allocation if needed
3. Ensure development server is running for live context

### Context Limitations

If Junie lacks project context:

1. Open relevant files to expand context window
2. Reference specific files in your prompts
3. Use structured prompts with clear requirements

## Additional Resources

- [JetBrains Junie Documentation](https://www.jetbrains.com/help/junie/)
- [Junie Guidelines Catalog](https://github.com/JetBrains/junie-guidelines)
- [Project README](../README.md)
- [Development Guidelines](./guidelines.md)
