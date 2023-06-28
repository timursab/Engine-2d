class Point extends GameObject{
    constructor(posX,posY,isStatic){
        super(posX,posY)

        this.attach(new ShapeRenderer('circle',25,0,"#ffea00"))
        this.attach(new CircleCollider(25))
        this.attach(new Rigidbody())
        this.rigidbody.static = isStatic
    }
    update(deltaTime){

    }
    fixedUpdate(){
        this.rigidbody.accelerate(0,120)
    }
}