import test from 'node:test';
import assert from 'node:assert/strict';

let session = 0;

async function openGame(t, rng = () => 0) {
  const window = new EventTarget();
  const restart = new EventTarget();
  const status = { textContent: '' };
  const rectangles = [];
  const context = {
    fillRect(x, y, width, height) {
      if (x === 0 && y === 0 && width === board.width && height === board.height) {
        rectangles.length = 0;
      }
      rectangles.push({ x, y, width, height, color: this.fillStyle });
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
  t.mock.method(Math, 'random', rng);
  t.mock.method(globalThis, 'setInterval', (callback, delay) => {
    assert.equal(delay, 150);
    timers.set(++nextTimer, callback);
    return nextTimer;
  });
  t.mock.method(globalThis, 'clearInterval', id => timers.delete(id));

  await import(`../src/main.js?session=${session++}`);

  return {
    board,
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
    cells(color) {
      const cells = [];
      for (let y = 0; y < board.height; y += 20) {
        for (let x = 0; x < board.width; x += 20) {
          const pixel = rectangles.findLast(rect =>
            x >= rect.x && x < rect.x + rect.width &&
            y >= rect.y && y < rect.y + rect.height);
          if (pixel?.color === color) cells.push([x / 20, y / 20]);
        }
      }
      return cells;
    },
  };
}

test('keyboard input, growth, continued movement, and collision reach the rendered board', async t => {
  let randomCalls = 0;
  // Place the first food directly ahead; later food appears at the top left.
  const game = await openGame(t, () => randomCalls++ === 0 ? 208.5 / 397 : 0);
  assert.equal(game.board.width, 400);
  assert.equal(game.board.height, 400);
  assert.deepEqual(game.cells('#166534'), [[10, 10]]);
  assert.deepEqual(game.cells('#dc2626'), [[11, 10]]);

  game.key('ArrowLeft'); // The core ignores this reversal and eats the food ahead.
  game.tick();
  assert.deepEqual(game.cells('#166534'), [[11, 10]]);
  assert.equal(game.cells('#16a34a').length, 3);
  assert.deepEqual(game.cells('#dc2626'), [[0, 0]]);

  game.key('ArrowUp');
  game.tick();
  game.tick();
  assert.deepEqual(game.cells('#166534'), [[11, 8]]);
  for (let i = 0; i < 9; i += 1) game.tick();
  assert.equal(game.status.textContent, 'lost');
  assert.equal(game.timers.size, 0);
  const finalHead = game.cells('#166534');
  game.key('ArrowRight');
  game.tick();
  assert.deepEqual(game.cells('#166534'), finalHead);
});

test('restart clears pending input and replaces the timer during play and after game over', async t => {
  const game = await openGame(t);
  game.key('ArrowUp');
  game.restart();
  game.restart();
  assert.equal(game.timers.size, 1);
  assert.equal(game.status.textContent, 'playing');
  game.tick();
  assert.deepEqual(game.cells('#166534'), [[11, 10]]);

  for (let i = 0; i < 9; i += 1) game.tick();
  assert.equal(game.status.textContent, 'lost');
  game.key('ArrowDown');
  game.restart();
  assert.equal(game.timers.size, 1);
  assert.equal(game.status.textContent, 'playing');
  assert.deepEqual(game.cells('#166534'), [[10, 10]]);
  assert.equal(game.cells('#16a34a').length, 2);
  game.tick();
  assert.deepEqual(game.cells('#166534'), [[11, 10]]);
});
