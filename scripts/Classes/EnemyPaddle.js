class EnemyPaddle extends Paddle {
    constructor(pos, difficulty) {
        super(pos);
        this.difficulty = difficulty;
    }

    get speed() {
        return this._speed;
    }

    set difficulty(difficulty) {
        this._difficulty = difficulty;
        switch (difficulty){
            case "easy":
                this._speed = 2;
                break;
            case "normal":
                this._speed = 3.5;
                break;
            case "hard":
                this._speed = 5;
                break;
        }
    }
    followBall(ball) {
        if (ball.y + ball.r >= this.y + this.height / 2) {
            this.moveDown();
        } else if (ball.y + ball.r <= this.y + this.height / 2) {
            this.moveUp();
        }
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }
}