import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, step } from '../src/game.js';

function game(overrides = {}) {
  return {
    width: 4,
    height: 4,
    snake: [{ x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
    direction: 'right',
    food: { x: 0, y: 0 },
    status: 'playing',
    ...overrides,
  };
}

function assertFoodIsFree(state) {
  assert.ok(Number.isInteger(state.food.x) && Number.isInteger(state.food.y));
  assert.ok(state.food.x >= 0 && state.food.x < state.width);
  assert.ok(state.food.y >= 0 && state.food.y < state.height);
  assert.ok(!state.snake.some(cell => cell.x === state.food.x && cell.y === state.food.y));
}

test('initial games are deterministic and place food on free cells', () => {
  const initial = createGame(() => 0.5);
  assert.deepEqual(initial, createGame(() => 0.5));
  assert.equal(initial.width, 20);
  assert.equal(initial.height, 20);

  const cellCount = initial.width * initial.height;
  for (let sample = 0; sample < cellCount; sample += 1) {
    const state = createGame(() => (sample + 0.5) / cellCount);
    assert.equal(state.status, 'playing');
    assertFoodIsFree(state);
  }
});

test('movement advances the head and tail without randomness or mutation', () => {
  const state = game();
  const before = structuredClone(state);
  const next = step(state);
  assert.deepEqual(next, {
    ...state,
    snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
  });
  assert.deepEqual(state, before);
});

test('perpendicular turns move one cell in the requested direction', () => {
  const cases = [
    ['right', 'up', { x: 2, y: 0 }],
    ['right', 'down', { x: 2, y: 2 }],
    ['up', 'left', { x: 1, y: 1 }],
    ['up', 'right', { x: 3, y: 1 }],
  ];
  for (const [direction, input, head] of cases) {
    const next = step(game({ direction, snake: [{ x: 2, y: 1 }] }), input);
    assert.equal(next.direction, input);
    assert.deepEqual(next.snake, [head]);
    assert.equal(next.status, 'playing');
  }
});

test('immediate reversals keep the snake moving forward in all four directions', () => {
  const cases = [
    ['right', 'left', [{ x: 2, y: 1 }, { x: 1, y: 1 }], { x: 3, y: 1 }],
    ['left', 'right', [{ x: 1, y: 1 }, { x: 2, y: 1 }], { x: 0, y: 1 }],
    ['up', 'down', [{ x: 1, y: 1 }, { x: 1, y: 2 }], { x: 1, y: 0 }],
    ['down', 'up', [{ x: 1, y: 2 }, { x: 1, y: 1 }], { x: 1, y: 3 }],
  ];
  for (const [direction, input, snake, head] of cases) {
    const state = game({ direction, snake });
    assert.deepEqual(step(state, input), {
      ...state,
      snake: [head, snake[0]],
    });
  }
});

test('eating retains the tail, grows by one cell, and spawns food off the snake', () => {
  const state = game({ food: { x: 3, y: 1 } });
  const before = structuredClone(state);
  for (const random of [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1 - Number.EPSILON]) {
    const next = step(state, undefined, () => random);
    assert.deepEqual(next.snake, [{ x: 3, y: 1 }, ...state.snake]);
    assert.equal(next.status, 'playing');
    assertFoodIsFree(next);
  }
  assert.deepEqual(state, before);
  assert.deepEqual(step(state, undefined, () => 0.5), step(state, undefined, () => 0.5));
});

test('each wall ends the game without moving the snake or using RNG', () => {
  for (const [direction, head] of [
    ['up', { x: 1, y: 0 }],
    ['down', { x: 1, y: 3 }],
    ['left', { x: 0, y: 1 }],
    ['right', { x: 3, y: 1 }],
  ]) {
    const state = game({ direction, snake: [head] });
    assert.deepEqual(step(state), { ...state, status: 'lost' });
    assert.equal(state.status, 'playing');
  }
});

test('hitting the body loses, but entering the vacated tail cell is legal', () => {
  const state = game({
    snake: [
      { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 },
      { x: 2, y: 2 }, { x: 3, y: 2 },
    ],
  });
  assert.deepEqual(step(state, 'down'), { ...state, direction: 'down', status: 'lost' });

  const loop = game({ snake: state.snake.slice(0, -1) });
  const next = step(loop, 'down');
  assert.equal(next.status, 'playing');
  assert.deepEqual(next.snake, [{ x: 2, y: 2 }, ...loop.snake.slice(0, -1)]);
});

test('a deterministic replay grows, follows the vacating tail, and fills the board', () => {
  let state = game({
    width: 3,
    height: 3,
    snake: [
      { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 1 },
    ],
    food: { x: 2, y: 0 },
  });

  // Ignore a reversal, eat, and leave only the center free for new food.
  state = step(state, 'left', () => 0.25);
  assert.equal(state.status, 'playing');
  assert.equal(state.snake.length, 8);
  assert.deepEqual(state.snake[0], { x: 2, y: 0 });
  assert.deepEqual(state.food, { x: 1, y: 1 });
  assertFoodIsFree(state);

  // The next move enters the cell just vacated by the tail.
  const beforeMove = state;
  state = step(state, 'down');
  assert.deepEqual(state, {
    ...beforeMove,
    direction: 'down',
    snake: [{ x: 2, y: 1 }, ...beforeMove.snake.slice(0, -1)],
  });

  // Eating the final food wins without requesting any more randomness.
  assert.deepEqual(step(state, 'left'), {
    ...state,
    direction: 'left',
    snake: [{ x: 1, y: 1 }, ...state.snake],
    food: null,
    status: 'won',
  });
});

test('lost and won games stay unchanged', () => {
  for (const status of ['lost', 'won']) {
    const state = game({ status });
    assert.deepEqual(step(state, 'up'), state);
  }
});
