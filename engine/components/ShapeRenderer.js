class ShapeRenderer{
    constructor(shape,a,b,color){
        this.name = 'ShapeRenderer'
        this.shape = shape || 'square'
        this.b = b || 20
        this.a = a || 20
        this.color=color||"#000000"
    }
    render(x,y){
        if(this.shape === 'square'){
            window.main.ctx.fillStyle = this.color
            window.main.ctx.fillRect(x,y,this.a,this.b)
        }
        if(this.shape === 'circle'){
            window.main.ctx.fillStyle = this.color
            window.main.ctx.beginPath()
            window.main.ctx.arc(x, y, this.a, 0, 2 * Math.PI, false)
            window.main.ctx.fill()
        }
    }
}