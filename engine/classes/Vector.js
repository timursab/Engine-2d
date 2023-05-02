class Vector{
    constructor(x,y){
        this.x = x || 0
        this.y = y || 0
    }
    normalize(){
        if(this.x === 0 && this.y === 0){
            return{x:this.x,y:this.y}
        }
        const magnitude = Math.sqrt(this.x**2+this.y**2)
        this.x = this.x / magnitude
        this.y = this.y / magnitude
        return{x:this.x,y:this.y}
    }
    set(x,y){
        this.x = x
        this.y = y
    }
}