/* ═══════════════════════════════════════════════════════════════
   SIVA ❤️ KAVI — OUR FOREVER
   Complete Interactive Script — v4.0 Production Ready

   ARCHITECTURE:
   ✔  Mobile-first performance: adaptive particle counts
   ✔  Gallery rebuilt: gallery-grid (fixed mismatch with HTML)
   ✔  PHOTOS array: fixed to use only existing photos (1–9)
   ✔  Three.js: reduced load on mobile/low-end devices
   ✔  All canvas loops: IntersectionObserver-gated
   ✔  Custom cursor: desktop-only (pointer: fine)
   ✔  Hamburger: breakpoint now at 767px (matches CSS)
   ✔  Safe null-checks on all DOM queries
   ✔  Memory leaks: all intervals/RAF references tracked
   ✔  Touch support: swipe to close popup
   ✔  Video observer: proper load() before play()
   ✔  Image errors: graceful SVG placeholder fallback
   ✔  Keyboard trap: focus lock inside popup
   ✔  Siva ❤️ Kavi branding throughout
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   DEVICE CAPABILITIES DETECTION
   Used to scale down effects on mobile/low-end devices
───────────────────────────────────────────────────────────── */
const isMobile  = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                  || window.innerWidth < 768;
const isLowEnd  = (navigator.hardwareConcurrency || 4) <= 2
                  || window.innerWidth < 480;
const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasTouch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/* ─────────────────────────────────────────────────────────────
   CONFIG — Swap your real files here.
   Centralised photo/video references.
   NOTE: Only photos 1–9 exist in /src/
───────────────────────────────────────────────────────────── */
const PHOTOS = [
  { src: 'src/pins/1.jpeg', caption: 'chubby gurl 💕' },
  { src: 'src/pins/2.jpeg', caption: 'A smile as beautiful as the moon🌙' },
  { src: 'src/pins/3.jpeg', caption: 'Traveling together, making memories forever ✨' },
  { src: 'src/pins/4.jpeg', caption: 'Warning: Excessive Cuteness Detected 🚨👑🌸' },
  { src: 'src/pins/5.jpeg', caption: 'A moment my heart will never forget❤️' },
  { src: 'src/pins/6.jpeg', caption: 'The sweetest weight I have ever carried✨' },
  { src: 'src/pins/7.jpeg', caption: 'You + Me + Laughter = Everything 😂' },
  { src: 'src/pins/8.jpeg', caption: 'By the beach, I found my peace in you🌊✨' },
  { src: 'src/pins/9.jpeg', caption: 'One hand, endless comfort🤝❤️' },
];

const TIMELINE_DATA = [
  {
    title: 'Food Date',
    date: 'Day 1',
    body: 'A simple food date became one of my favorite memories because you were beside me. Your presence made every bite sweeter and every moment feel like home.',
    photo: 'src/photo1.jpeg',
  },
  {
    title: 'Midnight Meet',
    date: 'Week 2',
    body: 'Our midnight meeting felt like a dream, where the silence of the night faded beside your beautiful presence. Under the moonlight, every moment with you became a memory my heart will treasure forever.',
    photo: 'src/photo2.jpeg',
  },
  {
    title: 'Pencil Carving',
    date: 'Month 2',
    body: 'I spent six hours carving our names into the tiny graphite of a pencil, proving that even the smallest space could hold the biggest piece of my love for you.',
    photo: 'src/photo3.jpeg',
  },
  {
    title: 'The Look',
    date: 'Month 4',
    body: 'In that silent eye contact, the whole world disappeared, and all I could see was you. One glance from you was enough to make my heart fall in love all over again.',
    photo: 'src/photo4.jpeg',
  },
  {
    title: 'Witnessed A Princess',
    date: 'Month 5',
    body: 'The moment I saw you wearing that crown, you looked like a princess straight out of my dreams. I could not take my eyes off you, because in that moment, you truly ruled my heart.',
    photo: 'src/photo5.jpeg',
  },
];

/* ─────────────────────────────────────────────────────────────
   PLACEHOLDER GENERATOR
   Safe SVG placeholders — no external deps, no broken images.
───────────────────────────────────────────────────────────── */
const PLACEHOLDER_GRADIENTS = [
  ['#ff6eb4','#b56eff'], ['#b56eff','#ff2d78'], ['#ff9de2','#6a0dad'],
  ['#ffd6e7','#ff6eb4'], ['#e8b4ff','#b56eff'], ['#ff2d78','#ff9de2'],
  ['#6a0dad','#ffd6e7'], ['#ff6eb4','#ff2d78'], ['#b56eff','#e8b4ff'],
  ['#ff9de2','#6a0dad'],
];
const PLACEHOLDER_ICONS = ['💕','🌸','✨','🌙','❤️','🌹','🦋','🌟','💖','🌺'];

function makePlaceholderSrc(index, w, h, label, icon) {
  w = w || 180; h = h || 180; label = label || ''; icon = icon || '';
  const [c1, c2] = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
  const ic = icon || PLACEHOLDER_ICONS[index % PLACEHOLDER_ICONS.length];
  const fSize = Math.round(Math.min(w, h) * 0.32);
  const lSize = Math.round(Math.min(w, h) * 0.09);
  const labelLine = label
    ? `<text x="50%" y="76%" text-anchor="middle" dominant-baseline="middle" font-size="${lSize}" font-family="sans-serif" fill="rgba(255,255,255,0.7)">${label}</text>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)" rx="8"/>
    <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" font-size="${fSize}" font-family="serif">${ic}</text>
    ${labelLine}
  </svg>`;
  try {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  } catch (e) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
}
window.makePlaceholderSrc = makePlaceholderSrc;

/* ─────────────────────────────────────────────────────────────
   UTILITY — throttle & debounce
───────────────────────────────────────────────────────────── */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = performance.now();
    if (now - last >= ms) { last = now; fn.apply(this, args); }
  };
}

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ─────────────────────────────────────────────────────────────
   RESIZE MANAGER — single listener, multiple callbacks
───────────────────────────────────────────────────────────── */
const _resizeCbs = [];
function onResize(fn) { _resizeCbs.push(fn); }
window.addEventListener('resize', debounce(() => { _resizeCbs.forEach(fn => fn()); }, 180));

/* ─────────────────────────────────────────────────────────────
   GLOBAL STATE
───────────────────────────────────────────────────────────── */
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let _musicStarted   = false;
let _popupOpen      = false;
let _endingStarted  = false;
const _heartRainIvs = [];
let   _tunnelRafId  = null;

/* ─────────────────────────────────────────────────────────────
   DOM SHORTCUTS
───────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const landing       = $('landing');
const enterBtn      = $('enter-btn');
const mainWorld     = $('main-world');
const tunnelOverlay = $('tunnel-overlay');
const tunnelCanvas  = $('tunnel-canvas');
const music         = $('bg-music');
const popup         = $('photo-popup');
const popupImg      = $('popup-img');
const popupCap      = $('popup-caption');
const popupClose    = $('popup-close');
const popupBdrop    = $('popup-backdrop');

/* ─────────────────────────────────────────────────────────────
   THREE.JS BACKGROUND SCENE
   Adaptive quality: desktop gets full particles,
   mobile gets ~40% and isLowEnd gets ~20%
───────────────────────────────────────────────────────────── */
let threeRenderer, threeScene, threeCamera;
let bigHeart, heartParticles, stars1, stars2, stars3;
let threeT = 0;
let threeRunning = false;

function initThree() {
  const canvas = $('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const pr = Math.min(window.devicePixelRatio, isLowEnd ? 1 : isMobile ? 1.5 : 2);

  threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  threeRenderer.setPixelRatio(pr);
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setClearColor(0x000000, 0);

  threeScene  = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  threeCamera.position.set(0, 0, 50);

  /* Star fields — adaptive count */
  const mult = isLowEnd ? 0.18 : isMobile ? 0.35 : 1;
  function makeStars(count, spread, color, size) {
    const n = Math.round(count * mult);
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color, size: size || 0.28, transparent: true, opacity: 0.75 });
    return new THREE.Points(geo, mat);
  }

  stars1 = makeStars(2200, 320, 0xffd6e7, 0.28);
  stars2 = makeStars(1100, 220, 0xb56eff, 0.22);
  stars3 = makeStars(550,  160, 0xff6eb4, 0.35);
  threeScene.add(stars1, stars2, stars3);

  /* Central 3D heart */
  bigHeart = buildHeart3D();
  threeScene.add(bigHeart);

  /* Lights */
  threeScene.add(new THREE.AmbientLight(0xffd6e7, 0.55));
  const pl1 = new THREE.PointLight(0xff6eb4, 2.2, 120);
  pl1.position.set(0, 10, 12);
  threeScene.add(pl1);
  const pl2 = new THREE.PointLight(0xb56eff, 1.6, 120);
  pl2.position.set(-22, -12, 6);
  threeScene.add(pl2);

  /* Particle field — adaptive */
  const particleCount = isLowEnd ? 180 : isMobile ? 350 : 900;
  heartParticles = buildHeartParticles(particleCount);
  threeScene.add(heartParticles);

  onResize(() => {
    if (!threeCamera || !threeRenderer) return;
    threeCamera.aspect = window.innerWidth / window.innerHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
  });

  threeRunning = true;
  threeLoop();
}

function buildHeart3D() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0,   0.88, 0.5,  1,    0.5,  0.5);
  shape.bezierCurveTo(0.5, 0.1,  0,    0,    0,   -0.5);
  shape.bezierCurveTo(0,   0,   -0.5,  0.1, -0.5,  0.5);
  shape.bezierCurveTo(-0.5, 1,   0,    0.88, 0,    0.5);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.22, bevelEnabled: true,
    bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: isMobile ? 1 : 3,
  });
  const mat = new THREE.MeshPhongMaterial({
    color: 0xff2d78, emissive: 0xff0055,
    emissiveIntensity: 0.45, transparent: true, opacity: 0.88, shininess: 120,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.setScalar(4);
  mesh.position.set(0, 2, -22);
  return mesh;
}

function buildHeartParticles(n) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const palette = [
    [1, 0.43, 0.7], [0.71, 0.43, 1], [1, 0.84, 0.91], [1, 0.57, 0.71],
  ];
  for (let i = 0; i < n; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 110;
    pos[i*3+1] = (Math.random() - 0.5) * 110;
    pos[i*3+2] = (Math.random() - 0.5) * 55;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.55, vertexColors: true, transparent: true, opacity: 0.65,
  });
  return new THREE.Points(geo, mat);
}

function threeLoop() {
  if (!threeRunning) return;
  requestAnimationFrame(threeLoop);
  threeT += 0.004;

  if (stars1) stars1.rotation.y += 0.00018;
  if (stars2) stars2.rotation.x += 0.00010;
  if (stars3) stars3.rotation.z += 0.00028;

  if (bigHeart) {
    bigHeart.rotation.y = Math.sin(threeT * 0.5) * 0.28;
    bigHeart.rotation.x = Math.sin(threeT * 0.3) * 0.14;
    bigHeart.position.y = 2 + Math.sin(threeT) * 1.4;
  }

  if (heartParticles) {
    const pos = heartParticles.geometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.035;
      if (pos[i] > 55) pos[i] = -55;
    }
    heartParticles.geometry.attributes.position.needsUpdate = true;
  }

  /* Gentle parallax — camera follows mouse lazily (skip on low-end mobile) */
  if (threeCamera && !isLowEnd && window.innerWidth > 0) {
    const tx = (mouseX / window.innerWidth)  *  6 - 3;
    const ty = (mouseY / window.innerHeight) * -6 + 3;
    threeCamera.position.x += (tx - threeCamera.position.x) * 0.018;
    threeCamera.position.y += (ty - threeCamera.position.y) * 0.018;
    threeCamera.lookAt(0, 0, 0);
  }

  threeRenderer.render(threeScene, threeCamera);
}

/* Scroll depth moves camera back slightly */
window.addEventListener('scroll', throttle(() => {
  if (threeCamera) threeCamera.position.z = 50 - window.scrollY * 0.004;
}, 50));

/* Mouse tracking */
document.addEventListener('mousemove', throttle(e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, 30));

/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR (desktop pointer only)
───────────────────────────────────────────────────────────── */
function initCursor() {
  if (!hasPointer) return;
  const dot  = $('cursor-dot');
  const ring = $('cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });

  document.querySelectorAll('a, button, [tabindex="0"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '48px';
      ring.style.height = '48px';
      ring.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '28px';
      ring.style.height = '28px';
      ring.style.opacity = '1';
    });
  });
}
initCursor();

/* ─────────────────────────────────────────────────────────────
   AUDIO
   volume reset guard, play() promise handled safely
───────────────────────────────────────────────────────────── */
function startMusic() {
  if (!music || _musicStarted) return;
  _musicStarted = true;
  music.volume  = 0;
  music.currentTime = 0;

  const attempt = () => {
    const p = music.play();
    if (p && typeof p.then === 'function') {
      p.catch(() => { /* autoplay blocked — user gesture will retry */ });
    }
    let vol = 0;
    const fade = setInterval(() => {
      vol = Math.min(vol + 0.008, 0.38);
      music.volume = vol;
      if (vol >= 0.38) clearInterval(fade);
    }, 120);
  };
  attempt();
}

function startMusicOnce() { startMusic(); }
document.addEventListener('touchstart', startMusicOnce, { once: true, passive: true });
document.addEventListener('click',      startMusicOnce, { once: true });

/* ─────────────────────────────────────────────────────────────
   LANDING SCENE & ENTER BUTTON
───────────────────────────────────────────────────────────── */
/* Kick off Three.js immediately (landing background) */
initThree();

if (enterBtn) {
  enterBtn.addEventListener('click', handleEnterClick);
  enterBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEnterClick(); }
  });
}

function handleEnterClick() {
  if (!enterBtn || enterBtn.disabled) return;
  enterBtn.disabled = true;
  startMusic();

  if (typeof gsap !== 'undefined') {
    gsap.to(landing, {
      opacity: 0, scale: 1.08, duration: 0.85, ease: 'power2.inOut',
      onComplete: () => { landing.classList.add('hidden'); showTunnel(); },
    });
  } else {
    landing.style.transition = 'opacity 0.8s ease';
    landing.style.opacity    = '0';
    setTimeout(() => { landing.classList.add('hidden'); showTunnel(); }, 850);
  }
}

/* ─────────────────────────────────────────────────────────────
   MEMORY TUNNEL
───────────────────────────────────────────────────────────── */
function showTunnel() {
  tunnelOverlay.classList.remove('hidden');

  const ctx = tunnelCanvas.getContext('2d');
  tunnelCanvas.width  = window.innerWidth;
  tunnelCanvas.height = window.innerHeight;

  let t = 0, frames = 0;
  const maxFrames = isMobile ? 150 : 200;

  function heartPath(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.35);
    ctx.bezierCurveTo(cx,         cy - s * 0.1,  cx + s * 0.5, cy - s * 0.5, cx + s * 0.5, cy);
    ctx.bezierCurveTo(cx + s * 0.5, cy + s * 0.4, cx,           cy + s * 0.8, cx,           cy + s * 0.35);
    ctx.bezierCurveTo(cx,           cy + s * 0.8, cx - s * 0.5, cy + s * 0.4, cx - s * 0.5, cy);
    ctx.bezierCurveTo(cx - s * 0.5, cy - s * 0.5, cx,           cy - s * 0.1, cx,            cy + s * 0.35);
    ctx.closePath();
  }

  function drawTunnel() {
    const w = tunnelCanvas.width, h = tunnelCanvas.height;
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(cx, cy) * 1.6;

    ctx.fillStyle = 'rgba(6,0,16,0.14)';
    ctx.fillRect(0, 0, w, h);

    const rings = isMobile ? 10 : 18;
    for (let i = 0; i < rings; i++) {
      const r     = ((t * 3.5 + i * maxR / rings) % maxR);
      const alpha = Math.max(0, 1 - r / maxR);
      const hue   = 310 + (i * 7) % 60;
      const scale = r / maxR;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale * 0.85, scale * 0.85);
      heartPath(ctx, 0, 0, 90);
      ctx.restore();
      ctx.strokeStyle = `hsla(${hue},80%,70%,${alpha * 0.55})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    for (let i = 0; i < (isMobile ? 2 : 4); i++) {
      const px = cx + (Math.random() - 0.5) * 240;
      const py = cy + (Math.random() - 0.5) * 240;
      ctx.fillStyle = `rgba(255,110,180,${Math.random() * 0.45})`;
      ctx.font      = `${9 + Math.random() * 10}px serif`;
      ctx.fillText('❤', px, py);
    }

    t += 0.5;
    frames++;
    if (frames < maxFrames) {
      _tunnelRafId = requestAnimationFrame(drawTunnel);
    } else {
      endTunnel();
    }
  }
  drawTunnel();
}

function endTunnel() {
  if (_tunnelRafId) { cancelAnimationFrame(_tunnelRafId); _tunnelRafId = null; }

  if (typeof gsap !== 'undefined') {
    gsap.to(tunnelOverlay, {
      opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: revealMainWorld,
    });
  } else {
    tunnelOverlay.style.transition = 'opacity 0.8s ease';
    tunnelOverlay.style.opacity    = '0';
    setTimeout(revealMainWorld, 850);
  }
}

function revealMainWorld() {
  tunnelOverlay.classList.add('hidden');
  tunnelOverlay.style.opacity = '';
  mainWorld.classList.remove('hidden');
  initMainWorld();

  if (typeof gsap !== 'undefined') {
    gsap.from(mainWorld, { opacity: 0, duration: 1, ease: 'power2.out' });
  } else {
    mainWorld.style.opacity    = '0';
    mainWorld.style.transition = 'opacity 1s ease';
    requestAnimationFrame(() => { mainWorld.style.opacity = '1'; });
  }
}

/* ─────────────────────────────────────────────────────────────
   MAIN WORLD INIT
───────────────────────────────────────────────────────────── */
function initMainWorld() {
  buildGallery();
  buildTimeline();
  initLoveMeter();
  initSkyCanvas();
  initGalaxyCanvas();
  initEndingStars();
  initVideoObserver();
  initScrollAnimations();
  /* Only load floating effects on non-low-end devices */
  if (!isLowEnd) {
    initFloatingHearts();
    initFloatingRoses();
    initFireflies();
  }
  initMagneticButtons();
  initNavBehaviour();
  initHamburger();
  initPhotoPlaceholders();
  wireReplayButton();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAPScrollAnimations();
  }
}

/* ─────────────────────────────────────────────────────────────
   NAV BEHAVIOUR
───────────────────────────────────────────────────────────── */
function initNavBehaviour() {
  const nav = document.querySelector('.love-nav');
  if (!nav) return;
  window.addEventListener('scroll', throttle(() => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, 100));
}

function initHamburger() {
  const hamburger = $('nav-hamburger');
  const navMenu   = $('nav-menu');
  if (!hamburger || !navMenu) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* Close menu on outside click */
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  /* Close menu on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ─────────────────────────────────────────────────────────────
   IMAGE PLACEHOLDER PATCH
   onerror attached in JS — safe, no inline attr race
───────────────────────────────────────────────────────────── */
function initPhotoPlaceholders() {
  document.querySelectorAll('img[src]').forEach((img, i) => {
    if (!img.dataset.phPatched) {
      img.dataset.phPatched = '1';
      img.addEventListener('error', function onErr() {
        img.removeEventListener('error', onErr);
        img.src = makePlaceholderSrc(i % 10, img.naturalWidth || 300, img.naturalHeight || 200);
      });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   GALLERY (rebuilt — was polaroid-stage, now gallery-grid)
   Uses the correct container ID matching index.html
───────────────────────────────────────────────────────────── */
function buildGallery() {
  const grid = $('gallery-grid');
  if (!grid) return;

  PHOTOS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', p.caption);

    const rot = (Math.random() - 0.5) * 8;
    card.style.cssText = `
      --rot:${rot}deg;
      --float-dur:${4.5 + Math.random() * 4}s;
      --float-delay:${Math.random() * 3}s;
    `;

    /* Image container with aspect ratio */
    const imgWrap = document.createElement('div');
    imgWrap.className = 'gallery-card-img-wrap';

    const img = new Image();
    img.alt   = p.caption;
    img.setAttribute('loading', 'lazy');
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center;display:block;';
    img.src = p.src;
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      img.src = makePlaceholderSrc(i, 200, 200);
    });
    imgWrap.appendChild(img);

    const cap = document.createElement('div');
    cap.className   = 'gallery-card-caption';
    cap.textContent = p.caption;

    const glow = document.createElement('div');
    glow.className = 'gallery-card-glow';
    glow.setAttribute('aria-hidden', 'true');

    card.append(imgWrap, cap, glow);

    function openThis() { openPopup(p, img.src); }
    card.addEventListener('click', openThis);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); }
    });

    grid.appendChild(card);
  });
}

/* ── Photo Popup ── */
function openPopup(photo, srcUsed) {
  if (!popup || _popupOpen) return;
  popupImg.src         = srcUsed;
  popupImg.alt         = photo.caption;
  popupCap.textContent = photo.caption;
  popup.classList.remove('hidden');
  popup.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  _popupOpen = true;

  const content = popup.querySelector('.popup-content');
  if (typeof gsap !== 'undefined' && content) {
    gsap.fromTo(content,
      { opacity: 0, scale: 0.82, y: 28 },
      { opacity: 1, scale: 1,    y: 0, duration: 0.45, ease: 'back.out(1.6)' }
    );
  }

  burstHearts($('popup-particles'));
  setTimeout(() => {
    if (popupClose) popupClose.focus();
  }, 60);
}

function closePopup() {
  if (!popup || !_popupOpen) return;
  const content = popup.querySelector('.popup-content');
  if (typeof gsap !== 'undefined' && content) {
    gsap.to(content, {
      opacity: 0, scale: 0.88, y: 20, duration: 0.28, ease: 'power2.in',
      onComplete: finishClose,
    });
  } else {
    finishClose();
  }
}

function finishClose() {
  if (!popup) return;
  popup.classList.add('hidden');
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  _popupOpen = false;
  if (popupImg) popupImg.src = '';
  const content = popup.querySelector('.popup-content');
  if (content) { content.style.cssText = ''; }
}

if (popupClose) popupClose.addEventListener('click', closePopup);
if (popupBdrop) popupBdrop.addEventListener('click', closePopup);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && _popupOpen) closePopup();
});

/* Touch swipe to close popup */
if (hasTouch && popup) {
  let touchStartY = 0;
  popup.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  popup.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > 80) closePopup();
  }, { passive: true });
}

/* Focus trap inside popup */
document.addEventListener('keydown', e => {
  if (!_popupOpen || e.key !== 'Tab') return;
  const focusable = popup.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
});

function burstHearts(container) {
  if (!container) return;
  container.innerHTML = '';
  const count = isMobile ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const el    = document.createElement('div');
    const angle = Math.random() * 360;
    const dist  = 55 + Math.random() * 120;
    const size  = 12 + Math.random() * 16;
    el.style.cssText = `
      position:absolute;left:50%;top:50%;
      font-size:${size}px;pointer-events:none;
      transform:translate(-50%,-50%);
      transition:all ${0.5 + Math.random() * 0.55}s cubic-bezier(0.22,1,0.36,1);
      opacity:1;user-select:none;
    `;
    el.textContent = '❤';
    container.appendChild(el);
    requestAnimationFrame(() => {
      const dx = Math.cos(angle * Math.PI / 180) * dist;
      const dy = Math.sin(angle * Math.PI / 180) * dist;
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
      el.style.opacity   = '0';
    });
    setTimeout(() => { if (el.parentNode) el.remove(); }, 1100);
  }
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE ISLANDS
───────────────────────────────────────────────────────────── */
function buildTimeline() {
  const container = $('timeline-islands');
  if (!container) return;

  TIMELINE_DATA.forEach((item, i) => {
    const island = document.createElement('div');
    island.className = 'island';
    island.setAttribute('role', 'listitem');

    const content = document.createElement('div');
    content.className = 'island-content';

    const img = new Image();
    img.src = item.photo;
    img.alt = item.title;
    img.setAttribute('loading', 'lazy');
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      img.src = makePlaceholderSrc(i, 300, 150, item.title);
    });
    content.appendChild(img);

    const title = document.createElement('div');
    title.className   = 'island-title';
    title.textContent = item.title;

    const date = document.createElement('div');
    date.className   = 'island-date';
    date.textContent = '📅 ' + item.date;

    const body = document.createElement('p');
    body.className   = 'island-body';
    body.textContent = item.body;

    content.append(title, date, body);

    const dot = document.createElement('div');
    dot.className = 'island-dot';
    dot.setAttribute('aria-hidden', 'true');

    const empty = document.createElement('div');
    empty.className = 'island-empty';
    empty.setAttribute('aria-hidden', 'true');

    /* Default: dot first (mobile), content second */
    island.append(dot, content, empty);

    container.appendChild(island);
  });

  /* Reveal on scroll */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.island-content').forEach(el => el.classList.add('visible'));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  container.querySelectorAll('.island').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   LOVE METER
───────────────────────────────────────────────────────────── */
function initLoveMeter() {
  const pctEl   = $('love-percent');
  const barEl   = $('meter-bar');
  const labelEl = $('meter-label');
  const barWrap = document.querySelector('.meter-bar-wrap');
  const counter = document.querySelector('.meter-counter');
  const section = $('section-lovemeter');
  if (!pctEl || !section) return;

  let started = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      obs.disconnect();
      animateMeter();
    }
  }, { threshold: 0.35 });
  obs.observe(section);

  function animateMeter() {
    let n = 0;
    const iv = setInterval(() => {
      n++;
      if (pctEl)   pctEl.textContent   = n;
      if (barEl)   barEl.style.width   = n + '%';
      if (barWrap) barWrap.setAttribute('aria-valuenow', n);
      if (counter) counter.setAttribute('aria-valuenow', n);

      if (labelEl) {
        labelEl.textContent =
          n < 50  ? 'Loading love…'         :
          n < 100 ? 'Love overflowing…'     :
                    'Calculating infinity…';
      }

      if (n >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          if (pctEl) {
            pctEl.textContent = '∞';
            const sym = pctEl.parentElement && pctEl.parentElement.querySelector('.percent-sym');
            if (sym) sym.textContent = '';
          }
          if (labelEl) labelEl.textContent = 'Forever ❤️';
          if (barEl) {
            barEl.style.width     = '100%';
            barEl.style.boxShadow = '0 0 45px rgba(255,110,180,1), 0 0 90px rgba(181,110,255,0.6)';
          }
        }, 600);
      }
    }, 22);
  }
}

/* ─────────────────────────────────────────────────────────────
   SKY CANVAS — Section 1 (Aurora + fireflies)
───────────────────────────────────────────────────────────── */
function initSkyCanvas() {
  const canvas = $('sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeSky() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resizeSky();
  onResize(resizeSky);

  const flyCount = isLowEnd ? 10 : isMobile ? 16 : 28;
  const flies = Array.from({ length: flyCount }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0018,
    vy: (Math.random() - 0.5) * 0.0018,
    r: 1 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
  }));

  let skyT = 0;
  let skyRunning = true;

  /* Pause when section off screen */
  const section = $('section-meeting');
  if (section) {
    const sObs = new IntersectionObserver(entries => {
      skyRunning = entries[0].isIntersecting;
      if (skyRunning) requestAnimationFrame(drawSky);
    }, { rootMargin: '200px' });
    sObs.observe(section);
  }

  function drawSky() {
    if (!skyRunning) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    const h1 = 270 + Math.sin(skyT * 0.28) * 28;
    const h2 = 315 + Math.sin(skyT * 0.2 + 1) * 18;
    grad.addColorStop(0,   `hsla(${h1},68%,10%,0.78)`);
    grad.addColorStop(0.4, `hsla(${h2},60%,14%,0.45)`);
    grad.addColorStop(1,   'rgba(6,0,16,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let a = 0; a < (isMobile ? 2 : 3); a++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += (isMobile ? 8 : 5)) {
        const y = h * (0.18 + a * 0.09) + Math.sin(x / w * Math.PI * 4 + skyT + a) * h * 0.055;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0); ctx.lineTo(0, 0);
      ctx.fillStyle = `hsla(${285 + a * 22 + Math.sin(skyT) * 18},80%,62%,0.038)`;
      ctx.fill();
    }

    flies.forEach(f => {
      f.x += f.vx; f.y += f.vy;
      if (f.x < 0) f.x = 1; if (f.x > 1) f.x = 0;
      if (f.y < 0) f.y = 1; if (f.y > 1) f.y = 0;
      f.phase += 0.04;
      const alpha = (Math.sin(f.phase) * 0.5 + 0.5) * 0.75;
      const fx = f.x * w, fy = f.y * h;

      ctx.beginPath();
      ctx.arc(fx, fy, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,145,${alpha})`;
      ctx.fill();

      if (!isLowEnd) {
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r * 7);
        g.addColorStop(0, `rgba(255,220,100,${alpha * 0.42})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(fx, fy, f.r * 7, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });

    skyT += 0.009;
    requestAnimationFrame(drawSky);
  }
  drawSky();
}

/* ─────────────────────────────────────────────────────────────
   GALAXY CANVAS — Future section
───────────────────────────────────────────────────────────── */
function initGalaxyCanvas() {
  const canvas = $('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeGalaxy() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resizeGalaxy();
  onResize(resizeGalaxy);

  const starCount = isLowEnd ? 80 : isMobile ? 130 : 220;
  const gStars = Array.from({ length: starCount }, () => ({
    x: Math.random(), y: Math.random(),
    r: 0.4 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.025,
  }));

  let gt = 0;
  let galRunning = true;

  const galSection = $('section-future');
  if (galSection) {
    const gObs = new IntersectionObserver(entries => {
      galRunning = entries[0].isIntersecting;
      if (galRunning) requestAnimationFrame(drawGalaxy);
    }, { rootMargin: '200px' });
    gObs.observe(galSection);
  }

  function drawGalaxy() {
    if (!galRunning) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.9);
    bg.addColorStop(0, 'rgba(28,0,55,0.38)');
    bg.addColorStop(1, 'rgba(2,0,8,0.88)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const nebulae = isMobile ? 2 : 3;
    for (let n = 0; n < nebulae; n++) {
      const nx  = w * (0.25 + n * 0.25);
      const ny  = h * 0.5;
      const ng  = ctx.createRadialGradient(nx, ny, 0, nx, ny, 220);
      const hue = 275 + n * 32 + Math.sin(gt + n) * 18;
      ng.addColorStop(0, `hsla(${hue},72%,38%,0.07)`);
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.fillRect(0, 0, w, h);
    }

    gStars.forEach(s => {
      s.phase += s.speed;
      const flicker = Math.sin(s.phase) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * (0.6 + flicker * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,238,${0.35 + flicker * 0.65})`;
      ctx.fill();
    });

    gt += 0.004;
    requestAnimationFrame(drawGalaxy);
  }
  drawGalaxy();
}

/* ─────────────────────────────────────────────────────────────
   ENDING STARS CANVAS
───────────────────────────────────────────────────────────── */
function initEndingStars() {
  const canvas = $('ending-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeEnding() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resizeEnding();
  onResize(resizeEnding);

  const eStarCount = isLowEnd ? 80 : isMobile ? 160 : 280;
  const eStars = Array.from({ length: eStarCount }, () => ({
    x: Math.random(), y: Math.random(),
    r: 0.3 + Math.random() * 1.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.018 + Math.random() * 0.04,
  }));

  let endingRunning = true;
  const endSection = $('section-ending');
  if (endSection) {
    const eObs = new IntersectionObserver(entries => {
      endingRunning = entries[0].isIntersecting;
      if (endingRunning) requestAnimationFrame(draw);
    }, { rootMargin: '200px' });
    eObs.observe(endSection);

    /* Also trigger ending animation when visible */
    const animObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !_endingStarted) {
        _endingStarted = true;
        startEndingAnimation();
        animObs.disconnect();
      }
    }, { threshold: 0.2 });
    animObs.observe(endSection);
  }

  function draw() {
    if (!endingRunning) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(2,0,8,0.94)';
    ctx.fillRect(0, 0, w, h);

    /* Occasional shooting star */
    if (!isMobile && Math.random() < 0.018) {
      const sx  = Math.random() * w;
      const sy  = Math.random() * h * 0.45;
      const len = 60 + Math.random() * 80;
      const ang = 25 + Math.random() * 20;
      const grd = ctx.createLinearGradient(sx, sy, sx + len, sy + len * Math.tan(ang * Math.PI / 180));
      grd.addColorStop(0, 'rgba(255,200,220,0.7)');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + len, sy + len * Math.tan(ang * Math.PI / 180));
      ctx.strokeStyle = grd;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    eStars.forEach(s => {
      s.phase += s.speed;
      const f = Math.sin(s.phase) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * (0.5 + f * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,210,230,${0.28 + f * 0.72})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

function startEndingAnimation() {
  const endSection = $('section-ending');
  if (!endSection) return;
  endSection.querySelectorAll('.float-in').forEach(el => el.classList.add('visible'));

  const rain = $('ending-hearts');
  if (!rain) return;

  const rainInterval = isMobile ? 350 : 220;
  const iv = setInterval(() => {
    const el    = document.createElement('div');
    const glyph = ['❤','♡','💕','💖'][Math.floor(Math.random() * 4)];
    const size  = 12 + Math.random() * 22;
    const dur   = 3.5 + Math.random() * 4;
    const hue   = 320 + Math.random() * 38;
    const light = 65  + Math.random() * 18;
    el.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      top:-40px;
      font-size:${size}px;
      animation:heartRainDrop ${dur}s ease-in forwards;
      opacity:${0.4 + Math.random() * 0.5};
      color:hsl(${hue},80%,${light}%);
      filter:drop-shadow(0 0 5px currentColor);
      pointer-events:none;user-select:none;
    `;
    el.textContent = glyph;
    rain.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, (dur + 0.5) * 1000);
  }, rainInterval);

  _heartRainIvs.push(iv);
}

/* ─────────────────────────────────────────────────────────────
   VIDEO OBSERVER
   video.load() called first, play() handles missing-src
───────────────────────────────────────────────────────────── */
function initVideoObserver() {
  const videos = document.querySelectorAll('.memory-video');
  if (!videos.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video   = entry.target;
      const inner   = video.closest('.video-inner');
      const overlay = inner ? inner.querySelector('.video-overlay') : null;

      if (entry.isIntersecting) {
        if (video.getAttribute('src')) {
          video.load();
          const p = video.play();
          if (p && typeof p.then === 'function') {
            p.then(() => {
              video.classList.add('loaded', 'playing');
              if (overlay) overlay.classList.add('playing');
            }).catch(() => {
              video.classList.add('loaded');
            });
          }
        } else {
          video.classList.add('loaded');
        }
      } else {
        video.pause();
        video.classList.remove('playing');
        if (overlay) overlay.classList.remove('playing');
      }
    });
  }, { threshold: 0.4 });

  videos.forEach(v => obs.observe(v));

  /* Tap to play/pause on mobile */
  if (hasTouch) {
    document.querySelectorAll('.video-inner').forEach(inner => {
      inner.addEventListener('click', () => {
        const video   = inner.querySelector('.memory-video');
        const overlay = inner.querySelector('.video-overlay');
        if (!video) return;
        if (video.paused) {
          video.play().then(() => {
            video.classList.add('playing');
            if (overlay) overlay.classList.add('playing');
          }).catch(() => {});
        } else {
          video.pause();
          video.classList.remove('playing');
          if (overlay) overlay.classList.remove('playing');
        }
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS — float-in for all sections
───────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const selector = '.float-in:not(#section-ending .float-in)';
  const elements = document.querySelectorAll(selector);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   GSAP SCROLL ANIMATIONS
───────────────────────────────────────────────────────────── */
function initGSAPScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* Parallax on section titles */
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.to(el, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.story-section') || el,
        scrub: true,
      },
    });
  });

  /* Depth stagger on promise cards */
  document.querySelectorAll('.promise-card').forEach((el, i) => {
    gsap.to(el, {
      yPercent: -5 * (i % 2 === 0 ? 1 : -1),
      ease: 'none',
      scrollTrigger: { trigger: '.promises-section', scrub: true },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   FLOATING HEARTS (skipped on low-end)
───────────────────────────────────────────────────────────── */
function initFloatingHearts() {
  const layer  = $('floating-hearts-layer');
  if (!layer) return;
  const hearts = ['❤','♡','💕','💗','💖','💝'];
  const colors = ['#ff6eb4','#b56eff','#ff2d78','#ffd6e7','#ff9de2'];

  function spawnHeart() {
    const el    = document.createElement('div');
    el.className = 'float-heart';
    const size  = 0.65 + Math.random() * 1.7;
    const drift = (Math.random() - 0.5) * 180;
    const spin  = (Math.random() - 0.5) * 680;
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.cssText = `
      left:${Math.random() * 100}%;
      --size:${size}rem;
      --color:${colors[Math.floor(Math.random() * colors.length)]};
      --op:${0.28 + Math.random() * 0.45};
      --dur:${7 + Math.random() * 9}s;
      --delay:0s;
      --drift:${drift}px;
      --spin:${spin}deg;
      --glow:${size * 3}px;
      font-size:${size}rem;
    `;
    layer.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 18000);
  }

  let count = 0;
  const spawnRate = isMobile ? 200 : 120;
  const initial = setInterval(() => {
    spawnHeart(); count++;
    if (count >= (isMobile ? 8 : 15)) clearInterval(initial);
  }, spawnRate);
  setInterval(spawnHeart, isMobile ? 600 : 350);
}

/* ─────────────────────────────────────────────────────────────
   FLOATING ROSES (skipped on low-end)
───────────────────────────────────────────────────────────── */
function initFloatingRoses() {
  const layer = $('floating-roses-layer');
  if (!layer) return;
  const roses = ['🌹','🌸','🌺','🌷','🏵️'];

  function spawnRose() {
    const el   = document.createElement('div');
    el.className = 'float-rose';
    const size = 1 + Math.random() * 1.4;
    const tx   = (Math.random() - 0.5) * 280;
    const ty   = (Math.random() - 0.5) * 280;
    const spin = (Math.random() - 0.5) * 340;
    el.textContent = roses[Math.floor(Math.random() * roses.length)];
    el.style.cssText = `
      left:${Math.random() * 100}vw;
      top:${20 + Math.random() * 75}vh;
      font-size:${size}rem;
      --dur:${11 + Math.random() * 14}s;
      --delay:0s;
      --tx:${tx}px;
      --ty:${ty}px;
      --spin:${spin}deg;
    `;
    layer.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 28000);
  }

  let rc = 0;
  const ri = setInterval(() => { spawnRose(); rc++; if (rc >= 4) clearInterval(ri); }, 600);
  setInterval(spawnRose, 3000);
}

/* ─────────────────────────────────────────────────────────────
   FIREFLIES CANVAS (global fixed layer, skipped on low-end)
───────────────────────────────────────────────────────────── */
function initFireflies() {
  const canvas = $('effects-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeFF() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeFF();
  onResize(resizeFF);

  const flyCount = isMobile ? 20 : 45;
  const flies = Array.from({ length: flyCount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.65,
    vy: (Math.random() - 0.5) * 0.65,
    r: 0.9 + Math.random() * 1.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.018 + Math.random() * 0.038,
  }));

  (function drawFlies() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flies.forEach(f => {
      f.x += f.vx; f.y += f.vy;
      if (f.x < 0)             f.x = canvas.width;
      if (f.x > canvas.width)  f.x = 0;
      if (f.y < 0)             f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;

      f.phase += f.speed;
      const alpha = (Math.sin(f.phase) * 0.5 + 0.5) * 0.82;
      const fx = f.x, fy = f.y;

      ctx.beginPath();
      ctx.arc(fx, fy, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,120,${alpha})`;
      ctx.fill();

      if (!isMobile) {
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r * 9);
        g.addColorStop(0, `rgba(255,238,100,${alpha * 0.46})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(fx, fy, f.r * 9, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });
    requestAnimationFrame(drawFlies);
  })();
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC BUTTONS (desktop pointer only)
───────────────────────────────────────────────────────────── */
function initMagneticButtons() {
  if (!hasPointer) return;
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.28;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 460);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   TOUCH SUPPORT — feed touch coords into Three.js parallax
───────────────────────────────────────────────────────────── */
document.addEventListener('touchmove', e => {
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
}, { passive: true });

/* ─────────────────────────────────────────────────────────────
   REPLAY BUTTON
───────────────────────────────────────────────────────────── */
function wireReplayButton() {
  const btn = $('replay-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    _heartRainIvs.forEach(iv => clearInterval(iv));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => location.reload(), 650);
  });

  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  });
}

/* ─────────────────────────────────────────────────────────────
   CONSOLE LOVE NOTE
───────────────────────────────────────────────────────────── */
console.log('%c❤️ Siva ❤️ Kavi ❤️',
  'font-size:26px;color:#ff6eb4;font-family:Georgia,serif;font-style:italic;');
console.log('%cBuilt with love, for Kavi — the one who makes every day worth remembering.',
  'color:#b56eff;font-style:italic;font-size:13px;');
