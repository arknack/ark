const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const progress = document.querySelector('.scroll-progress span');
const heroImage = document.querySelector('.hero-image img');
const heroFrame = document.querySelector('.hero-image');
const panoramicHero = document.querySelector('.panoramic-hero');
const showcaseFrame = document.querySelector('.showcase-frame');
const showcaseLogo = document.querySelector('.showcase-logo');
const viewer = document.querySelector('.project-viewer');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let pointerX = 0;
let pointerY = 0;

const updateHero3D = () => {
  if (!heroFrame || !heroImage || reduceMotion) return;
  const rect = heroFrame.getBoundingClientRect();
  const scrollDistance = panoramicHero ? panoramicHero.offsetHeight - window.innerHeight : 0;
  const travel = panoramicHero && scrollDistance > 0
    ? Math.min(1, Math.max(0, -panoramicHero.getBoundingClientRect().top / scrollDistance))
    : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  const scrollTilt = (travel - .5) * 7;
  heroImage.style.objectPosition = `${22 + travel * 56}% center`;
  heroImage.style.transform = `perspective(1300px) translate3d(${pointerX * -11}px, ${scrollTilt * -4}px, 32px) rotateX(${scrollTilt * -1}deg) rotateY(${pointerX * 3.2}deg) rotateZ(${pointerY * -.5}deg) scale(1.075)`;
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

document.querySelectorAll('.project').forEach((project) => {
  const image = project.querySelector('img');
  const label = project.querySelector('figcaption span').textContent;
  const title = project.querySelector('figcaption strong').textContent;
  project.tabIndex = 0;
  project.setAttribute('role', 'button');
  project.setAttribute('aria-label', `View ${title}`);
  const showProject = () => {
    viewer.querySelector('img').src = image.currentSrc || image.src;
    viewer.querySelector('img').alt = image.alt;
    viewer.querySelector('.viewer-caption span').textContent = label;
    viewer.querySelector('.viewer-caption strong').textContent = title;
    viewer.showModal();
  };
  project.addEventListener('click', showProject);
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showProject(); }
  });
});

viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });

if (window.matchMedia('(pointer:fine)').matches && heroImage) {
  heroFrame.addEventListener('pointermove', (event) => {
    const { width, height, left, top } = event.currentTarget.getBoundingClientRect();
    pointerX = (event.clientX - left) / width - .5;
    pointerY = (event.clientY - top) / height - .5;
    updateHero3D();
  });
  heroFrame.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; updateHero3D(); });
}
