import { createGame, step } from './game.js';
import { bindInput } from './input.js';
import { render } from './render.js';

const board = document.querySelector('#board');
const status = document.querySelector('#status');
let state;
let direction;
let timer;

function draw() {
  render(board, state);
  status.textContent = state.status;
}

function tick() {
  state = step(state, direction, Math.random);
  direction = undefined;
  draw();
  if (state.status !== 'playing') clearInterval(timer);
}

function restart() {
  clearInterval(timer);
  state = createGame(Math.random);
  direction = undefined;
  draw();
  timer = setInterval(tick, 150);
}

bindInput(window, input => {
  if (state.status === 'playing') direction = input;
});
document.querySelector('#restart').addEventListener('click', restart);
restart();
