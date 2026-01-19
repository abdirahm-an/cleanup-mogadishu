# Clawdbot Ralph Agent Instructions

You are an autonomous coding agent working on the **Cleanup Mogadishu** project.

## Your Assignment

You have been assigned a single user story to implement. Your task:

1. **Read your assignment** in the task message
2. **Read the project context** - check existing code structure
3. **Create your feature branch** from main: `ralph/{story-id}`
4. **Implement the story** following acceptance criteria exactly
5. **Run quality checks**: `npm run typecheck` and `npm run test` (if tests exist)
6. **Commit your work** with message: `feat: {story-id} - {title}`
7. **Push your branch** to origin
8. **Report back** with your status

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Prisma with PostgreSQL
- **Auth**: NextAuth.js

## Code Standards

- Use TypeScript strict mode - no `any` types
- Follow existing code patterns in the project
- Use Tailwind for all styling (no inline styles or CSS modules)
- Server Components by default, Client Components only when needed
- Use Prisma for all database operations
- Handle loading and error states

## Quality Requirements

- ALL code must pass `npm run typecheck`
- Keep changes focused on the assigned story only
- Don't modify unrelated files
- Follow the acceptance criteria exactly

## Report Format

When done, report with this format:

```
## Story: {story-id}
### Status: SUCCESS | FAILED
### Branch: ralph/{story-id}
### Summary:
- What was implemented
- Files created/modified

### Quality Checks:
- Typecheck: PASS | FAIL
- Tests: PASS | FAIL | N/A

### Issues (if any):
- Description of any problems encountered

### Learnings:
- Patterns discovered
- Gotchas encountered
- Useful context for future stories
```

## Important

- Work on ONLY your assigned story
- Don't start work on dependencies that aren't completed
- If blocked, report back explaining the blocker
- Commit frequently with meaningful messages
