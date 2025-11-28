// Module to collect logs from every run

class SeedLogger {
    /**
     * Metric Register for each run Seed, it captures all config info     
     *
     * @class SeedLogger
     * @param {number} seed - Current seed in run.
     */
    constructor(seed) {
        this.seed = seed;
        this.startTime = performance.now();
        this.config = {};
        this.generations = [];
        this.finalResult = {};
    }
    
    setConfig(configObj) {    
        this.config = configObj;
    }
    
    logGeneration(genIndex, best, avg, std) {
        /**
         * Register gen metrics
         *
         * @param {number} genIndex - Gen #
         * @param {number} best - best fitness
         * @param {number} avg - average fitness
         * @param {number} std - standard deviation
         */
        this.generations.push({
            generation: genIndex,
            best_fitness: best,
            avg_fitness: avg,
            std_fitness: std
        });
    }

    setFinalResult(resultObj) {        
    /**
     * Register final results 
     *
     * @param {Object} resultObj - final result     
     */
        this.finalResult = resultObj;
        this.finalResult.total_time_ms = performance.now() - this.startTime;
    }
    
    exportJSON() {
        const logObj = {
            seed: this.seed,
            config: this.config,
            generations: this.generations,
            final: this.finalResult
        };

        const dataStr = JSON.stringify(logObj, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `seed_${this.seed}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

export default SeedLogger;
