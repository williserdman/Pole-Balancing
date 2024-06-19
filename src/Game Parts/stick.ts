import p5 from "p5";

export class Stick {
    staticPoint: p5.Vector;
    length: number;
    sk: p5;
    public angle: number;
    public angularVelocity: number;
    angularAcceleration: number;
    variablePointY: number = 0;

    constructor(sk: p5, nonMovingPoint: p5.Vector, length: number) {
        this.sk = sk;
        this.staticPoint = nonMovingPoint;
        this.length = length;
        this.angle = Math.PI / 8
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }

    update(cartAcceleration: number, point: p5.Vector, deltaTime: number) {
        this.staticPoint = point;
        this.applyPhysics(cartAcceleration, deltaTime);

        // Calculate the new position of the variable point
        const variablePointX = this.staticPoint.x + this.length * Math.sin(this.angle);
        const variablePointY = this.staticPoint.y - this.length * Math.cos(this.angle);
        this.variablePointY = variablePointY;

        this.sk.strokeWeight(5);
        this.sk.line(this.staticPoint.x, this.staticPoint.y, variablePointX, variablePointY);
    }

    applyPhysics(cartAcceleration: number, deltaTime: number) {
        
        const gravity = 0.005; // Gravity constant

        // Calculate angular acceleration
        this.angularAcceleration = (gravity / this.length) * Math.sin(this.angle) + (cartAcceleration * -0.1 / this.length) * Math.cos(this.angle);

        // Update angular velocity and angle
        this.angularVelocity += this.angularAcceleration * deltaTime;
        this.angle += this.angularVelocity * deltaTime;

        // Apply damping to angular velocity to reduce wild swings
        this.angularVelocity *= 0.9; // Damping factor to reduce wild swings
    }

    GetYVariableVal() {
        return this.variablePointY;
    }
}
