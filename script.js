// Theme Toggle
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

function setTheme(isDark) {
  if (isDark) {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  if (window.__heroNameFx) window.__heroNameFx.refresh();
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

themeBtn.addEventListener('click', () => {
  setTheme(!body.classList.contains('dark'));
});

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const navMobile = document.getElementById('navMobile');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navMobile.classList.toggle('active');
  document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    navMobile.classList.remove('active');
    document.body.style.overflow = '';
  });
});

navMobile.addEventListener('click', (e) => {
  if (e.target === navMobile) {
    menuBtn.classList.remove('active');
    navMobile.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Active nav links
const sections = document.querySelectorAll('section[id]');
const navLinks = [...document.querySelectorAll('.nav-desktop a'), ...document.querySelectorAll('.nav-mobile-links a')];

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = 'Sending your message...';
    formStatus.style.color = 'var(--text-secondary)';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://formspree.io/f/mblrobgn', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = '✓ Message sent successfully!';
        formStatus.style.color = 'var(--accent)';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          formStatus.textContent = '';
        }, 3000);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      formStatus.textContent = '× Something went wrong. Please email me directly.';
      formStatus.style.color = 'var(--accent)';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Hero Animation
(function initSignatureAnimation() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroSection = document.querySelector('.hero');
  const ctx = canvas.getContext('2d', { alpha: true });

  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;

  let binaryRain = [];
  let glitchFragments = [];

  let accent = '#ff0000';
  const off = document.createElement('canvas');
  const offCtx = off.getContext('2d');

  function readAccent() {
    const v = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    accent = v || '#ff0000';
  }

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    W = Math.floor(rect.width);
    H = Math.floor(rect.height);

    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildSignature();
  }

  function buildSignature() {
    off.width = W;
    off.height = H;
    offCtx.clearRect(0, 0, W, H);

    const text = 'MÉGANE';
    
    let fontSize, x, y;
    
    if (W < 768) {
      fontSize = Math.max(30, Math.min(60, Math.floor(W * 0.14)));
      x = W * 0.75;
      y = H * 0.75;
    } else if (W < 968) {
      fontSize = Math.max(50, Math.min(90, Math.floor(W * 0.12)));
      x = W * 0.72;
      y = H * 0.55;
    } else {
      fontSize = Math.max(65, Math.min(130, Math.floor(W * 0.11)));
      x = W * 0.58;
      y = H * 0.52;
    }

    offCtx.font = `900 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    offCtx.fillStyle = '#000';
    offCtx.fillText(text, x, y);

    const img = offCtx.getImageData(0, 0, W, H).data;

    const targets = [];
    const step = Math.max(3, Math.floor(fontSize / 22));
    for (let yy = 0; yy < H; yy += step) {
      for (let xx = 0; xx < W; xx += step) {
        const i = (yy * W + xx) * 4;
        if (img[i + 3] > 30) {
          targets.push({ x: xx, y: yy });
        }
      }
    }

    const nameLetters = ['M', 'É', 'G', 'A', 'N', 'E'];
    binaryRain = [];
    const numStreams = Math.floor(W / 50);
    for (let i = 0; i < numStreams; i++) {
      binaryRain.push({
        x: Math.random() * W,
        y: -Math.random() * H,
        speed: 1.5 + Math.random() * 2.5,
        letter: nameLetters[Math.floor(Math.random() * nameLetters.length)],
        a: Math.random() * 0.15 + 0.08,
        length: Math.floor(Math.random() * 6) + 4
      });
    }

    glitchFragments = [];
    const numGlitch = Math.floor(targets.length / 15);
    for (let i = 0; i < numGlitch; i++) {
      const t = targets[Math.floor(Math.random() * targets.length)];
      glitchFragments.push({
        x: t.x,
        y: t.y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        w: Math.random() * 15 + 5,
        h: Math.random() * 15 + 5
      });
    }
  }

  let last = performance.now();
  let time = 0;

  function tick(now) {
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    time += dt;

    ctx.clearRect(0, 0, W, H);

    ctx.font = 'bold 18px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = accent;
    
    for (const drop of binaryRain) {
      drop.y += drop.speed * 60 * dt;
      
      if (drop.y > H + 80) {
        drop.y = -40;
        drop.x = Math.random() * W;
        const nameLetters = ['M', 'É', 'G', 'A', 'N', 'E'];
        drop.letter = nameLetters[Math.floor(Math.random() * nameLetters.length)];
      }

      for (let i = 0; i < drop.length; i++) {
        const opacity = 1 - (i / drop.length);
        ctx.globalAlpha = drop.a * opacity;
        ctx.fillText(drop.letter, drop.x, drop.y - i * 25);
      }
    }

    for (const frag of glitchFragments) {
      frag.x += frag.vx * 60 * dt;
      frag.y += frag.vy * 60 * dt;
      frag.rotation += frag.rotSpeed;
      frag.life -= frag.decay;

      if (frag.life <= 0) {
        frag.x = Math.random() * W;
        frag.y = Math.random() * H;
        frag.vx = (Math.random() - 0.5) * 8;
        frag.vy = (Math.random() - 0.5) * 8;
        frag.life = 1;
      }

      ctx.save();
      ctx.translate(frag.x, frag.y);
      ctx.rotate(frag.rotation);
      
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = frag.life * 0.2;
      ctx.strokeRect(-frag.w / 2, -frag.h / 2, frag.w, frag.h);
      
      ctx.fillStyle = accent + '11';
      ctx.globalAlpha = frag.life * 0.12;
      ctx.fillRect(-frag.w / 2, -frag.h / 2, frag.w, frag.h);
      
      ctx.restore();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  function refresh() {
    readAccent();
    buildSignature();
  }

  window.__heroNameFx = { refresh };

  readAccent();
  resize();
  requestAnimationFrame(tick);

  window.addEventListener('resize', resize);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', refresh);
})();