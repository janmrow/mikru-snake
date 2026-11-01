# MikruSnake

Snake, under 10 KB of runtime source. No framework. No build step.

Live: https://snake.mikrus.dev

Small enough to understand in one sitting.

## Why

A tiny game for learning web engineering without tooling in the way.
Steer, eat to grow, avoid walls and yourself.

## Shape

```text
index.html     board, score, hint
src/game.js    rules and score, no browser APIs
src/render.js  draws state on canvas
src/input.js   arrow keys to directions
src/main.js    wires input, core, and loop
```

## Run

Serve this directory over HTTP and open `index.html`.
`npm run verify` checks syntax and runs tests. No install, no build.

## Deploy

Push/merge to `main` runs `verify`, then deploys `index.html` and `src/` to production over SSH/rsync. PRs run `verify` only.

## Principles

- Native web before tooling.
- Tests protect behavior, not implementation.
- Complexity has to earn its place.
- Build what the game needs now.

## Direction

See `ROADMAP.md` for scope and next steps.
