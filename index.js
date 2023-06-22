// create a new canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvasWidth = 800;
canvasHeight = 800;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
document.body.appendChild(canvas);

// render background image
var bckgrdReady = false;
var bckgrdImage = new Image();
bckgrdImage.onload = function () {
    bckgrdReady = true;
};
bckgrdImage.src = "images/grass_background.png";

// render main characters
var linkReady = false;
var linkSpriteSheet = new Image();
linkSpriteSheet.onload = function () {
    linkReady = true;
};
linkSpriteSheet.src = "images/link.png";

// render strawberries
var fresaRedy = false;
var fresaSpriteSheet = new Image();
fresaSpriteSheet.onload = function () {
    fresaRedy = true;
};
fresaSpriteSheet.src = "images/fresa.png";

// render snake
var snakeRedy = false;
var snakeSpriteSheet = new Image();
snakeSpriteSheet.onload = function () {
    snakeRedy = true;
};
snakeSpriteSheet.src = "images/snake.gif";

// initialization
const spriteWidth = 96; // sprite width
const spriteHeight = 100; // sprite height

// game objects
var link = {
    speed: 30,
    x: 100, // sprite on the canvas
    y: 100, // sprite index
    height: spriteHeight,
    width: spriteWidth,
    initialX: 7, // initial x position in sprite sheet
    downkeyY: 419,
    upKeyY:626,
    leftKeyY: 530,
    rightKeyY: 736,
    currentFrameIndex: 420,
    currentFrame: 1
}

var strawberry = {
    // for this version, the monster does not move, so just and x and y
    x: getRandomInt(canvasHeight - 5),
    y: getRandomInt(canvasHeight - 5)
};

var snake = {
    x: getRandomInt(canvasHeight - 5),
    y: getRandomInt(canvasHeight - 5),
    width: 80,
    height: 80
}

// get sound
const collisionSoundFresa = document.getElementById("collisionSoundFresa");
const collisionSoundDead = document.getElementById("collisionSoundDead");


var numberOfStrawberry = 0;

// Define the speed of the animation (in milliseconds)
const animationSpeed = 10000;
// keyboard events
// Define the number of frames and the current frame index
const totalFrames = 10;
let currentFrame = 1;
var then = Date.now();

addEventListener("keydown", (event) => {
    if (event.defaultPrevented)
    {
        return; // do nothing
    }

    switch (event.code) {
        case "KeyS":
        case "ArrowDown":
            // Handle "down"
            link.currentFrameIndex = link.downkeyY;
            link.y += link.speed;
            if (link.y + spriteHeight > canvas.height)
            {
                link.y = 0;
            }
            link.currentFrame = (link.currentFrame + 1) % totalFrames;
            break;
        case "KeyW":
        case "ArrowUp":
            // Handle "up"
            link.currentFrameIndex = link.upKeyY;
            link.y -= link.speed;
            if (link.y < 0)
            {
                link.y = canvas.height;
            }
            link.currentFrame = (link.currentFrame + 1) % totalFrames;
            break;
        case "KeyA":
        case "ArrowLeft":
            // Handle "left"
            link.currentFrameIndex = link.leftKeyY;
            link.x -= link.speed;
            if (link.x < 0)
            {
                link.x = canvas.width;
            }
            link.currentFrame = (link.currentFrame + 1) % totalFrames;
            break;
        case "KeyD":
        case "ArrowRight":
            // Handle "right"
            link.currentFrameIndex = link.rightKeyY;
            link.x += link.speed;
            if (link.x + spriteWidth > canvas.width)
            {
                link.x = 0;
            }
            link.currentFrame = (link.currentFrame + 1) % totalFrames;
            break;
        case " ":
        case "Enter":
            console.log("Entered");
            then = Date.now();
            main();  
            break;
    }

    if (
        (link.x + spriteWidth) >= (snake.x + 20)
        && (link.y + spriteHeight) >= (snake.y + 20)
        && link.x <= (snake.x + 20) && link.y <= (snake.y + 20)
    ) {
        console.log("collision detected");
        collisionSoundDead.play();
        reset();
        endGame();
    }

    if (
        (link.x + spriteWidth) >= (strawberry.x)
        && (link.y + spriteHeight) >= (strawberry.y)
        && link.x <= (strawberry.x + 20) && link.y <= (strawberry.y + 20)
    ) {
        ++numberOfStrawberry;       // keep number of strawberries
        collisionSoundFresa.play();
        renderStrawberry();       // start a new cycle
    }

    updateLinkPosition();
});

// Update the animation frame
function updateLinkPosition() {
    const frameX = link.currentFrame * spriteWidth;
    const frameY = link.currentFrameIndex;
  
    // Draw the current frame onto the canvas at the updated position
    ctx.drawImage(linkSpriteSheet, frameX, frameY, link.width, link.height, link.x, link.y, link.width, link.height);
}

function renderStrawberry()
{
    strawberry.x = getRandomInt(canvasHeight - 10);
    strawberry.y = getRandomInt(canvasHeight - 10);
    console.log('rendering strawberry...');
    ctx.drawImage(fresaSpriteSheet, strawberry.x, strawberry.y);
}

function renderSnake(timestamp, forceUpdate)
{
    const deltaTime = timestamp - then;
    if (deltaTime > animationSpeed || forceUpdate)
    {
        snake.x = getRandomInt(canvasHeight - 10);
        snake.y = getRandomInt(canvasHeight - 10);
        console.log('rendering snake...');
        ctx.drawImage(snakeSpriteSheet, snake.x, snake.y, snake.width, snake.height);

        then = timestamp;
    }
}

var main = function () {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var now = Date.now();
    render();

    renderSnake(now);
    requestAnimationFrame(main);

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Strawberry count: " + numberOfStrawberry, 32, 32);
};

var render = function () {
    if (bckgrdReady) {
        ctx.drawImage(bckgrdImage, 0, 0);
    }
    if (linkReady)
    {
        updateLinkPosition();
    }
    if (fresaRedy)
    {
        ctx.drawImage(fresaSpriteSheet, strawberry.x, strawberry.y);
    }

    if (snakeRedy)
    {
        ctx.drawImage(snakeSpriteSheet, snake.x, snake.y, snake.width, snake.height);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var reset = function () {
    renderSnake(Date.now, true);
    render();
    numberOfStrawberry = 0;
    reset();
}

var endGame = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bckgrdImage, 0, 0);
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    // Calculate the position to center the text on the canvas
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
  
    // Render the "Game Over" text on the canvas
    ctx.fillText("Game Over", textX, textY);
    ctx.fillText("Press Enter to Restart", textX, textY +  90);
    requestAnimationFrame(endGame);
}

// call the main game loop.
var titleScreen = function() {
    ctx.drawImage(bckgrdImage, 0, 0);

    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
  
    // Render the "Game Over" text on the canvas
    ctx.fillText("Press Enter to Start", textX, textY);
    requestAnimationFrame(titleScreen);
}


titleScreen();
