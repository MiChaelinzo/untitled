# Junie Agent Guidelines and Rules

This document defines conventions for AI agents, workflows, and integrations when working with the C9 Reflex Arena project.

## Agent Roles

### Code Generation Agent

**Purpose**: Generate new code following project conventions

**Rules**:
- Always use TypeScript with strict typing
- Follow React functional component patterns
- Use named exports for components
- Apply Tailwind CSS for styling
- Maintain cyberpunk esports aesthetic
- Ensure 60fps performance for animations

**Constraints**:
- Never use `any` type without explicit justification
- Avoid class components; use functional components only
- Do not introduce new dependencies without approval
- Keep bundle size in mind when suggesting imports

### Code Review Agent

**Purpose**: Review code for quality, security, and best practices

**Checklist**:
- [ ] TypeScript types are properly defined
- [ ] Components follow single responsibility principle
- [ ] Performance optimizations applied (memo, useMemo, useCallback)
- [ ] Accessibility requirements met (ARIA labels, keyboard navigation)
- [ ] Error boundaries implemented for critical components
- [ ] No console.log statements in production code
- [ ] Security considerations addressed (XSS prevention, input validation)

**Severity Levels**:
- 🔴 **Critical**: Must fix before merge (security, data loss, crashes)
- 🟡 **Warning**: Should fix (performance, maintainability)
- 🟢 **Suggestion**: Consider fixing (style, minor improvements)

### Refactoring Agent

**Purpose**: Improve code structure while preserving functionality

**Guidelines**:
- Extract repeated code into reusable hooks or utilities
- Simplify complex conditional logic
- Improve type definitions for better inference
- Optimize re-render patterns
- Consolidate related state management

**Safety Rules**:
- Never change public API without explicit request
- Preserve all existing functionality
- Maintain backwards compatibility
- Update related tests when refactoring

### Documentation Agent

**Purpose**: Generate and maintain project documentation

**Scope**:
- JSDoc comments for functions and components
- README updates for new features
- Inline comments for complex logic
- API documentation for utilities
- Changelog entries for releases

**Style Guidelines**:
- Use clear, concise language
- Include code examples where helpful
- Reference related documentation
- Keep documentation close to code

## Workflow Conventions

### Feature Development Workflow

```
1. Understand Requirements
   └── Parse issue/request
   └── Identify affected components
   └── Plan implementation approach

2. Code Generation
   └── Generate component structure
   └── Implement business logic
   └── Add TypeScript types
   └── Apply styling

3. Quality Assurance
   └── Review generated code
   └── Check TypeScript compilation
   └── Verify accessibility
   └── Test performance

4. Integration
   └── Update imports/exports
   └── Connect to state management
   └── Add error handling
   └── Document changes
```

### Bug Fix Workflow

```
1. Diagnosis
   └── Reproduce the issue
   └── Identify root cause
   └── Assess impact scope

2. Resolution
   └── Implement minimal fix
   └── Add regression prevention
   └── Update error handling

3. Verification
   └── Test fix locally
   └── Check for side effects
   └── Verify original issue resolved
```

### Code Review Workflow

```
1. Initial Scan
   └── Check for obvious issues
   └── Verify TypeScript compilation
   └── Assess change scope

2. Deep Review
   └── Logic correctness
   └── Performance implications
   └── Security considerations
   └── Accessibility compliance

3. Feedback
   └── Provide actionable suggestions
   └── Categorize by severity
   └── Offer alternative approaches
```

## Integration Rules

### Git Integration

**Commit Messages**:
- Use conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep descriptions under 72 characters
- Reference issues when applicable

**Branch Naming**:
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`

### CI/CD Integration

**Pre-commit Checks**:
- TypeScript compilation: `tsc -b --noCheck`
- Linting: `npm run lint`
- Build verification: `npm run build`

**Quality Gates**:
- No TypeScript errors
- No ESLint errors (warnings acceptable)
- Build completes successfully

### External Service Integration

**Spark KV Storage**:
- Use for persistent player data
- Apply functional updates for data integrity
- Handle offline scenarios gracefully

**GPT-4o Integration**:
- Used for adaptive difficulty
- JSON mode for structured responses
- Implement confidence scoring
- Handle API failures gracefully

## Prompt Engineering Guidelines

### Effective Prompts for Code Generation

```
Good: "Create a React component for displaying player statistics 
      using the existing Card component from shadcn/ui. Include 
      props for playerName, score, and accuracy. Style with 
      Tailwind CSS following the cyberpunk theme."

Bad:  "Make a stats component"
```

### Effective Prompts for Refactoring

```
Good: "Refactor the useGameState hook to separate game logic from 
      UI state. Extract scoring calculations into a pure function. 
      Maintain the existing API to avoid breaking changes."

Bad:  "Clean up the game code"
```

### Context Inclusion

Always include relevant context:
- File paths of affected components
- Related type definitions
- Existing patterns to follow
- Constraints or requirements

## Error Handling Conventions

### Agent Error Recovery

When an agent encounters an error:

1. **Log the error** with relevant context
2. **Attempt recovery** if safe to do so
3. **Report failure** with actionable information
4. **Suggest alternatives** when possible

### User Communication

- Use clear, non-technical language for user-facing messages
- Provide specific error details for developer-facing logs
- Include recovery suggestions when applicable
- Reference documentation for common issues

## Performance Guidelines

### Response Time Targets

- Code generation: < 30 seconds for typical components
- Code review: < 15 seconds for standard PRs
- Refactoring suggestions: < 20 seconds

### Resource Optimization

- Limit context window to relevant files
- Use incremental analysis when possible
- Cache frequently accessed patterns
- Prioritize high-impact suggestions

## Security Considerations

### Code Generation Security

- Never generate code with hardcoded secrets
- Apply input validation for user data
- Use parameterized queries for data operations
- Implement proper authentication checks

### Data Handling

- Do not log sensitive user information
- Apply appropriate access controls
- Sanitize outputs to prevent XSS
- Follow principle of least privilege
