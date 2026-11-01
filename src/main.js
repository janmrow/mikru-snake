import { createGame, step, score } from './game.js';
import { bindInput } from './input.js';
import { render } from './render.js';

const board = document.querySelector('#board');
const scoreboard = document.querySelector('#score');
const hint = document.querySelector('#hint');
let state = createGame(Math.random);
let direction;
let timer;

function hintText() {
  if (state.status === 'lost') return 'Game over · Arrow key to restart';
  if (state.status === 'won') return 'You win · Arrow key to restart';
  if (timer) return 'Running...';
  return 'Ready · Arrow keys to start';
}

function draw() {
  render(board, state);
  scoreboard.textContent = score(state);
  hint.textContent = hintText();
}

function tick() {
  state = step(state, direction, Math.random);
  direction = undefined;
  if (state.status !== 'playing') {
    clearInterval(timer);
    timer = undefined;
  }
  draw();
}

function start(input) {
  if (state.status !== 'playing') {
    state = createGame(Math.random);
  }
  direction = input;
  timer = setInterval(tick, 150);
  draw();
}

bindInput(window, input => {
  if (timer) {
    direction = input;
  } else {
    start(input);
  }
});

draw();
