import { pacman, tileSize, foods, tileMap } from "./board.js";

export async function PacmanMovement(moves) {
    /* Moves Pacman according to the array of moves provided */
    let px = pacman.x / tileSize;
    let py = pacman.y / tileSize;
    
    for (const move of moves) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        if (!canMove(px, py, move, tileMap)) {
            continue; // invalid move, skip
        }

        // apply move
        if (move === "U") py--;
        else if (move === "D") py++;
        else if (move === "L") px--;
        else if (move === "R") px++;

        pacman.x = px * tileSize;
        pacman.y = py * tileSize;

        // delete food if present
        eatFoodIfPresent();
    }
}

function canMove(px, py, move, map) {
    /* Returns true if Pacman can move in*/
    let newX = px;
    let newY = py;

    if (move === 'U') newY--;
    else if (move === 'D') newY++;
    else if (move === 'L') newX--;
    else if (move === 'R') newX++;

    // verify bounds and walls
    if (newY < 0 || newY >= map.length 
        || newX < 0 || newX >= map[0].length){
        return false;
        }

    const tileChar = map[newY][newX];
    const walls = "-|12345678TBLR";

    return !walls.includes(tileChar)
}

function eatFoodIfPresent() {
  for (let food of foods) {
    if (food.x === pacman.x + 14 && food.y === pacman.y + 14) {
      foods.delete(food);
      break;
    }
  }
} 
