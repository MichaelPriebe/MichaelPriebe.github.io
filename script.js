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

Matter.Composite.add(engine.world, [floor, left, right, ceil]);

class PhysicsElement {
  constructor(element) {
    element.addEventListener("mousedown", this.mouseDown.bind(this));
    element.addEventListener("touchstart", this.mouseDown.bind(this));
    element.addEventListener("mousemove", this.mouseMove.bind(this));
    element.addEventListener("touchmove", this.mouseMove.bind(this));
    element.addEventListener("click", this.mouseUp.bind(this));
    element.addEventListener("touchend", this.mouseUp.bind(this));
    this.element = element;

    const width = element.clientWidth;
    const height = element.clientHeight;
    const body = Matter.Bodies.rectangle(
      element.offsetLeft + width / 2,
      element.offsetTop + height / 2,
      width,
      height
    );

    Matter.Composite.add(engine.world, body);
    this.width = width;
    this.height = height;
    this.body = body;

    Matter.Events.on(engine, "beforeUpdate", this.beforeUpdate.bind(this));
    Matter.Events.on(engine, "afterUpdate", this.afterUpdate.bind(this));
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

  beforeUpdate() {
    const element = this.element;
    const width = element.clientWidth;
    const height = element.clientHeight;
    Matter.Body.scale(this.body, width / this.width, height / this.height);
    this.width = width;
    this.height = height;
  }

  afterUpdate() {
    const body = this.body;
    const { x, y } = body.position;
    const element = this.element;
    const style = element.style;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const tx = -element.offsetLeft - width / 2 + x;
    const ty = -element.offsetTop - height / 2 + y;
    style.translate = `${tx}px ${ty}px`;
    style.transform = "rotate(" + body.angle + "rad)";
  }
}

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

window.addEventListener("load", function () {
  const html = document.documentElement;
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    element: html,
    angularStiffness: 0,
  });
  html.style.overflow = "hidden";
  Matter.Composite.add(engine.world, mouseConstraint);
  document.querySelectorAll(".physics").forEach((e) => new PhysicsElement(e));
  render();
});
