export function mulberry32(seed) {
    /**
     * Mulberry32: Generates pseudoRandom numbers using a seed=
     *     
     *
     * @param {number} seed - inicial seed 
     * @returns {function(): number} returns random number     
     */

    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
