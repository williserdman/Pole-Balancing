import p5 from "p5";
import { Stick } from "./stick";

const OFFSET = -23;

export class Cart {
    // properties
    private sk: p5;
    private img: p5.Image;
    private xPos = 400; 
    private acceleration = 0;
    private velocity = 0;
    private yRenderPoint: number;

    public stick: Stick;

    constructor(skInstance: p5, hand: p5.Image, yPos: number) {
        this.sk = skInstance;
        this.img = hand;
        this.yRenderPoint = yPos;
        this.stick = new Stick(this.sk, new p5.Vector(this.xPos, this.yRenderPoint), 150);
    }

    update(dTime: number) {
        dTime /= 2;

        if (this.xPos <= OFFSET && this.acceleration < 0) this.acceleration = 0;
        if (this.xPos >= OFFSET + this.sk.width && this.acceleration > 0) this.acceleration = 0;

        this.velocity += this.acceleration * dTime /2;
        //console.log(dTime);
        this.velocity = clamp(this.velocity, 2);
        
        this.stick.update(this.acceleration, new p5.Vector(this.xPos, this.yRenderPoint), dTime);
        
        this.friction();
        this.acceleration = 0;


        this.xPos += this.velocity * dTime;

        if (this.xPos < OFFSET) this.xPos = OFFSET;
        if (this.xPos > OFFSET + this.sk.width) this.xPos = this.sk.width + OFFSET

        //console.log(this.GetAttributes());
        this.sk.image(this.img, this.xPos + OFFSET, this.yRenderPoint);
    }

    push(magnitude: number) {
        this.acceleration += magnitude;
    }

    private friction() {
        if (this.velocity > 0.2) {
            this.velocity -= 0.2;
        } else if (this.velocity < -0.2) {
            this.velocity += 0.2;
        } else {
            this.velocity = 0;
        }
    }

    GetAttributes() {
        let speedNorm = Math.abs(this.stick.angularVelocity) > 0.05 ? this.stick.angularVelocity / 9 : 0;
        let newAngle = this.stick.angle
        while (newAngle > 1) {
            newAngle /= (2 * Math.PI)
        }
        return [newAngle, speedNorm, this.xPos / 800, this.velocity]
    }

    GetXPos() {
        return this.xPos;
    }

    GetYPos() {
        return this.stick.GetYVariableVal();
    }
}

export function clamp(workingNum: number, max: number) {
        if (workingNum > 0) {
            return Math.max(0, Math.min(workingNum, max));
        }

        return -Math.max(0, Math.min(Math.abs(workingNum), max));       
    }