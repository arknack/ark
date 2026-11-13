const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const progress = document.querySelector('.scroll-progress span');
const heroImage = document.querySelector('.hero-image img');
const heroFrame = document.querySelector('.hero-image');
const panoramaSurface = document.querySelector('.panorama-surface');
const panoramicHero = document.querySelector('.panoramic-hero');
const showcaseFrame = document.querySelector('.showcase-frame');
const showcaseLogo = document.querySelector('.showcase-logo');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.rel = 'noopener noreferrer';
});
let pointerX = 0;
let pointerY = 0;
let panoramaDrag = 0;
let panoramaDragging = false;
let panoramaStartX = 0;
let panoramaStartDrag = 0;

const updateHero3D = () => {
  if (!heroFrame || !heroImage || reduceMotion) return;
  const rect = heroFrame.getBoundingClientRect();
  const scrollDistance = panoramicHero ? panoramicHero.offsetHeight - window.innerHeight : 0;
  const travel = panoramicHero && scrollDistance > 0
    ? Math.min(1, Math.max(0, -panoramicHero.getBoundingClientRect().top / scrollDistance))
    : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  const angle = travel * 360 + panoramaDrag;
  if (panoramaSurface) {
    const renderedPanoramaWidth = heroFrame.clientHeight * (window.innerWidth <= 760 ? 2.08 : 2.16);
    panoramaSurface.style.setProperty('--panorama-x', `${-(angle / 360) * renderedPanoramaWidth}px`);
    panoramaSurface.style.setProperty('--panorama-y', `${pointerY * -18}px`);
  }
};

const updateShowcase3D = () => {
  if (!showcaseFrame || reduceMotion) return;
  const rect = showcaseFrame.getBoundingClientRect();
  const position = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  const tilt = (position - .5) * -5.5;
  showcaseFrame.style.transform = `perspective(1400px) rotateX(${tilt}deg) rotateY(${tilt * .35}deg) translateY(${tilt * 2}px)`;
  showcaseLogo.style.setProperty('--ark-reveal', position);
};

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});

document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable ? window.scrollY / scrollable : 0})`;
  updateHero3D();
  updateShowcase3D();
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

if (window.matchMedia('(pointer:fine)').matches && heroImage) {
  heroFrame.addEventListener('pointermove', (event) => {
    const { width, height, left, top } = event.currentTarget.getBoundingClientRect();
    pointerX = (event.clientX - left) / width - .5;
    pointerY = (event.clientY - top) / height - .5;
    if (panoramaDragging) panoramaDrag = panoramaStartDrag + (event.clientX - panoramaStartX) * -.24;
    updateHero3D();
  });
  heroFrame.addEventListener('pointerdown', (event) => {
    panoramaDragging = true;
    panoramaStartX = event.clientX;
    panoramaStartDrag = panoramaDrag;
    heroFrame.setPointerCapture(event.pointerId);
    heroFrame.classList.add('is-dragging');
  });
  heroFrame.addEventListener('pointerup', (event) => {
    panoramaDragging = false;
    heroFrame.releasePointerCapture(event.pointerId);
    heroFrame.classList.remove('is-dragging');
  });
  heroFrame.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; updateHero3D(); });
}

const catalogueSearch = document.querySelector('[data-catalogue-search]');
if (catalogueSearch) {
  const catalogueLinks = [...document.querySelectorAll('.catalogue-links a')];
  catalogueSearch.addEventListener('input', () => {
    const query = catalogueSearch.value.trim().toLowerCase();
    catalogueLinks.forEach((link) => {
      link.hidden = Boolean(query) && !link.textContent.toLowerCase().includes(query);
    });
  });
}

const materialTrack = document.querySelector('[data-material-track]');
if (materialTrack && !reduceMotion) {
  [...materialTrack.children].forEach((card) => {
    const duplicate = card.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.tabIndex = -1;
    duplicate.classList.remove('reveal');
    duplicate.classList.add('is-visible');
    duplicate.querySelectorAll('img').forEach((image) => image.removeAttribute('loading'));
    materialTrack.appendChild(duplicate);
  });
}

const enquiryForm = document.querySelector('[data-enquiry-form]');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(enquiryForm);
    const name = data.get('name');
    const material = data.get('material');
    const note = data.get('note');
    const subject = `ARK enquiry · ${material}`;
    const body = `Name: ${name}\nMaterial: ${material}\n\nProject note:\n${note}`;
    window.location.href = `mailto:arknack.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
