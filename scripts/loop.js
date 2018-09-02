//Game loop logic
let loop = (() => {
        let ctx;
        let ball;
        let paddles = [];
        let playerScore = 0;
        let opponentScore = 0;
        let particles = [];
        let loopRunning = false;
        let gameStarted = false;
        let difficulty = "normal";

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

        function setDifficulty(diff) {
            difficulty = diff;
            // Sets difficulty for enemy paddle so AI can adapt
            paddles[1].difficulty = diff;
        }

        //Defined here because the variables can't update fast enough/get lost in transition
        function defineContext(context) {
            ctx = context;
        }

        function defineBall(b) {
            ball = b;
        }

        function definePlayer(player) {
            //Player paddle is 0, Enemy Paddle is 1
            if (player) {
                paddles.length = 0;
                paddles.push(new Paddle("left"));
                paddles.push(new EnemyPaddle("right",difficulty));
            } else {
                paddles.length = 0;
                paddles.push(new Paddle("right"));
                paddles.push(new EnemyPaddle("left", difficulty));
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
                    this.x = width / 2;
                    this.y = height / 2;
                    this.vx = 2;
                    this.vy = 2;
                    this.draw();
                }
            };
            paddles[0].y = height/2 - paddles[0].height/2;
            paddles[1].y = height/2 - paddles[1].height/2;
            opponentScore = 0;
            playerScore = 0;

            if(!exit) {
                // Starts loop again if restart button is pressed
                ball.spawnBall();
                animLoop();
            } else {
                gameStarted = false;
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
            //Create invisible ball for AI to follow. Its position is slightly modified so as to make it act more human.
            let invisibleBall = $.extend({}, ball);
            switch (difficulty){
                case "easy":
                    invisibleBall.y += 1.5;
                    break;
                case "normal":
                    invisibleBall.y += 1;
                    break;
                case "hard":
                    invisibleBall.y += 0.3;
                    break;
            }
            paddles[1].followBall(invisibleBall);

            if (collides(p1)) {
                increaseBallVelocity();
                // Pushes particles in array
                for (let i = 0; i < 20; i++) {
                    particles.push(new Particle(ball.x - ball.r, ball.y, -1));
                }
            } else if (collides(p2)) {
                increaseBallVelocity();
                for (let i = 0; i < 20; i++) {
                    // Pushes particles in array
                    particles.push(new Particle(ball.x + ball.r, ball.y, 1));
                }
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

            emitParticles();
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
        
        function emitParticles() {
            // Animates each particle
            for (let i = 0; i < particles.length; i++) {
                let par = particles[i];

                ctx.beginPath();
                ctx.fillStyle = "white";
                // Doesn't animate particles which have died
                if(par.radius > 0) {
                    ctx.arc(par.x, par.y, par.radius, 0, Math.PI * 2, false);
                }
                ctx.fill();

                par.x += par.vx;
                par.y += par.vy;

                // Reduce radius so that the particles die after a few seconds
                par.radius = Math.max(par.radius - 0.05, 0.0);
            }
            //Doesn't keep any useless particles
            particles = particles.filter(p => p.radius > 0);
        }

        function increaseBallVelocity() {
            //Increases velocity and changes speed accordingly on paddle hit
            if(ball.vx < 0){
                ball.vx = -(ball.vx - 0.2);
            } else {
                ball.vx = -(ball.vx + 0.2);
            }
        }

        return {
            gameIsStarted, setGameStart, setLoopState, setDifficulty, loopIsRunning, defineContext, defineBall,
            definePlayer, restartGame, animLoop, paintCanvas
        }
    }

)();