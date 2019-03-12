import { FRAME_HEIGHT, FRAME_WIDTH, GAME_SPEED, INITIAL_SNAKE_LENGTH, SNAKE_SIZE } from '../config';
import { calculateDirection, Direction } from '../direction';

import { BehaviorSubject, combineLatest, EMPTY, fromEvent, interval, merge } from 'rxjs';
import {
    distinctUntilChanged, map, scan, share, skip, startWith, switchMapTo, takeWhile, tap, withLatestFrom,
} from 'rxjs/operators';
import { clearFrame, drawPizza, drawSnake } from '../shapes';
import { checkCollision, generateSnake, IPoint, ISnakeState, moveSnakeHead, SnakePoints } from '../utils';

class Main {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new Error('no canvas element implemented');
        }
        this.canvas = canvas;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('get 2d context fails');
        }
        this.ctx = ctx;
    }

    public run() {
        this.startTheGame(this.ctx);
    }

    private startTheGame(ctx: CanvasRenderingContext2D) {

        const tick$ = interval(GAME_SPEED);

        const snakeLength$ = new BehaviorSubject(INITIAL_SNAKE_LENGTH);
        const snakeGainLength$ = snakeLength$.pipe(
            scan(sumUp),
        );

        const keyboardInput$ = fromEvent<KeyboardEvent>(document, 'keydown');

        const direction$ = keyboardInput$.pipe(
            map(({ keyCode }) => keyCode),
            startWith(Direction.Right),
            scan<number, Direction>(accumulateDirection),
            distinctUntilChanged(),
        );

        const snakeGoesHunt$ = tick$.pipe(
            withLatestFrom(direction$, snakeGainLength$),
            map(([_, direction, snakeLength]) => ({ direction, snakeLength })),
            scan<ISnakeState, SnakePoints>(snakeIsMoving, generateSnake()),
            share(),
        );

        const pizza$ = snakeGoesHunt$.pipe(
            scan<SnakePoints, IPoint>(renewPizzaPosition, generatePizza()),
            distinctUntilChanged(),
            share(),
        );

        const snakeEatPizza$ = pizza$.pipe(
            skip(1),
            map(() => 1),
            tap((value) => snakeLength$.next(value)),
            switchMapTo(EMPTY),
        );

        const pizzaEaten$ = merge(pizza$, snakeEatPizza$);

        const main$ = combineLatest(snakeGoesHunt$, pizzaEaten$).pipe(
            takeWhile(([snakePoints]) => checkIfStopGame(snakePoints)),
        );

        main$.subscribe(([snakePoints, pizzaPoint]) => {
            clearFrame(this.ctx);
            snakePoints.forEach(({ x, y }) => drawSnake(this.ctx, x, y));
            drawPizza(this.ctx, pizzaPoint.x, pizzaPoint.y);
        });
    }
}

function sumUp(length: number, gain: number) {
    return length + gain;
}

const horizontalLimit = FRAME_WIDTH / SNAKE_SIZE;
const verticalLimit = FRAME_HEIGHT / SNAKE_SIZE;
function checkIfStopGame(snakePoints: SnakePoints) {
    const [head, ...tail] = snakePoints;

    const snakeEatsItSelf = tail.some((part) => checkCollision(part, head));

    const isOutOfBorder = (head.x < 0 || head.x >= horizontalLimit)
        || (head.y < 0 || head.y >= verticalLimit);

    return !snakeEatsItSelf && !isOutOfBorder;
}

function accumulateDirection(acc: number, next: Direction) {
    const direction = calculateDirection(next, acc);

    if (!direction) {
        return acc;
    }

    return direction;
}

function snakeIsMoving(snakePoints: SnakePoints, snakeState: ISnakeState) {
    const { direction, snakeLength } = snakeState;

    const movedSnakeHead = moveSnakeHead(snakePoints[0], direction);

    const { x: snakeX, y: snakeY } = movedSnakeHead;

    let tail = {} as IPoint;
    if (snakeLength > snakePoints.length) {
        tail.x = snakeX;
        tail.y = snakeY;
    } else {
        const poppedSnake = snakePoints.pop();
        if (poppedSnake) {
            tail = poppedSnake;
            tail.x = snakeX;
            tail.y = snakeY;
        }
    }

    snakePoints.unshift(tail);
    return snakePoints;
}

export function generatePizza() {
    const randomPosition = getRandomPosition();
    if (typeof randomPosition === 'function') { throw new Error('could not generate pizza'); }

    return randomPosition;
}

export function getRandomPosition(snake: SnakePoints = []): (() => void) | IPoint {
    const position = {
        x: getRandomNumber(),
        y: getRandomNumber(),
    };

    if (isEmptyCell(position, snake)) {
        return position;
    }

    return getRandomPosition(snake);
}

function renewPizzaPosition(pizza: IPoint, snakePoints: SnakePoints) {
    const head = snakePoints[0];

    if (checkCollision(pizza, head)) {
        const randomPosition = getRandomPosition(snakePoints);
        if (typeof randomPosition === 'function') { return pizza; }
        return randomPosition;
    }

    return pizza;
}

function isEmptyCell(position: IPoint, snake: SnakePoints) {
    return !snake.some((segment) => checkCollision(segment, position));
}

function getRandomNumber() {
    return Math.floor((Math.random() * 30) + 1);
}

export const main = new Main();
