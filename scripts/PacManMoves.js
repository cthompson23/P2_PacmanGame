import { pacman, tileSize, foods, tileMap } from "./board.js";

export async function PacmanMovement(moves) {
  /**
   * Moves Pac-Man through the board    
   *
   * @async
   * @param {string[]} moves - Array of directional commands ("U", "D", "L", "R").
   * @returns {Promise<void>}
   */

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
  /**
   * Determines whether Pac-Man can move in a given direction based on walls and bounds.
   *
   * @param {number} px - Pac-Man's current tile X coordinate.
   * @param {number} py - Pac-Man's current tile Y coordinate.
   * @param {string} move - Direction of intended movement ("U", "D", "L", "R").
   * @param {string[]} map - The game's tile map matrix.
   * @returns {boolean} True if movement is valid; otherwise false.
   */

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
  /**
   * Detects whether Pac-Man is currently standing on a food pellet & removes it from the board if present.
   *
   * @returns {void}
   */

  for (let food of foods) {
    if (food.x === pacman.x + 14 && food.y === pacman.y + 14) {
      foods.delete(food);
      break;
    }
  }
} 
