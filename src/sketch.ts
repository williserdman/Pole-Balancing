import p5 from "p5";
import { CartController, indexOfMax} from "./Neuroevolution/controller.ts";

export default function sketch(sk: any) {
    let handImage: p5.Image, myCart: CartController;
    sk.preload = () => {
        handImage = sk.loadImage("hand.webp");
    }

    let populationSize = 100;
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

        myCart = new CartController(sk, handImage, sk.height - 120);

        timeTracker = Date.now();
    }

    sk.draw = () => {
        sk.background(220);
        
        myCart.fthink()

        if (sk.keyIsPressed == true) {
            if (sk.key == 'a') {
                myCart.push(-1);
            }
            if (sk.key == 'd') {
                myCart.push(1);
            }
        }

        
        myCart.update(sk.deltaTime);
        //console.log(myCart.fitness);

        for (let controller of controllers) {
            controller.think();
            controller.update(sk.deltaTime);
        }

        if (Date.now() - timeTracker >= 20000) {
            restrictDatingPool();
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

    function restrictDatingPool() {
        let fitnessList: number[] = [];
        controllers.forEach((c) => fitnessList.push(c.fitness));
        
        let topFitnesses: number[] = weightedRandomChoiceFromTop(fitnessList);
        console.log(topFitnesses);
        let topControllers: CartController[] = [];

        controllers.forEach((c) => topFitnesses.includes(c.fitness) ? topControllers.push(c) : {});
        console.log(topControllers);

        controllers = topControllers;
    }

    function normalizeFitness(): void {
        let sum = 0;

        // making them all >= 0
        let smallest = 0;
        for (let c of controllers) {
            //console.log(c.fitness);
            if (c.fitness < smallest) {
                smallest = c.fitness;
            }
        }
        controllers.forEach((c) => c.fitness += Math.abs(smallest));

        for (let controller of controllers) {
            sum += controller.fitness;
           // console.log(controller.fitness);
        }
        controllers.forEach((c) => c.fitness /= sum);

        controllers.forEach((c) => console.log(c.fitness));
    }

    function reproduction(): void {
        let nextBatch: CartController[] = [];

       // controllers.forEach((c) => console.log(c.fitness)); 

       //let temp = new CartController(sk, handImage, sk.height - 120);
        let t2: number[] = []; controllers.forEach((c) => t2.push(c.fitness));
        //console.log(t2);
        let b = controllers[indexOfMax(t2)]
        console.log("best", b.fitness);
        let best = b.brain;
            
        for (let i = 0; i < populationSize - 5; i++) {

     

            let parentA = weightedSelection();
            let parentB = weightedSelection();

            let child;
            
            if (parentA.fitness > parentB.fitness) {
                child = parentA.crossover(parentB);
            } else {
                child = parentB.crossover(parentA);
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

        let t4 = (new CartController(sk, handImage, sk.height - 120))
        t4.changeBrain(best);
        nextBatch.push(t4);

        let temp = new CartController(sk, handImage, sk.height - 120);
        let t3: number[] = []; controllers.forEach((c) => t3.push(c.fitness));
        temp.changeBrain(controllers[indexOfMax(t3)])

        // controllers is somehow a batch of genomes
        controllers = nextBatch;
    }
}

function weightedRandomChoiceFromTop(values: number[]): number[] {
    // Step 1: Find the top 4 values
    return values.slice().sort((a, b) => b - a).slice(0, 4);
}