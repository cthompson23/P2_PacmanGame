import { tileMap } from "../scripts/board.js";
const array_size = 100; //size of the array of moves
const max_generations = 10; //maximum number of generations
const population_size = 5; // there will be 5 individuals in the population
const move_opcions = ['U', 'D', 'L', 'R']; // possible moves: Up, Down, Left, Right

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
    /*Calculates the fitness of the individual based on the map 
    and Pacman's starting position*/
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

      // si se sale del mapa o choca contra una pared, penaliza
      if (
        newY < 0 ||
        newY >= map.length ||
        newX < 0 ||
        newX >= map[0].length ||
        "-|12345678TBLR".includes(map[newY][newX])
      ) {
        score -= 5; // penalización por choque
        continue;
      }

      const nearbyFood = this.detectNearbyFood(map, x, y);
      if (nearbyFood) {
        score += 3; // acercarse a comida
      }

      x = newX;
      y = newY;

      const key = `${x},${y}`;
      if (!visited.has(key)) {
        visited.add(key);
        if (map[y][x] === ' ') {
          score += 10; // recompensa por comer punto
        } else {
          score += 2; // moverse
        }
      }
    }

    this.fitness = score;
    console.log("Fitness:", this.fitness);
    return this.fitness;
   
  }

  detectNearbyFood(map, x, y) {
    const directions = [
      [0, -1], // arriba
      [0, 1],  // abajo
      [-1, 0], // izquierda
      [1, 0],  // derecha
    ];

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
        return true; // hay comida cerca
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

  toStringPopu() {
    /*Returns a string representation of the population*/
    return this.population.map(ind => ind.toString()).join('\n');
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
const cromosoma = inicial_array; // movimientos de ejemplo
const ind = new Individual(cromosoma);


console.log("Resultados de fitness:");
console.log(population.toString());
console.log(population.toStringPopu());
