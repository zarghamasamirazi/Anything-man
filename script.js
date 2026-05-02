const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];

let camera = { x: 0, y: 0, scale: 1 };

let isPanning = false;
let lastMouse = { x: 0, y: 0 };
let selectedNode = null;

// 🧠 categories = brain structure
const categories = {
  Health: "#7aa2ff",
  Music: "#ff7ad9",
  Style: "#ffd27a",
  Social: "#7affb2",
  Work: "#b27aff",
  Default: "#ffffff"
};

class Node {
  constructor(x, y, text = "Idea", category = "Default") {
    this.x = x;
    this.y = y;
    this.text = text;
    this.category = category;
    this.radius = 14;
  }

  draw() {
    const sx = (this.x - camera.x) * camera.scale + canvas.width / 2;
    const sy = (this.y - camera.y) * camera.scale + canvas.height / 2;

    ctx.beginPath();
    ctx.shadowBlur = 20;
    ctx.shadowColor = categories[this.category];

    ctx.arc(sx, sy, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = categories[this.category];
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ddd";
    ctx.font = "12px Arial";
    ctx.fillText(this.text, sx + 15, sy + 5);
  }
}

// 🧠 smarter node creation
function addNode(x, y) {
  const name = prompt("Node name:");
  const cat = prompt("Category (Health, Music, Style, Social, Work):");

  nodes.push(
    new Node(
      x,
      y,
      name || "Idea",
      categories[cat] ? cat : "Default"
    )
  );
}

// click
canvas.addEventListener("click", (e) => {
  const x = (e.clientX - canvas.width / 2) / camera.scale + camera.x;
  const y = (e.clientY - canvas.height / 2) / camera.scale + camera.y;

  let clicked = nodes.find(n =>
    Math.hypot(n.x - x, n.y - y) < 18
  );

  if (clicked) {
    selectedNode = clicked;
  } else {
    addNode(x, y);
  }
});

// pan
canvas.addEventListener("mousedown", (e) => {
  isPanning = true;
  lastMouse = { x: e.clientX, y: e.clientY };
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

// 🔥 SMART CONNECTION LOGIC
function shouldConnect(a, b) {
  if (a.category === b.category) return true;

  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  if (dist < 180) return true;

  return false;
}

function drawConnections() {
  ctx.strokeStyle = "rgba(150,180,255,0.2)";
  ctx.lineWidth = 1;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      if (shouldConnect(a, b)) {
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
