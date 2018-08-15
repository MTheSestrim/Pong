// Paddles
class Paddle {
    constructor(pos) {
        this.width = 5;
        this.height = 150;
        this.x = (pos === "left") ? 0 : width - this.width;
        this.y = height/2 - this.height/2;
    }
}