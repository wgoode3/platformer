// player controls

const upKey    = 38,
      downKey  = 40,
      leftKey  = 37, 
      rightKey = 39, 
      jumpKey  = 32;


const keyMap = {
    'up':    false,
    'left':  false,
    'down':  false,
    'right': false,
    'jump':  false
};

const axis = {
    x: 0,
    y: 0
};

document.onkeydown = function(a){
    if (a.keyCode == leftKey) {
        keyMap.left = true;
    }
    if (a.keyCode == rightKey) {
        keyMap.right = true;
    } 
    if (a.keyCode == upKey) {
        keyMap.up = true;
    }
    if (a.keyCode == downKey) {
        keyMap.down = true;
    }
    if (a.keyCode == jumpKey) {
        keyMap.jump = true;
    }
}

document.onkeyup = function(a){
    if (a.keyCode == leftKey) {
        keyMap.left = false;
    }
    if (a.keyCode == rightKey) {
        keyMap.right = false;
    } 
    if (a.keyCode == upKey) {
        keyMap.up = false;
    }
    if (a.keyCode == downKey) {
        keyMap.down = false;
    }
    if (a.keyCode == jumpKey) {
        keyMap.jump = false;
    }
}

function setAxis() {
    axis.x = 0;
    axis.y = 0;
    if(keyMap.up){
        axis.y--;
    }
    if(keyMap.down){
        axis.y++;
    }
    if(keyMap.left){
        axis.x--;
    }
    if(keyMap.right){
        axis.x++;
    }
}