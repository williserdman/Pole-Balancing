import {randomGaussian} from 'p5';

//The Connection Class
//Is where all the weights are stored
//Mostly used for a cleaner and more readable code.
export default class Connection {
	constructor(from, to, weight){
		this.fromNode = from; //type: Node
		this.toNode = to; //type: Node
		this.weight = weight; //type: Number
		this.enabled = true;
	}

	mutateWeight(){ //Randomly mutate the weight of this connection
		let rand = Math.random();
		if (rand < 0.05) //5% chance of being assigned a new random value
			this.weight = Math.random() * 2 - 1;
		else //95% chance of being uniformly perturbed
			this.weight += gaussianRandom() / 50;
	}

	clone(){ //Returns a copy of this connection
		let clone = new Connection(this.fromNode, this.toNode, this.weight);
		clone.enabled = this.enabled;
		return clone;
	}

	getInnovationNumber(){ //Using https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
		return (1/2)*(this.fromNode.number + this.toNode.number)*(this.fromNode.number + this.toNode.number + 1) + this.toNode.number;
	}
}

export function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}