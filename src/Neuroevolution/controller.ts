//@ts-nocheck
import { Cart } from '../Game Parts/cart';
import type p5 from 'p5';
import Genome from "./NeatJS/src/genome.js";

export class CartController extends Cart {
    public brain: Genome;
    public fitness = 0;
    private alive = true;

    constructor(skInstance: p5, handImage: p5.Image, yPos: number) {
        super(skInstance, handImage, yPos);
        this.brain = new Genome(4, 3);
    }

    changeBrain(new_brain): void {
        this.brain = new_brain; 
    }


    think(): void {
        this.fthink();

        //console.log(this.fitness);

        // this.fitness += yPos;

        let inputs = super.GetAttributes()
        // console.log(inputs);

        let results = this.brain.feedForward(inputs);
        //console.log(inputs);

        //console.log(results[0]);

        let iMax = indexOfMax(results);

        // and if imax == 2 do nothing
        if (iMax == 0) {
            super.push(-1);
          } else if (iMax == 1) {
            super.push(1);
          }
  
    }

    fthink() {
        let yPos = 600 - this.GetYPos();

        if (yPos > 120) {
            this.fitness += yPos;
        } else {
            this.fitness -= 500;
        }
    }
}

export function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}