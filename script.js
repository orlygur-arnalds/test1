document.getElementById('year').textContent = new Date().getFullYear();

const sections = document.querySelectorAll('main section, .wrap > section');
const navLinks = document.querySelectorAll('nav.jump a');

sections.forEach((section, i) => {
  const h2 = section.querySelector('h2');
  if (!h2) return;

  const head = document.createElement('button');
  head.className = 'block-head';
  head.setAttribute('aria-expanded', 'true');

  const index = document.createElement('span');
  index.className = 'block-num';
  index.textContent = String(i + 1).padStart(2, '0');

  const arrow = document.createElement('span');
  arrow.className = 'block-arrow';
  arrow.textContent = '−';

  head.appendChild(index);
  head.appendChild(h2);
  head.appendChild(arrow);
  section.insertBefore(head, section.firstChild);

  const body = document.createElement('div');
  body.className = 'block-body';
  while (head.nextSibling) {
    body.appendChild(head.nextSibling);
  }
  section.appendChild(body);

  head.addEventListener('click', () => {
    const open = section.classList.toggle('collapsed');
    head.setAttribute('aria-expanded', String(!open));
    arrow.textContent = open ? '+' : '−';
  });
});

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => observer.observe(section));
}
