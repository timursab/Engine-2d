class Main{
    constructor(canvas,physicsTargetFPS){
        this.canvas = canvas || document.querySelector('canvas')
        this.physicsTargetFPS =  physicsTargetFPS || 60
        this.ctx = this.canvas.getContext('2d')
        this.prevTime = performance.now()
        this.bind = this.update.bind(this)
        this.deltaTime = 0
        this.event = new CustomEvent('update',{deltaTime:this.deltaTime})
        this.controls = {}
        this.keyDown = {}
        this.rigidbodies = []
        this.aabbs = []
        window.main = this
        this.mousePos = {x:0,y:0}
        this.canvas.addEventListener('mousemove',(e)=>{
            const rect = e.target.getBoundingClientRect()
            const scaleX = this.canvas.width / rect.width
            const scaleY = this.canvas.height / rect.height
            const x = (e.clientX - rect.left) * scaleX
            const y = (e.clientY - rect.top) * scaleY
            this.mousePos.x = x
            this.mousePos.y = y
        })
        this._initControls()
        this.mainUpdate = ()=>{}
    }
    start(){
        this.fpsCounter = 0
        this.update()
        this.fpsFunction = ()=>{
            setTimeout(this.fpsFunction,1000)
            this.fpsCounter = 0
        }
        this.fpsFunction()

        this.fixedUpdate = ()=>{
            setTimeout(this.fixedUpdate,1000/this.physicsTargetFPS)
            Object.keys(this.scenes[this.currentScene].gameObjects).forEach((key)=>{
                this.scenes[this.currentScene].gameObjects[key].physics(0.03)
            })
            Object.keys(this.scenes[this.currentScene].constraints).forEach((constraint)=>{
                this.scenes[this.currentScene].constraints[constraint].update()
            })
        }
        this.fixedUpdate()
    }
    update(){
        this.fpsCounter += 1
        requestAnimationFrame(this.bind)
        const currentTime = performance.now()
        this.deltaTime = (currentTime - this.prevTime)/1000
        this.prevTime = currentTime

        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height)

        document.dispatchEvent(this.event)

        Object.keys(this.scenes[this.currentScene].gameObjects).forEach((key)=>{
            this.scenes[this.currentScene].gameObjects[key]._update(this.deltaTime)
        })
        this.scenes[this.currentScene].constraints.forEach((constraint)=>{
            //Render the constraint
            constraint.render(constraint)
        })
        this.mainUpdate()

        Object.keys(this.keyDown).forEach((key)=>{
            this.keyDown[key] = false
        })
    }
    changeScene(name){
        this.currentScene = name

        this.rigidbodies = []
        Object.keys(this.scenes[this.currentScene].gameObjects).forEach((key)=>{
            if(this.scenes[this.currentScene].gameObjects[key].rigidbody){
                this.rigidbodies.push(this.scenes[this.currentScene].gameObjects[key].rigidbody)
            }
        })


        this.aabbs = []
        Object.keys(this.scenes[this.currentScene].gameObjects).forEach((key)=>{
            if(this.scenes[this.currentScene].gameObjects[key].aabb){
                this.aabbs.push(this.scenes[this.currentScene].gameObjects[key].aabb)
            }
        })
    }
    setScenes(scenes){

        this.scenes = scenes
        Object.keys(this.scenes).forEach((scene)=>{
            this.scenes[scene].constraints = []
        })
        console.log(this.scenes)
        //Set first scene as default
        this.currentScene = Object.keys(this.scenes)[0]

        this.rigidbodies = []
        Object.keys(this.scenes[this.currentScene].gameObjects).forEach((key)=>{
            if(this.scenes[this.currentScene].gameObjects[key].rigidbody){
                this.rigidbodies.push(this.scenes[this.currentScene].gameObjects[key].rigidbody)
            }
        })

        //For all aabb objects
        this.aabbs = []
        Object.keys(this.scenes[this.currentScene].gameObjects).forEach((key)=>{
            if(this.scenes[this.currentScene].gameObjects[key].aabb){

                this.aabbs.push(this.scenes[this.currentScene].gameObjects[key].aabb)
            }
        })
    }
    instantiate(gameObject,name){
        if(this.scenes[this.currentScene].gameObjects[name])return
        this.scenes[this.currentScene].gameObjects[name] = gameObject
        if(gameObject.rigidbody){
            this.rigidbodies.push(gameObject.rigidbody)
        }
    }
    _initControls(){
        document.addEventListener('keydown',(e)=>{
            if(!this.controls[e.code]){
                this.keyDown[e.code] = true
                this.controls[e.code]=true
            }
        })
        document.addEventListener('keyup',(e)=>{
            if(this.controls[e.code]){
                this.controls[e.code]=false
            }
        })
    }

    addConstraint(constraint){
        this.scenes[this.currentScene].constraints.push(constraint)
    }
}