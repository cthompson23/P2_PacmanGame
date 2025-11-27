import { tileMap } from "../scripts/board.js";

const array_size = 100; //size of the array of moves
const max_generations = 50; //maximum number of generations
const population_size = 20; // individuals in the population
const mutation_rate = 0.10; // 10% chance of mutation
const move_opcions = ['U', 'D', 'L', 'R']; // possible moves: Up, Down, Left, Right
const directions = [
      [0, -1], // up
      [0, 1],  // down
      [-1, 0], // left
      [1, 0],  // right
];

const inicial_array = Array.from({ length: array_size }, () => {
  const randomIndex = Math.floor(Math.random() * move_opcions.length);
  return move_opcions[randomIndex];
}); // generates the initial array with random moves

console.log(inicial_array);

class Individual {
  /*Represents an individual in the population*/
  constructor(cromosoma) {
    this.cromosoma = cromosoma; //cromosoma is an array of moves
    this.fitness = 0; //fitness value
  }
  
  fitnessFunction(map, pacmanStart) {
    /**
   * Applies fitness penalties related to ghosts, food, movement   
   *
   * @param {Array<Array<string>>} map - The tilemap.
   * @param {number} x - Pac-Man’s updated X coordinate.
   * @param {number} y - Pac-Man’s updated Y coordinate.
   * @returns {void}
   */

    let x = pacmanStart.x;
    let y = pacmanStart.y;
    let score = 0;
    const visited = new Set();

    for (const move of this.cromosoma) {
      let newX = x;
      let newY = y;

      if (move === 'U') newY--;
      else if (move === 'D') newY++;
      else if (move === 'L') newX--;
      else if (move === 'R') newX++;

      // if new position is out of bounds 
      if (
        newY < 0 ||
        newY >= map.length ||
        newX < 0 ||
        newX >= map[0].length ||
        "-|12345678TBLR".includes(map[newY][newX])
      ) {
        score -= 10; // moves into wall 
        console.log(score);
        continue;
      }

      /*if (this.detectNearbyGhost(map, x, y)) {
        score -= 10;
      }

      if (this.collisionGhost(map[newX][newY])) {
        score -= 50;
      }*/

      if (this.detectNearbyFood(map, x, y)){
        score += 10; // moves closer to food
        console.log(score);
      }

      x = newX;
      y = newY;

      const key = `${x},${y}`;
      if (this.collisionGhost(map[y][x])) {
        score -= 200;   // Pac-Man dies — huge punishment
      }
      
      if (this.detectNearbyGhost(map, x, y)) {
        score -= 20;    // Pac-Man should learn to not get close
      }

      if (visited.has(key)) {
        score -= 50; // revisits the same cell
        visited.add(key);
      } else {
        visited.add(key);
        score += 20; //first time in this cell
        
        if (map[y][x] === ' ') {
          score += 30; // moves to food
          console.log(score);
        } else {
          score -= 15; // moves to empty space
          console.log(score);
        }
      }
    }
    
    
    this.fitness = score;
    console.log("Fitness:", this.fitness);
    return this.fitness;
   
  }

  
collisionGhost(cell) {
  /**
   * Returns true if Pac-Man is exactly on a ghost tile.
   *
   * @param {string} cell - Map char at Pac-Man's position.
   * @returns {boolean} True if collision with a ghost.
   */
  return ['r', 'g', 'b', 'o'].includes(cell);
}

detectNearbyGhost(map, x, y) {
  /**
   * Checks surrounding tiles to detect if a ghost is near.
   *
   * @param {Array<Array<string>>} map - Game tilemap.
   * @param {number} x - Pac-Man X position.
   * @param {number} y - Pac-Man Y position.
   * @returns {boolean} True if a ghost is in any adjacent tile.
   */
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[0].length && this.collisionGhost(map[ny][nx])) {
      return true;
    }
  }
  return false;
}


  detectNearbyFood(map, x, y) {
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        ny >= 0 &&
        ny < map.length &&
        nx >= 0 &&
        nx < map[0].length &&
        map[ny][nx] === ' '
      ) {
        return true; // food found nearby
      }
    }
    return false;
  } 

  toString() {
    /*Returns a string representation of the individual*/
    return this.cromosoma.join('');
  }
}

class Population {
  /*Represents a population of individuals*/
  constructor(inicial_array, size_population) {
    this.inicial_array = inicial_array;
    this.size_population = size_population;

    // Generates inicial population (each individual with a random copy of the base array)
    this.population = Array.from({ length: this.size_population }, () => {
      //Creates a new random chromosome
      const randomChromosome = Array.from({ length: inicial_array.length }, () =>
        inicial_array[Math.floor(Math.random() * inicial_array.length)]
      );
      return new Individual(randomChromosome);
    });
  }

  selectParent() {
    const tournamentSize = 30;
    const selected = [];

    for (let i = 0; i < tournamentSize; i++) {
      const r = Math.floor(Math.random() * this.population.length);
      selected.push(this.population[r]);
    }

    selected.sort((a, b) => b.fitness - a.fitness);
    return selected[0]; // best individual
}

  newGeneraton(){
    /*Generates a new generation of individuals*/

    //order population by fitness
    this.population.sort((a, b) => b.fitness - a.fitness);

    //select the two best individuals as parents
    const parent1 = this.selectParent();
    const parent2 = this.selectParent();


    //create new population
    const newPopulation = [];
    newPopulation.push(parent1);
    newPopulation.push(parent2);

    //fill the rest of the population with children
    while (newPopulation.length < this.size_population) {
      const child = this.crossover(parent1, parent2);
      this.mutate(child, mutation_rate);
      newPopulation.push(child);
  }
    this.population = newPopulation;
}
  
  crossover(parent1, parent2) {
    /*Creates a child individual by crossing over two parents*/
    
    const crossoverPoint = Math.floor(Math.random() * parent1.cromosoma.length);
    const childChromosome = [ parent1.cromosoma.slice(0, crossoverPoint)
                            , parent2.cromosoma.slice(crossoverPoint) ].flat();
    return new Individual(childChromosome);
  }

  mutate(individual, mutationRate) {
    /*Mutates an individual with a given mutation rate*/
    for (let i = 0; i < individual.cromosoma.length; i++) {
      if (Math.random() < mutationRate) {
        const newMove = move_opcions[Math.floor(Math.random() * move_opcions.length)];
        individual.cromosoma[i] = newMove;
      }
    }
  }

  toStringPopu() {
    /*Returns a string representation of the population*/
    return this.population.map(ind => ind.toString()).join('\n');
  }

  toArrayPopu() {
  return this.population.map(ind => ind.cromosoma);
}

  evaluateAll(map, pacmanStart) {
    this.population.forEach(ind => {
      ind.fitnessFunction(map, pacmanStart);
    });
  }

  toString() {
    return this.population
      .map((ind, i) => `Individuo ${i + 1} | Fitness: ${ind.fitness}`)
      .join("\n");
  }
}


console.log('Array inicial:', inicial_array);

function findPacmanStart(map) {
  /**
   * Finds the starting coordinates of Pac-Man in the tile map.
   * Busca el carácter 'P' en la matriz y devuelve su posición.
   *
   * @param {string[][]} map - The tile map matrix where each element is a character.
   * @returns {{x: number, y: number}} The coordinates { x, y } of Pac-Man's start; returns {x:1, y:1} if not found.
   */

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'P') return { x, y };
    }
  }
  return { x: 1, y: 1 };
}

const pacmanStart = findPacmanStart(tileMap);
const population = new Population(inicial_array, population_size);

population.evaluateAll(tileMap, pacmanStart);

console.log(" Generación 0");
console.log(population.toString());
console.log("Cromosomas iniciales:", population.toArrayPopu());

for (let gen = 1; gen <= max_generations; gen++) {

  // Crear nueva generación
  population.newGeneraton();

  // Re-evaluar fitness
  population.evaluateAll(tileMap, pacmanStart);

  console.log(`GENERACIÓN ${gen} `);
  console.log(population.toString());
}

console.log("Resultados de fitness:");
console.log(population.toString());
console.log(population.toStringPopu());
console.log(population.toArrayPopu());
const bestFinalInd = population.population.reduce((best, current) =>
  current.fitness > best.fitness ? current : best
);

console.log(" MEJOR INDIVIDUO FINAL");
console.log("Fitness:", bestFinalInd.fitness);
console.log("Cromosoma:", bestFinalInd.cromosoma);

