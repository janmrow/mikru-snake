const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function spawnFood(width, height, snake, rng) {
  const freeCells = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = { x, y };
      if (!snake.some(segment => sameCell(segment, cell))) {
        freeCells.push(cell);
      }
    }
  }
  return freeCells.length === 0
    ? null
    : freeCells[Math.floor(rng() * freeCells.length)];
}

export function createGame(rng) {
  const width = 20;
  const height = 20;
  const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  return {
    width,
    height,
    snake,
    direction: 'right',
    food: spawnFood(width, height, snake, rng),
    status: 'playing',
  };
}

export function step(state, input, rng) {
  if (state.status !== 'playing') return state;

  let direction = state.direction;
  const current = directions[direction];
  const requested = directions[input];
  if (requested && !(requested.x === -current.x && requested.y === -current.y)) {
    direction = input;
  }

  const movement = directions[direction];
  const head = {
    x: state.snake[0].x + movement.x,
    y: state.snake[0].y + movement.y,
  };
  const grows = state.food !== null && sameCell(head, state.food);
  // The tail vacates its cell on moves without growth.
  const body = grows ? state.snake : state.snake.slice(0, -1);
  if (
    head.x < 0 || head.x >= state.width ||
    head.y < 0 || head.y >= state.height ||
    body.some(segment => sameCell(segment, head))
  ) {
    return { ...state, direction, status: 'lost' };
  }

  const snake = [head, ...body];
  const food = grows
    ? spawnFood(state.width, state.height, snake, rng)
    : state.food;
  return {
    ...state,
    snake,
    direction,
    food,
    status: food === null ? 'won' : 'playing',
  };
}
