/* ============================================
   BISHAL SAPKOTA — PORTFOLIO SCRIPT
   Beginner-friendly, well-commented
============================================ */


/* ============ 1. PARTICLES BACKGROUND ============
   Draws tiny floating dots on a canvas behind
   the whole page for a cinematic atmosphere.
================================================= */
const canvas = document.getElementById('particles');
const ctx    = canvas ? canvas.getContext('2d') : null;

let particles = [];

// match canvas size to window
function resizeCanvas() {
  if (!canvas || !ctx) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  buildParticles();
});

// create particle objects
function buildParticles() {
  if (!canvas || !ctx) return;
  const count = Math.floor((canvas.width * canvas.height) / 13000);
  particles   = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      // crimson tones for 40% of particles, soft gray for the rest
      color: Math.random() > 0.6
        ? `rgba(178,34,52,${(Math.random() * 0.45 + 0.15).toFixed(2)})`
        : `rgba(214,209,211,${(Math.random() * 0.18 + 0.05).toFixed(2)})`
    });
  }
}
buildParticles();

// animation loop
function animateParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    // wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
if (canvas && ctx && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animateParticles();
}


/* ============ 2. NAVBAR ============
   Adds a frosted-glass background when
   the user scrolls down the page.
==================================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNavLink();
});


/* ============ 3. MOBILE HAMBURGER MENU ============
   Toggles the nav open/closed on small screens.
=================================================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

// close menu when a link is clicked
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

// close menu when clicking outside the nav drawer
document.addEventListener('click', (e) => {
  if (
    navLinks?.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }
});


/* ============ 4. ACTIVE NAV LINK ON SCROLL ============
   Highlights the correct nav link depending on
   which section is currently visible.
======================================================== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function highlightNavLink() {
  let currentSection = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) {
      currentSection = sec.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}


/* ============ 5. TYPING ANIMATION ============
   Cycles through role titles with a typewriter
   effect. Blender Artist removed per update.
=============================================== */
const roles   = ['BSc. CSIT Student', 'Frontend Developer', 'Video Editor'];
const typedEl = document.getElementById('typedText');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeText() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // typing forward
    typedEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      // finished typing — pause then start deleting
      isDeleting = true;
      setTimeout(typeText, 1600);
      return;
    }
  } else {
    // deleting
    typedEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      // finished deleting — move to next role
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
  }

  // speed: slower when typing, faster when deleting
  const speed = isDeleting ? 55 : 90;
  setTimeout(typeText, speed);
}
typeText();


/* ============ 6. SCROLL FADE-IN ANIMATIONS ============
   Elements with class .fade-in slide up and appear
   as they enter the viewport.
======================================================== */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // animate only once
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));


/* ============ 7. IMAGE PARALLAX ON MOUSE MOVE ============
   The hero profile image moves slightly following
   the mouse cursor for a 3D feel.
   Disabled on touch devices to avoid stale position.
========================================================== */
const homeImage = document.getElementById('homeImage');

// Only add mouse parallax on devices that support hover
const hasHover = window.matchMedia('(hover: hover)').matches;
if (hasHover && homeImage) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy; // -1 to 1
    homeImage.style.transform =
      `translate(${dx * 12}px, ${dy * 10}px)`;
  });
}


/* ============ 8. SKILL CARD 3D TILT ============
   Cards tilt slightly toward the mouse cursor
   for an elegant interactive effect.
   Disabled on touch to avoid stuck transforms.
================================================= */
if (hasHover) {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px   = (e.clientX - rect.left) / rect.width  - 0.5;
      const py   = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `translateY(-7px) rotateX(${-py * 10}deg) rotateY(${px * 10}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ============ 9. PROJECT CARD TILT ============
     Same gentle tilt effect for project cards.
  ================================================= */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px   = (e.clientX - rect.left) / rect.width  - 0.5;
      const py   = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `translateY(-10px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ============ 10. CONTACT FORM ============
   Handles the form submit with a simple
   success message (no backend needed).
=========================================== */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form?.addEventListener('submit', (e) => {
  e.preventDefault(); // stop page reload

  // show success message
  success.classList.add('show');
  form.reset();

  // hide message after 4 seconds
  setTimeout(() => {
    success.classList.remove('show');
  }, 4000);
});


/* ============ 11. SMOOTH SCROLL FOR ANCHOR LINKS ============
   Makes clicking any #link scroll smoothly
   to that section instead of jumping.
============================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============ 12. SKILL PROFICIENCY ============
   Edit a skill's level by changing its data-level
   attribute in index.html (e.g. data-level="65").
================================================= */
document.querySelectorAll('.skill-card[data-level]').forEach(card => {
  const level = card.dataset.level;
  card.style.setProperty('--level', level + '%');
  const label = card.querySelector('.skill-percent');
  if (label) label.textContent = level + '%';
});


/* ============ 13. EMAIL LINKS ============
   mailto: links do nothing on computers that have
   no default mail app set up. On desktop we open
   Gmail's compose window in a new tab instead.
   Phones keep the normal mailto: behaviour, which
   opens the Gmail / mail app directly.
=========================================== */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', (e) => {
    if (!hasHover) return; // touch device → let mailto: open the app
    e.preventDefault();
    const to = link.getAttribute('href').replace('mailto:', '');
    const url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});
