//Run
$(() => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    let particles = [], ball = {}, paddles = [];
    ball = {x: width/2, y: height/2, r: 5, c: "white", vx: 4, vy: 4, draw: function () {
            ctx.beginPath();
            ctx.fillStyle = this.c;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.fill();
        }};
    paddles.push(new Paddle("right"));
    paddles.push(new EnemyPaddle("left", 4.5));
    loop.defineContext(ctx);
    loop.defineBall(ball);
    loop.definePaddles(paddles);

    // Construction logic
    loop.paintCanvas();
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(width / 4, height / 4, width / 2, height / 2);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = "80pt Arial";
    ctx.fillText("Start Game", width / 3, height / 1.9);
    canvas.addEventListener("mousemove", trackPosition, true);

    function trackPosition(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    }
    // Execution

    canvas.addEventListener("mouseup", () => {
        if(mouse.x > width / 4 && mouse.x < width * 0.75 && mouse.y > height / 4 && mouse.y < height * 0.75){
            loop.animLoop();
        }
    }, false);
});
