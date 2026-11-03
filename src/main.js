import { createGame, step, score, routeInput } from './game.js';
import { bindInput } from './input.js';
import { render } from './render.js';

const board = document.querySelector('#board');
const scoreboard = document.querySelector('#score');
const hint = document.querySelector('#hint');
let state = createGame(Math.random);
let direction;
let timer;

function hintText() {
  if (state.status === 'lost') return 'Game over · Enter for new game';
  if (state.status === 'won') return 'You win · Enter for new game';
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
  clearInterval(timer);
  state = createGame(Math.random, input, state.food);
  direction = input;
  timer = setInterval(tick, 150);
  draw();
}

function arm() {
  clearInterval(timer);
  timer = undefined;
  state = createGame(Math.random);
  direction = undefined;
  draw();
}

bindInput(window, input => {
  const action = routeInput({ running: Boolean(timer), status: state.status, pending: direction, current: state.direction, input });
  if (action === 'steer') direction = input;
  else if (action === 'start') start(input);
  else if (action === 'arm') arm();
});

draw();
