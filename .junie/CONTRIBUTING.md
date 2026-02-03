# Contributing to Junie Integration

This document provides guidance for developers extending or maintaining the Junie AI integration in C9 Reflex Arena.

## Overview

The `.junie/` folder contains all configuration and documentation for Junie AI integration. This enables intelligent code assistance, generation, and review tailored to the project's specific requirements.

## Folder Structure

```
.junie/
├── guidelines.md       # Primary coding standards and best practices
├── SETUP.md            # Installation and initialization instructions
├── AGENTS.md           # Agent workflows and behavior rules
├── CONTRIBUTING.md     # This file - developer documentation
└── junie.config.yaml   # Structured configuration for Junie AI
```

## File Responsibilities

### guidelines.md

**Purpose**: Define coding standards and best practices for AI-assisted development.

**When to Update**:
- Adding new technology to the stack
- Changing coding conventions
- Adding new component patterns
- Updating accessibility requirements

**Format Guidelines**:
- Use clear, actionable language
- Include code examples where helpful
- Organize by topic (TypeScript, React, Styling, etc.)
- Keep rules specific and measurable

### SETUP.md

**Purpose**: Document how to initialize and configure Junie for new developers.

**When to Update**:
- IDE requirements change
- New setup steps are required
- Troubleshooting scenarios are identified
- Configuration options are added

**Content Guidelines**:
- Step-by-step instructions
- Clear prerequisites
- Troubleshooting section
- Links to external resources

### AGENTS.md

**Purpose**: Define how different AI agents should behave when working with the codebase.

**When to Update**:
- Adding new agent workflows
- Changing review criteria
- Updating security requirements
- Modifying integration patterns

**Structure**:
- Agent role definitions
- Workflow documentation
- Integration rules
- Error handling conventions

### junie.config.yaml

**Purpose**: Provide structured, machine-readable configuration for Junie AI.

**When to Update**:
- Technology stack changes
- Build commands change
- Quality requirements change
- New custom rules needed

**Format**:
- Use YAML best practices
- Include comments for complex settings
- Maintain version compatibility
- Document custom rules clearly

## Development Workflow

### Adding New Guidelines

1. **Identify the Need**: Document why a new guideline is needed
2. **Draft the Guideline**: Write clear, actionable rules
3. **Add Examples**: Include code samples demonstrating correct usage
4. **Update Config**: Add corresponding settings to `junie.config.yaml`
5. **Test Integration**: Verify Junie respects the new guidelines

### Updating Configuration

1. **Review Current State**: Understand existing configuration
2. **Plan Changes**: Document what needs to change and why
3. **Update Files**: Make changes across all affected files
4. **Validate YAML**: Ensure `junie.config.yaml` is valid
5. **Test in IDE**: Verify configuration is loaded correctly

### Adding Custom Rules

Custom rules in `junie.config.yaml` follow this format:

```yaml
custom_rules:
  - name: "rule-name"
    description: "What this rule enforces"
    scope: "file/directory scope"
    severity: "critical|warning|suggestion"
```

**Example**:
```yaml
- name: "animation-performance"
  description: "All canvas animations must use requestAnimationFrame"
  scope: "src/components/backgrounds"
  severity: "critical"
```

## Maintaining Consistency

### Cross-File References

When updating one file, check if related files need updates:

| If you update...      | Also check...                          |
|-----------------------|----------------------------------------|
| `guidelines.md`       | `junie.config.yaml` (matching settings)|
| `junie.config.yaml`   | `guidelines.md` (documentation)        |
| `AGENTS.md`           | `junie.config.yaml` (agent config)     |
| `SETUP.md`            | `README.md` (project setup)            |

### Version Control

- Commit Junie configuration changes separately from code changes
- Use clear commit messages: `docs(junie): update code generation guidelines`
- Review changes in context of overall project standards

## Testing Junie Integration

### Manual Testing

1. Open project in JetBrains IDE with Junie plugin
2. Trigger code generation for a test component
3. Verify generated code follows guidelines
4. Check that configuration is properly loaded

### Validation Checklist

- [ ] `junie.config.yaml` is valid YAML
- [ ] All file paths in configuration exist
- [ ] Guidelines are consistent across files
- [ ] Custom rules have valid severity levels
- [ ] Build commands in config match `package.json`

## Extending the Integration

### Adding New Agent Types

1. Define the agent role in `AGENTS.md`
2. Add agent configuration to `junie.config.yaml`
3. Document workflows and expected behaviors
4. Update `guidelines.md` if new coding standards apply

### Integrating with New Tools

1. Document tool requirements in `SETUP.md`
2. Add tool configuration to `junie.config.yaml`
3. Update build commands if necessary
4. Add integration rules to `AGENTS.md`

### Adding Project-Specific Rules

1. Identify the pattern or requirement
2. Add rule definition to `junie.config.yaml`
3. Document rationale in `guidelines.md`
4. Add enforcement guidance to `AGENTS.md`

## Best Practices

### Writing Effective Guidelines

✅ **Do**:
- Be specific and measurable
- Include positive and negative examples
- Explain the reasoning behind rules
- Keep guidelines up to date

❌ **Don't**:
- Write vague or ambiguous rules
- Include outdated or deprecated patterns
- Contradict other guidelines
- Over-engineer with too many rules

### Maintaining Configuration

✅ **Do**:
- Keep YAML well-formatted and readable
- Use comments for complex settings
- Version control all changes
- Test after significant updates

❌ **Don't**:
- Leave invalid YAML in repository
- Forget to update related files
- Remove settings without understanding impact
- Add unused or redundant configuration

## Troubleshooting

### Common Issues

**Junie not loading configuration**:
- Verify `.junie/` folder is in project root
- Check `guidelines.md` exists
- Restart IDE to reload configuration
- Check IDE plugin version

**Guidelines not being followed**:
- Review guideline wording for clarity
- Check if guideline is in correct section
- Verify related config in `junie.config.yaml`
- Test with explicit prompt reference

**YAML parsing errors**:
- Validate YAML syntax online
- Check for proper indentation
- Ensure quotes around special characters
- Remove trailing whitespace

### Getting Help

- Check [JetBrains Junie Documentation](https://www.jetbrains.com/help/junie/)
- Review [Junie Guidelines Catalog](https://github.com/JetBrains/junie-guidelines)
- Open an issue in the project repository
- Consult team members for project-specific guidance

## Changelog

### Version 1.0 (Initial Release)
- Created `guidelines.md` with coding standards
- Added `SETUP.md` for initialization instructions
- Added `AGENTS.md` for workflow documentation
- Added `junie.config.yaml` for structured configuration
- Added `CONTRIBUTING.md` for developer documentation
