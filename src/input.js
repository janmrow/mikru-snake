const directions = new Map([
  ['ArrowUp', 'up'],
  ['ArrowDown', 'down'],
  ['ArrowLeft', 'left'],
  ['ArrowRight', 'right'],
]);

export function bindInput(target, onDirection) {
  target.addEventListener('keydown', event => {
    const direction = directions.get(event.key);
    if (direction === undefined) return;

    event.preventDefault();
    onDirection(direction);
  });
}
