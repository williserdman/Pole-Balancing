import p5 from "p5";
import { Cart } from "./Game Parts/cart.ts";
import { CartController, indexOfMax} from "./Neuroevolution/controller.ts";

export default function sketch(sk: any) {
    let handImage: p5.Image, myCart: Cart;
    sk.preload = () => {
        handImage = sk.loadImage("hand.webp");
    }

    let populationSize = 500;
    let controllers: CartController[] = [];

    let timeTracker: number;

    sk.setup = () => {
        handImage.resize(80, 0);
        sk.createCanvas(800, 600);
        sk.background(220);

        for (let i = 0; i < populationSize; i++) {
            controllers[i] = new CartController(sk, handImage, sk.height - 120);
        }

        //@ts-ignore
        // ml5.setBackend("cpu");

        myCart = new Cart(sk, handImage, sk.height - 120);

        timeTracker = Date.now();
    }

    sk.draw = () => {
        sk.background(220);

        if (sk.keyIsPressed == true) {
            if (sk.key == 'a') {
                myCart.push(-1);
            }
            if (sk.key == 'd') {
                myCart.push(1);
            }
        }

        myCart.update(sk.deltaTime);
        console.log(myCart.GetYPos());

        for (let controller of controllers) {
            controller.think();
            controller.update(sk.deltaTime);
        }

        if (Date.now() - timeTracker >= 20000) {
            normalizeFitness();
            reproduction();

            timeTracker = Date.now();
        }
    }

    function weightedSelection() {
        let index = 0;
        let start = sk.random(1)

        while (start > 0) {
            start = start - controllers[index].fitness;
            index++;
        }

        index--;

        return controllers[index].brain;
    }

    function normalizeFitness(): void {
        let sum = 0;

        // making them all >= 0
        let smallest = 0;
        for (let c of controllers) {
            if (c.fitness < smallest) {
                smallest = c.fitness;
            }
        }
        controllers.forEach((c) => c.fitness += Math.abs(smallest));

        for (let controller of controllers) {
            sum += controller.fitness;
        }
        controllers.forEach((c) => c.fitness /= sum);
    }

    function reproduction(): void {
        let nextBatch: CartController[] = [];

        for (let i = 0; i < populationSize - 5; i++) {

            let temp = new CartController(sk, handImage, sk.height - 120);
            let t2: number[] = []; controllers.forEach((c) => t2.push(c.fitness));
            let best = controllers[indexOfMax(t2)].brain

            let parentA = weightedSelection();
            let parentB = weightedSelection();

            let child;
            
            if (parentA.fitness > parentB.fitness) {
                child = best.crossover(parentA);
            } else {
                child = best.crossover(parentB);
            }

            child.mutate();

            nextBatch[i] = new CartController(sk, handImage, sk.height - 120);
            nextBatch[i].changeBrain(child);
        }

        for (let i = 0; i < 4; i++) {
            let temp = new CartController(sk, handImage, sk.height - 120);
            temp.changeBrain(weightedSelection());
            nextBatch.push(temp);
        }

        let temp = new CartController(sk, handImage, sk.height - 120);
        let t2: number[] = []; controllers.forEach((c) => t2.push(c.fitness));
        temp.changeBrain(controllers[indexOfMax(t2)])

        // controllers is somehow a batch of genomes
        controllers = nextBatch;
    }
}