const engine = Matter.Engine.create()
const thickness = Number.MAX_SAFE_INTEGER
const floor = Matter.Bodies.rectangle(0, 0, thickness, thickness, { isStatic: true })
const left = Matter.Bodies.rectangle(0, 0, thickness, thickness, { isStatic: true })
const right = Matter.Bodies.rectangle(0, 0, thickness, thickness, { isStatic: true })
const ceil = Matter.Bodies.rectangle(0, 0, thickness, thickness, { isStatic: true })

const mouseConstraint = Matter.MouseConstraint.create(engine, { element: document.body })

Matter.Composite.add(engine.world, [floor, left, right, ceil, mouseConstraint])

class LinkBallElement extends HTMLDivElement {

    constructor() {
        super()
        this.addEventListener("mousedown", this.mouseDown.bind(this))
        this.addEventListener("touchstart", this.mouseDown.bind(this))
        this.addEventListener("dragstart", this.mouseMove.bind(this))
        this.addEventListener("touchmove", this.mouseMove.bind(this))
        this.addEventListener("click", this.mouseUp.bind(this))
        this.addEventListener("touchend", this.mouseUp.bind(this))
    }

    connectedCallback() {
        if (this.initialized) return
        this.initialized = true

        const size = Math.random() * 20 + 20
        const style = this.style
        style.width = size + "vmin"
        style.height = size + "vmin"
        style.backgroundColor = this.getAttribute("color")

        this.body = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, this.clientWidth / 2)
        Matter.Composite.add(engine.world, this.body)
        Matter.Events.on(engine, "beforeUpdate", this.beforeUpdate.bind(this))
        Matter.Events.on(engine, "afterUpdate", this.afterUpdate.bind(this))

        const img = document.createElement("img")
        img.src = './svg/' + this.getAttribute("name") + '.svg'
        this.appendChild(img)
    }

    clampPosition() {
        const { x, y } = this.body.position
        Matter.Body.setPosition(this.body, {
            x: Matter.Common.clamp(x, 0, window.innerWidth),
            y: Matter.Common.clamp(y, 0, window.innerHeight),
        })
    }

    beforeUpdate() {
        const body = this.body
        const scale = this.clientWidth / 2 / body.circleRadius
        if (scale == 1) return
        Matter.Body.scale(body, scale, scale)
    }

    afterUpdate() {
        this.clampPosition()
        const style = this.style
        const body = this.body
        const { x, y } = body.position;
        style.left = x - body.circleRadius + "px"
        style.top = y - body.circleRadius + "px"
        style.transform = "rotate(" + body.angle + "rad)";
    }

    mouseDown() {
        this.click = true
    }

    mouseMove(event) {
        event.preventDefault()
        this.click = false
    }

    mouseUp() {
        if (!this.click) return
        window.location = this.getAttribute("url")
    }

}

customElements.define('link-ball', LinkBallElement, { extends: "div" })

function render() {
const width = window.innerWidth
const height = window.innerHeight
Matter.Body.setPosition(floor, { x: width / 2, y: height + thickness / 2 })
Matter.Body.setPosition(left, { x: -thickness / 2, y: height / 2 })
Matter.Body.setPosition(right, { x: width + thickness / 2, y: height / 2 })
Matter.Body.setPosition(ceil, { x: width / 2, y: -thickness / 2 })
    Matter.Engine.update(engine);
    requestAnimationFrame(render);
}

render()