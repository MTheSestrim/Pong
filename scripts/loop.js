//Game loop logic
let loop = (() => {
    let ctx;
    let ball;
    let paddles;

    //Defined here because the variables can't update fast enough/get lost in transition
    function defineContext(context) {
        ctx = context;
    }

    function defineBall(b) {
        ball = b;
    }

    function definePaddles(p) {
        paddles = p;
    }

    function animLoop() {
        init = requestAnimationFrame(animLoop);
        draw(paddles);
    }

    function paintCanvas() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
    }

    function collides(p) {
        if(ball.y + ball.r >= p.y && ball.y - ball.r <= p.y + p.height){
            if(ball.x >= (p.x - p.width) && p.x > 0){
                return true;
            } else if(ball.x <= p.width && p.x === 0){
                return true;
            }
        }
        return false;
    }

    // Update
    function update() {
        // Move the paddles on mouse move
        if(mouse.x && mouse.y){
            for (let i = 0; i < paddles.length; i++) {
                let p = paddles[i];
                p.y = mouse.y - p.height/2;
            }
        }
        // Move the ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        //Collision with paddles
        let p1 = paddles[0];
        let p2 = paddles[1];
        if(collides(p1)){
            ball.vx = - ball.vx;
        } else if(collides(p2)){
            ball.vx = - ball.vx;
        } else {
            // Collide with walls if the ball hits the top/bottom, run gameOver() function
            if(ball.x + ball.r >= width){
                ball.x  = width - ball.r;
                gameOver();
            } else if(ball.x <= 0){
                ball.x = ball.r;
                gameOver();
            }

            if(ball.y + ball.r >= height) {
                ball.vy = -ball.vy;
                ball.y = height - ball.r;
            } else if (ball.y - ball.r <= 0) {
                ball.vy = -ball.vy;
                ball.y = ball.r;
            }
        }
    }

    //Draw
    function draw() {
        paintCanvas();
        for (let i = 0; i < paddles.length; i++) {
            let p = paddles[i];

            ctx.fillStyle = "white";
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
        update();
        ball.draw();
    }

    function gameOver() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", width/2, height/2 + 25);

        //Stop the animation
        cancelRequestAnimFrame(init);
    }

    return {defineContext, definePaddles, defineBall, animLoop, paintCanvas}
})();