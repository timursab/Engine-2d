class Player extends GameObject{
    constructor(posX,posY,isControlled,radius){
        super(posX,posY)

        this.isControlled = isControlled

        if(isControlled){
            this.input = new KeyboardInputs()
            this.attach(new ShapeRenderer('circle',radius || 50,0,"#FFFFFF"))
            this.attach(new CircleCollider(radius || 50))
            this.attach(new Rigidbody())

            window.addEventListener('mousedown',(e)=>{
                this.clientX = e.clientX
                this.clientY = e.clientY
            })
            window.addEventListener('mouseup',(e)=>{
                this.rigidbody.accelerate((this.clientX-e.clientX)*100,(this.clientY-e.clientY)*100)
            })
        }
        else{
            this.attach(new ShapeRenderer('circle',radius || 50))
            this.attach(new CircleCollider(radius || 50))
            this.attach(new Rigidbody())
        }
    }
    update(deltaTime){
        deltaTime *= 100
        if(this.isControlled){
            const{x,y} = this.input.directionVector.normalize()
            this.rigidbody.accelerate(x*1000*deltaTime,((-y*1000))*deltaTime)

        }
        else{
            this.rigidbody.accelerate(0,300*deltaTime)
        }

        if(window.main.controls.KeyZ){
            const aX = this.transform.x-window.main.mousePos.x
            const aY = this.transform.y-window.main.mousePos.y
            const dist = Math.sqrt(aX**2+aY**2)
            if(dist<200 && dist!==0){
                const delta = -(dist-200)*10
                this.rigidbody.accelerate(((aX/dist)*delta)*deltaTime,((aY/dist)*delta)*deltaTime)
            }
        }

    }
    fixedUpdate(){

    }
}