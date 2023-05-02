class GameObject{
    constructor(posX,posY){
        this.name = 'GameObject'
        this.shapeRenderer = null
        this.rigidbody = null
        this.transform = new Transform(posX,posY)
        this.transform._init(this)
        this.aabb = null
        this.constraints = []
    }
    attach(component){
        if(component.name == 'ShapeRenderer'){
            this.shapeRenderer = component
        }
        if(component.name == 'Rigidbody'){
            this.rigidbody = component
            this.rigidbody._init(this)
        }
        if(component.name == 'CircleCollider'){
            this.collider = component
            this.collider._init(this)
        }
        if(component.name == 'AABB'){
            this.aabb = component
            this.aabb._init(this)
        }
        if(component.name == 'FixedConstraint'){
            this.constraints.push(component)
            this.constraints[this.constraints.length-1]._init(this)
        }
    }
    _update(deltaTime){
        this.update(deltaTime)
        this.render()
    }
    update(){

    }
    render(){
        if(this.shapeRenderer){
            this.shapeRenderer.render(this.transform.x,this.transform.y)
        }
        if(this.spriteRenderer){
            this.spriteRenderer.render(this.transform.x,this.transform.y)
        }
    }
    physics(deltaTime){
        this.fixedUpdate()
        if(this.rigidbody){
            this.rigidbody.update(deltaTime)
        }
    }
    fixedUpdate(){
    }
}