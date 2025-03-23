const wall = new GameObject(200,200)
const wall1 = new GameObject(800,800)
wall.attach(new ShapeRenderer('square',300,500))
wall.attach(new AABB(300,500))
wall1.attach(new ShapeRenderer('square',200,200))
wall1.attach(new AABB(200,200))


const player5 = new Player(700,300,false,25)
const player6 = new Player(950,300,false,25)
const player100 = new Player(825,83.5,false,25)
const player101 = new Player(825+250,83.5,false,25)
player5.rigidbody.static = true
player6.rigidbody.static = true
player100.rigidbody.static = true
player101.rigidbody.static = true

const player6v2 = new Player(1000+300,400,false,25)
const player5v2 = new Player(1000+300,250,false,25)
const player100v2 = new Player(1150+300,250,false,25)
const player101v2 = new Player(1150+300,400,false,25)
const ball1 = new Player(1150,800,false,50)
ball1.rigidbody.static = true
const main = new Main(undefined,144)



const point_1=new Point(100,1000,false)
const point_2=new Point(700,1000,false)

const point1=new Point(300,1000,false)
const point2=new Point(500,1000,false)
const point3=new Point(300,800,false)
const point4=new Point(500,800,false)
const point5=new Point(300,600,false)
const point6=new Point(500,600,false)
const point7=new Point(300,400,false)
const point8=new Point(500,400,false)
const point9=new Point(300,200,false)
const point10=new Point(500,200,false)
const point11=new Point(700,400,false)
const point12=new Point(900,400,false)
const point13=new Point(700,200,false)
const point14=new Point(900,200,false)
main.setScenes({
    testScene:{
        gameObjects:{
            player5,
            player6,
            player100,
            player101,
            player5v2,
            player6v2,
            player100v2,
            player101v2,
            ball1,
            player: new Player(600,500,true),

            wall,
        }
    },
    demoScene:{
        gameObjects:{
            player: new Player(960,300,true),
            /* wall1, */
            player1: new Player(1000,1000,false,50,true),
            player2: new Player(1000,900,false,50,true),
            player3: new Player(1000,800,false,50,true),
            player4: new Player(1000,700,false,50,true),

            player7: new Player(1100,1000,false,50,true),
            player8: new Player(1100,900,false,50,true),
            player9: new Player(1100,800,false,50,true),
            player10: new Player(1100,700,false,50,true),
            player11: new Player(1100,600,false,50,true),
            player12: new Player(1100,500,false,50,true),
            player13: new Player(1200,1000,false,50,true),
            player14: new Player(1200,900,false,50,true),
            player15: new Player(1200,800,false,50,true),
            player16: new Player(1200,700,false,50,true),
            player17: new Player(1200,600,false,50,true),
            player18: new Player(1200,500,false,50,true),
            player19: new Player(1300,1000,false,50,true),
            player20: new Player(1300,900,false,50,true),
            player21: new Player(1300,800,false,50,true),
            player22: new Player(1300,700,false,50,true),
            player23: new Player(1300,600,false,50,true),
            player24: new Player(1300,500,false,50,true),
            player25: new Player(1400,1000,false,50,true),
            player26: new Player(1400,900,false,50,true),
            player27: new Player(1400,800,false,50,true),
            player28: new Player(1400,700,false,50,true),
            player29: new Player(1400,600,false,50,true),
            player30: new Player(1400,500,false,50,true),
            player31: new Player(1500,1000,false,50,true),
            player32: new Player(1500,900,false,50,true),
            player33: new Player(1500,800,false,50,true),
            player34: new Player(1500,700,false,50,true),
            player35: new Player(1500,600,false,50,true),
            player36: new Player(1500,500,false,50,true),
        }
    },
    crane:{
        gameObjects:{
            player:new Player(600,500,true),
            point_1,
            point_2,
            point1,
            point2,
            point3,
            point4,
            point5,
            point6,
            point7,
            point8,
            point9,
            point10,
            point11,
            point12,
            point13,
            point14,
        }

    }
})

main.changeScene('crane')
main.addConstraint(new FixedConstraint(point1,point_1,200))
main.addConstraint(new FixedConstraint(point3,point_1,282.84271247461900976033774484194))
main.addConstraint(new FixedConstraint(point2,point_2,200))
main.addConstraint(new FixedConstraint(point4,point_2,282.84271247461900976033774484194))

main.addConstraint(new FixedConstraint(point1,point2,200))
main.addConstraint(new FixedConstraint(point1,point4,282.84271247461900976033774484194))
main.addConstraint(new FixedConstraint(point1,point3,200))
main.addConstraint(new FixedConstraint(point4,point2,200))
main.addConstraint(new FixedConstraint(point3,point4,200))
main.addConstraint(new FixedConstraint(point3,point6,282.84271247461900976033774484194))
main.addConstraint(new FixedConstraint(point5,point6,200))
main.addConstraint(new FixedConstraint(point3,point5,200))
main.addConstraint(new FixedConstraint(point4,point6,200))
main.addConstraint(new FixedConstraint(point5,point7,200))
main.addConstraint(new FixedConstraint(point6,point8,200))
main.addConstraint(new FixedConstraint(point6,point8,200))
main.addConstraint(new FixedConstraint(point7,point8,200))
main.addConstraint(new FixedConstraint(point5,point8,282.84271247461900976033774484194))
main.addConstraint(new FixedConstraint(point7,point10,282.84271247461900976033774484194))
main.addConstraint(new FixedConstraint(point9,point10,200))
main.addConstraint(new FixedConstraint(point7,point9,200))
main.addConstraint(new FixedConstraint(point8,point10,200))
main.addConstraint(new FixedConstraint(point10,point13,200))
main.addConstraint(new FixedConstraint(point8,point11,200))
main.addConstraint(new FixedConstraint(point8,point13,282.84271247461900976033774484194))
main.addConstraint(new FixedConstraint(point13,point11,200))
main.addConstraint(new FixedConstraint(point13,point14,200))
main.addConstraint(new FixedConstraint(point11,point12,200))
main.addConstraint(new FixedConstraint(point12,point14,200))
main.addConstraint(new FixedConstraint(point14,point11,282.84271247461900976033774484194))










main.changeScene('testScene')
main.addConstraint(new FixedConstraint(player5,player6,250))
main.addConstraint(new FixedConstraint(player5,player100,250))
main.addConstraint(new FixedConstraint(player100,player6,250))
main.addConstraint(new FixedConstraint(player101,player6,250))
main.addConstraint(new FixedConstraint(player101,player100,250))

main.addConstraint(new FixedConstraint(player5v2,player6v2,250))
main.addConstraint(new FixedConstraint(player5v2,player100v2,250))
main.addConstraint(new FixedConstraint(player100v2,player6v2,250))
main.addConstraint(new FixedConstraint(player101v2,player6v2,250))
main.addConstraint(new FixedConstraint(player101v2,player100v2,250))


main.changeScene('crane')

let x = 0

const loop = ()=>{
    x = x+1
    /* setTimeout(loop,10,x+1) */
    const p = new Player(window.main.mousePos.x,window.main.mousePos.y)
    //p.rigidbody.accelerate(35000,0)
    main.instantiate(p,'a'+ x.toString())
}


let currentScene = 2

main.mainUpdate = () => {

    if(main.keyDown.KeyK){
        currentScene = currentScene + 1
        if(currentScene >= 3) {currentScene = 0}
        if(currentScene == 0){
            main.changeScene('testScene')
        }
        if(currentScene == 1){
            console.log('demo scene')
            main.changeScene('demoScene')
        }
        if(currentScene == 2){
            main.changeScene('crane')
        }

    }

    if(main.keyDown.Space){ 
        loop()
    }
}


main.start()