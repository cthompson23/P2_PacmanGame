let music = null;
let isPlaying = false;


export function initMusic() {
    /**
     * Initializes the background music audio element.
     *
     * @returns {void}
     */
    music = new Audio("../resources/PacMan Original Theme.mp3");
    music.loop = true;  // loop forever
    music.volume = 0.1; // volume
}


export function toggleMusic() {
    /**
     * Toggles background music playback.
     * Plays if paused, pauses if currently playing.
     *
     * @returns {void}
     */
    if (!music) return;

    if (isPlaying) {
        music.pause();
        isPlaying = false;
    } else {
        music.play();
        isPlaying = true;
    }
}
