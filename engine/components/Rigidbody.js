class Rigidbody{
    constructor(){
        this.name = 'Rigidbody'
        this.acceleration={x:0,y:0}
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
        this.verlet(deltaTime)
        this.constraints()
        this.collisions()
    }


    verlet(deltaTime){
        this.velocityX = this.xOverride || (this.gameObject.transform.x - this.oldX)*0.99
        this.velocityY = this.yOverride || (this.gameObject.transform.y - this.oldY)*0.99
        this.oldX = this.gameObject.transform.x
        this.oldY = this.gameObject.transform.y
        this.gameObject.transform.x = this.gameObject.transform.x + this.velocityX + (this.acceleration.x * deltaTime*deltaTime)
        this.gameObject.transform.y = this.gameObject.transform.y + this.velocityY + (this.acceleration.y * deltaTime*deltaTime)
        /* this.gameObject.transform.x = this.gameObject.transform.x+velocityX*deltaTime/this.prevDeltaTime+this.acceleration.x*deltaTime**2
        this.gameObject.transform.y = this.gameObject.transform.y+velocityY*deltaTime/this.prevDeltaTime+this.acceleration.y*deltaTime**2 */

        this.acceleration.y = 0
        this.acceleration.x = 0
        this.prevDeltaTime = deltaTime
        this.xOverride = undefined
        this.yOverride = undefined
        //console.log(Math.abs(this.velocityX) +Math.abs(this.velocityY))
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

        //Line collisions (Fixed constraints)
        /* window.main.fixedConstraints.forEach(constraint=>{
            const direction = { x: constraint.p2.transform.x - constraint.p1.transform.x, y: constraint.p2.transform.y - constraint.p1.transform.y };
            const lineLength = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            const unitDirection = { x: direction.x / lineLength, y: direction.y / lineLength };
            const normal = { x: -unitDirection.y, y: unitDirection.x }; // perpendicular to the line segment
            
            const pointToObject = { x: this.gameObject.transform.x - constraint.p1.transform.x, y: this.gameObject.transform.y - constraint.p1.transform.y };
            
            const dotProduct = (pointToObject.x * unitDirection.x + pointToObject.y * unitDirection.y) / (lineLength * lineLength);
            if (dotProduct >= 0 && dotProduct <= 1) {
              const closestPoint = {
                x: constraint.p1.transform.x + dotProduct * direction.x,
                y: constraint.p1.transform.y + dotProduct * direction.y,
              };
          
              const distance = Math.sqrt(
                (closestPoint.x - this.gameObject.transform.x) * (closestPoint.x - this.gameObject.transform.x) +
                (closestPoint.y - this.gameObject.transform.y) * (closestPoint.y - this.gameObject.transform.y)
              );
          
              if (distance < 50) {
                const reflection = {
                  x: this.velocityX- 2 * (this.velocityX * normal.x + this.velocityY * normal.y) * normal.x,
                  y: this.velocityY - 2 * (this.velocityX * normal.x + this.velocityY * normal.y) * normal.y,
                };
                // Update the object's velocity
                this.xOverride = reflection.x;
                this.yOverride = reflection.y;
              }
            }
        }) */

        


        for(let i = 0;i<window.main.rigidbodies.length;i++){
            if(window.main.rigidbodies[i]==this) return
            const axisX = this.gameObject.transform.x - window.main.rigidbodies[i].gameObject.transform.x
            const axisY = this.gameObject.transform.y - window.main.rigidbodies[i].gameObject.transform.y
            const dist = Math.sqrt(axisX**2+axisY**2)
            if(dist < this.gameObject.collider.radius + window.main.rigidbodies[i].gameObject.collider.radius){
                const nX = axisX/dist
                const nY = axisY/dist
                const delta = this.gameObject.collider.radius + window.main.rigidbodies[i].gameObject.collider.radius-dist
                this.gameObject.transform.x += 0.5*delta*nX*1
                this.gameObject.transform.y += 0.5*delta*nY*1
                window.main.rigidbodies[i].gameObject.transform.x -= 0.5*delta*nX*1
                window.main.rigidbodies[i].gameObject.transform.y -= 0.5*delta*nY*1
            }
        }

    }

    accelerate(x,y){
        this.acceleration.x += x
        this.acceleration.y += y
    }
}