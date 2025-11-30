import { tileMap, foods, tileSize } from "./board.js";
import { RNG } from "../algorithm/GeneticAlgorithm.js";
export function createSuperPill() {
    /**
     * Selects a random food item from set and transforms it into a super pill     
     *
     * @returns {void}
     */    
    if (foods.size === 0) return;

    const foodArray = Array.from(foods);
    const randomIndex = Math.floor(RNG() * foodArray.length);
    const superFood = foodArray[randomIndex];

    superFood.isSuper = true;
    markSuperPillInTileMap(superFood);        
}

/**
 * Marks the tile in tileMap where the super food sits by replacing the existing
 * character (normally " ") with "S".
 *
 * This function performs NO safety checks. It assumes x/y are valid tile coords.
 *
 * @param {Object} food - The selected food object (with x,y in pixels).
 * @returns {void}
 */
export function markSuperPillInTileMap(food) {

    const tileX = Math.floor(food.x / tileSize);
    const tileY = Math.floor(food.y / tileSize);

    const rowArr = tileMap[tileY].split("");
    rowArr[tileX] = "S";
    tileMap[tileY] = rowArr.join("");
}



