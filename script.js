const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];

// camera system (this is what makes it feel like space)
let camera = {
  x: 0,
  y: 0,
  scale: 1
};

let isDragging = false;
let dragStart = { x: 0, y: 0 };
let draggingNode = null;

// resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Node class
class Node {
  constructor(x, y, text = "Idea") {
    this.x = x;
    this.y = y;
    this.text = text;
    this.radius = 12;
  }

  draw() {
    const screenX = (this.x - camera.x) * camera.scale + canvas.width / 2;
    const screenY = (this.y - camera.y) * camera.scale + canvas.height / 2;

    // glow
    ctx.beginPath();
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#7aa2ff";

    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.shadowBlur = 0;

    // text
    ctx.fillStyle = "#aaa";
    ctx.font = "12px Arial";
    ctx.fillText(this.text, screenX + 15, screenY + 4);
  }
}

// add node
function addNode() {
  nodes.push(
    new Node(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 800,
      "Idea"
    )
  );
}

// click to add node
canvas.addEventListener("click", (e) => {
  const x = (e.clientX - canvas.width / 2) / camera.scale + camera.x;
  const y = (e.clientY - canvas.height / 2) / camera.scale + camera.y;

  nodes.push(new Node(x, y, "Idea"));
});

// drag nodes
canvas.addEventListener("mousedown", (e) => {
  const mouseX = (e.clientX - canvas.width / 2) / camera.scale + camera.x;
  const mouseY = (e.clientY - canvas.height / 2) / camera.scale + camera.y;

  draggingNode = nodes.find(n =>
    Math.hypot(n.x - mouseX, n.y - mouseY) < 20
  );

  if (!draggingNode) {
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingNode) {
    draggingNode.x = (e.clientX - canvas.width / 2) / camera.scale + camera.x;
    draggingNode.y = (e.clientY - canvas.height / 2) / camera.scale + camera.y;
  }

  if (isDragging && !draggingNode) {
    camera.x -= (e.clientX - dragStart.x) / camera.scale;
    camera.y -= (e.clientY - dragStart.y) / camera.scale;

    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  draggingNode = null;
});

// zoom
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomIntensity = 0.1;
  camera.scale += e.deltaY * -zoomIntensity * 0.01;

  camera.scale = Math.min(Math.max(0.3, camera.scale), 2);
});

// connections
function drawConnections() {
  ctx.strokeStyle = "rgba(120,160,255,0.15)";

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dist = Math.hypot(a.x - b.x, a.y - b.y);

      if (dist < 220) {
        const ax = (a.x - camera.x) * camera.scale + canvas.width / 2;
        const ay = (a.y - camera.y) * camera.scale + canvas.height / 2;
        const bx = (b.x - camera.x) * camera.scale + canvas.width / 2;
        const by = (b.y - camera.y) * camera.scale + canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }
  }
}

// animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawConnections();
  nodes.forEach(n => n.draw());

  requestAnimationFrame(animate);
}

animate();
