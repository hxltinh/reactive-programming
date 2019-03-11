import { drawSnake, drawPizza, clearFrame } from '../shapes';
import { Direction } from '../direction';
import { SNAKE_SIZE, FRAME_WIDTH, FRAME_HEIGHT } from '../config';
import { moveSnakeHead, checkCollision, IPoint, generateSnake } from '../utils';

export class TheSnake {
    private ctx: CanvasRenderingContext2D;

    private snakePoints: IPoint[] = [];

    private food: IPoint = { x: 0, y: 0 };

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.snakePoints = generateSnake();
        this.createFood();
    }

    public initialize() {
        this.draw(Direction.Right);
    };

    public draw(direction: Direction, stopDrawing?: () => void) {
        const { ctx } = this;

        clearFrame(ctx);
        const movedSnakeHead = moveSnakeHead(this.snakePoints[0], direction);

        const { x: snakeX, y: snakeY } = movedSnakeHead;

        if (this.checkIfStopDrawing(snakeX, snakeY)) {
            stopDrawing && stopDrawing();
            return;
        }

        this.snakeEatFootOrMove(snakeX, snakeY);

        this.drawSnakeBody();

        drawPizza(this.ctx, this.food.x, this.food.y);
    }

    private snakeEatFootOrMove(snakeX: number, snakeY: number) {
        if (snakeX === this.food.x && snakeY === this.food.y) {
            const tail = {x: snakeX, y: snakeY};

            this.createFood();
            this.snakePoints.unshift(tail);
          } else {
            const tail = this.snakePoints.pop();
            if (tail) {
                tail.x = snakeX;
                tail.y = snakeY;
                this.snakePoints.unshift(tail);
            }
        }
    }

    private checkIfStopDrawing(snakeX: number, snakeY: number) {
        return snakeX === -1
        || snakeX === FRAME_WIDTH / SNAKE_SIZE
        || snakeY === -1
        || snakeY === FRAME_HEIGHT / SNAKE_SIZE
        || this.checkIfSnakeEatItSelf(snakeX, snakeY, this.snakePoints);
    }

    private createFood() {
        this.food = {
            x: Math.floor((Math.random() * 30) + 1),
            y: Math.floor((Math.random() * 30) + 1),
        };

        for (const point of this.snakePoints) {
            const { x: snakeX, y: snakeY } = point;

            if (this.food.x === snakeX && this.food.y === snakeY || this.food.y === snakeY && this.food.x === snakeX) {
                this.food.x = Math.floor((Math.random() * 30) + 1);
                this.food.y = Math.floor((Math.random() * 30) + 1);
            }
        }
    }

    private drawSnakeBody() {
        this.snakePoints.forEach(({x, y}) => drawSnake(this.ctx, x, y));
    }

    private checkIfSnakeEatItSelf(x: number, y: number, snakePoints: IPoint[]) {
        return snakePoints.some(point => checkCollision({x, y}, point));
    }
}
