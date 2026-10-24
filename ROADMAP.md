# Roadmap

## Complete — M1: playable core

Implemented:

- deterministic core movement on a fixed grid
- food, growth, wall and self-collision, and ignored opposite-direction input
- food spawning on free cells and completion when the board is full
- focused core tests
- browser rendering and keyboard controls
- a fixed-interval loop using the core for movement, food, growth, and collisions
- stopping on game over and restarting with a fresh board

## Next — M2: browser polish

Possible scope:

- pause/resume with page visibility
- simple mobile input
- lightweight presentation

Only add what improves the game or teaches something useful.

## Later

Candidates, not commitments:

- deployment to Mikrus
- Caddy and sensible HTTP/security headers
- offline/PWA support
- local high score
- small CI workflow

Each item must earn its place.
