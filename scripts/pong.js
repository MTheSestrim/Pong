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
    canvas.addEventListener("mousemove", trackPosition, true);

    function trackPosition(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    }
    // Execution
    loop.definePlayer(0);
    canvas.addEventListener("mouseup", () => {
        if(mouse.x > width / 4 && mouse.x < width * 0.75 && mouse.y > height / 4 && mouse.y < height * 0.75){
            loop.animLoop();
        }
        if(mouse.x > width / 4 && mouse.x < width / 4 + 50 && mouse.y > height / 16 - 15 && mouse.y < height / 16 + 35){
            loop.definePlayer(0);
        }
        else if(mouse.x > width / 4 && mouse.x < width / 4  + 50 && mouse.y > height / 8 && mouse.y < height / 8 + 50){
            loop.definePlayer(1);
        }
    }, false);
});
