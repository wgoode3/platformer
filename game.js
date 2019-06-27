// various game constants
const game = document.getElementById("game");
let objects = [];
let timeDelta = targetRefreshRate;
let currentTime = new Date();
let level = 1;

let playerIndex; 
// create a list of game objects
function setScene(level) {
    objects = [];
    for(let i=0; i<level.length; i++) {
        for(let j=0; j<level[i].length; j++) {
            if(level[i][j] === "1") {
                objects.push(
                    new GameObject("block", new Vector2D(j*blockSize, i*blockSize))
                );
            } else if(level[i][j] === "2") {
                objects.push(
                    new Goal("goal", new Vector2D(j*blockSize, i*blockSize))
                );
            }
        }
    }
    playerIndex = objects.length;
    // let's add in the player as well
    objects.push(
        new Player("player", new Vector2D(playerStart.x, playerStart.y), 1, 1, true, true)
    );
}

function drawGameboard() {
    let s = "";
    for(let i=0; i<objects.length; i++) {
        let o = objects[i];
        s += `<div id="${i}" `;
        s += `class="${o.sprite}" `;
        s += `style="left:${o.location.x}px;top:${o.location.y}px;">`;
        s += `</div>`;
    }
    game.innerHTML = s;
}

// player is a class controlled by user input
// we provide all of the forces on the player component here
function movePlayer(){
    let player = objects[playerIndex];
    // apply forces when the user moves left and right
    // ignore up and down inputs
    player.applyForce(moveForce, new Vector2D(axis.x, 0));
    // apply gravity
    player.applyForce(gravity, new Vector2D(0, 1));
    // if the player is jumping call the jump method
    if(keyMap.jump) {
        player.jump();
    }
    // apply friction
    if(player.onGround) {
        if(player.vx > 0) {
            player.applyForce(friction, new Vector2D(-1, 0));
        } else if(player.vx < 0) {
            player.applyForce(friction, new Vector2D(1, 0));
        }
    }
    // the player always has forces applied
    player.hasChanged = true;
}

function applyUpdates() {
    for(let i=0; i<objects.length; i++) {
        if(objects[i].hasChanged) {
            let ele = document.getElementById(`${i}`);
            objects[i].update();
            ele.style.top = `${objects[i].location.y}px`;
            ele.style.left = `${objects[i].location.x}px`;
        }
    }
}

const windowWidth = 1200;
function camera() {
    let player = document.getElementById(`${playerIndex}`);
    let rect = player.getBoundingClientRect();
    let gamewindow = document.getElementById("game");
    if(rect.right < window.innerWidth * 0.45) {
        gamewindow.scrollLeft -= 2;
    }
    if(rect.left > window.innerWidth * 0.45) {
        gamewindow.scrollLeft += 2;
    }
    if(rect.top > 3000) {
        resetGame();
    }
}

// // resets the game
// document.getElementById("reset").addEventListener("click", function(e) {
//     // makes the button lose focus so space doesn't reclick it
//     e.target.blur(); 
//     resetGame();
// });

function resetGame() {
    let player = objects[playerIndex];
    player.location = new Vector2D(playerStart.x, playerStart.y);
    player.vx = 0;
    player.vy = 0;
    player.hasChanged = true;
    document.getElementById("game").scrollLeft = 0;
}

// startup
setScene(WORLD1);
drawGameboard();

const gameLoop = setInterval(function(){

    // calculate timeDelta
    let now = new Date();
    timeDelta = now - currentTime;
    currentTime = now;

    // work out what direction the user is trying to move the user
    setAxis();

    // move the user
    movePlayer();
    
    // move the camera
    camera();

    // change positions for things that have been moved
    applyUpdates();

}, targetRefreshRate);