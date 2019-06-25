// Place all the game constants here for easy tweaking...

let   jumpVelocity = 0.8,
       playerStart = { x: 32, y: 32 },
          maxSpeed = 0.5,
  terminalVelocity = 2.0,
         blockSize = 32,
          friction = 0.75,
           gravity = 2.5,
         moveForce = 1.5,
         targetFPS = 60,
 targetRefreshRate = 1/targetFPS;

document.getElementById("toggle").addEventListener("click", function(e) {
    // makes the button lose focus so space doesn't reclick it
    e.target.blur(); 
    let debug = document.getElementById("debug");
    if(debug.style.visibility === "hidden") {
        debug.style.visibility = "visible";
    } else {
        debug.style.visibility = "hidden";
    }
});

document.getElementById("jumpVelocity").addEventListener("change", function(e) {
     jumpVelocity = e.target.value;
 });

document.getElementById("gravity").addEventListener("change", function(e) {
    gravity = e.target.value;
});

document.getElementById("maxSpeed").addEventListener("change", function(e) {
    maxSpeed = e.target.value;
});

document.getElementById("moveForce").addEventListener("change", function(e) {
    moveForce = e.target.value;
});

document.getElementById("friction").addEventListener("change", function(e) {
    friction = e.target.value;
});