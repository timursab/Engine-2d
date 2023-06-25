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
        let velX = this.x - this.oldX
        let velY = this.y - this.oldY
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


  const particles = [new Particle(100,200,20),new Particle(350,200,20),new Particle(225,10,20),new Particle(300,10,25)]
  const constraints = [new Constraint(particles[0],particles[1],250),new Constraint(particles[1],particles[2],250),new Constraint(particles[2],particles[0],250)]

  const loop = () => {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    requestAnimationFrame(loop)

    particles.forEach((particle)=>{
        particle.accellerationY = 0.5
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
  // Circle properties
  const circleX = circle.x;
  const circleY = circle.y;
  const radius = circle.r;

  // Line properties
  const lineX1 = line.p1.x;
  const lineY1 = line.p1.y;
  const lineX2 = line.p2.x;
  const lineY2 = line.p2.y;

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

  // Calculate the vector from the circle center to the closest point on the line
  const dX = closestX - circleX;
  const dY = closestY - circleY;

  // Calculate the distance between the circle center and the closest point on the line
  const distance = Math.sqrt(dX * dX + dY * dY);

  // Check if a collision has occurred
  if (distance <= radius) {
    // Calculate the penetration depth
    const penetration = radius - distance;

    // Calculate the MTV
    const mtvX = (dX / distance) * penetration;
    const mtvY = (dY / distance) * penetration;

    // Move the circle
    circle.x += mtvX;
    circle.y += mtvY;

    // Move the attached Verlet objects on the line
    line.p1.x += mtvX;
    line.p1.y += mtvY;
    line.p2.x += mtvX;
    line.p2.y += mtvY;
  }
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