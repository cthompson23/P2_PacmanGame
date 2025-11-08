import { Cell, rowCount, colCount, walls, foods, ghosts, pacman, tileMap, tileSize} from "./board.js";
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

export function loadImages() {
    /* Load all images */
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

export function loadMap() {
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
                const ghost = new Cell(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') { //orange ghost
                const ghost = new Cell(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') { //pink ghost
                const ghost = new Cell(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') { //red ghost
                const ghost = new Cell(redGhostImage, x, y, tileSize, tileSize);
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
