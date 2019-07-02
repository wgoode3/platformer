// all the game constants here for easy tweaking...

let jumpVelocity = 0.8,
     playerStart = { x: 32, y: 512 },
        maxSpeed = 0.5,
       blockSize = 32,
        friction = 2.5,
         gravity = 2.5,
       moveForce = 1.5,
       targetFPS = 60,
 targetFrameTime = 1/targetFPS*1000;

playerStart.y -= 8;