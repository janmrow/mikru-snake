# MikruSnake

Snake, under 10 KB of runtime source. No framework. No build step.

Small enough to understand in one sitting.

## Why

A tiny game for learning web engineering without tooling in the way.
Steer, eat to grow, avoid walls and yourself.

## Shape

```text
index.html     board, status, restart
src/game.js    rules, no browser APIs
src/render.js  draws state on canvas
src/input.js   arrow keys to directions
src/main.js    wires input, core, and loop
```

## Run

Serve this directory over HTTP and open `index.html`.
`npm run verify` checks syntax and runs tests. No install, no build.

## Principles

- Native web before tooling.
- Tests protect behavior, not implementation.
- Complexity has to earn its place.
- Build what the game needs now.

## Direction

See `ROADMAP.md` for scope and next steps.
