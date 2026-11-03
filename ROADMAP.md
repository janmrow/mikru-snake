# Roadmap

## Live

https://snake.mikrus.dev — push to `main` runs `verify`, then deploys `index.html` + `src/` to production via rsync over SSH.

## Done — M1: playable core ✓

Deterministic core, browser rendering and controls, fixed-interval loop, restart, and `npm run verify` in CI.

## Next — M2: browser polish

Possible scope:

- pause/resume with page visibility
- simple mobile input
- lightweight presentation

Only add what improves the game or teaches something useful.

## Later

Candidates, not commitments:

- Caddy and sensible HTTP/security headers
- offline/PWA support
- local high score

Each item must earn its place.

## Not doing

Deliberately out, to stay small:

- in-game replay UI — steps + inputs in an issue reproduce a bug until proven insufficient.
- AI benchmarks / agent experiments as product features — experiments live in branches and PRs, not shipped in runtime `src/`.
