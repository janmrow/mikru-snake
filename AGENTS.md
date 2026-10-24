# AGENTS.md

## Goal

Build MikruSnake as a small, understandable browser game.

## Working rules

- Prefer the smallest coherent change.
- Preserve the separation between game logic and browser/UI code.
- Use vanilla JavaScript and native APIs by default.
- Do not add dependencies, frameworks, build tools, or abstractions without a clear benefit.
- Keep behavior deterministic where practical.
- Prefer a few strong tests over many shallow tests.
- Test behavior and invariants, not implementation details.
- Do not refactor unrelated code.
- Read only the context needed for the current task.
- After a change, run relevant tests and inspect the diff.
- Stop when the task is done.

## Just Enough

Before adding complexity, check whether it is needed.

Ask:

1. What problem are we actually solving?
2. What is the smallest change that solves it well?
3. What can be removed?
4. Does the added complexity earn its place?
