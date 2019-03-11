import { SNAKE_SIZE, FRAME_HEIGHT, FRAME_WIDTH } from './config';
const score = 0;

export function drawSnake(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // This is the single square
    ctx.fillStyle = 'green';
    ctx.fillRect(x*SNAKE_SIZE, y*SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
    // This is the border of the square
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(x*SNAKE_SIZE, y*SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
}

export function drawPizza(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // This is the border of the pizza
    ctx.fillStyle = 'yellow';
    ctx.fillRect(x*SNAKE_SIZE, y*SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
    // This is the single square 
    ctx.fillStyle = 'red';
    ctx.fillRect(x*SNAKE_SIZE+1, y*SNAKE_SIZE+1, SNAKE_SIZE-2, SNAKE_SIZE-2);
}

export function scoreText(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const scoreText = "Score: " + score;
    ctx.fillStyle = 'blue';
    ctx.fillText(scoreText, 145, FRAME_HEIGHT - 5);
}

export function clearFrame(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
}