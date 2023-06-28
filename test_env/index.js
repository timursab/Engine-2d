const ctx = document.querySelector('canvas').getContext('2d');
class Particle {
    constructor(x,y,r){
        this.x = x
        this.y = y
        this.r = r
        this.oldX = x
        this.oldY = y
        this.accellerationX = 0
        this.accellerationY = 0
    }
    update(){
        let velX = (this.x - this.oldX)*0.99
        let velY = (this.y - this.oldY)*0.99
        this.oldX = this.x
        this.oldY = this.y
        this.x += velX + this.accellerationX
        this.y += velY + this.accellerationY
        this.accellerationX = 0
        this.accellerationY = 0
        this.applyConstraints()
    }
    applyConstraints() {
        const minX = 0;
        const minY = 0;
        const maxX = ctx.canvas.width;
        const maxY = ctx.canvas.height;
        
        if (this.x < minX) {
          this.x = minX;
          this.oldX = this.x + (this.x - this.oldX);
        } else if (this.x > maxX) {
          this.x = maxX;
          this.oldX = this.x + (this.x - this.oldX);
        }
        
        if (this.y < minY) {
          this.y = minY;
          this.oldY = this.y + (this.y - this.oldY);
        } else if (this.y > maxY) {
          this.y = maxY;
          this.oldY = this.y + (this.y - this.oldY);
        }
        constraints.forEach((constraint)=>{
          if(constraint.p1 == this || constraint.p2 == this) return
          const check = circleLineCollision(this.x,this.y,this.r,constraint.p1.x,constraint.p1.y,constraint.p2.x,constraint.p2.y)
          if(check){
            resolveCircleLineCollision(this,constraint)
          }
        })
    }
}

class Constraint {
    constructor(p1, p2, distance) {
      this.p1 = p1;
      this.p2 = p2;
      this.distance = distance;
    }
    
    satisfy() {
      const dx = this.p2.x - this.p1.x;
      const dy = this.p2.y - this.p1.y;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const diff = (this.distance - currentDistance) / currentDistance;
      
      const offsetX = dx * 0.5 * diff;
      const offsetY = dy * 0.5 * diff;
      
      if (this.p1.pinX == undefined || this.p1.pinY == undefined) {
        this.p1.x -= offsetX;
        this.p1.y -= offsetY;
      }
      
      if (this.p2.pinX == undefined || this.p2.pinY == undefined) {
        this.p2.x += offsetX;
        this.p2.y += offsetY;
      }
    }
  }

class Player extends Particle{
  constructor(x,y,r){
    super(x,y,r)
    document.addEventListener('keydown',(e)=>{
      console.log(e.key)
      if(e.key == 'a'){
      this.accellerationX = -1
      }
      if(e.key == 'd'){
      this.accellerationX = 1
      }
      if(e.key == 'w'){
      this.accellerationY = -1
      }
      if(e.key == 's'){
      this.accellerationY = 1
      }
    })
  }
  update(){
    super.update()

  }

}
  const particles = [new Particle(100,200,20),new Particle(350,200,20),new Particle(225,10,20),new Player(300,50,25)]
  const constraints = [new Constraint(particles[0],particles[1],250),new Constraint(particles[1],particles[2],250),new Constraint(particles[2],particles[0],250)]

  const loop = () => {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    requestAnimationFrame(loop)

    particles.forEach((particle)=>{
        particle.update()
        ctx.beginPath()
        ctx.arc(particle.x,particle.y,particle.r,0,Math.PI*2)
        ctx.fill()
    })
    constraints.forEach((constraint)=>{
        constraint.satisfy()
        ctx.beginPath()
        ctx.lineWidth = 10
        ctx.moveTo(constraint.p1.x,constraint.p1.y)
        ctx.lineTo(constraint.p2.x,constraint.p2.y)
        ctx.stroke()
    })
}
loop()


// Function to calculate the MTV and resolve collision between a circle and a line
function resolveCircleLineCollision(circle, line) {
  const closestPoint = getClosestPointOnLine(line.p1.x, line.p1.y, line.p2.x, line.p2.y, circle.x, circle.y);
  const distance = Math.sqrt((circle.x-closestPoint.x)**2+(circle.y-closestPoint.y)**2);
  const axis = {x: ( closestPoint.x -circle.x), y: (closestPoint.y-circle.y)};
  const delta = circle.r - distance;
  const normal = {x: axis.x/distance, y: axis.y/distance};
  console.log(axis)
  circle.x -= normal.x * delta;
  circle.y -= normal.y * delta;

  const p1Dist = Math.sqrt((line.p1.x-circle.x)**2+(line.p1.y-circle.y)**2)/line.distance;

  line.p1.x += normal.x * delta * (1-p1Dist);
  line.p1.y += normal.y * delta * (1-p1Dist);
  line.p2.x += normal.x * delta * p1Dist;
  line.p2.y += normal.y * delta * p1Dist;
}


function getClosestPointOnLine(x1, y1, x2, y2, px, py) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const vx = px - x1;
  const vy = py - y1;
  const dot = vx * dx + vy * dy;
  const lengthSquared = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(dot / lengthSquared, 1));
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;
  return { x: closestX, y: closestY };
}

function circleLineCollision(circleX, circleY, radius, lineX1, lineY1, lineX2, lineY2) {
  // Vector from one endpoint of the line to the circle center
  const vX = circleX - lineX1;
  const vY = circleY - lineY1;

  // Vector representing the line segment
  const wX = lineX2 - lineX1;
  const wY = lineY2 - lineY1;

  // Calculate the dot product of V and W
  const dot = vX * wX + vY * wY;

  // Calculate the squared length of W
  const lengthSquared = wX * wX + wY * wY;

  // Calculate the parameter 't' representing the projection of the circle center onto the line segment
  const t = Math.max(0, Math.min(dot / lengthSquared, 1));

  // Calculate the closest point on the line to the circle center
  const closestX = lineX1 + t * wX;
  const closestY = lineY1 + t * wY;

  // Calculate the distance between the circle center and the closest point on the line
  const distanceSquared = (circleX - closestX) ** 2 + (circleY - closestY) ** 2;

  // Check if a collision has occurred
  return distanceSquared <= radius ** 2;
}



/* 
// Particle class
class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.oldX = x;
      this.oldY = y;
      this.pinX = undefined; // pinned X position (optional)
      this.pinY = undefined; // pinned Y position (optional)
    }
    
    update() {
      if (this.pinX == undefined || this.pinY == undefined) {
        let tempX = this.x;
        let tempY = this.y;
        this.x += this.x - this.oldX;
        this.y += this.y - this.oldY + 1*0.01;

        this.oldX = tempX;
        this.oldY = tempY;
      } else {
        this.x = this.pinX;
        this.y = this.pinY;
      }

    }
    
    applyConstraints() {
        const minX = 0;
        const minY = 0;
        const maxX = ctx.canvas.width;
        const maxY = ctx.canvas.height;
        
        if (this.x < minX) {
          this.x = minX;
          this.oldX = this.x + (this.x - this.oldX);
        } else if (this.x > maxX) {
          this.x = maxX;
          this.oldX = this.x + (this.x - this.oldX);
        }
        
        if (this.y < minY) {
          this.y = minY;
          this.oldY = this.y + (this.y - this.oldY);
        } else if (this.y > maxY) {
          this.y = maxY;
          this.oldY = this.y + (this.y - this.oldY);
        }
    }
  }
  
  // Constraint class
  class Constraint {
    constructor(p1, p2, distance) {
      this.p1 = p1;
      this.p2 = p2;
      this.distance = distance;
    }
    
    satisfy() {
      const dx = this.p2.x - this.p1.x;
      const dy = this.p2.y - this.p1.y;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const diff = (this.distance - currentDistance) / currentDistance;
      
      const offsetX = dx * 0.5 * diff;
      const offsetY = dy * 0.5 * diff;
      
      if (this.p1.pinX == undefined || this.p1.pinY == undefined) {
        this.p1.x -= offsetX;
        this.p1.y -= offsetY;
      }
      
      if (this.p2.pinX == undefined || this.p2.pinY == undefined) {
        this.p2.x += offsetX;
        this.p2.y += offsetY;
      }
    }
  }
  
  // VerletPhysicsEngine class
  class VerletPhysicsEngine {
    constructor() {
      this.particles = [];
      this.constraints = [];
    }
    
    addParticle(x, y) {
      const particle = new Particle(x, y);
      this.particles.push(particle);
      return particle;
    }
    
    addConstraint(p1, p2, distance) {
      const constraint = new Constraint(p1, p2, distance);
      this.constraints.push(constraint);
      return constraint;
    }
    
    update() {
      for (const particle of this.particles) {
        particle.update();
        particle.applyConstraints();
      }
      
      for (const constraint of this.constraints) {
        constraint.satisfy();
      }
    }
  }
  
  // Usage example
  const engine = new VerletPhysicsEngine();
  
  // Create particles
  const particle1 = engine.addParticle(200, 200);
  const particle2 = engine.addParticle(300, 200);
  const particle3 = engine.addParticle(250, 130);
  
  // Add constraints
  engine.addConstraint(particle1, particle2, 100);
  engine.addConstraint(particle1, particle3, 100);
  engine.addConstraint(particle2, particle3, 100);
  
  // Main loop
  function updateLoop() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Update and render particles
    engine.update();
    
    // Render particles and constraints here
    ctx.fillStyle = '#000000';
    ctx.beginPath()
    ctx.arc(particle1.x,particle1.y, 25, 0, 2 * Math.PI, false)
    ctx.arc(particle2.x,particle2.y, 25, 0, 2 * Math.PI, false)
    ctx.arc(particle3.x,particle3.y, 25, 0, 2 * Math.PI, false)
    ctx.fill()

    // ...
    requestAnimationFrame(updateLoop);
  }
  
  // Start the loop
  updateLoop(); */