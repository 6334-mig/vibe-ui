-- ==============================================================================
-- VIBE UI SHOW - SEED DATA
-- High quality Three.js, Canvas, and generative UI projects
-- ==============================================================================

INSERT INTO public.projects (id, title, description, tags, html_code, status, is_featured, avg_rating, rating_count, favorite_count)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Neon Cyber Torus: Three.js Interactive Wireframe',
    'A luminescent interactive 3D torus knot built with Three.js and glowing shader wireframes, responsive to cursor rotation and speed.',
    ARRAY['Three.js', 'WebGL', 'Cyberpunk', '3D', 'Shaders'],
    $code$<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; overflow: hidden; background: #07090e; }
    canvas { display: block; width: 100vw; height: 100vh; }
    #overlay {
      position: absolute;
      top: 20px;
      left: 20px;
      color: rgba(255, 255, 255, 0.7);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      pointer-events: none;
      backdrop-filter: blur(8px);
      background: rgba(255, 255, 255, 0.05);
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div id="overlay">Drag to rotate • Scroll to zoom</div>
  <div id="scene-container"></div>
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const container = document.getElementById('scene-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Torus Knot geometry
    const geometry = new THREE.TorusKnotGeometry(2.2, 0.55, 180, 32, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Glowing lights
    const light1 = new THREE.PointLight(0x06b6d4, 15, 50);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xa855f7, 20, 50);
    light2.position.set(-5, -5, -2);
    scene.add(light2);

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    function animate() {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.006;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>$code$,
    'published',
    true,
    4.95,
    38,
    72
),
(
    '00000000-0000-0000-0000-000000000002',
    'Quantum Constellation: Interactive Particle Field',
    'An interactive HTML5 Canvas particle swarm that gravitates toward mouse velocity with smooth spring physics and neon connections.',
    ARRAY['Canvas', 'Generative', 'Particles', 'Interactive', 'Physics'],
    $code$<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; overflow: hidden; background: #08090d; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const count = 90;
    const mouse = { x: width / 2, y: height / 2, radius: 140 };

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.2
      });
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function draw() {
      ctx.fillStyle = 'rgba(8, 9, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#6366f1';
        ctx.fill();

        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${1 - d / 110})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  </script>
</body>
</html>$code$,
    'published',
    false,
    4.82,
    29,
    45
),
(
    '00000000-0000-0000-0000-000000000003',
    'Glassmorphic Bento Card with Dynamic Glow',
    'A Tailwind CSS pure vibe UI component with iridescent gradient border tracking, glowing glass reflection, and card interactions.',
    ARRAY['Tailwind', 'Glassmorphism', 'Bento', 'UI Components', 'CSS Art'],
    $code$<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0b0d13; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: ui-sans-serif, system-ui; }
  </style>
</head>
<body>
  <div class="relative group">
    <div class="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    <div class="relative px-8 py-10 bg-slate-900/80 ring-1 ring-white/10 backdrop-blur-2xl rounded-2xl leading-none flex flex-col max-w-sm">
      <div class="flex items-center space-x-3 mb-4">
        <span class="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">✦</span>
        <h3 class="text-white font-medium text-lg tracking-wide">Vibe Experience</h3>
      </div>
      <p class="text-slate-400 text-sm leading-relaxed mb-6">
        Ultra high-fidelity interactive card crafted with Tailwind Play CDN, radial reflections and responsive micro-interactions.
      </p>
      <div class="flex items-center justify-between pt-4 border-t border-white/5">
        <span class="text-xs text-slate-500 font-mono">NEXT_VIBE_UI</span>
        <button class="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition">Explore</button>
      </div>
    </div>
  </div>
</body>
</html>$code$,
    'published',
    false,
    4.76,
    18,
    34
)
ON CONFLICT (id) DO NOTHING;
