const MersenneTwister = require('mersenne-twister');
const generator = new MersenneTwister();

const MAX_TIME = 65; // Maximum time for the race in seconds
const MIN_TIME = 45; // Minimum time for the race in seconds

const RACE_DISTANCE = 100; // Distance to finish the race
const TURN_INTERVAL = 0.01; // Time between each turn in seconds

async function raceHamsters(hamsterNames) {

    let NUM_HAMSTERS = hamsterNames.length; // Number
    let hamsters = Array(NUM_HAMSTERS).fill(0); // Initialize hamster positions

    let raceTime = 0; // Initialize race time
    let finishedHamsters = []; // Array to keep track of finished hamsters
    
    // Calculate the maximum and minimum steps per turn to ensure the race finishes within the time range
    const maxStep = RACE_DISTANCE / (MIN_TIME / TURN_INTERVAL);
    const minStep = RACE_DISTANCE / (MAX_TIME / TURN_INTERVAL);

    // Race loop
    while (finishedHamsters.length < NUM_HAMSTERS) {
        // Move each hamster forward
        let stepsForThisTurn = [];

        // Create an array of hamster indices
        let hamsterIndices = hamsters.map((_, index) => index);

        // Shuffle it using Fisher-Yates (Knuth) Shuffle
        for (let i = hamsterIndices.length - 1; i > 0; i--) {
            const j = Math.floor(generator.random() * (i + 1));
            [hamsterIndices[i], hamsterIndices[j]] = [hamsterIndices[j], hamsterIndices[i]];
        }

        // Move each hamster based on the shuffled order
        hamsterIndices.forEach((index) => {
            if (hamsters[index] >= RACE_DISTANCE) {
                return;
            }
            const step = Math.floor(generator.random() * (maxStep - minStep + 1) + minStep);
            stepsForThisTurn[index] = step; // Store the step for this turn using the original index

            const newPosition = hamsters[index] + step;
            hamsters[index] = newPosition; // Update the position of the current hamster

            // Check if the hamster has finished the race
            if (newPosition >= RACE_DISTANCE && !finishedHamsters.includes(index + 1)) {
                finishedHamsters.push(index + 1);
            }
        });

        await new Promise(resolve => setTimeout(resolve, TURN_INTERVAL * 1000));
        
    }

}
