const wall = new GameObject(200,200)
const wall1 = new GameObject(800,800)
wall.attach(new ShapeRenderer('square',300,500))
wall.attach(new AABB(300,500))
wall1.attach(new ShapeRenderer('square',200,200))
wall1.attach(new AABB(200,200))


const player5 = new Player(1000,250,false,5)
const player6 = new Player(1000,400,false,5)
const player100 = new Player(1150,250,false,5)
const player101 = new Player(1150,400,false,5)
player5.attach(new FixedConstraint(player6,150))
player5.attach(new FixedConstraint(player100,150))
player100.attach(new FixedConstraint(player101,150))
player101.attach(new FixedConstraint(player6,150))
player5.attach(new FixedConstraint(player101,212.132034356))


const main = new Main()
main.setScenes({
    testScene:{
        gameObjects:{
            player: new Player(600,500,true),
            player1: new Player(1000,1000),
            player2: new Player(1000,900),
            player3: new Player(1000,800),
            player4: new Player(1000,700),
            player5,
            player6,
            player100,
            player101,
/*             player7: new Player(1100,1000),
            player8: new Player(1100,900),
            player9: new Player(1100,800),
            player10: new Player(1100,700),
            player11: new Player(1100,600),
            player12: new Player(1100,500),
            player13: new Player(1200,1000),
            player14: new Player(1200,900),
            player15: new Player(1200,800),
            player16: new Player(1200,700),
            player17: new Player(1200,600),
            player18: new Player(1200,500),
            player19: new Player(1300,1000),
            player20: new Player(1300,900),
            player21: new Player(1300,800),
            player22: new Player(1300,700),
            player23: new Player(1300,600),
            player24: new Player(1300,500),
            player25: new Player(1400,1000),
            player26: new Player(1400,900),
            player27: new Player(1400,800),
            player28: new Player(1400,700),
            player29: new Player(1400,600),
            player30: new Player(1400,500),
            player31: new Player(1500,1000),
            player32: new Player(1500,900),
            player33: new Player(1500,800),
            player34: new Player(1500,700),
            player35: new Player(1500,600),
            player36: new Player(1500,500), */
            wall,
        }
    },
    demoScene:{
        gameObjects:{
            player: new Player(960,300),
            wall1,
        }
    }
})

/* main.setScenes({
    testScene:{
        gameObjects:{
            player: new Player(600,300,true),
            player1: new Player(1600,700),
            player2: new Player(1000,700),

            wall,
            wall1
        }
    },
    demoScene:{
        gameObjects:{
            player: new Player(960,300,true),
            wall1,
        }
    }
})
 */

let x = 0
const loop = ()=>{
    x = x+1
    /* setTimeout(loop,10,x+1) */
    const p = new Player(window.main.mousePos.x,window.main.mousePos.y)
    //p.rigidbody.accelerate(35000,0)
    main.instantiate(p,'a'+ x.toString())
}

addEventListener('keydown',(e)=>{
    if(e.code == 'Space'){
        loop()
    }
})

main.start()