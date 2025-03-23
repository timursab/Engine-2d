class Rigidbody{
    constructor(){
        this.name = 'Rigidbody'
        this.acceleration={x:0,y:0}
        this.static = false
        this.friction = 0.96
    }
    _init(gameObject){
        this.gameObject = gameObject
        this.oldX = this.gameObject.transform.x
        this.oldY = this.gameObject.transform.y
        this.prevDeltaTime = 0
        this.xOverride = undefined
        this.yOverride = undefined
    }
    update(deltaTime){
        if(this.static){
            this.collisions()
        }
        else{
            this.verlet(deltaTime)
            this.constraints()
            this.collisions()
        }
    }


    verlet(deltaTime){
        this.velocityX = this.xOverride*this.friction || (this.gameObject.transform.x - this.oldX)*this.friction
        this.velocityY = this.yOverride*this.friction || (this.gameObject.transform.y - this.oldY)*this.friction
        console.log(deltaTime)
        this.oldX = this.gameObject.transform.x
        this.oldY = this.gameObject.transform.y
        this.gameObject.transform.x = this.gameObject.transform.x + this.velocityX + (this.acceleration.x * deltaTime*deltaTime)
        this.gameObject.transform.y = this.gameObject.transform.y + this.velocityY + (this.acceleration.y * deltaTime*deltaTime)

        this.acceleration.y = 0
        this.acceleration.x = 0
        this.prevDeltaTime = deltaTime
        this.xOverride = undefined
        this.yOverride = undefined
    }

    constraints(){
        /* const radius = 500
        const centerX = 960
        const centerY = 512
        const colliderRadius = 50
        const to_objX = this.gameObject.transform.x - centerX
        const to_objY = this.gameObject.transform.y - centerY
        const dist = Math.sqrt(to_objX**2+to_objY**2)
        if(dist>radius-colliderRadius){
            const nX = to_objX / dist
            const nY = to_objY / dist
            this.gameObject.transform.x = centerX + nX * (radius-colliderRadius)
            this.gameObject.transform.y = centerY + nY * (radius-colliderRadius)
        } */
        if(this.gameObject.constraints){
            for(let i = 0;i<this.gameObject.constraints.length;i++){
                this.gameObject.constraints[i]._update()
            }
        }

        if(this.gameObject.transform.y > 1080-this.gameObject.collider.radius){
            this.gameObject.transform.y = 1080-this.gameObject.collider.radius
            this.yOverride = -this.velocityY*0.8
        }
        if(this.gameObject.transform.y < this.gameObject.collider.radius){
            this.gameObject.transform.y = this.gameObject.collider.radius
            this.yOverride = -this.velocityY*0.8
        }
        if(this.gameObject.transform.x < this.gameObject.collider.radius){
            this.gameObject.transform.x = this.gameObject.collider.radius
            this.xOverride = -this.velocityX*0.8
        }
        if(this.gameObject.transform.x > 1920-this.gameObject.collider.radius){
            this.gameObject.transform.x = 1920-this.gameObject.collider.radius
            this.xOverride = -this.velocityX*0.8
        }

        //AABB - Circle
        for(let i=0;i<window.main.aabbs.length;i++){
            const aabb = window.main.aabbs[i]
            const {x,y} = this.gameObject.transform
            const ax = aabb.gameObject.transform.x
            const ay = aabb.gameObject.transform.y
            
            //horizontal rectangle
            if(y<ay+aabb.h && y>ay){

                //Left wall
                if(x>ax-this.gameObject.collider.radius && x<ax+aabb.w/2){
                    this.gameObject.transform.x=ax-this.gameObject.collider.radius
                    this.xOverride = -this.velocityX
                }
                //Right wall
                if(x<ax+aabb.w+this.gameObject.collider.radius&&x>ax+aabb.w/2){
                    this.gameObject.transform.x=ax+aabb.w+this.gameObject.collider.radius
                    this.xOverride = -this.velocityX
                }
            }
            //Vertical Rectanlge
            if(x>ax&&x<ax+aabb.w){
                if(y>ay-this.gameObject.collider.radius && y<ay+aabb.h/2){
                    this.gameObject.transform.y=ay-this.gameObject.collider.radius
                    this.yOverride = -this.velocityY

                }
                if(y<ay+aabb.h+this.gameObject.collider.radius && y>ay+aabb.h/2){
                    this.gameObject.transform.y=ay+aabb.h+this.gameObject.collider.radius
                    this.yOverride = -this.velocityY
                }
            }

            //Top Left circle
            let dist = Math.sqrt((x-ax)**2+(y-ay)**2)
            if(dist<this.gameObject.collider.radius&&y<ay&&x<ax){
                this.gameObject.transform.x += (this.gameObject.collider.radius-dist)*(x-ax)/dist
                this.gameObject.transform.y += (this.gameObject.collider.radius-dist)*(y-ay)/dist
            }
            //Top Right circle
            dist = Math.sqrt((x-(ax+aabb.w))**2+(y-ay)**2)
            if(dist<this.gameObject.collider.radius&&y<ay&&x>ax+aabb.w){
                this.gameObject.transform.x += (this.gameObject.collider.radius-dist)*(x-(ax+aabb.w))/dist
                this.gameObject.transform.y += (this.gameObject.collider.radius-dist)*(y-ay)/dist
            }
            //Bottom Left circle
            dist = Math.sqrt((x-(ax))**2+(y-(ay+aabb.h))**2)
            if(dist<this.gameObject.collider.radius&&y>ay+aabb.h&&x<ax){
                this.gameObject.transform.x += (this.gameObject.collider.radius-dist)*(x-ax)/dist
                this.gameObject.transform.y += (this.gameObject.collider.radius-dist)*(y-(ay+aabb.h))/dist
            }
            //Bottom Right circle
            dist = Math.sqrt((x-(ax+aabb.w))**2+(y-(ay+aabb.h))**2)
            if(dist<this.gameObject.collider.radius&&y>ay+aabb.h&&x>ax+aabb.w){
                this.gameObject.transform.x += (this.gameObject.collider.radius-dist)*(x-(ax+aabb.w))/dist
                this.gameObject.transform.y += (this.gameObject.collider.radius-dist)*(y-(ay+aabb.h))/dist
            }

        }
    }
    collisions(){

        //Collisions for fixed constraints
        Object.keys(window.main.scenes[window.main.currentScene].constraints).forEach((constraints)=>{
            const constraint = window.main.scenes[window.main.currentScene].constraints[constraints]
            if(!(constraint.p1 == this.gameObject || constraint.p2 == this.gameObject)){
                const check = circleLineCollision(this.gameObject.transform.x,this.gameObject.transform.y,this.gameObject.collider.radius,constraint.p1.transform.x,constraint.p1.transform.y,constraint.p2.transform.x,constraint.p2.transform.y)
                if(check){
                    resolveCircleLineCollision(this.gameObject,constraint)
                }
            }
        })

        

        for(let i = 0;i<window.main.rigidbodies.length;i++){
            if(window.main.rigidbodies[i]==this) return
            const axisX = this.gameObject.transform.x - window.main.rigidbodies[i].gameObject.transform.x
            const axisY = this.gameObject.transform.y - window.main.rigidbodies[i].gameObject.transform.y
            const dist = Math.sqrt(axisX**2+axisY**2)
            if(dist < this.gameObject.collider.radius + window.main.rigidbodies[i].gameObject.collider.radius){
                const nX = axisX/dist
                const nY = axisY/dist
                const delta = this.gameObject.collider.radius + window.main.rigidbodies[i].gameObject.collider.radius-dist
                if(!this.static){
                    this.gameObject.transform.x += 0.5*delta*nX*1
                    this.gameObject.transform.y += 0.5*delta*nY*1
                }
                if(!window.main.rigidbodies[i].gameObject.rigidbody.static){
                    window.main.rigidbodies[i].gameObject.transform.x -= 0.5*delta*nX*1
                    window.main.rigidbodies[i].gameObject.transform.y -= 0.5*delta*nY*1
                }
            }
        }

    }

    accelerate(x,y){
        this.acceleration.x += x
        this.acceleration.y += y
    }
}



function resolveCircleLineCollision(circle, constraint) {
    const closestPoint = getClosestPointOnLine(constraint.p1.transform.x, constraint.p1.transform.y, constraint.p2.transform.x, constraint.p2.transform.y, circle.transform.x, circle.transform.y);
    const distance = Math.sqrt((circle.transform.x-closestPoint.x)**2+(circle.transform.y-closestPoint.y)**2);
    const axis = {x: ( closestPoint.x -circle.transform.x), y: (closestPoint.y-circle.transform.y)};
    const delta = circle.collider.radius - distance;
    const normal = {x: axis.x/distance, y: axis.y/distance};
    console.log(circle.rigidbody.static)
    if(!circle.rigidbody.static){
        circle.transform.x -= normal.x * delta;
        circle.transform.y -= normal.y * delta;
    }
    //Flip the velocity based on the lines normal.

/*     const lineNormal = calculateNormalizedNormal(constraint.p1.transform.x, constraint.p1.transform.y, constraint.p2.transform.x, constraint.p2.transform.y)
    const reflectionX = circle.rigidbody.velocityX - 2 * dotProduct( circle.rigidbody.velocityX,  circle.rigidbody.velocityY, lineNormal.x, lineNormal.y) * lineNormal.x;
    const reflectionY = circle.rigidbody.velocityY - 2 * dotProduct( circle.rigidbody.velocityX,  circle.rigidbody.velocityY, lineNormal.x, lineNormal.y) * lineNormal.y;
    circle.rigidbody.xOverride = reflectionX*0.2;
    circle.rigidbody.yOverride = reflectionY*0.2; */
    




    //Move the line points also
    const p1Dist = Math.sqrt((constraint.p1.transform.x-circle.transform.x)**2+(constraint.p1.transform.y-circle.transform.y)**2)/constraint.distance;
    if(!constraint.p1.rigidbody.static){
        constraint.p1.transform.x += normal.x * delta * (1-p1Dist);
        constraint.p1.transform.y += normal.y * delta * (1-p1Dist);
    }
    if(!constraint.p2.rigidbody.static){
        constraint.p2.transform.x += normal.x * delta * p1Dist;
        constraint.p2.transform.y += normal.y * delta * p1Dist;
    }
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


// Function to flip a vector based on a line's normal
function flipVectorOnLine(vectorX, vectorY, linePoint1X, linePoint1Y, linePoint2X, linePoint2Y) {
    // Step 1: Calculate the line normal
    const lineNormalX = linePoint2Y - linePoint1Y;
    const lineNormalY = linePoint1X - linePoint2X;
  
    // Step 2: Normalize the line normal
    const magnitude = Math.sqrt(lineNormalX * lineNormalX + lineNormalY * lineNormalY);
    const normalizedLineNormalX = lineNormalX / magnitude;
    const normalizedLineNormalY = lineNormalY / magnitude;
  
    // Step 3: Calculate the dot product
    const dotProduct = vectorX * normalizedLineNormalX + vectorY * normalizedLineNormalY;
  
    // Step 4: Multiply the dot product by 2
    const result = 2 * dotProduct;
  
    // Step 5: Multiply the line normal by the result
    const flippedVectorX = result * normalizedLineNormalX;
    const flippedVectorY = result * normalizedLineNormalY;
  
    // Step 6: Subtract the result from the vector to be flipped
    const flippedX = vectorX - flippedVectorX;
    const flippedY = vectorY - flippedVectorY;
  
    // Return the flipped vector
    return {x:flippedX, y:flippedY}
}
function dotProduct(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

function calculateNormalizedNormal(linePoint1X, linePoint1Y, linePoint2X, linePoint2Y) {
  // Step 1: Calculate the direction vector of the line
  const directionVectorX = linePoint2X - linePoint1X;
  const directionVectorY = linePoint2Y - linePoint1Y;
  
  // Step 2: Calculate the normal vector by swapping and negating the components
  const normalVectorX = -directionVectorY;
  const normalVectorY = directionVectorX;
  
  // Step 3: Calculate the magnitude of the normal vector
  const magnitude = Math.sqrt(normalVectorX * normalVectorX + normalVectorY * normalVectorY);
  
  // Step 4: Normalize the normal vector by dividing each component by the magnitude
  const normalizedNormalX = normalVectorX / magnitude;
  const normalizedNormalY = normalVectorY / magnitude;
  
  // Return the normalized normal vector
  return {x:normalizedNormalX, y:normalizedNormalY};
}