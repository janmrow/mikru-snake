const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function isOpposite(a, b) {
  const first = directions[a];
  const second = directions[b];
  return Boolean(first && second && first.x === -second.x && first.y === -second.y);
}

const initialSnakeLength = 3;

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

export function createGame(rng, dir = 'right', food) {
  const width = 20;
  const height = 20;
  const resolved = directions[dir] ? dir : 'right';
  const snake = [{ x: 10, y: 10 }];
  const kept = food && Number.isInteger(food.x) && Number.isInteger(food.y)
    && !snake.some(segment => sameCell(segment, food))
    ? { x: food.x, y: food.y }
    : null;
  return {
    width,
    height,
    snake,
    direction: resolved,
    food: kept ?? spawnFood(width, height, snake, rng),
    status: 'playing',
  };
}

export function score(state) {
  return Math.max(0, state.snake.length - initialSnakeLength);
}

export function routeInput({ running, status, pending, current, input }) {
  if (input !== 'enter' && !directions[input]) return 'ignore';
  if (running) {
    if (input === 'enter') return 'ignore';
    if (pending !== undefined || isOpposite(input, current)) return 'ignore';
    return 'steer';
  }
  if (status !== 'playing') return input === 'enter' ? 'arm' : 'ignore';
  return input === 'enter' ? 'ignore' : 'start';
}

export function step(state, input, rng) {
  if (state.status !== 'playing') return state;

  let direction = state.direction;
  const requested = directions[input];
  if (requested && !isOpposite(input, direction)) {
    direction = input;
  }

  const movement = directions[direction];
  const head = {
    x: state.snake[0].x + movement.x,
    y: state.snake[0].y + movement.y,
  };
  const grows = state.food !== null && sameCell(head, state.food);
  // The tail vacates its cell, unless the snake grows by eating
  // or is still a newborn below full length.
  const newborn = state.snake.length < initialSnakeLength;
  const body = grows || newborn ? state.snake : state.snake.slice(0, -1);
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
