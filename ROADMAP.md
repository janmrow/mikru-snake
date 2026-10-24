# Roadmap

## Now — M1: playable core

Implemented:

- deterministic core movement on a fixed grid
- food, growth, wall and self-collision, and ignored opposite-direction input
- food spawning on free cells and completion when the board is full
- focused core tests

Still needed to complete M1:

- the game runs in the browser
- keyboard controls work
- the browser uses the core for movement, food, growth, and collisions
- the player can restart after game over

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
