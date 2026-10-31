import test from 'node:test';
import assert from 'node:assert/strict';
import { bindInput } from '../src/input.js';

function keydown(target, key) {
  const event = new Event('keydown', { cancelable: true });
  event.key = key;
  target.dispatchEvent(event);
  return event;
}

test('arrow keys emit direction commands and prevent browser scrolling', () => {
  const target = new EventTarget();
  const commands = [];
  bindInput(target, direction => commands.push(direction));

  // Opposite commands are forwarded too; the core decides which turns are legal.
  for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
    assert.equal(keydown(target, key).defaultPrevented, true);
  }
  assert.deepEqual(commands, ['up', 'down', 'left', 'right']);
});

test('unrelated keys are untouched', () => {
  const target = new EventTarget();
  const commands = [];
  bindInput(target, direction => commands.push(direction));

  for (const key of ['Enter', 'a', 'constructor']) {
    assert.equal(keydown(target, key).defaultPrevented, false);
  }
  assert.deepEqual(commands, []);
});
