# MikruSnake

A tiny browser Snake game built with vanilla JavaScript, native web APIs, and focused tests.

The goal is simple: make a small, fun game while learning modern web engineering without unnecessary tooling.

The deterministic game core is implemented and tested. The browser renders the initial board and shows direction commands from the arrow keys. Movement and a game loop are next.

## Principles

- keep it small and understandable
- vanilla JavaScript first
- native browser APIs first
- no runtime dependencies unless they clearly earn their place
- prefer deterministic, behavior-focused tests
- add complexity only when it teaches something useful or improves the product

## Shape

- `src/main.js` is the browser entry point.
- `src/game.js` contains the game rules, independent of browser APIs.
- `src/render.js` draws a supplied state on Canvas without changing it.
- `src/input.js` maps arrow keys to direction commands, leaving turn validation to the core.
- `test/` covers the core rules and keyboard input with Node's built-in test runner.

`createGame(rng)` creates a game on a fixed 20 × 20 grid. State is a plain object with `width`, `height`, `snake`, `direction`, `food`, and `status`. Positions are `{ x, y }` objects; the snake is ordered from head to tail. Coordinates start at the top left, with `x` increasing rightward and `y` downward.

`step(state, input, rng)` advances one cell and returns a new state without mutating its input. Input is `up`, `down`, `left`, or `right`; omit it to continue moving. Immediate reversals are ignored. Status is `playing`, `lost` after a collision, or `won` when the snake fills the board (`food` is then `null`). Finished games stay unchanged.

Pass an RNG function returning a number in `[0, 1)`, such as `Math.random`. It is called once when creating a game and once after eating if a free cell remains. Ordinary movement, collisions, and filling the board do not use randomness.

## Development

Run the tests:

```bash
npm test
```

Serve this directory over HTTP and open `index.html` in a browser. No build step is required.

The board uses green for the snake, dark green for its head, and red for food. Arrow keys update the displayed command and prevent page scrolling. This is a static preview: commands do not advance the game yet.

## Direction

See `ROADMAP.md` for the current scope and possible next steps.
