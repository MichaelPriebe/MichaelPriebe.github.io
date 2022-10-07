const engine = Matter.Engine.create();

let width = window.innerWidth
let height = window.innerHeight

class LinkSphere {

    constructor(size, name, color, url) {
        const element = document.createElement('div')
        element.draggable = true
        let click = false
        element.addEventListener('mousedown', function (e) {
            click = true
        })
        element.addEventListener('touchstart', function (e) {
            click = true
        })
        element.addEventListener('dragstart', function (e) {
            e.preventDefault()
            click = false
        })
        element.addEventListener('touchmove', function (e) {
            click = false
        })
        element.addEventListener('mouseup', function (e) {
            if (click) window.location = url
            click = false
        })
        element.addEventListener('touchend', function (e) {
            if (click) window.location = url
            click = false
        })
        const img = document.createElement('img')
        img.src = './svg/' + name + '.svg'
        element.appendChild(img)
        document.body.appendChild(element)
        element.className = 'link'
        const style = element.style
        style.width = size + 'vmin'
        style.height = size + 'vmin'
        style.backgroundColor = color
        this.element = element
        this.size = element.clientWidth
        const body = Matter.Bodies.circle(-1, -1, this.size / 2)
        Matter.Composite.add(engine.world, body)
        this.body = body
    }

    retrive() {
        const body = this.body
        const { x, y } = body.position;
        if (x < 0 || y < 0 || x > width || y > height) {
            Matter.Body.setPosition(body, { x: width / 2, y: height / 2 })
        }
    }

    render() {
        this.retrive()
        const body = this.body
        const element = this.element
        const size = element.clientWidth
        const scale = size / this.size
        Matter.Body.scale(body, scale, scale)
        this.size = size
        const { x, y } = body.position;
        const style = this.element.style
        style.left = x - size / 2 + 'px'
        style.top = y - size / 2 + 'px'
        style.transform = 'rotate(' + body.angle + 'rad)';
    }
}

const links = [
    new LinkSphere(Math.random() * 25 + 25, 'cashapp', '#00D632', 'https://cash.app/app/HHLTBJB'),
    new LinkSphere(Math.random() * 25 + 25, 'coinbase', '#0052FF', 'https://coinbase.com/join/priebe_z'),
    new LinkSphere(Math.random() * 25 + 25, 'fold', '#F2C42E', 'https://use.foldapp.com/r/YUWXWRXT'),
    new LinkSphere(Math.random() * 25 + 25, 'instagram', '#FF0076', 'https://www.instagram.com/mikuhl_/'),
    new LinkSphere(Math.random() * 25 + 25, 'lolli', '#A368FF', 'https://lolli.com/share//7TWQM9'),
    new LinkSphere(Math.random() * 25 + 25, 'mintmobile', '#68AF85', 'http://fbuy.me/rYETc'),
    new LinkSphere(Math.random() * 25 + 25, 'strike', '#000000', 'https://invite.strike.me/74R7R1'),
    new LinkSphere(Math.random() * 25 + 25, 'twitter', '#1D9BF0', 'https://twitter.com/mikuhl_'),
    new LinkSphere(Math.random() * 25 + 25, 'wealthfront', '#4840BB', 'https://www.wealthfront.com/c/affiliates/invited/AFFC-QUK9-GCKD-WWSD'),
]

const size = 100

const floor = Matter.Bodies.rectangle(0, 0, width + size * 2, size, { isStatic: true })
const left = Matter.Bodies.rectangle(0, height / 2, size, height + size * 2, { isStatic: true })
const right = Matter.Bodies.rectangle(0, height / 2, size, height + size * 2, { isStatic: true })
const ceil = Matter.Bodies.rectangle(0, -size / 2, width + size * 2, size, { isStatic: true })

const mouseConstraint = Matter.MouseConstraint.create(
    engine, { element: document.body }
)

Matter.Composite.add(engine.world, [floor, left, right, ceil, mouseConstraint])

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
    for (const link of links) link.render()
    Matter.Engine.update(engine);
    requestAnimationFrame(render);
}
render()