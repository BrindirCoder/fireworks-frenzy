const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 🔊 Sound files (same file used for both launch and explosion in your case)
const launchSound = new Audio("./assets/sounds/sound.mp3");
const explosionSound = new Audio("./assets/sounds/sound.mp3");

// 🔇 Control flag
let soundEnabled = true;

const fireworks = [];
const particles = [];

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height / 2;
    this.speed = 3;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    // 🚀 Play launch sound if enabled
    if (soundEnabled) {
      launchSound.currentTime = 0;
      launchSound.play().catch(() => {});
    }
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.explode();
      return true;
    }
    this.draw();
    return false;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  explode() {
    // 💥 Play explosion sound if enabled
    if (soundEnabled) {
      explosionSound.currentTime = 0;
      explosionSound.play().catch(() => {});
    }

    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 4 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.color = color;
    this.alpha = 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.02;
    this.draw();
    return this.alpha <= 0;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.03) {
    fireworks.push(new Firework());
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    if (fireworks[i].update()) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].update()) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();

// 🔄 Resize canvas on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 🖱️ Enable sound on first user click (for autoplay policy)
document.addEventListener("click", () => {
  if (soundEnabled) {
    launchSound.play().catch(() => {});
    explosionSound.play().catch(() => {});
  }
});

// 🎛️ Toggle button logic
const toggleBtn = document.getElementById("soundToggle");

toggleBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  toggleBtn.textContent = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
});
