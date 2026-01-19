# Clawdbot Ralph - Parallel PRD Execution System

This directory contains the configuration for running parallel AI agents to implement the Cleanup Mogadishu PRD.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Opus)                       │
│  • Parses stories.json for available work                   │
│  • Spawns Sonnet sub-agents for independent stories         │
│  • Monitors progress and handles failures                    │
│  • Aggregates learnings and coordinates merges               │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Sonnet Agent 1│ │ Sonnet Agent 2│ │ ... Agent 10  │
│ Story: US-001 │ │ Story: US-004 │ │ Story: US-006 │
└───────────────┘ └───────────────┘ └───────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `stories.json` | All user stories with dependencies and status |
| `agent-prompt.md` | Instructions given to each Sonnet agent |
| `progress.md` | Append-only log of completed work and learnings |
| `README.md` | This file |

## How It Works

1. **Orchestrator reads stories.json** - identifies stories ready to work on
2. **Spawns up to 10 parallel agents** - each gets one story assignment
3. **Agents work independently** - on their own feature branches
4. **Agents report back** - with success/failure status
5. **Orchestrator updates status** - marks completed stories, aggregates learnings
6. **Repeat** - until all stories are done or max retries exceeded

## Story Status

- `pending` - Not yet started
- `in-progress` - Assigned to an agent
- `completed` - Successfully implemented
- `failed` - Failed after max retries (needs human attention)

## Git Branch Strategy

- Each story gets its own branch: `ralph/{story-id}`
- Agents commit to their branch
- Orchestrator merges completed branches to main
- Conflicts flagged for human review

## Running the System

From the main Clawdbot session:

```
Start the Ralph orchestrator for cleanup-mogadishu
```

The orchestrator will:
1. Read stories.json
2. Identify independent stories (no pending dependencies)
3. Spawn Sonnet agents
4. Monitor until completion or failure

## Configuration

- **Max parallel agents**: 10
- **Max retries per story**: 20
- **Notify on failure**: After 20 retries
