(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const INK = '47, 93, 52';
  const NODE_COUNT = 14;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '9999';
  canvas.style.pointerEvents = 'none';
  canvas.style.mixBlendMode = 'multiply';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function spawnNode() {
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      vx: rand(-0.05, 0.05),
      vy: rand(-0.05, 0.05),
      r: rand(1.4, 3.2),
      phase: rand(0, Math.PI * 2),
      breathe: rand(0.0006, 0.0014),
      born: performance.now(),
      life: rand(20000, 40000),
    };
  }

  let nodes = new Array(NODE_COUNT).fill(null).map(spawnNode);

  function bow(a, b) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const curve = Math.sin(a.phase + b.phase) * dist * 0.12;
    const nx = -dy / dist;
    const ny = dx / dist;
    return { cx: mx + nx * curve, cy: my + ny * curve, dist };
  }

  function tick() {
    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    nodes = nodes.map((n) => (now - n.born > n.life ? spawnNode() : n));

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const { cx, cy, dist } = bow(a, b);
        if (dist > 260) continue;
        const breathe = (Math.sin(now * 0.0004 + a.phase + b.phase) + 1) / 2;
        const alpha = (1 - dist / 260) * 0.16 * (0.4 + breathe * 0.6);
        ctx.strokeStyle = `rgba(${INK}, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
        ctx.stroke();
      }
    }

    nodes.forEach((n) => {
      const breathe = (Math.sin(now * n.breathe + n.phase) + 1) / 2;
      const r = n.r * (0.7 + breathe * 0.6);
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
      grad.addColorStop(0, `rgba(${INK}, ${0.35 + breathe * 0.25})`);
      grad.addColorStop(1, `rgba(${INK}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
