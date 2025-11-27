import { PacmanMovement } from "./PacManMoves.js";
import { Ghost, updateGhosts } from "./ghosts.js";
import { initMusic, toggleMusic } from "./music.js";


let board;
const rowCount = 17;
const colCount = 19;
export const tileSize = 32;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize; 
let context;

let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;
let horizontalWallImage;
let verticalWallImage;
let corner1Image;
let corner2Image;
let corner3Image;
let corner4Image;
let conector5Image;
let conector6Image;
let conector7Image;
let conector8Image;
let capTopImage;
let capBottomImage;
let capLeftImage;
let capRightImage;

export const tileMap = [
   //the table is represented as a matrix of characters
   //the blanck spaces represent food
   //walls are represented by different characters (depending on the type of image to use)
   //ghosts are represented by characters: b (blue), o (orange), p (pink), r (red)
   //pacman is represented by character P

    "1-----------------2",
    "|                 |",
    "| LR T L---R T LR |",
    "|    |       |    |",
    "4--2 6--R L--5 1--3",
    "OOO| |       | |OOO",
    "---3 B LRrLR B 4---",
    "O       bpo       O",
    "---2 T L---R T 1---",
    "OOO| |       | |OOO",
    "1--3 B L-8-R B 4--2",
    "|        |        |",
    "| L2 L-R B L-R 1R |",
    "|  |     P     |  |",
    "6R B T  L-R  T B L5",
    "|    |       |    |",
    "4----7-------7----3",
];

export const walls = new Set(); //set of wall cells
export const foods = new Set(); //set of food cells
export const ghosts = new Set(); //set of ghost cells
export let pacman; //pacman cell

window.onload = function() {
    /**
     * Initializes the game once the window is fully loaded.
     * Configures the canvas, loads images, builds the map and starts the update loop.
     *
     * @returns {void}
     */
    initMusic();   // inicializa el audio
    const musicBtn = document.getElementById("music-btn");
    musicBtn.addEventListener("click", toggleMusic);

    board = document.getElementById("board"); board.height = boardHeight; 
    board.width = boardWidth; 
    context = board.getContext("2d"); //used for drawing on the board
    loadImages();
    loadMap();
    update();
    PacmanMovement( ['R', 'L', 'R', 'D', 'U', 'R', 'D', 'L', 'U', 'L', 'L', 'D', 'L', 'D', 'R', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'R', 'U', 'U', 'U', 'R', 'R', 'D', 'U', 'D', 'D', 'U', 'D', 'D', 'D', 'U', 'L', 'R', 'D', 'R', 'D', 'R', 'D', 'R', 'D', 'L', 'L', 'R', 'L', 'R', 'U', 'L', 'D', 'L', 'R', 'R', 'R', 'R', 'D', 'U', 'R', 'L', 'U', 'R', 'L', 'L', 'U', 'L', 'U', 'R', 'U', 'R', 'U', 'L', 'U', 'D', 'D', 'D', 'L', 'L', 'U', 'L', 'D', 'D', 'U', 'L', 'U', 'D', 'D', 'U', 'L', 'U', 'R', 'U', 'U', 'L', 'R', 'U', 'U'])
};

function loadImages() {
    /**
     * Loads all graphical assets (walls, corners, caps, ghosts, and Pac-Man sprites).
     *
     * @returns {void}
     */
    
    //walls
    horizontalWallImage = new Image();
    horizontalWallImage.src = "../resources/horizontalWall.png";
    verticalWallImage = new Image();
    verticalWallImage.src = "../resources/verticalWall.png";

    //corners
    corner1Image = new Image();
    corner1Image.src = "../resources/corner1.png";
    corner2Image = new Image();
    corner2Image.src = "../resources/corner2.png";
    corner3Image = new Image();
    corner3Image.src = "../resources/corner3.png";
    corner4Image = new Image();
    corner4Image.src = "../resources/corner4.png";

    conector5Image = new Image();
    conector5Image.src = "../resources/conectorLeft.png";
    conector6Image = new Image();
    conector6Image.src = "../resources/conectorRight.png";
    conector7Image = new Image();
    conector7Image.src = "../resources/conectorTop.png";
    conector8Image = new Image();
    conector8Image.src = "../resources/conectorBottom.png";

    //caps
    capTopImage = new Image();
    capTopImage.src = "../resources/capTop.png";
    capBottomImage = new Image();
    capBottomImage.src = "../resources/capBottom.png";
    capLeftImage = new Image();
    capLeftImage.src = "../resources/capLeft.png";
    capRightImage = new Image();
    capRightImage.src = "../resources/capRight.png";

    //ghosts
    blueGhostImage = new Image();
    blueGhostImage.src = "../resources/blueGhost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "../resources/orangeGhost.png"
    pinkGhostImage = new Image()
    pinkGhostImage.src = "../resources/pinkGhost.png";
    redGhostImage = new Image()
    redGhostImage.src = "../resources/redGhost.png";

    //pacman
    pacmanRightImage = new Image();
    pacmanRightImage.src = "../resources/pacmanRight.png";
}

function loadMap() {
    /**
     * Loads the tile map and initializes walls, foods, ghosts, and Pac-Man positions.
     *
     * @returns {void}
     */

    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c*tileSize;
            const y = r*tileSize;
            
            if (tileMapChar == '-') { //horizontal wall
                const wall = new Cell(horizontalWallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '|') { //vertical wall
                const wall = new Cell(verticalWallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '1') { //corner wall
                const wall = new Cell(corner1Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '2') { //corner wall
                const wall = new Cell(corner2Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '3') { //corner wall
                const wall = new Cell(corner3Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '4') { //corner wall
                const wall = new Cell(corner4Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '5') { //corner wall
                const wall = new Cell(conector5Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '6') { //corner wall
                const wall = new Cell(conector6Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '7') { //corner wall
                const wall = new Cell(conector7Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == '8') { //corner wall
                const wall = new Cell(conector8Image, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'T') { //top cap wall
                const wall = new Cell(capTopImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'B') { //bottom cap wall
                const wall = new Cell(capBottomImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'L') { //left cap wall
                const wall = new Cell(capLeftImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'R') { //right cap wall
                const wall = new Cell(capRightImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'b') { //blue ghost
                const ghost = new Ghost(blueGhostImage, x, y);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') { //orange ghost
                const ghost = new Ghost(orangeGhostImage, x, y);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') { //pink ghost
                const ghost = new Ghost(pinkGhostImage, x, y);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') { //red ghost
                const ghost = new Ghost(redGhostImage, x, y);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') { //pacman
                pacman = new Cell(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') { //empty is food
                const food = new Cell(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}

function update() {
    /**
     * Main update loop that refreshes the game state and triggers rendering.
     *
     * @returns {void}
     */

    updateGhosts();
    draw();
    setTimeout(update, 50); 
}

function draw() {
    /**
     * Renders all game elements onto the canvas, including Pac-Man, ghosts,walls, and food pellets.     
     *
     * @returns {void}
     */

    context.clearRect(0, 0, boardWidth, boardHeight);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }
}

class Cell {
    /**
     * Drawable object on the board(walls, food, or characters)
     *
     * @param {HTMLImageElement|null} image - The sprite image or null (for food).
     * @param {number} x - X-coordinate in pixels.
     * @param {number} y - Y-coordinate in pixels.
     * @param {number} width - Width of the element in pixels.
     * @param {number} height - Height of the element in pixels.
     */

    constructor(image, x, y, width, height) {
        //each image is a Cell, they have positions(x,y) and size (width, height)
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.startY = y;
        
    }

};
