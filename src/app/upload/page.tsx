"use client";

import * as React from "react";
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  FileCode,
  Tag,
  AlignLeft,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { SandboxViewer } from "@/components/viewer/sandbox-viewer";
import { Button } from "@/components/ui/button";

const TEMPLATES: Record<
  string,
  { name: string; tag: string; code: string; defaultTitle: string; defaultDesc: string }
> = {
  three_cube: {
    name: "Three.js 3D Glowing Torus",
    tag: "Three.js",
    defaultTitle: "Neon Torus Field",
    defaultDesc: "Interactive 3D geometry rendered with Three.js via modern ESM import maps and OrbitControls.",
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; overflow: hidden; background: #07080d; }
    #canvas-container { width: 100vw; height: 100vh; }
    .hud { position: absolute; bottom: 16px; left: 16px; color: #38bdf8; font-family: monospace; font-size: 12px; background: rgba(0,0,0,0.6); padding: 6px 12px; border-radius: 9999px; border: 1px solid rgba(56,189,248,0.2); }
  </style>
</head>
<body>
  <div id="canvas-container"></div>
  <div class="hud">✦ Drag to rotate • Scroll to zoom</div>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080d, 0.05);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 120, 24);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x082f49,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.3 });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    scene.add(wireMesh);

    const p1 = new THREE.PointLight(0x06b6d4, 15, 30);
    p1.position.set(3, 3, 3);
    scene.add(p1);

    const p2 = new THREE.PointLight(0xf43f5e, 15, 30);
    p2.position.set(-3, -3, -2);
    scene.add(p2);

    const ambient = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambient);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.008;
      mesh.rotation.y += 0.012;
      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;
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
</html>`.trim(),
  },
  canvas_particles: {
    name: "Canvas 2D Interactive Particles",
    tag: "Canvas",
    defaultTitle: "Quantum Particle Field",
    defaultDesc: "Math-driven 2D canvas with mouse repulsion and spring physics.",
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; overflow: hidden; background: #06070a; }
    canvas { display: block; width: 100vw; height: 100vh; cursor: crosshair; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;
    const particles = [];
    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('resize', () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 1,
        color: 'hsl(' + (Math.random() * 60 + 170) + ', 90%, 65%)'
      });
    }

    function render() {
      ctx.fillStyle = 'rgba(6, 7, 10, 0.2)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          p.x += (dx / d) * 3;
          p.y += (dy / d) * 3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let d2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d2 < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(56, 189, 248, ' + (1 - d2/85)*0.35 + ')';
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(render);
    }
    render();
  </script>
</body>
</html>`.trim(),
  },
  tailwind_glass: {
    name: "Tailwind Play CDN Glass UI",
    tag: "CSS Art",
    defaultTitle: "Holographic Glass Terminal",
    defaultDesc: "Glassmorphic interface powered by Tailwind Play CDN with backdrop filters.",
    code: `<div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 select-none overflow-hidden relative font-mono">
  <div class="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] -top-10 -left-10"></div>
  <div class="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -bottom-10 -right-10"></div>

  <div class="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10 space-y-5">
    <div class="flex items-center justify-between pb-3 border-b border-white/10">
      <div class="flex items-center space-x-2">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
        <span class="text-xs font-bold text-cyan-300">RUNTIME // VIBE 2.0</span>
      </div>
      <span class="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">ONLINE</span>
    </div>

    <div class="space-y-3">
      <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
        <span class="text-xs text-slate-400">FRAME TIME</span>
        <span class="text-sm font-bold text-cyan-300">16.6 ms (60 FPS)</span>
      </div>
      <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
        <span class="text-xs text-slate-400">GPU PIPELINE</span>
        <span class="text-sm font-bold text-purple-300">ACTIVE</span>
      </div>
    </div>

    <button onclick="alert('Vibe triggered!')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform">
      EXECUTE SEQUENCE
    </button>
  </div>
</div>`.trim(),
  },
};

export default function UploadPage() {
  const [selectedTemplate, setSelectedTemplate] = React.useState("three_cube");
  const [code, setCode] = React.useState(TEMPLATES.three_cube.code);
  const [debouncedCode, setDebouncedCode] = React.useState(TEMPLATES.three_cube.code);
  const [title, setTitle] = React.useState(TEMPLATES.three_cube.defaultTitle);
  const [description, setDescription] = React.useState(TEMPLATES.three_cube.defaultDesc);
  const [tags, setTags] = React.useState("Three.js, WebGL, 3D");
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(code);
    }, 300);
    return () => clearTimeout(handler);
  }, [code]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedTemplate(key);
    if (TEMPLATES[key]) {
      setCode(TEMPLATES[key].code);
      setTitle(TEMPLATES[key].defaultTitle);
      setDescription(TEMPLATES[key].defaultDesc);
      setTags(`${TEMPLATES[key].tag}, Interactive`);
      setReloadKey((k) => k + 1);
      toast.info(`Loaded "${TEMPLATES[key].name}" starter template`);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a project title");
      return;
    }
    if (!code.trim()) {
      toast.error("Code cannot be empty");
      return;
    }

    toast.success("Experiment published to Vibe UI!", {
      description: `"${title}" is now queued for thumbnail snapshot and community voting.`,
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Code2 className="size-4" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Creation Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Write or paste HTML/CSS/JS. Instant live sandboxed preview with Three.js & Tailwind support.
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Starter Template:
          </label>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs text-slate-200 backdrop-blur-xl focus:border-cyan-500/50 focus:outline-none cursor-pointer"
          >
            <option value="three_cube" className="bg-slate-900">Three.js 3D Glowing Torus</option>
            <option value="canvas_particles" className="bg-slate-900">Canvas 2D Particle Waves</option>
            <option value="tailwind_glass" className="bg-slate-900">Tailwind Glass UI Terminal</option>
          </select>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[580px]">
        {/* Left Pane: Code Editor Area */}
        <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#07080d] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <FileCode className="size-3.5" />
              <span>index.html (Editable Source)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {Math.round(code.length / 1024 * 10) / 10} KB • Auto-Reload (300ms)
            </span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-4 bg-transparent text-xs font-mono text-cyan-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500/30 selection:text-white min-h-[380px]"
            placeholder="Type your HTML and JavaScript here..."
          />
        </div>

        {/* Right Pane: Live Sandboxed Viewer */}
        <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#07080d] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
              <Play className="size-3.5 fill-current" />
              <span>Live Sandboxed Viewer</span>
            </div>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Restart</span>
            </button>
          </div>

          <div className="flex-1 w-full min-h-[480px]">
            <SandboxViewer
              htmlCode={debouncedCode}
              title="Studio Preview"
              autoReloadKey={reloadKey}
              className="h-full border-0 rounded-none"
            />
          </div>
        </div>
      </div>

      {/* Project Metadata & Publishing Form */}
      <form
        onSubmit={handlePublish}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Sparkles className="size-4 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">
            Publish Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Type className="size-3 text-cyan-400" />
              Experiment Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Neon Torus"
              maxLength={80}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="size-3 text-purple-400" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Three.js, WebGL, Shader, Canvas"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <AlignLeft className="size-3 text-amber-400" />
            Description & Instructions
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Tell other vibe coders how this experiment works and how to interact with it..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            By publishing, your experiment will be run under strict iframe sandboxing (zero-trust, no-cookie access).
          </p>

          <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
            <CheckCircle2 className="size-4 mr-2" />
            Publish Experiment
          </Button>
        </div>
      </form>
    </div>
  );
}
