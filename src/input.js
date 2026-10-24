const directions = new Map([
  ['ArrowUp', 'up'],
  ['ArrowDown', 'down'],
  ['ArrowLeft', 'left'],
  ['ArrowRight', 'right'],
]);

export function bindInput(target, onDirection) {
  function onKeyDown(event) {
    const direction = directions.get(event.key);
    if (direction === undefined) return;

    event.preventDefault();
    onDirection(direction);
  }

  target.addEventListener('keydown', onKeyDown);
  return () => target.removeEventListener('keydown', onKeyDown);
}
