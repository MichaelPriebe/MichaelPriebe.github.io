const engine = Matter.Engine.create();
const thickness = Number.MAX_SAFE_INTEGER;
const floor = Matter.Bodies.rectangle(0, 0, thickness, thickness, {
  isStatic: true,
});
const left = Matter.Bodies.rectangle(0, 0, thickness, thickness, {
  isStatic: true,
});
const right = Matter.Bodies.rectangle(0, 0, thickness, thickness, {
  isStatic: true,
});
const ceil = Matter.Bodies.rectangle(0, 0, thickness, thickness, {
  isStatic: true,
});

const mouseConstraint = Matter.MouseConstraint.create(engine, {
  element: document.body,
});

Matter.Composite.add(engine.world, [floor, left, right, ceil, mouseConstraint]);

class LinkBallElement {
  constructor(element) {
    this.element = element;
    this.element.addEventListener("mousedown", this.mouseDown.bind(this));
    this.element.addEventListener("touchstart", this.mouseDown.bind(this));
    this.element.addEventListener("mousemove", this.mouseMove.bind(this));
    this.element.addEventListener("touchmove", this.mouseMove.bind(this));
    this.element.addEventListener("click", this.mouseUp.bind(this));
    this.element.addEventListener("touchend", this.mouseUp.bind(this));

    const size = Math.random() * 20 + 20;
    const style = this.element.style;
    style.width = size + "vmin";
    style.height = size + "vmin";

    this.body = Matter.Bodies.circle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      this.element.clientWidth / 2
    );
    Matter.Composite.add(engine.world, this.body);
    Matter.Events.on(engine, "beforeUpdate", this.beforeUpdate.bind(this));
    Matter.Events.on(engine, "afterUpdate", this.afterUpdate.bind(this));
  }

  clampPosition() {
    const { x, y } = this.body.position;
    Matter.Body.setPosition(this.body, {
      x: Matter.Common.clamp(x, 0, window.innerWidth),
      y: Matter.Common.clamp(y, 0, window.innerHeight),
    });
  }

  beforeUpdate() {
    const body = this.body;
    const scale = this.element.clientWidth / 2 / body.circleRadius;
    if (scale == 1) return;
    Matter.Body.scale(body, scale, scale);
  }

  afterUpdate() {
    this.clampPosition();
    const style = this.element.style;
    const body = this.body;
    const { x, y } = body.position;
    style.left = x - body.circleRadius + "px";
    style.top = y - body.circleRadius + "px";
    style.transform = "rotate(" + body.angle + "rad)";
  }

  mouseDown(event) {
    event.preventDefault();
    this.clicked = true;
  }

  mouseMove(event) {
    event.preventDefault();
    if (!this.clicked) return;
    this.clicked = false;
    this.element.classList.add("grabbed");
  }

  mouseUp(event) {
    this.element.classList.remove("grabbed");
    if (this.clicked)
      return (window.location = this.element.getAttribute("href"));
    event.preventDefault();
    this.clicked = false;
  }
}

window.addEventListener("deviceorientation", function (event) {
  const orientation = window.orientation;
  if (orientation == undefined) return;
  const gravity = engine.gravity;
  if (orientation == 0) {
    gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Matter.Common.clamp(event.beta, -90, 90) / 90;
  } else if (orientation == 180) {
    gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Matter.Common.clamp(-event.beta, -90, 90) / 90;
  } else if (orientation == 90) {
    gravity.x = Matter.Common.clamp(event.beta, -90, 90) / 90;
    gravity.y = Matter.Common.clamp(-event.gamma, -90, 90) / 90;
  } else if (orientation == -90) {
    gravity.x = Matter.Common.clamp(-event.beta, -90, 90) / 90;
    gravity.y = Matter.Common.clamp(event.gamma, -90, 90) / 90;
  }
});

function render() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  Matter.Body.setPosition(floor, { x: width / 2, y: height + thickness / 2 });
  Matter.Body.setPosition(left, { x: -thickness / 2, y: height / 2 });
  Matter.Body.setPosition(right, { x: width + thickness / 2, y: height / 2 });
  Matter.Body.setPosition(ceil, { x: width / 2, y: -thickness / 2 });
  Matter.Engine.update(engine);
  requestAnimationFrame(render);
}

const html = document.querySelector("html");
html.classList.remove("no-js");
html.classList.add("js");
document.querySelectorAll(".link").forEach((e) => new LinkBallElement(e));
render();
