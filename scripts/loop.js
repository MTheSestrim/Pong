//Game loop logic
let loop = (() => {
        let ctx;
        let ball;
        let paddles = [];
        let playerScore = 0;
        let opponentScore = 0;
        let loopRunning = false;
        let gameStarted = false;

        // Sets gameStarted to true so we know that the player has started the game
        function setGameStart() {
            gameStarted = true;
        }

        function gameIsStarted() {
            return gameStarted;
        }

        //Lets us know the loop is running
        function loopIsRunning() {
            return loopRunning;
        }

        function setLoopState(state) {
            loopRunning = state;
        }

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

        function definePlayer(player) {
            //Player paddle is 0, Enemy Paddle is 1
            if (player) {
                paddles.length = 0;
                paddles.push(new Paddle("left"));
                paddles.push(new EnemyPaddle("right", 4.5));
            } else {
                paddles.length = 0;
                paddles.push(new Paddle("right"));
                paddles.push(new EnemyPaddle("left", 4.5));
            }
        }

        function restartGame(exit) {
            // Cancels animation so changes can be made
            cancelRequestAnimFrame(init);

            // Sets everything to base state
            ctx.clearRect(0, 0, width, height);
            ball = {
                x: width / 2, y: height / 2, r: 5, c: "white", vx: 2, vy: 2, draw: function () {
                    ctx.beginPath();
                    ctx.fillStyle = this.c;
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                    ctx.fill();
                },
                spawnBall: function () {
                    ball.x = width / 2;
                    ball.y = height / 2;
                    ball.vx = 2;
                    ball.vy = 2;
                    ball.draw();
                }
            };
            paddles[0].y = height/2 - paddles[0].height/2;
            paddles[1].y = height/2 - paddles[1].height/2;

            if(!exit) {
                // Starts loop again if restart button is pressed
                animLoop();
            }
        }

        function animLoop() {
            init = requestAnimationFrame(animLoop);
            loop.setLoopState(true);
            draw();
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
                    if (vyConditional) {
                        ball.vy *= -1;
                    }
                    return true;
                } else if (ball.x <= p.width && p.x === 0) {
                    //These determine whether vx/vy is a positive or negative number
                    let vyConditional = ball.vy < 0;
                    ball.vy = Math.abs(ball.vy) + 0.1;
                    if (vyConditional) {
                        ball.vy *= -1;
                    }
                    return true;
                }
            }
            return false;
        }

        // Update
        function update() {
            // Move the paddle on mouse move
            if (mouse.x && mouse.y) {
                paddles[0].y = mouse.y - paddles[0].height / 2;
            }
            // Move the ball
            ball.x += ball.vx;
            ball.y += ball.vy;

            //Collision with paddles
            let p1 = paddles[0];
            let p2 = paddles[1];
            paddles[1].followBall(ball);
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
            ctx.fillRect(width / 2 + 90, 5, 10, 50);
            ctx.fillRect(width / 2 + 110, 5, 10, 50);
            ctx.fillText("\u21BB", width / 2 + 150, 50);
            ctx.fillText("\u2715", width / 2 + 220, 50);
            update();
            ball.draw();
        }

        return {
            gameIsStarted, setGameStart, setLoopState, loopIsRunning, defineContext, definePaddles, defineBall,
            definePlayer, restartGame, animLoop, paintCanvas
        }
    }

)();