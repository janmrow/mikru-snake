import test from 'node:test';
import assert from 'node:assert/strict';

let session = 0;

async function openGame(t) {
  const window = new EventTarget();
  const restart = new EventTarget();
  const status = { textContent: '' };
  const rectangles = [];
  const context = {
    fillRect(x, y, width, height) {
      if (x === 0 && y === 0 && width === board.width && height === board.height) {
        rectangles.length = 0;
      }
      rectangles.push([x, y, width, height]);
    },
  };
  const board = { getContext: () => context };
  const elements = { '#board': board, '#status': status, '#restart': restart };
  const timers = new Map();
  let nextTimer = 0;

  for (const [name, value] of Object.entries({
    window,
    document: { querySelector: selector => elements[selector] },
  })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, name, original);
      else delete globalThis[name];
    });
  }
  t.mock.method(Math, 'random', () => 0);
  t.mock.method(globalThis, 'setInterval', (callback, delay) => {
    assert.equal(delay, 150);
    timers.set(++nextTimer, callback);
    return nextTimer;
  });
  t.mock.method(globalThis, 'clearInterval', id => timers.delete(id));

  await import(`../src/main.js?session=${session++}`);

  return {
    rectangles,
    status,
    timers,
    tick() {
      for (const callback of [...timers.values()]) callback();
    },
    key(key) {
      const event = new Event('keydown', { cancelable: true });
      event.key = key;
      window.dispatchEvent(event);
    },
    restart: () => restart.dispatchEvent(new Event('click')),
  };
}

test('keyboard input, growth, continued movement, and collision reach the rendered board', async t => {
  const game = await openGame(t);
  // The final rectangle marks the head; coordinates are in Canvas pixels.
  assert.deepEqual(game.rectangles.at(-1), [200, 200, 20, 20]);

  game.key('ArrowLeft'); // The core ignores this reversal.
  game.tick();
  assert.deepEqual(game.rectangles.at(-1), [220, 200, 20, 20]);

  game.key('ArrowUp');
  game.tick();
  game.tick();
  assert.deepEqual(game.rectangles.at(-1), [220, 160, 20, 20]);

  // With RNG fixed at zero, food starts at (0, 0). Move up, then left to eat it.
  for (let i = 0; i < 8; i += 1) game.tick();
  game.key('ArrowLeft');
  for (let i = 0; i < 11; i += 1) game.tick();
  assert.deepEqual(game.rectangles.at(-1), [0, 0, 20, 20]);
  // Growth keeps the tail at (3, 0); the next food appears at (4, 0).
  assert.ok(game.rectangles.some(rect => rect[0] === 60 && rect[1] === 0));
  assert.ok(game.rectangles.some(rect => rect[0] === 80 && rect[1] === 0));

  game.tick(); // Continuing left hits the wall.
  assert.equal(game.status.textContent, 'lost');
  assert.equal(game.timers.size, 0);
  const finalFrame = structuredClone(game.rectangles);
  game.key('ArrowRight');
  game.tick();
  assert.deepEqual(game.rectangles, finalFrame);
});

test('restart clears pending input and replaces the timer during play and after game over', async t => {
  const game = await openGame(t);
  game.key('ArrowUp');
  game.restart();
  game.restart();
  assert.equal(game.timers.size, 1);
  assert.equal(game.status.textContent, 'playing');
  game.tick();
  assert.deepEqual(game.rectangles.at(-1), [220, 200, 20, 20]);

  for (let i = 0; i < 9; i += 1) game.tick();
  assert.equal(game.status.textContent, 'lost');
  game.key('ArrowDown');
  game.restart();
  assert.equal(game.timers.size, 1);
  assert.equal(game.status.textContent, 'playing');
  assert.deepEqual(game.rectangles.at(-1), [200, 200, 20, 20]);
  game.tick();
  assert.deepEqual(game.rectangles.at(-1), [220, 200, 20, 20]);
});
