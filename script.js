document.getElementById('year').textContent = new Date().getFullYear();

const grid = document.getElementById('blocks');
const sections = Array.from(grid.querySelectorAll('section'));
const navLinks = document.querySelectorAll('nav.jump a');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const prevBtn = document.getElementById('modalPrev');
const nextBtn = document.getElementById('modalNext');

let homeFor = null; // { node, parent, next } of section currently inside the modal
let currentIndex = -1;

sections.forEach((section, i) => {
  const h2 = section.querySelector('h2');
  if (!h2) return;

  const head = document.createElement('button');
  head.className = 'block-head';

  const index = document.createElement('span');
  index.className = 'block-num';
  index.textContent = String(i + 1).padStart(2, '0');

  head.appendChild(index);
  head.appendChild(h2);
  section.insertBefore(head, section.firstChild);

  const body = document.createElement('div');
  body.className = 'block-body';
  while (head.nextSibling) body.appendChild(head.nextSibling);
  section.appendChild(body);

  const teaserSource = body.querySelector('p, li');
  if (teaserSource) {
    const teaser = document.createElement('p');
    teaser.className = 'block-teaser';
    teaser.textContent = teaserSource.textContent;
    section.insertBefore(teaser, body);
  }

  section.addEventListener('click', () => {
    if (!section.classList.contains('in-modal')) openByIndex(i);
  });
});

navLinks.forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  const i = sections.findIndex((s) => s.id === id);
  if (i === -1) return; // e.g. "back to top" link
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openByIndex(i);
  });
});

function openByIndex(i) {
  if (homeFor) restoreCurrent();
  const section = sections[i];
  homeFor = { node: section, parent: section.parentNode, next: section.nextSibling };
  modalContent.appendChild(section);
  section.classList.add('in-modal');
  currentIndex = i;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalContent.scrollTop = 0;
}

function restoreCurrent() {
  if (!homeFor) return;
  homeFor.node.classList.remove('in-modal');
  homeFor.parent.insertBefore(homeFor.node, homeFor.next);
  homeFor = null;
}

function closeModal() {
  restoreCurrent();
  modal.hidden = true;
  currentIndex = -1;
  document.body.style.overflow = '';
}

function step(delta) {
  if (currentIndex === -1) return;
  const next = (currentIndex + delta + sections.length) % sections.length;
  openByIndex(next);
}

modal.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});

prevBtn.addEventListener('click', () => step(-1));
nextBtn.addEventListener('click', () => step(1));

document.addEventListener('keydown', (e) => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});
