const engine = Matter.Engine.create();

let width = window.innerWidth
let height = window.innerHeight
const size = 1000
const floor = Matter.Bodies.rectangle(0, 0, width, size, { isStatic: true })
const left = Matter.Bodies.rectangle(0, 0, size, height, { isStatic: true })
const right = Matter.Bodies.rectangle(0, 0, size, height, { isStatic: true })
const ceil = Matter.Bodies.rectangle(0, 0, width, size, { isStatic: true })

const mouseConstraint = Matter.MouseConstraint.create(
    engine, { element: document.body }
)

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
        this.draggable = true

        const size = Math.random() * 20 + 20
        this.style.width = size + "vmin"
        this.style.height = size + "vmin"
        this.style.backgroundColor = this.getAttribute("color")

        this.size = this.clientWidth
        this.body = Matter.Bodies.circle(width / 2, height / 2, this.size / 2)
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
            x: Matter.Common.clamp(x, 0, width),
            y: Matter.Common.clamp(y, 0, height),
        })
    }

    beforeUpdate() {
        this.clampPosition()
        const size = this.clientWidth
        const scale = size / this.size
        if (scale != 1) Matter.Body.scale(this.body, scale, scale)
        this.size = size
    }

    afterUpdate() {
        this.clampPosition()
        const { x, y } = this.body.position;
        this.style.left = x - this.size / 2 + "px"
        this.style.top = y - this.size / 2 + "px"
        this.style.transform = "rotate(" + this.body.angle + "rad)";
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
    const scaleX = window.innerWidth / width
    const scaleY = window.innerHeight / height
    width = window.innerWidth
    height = window.innerHeight
    Matter.Body.setPosition(floor, { x: width / 2, y: height + size / 2 })
    Matter.Body.scale(floor, scaleX, 1)
    Matter.Body.setPosition(left, { x: -size / 2, y: height / 2 })
    Matter.Body.scale(left, 1, scaleY)
    Matter.Body.setPosition(right, { x: width + size / 2, y: height / 2 })
    Matter.Body.scale(right, 1, scaleY)
    Matter.Body.setPosition(ceil, { x: width / 2, y: -size / 2 })
    Matter.Body.scale(ceil, scaleX, 1)
    Matter.Engine.update(engine);
    requestAnimationFrame(render);
}
render()