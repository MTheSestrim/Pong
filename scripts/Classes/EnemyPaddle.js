class EnemyPaddle extends Paddle {
    constructor(pos, speed) {
       super(pos);
       this._speed = speed;
    }

    get speed() {
        return this._speed;
    }

    followBall(ball) {
        if(ball.y  + ball.r >= this.y){
            this.moveDown();
        } else if(ball.y  + ball.r <= this.y){
            this.moveUp();
        }
    }

    moveUp(){
        this.y -= this.speed;
    }

    moveDown(){
        this.y += this.speed;
    }
}