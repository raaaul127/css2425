import Carte, {read} from './book2.js';
// Ceea ce se exporta ca default poate fi importat cu
// un modull exporta in mod default doar o singura functionalitate

let carte = new Carte('Poezii', 'Mihai Eminescu', 250);
console.log(carte.toString());
console.log(read());