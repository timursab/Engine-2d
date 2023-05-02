class FixedConstraint{
    constructor(target,restLength){
        this.name='FixedConstraint'
        this.target = target
        this.restLength = restLength
    }
    _init(gameObject){
        console.log('init')
        this.gameObject = gameObject
    }
    _update(){
        const dx = this.target.transform.x - this.gameObject.transform.x
        const dy = this.target.transform.y - this.gameObject.transform.y

        const distance = Math.sqrt(dx*dx + dy*dy)
        const difference = (this.restLength-distance)
        const percent = difference / distance / 2

        const offsetX = dx * percent;
        const offsetY = dy * percent;

        this.gameObject.transform.x -= offsetX*1
        this.gameObject.transform.y -= offsetY*1
        this.target.transform.x += offsetX*1
        this.target.transform.x += offsetY*1
    }
}