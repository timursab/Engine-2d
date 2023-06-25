class FixedConstraint{
    constructor(p1,p2,distance){
        this.name='FixedConstraint'
        this.distance = distance
        this.p1 = p1
        this.p2 = p2
    }
    update(){
  /*    const dx = this.target.transform.x - this.gameObject.transform.x
        const dy = this.target.transform.y - this.gameObject.transform.y

        const distance = Math.sqrt(dx*dx + dy*dy)
        const difference = (this.restLength-distance)
        const percent = difference / distance / 2

        const offsetX = dx * percent;
        const offsetY = dy * percent;

        this.gameObject.transform.x -= offsetX*1
        this.gameObject.transform.y -= offsetY*1
        this.target.transform.x += offsetX*1
        this.target.transform.x += offsetY*1 */
        const dx = this.p2.transform.x - this.p1.transform.x;
        const dy = this.p2.transform.y - this.p1.transform.y;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const diff = (this.distance - currentDistance) / currentDistance;
        
        const offsetX = dx * 0.5 * diff;
        const offsetY = dy * 0.5 * diff;
        this.p1.transform.x -= offsetX;
        this.p1.transform.y -= offsetY;
        

        this.p2.transform.x += offsetX;
        this.p2.transform.y += offsetY;
        //Cant render because this is called in the physics loop
        /* window.main.ctx.beginPath()
        window.main.ctx.lineWidth = 10
        window.main.ctx.moveTo(this.p1.transform.x,this.p1.transform.y)
        window.main.ctx.lineTo(this.p2.transform.x,this.p2.transform.y)
        window.main.ctx.stroke() */

    }
    render(constraint){
      window.main.ctx.beginPath()
      window.main.ctx.lineWidth = 10
      window.main.ctx.moveTo(constraint.p1.transform.x,constraint.p1.transform.y)
      window.main.ctx.lineTo(constraint.p2.transform.x,constraint.p2.transform.y)
      window.main.ctx.stroke()
    }
    getDistance(verletPos) {
        const direction = { x: this.p1.transform.x - this.p2.transform.x, y: this.p1.transform.y - this.p2.transform.y };
        const lineLength = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const unitDirection = { x: direction.x / lineLength, y: direction.y / lineLength };
      
        const pointToVerlet = { x: verletPos.x - this.p2.transform.x, y: verletPos.y - this.p2.transform.y };
      
        const dotProduct = pointToVerlet.x * unitDirection.x + pointToVerlet.y * unitDirection.y;
      
        let closestPoint;
        if (dotProduct < 0) {
          closestPoint = this.p2.transform;
        } else if (dotProduct > lineLength) {
          closestPoint = this.p1.transform;
        } else {
          closestPoint = { x: this.p2.transform.x + unitDirection.x * dotProduct, y: this.p2.transform.y + unitDirection.y * dotProduct };
        }
      
        const distance = Math.sqrt((closestPoint.x - verletPos.x) * (closestPoint.x - verletPos.x) + (closestPoint.y - verletPos.y) * (closestPoint.y - verletPos.y));
      
        return {distance,closestPoint};
    }
}