//Game loop logic
let loop = (() => {
    let ctx;
    let ball;
    let paddles;
    let playerScore = 0;
    let opponentScore = 0;

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
        if (ball.y + ball.r >= p.y && ball.y - ball.r <= p.y + p.height) {
            if (ball.x >= (p.x - p.width) && p.x > 0) {
                //These determine whether vx/vy is a positive or negative number
                let vyConditional = ball.vy < 0;
                ball.vy = Math.abs(ball.vy) + 0.1;
                if(vyConditional){
                    ball.vy *= - 1;
                }
                return true;
            } else if (ball.x <= p.width && p.x === 0) {
                //These determine whether vx/vy is a positive or negative number
                let vyConditional = ball.vy < 0;
                ball.vy = Math.abs(ball.vy) + 0.1;
                if(vyConditional){
                    ball.vy *= - 1;
                }
                return true;
            }
        }
        return false;
    }

    // Update
    function update() {
        // Move the paddles on mouse move
        if (mouse.x && mouse.y) {
            paddles[0].y = mouse.y - paddles[1].height / 2;
            // for (let i = 0; i < paddles.length; i++) {
            //     let p = paddles[i];
            //     p.y = mouse.y - p.height/2;
            // }
        }
        // Move the ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        //Collision with paddles
        let p1 = paddles[0];
        let p2 = paddles[1];
        p2.followBall(ball);
        if (collides(p1)) {
            ball.vx = -(ball.vx + 0.1);
        } else if (collides(p2)) {
            ball.vx = -(ball.vx - 0.1);
        } else {
            // Collide with walls if the ball hits the top/bottom, respawn ball
            if (ball.x + ball.r >= width) {
                ball.x = width - ball.r;
                opponentScore++;
                ball.spawnBall();
            } else if (ball.x <= 0) {
                ball.x = ball.r;
                playerScore++;
                ball.spawnBall();
            }

            if (ball.y + ball.r >= height) {
                ball.vy = -(ball.vy + 0.1);
                ball.y = height - ball.r;
            } else if (ball.y - ball.r <= 0) {
                ball.vy = -(ball.vy - 0.1);
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
        ctx.font = "40pt Arial";
        ctx.fillText(`${opponentScore} : ${playerScore}`, width / 2 - 60, 50);
        update();
        ball.draw();
    }

    return {defineContext, definePaddles, defineBall, animLoop, paintCanvas}
})();