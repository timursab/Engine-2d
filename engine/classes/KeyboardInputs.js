class KeyboardInputs{
    constructor(){
        this.heldDirections = []
        this.map = {
            'ArrowUp':'up',
            'ArrowDown':'down',
            'ArrowLeft':'left',
            'ArrowRight':'right',
            'KeyW':'up',
            'KeyS':'down',
            'KeyA':'left',
            'KeyD':'right',
        }
        this.init()
        this.directionVector = new Vector(0,0)
    }

    get getDirection(){
        return this.heldDirections[0]
    }
    setDirectionVector(){
        let x,y = 0

        if(this.heldDirections.includes('up')&&!this.heldDirections.includes('down')){
            y=1
        }
        else if(!this.heldDirections.includes('up')&&this.heldDirections.includes('down')){
            y=-1
        }
        else{
            y=0
        }
        if(this.heldDirections.includes('right')&&!this.heldDirections.includes('left')){
            x=1
        }
        else if(!this.heldDirections.includes('right')&&this.heldDirections.includes('left')){
            x=-1
        }
        else{
            x=0
        }
        this.directionVector.set(x,y)
    }

    init(){
        document.addEventListener('keydown',e => {
            const dir = this.map[e.code]
            if(dir && this.heldDirections.indexOf(dir) === -1){
                this.heldDirections.unshift(dir)
                this.setDirectionVector()
            }


        })
        document.addEventListener('keyup',e => {
            const dir = this.map[e.code]
            const index = this.heldDirections.indexOf(dir)
            if(index > -1){
                this.heldDirections.splice(index,1)
                this.setDirectionVector()
            }

        })
    }
}