(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CELL = 5;
  const STEP_MS = 60;

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
  let cols, rows, row, y;

  function seedRow() {
    row = new Array(cols).fill(false);
    row[Math.floor(cols / 2)] = true;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / CELL);
    rows = Math.ceil(canvas.height / CELL);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    seedRow();
    y = 0;
  }
  resize();
  window.addEventListener('resize', resize);

  function nextRow(r) {
    const next = new Array(cols).fill(false);
    for (let i = 0; i < cols; i++) {
      const left = r[i - 1] || false;
      const center = r[i];
      const right = r[i + 1] || false;
      next[i] = left !== (center || right);
    }
    return next;
  }

  function drawRow() {
    ctx.fillStyle = 'rgba(47, 93, 52, 0.6)';
    for (let i = 0; i < cols; i++) {
      if (row[i]) ctx.fillRect(i * CELL, y, CELL - 1, CELL - 1);
    }
  }

  function tick() {
    drawRow();
    y += CELL;
    if (y > canvas.height) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      seedRow();
      y = 0;
    } else {
      row = nextRow(row);
    }
    setTimeout(tick, STEP_MS);
  }

  tick();
})();
