import test from 'node:test';
import assert from 'node:assert/strict';
import { bindInput } from '../src/input.js';

function keydown(target, key, repeat = false) {
  const event = new Event('keydown', { cancelable: true });
  event.key = key;
  event.repeat = repeat;
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

  for (const key of ['a', ' ', 'Shift', 'constructor']) {
    assert.equal(keydown(target, key).defaultPrevented, false);
  }
  assert.deepEqual(commands, []);
});

test('enter emits an enter command', () => {
  const target = new EventTarget();
  const commands = [];
  bindInput(target, direction => commands.push(direction));

  assert.equal(keydown(target, 'Enter').defaultPrevented, true);
  assert.deepEqual(commands, ['enter']);
});

test('held arrow keys do not emit repeat commands', () => {
  const target = new EventTarget();
  const commands = [];
  bindInput(target, direction => commands.push(direction));

  for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
    assert.equal(keydown(target, key, true).defaultPrevented, true);
  }
  assert.equal(keydown(target, 'Enter', true).defaultPrevented, true);
  assert.deepEqual(commands, []);
});
