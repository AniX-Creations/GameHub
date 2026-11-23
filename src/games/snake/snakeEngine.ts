export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type MazeId = 1 | 2 | 3;

export const BOARD_WIDTH = 64;
export const BOARD_HEIGHT = 38;

const keyOf = (point: Point) => `${point.x},${point.y}`;

function addRect(cells: Set<string>, x1: number, y1: number, x2: number, y2: number) {
  for (let y = Math.max(0, y1); y < Math.min(BOARD_HEIGHT, y2); y += 1) {
    for (let x = Math.max(0, x1); x < Math.min(BOARD_WIDTH, x2); x += 1) {
      cells.add(keyOf({ x, y }));
    }
  }
}

// These obstacle layouts are scaled from the three rectangle-based mazes in SNAKE.C.
export function getMazeCells(maze: MazeId): Set<string> {
  const cells = new Set<string>();
  if (maze === 1) {
    addRect(cells, 10, 10, 13, 28);
    addRect(cells, 47, 10, 50, 28);
    addRect(cells, 18, 23, 42, 26);
  } else if (maze === 2) {
    addRect(cells, 20, 0, 22, 15);
    addRect(cells, 37, 11, 64, 13);
    addRect(cells, 0, 24, 25, 26);
    addRect(cells, 40, 22, 42, 38);
  } else {
    addRect(cells, 0, 11, 29, 12);
    addRect(cells, 28, 0, 29, 11);
    addRect(cells, 35, 11, 64, 12);
    addRect(cells, 0, 24, 64, 25);
    addRect(cells, 35, 25, 36, 38);
    addRect(cells, 0, 36, 35, 38);
  }
  return cells;
}

export function getNextHead(head: Point, direction: Direction): Point {
  if (direction === "up") return { x: head.x, y: (head.y - 1 + BOARD_HEIGHT) % BOARD_HEIGHT };
  if (direction === "down") return { x: head.x, y: (head.y + 1) % BOARD_HEIGHT };
  if (direction === "left") return { x: (head.x - 1 + BOARD_WIDTH) % BOARD_WIDTH, y: head.y };
  return { x: (head.x + 1) % BOARD_WIDTH, y: head.y };
}

export function getRandomFood(snake: Point[], obstacles: Set<string>): Point {
  const occupied = new Set([...snake.map(keyOf), ...obstacles]);
  const free: Point[] = [];
  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      const point = { x, y };
      if (!occupied.has(keyOf(point))) free.push(point);
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 1, y: 1 };
}

export function getScorePerFood(level: number): number {
  // The original program awards 5, 10, or 15 points per food at levels 1, 2, and 3.
  return level * 5;
}

export function getNextSnake(
  snake: Point[],
  direction: Direction,
  food: Point,
  obstacles: Set<string>,
): { snake: Point[]; ate: boolean; crashed: boolean } {
  const head = getNextHead(snake[0], direction);
  if (obstacles.has(keyOf(head))) return { snake, ate: false, crashed: true };

  const ate = head.x === food.x && head.y === food.y;
  const nextSnake = [head, ...snake];
  if (!ate) nextSnake.pop();
  return { snake: nextSnake, ate, crashed: false };
}

export function createStartingSnake(): Point[] {
  const y = Math.floor(BOARD_HEIGHT / 2);
  const x = Math.floor(BOARD_WIDTH / 2);
  return [{ x, y }, { x: x - 1, y }, { x: x - 2, y }, { x: x - 3, y }, { x: x - 4, y }];
}

export function isOpposite(a: Direction, b: Direction): boolean {
  return (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left");
}