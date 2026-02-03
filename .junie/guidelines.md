# C9 Reflex Arena - Development Guidelines

This document provides coding standards and best practices for Junie AI when working with the C9 Reflex Arena project.

## Project Overview

C9 Reflex Arena is a reaction-time challenge game built for Cloud9 event booths. It's a React 19 + TypeScript application using Vite, Tailwind CSS, and various modern web technologies.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 with custom theme
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui v4 with Radix UI primitives
- **Icons**: Phosphor Icons
- **State Management**: React Hooks + Spark KV Storage
- **AI Integration**: GPT-4o-mini for adaptive difficulty

## Coding Standards

### TypeScript

- Use strict TypeScript with proper type definitions
- Prefer interfaces over type aliases for object shapes
- Use explicit return types for functions
- Avoid `any` type; use `unknown` if type is truly uncertain
- Use const assertions for literal types when appropriate

### React Components

- Use functional components with hooks exclusively
- Prefer named exports over default exports for components
- Keep components small and focused on a single responsibility
- Use React.memo() for expensive components that receive stable props
- Extract custom hooks for reusable logic

### File Organization

- Place components in `src/components/`
- Place hooks in `src/hooks/`
- Place utilities in `src/lib/`
- Place styles in `src/styles/`
- Use PascalCase for component files (e.g., `GameBoard.tsx`)
- Use camelCase for utility files (e.g., `gameUtils.ts`)

### Styling

- Use Tailwind CSS utility classes as the primary styling method
- Follow the existing theme defined in `theme.json`
- Use CSS variables from the theme for consistent colors
- Maintain the cyberpunk esports aesthetic with neon glows
- Ensure 60fps animations for smooth performance

### State Management

- Use local state with `useState` for component-specific state
- Use `useReducer` for complex state logic
- Use Spark KV Storage for persistent data (player stats, settings)
- Always use functional updates to prevent data loss

### Performance

- Optimize canvas-based backgrounds for 60fps
- Debounce mouse tracking and input handlers
- Lazy-load components when appropriate
- Minimize re-renders with proper memoization

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML elements
- Provide appropriate ARIA labels where needed
- Maintain sufficient color contrast

### Error Handling

- Use React Error Boundaries for component-level error handling
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle async operations with proper try/catch blocks

## Build and Development

### Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Code Quality

- Run `npm run lint` before committing changes
- Ensure no TypeScript errors with `tsc -b --noCheck`
- Test changes in development mode before building
- Verify 60fps performance for animations

## Testing

- Test gameplay mechanics manually across difficulty levels
- Verify leaderboard functionality
- Test authentication flows (GitHub, custom accounts, guest)
- Check responsive design and mobile compatibility

## Git Workflow

- Write clear, descriptive commit messages
- Keep commits focused on single changes
- Reference issues in commit messages when applicable

## Documentation

- Update README.md for significant feature changes
- Document complex functions with JSDoc comments
- Keep CHANGELOG.md updated with version changes
