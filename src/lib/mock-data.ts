/**
 * Vibe UI Show — Mock Data
 *
 * Rich demo data for local development and visual testing.
 * All data is typed against the database schema.
 */

import type {
  Profile,
  Project,
  ProjectWithAuthor,
  Comment,
  CommentWithAuthor,
} from "@/types/database";

// ============================================================
// Mock Profiles
// ============================================================

export const mockProfiles: Profile[] = [
  {
    id: "user-001",
    username: "astrid_wave",
    display_name: "Astrid Wave",
    avatar_url: null,
    bio: "Creative coder & generative art enthusiast. I make pixels dance.",
    website: "https://astridwave.dev",
    created_at: "2024-06-15T10:00:00Z",
    updated_at: "2024-09-20T14:30:00Z",
  },
  {
    id: "user-002",
    username: "pixel_nomad",
    display_name: "Kai Chen",
    avatar_url: null,
    bio: "WebGL wizard. Building immersive 3D experiences for the web.",
    website: "https://kaichen.xyz",
    created_at: "2024-04-01T08:15:00Z",
    updated_at: "2024-10-05T11:00:00Z",
  },
  {
    id: "user-003",
    username: "css_sorceress",
    display_name: "Luna Park",
    avatar_url: null,
    bio: "Pushing the boundaries of CSS. No JavaScript required.",
    website: null,
    created_at: "2024-07-22T16:45:00Z",
    updated_at: "2024-10-10T09:20:00Z",
  },
  {
    id: "user-004",
    username: "glitch_garden",
    display_name: "Remy Dubois",
    avatar_url: null,
    bio: "Digital artist exploring the beauty of controlled chaos.",
    website: "https://glitchgarden.art",
    created_at: "2024-05-10T12:00:00Z",
    updated_at: "2024-10-12T07:45:00Z",
  },
];

// Helper to look up a profile by ID
function getProfile(id: string): Profile {
  return mockProfiles.find((p) => p.id === id)!;
}

// ============================================================
// Code Snippets for Projects
// ============================================================

const threeJsCubeCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: #07080f; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    // Robust 3D Neon Cube with self-contained renderer + Three.js enhancement
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    let w, h;
    function resize() {
      w = c.width = window.innerWidth || 300;
      h = c.height = window.innerHeight || 200;
    }
    window.addEventListener('resize', resize);
    resize();

    // 3D vertices for a cube
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];
    const edges = [
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7]
    ];

    let rx = 0, ry = 0, rz = 0;

    function render() {
      ctx.fillStyle = 'rgba(7, 8, 15, 0.25)';
      ctx.fillRect(0, 0, w, h);

      rx += 0.015;
      ry += 0.02;
      rz += 0.008;

      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;
        // Rotate Z
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = y2 * cosZ + x1 * sinZ;

        const distance = 3.2;
        const scale = Math.min(w, h) * 0.38 / (z2 + distance);
        return [
          w / 2 + x3 * scale,
          h / 2 + y3 * scale,
          z2
        ];
      });

      // Draw glowing edges
      edges.forEach(([i, j]) => {
        const [x1, y1] = projected[i];
        const [x2, y2] = projected[j];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#06b6d4';
        ctx.stroke();

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw glowing vertices
      projected.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f43f5e';
        ctx.fill();
      });

      requestAnimationFrame(render);
    }
    render();
  </script>
</body>
</html>`;

const cssArtCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      overflow: hidden;
    }
    .orb-container {
      position: relative;
      width: 300px;
      height: 300px;
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    .orb:nth-child(1) {
      width: 200px; height: 200px;
      background: radial-gradient(circle at 30% 30%, #06b6d4, transparent 70%);
      top: 20px; left: 20px;
      animation-delay: 0s;
    }
    .orb:nth-child(2) {
      width: 180px; height: 180px;
      background: radial-gradient(circle at 70% 30%, #8b5cf6, transparent 70%);
      top: 60px; left: 80px;
      animation-delay: -2s;
    }
    .orb:nth-child(3) {
      width: 160px; height: 160px;
      background: radial-gradient(circle at 50% 70%, #f59e0b, transparent 70%);
      top: 80px; left: 40px;
      animation-delay: -4s;
    }
    .orb-container::after {
      content: '';
      position: absolute;
      inset: -20px;
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border-radius: 50%;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }
  </style>
</head>
<body>
  <div class="orb-container">
    <div class="orb"></div>
    <div class="orb"></div>
    <div class="orb"></div>
  </div>
</body>
</html>`;

const particleSystemCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: #0a0a0f; }
    canvas { display: block; cursor: crosshair; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    let mouse = { x: 0, y: 0 };

    function resize() {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.decay = 0.005 + Math.random() * 0.01;
        this.radius = 1 + Math.random() * 3;
        this.hue = 180 + Math.random() * 60;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02;
        this.life -= this.decay;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.life, 0, Math.PI * 2);
        ctx.fillStyle = \`hsla(\${this.hue}, 80%, 60%, \${this.life})\`;
        ctx.fill();
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    });

    // Ambient particles
    setInterval(() => {
      particles.push(new Particle(Math.random() * W, H + 10));
    }, 50);

    function animate() {
      requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
      ctx.fillRect(0, 0, W, H);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
      }
    }
    animate();
  </script>
</body>
</html>`;

const generativeFlowFieldCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: #0a0a0f; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const cols = Math.floor(canvas.width / 20);
    const rows = Math.floor(canvas.height / 20);
    let t = 0;

    const agents = Array.from({ length: 800 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      hue: Math.random() * 60 + 250,
    }));

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function noise(x, y) {
      return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * Math.PI * 2;
    }

    function animate() {
      requestAnimationFrame(animate);
      t += 0.003;

      for (const a of agents) {
        const angle = noise(a.x, a.y);
        a.x += Math.cos(angle) * 1.5;
        a.y += Math.sin(angle) * 1.5;

        ctx.beginPath();
        ctx.arc(a.x, a.y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = \`hsla(\${a.hue}, 70%, 60%, 0.3)\`;
        ctx.fill();

        if (a.x < 0 || a.x > canvas.width || a.y < 0 || a.y > canvas.height) {
          a.x = Math.random() * canvas.width;
          a.y = Math.random() * canvas.height;
        }
      }
    }
    animate();

    window.addEventListener('resize', () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  </script>
</body>
</html>`;

const audioVisualizerCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body {
      overflow: hidden;
      background: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    canvas { display: block; }
    .start-btn {
      position: absolute;
      padding: 12px 24px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #06b6d4;
      font-family: system-ui;
      font-size: 14px;
      cursor: pointer;
      border-radius: 8px;
    }
    .start-btn:hover {
      background: rgba(6, 182, 212, 0.2);
    }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    function resize() {
      canvas.width = window.innerWidth || 300;
      canvas.height = window.innerHeight || 200;
    }
    window.addEventListener('resize', resize);
    resize();

    const bars = 128;

    // Simulate audio data with sine waves
    let time = 0;
    const fakeData = new Uint8Array(bars);

    function animate() {
      requestAnimationFrame(animate);
      time += 0.025;
      const center = { x: canvas.width / 2, y: canvas.height / 2 };

      for (let i = 0; i < bars; i++) {
        fakeData[i] = Math.abs(
          Math.sin(i * 0.1 + time) * 128 +
          Math.sin(i * 0.05 + time * 1.5) * 64 +
          Math.sin(time * 2) * 32
        );
      }
        fakeData[i] = Math.abs(
          Math.sin(i * 0.1 + time) * 128 +
          Math.sin(i * 0.05 + time * 1.5) * 64 +
          Math.sin(time * 2) * 32
        );
      }

      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const amplitude = fakeData[i] / 255;
        const r = 100 + amplitude * 150;

        const x1 = center.x + Math.cos(angle) * 100;
        const y1 = center.y + Math.sin(angle) * 100;
        const x2 = center.x + Math.cos(angle) * r;
        const y2 = center.y + Math.sin(angle) * r;

        const hue = (i / bars) * 60 + 170;
        ctx.strokeStyle = \`hsla(\${hue}, 80%, 60%, \${0.5 + amplitude * 0.5})\`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  </script>
</body>
</html>`;

const morphingShapesCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      overflow: hidden;
    }
    svg { width: 400px; height: 400px; }
    .morph-path {
      fill: none;
      stroke-width: 2;
      animation: morph 8s ease-in-out infinite;
    }
    .morph-path:nth-child(1) { stroke: #06b6d4; animation-delay: 0s; }
    .morph-path:nth-child(2) { stroke: #8b5cf6; animation-delay: -2s; }
    .morph-path:nth-child(3) { stroke: #f59e0b; animation-delay: -4s; }
    .morph-path:nth-child(4) { stroke: #f43f5e; animation-delay: -6s; }
    @keyframes morph {
      0%, 100% {
        d: path("M 200,50 C 300,50 350,150 350,200 C 350,300 300,350 200,350 C 100,350 50,300 50,200 C 50,100 100,50 200,50");
      }
      25% {
        d: path("M 200,80 C 280,80 320,120 320,200 C 320,280 280,320 200,320 C 120,320 80,280 80,200 C 80,120 120,80 200,80");
      }
      50% {
        d: path("M 200,60 C 330,100 340,170 300,250 C 260,330 170,340 100,280 C 30,220 60,120 140,70 C 160,58 180,55 200,60");
      }
      75% {
        d: path("M 200,100 C 260,60 340,140 300,200 C 260,260 340,340 200,300 C 60,260 60,140 140,160 C 160,166 180,120 200,100");
      }
    }
  </style>
</head>
<body>
  <svg viewBox="0 0 400 400">
    <path class="morph-path" />
    <path class="morph-path" />
    <path class="morph-path" />
    <path class="morph-path" />
  </svg>
</body>
</html>`;

const matrixRainCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: #0a0a0f; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the column is bright cyan
        if (drops[i] > 0) {
          ctx.fillStyle = '#06b6d4';
          ctx.font = \`bold \${fontSize}px monospace\`;
          ctx.fillText(char, x, y);

          // Trail fades to dark
          ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
          ctx.font = \`\${fontSize}px monospace\`;
          const prevChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(prevChar, x, y - fontSize);
        }

        drops[i]++;

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
      }
    }

    setInterval(draw, 50);

    window.addEventListener('resize', () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    });
  </script>
</body>
</html>`;

const p5jsSketchCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: #070812; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth || 300;
      h = canvas.height = window.innerHeight || 200;
    }
    window.addEventListener('resize', resize);
    resize();

    const nodes = [];
    const NUM = 70;
    for (let i = 0; i < NUM; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        radius: Math.random() * 3 + 2,
        hue: Math.random() * 60 + 170
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(7, 8, 18, 0.2)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < NUM; i++) {
        let p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(' + p.hue + ', 100%, 70%)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'hsl(' + p.hue + ', 100%, 60%)';
        ctx.fill();

        for (let j = i + 1; j < NUM; j++) {
          let p2 = nodes[j];
          let d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'hsla(' + p.hue + ', 90%, 65%, ' + (1 - d / 90) * 0.4 + ')';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>`;

const shaderGradientCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: #0a0a0f; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const gl = canvas.getContext('webgl');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const vsSource = \`
      attribute vec2 pos;
      void main() { gl_Position = vec4(pos, 0.0, 1.0); }
    \`;

    const fsSource = \`
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      vec3 palette(float t) {
        vec3 a = vec3(0.5);
        vec3 b = vec3(0.5);
        vec3 c = vec3(1.0);
        vec3 d = vec3(0.02, 0.45, 0.65);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
        float d = length(uv);
        vec3 col = palette(d + time * 0.2);
        d = sin(d * 8.0 + time) / 8.0;
        d = abs(d);
        d = 0.02 / d;
        col *= d;
        gl_FragColor = vec4(col, 1.0);
      }
    \`;

    function createShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');

    function render(t) {
      requestAnimationFrame(render);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, t * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(render);

    window.addEventListener('resize', () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    });
  </script>
</body>
</html>`;

const interactiveGridCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      overflow: hidden;
      background: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .grid {
      display: grid;
      gap: 4px;
    }
    .cell {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.03);
      transition: all 0.4s ease;
    }
  </style>
</head>
<body>
  <div class="grid" id="grid"></div>
  <script>
    const grid = document.getElementById('grid');
    const cols = Math.floor(innerWidth / 24);
    const rows = Math.floor(innerHeight / 24);
    grid.style.gridTemplateColumns = \`repeat(\${cols}, 20px)\`;

    const cells = [];
    for (let i = 0; i < cols * rows; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      grid.appendChild(cell);
      cells.push(cell);
    }

    document.addEventListener('mousemove', (e) => {
      const gridRect = grid.getBoundingClientRect();
      const mx = e.clientX - gridRect.left;
      const my = e.clientY - gridRect.top;
      const col = Math.floor(mx / 24);
      const row = Math.floor(my / 24);

      cells.forEach((cell, i) => {
        const cellCol = i % cols;
        const cellRow = Math.floor(i / cols);
        const dx = cellCol - col;
        const dy = cellRow - row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 8;

        if (dist < radius) {
          const intensity = 1 - dist / radius;
          const hue = 190 + intensity * 80;
          cell.style.background = \`hsla(\${hue}, 80%, 60%, \${intensity * 0.8})\`;
          cell.style.transform = \`scale(\${1 + intensity * 0.5})\`;
        } else {
          cell.style.background = 'rgba(255, 255, 255, 0.03)';
          cell.style.transform = 'scale(1)';
        }
      });
    });
  </script>
</body>
</html>`;

// ============================================================
// Mock Projects
// ============================================================

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    author_id: "user-002",
    title: "Neon Cube",
    description:
      "A rotating 3D cube rendered with Three.js, featuring neon wireframe edges and Phong shading. Fully responsive and mesmerizing.",
    code: threeJsCubeCode,
    slug: "neon-cube",
    tags: ["Three.js", "WebGL", "3D", "Animation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.7,
    rating_count: 42,
    favorite_count: 28,
    view_count: 1250,
    is_featured: true,
    created_at: "2024-09-01T12:00:00Z",
    updated_at: "2024-09-15T08:30:00Z",
  },
  {
    id: "proj-002",
    author_id: "user-003",
    title: "Glassmorphic Orbs",
    description:
      "Pure CSS floating orbs with radial gradients and backdrop blur, creating a beautiful glassmorphism effect. Zero JavaScript required.",
    code: cssArtCode,
    slug: "glassmorphic-orbs",
    tags: ["CSS Art", "Glassmorphism", "Animation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.5,
    rating_count: 36,
    favorite_count: 45,
    view_count: 2100,
    is_featured: true,
    created_at: "2024-08-20T09:00:00Z",
    updated_at: "2024-09-10T14:00:00Z",
  },
  {
    id: "proj-003",
    author_id: "user-001",
    title: "Cosmic Particles",
    description:
      "An interactive particle system that follows your mouse cursor. Ambient particles rise from below while cursor trails create colorful bursts.",
    code: particleSystemCode,
    slug: "cosmic-particles",
    tags: ["Canvas", "Interactive", "Generative", "Animation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.8,
    rating_count: 58,
    favorite_count: 72,
    view_count: 3400,
    is_featured: true,
    created_at: "2024-07-15T16:00:00Z",
    updated_at: "2024-08-01T11:00:00Z",
  },
  {
    id: "proj-004",
    author_id: "user-004",
    title: "Flow Field Dreamscape",
    description:
      "Hundreds of particles trace smooth paths through a noise-based flow field, creating an ever-evolving generative art piece in violet hues.",
    code: generativeFlowFieldCode,
    slug: "flow-field-dreamscape",
    tags: ["Canvas", "Generative", "Math", "Animation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.9,
    rating_count: 64,
    favorite_count: 89,
    view_count: 4200,
    is_featured: true,
    created_at: "2024-08-05T10:00:00Z",
    updated_at: "2024-09-20T15:00:00Z",
  },
  {
    id: "proj-005",
    author_id: "user-001",
    title: "Radial Visualizer",
    description:
      "A circular audio visualizer with simulated frequency data. Bars radiate outward from a central ring, pulsing to generated sine wave patterns.",
    code: audioVisualizerCode,
    slug: "radial-visualizer",
    tags: ["Canvas", "Audio", "Interactive", "Animation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.3,
    rating_count: 29,
    favorite_count: 31,
    view_count: 1800,
    is_featured: false,
    created_at: "2024-09-10T14:00:00Z",
    updated_at: "2024-09-25T09:00:00Z",
  },
  {
    id: "proj-006",
    author_id: "user-003",
    title: "SVG Morph Paths",
    description:
      "Four SVG paths continuously morph between organic shapes using CSS animations. Each path glows in a different neon color.",
    code: morphingShapesCode,
    slug: "svg-morph-paths",
    tags: ["CSS Art", "SVG", "Animation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.1,
    rating_count: 22,
    favorite_count: 18,
    view_count: 950,
    is_featured: false,
    created_at: "2024-09-18T11:00:00Z",
    updated_at: "2024-10-01T07:00:00Z",
  },
  {
    id: "proj-007",
    author_id: "user-002",
    title: "Matrix Rain",
    description:
      "Classic Matrix-style digital rain effect using Canvas, with Japanese katakana characters falling in cyan columns across the screen.",
    code: matrixRainCode,
    slug: "matrix-rain",
    tags: ["Canvas", "Animation", "Retro"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.6,
    rating_count: 51,
    favorite_count: 55,
    view_count: 2800,
    is_featured: false,
    created_at: "2024-08-12T08:00:00Z",
    updated_at: "2024-09-05T12:00:00Z",
  },
  {
    id: "proj-008",
    author_id: "user-004",
    title: "Swarm Intelligence",
    description:
      "A p5.js sketch with 200 particles that exhibit flocking behavior. Move your mouse to attract them; watch them form connection networks.",
    code: p5jsSketchCode,
    slug: "swarm-intelligence",
    tags: ["p5.js", "Interactive", "Generative", "Simulation"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.4,
    rating_count: 38,
    favorite_count: 41,
    view_count: 2200,
    is_featured: false,
    created_at: "2024-09-05T13:00:00Z",
    updated_at: "2024-09-28T16:00:00Z",
  },
  {
    id: "proj-009",
    author_id: "user-001",
    title: "Shader Gradient",
    description:
      "A mesmerizing WebGL fragment shader that renders animated concentric rings with a mathematically-driven color palette function.",
    code: shaderGradientCode,
    slug: "shader-gradient",
    tags: ["WebGL", "Shader", "Generative", "Math"],
    status: "approved",
    thumbnail_url: null,
    avg_rating: 4.6,
    rating_count: 33,
    favorite_count: 37,
    view_count: 1650,
    is_featured: false,
    created_at: "2024-09-22T09:00:00Z",
    updated_at: "2024-10-08T10:00:00Z",
  },
  {
    id: "proj-010",
    author_id: "user-002",
    title: "Interactive Dot Grid",
    description:
      "A responsive grid of tiny squares that light up and scale as you hover nearby. Creates a ripple of color that follows your cursor.",
    code: interactiveGridCode,
    slug: "interactive-dot-grid",
    tags: ["Interactive", "CSS Art", "Animation"],
    status: "pending",
    thumbnail_url: null,
    avg_rating: 3.8,
    rating_count: 12,
    favorite_count: 9,
    view_count: 420,
    is_featured: false,
    created_at: "2024-10-10T15:00:00Z",
    updated_at: "2024-10-10T15:00:00Z",
  },
];

// ============================================================
// Mock Projects with Author (pre-joined)
// ============================================================

export const mockProjectsWithAuthor: ProjectWithAuthor[] = mockProjects.map(
  (project) => ({
    ...project,
    author: project.author_id ? getProfile(project.author_id) : undefined,
  })
);

// ============================================================
// Mock Comments
// ============================================================

export const mockComments: CommentWithAuthor[] = [
  {
    id: "comment-001",
    project_id: "proj-001",
    user_id: "user-001",
    content:
      "Love the wireframe overlay effect! The color combination of cyan and violet is chef's kiss.",
    parent_id: null,
    created_at: "2024-09-02T10:30:00Z",
    updated_at: "2024-09-02T10:30:00Z",
    author: getProfile("user-001"),
  },
  {
    id: "comment-002",
    project_id: "proj-001",
    user_id: "user-003",
    content:
      "Would be cool to add mouse-based rotation control. Maybe with OrbitControls?",
    parent_id: null,
    created_at: "2024-09-03T14:15:00Z",
    updated_at: "2024-09-03T14:15:00Z",
    author: getProfile("user-003"),
  },
  {
    id: "comment-003",
    project_id: "proj-003",
    user_id: "user-004",
    content:
      "The particle physics feel so satisfying. Great use of decay and gravity.",
    parent_id: null,
    created_at: "2024-07-20T09:00:00Z",
    updated_at: "2024-07-20T09:00:00Z",
    author: getProfile("user-004"),
  },
  {
    id: "comment-004",
    project_id: "proj-003",
    user_id: "user-002",
    content: "How did you achieve the trailing effect? Is it the fillRect alpha trick?",
    parent_id: "comment-003",
    created_at: "2024-07-21T11:45:00Z",
    updated_at: "2024-07-21T11:45:00Z",
    author: getProfile("user-002"),
  },
  {
    id: "comment-005",
    project_id: "proj-003",
    user_id: "user-004",
    content:
      "Exactly! Instead of clearing the canvas, I fill with a semi-transparent background each frame so previous frames fade out naturally.",
    parent_id: "comment-004",
    created_at: "2024-07-21T13:00:00Z",
    updated_at: "2024-07-21T13:00:00Z",
    author: getProfile("user-004"),
  },
  {
    id: "comment-006",
    project_id: "proj-004",
    user_id: "user-001",
    content:
      "This is hands down one of the most beautiful flow fields I have seen. The violet palette is gorgeous.",
    parent_id: null,
    created_at: "2024-08-10T16:30:00Z",
    updated_at: "2024-08-10T16:30:00Z",
    author: getProfile("user-001"),
  },
  {
    id: "comment-007",
    project_id: "proj-002",
    user_id: "user-004",
    content:
      "Proof that you do not need JavaScript for stunning visuals. Pure CSS magic!",
    parent_id: null,
    created_at: "2024-08-25T08:20:00Z",
    updated_at: "2024-08-25T08:20:00Z",
    author: getProfile("user-004"),
  },
  {
    id: "comment-008",
    project_id: "proj-007",
    user_id: "user-003",
    content:
      "Nostalgic and beautifully executed. The katakana characters are a nice touch.",
    parent_id: null,
    created_at: "2024-08-15T19:00:00Z",
    updated_at: "2024-08-15T19:00:00Z",
    author: getProfile("user-003"),
  },
  {
    id: "comment-009",
    project_id: "proj-009",
    user_id: "user-002",
    content:
      "The palette function produces such smooth color transitions. Really elegant shader code.",
    parent_id: null,
    created_at: "2024-09-25T10:00:00Z",
    updated_at: "2024-09-25T10:00:00Z",
    author: getProfile("user-002"),
  },
  {
    id: "comment-010",
    project_id: "proj-008",
    user_id: "user-001",
    content:
      "The connection lines between nearby particles create such an organic feel. Reminds me of neural networks!",
    parent_id: null,
    created_at: "2024-09-08T12:15:00Z",
    updated_at: "2024-09-08T12:15:00Z",
    author: getProfile("user-001"),
  },
];

// ============================================================
// Helper Exports
// ============================================================

/** Get projects filtered by status */
export function getProjectsByStatus(status: Project["status"]) {
  return mockProjectsWithAuthor.filter((p) => p.status === status);
}

/** Get featured projects */
export function getFeaturedProjects() {
  return mockProjectsWithAuthor.filter((p) => p.is_featured);
}

/** Get a single project by slug */
export function getProjectBySlug(slug: string) {
  return mockProjectsWithAuthor.find((p) => p.slug === slug) ?? null;
}

/** Get a single project by ID */
export function getProjectById(id: string) {
  return mockProjectsWithAuthor.find((p) => p.id === id) ?? null;
}

/** Get comments for a project */
export function getCommentsForProject(projectId: string) {
  return mockComments.filter((c) => c.project_id === projectId);
}

/** Get all unique tags across projects */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const project of mockProjects) {
    for (const tag of project.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
