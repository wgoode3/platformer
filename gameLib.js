
// 2D vector for a direction or a position
class Vector2D {
    constructor(x=0, y=0, theta=0) {
        this.x = x;
        this.y = y;
        this.theta = theta;
    }
}

class GameObject {
    // sprite should be a css class to apply to the game object
    // location should be a Vector2D representing where the object is located in 2D space
    // layer is the layer the objects should be drawn in (0 is applied first)
    // mass will be the basis for how newtonian forces are applied to the object
    constructor(sprite, location, layer=0, mass=1, hasCollider=true, hasPhysics=false) {
        this.sprite = sprite;
        this.location = location;
        this.layer = layer;
        this.mass = mass;
        // multiplication is less expensive so this is calculated once...
        this.inverseMass = 1/mass; 
        this.hasCollider = hasCollider;
        this.hasPhysics = hasPhysics;
        // so we can check if the object has changed to avoid re-rendering
        this.hasChanged = false;
    }

    update() {}
}


// constants that would be good to be able to change
// maxSpeed - maximum left/right speed
// terminalVelocity - maximum fall speed
// height - player height
// width - player width
// TODO - allow sprite to change
// animations: idle, running, stopped by wall

class Player extends GameObject {

    constructor(sprite, location, layer=0, mass=1, hasCollider=true, hasPhysics=false) {
        super(sprite, location, layer, mass, hasCollider, hasPhysics);
        this.vx = 0;
        this.vy = 0;
        this.forces = [];
        this.onGround = false;
    }

    // adds a force to be applied
    // force = Σ forces
    applyForce(magnitude, direction) {
        if(this.hasPhysics) {
            this.forces.push({magnitude, direction});
        }
    }

    checkCollisions(position) {

        function checkCollision(obj1, obj2) {
            let w = blockSize;
            let h = blockSize;
            var collideX = obj1.x < obj2.x + w && obj1.x + w > obj2.x;
            var collideY = obj1.y < obj2.y + h && obj1.y + h > obj2.y;
            return collideX && collideY;
        }

        let notPlayer = objects.filter(o => o.sprite !== "player");
        for(let o of notPlayer) {
            if(checkCollision(position, o.location)) {
                // if we collide return what we collded with
                return o;
            }
        }

        // otherwise return null
        return null;
    }

    // apply all forces and check for collisions
    update() {
        let newVelocity = {vx: this.vx, vy: this.vy}; 
        // resolve all forces
        while(this.forces.length > 0) {
            // F = MA ... A = F/M ... V = (F/M)*timeDelta
            let force = this.forces[this.forces.length-1];
            let fx = force.magnitude*force.direction.x;
            let fy = force.magnitude*force.direction.y;
            newVelocity.vx += (fx*this.inverseMass)*(timeDelta*0.001);
            newVelocity.vy += (fy*this.inverseMass)*(timeDelta*0.001);
            this.forces.pop();
        }
        // apply velocities to determine next position
        this.vx = newVelocity.vx;
        this.vy = newVelocity.vy;
        let newPosition = {x: this.location.x, y: this.location.y};
        // try to move left and right
        newPosition.x += this.vx * timeDelta;
        let collided_with = this.checkCollisions(newPosition);
        if(collided_with === null) {
            this.location.x = newPosition.x;
        } else {
            if(collided_with.is_trigger) {
                return collided_with.trigger();
            } else {
                // push away from the wall (pevents hanging on walls)
                newPosition.x = this.location.x;
                this.vx = -0.1 * this.vx;
                newPosition.x += this.vx * timeDelta;
            }
        }
        
        newPosition.y += this.vy * timeDelta;
        // try to move up and down
        collided_with = this.checkCollisions(newPosition);
        if(collided_with === null) {
            this.location.y = newPosition.y;
            this.onGround = false;
        } else {
            if(collided_with.is_trigger) {
                return collided_with.trigger();
            } else {
                if(this.vy > 0) {
                    this.onGround = true;
                }
                this.vy = 0;
            }
        }
        // prevent the user from going too fast
        if(this.vx > maxSpeed) {
            this.vx = maxSpeed;
        } else if(-this.vx > maxSpeed) {
            this.vx = -maxSpeed;
        }
        // this.hasChanged = false;
    }

    jump() {
        if(this.onGround) {
            this.vy -= jumpVelocity;
            this.onGround = false;
        }
    }
}

class Goal extends GameObject {
    constructor(sprite, location, layer=0, mass=1, hasCollider=true, hasPhysics=false) {
        super(sprite, location, layer, mass, hasCollider, hasPhysics);
        this.is_trigger=true;
    }
    trigger() {
        if(level === 1) {
            // set the level to world2
            setScene(WORLD2);
            drawGameboard();
            resetGame();
            level = 2;
        } else if(level === 2) {
            // set the level to world3
            setScene(WORLD3);
            drawGameboard();
            resetGame();
            level = 3;
        } else {
            // set the level to world1
            setScene(WORLD1);
            drawGameboard();
            resetGame();
            level = 1;
        }
    }
}