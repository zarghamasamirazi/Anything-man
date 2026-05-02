const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];
let draggingNode = null;

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.connections = [];
  }

  draw() {
    // glow effect
    ctx.beginPath();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#7aa2ff";

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.shadowBlur = 0;
  }
}

function addNode() {
  nodes.push(new Node(
    Math.random() * canvas.width,
    Math.random() * canvas.height
  ));
}

canvas.addEventListener("click", (e) => {
  nodes.push(new Node(e.clientX, e.clientY));
});

// drag system
canvas.addEventListener("mousedown", (e) => {
  draggingNode = nodes.find(n =>
    Math.hypot(n.x - e.clientX, n.y - e.clientY) < 15
  );
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingNode) {
    draggingNode.x = e.clientX;
    draggingNode.y = e.clientY;
  }
});

canvas.addEventListener("mouseup", () => {
  draggingNode = null;
});

function drawConnections() {
  ctx.strokeStyle = "rgba(120,160,255,0.2)";
  ctx.lineWidth = 1;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dist = Math.hypot(a.x - b.x, a.y - b.y);

      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
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
