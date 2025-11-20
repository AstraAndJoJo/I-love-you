/* Global romantic interactions and page-specific behaviors */
(function() {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    initSmoothNav();
    initParticles();
    initFooterHearts();

    const page = document.body.dataset.page || 'home';
    if (page === 'home') initHome();
    if (page === 'memories') initMemories();
    if (page === 'photos') initPhotos();
    if (page === 'videos') initVideos();
    if (page === 'letters') initLetters();
    if (page === 'nicknames') initNicknames();
    if (page === 'surprise') initSurprise();
  });

  /* Smooth navigation (for future in-page anchors) */
  function initSmoothNav() {
    $$('.nav-links a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = $(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* Particles: hearts + sparkles flowing softly */
  function initParticles() {
    const container = $('.particles');
    if (!container) return;
    const makeSparkle = () => {
      const s = document.createElement('img');
      s.src = 'assets/images/sparkle.svg';
      s.style.position = 'absolute';
      s.style.left = Math.random()*100 + '%';
      s.style.bottom = '-24px';
      const size = 6 + Math.random()*10;
      s.style.width = size + 'px';
      s.style.opacity = 0.8;
      s.style.animation = 'sparkle ' + (6 + Math.random()*6) + 's linear';
      container.appendChild(s);
      setTimeout(() => s.remove(), 12000);
    };
    const makeHeart = () => {
      const h = document.createElement('img');
      h.src = 'assets/images/heart.svg';
      h.style.position = 'absolute';
      h.style.left = Math.random()*100 + '%';
      h.style.bottom = '-24px';
      const size = 10 + Math.random()*16;
      h.style.width = size + 'px';
      h.style.opacity = 0.9;
      h.style.animation = 'sparkle ' + (8 + Math.random()*8) + 's linear';
      container.appendChild(h);
      setTimeout(() => h.remove(), 16000);
    };
    setInterval(makeSparkle, 800);
    setInterval(makeHeart, 1200);
  }

  /* Footer rising hearts */
  function initFooterHearts() {
    const wrap = $('.footer-hearts');
    if (!wrap) return;
    setInterval(() => {
      const h = document.createElement('span');
      h.className = 'footer-heart';
      h.style.left = Math.random()*100 + '%';
      h.style.width = h.style.height = (6 + Math.random()*10) + 'px';
      wrap.appendChild(h);
      setTimeout(() => h.remove(), 4000);
    }, 600);
  }

  /* Home page: music toggle */
  (function () {
    const btn = document.getElementById('music-player-btn');
    const audio = document.getElementById('background-music');
    if (!btn || !audio) return;

    function setState(playing) {
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      // label updates per page (keeps the icon + short text)
      const page = document.body.getAttribute('data-page') || 'home';
      const labels = {
        home: playing ? '🎵 Stop Music' : '🎵 Play Music',
        photos: playing ? '♪ Stop' : '♪ Play',
        videos: playing ? '🎬 Stop' : '🎬 Play',
        surprise: playing ? '✨ Stop' : '✨ Play',
        memories: playing ? '💌 Stop' : '💌 Play',
        letters: playing ? '✉️ Stop' : '✉️ Play',
        nicknames: playing ? '💖 Stop' : '💖 Play'
      };
      const label = labels[page] || (playing ? 'Stop Music' : 'Play Music');

      // keep icon + label
      const icon = btn.querySelector('.music-icon')?.textContent || '';
      const labelNode = btn.querySelector('.music-label');
      if (labelNode) labelNode.textContent = label;

      // toggle page-specific class for animations
      if (playing) btn.classList.add('playing'); else btn.classList.remove('playing');
    }

    // initialize
    setState(!audio.paused);

    btn.addEventListener('click', () => {
      if (audio.paused) {
        const p = audio.play();
        if (p && p.then) {
          p.then(() => setState(true)).catch(() => setState(false));
        } else {
          setState(true);
        }
      } else {
        audio.pause();
        setState(false);
      }
    });

    // pause audio when page hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        audio.pause();
        setState(false);
      }
    });
  })();

  /* Memories: reveal on scroll + gentle parallax */
  function initMemories() {
    const cards = $$('.memory-card');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal'); });
    }, { threshold: 0.2 });
    cards.forEach(c => io.observe(c));
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.15;
      document.body.style.backgroundPosition = `center ${-y}px`;
    });
  }

  /* Photos: masonry + lightbox */
  function initPhotos() {
    const items = $$('.masonry-item img');
    const lightbox = $('.lightbox');
    const lbImg = $('.lightbox img');
    if (!lightbox || !lbImg) return;
    items.forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  /* Videos: modal player with heart play */
  function initVideos() {
    const cards = $$('.video-card');
    const lightbox = $('.lightbox');
    let videoEl = null;
    cards.forEach(card => {
      const btn = $('button', card);
      btn.addEventListener('click', () => {
        if (!lightbox) return;
        lightbox.innerHTML = '';
        lightbox.classList.add('open');
        const vid = document.createElement('video');
        vid.controls = true;
        vid.style.maxWidth = '88%';
        vid.style.borderRadius = '12px';
        vid.src = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';
        videoEl = vid;
        lightbox.appendChild(vid);
        vid.play();
        lightbox.addEventListener('click', closeLB);
      });
    });
    function closeLB() {
      if (videoEl) { try { videoEl.pause(); } catch(e){} }
      lightbox.classList.remove('open');
      lightbox.innerHTML = '<img alt="preview" />';
      lightbox.removeEventListener('click', closeLB);
    }
  }

  /* Letters: floating flowers and glowing hearts */
  function initLetters() {
    const wrap = $('.section');
    if (!wrap) return;
    const makeFlower = () => {
      const f = document.createElement('img');
      f.src = 'assets/images/sparkle.svg';
      f.style.position = 'absolute';
      f.style.left = Math.random()*100 + '%';
      f.style.top = '100%';
      const size = 8 + Math.random()*14;
      f.style.width = size + 'px';
      f.style.opacity = 0.8;
      f.style.animation = 'sparkle ' + (6 + Math.random()*6) + 's linear';
      wrap.appendChild(f);
      setTimeout(() => f.remove(), 12000);
    };
    setInterval(makeFlower, 900);
  }

  /* Nicknames: bubble popups + penguin floats */
  function initNicknames() {
    const messages = {
      'West': 'My compass points West—straight to you.',
      'Sweetheart': 'You sweeten every moment, Sweetheart.',
      'Mr. Penguin': 'Waddle with me forever, Mr. Penguin.',
      'JoJo': 'JoJo, you are joy woven in time.',
      'East': 'East meets West, our hearts meet too.',
      'Darling': 'Darling, you glow brighter than stardust.',
      'Miss Penguin': 'Miss Penguin, let’s waddle hand-in-hand.',
      'Anya': 'Anya, my poetry, my melody.',
      'Annudi': 'Annudi, my sunshine on rainy days.',
      'Anuza': 'Anuza, you are my magic and muse.'
    };
    $$('.bubble').forEach(b => {
      b.addEventListener('click', () => {
        const name = b.textContent.trim();
        const msg = messages[name] || 'You are loved beyond words.';
        showTinyPopup(b, msg);
      });
    });
    // Penguins already animated via CSS; nothing else needed here.
  }
  function showTinyPopup(el, text) {
    const tip = document.createElement('div');
    tip.textContent = text;
    tip.style.position = 'absolute'; tip.style.zIndex = '999';
    const rect = el.getBoundingClientRect();
    tip.style.left = (rect.left + window.scrollX + rect.width/2 - 100) + 'px';
    tip.style.top = (rect.top + window.scrollY - 40) + 'px';
    tip.style.width = '200px'; tip.style.padding = '8px 10px'; tip.style.borderRadius = '10px';
    tip.style.background = 'rgba(255,255,255,.9)'; tip.style.border = '1px solid rgba(255,255,255,.7)';
    tip.style.boxShadow = '0 10px 24px rgba(255,179,217,.45)';
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 2000);
  }

  /* Surprise: typewriter + confetti + hidden message */
  function initSurprise() {
    const target = $('.typewriter');
    const hidden = $('.hidden-message');
    const heart = $('.big-heart');
    if (!target || !heart) return;
    typewriter(target, 'I Love You Ananya');
    heart.addEventListener('click', () => {
      hidden.style.display = 'block';
      confetti();
    });
  }
  function typewriter(el, text) {
    el.textContent = '';
    let i = 0; const t = setInterval(() => {
      el.textContent += text[i]; i++;
      if (i >= text.length) clearInterval(t);
    }, 120);
  }

  function confetti() {
    const colors = ['#ff6fa5', '#ffb3d9', '#e7d1ff', '#ffd6e7'];
    for (let i=0;i<80;i++) {
      const c = document.createElement('div');
      c.style.position = 'fixed'; c.style.top = '-10px';
      c.style.left = Math.random()*100 + '%';
      const size = 6 + Math.random()*10;
      c.style.width = size + 'px'; c.style.height = size + 'px';
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.borderRadius = '50%'; c.style.zIndex = '9999';
      c.style.boxShadow = '0 8px 18px rgba(0,0,0,.08)';
      document.body.appendChild(c);
      const duration = 3000 + Math.random()*2000;
      const endY = window.innerHeight + 20;
      const startX = parseFloat(c.style.left);
      const drift = (Math.random() * 2 - 1) * 20;
      const start = performance.now();
      function animate(t) {
        const elapsed = t - start;
        const p = Math.min(elapsed/duration, 1);
        const y = p * endY;
        c.style.transform = `translate(${drift*p}px, ${y}px)`;
        c.style.opacity = 1 - p;
        if (p < 1) requestAnimationFrame(animate); else c.remove();
      }
      requestAnimationFrame(animate);
    }
  }
})();
