//Run
$(() => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    let particles = [], ball = {}, paddles = [];
    ball = {x: width/2, y: height/2, r: 5, c: "white", vx: 8, vy: 4, draw: function () {
            ctx.beginPath();
            ctx.fillStyle = this.c;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.fill();
        }};
    paddles.push(new Paddle("right"));
    paddles.push(new EnemyPaddle("left", 3.9));
    loop.defineContext(ctx);
    loop.defineBall(ball);
    loop.definePaddles(paddles);

    // Construction logic
    loop.paintCanvas();
    canvas.addEventListener("mousemove", trackPosition, true);

    function trackPosition(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    }
    // Execution
    loop.animLoop();
});
