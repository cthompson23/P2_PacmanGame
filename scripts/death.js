import { pacman, ghosts, resetBoard } from "./board.js";
// preloaded sound declared outside
let deathSound = new Audio("../resources/Pacman-Death.mp3");
deathSound.preload = "auto";
deathSound.volume = 1;

export function killPacman() {  
    /**
     * Handles Pac-Man's death event.     
     *
     * @returns {void}
     */
    console.log("I DIED");
    const deathSound = new Audio("../resources/Pacman-Death.mp3");
    deathSound.play();

    const livesSpan = document.getElementById("lives-value");
    let lives = parseInt(livesSpan.textContent);

    lives--;
    livesSpan.textContent = lives;

    // Reset board if Pac-Man still has lives
    if (lives > 0) {
        setTimeout(() => {
            resetBoard();
        }, 600);
        return;
    }
    gameOver();
}

export function gameOver() {
    /**
     * Displays the Game Over screen and returns to the start window.     
     *
     * @returns {void}
     */    
    const overlay = document.createElement("div");
    overlay.id = "game-over-overlay";

    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('../resources/gameOverScreen.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: "9999"
    });

    document.body.appendChild(overlay);

    setTimeout(() => {
        window.location.href = "../StartWindow.html";
    }, 3000);
}
