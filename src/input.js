const inputs = new Map([
  ['ArrowUp', 'up'],
  ['ArrowDown', 'down'],
  ['ArrowLeft', 'left'],
  ['ArrowRight', 'right'],
  ['Enter', 'enter'],
]);

export function bindInput(target, onInput) {
  target.addEventListener('keydown', event => {
    const input = inputs.get(event.key);
    if (input === undefined) return;

    event.preventDefault();
    if (event.repeat) return;
    onInput(input);
  });
}
