// various game constants
// TODO: migrate as many of these to constants.js as makes sense
const game = document.getElementById("game");
let objects = [];
let timeDelta = targetFrameTime;
let currentTime = new Date();
let level = 1;
let playerIndex;


// what class to apply for each tile value 
const tileMap = {
    "1": "grass-mid",
    "2": "goal",
    "3": "grass-left",
    "4": "grass-right",
    "5": "grass-center"
};


// create a list of game objects
function setScene(level) {
    objects = [];
    for(let i=0; i<level.length; i++) {
        for(let j=0; j<level[i].length; j++) {
            // check tileMap for the correct class to apply, goal is different so handle seperately
            if (level[i][j] !== " " && level[i][j] !== "2") {
                objects.push(
                    new GameObject(tileMap[level[i][j]], new Vector2D(j*blockSize, i*blockSize))
                );
            }
            // goal is a different class than the others...
            else if(level[i][j] === "2") {
                objects.push(
                    new Goal("goal", new Vector2D(j*blockSize, i*blockSize))
                );
            }
        }
    }
    // player will always be the last object added, for convenience
    // also it ensures the player is rendered on top of everything else
    playerIndex = objects.length;
    objects.push(
        new Player("player", new Vector2D(playerStart.x, playerStart.y), 1, 1, true, true)
    );
}


// draw all of the game objects into <div id="game"></div>
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


// TODO: consider moving this into the Player class
// player is a class controlled by user input
// we provide all of the forces on the player component here
function movePlayer(){
    let player = objects[playerIndex];
    
    // apply forces when the user moves left and right
    // ignore up and down inputs
    player.applyForce(moveForce, new Vector2D(axis.x, 0));

    if(player.vx === 0){
        document.getElementById(`${playerIndex}`).classList.remove("move");
    } else {
        document.getElementById(`${playerIndex}`).classList.add("move");
    }

    if(axis.x === 1){
        document.getElementById(`${playerIndex}`).classList.remove("left");
    } 
    else if(axis.x === -1) {
        document.getElementById(`${playerIndex}`).classList.add("left");
    }
    
    // apply gravity
    player.applyForce(gravity, new Vector2D(0, 1));
    
    // if the player is jumping call the jump method
    // TODO: maybe some sort of jump cooldown?
    // currently jumps constantly when spacebar is held down
    if(keyMap.jump) {
        player.jump();
    }
    
    // apply friction when player stops moving and is on the ground
    if(player.onGround && axis.x === 0) {
        if(player.vx > 0) {
            player.applyForce(friction, new Vector2D(-1, 0));
        } else if(player.vx < 0) {
            player.applyForce(friction, new Vector2D(1, 0));
        }
    }
    
    // the player always has forces applied
    player.hasChanged = true;
}


// all objects that .hasChanged should have their positions updated
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


// have the "camera" follow the player around
// actually scrolls the #game div to the left or right to keep player on screen
let start = 0;
const windowWidth = 1200;
function camera() {
    let rect = document.getElementById(`${playerIndex}`).getBoundingClientRect();
    let cutoff = window.innerWidth * 0.45;
    if(rect.left > cutoff) {
        game.scrollLeft += (rect.left - cutoff);
        // document.getElementsByTagName("BODY")[0].style.backgroundPosition = `${start--}px 0px`;
    } 
    else if(rect.right < cutoff) {
        game.scrollLeft -= (cutoff - rect.right);
        // document.getElementsByTagName("BODY")[0].style.backgroundPosition = `${start++}px 0px`;
    }

    // if the player falls off the platform, return them to the start
    if(rect.top > 3000) {
        resetGame();
    }
}


// return the player to the beginning position
// also zero out their velocity
// also scroll back to the start
function resetGame() {
    let player = objects[playerIndex];
    player.location = new Vector2D(playerStart.x, playerStart.y);
    player.vx = 0;
    player.vy = 0;
    player.hasChanged = true;
    game.scrollLeft = 0;
}


// on page load set the game to world1
// then draw out all of the blocks into the #game div
setScene(WORLD1);
drawGameboard();


// the gameloop will call functions that need to run every frame
// the gameloop will run every "targetRefreshRate" milliseconds
let gameLoop = setInterval( function() {

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

}, targetFrameTime);