// create a new canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
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

// initialization
const spriteWidth = 96; // sprite width
const spriteHeight = 100; // sprite height

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
    x: getRandomInt(1000),
    y: getRandomInt(1000)
};

var numberOfStrawberry = 0;

// Define the speed of the animation (in milliseconds)
const animationSpeed = 100;
// keyboard events
// Define the number of frames and the current frame index
const totalFrames = 10;
let currentFrame = 1;

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
          link.currentFrame = (link.currentFrame + 1) % totalFrames;
          break;
        case "KeyW":
        case "ArrowUp":
          // Handle "up"
          link.currentFrameIndex = link.upKeyY;
          link.y -= link.speed;
          link.currentFrame = (link.currentFrame + 1) % totalFrames;
          break;
        case "KeyA":
        case "ArrowLeft":
          // Handle "left"
          link.currentFrameIndex = link.leftKeyY;
          link.x -= link.speed;
          link.currentFrame = (link.currentFrame + 1) % totalFrames;
          break;
        case "KeyD":
        case "ArrowRight":
          // Handle "right"
          link.currentFrameIndex = link.rightKeyY;
          link.x += link.speed;
          link.currentFrame = (link.currentFrame + 1) % totalFrames;
          break;
    }

    var right = link.x + spriteWidth;
    var down = link.y + spriteHeight;
    console.log("right: " + right + "fresa x: " + strawberry.x + "down: " + down + "fresa y:" + strawberry.y)
    if (
        (link.x >= (strawberry.x)
        && (link.y >= (strawberry.y)
        && link.x <= strawberry.x && link.y <= strawberry.y
    ) {
        ++numberOfStrawberry;       // keep number of strawberries
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
    strawberry.x = getRandomInt(1000);
    strawberry.y = getRandomInt(1000);
    console.log('rendering strawberry...');
    ctx.drawImage(fresaSpriteSheet, strawberry.x, strawberry.y);
}

var main = function () {  
    var now = Date.now();
    render();
    then = now;
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
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var then = Date.now();
//reset();
main();  // call the main game loop.
