export enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}

export function calculateDirection(keyCode: number, currentDirection: Direction) {
    switch(keyCode) {
        case 37: {
            if (currentDirection !== Direction.Right) {
                return Direction.Left;
            }
            break;
        }

        case 39: {
            if (currentDirection !== Direction.Left) {
                return Direction.Right;
            }
            break;
        }

        case 38: {
            if (currentDirection !== Direction.Down) {
                return Direction.Up;
            }
            break;
        }

        case 40: {
            if (currentDirection !== Direction.Up) {
                return Direction.Down;
            }
            break;
        }
    }
}