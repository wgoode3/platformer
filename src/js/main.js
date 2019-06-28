// various game constants
// TODO: migrate as many of these to constants.js as makes sense
const game = document.getElementById("game");
let objects = [];
let timeDelta = targetFrameTime;
let currentTime = new Date();
let level = 1;
let playerIndex;


// create a list of game objects
function setScene(level) {
    objects = [];
    for(let i=0; i<level.length; i++) {
        for(let j=0; j<level[i].length; j++) {
            // blocks are 1
            if(level[i][j] === "1") {
                objects.push(
                    new GameObject("block", new Vector2D(j*blockSize, i*blockSize))
                );
            } 
            // the goal is 2
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
    // apply gravity
    player.applyForce(gravity, new Vector2D(0, 1));
    // if the player is jumping call the jump method
    // TODO: maybe some sort of jump cooldown?
    // currently jumps constantly when spacebar is held down
    if(keyMap.jump) {
        player.jump();
    }
    // apply friction when player stops moving and is on the ground
    // TODO: detect player movement that is oscillating back and forth
    //       when keys are not depressed, and zero it out
    //       or put in constants that dampen these forces
    //       spring, mass, dashpot system time?
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
// actually scrolls the #game div to the left or right
// to keep the player on screen
const windowWidth = 1200;
function camera() {
    let player = document.getElementById(`${playerIndex}`);
    let rect = player.getBoundingClientRect();
    let gamewindow = document.getElementById("game");
    let cutoff = window.innerWidth * 0.45
    if(rect.left > cutoff) {
        gamewindow.scrollLeft += (rect.left - cutoff);
    } 
    else if(rect.right < cutoff && gamewindow.scrollLeft > 600) {
        gamewindow.scrollLeft -= (cutoff - rect.right);
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
    document.getElementById("game").scrollLeft = 0;
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

    // console.log(objects[playerIndex].vx);

}, targetFrameTime);