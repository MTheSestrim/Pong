//Run
$(() => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    let ball = {}, paddles = [];
    ball = {x: width/2, y: height/2, r: 5, c: "white", vx: 2, vy: 2, draw: function () {
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
    loop.defineContext(ctx);
    loop.defineBall(ball);
    loop.definePaddles(paddles);

    constructStartMenu();
    canvas.addEventListener("mousemove", trackPosition, true);

    function trackPosition(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    }
    // Execution
    loop.definePlayer(0);
    canvas.addEventListener("mouseup", () => {
        // Define mouseup events in-game (otherwise they work in menu)
        if(loop.gameIsStarted()) {
            if (mouse.x > width / 2 + 90 && mouse.x < width / 2 + 120 && mouse.y > 5 && mouse.y < 55) {
                //Checks if loop is running and pauses, otherwise starts loop again
                if (loop.loopIsRunning()) {
                    cancelRequestAnimFrame(init);
                    ctx.fillStyle = "black";
                    ctx.fillRect(width / 2 + 90, 5, 10, 50);
                    ctx.fillRect(width / 2 + 110, 5, 10, 50);
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.moveTo(width / 2 + 120, 30);
                    ctx.lineTo(width / 2 + 90, 5);
                    ctx.lineTo(width / 2 + 90, 55);
                    ctx.fill();
                    loop.setLoopState(false);
                } else {
                    ctx.fillStyle = "black";
                    ctx.fillRect(width / 2 + 90, 5, 10, 50);
                    ctx.fillRect(width / 2 + 110, 5, 10, 50);
                    loop.animLoop();
                }
            }
            if(mouse.x > width / 2 + 150 && mouse.x < width / 2 + 190 && mouse.y > 20 && mouse.y < 50){
                loop.restartGame();
            }

            if(mouse.x > width / 2 + 220 && mouse.x < width / 2 + 260 && mouse.y > 10 && mouse.y < 50){
                cancelAnimationFrame(init);
                loop.restartGame(true);
                constructStartMenu();
            }
        } else {
            if(mouse.x > width / 4 && mouse.x < width * 0.75 && mouse.y > height / 4 && mouse.y < height * 0.75){
                loop.setGameStart();
                loop.animLoop();
            }
            if(mouse.x > width / 4 && mouse.x < width / 4 + 50 && mouse.y > height / 16 - 15 && mouse.y < height / 16 + 35){
                loop.definePlayer(0);
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.fillRect(width / 4, height / 16 - 15, 50, 50);
                ctx.fillStyle = "black";
                ctx.fillRect(width / 4, height / 8, 50, 50);
                ctx.fillStyle = "white";
                ctx.rect(width / 4, height / 8, 50, 50);
                ctx.stroke();
            }
            else if(mouse.x > width / 4 && mouse.x < width / 4  + 50 && mouse.y > height / 8 && mouse.y < height / 8 + 50){
                loop.definePlayer(1);
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.fillRect(width / 4, height / 8, 50, 50);
                ctx.fillStyle = "black";
                ctx.fillRect(width / 4, height / 16 - 15, 50, 50);
                ctx.fillStyle = "white";
                ctx.rect(width / 4, height / 16 - 15, 50, 50);
                ctx.stroke();
            }
        }
    }, false);


    function constructStartMenu() {
        // Construction logic
        loop.paintCanvas();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.font = "40pt Arial";
        ctx.fillRect(width / 4, height / 16 - 15, 50, 50);
        ctx.fillText("Player 1 (Right)", width / 3 - 20, height / 11);
        ctx.rect(width / 4, height / 8, 50, 50);
        ctx.fillText("Player 2 (Left)", width / 3 - 20, height / 6);
        ctx.rect(width / 4, height / 4, width / 2, height / 2);
        ctx.stroke();
        ctx.font = "80pt Arial";
        ctx.fillText("Start Game", width / 3, height / 1.9);
    }
});
