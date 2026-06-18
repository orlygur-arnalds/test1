(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rand = (min, max) => min + Math.random() * (max - min);

  const attractors = [
    {
      name: 'lorenz',
      dt: 0.006,
      state: () => [rand(-5, 5), rand(-5, 5), rand(0, 5)],
      step(x, y, z) {
        const sigma = 10, rho = 28, beta = 8 / 3;
        return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
      },
      project(x, y, z) { return [x, z - 25]; },
      div: 55,
    },
    {
      name: 'rossler',
      dt: 0.02,
      state: () => [rand(-5, 5), rand(-5, 5), rand(0, 5)],
      step(x, y, z) {
        const a = 0.2, b = 0.2, c = 5.7;
        return [-y - z, x + a * y, b + z * (x - c)];
      },
      project(x, y, z) { return [x, y]; },
      div: 24,
    },
    {
      name: 'aizawa',
      dt: 0.01,
      state: () => [rand(-0.5, 0.5), rand(-0.5, 0.5), rand(0, 0.5)],
      step(x, y, z) {
        const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
        return [
          (z - b) * x - d * y,
          d * x + (z - b) * y,
          c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x,
        ];
      },
      project(x, y, z) { return [x, z - 0.5]; },
      div: 0.12,
    },
    {
      name: 'chen',
      dt: 0.004,
      state: () => [rand(-5, 5), rand(-5, 5), rand(0, 5)],
      step(x, y, z) {
        const a = 5, b = -10, c = -0.38;
        return [a * x - y * z, b * y + x * z, c * z + (x * y) / 3];
      },
      project(x, y, z) { return [x, z - 10]; },
      div: 28,
    },
  ];

  const attractor = attractors[Math.floor(Math.random() * attractors.length)];

  const PARTICLE_COUNT = 60;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => {
    const [x, y, z] = attractor.state();
    return { x, y, z, lastX: undefined, lastY: undefined };
  });

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
  let scale;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scale = Math.min(canvas.width, canvas.height) / attractor.div;
  }
  resize();
  window.addEventListener('resize', resize);

  function step(p) {
    const [dx, dy, dz] = attractor.step(p.x, p.y, p.z);
    p.x += dx * attractor.dt;
    p.y += dy * attractor.dt;
    p.z += dz * attractor.dt;
  }

  function project(p) {
    const [px, py] = attractor.project(p.x, p.y, p.z);
    return [canvas.width / 2 + px * scale, canvas.height / 2 - py * scale];
  }

  function frame() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    for (const p of particles) {
      step(p);
      const [nx, ny] = project(p);

      ctx.fillStyle = 'rgba(47, 93, 52, 0.7)';
      ctx.beginPath();
      ctx.arc(nx, ny, 1.1, 0, Math.PI * 2);
      ctx.fill();

      p.lastX = nx;
      p.lastY = ny;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
