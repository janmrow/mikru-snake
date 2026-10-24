import { createGame } from './game.js';
import { bindInput } from './input.js';
import { render } from './render.js';

const state = createGame(Math.random);
render(document.querySelector('#board'), state);
document.querySelector('#status').textContent = state.status;

const command = document.querySelector('#direction');
bindInput(window, direction => {
  command.textContent = direction;
});
