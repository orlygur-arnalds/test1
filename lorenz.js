(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    scale = Math.min(canvas.width, canvas.height) / 55;
  }
  resize();
  window.addEventListener('resize', resize);

  const sigma = 10, rho = 28, beta = 8 / 3, dt = 0.006;
  let x = 0.1, y = 0, z = 0;
  let px, py;

  function step() {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }

  function project() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return [cx + x * scale, cy - (z - 25) * scale];
  }

  function frame() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.012)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < 4; i++) {
      step();
      const [nx, ny] = project();
      if (px !== undefined) {
        ctx.strokeStyle = 'rgba(47, 93, 52, 0.55)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }
      px = nx;
      py = ny;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
