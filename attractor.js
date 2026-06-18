(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const INK = '47, 93, 52';
  const NODE_COUNT = 22;
  const LINK_DIST = 220;

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
      vx: rand(-0.08, 0.08),
      vy: rand(-0.08, 0.08),
      bit: Math.random() < 0.5,
      flipAt: performance.now() + rand(3000, 12000),
      life: rand(8000, 20000),
      born: performance.now(),
    };
  }

  let nodes = new Array(NODE_COUNT).fill(null).map(spawnNode);

  function tick() {
    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      if (now > n.flipAt) {
        n.bit = !n.bit;
        n.flipAt = now + rand(3000, 12000);
      }
    });

    nodes = nodes.map((n) => (now - n.born > n.life ? spawnNode() : n));

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.35;
          ctx.strokeStyle = `rgba(${INK}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.fillStyle = `rgba(${INK}, 0.6)`;
      if (n.bit) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(${INK}, 0.6)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
