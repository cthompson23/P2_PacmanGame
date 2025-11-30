import { pacman, tileMap, tileSize, ghosts as ghostSet, ghosts } from "./board.js";
import { increaseScore } from "./PacManMoves.js";

const eatGhostSound = new Audio("../resources/eatGhost.mp3");


export class Ghost {
    /**
     * Creates a new ghost entity with position, sprite, movement state, and weak mode.
     *
     * @param {HTMLImageElement} image - The sprite image of the ghost.
     * @param {number} x - Initial x coordinate (in pixels).
     * @param {number} y - Initial y coordinate (in pixels).
     * @param {boolean} [weak=false] - Indicates whether the ghost is weak (edible by Pac-Man).
     */
    constructor(image, x, y, weak = false) {
        this.image = image;  
        this.baseImage = image;     
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.width = tileSize;
        this.height = tileSize;

        this.visible = true; 
        this.speedFactor = 1;  
        this.weak = weak;
        this.direction = this.randomDirection();        
        this.speed = this.randomSpeed();
    }
    
    randomDirection() {
        /**
         * Generates a random direction for the ghost to move.
         *
         * @returns {string} A direction value: "U", "D", "L", or "R".
         */
        const dirs = ["U", "D", "L", "R"];
        return dirs[Math.floor(Math.random() * dirs.length)];
    }
    randomSpeed() {
        /**
         * Generates a random speed of movement
         *
         * @returns {number} speed between 1-4
         */
        
        return Math.floor(Math.random() * 4) + 1;
    }
}

function cols() {
    /**
     * Determines number of columns in the tileMap.
     *
     * @returns {number} Number of columns.
     */
    return tileMap[0]?.length ?? 0;
}

function rows() {
    /**
     * Determines number of rows in the tileMap.
     *
     * @returns {number} Number of rows.
     */
    return tileMap.length;
}

function ghostCanMove(ghost, direction) {    
    /**
     * Verifies if a ghost can move one tile in the specified direction.     
     *
     * @param {Ghost} ghost - The ghost to evaluate.
     * @param {string} direction - The attempted movement direction ("U", "D", "L", "R").
     * @returns {boolean} True if the ghost can move in that direction, false otherwise.
     */
    // current position
    let gx = Math.floor(ghost.x / tileSize);
    let gy = Math.floor(ghost.y / tileSize);

    // destination position
    let nx = gx;
    let ny = gy;
    if (direction === "U") ny = gy - 1;
    else if (direction === "D") ny = gy + 1;
    else if (direction === "L") nx = gx - 1;
    else if (direction === "R") nx = gx + 1;

    // Si la casilla queda fuera del mapa:
    const c = cols();
    const r = rows();

    const tunnelRow = 7; // fila del túnel de teleport
    if (nx < 0 || nx >= c || ny < 0 || ny >= r) {        
        if (gy === tunnelRow && (direction === "L" || direction === "R")) {
            return true;
        } else {
            return false;
        }
    }

    const tile = tileMap[ny][nx];
    const walls = "-|12345678TBLR";
    return !walls.includes(tile);
}

function moveGhostPixel(ghost) {    
    /**
     * Moves a ghost      
     *
     * @param {Ghost} ghost - The ghost to move.
     * @returns {void}
     */    
    const steps = ghost.speed;
    for (let i = 0; i < steps; i++) {
        // check collitions
        let dx = 0, dy = 0;
        if (ghost.direction === "U") dy = -1;
        else if (ghost.direction === "D") dy = +1;
        else if (ghost.direction === "L") dx = -1;
        else if (ghost.direction === "R") dx = +1;
        
        const newX = ghost.x + dx;
        const newY = ghost.y + dy;

        const left = Math.floor(newX / tileSize);
        const right = Math.floor((newX + ghost.width - 1) / tileSize);
        const top = Math.floor(newY / tileSize);
        const bottom = Math.floor((newY + ghost.height - 1) / tileSize);

        // if the destination its a wall, it blocks the move
        let collision = false;
        const walls = "-|12345678TBLR";
        const c = cols();
        const r = rows();
        
        const checkTiles = [
            {tx: left, ty: top},
            {tx: right, ty: top},
            {tx: left, ty: bottom},
            {tx: right, ty: bottom},
        ];

        for (const t of checkTiles) {
            // fuera del mapa: puede ser teleport si en fila tunel
            if (t.tx < 0 || t.tx >= c || t.ty < 0 || t.ty >= r) {
                // si fuera del mapa y no es túnel, es colisión
                const tunnelRow = 7;
                if (!(t.ty === tunnelRow && (ghost.direction === "L" || ghost.direction === "R"))) {
                    collision = true;
                    break;
                } else {                    
                    continue;
                }
            }
            const ch = tileMap[t.ty][t.tx];
            if (walls.includes(ch)) {
                collision = true;
                break;
            }
        }

        if (collision) {            
            break;
        } else {            
            ghost.x = newX;
            ghost.y = newY;            
            applyTeleportation(ghost);// si llegamos fuera por el túnel, aplicar teleport
        }
    }
}

function applyTeleportation(ghost) {
    /**
     * Teleports a ghost from one side of the tunnel to the opposite side if required.
     *
     * @param {Ghost} ghost - The ghost to teleport.
     * @returns {void}
     */
    // Tile actual (centro del sprite)
    let gx = Math.floor(ghost.x / tileSize);
    let gy = Math.floor(ghost.y / tileSize);

    const c = cols();
    const tunnelRow = 7;
    
    if (gy !== tunnelRow) return;

    if (gx < 0) {
        ghost.x = (c - 1) * tileSize;
    } else if (gx >= c) {
        ghost.x = 0;
    }
}

function updateGhost(ghost) {
    /**
     * Updates the movement logic of a single ghost.
     * - If Pac-Man is near, the ghost pursues him.
     * - If not the ghost sometimes changes direction randomly     
     *
     * @param {Ghost} ghost - The ghost to update.
     * @returns {void}
     */
    const gx = ghost.x / tileSize;
    const gy = ghost.y / tileSize;
    const px = pacman.x / tileSize;
    const py = pacman.y / tileSize;

    const dist = Math.abs(Math.round(gx) - Math.round(px)) + Math.abs(Math.round(gy) - Math.round(py));
    
    const pacmanClose = dist < 5 && !ghost.weak;

    // check if ghost is center on the tile
    const centeredX = Math.abs((ghost.x % tileSize)) < 1 || Math.abs((ghost.x % tileSize) - tileSize) < 1;
    const centeredY = Math.abs((ghost.y % tileSize)) < 1 || Math.abs((ghost.y % tileSize) - tileSize) < 1;
    const atTileCenter = centeredX && centeredY;

    if (atTileCenter) {
        if (pacmanClose) {
            // PERSEGUIR A PAC-MAN
            if (Math.abs(px - gx) >= Math.abs(py - gy)) {
                if (px < gx && ghostCanMove(ghost, "L")) ghost.direction = "L";
                else if (px > gx && ghostCanMove(ghost, "R")) ghost.direction = "R";
                else if (py < gy && ghostCanMove(ghost, "U")) ghost.direction = "U";
                else if (py > gy && ghostCanMove(ghost, "D")) ghost.direction = "D";
            } else {
                if (py < gy && ghostCanMove(ghost, "U")) ghost.direction = "U";
                else if (py > gy && ghostCanMove(ghost, "D")) ghost.direction = "D";
                else if (px < gx && ghostCanMove(ghost, "L")) ghost.direction = "L";
                else if (px > gx && ghostCanMove(ghost, "R")) ghost.direction = "R";
            }
        } 
        else {            
            // 50% de probabilidad para girar aleatoriamente
            if (Math.random() < 0.50) {
                const options = ["U","D","L","R"].filter(d => ghostCanMove(ghost, d));
                if (options.length > 0) {
                    // Evitar girar hacia atrás 
                    const opposite = { U:"D", D:"U", L:"R", R:"L" }[ghost.direction];
                    const filtered = options.filter(o => o !== opposite);
                    const finalOptions = filtered.length ? filtered : options;
                    ghost.direction = finalOptions[Math.floor(Math.random() * finalOptions.length)];
                }
            }
        }
        
        if (!ghostCanMove(ghost, ghost.direction)) {
            const options = ["U","D","L","R"].filter(d => ghostCanMove(ghost, d));
            if (options.length > 0) {
                ghost.direction = options[Math.floor(Math.random() * options.length)];
            }
        }
    }
    moveGhostPixel(ghost);
}

export function updateGhosts() {    
    /**
     * Updates the behavior and movement of all ghosts in the game.
     *
     * @returns {void}
     */
    for (let ghost of ghostSet) {
        updateGhost(ghost);
    }
}

export function activateWeakMode() {
    /**
     * Sets all ghosts to weak mode for 7 seconds 
     *
     * @returns {void}
     */

    console.log("Ghosts are now WEAK!");
    const scaredImg = new Image();
    scaredImg.src = "../resources/scaredGhost.png";

    for (let g of ghostSet) {
        g.weak = true;        
        if (!g.originalImage) {
            g.originalImage = g.image;
        }
        g.image = scaredImg;
    }

    // restore after 7 seconds
    setTimeout(() => {
        console.log("Weak mode ended.");
        for (let g of ghostSet) {
            g.weak = false;
            g.image = g.originalImage;
        }
    }, 30000);
}

export function findRespawnPoint() {
    /**
     * Finds the respawn coordinates for ghosts after killed
     * always respawn where pinkGhost init position was     
     * @returns {{x: number, y: number}} Coordinates in pixel space      
     */

    for (let y = 0; y < tileMap.length; y++) {
        const row = tileMap[y];
        const col = row.indexOf("p");  

        if (col !== -1) {
            return {
                x: col * tileSize,
                y: y * tileSize
            };
        }
    }
    return { x: 0, y: 0 };
}

export function killGhost(ghost) {
    
    /**
     * Respawns the ghost in its ORIGINAL location     
     *
     * @param {Ghost} ghost - The ghost to respawn.
     * @returns {void}
     */    
    increaseScore(50);

    eatGhostSound.currentTime = 0;
    eatGhostSound.play();
    setTimeout(() => {
        eatGhostSound.pause();
        eatGhostSound.currentTime = 0;
        ghost.visible = false;
    }, 2000);

   // hide immediately
    ghost.visible = false;
    setTimeout(() => {
        const spawn = findRespawnPoint();
        ghost.x = spawn.x;
        ghost.y = spawn.y;
        ghost.weak = false;
        ghost.image = ghost.baseImage;  
        ghost.visible = true;

        // Blinking (3 seconds)
        let toggle = true;
        const blinkInterval = setInterval(() => {
            toggle = !toggle;
            ghost.visible = toggle;
        }, 3000);

        setTimeout(() => {
            clearInterval(blinkInterval);
            ghost.visible = true;
        }, 3000);

        // Slow movement for 2 seconds
        ghost.speedFactor = 0.5;
        setTimeout(() => {
            ghost.speed = ghost.speed;
        }, 2000);

    }, 2000);
}

