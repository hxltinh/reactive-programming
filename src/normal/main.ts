import { GAME_SPEED } from '../config';
import { TheSnake } from './TheSnake';
import { Direction, calculateDirection } from '../direction';

class Main {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D;

    private theSnake: TheSnake;
    private direction: Direction = Direction.Right;

    private interval: number = 0;

    constructor() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new Error('no canvas element implemented');
        }
        this.canvas = canvas;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('no canvas implemented');
        }
        this.ctx = ctx;

        this.theSnake = new TheSnake(this.ctx);
    }

    public run() {
        this.startTheGame(this.ctx);
    }

    private startTheGame(ctx: CanvasRenderingContext2D) {
        this.changeDirection();
        this.theSnake.initialize();

        this.interval = setInterval(() => {
            this.theSnake.draw(this.direction, () => clearInterval(this.interval));
        }, GAME_SPEED);
    }

    private changeDirection() {
        document.onkeydown = event => {
            const keyCode = event.keyCode;

            const direction = calculateDirection(keyCode, this.direction);
            if (direction) {
                this.direction = direction;
            }
        };
    }
}

export const main = new Main();
