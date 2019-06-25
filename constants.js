// Place all the game constants here for easy tweaking...

let   jumpVelocity = 0.8,
       playerStart = { x: 32, y: 32 },
          maxSpeed = 0.3,
  terminalVelocity = 2.0,
         blockSize = 32,
          friction = 0.5,
           gravity = 2.5,
         moveForce = 1.0,
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