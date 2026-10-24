export function render(canvas, state) {
  const cellSize = 20;
  canvas.width = state.width * cellSize;
  canvas.height = state.height * cellSize;
  const context = canvas.getContext('2d');

  context.fillStyle = '#f1f5f9';
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (state.food !== null) {
    context.fillStyle = '#dc2626';
    context.fillRect(state.food.x * cellSize, state.food.y * cellSize, cellSize, cellSize);
  }

  context.fillStyle = '#16a34a';
  for (const segment of state.snake) {
    context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }

  const head = state.snake[0];
  context.fillStyle = '#166534';
  context.fillRect(head.x * cellSize, head.y * cellSize, cellSize, cellSize);
}
