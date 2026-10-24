# MikruSnake

A tiny browser Snake game built with vanilla JavaScript, native web APIs, and focused tests.

The goal is simple: make a small, fun game while learning modern web engineering without unnecessary tooling.

The browser scaffold is in place. Game functionality is not implemented yet.

## Principles

- keep it small and understandable
- vanilla JavaScript first
- native browser APIs first
- no runtime dependencies unless they clearly earn their place
- prefer deterministic, behavior-focused tests
- add complexity only when it teaches something useful or improves the product

## Shape

Planned approach: keep game logic separate from browser code. Pass randomness into the game logic so tests can control it.

## Development

Run the test command (there are no tests yet):

```bash
npm test
```

Serve this directory over HTTP and open `index.html` in a browser. No build step is required.

## Direction

See `ROADMAP.md` for the current scope and possible next steps.
