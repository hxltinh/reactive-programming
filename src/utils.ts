import { INITIAL_SNAKE_LENGTH } from './config';
import { Direction } from './direction';

export interface IPoint {
    x: number;
    y: number;
}

export interface ISnakeState {
    direction: Direction;
    snakeLength: number;
}

export type SnakePoints = IPoint[];

export function checkCollision(a: IPoint, b: IPoint) {
    return a.x === b.x && a.y === b.y;
}

export function moveSnakeHead(snakeHead: IPoint, direction: Direction) {
    let { x: snakeX, y: snakeY } = snakeHead;

    if (direction === Direction.Right) {
        snakeX++;
    } else if (direction === Direction.Left) {
        snakeX--;
    } else if (direction === Direction.Up) {
        snakeY--;
    } else if (direction === Direction.Down) {
        snakeY++;
    }

    return {
        x: snakeX,
        y: snakeY,
    };
}

export function generateSnake(): IPoint[] {
    const snake = [];

    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }

    return snake;
}
