const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];

let camera = { x: 0, y: 0, scale: 1 };

let draggingNode = null;
let isPanning = false;
let lastMouse = { x: 0, y: 0 };
let selectedNode = null;

class Node {
  constructor(x, y, text = "Idea") {
    this.x = x;
    this.y = y;
    this.text = text;
    this.radius = 14;
  }

  draw() {
    const sx = (this.x - camera.x) * camera.scale + canvas.width / 2;
    const sy = (this.y - camera.y) * camera.scale + canvas.height / 2;

    // glow
    ctx.beginPath();
    ctx.shadowBlur = 25;
    ctx.shadowColor = this === selectedNode ? "#ffcc66" : "#7aa2ff";

    ctx.arc(sx, sy, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this === selectedNode ? "#ffd27a" : "#ffffff";
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#aaa";
    ctx.font = "12px Arial";
    ctx.fillText(this.text, sx + 15, sy + 5);
  }
}

function addNode(x, y, text = "Idea") {
  nodes.push(new Node(x, y, text));
}

// click = select or create
canvas.addEventListener("click", (e) => {
  const x = (e.clientX - canvas.width / 2) / camera.scale + camera.x;
  const y = (e.clientY - canvas.height / 2) / camera.scale + camera.y;

  let clicked = nodes.find(n =>
    Math.hypot(n.x - x, n.y - y) < 18
  );

  if (clicked) {
    selectedNode = clicked;

    let newText = prompt("Edit idea:", clicked.text);
    if (newText !== null) clicked.text = newText;

  } else {
    addNode(x, y);
  }
});

// pan system
canvas.addEventListener("mousedown", (e) => {
  lastMouse = { x: e.clientX, y: e.clientY };
  isPanning = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPanning) {
    camera.x -= (e.clientX - lastMouse.x) / camera.scale;
    camera.y -= (e.clientY - lastMouse.y) / camera.scale;

    lastMouse = { x: e.clientX, y: e.clientY };
  }
});

canvas.addEventListener("mouseup", () => {
  isPanning = false;
});

// zoom
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  camera.scale += e.deltaY * -0.001;
  camera.scale = Math.min(Math.max(0.4, camera.scale), 2);
});

// connections
function drawConnections() {
  ctx.strokeStyle = "rgba(120,160,255,0.15)";

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dist = Math.hypot(a.x - b.x, a.y - b.y);

      if (dist < 200) {
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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawConnections();
  nodes.forEach(n => n.draw());

  requestAnimationFrame(animate);
}

animate();
