/* ART GSTAAD — interactions (pro layer) */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page fade-in / transitions ---------- */
  document.body.classList.add('loaded');
  document.querySelectorAll('a[href$=".html"]').forEach(a => {
    if (a.target === '_blank') return;
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => { location.href = href; }, 380);
    });
  });

  /* ---------- Intro curtain (once per session) ---------- */
  const intro = document.querySelector('.intro');
  if (intro) {
    let seen = false;
    try { seen = sessionStorage.getItem('ag-intro') === '1'; } catch (e) {}
    if (seen || reduced) {
      intro.classList.add('done');
    } else {
      document.body.style.overflow = 'hidden';
      const finish = () => {
        intro.classList.add('lift');
        document.body.style.overflow = '';
        try { sessionStorage.setItem('ag-intro', '1'); } catch (e) {}
        setTimeout(() => intro.classList.add('done'), 1200);
      };
      const t = setTimeout(finish, 3400);
      intro.addEventListener('click', () => { clearTimeout(t); finish(); });
    }
  }

  /* ---------- Summit panorama ---------- */
  const summit = document.querySelector('.summit');
  if (summit) {
    requestAnimationFrame(() => summit.classList.add('drawn'));
    if (!reduced && window.matchMedia('(hover: hover)').matches) {
      const far = summit.querySelector('.layer-far');
      const mid = summit.querySelector('.layer-mid');
      const front = summit.querySelector('.layer-front');
      let raf = null;
      summit.addEventListener('mousemove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const dx = (e.clientX / window.innerWidth - 0.5);
          const dy = (e.clientY / window.innerHeight - 0.5);
          far.style.transform = 'translate(' + (dx * -6) + 'px,' + (dy * -3) + 'px)';
          mid.style.transform = 'translate(' + (dx * -14) + 'px,' + (dy * -6) + 'px)';
          front.style.transform = 'translate(' + (dx * -24) + 'px,' + (dy * -10) + 'px)';
          raf = null;
        });
      });
      summit.addEventListener('mouseleave', () => {
        [far, mid, front].forEach(l => { l.style.transform = ''; });
      });
    }
  }

  /* ---------- Header state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
    });
  }

  /* ---------- Scroll reveal (incl. ridge dividers) ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal, .ridge-divider').forEach(el => io.observe(el));

  /* ---------- Lightbox (works + room pieces) ---------- */
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lb-caption');
    document.querySelectorAll('.work, .piece').forEach(w => {
      w.addEventListener('click', () => {
        const img = w.querySelector('img');
        if (!img) return;
        lbImg.src = img.src; lbImg.alt = img.alt || '';
        lbCap.textContent = w.dataset.caption || img.alt || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    lb.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Active nav ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---------- Rotating hero ---------- */
  const rotator = document.querySelector('.hero-rotator');
  if (rotator && !reduced) {
    const slides = rotator.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.hero-dots button');
    const caption = document.querySelector('.hero-caption span');
    let i = 0, timer;
    const show = n => {
      i = n % slides.length;
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      if (caption) caption.textContent = slides[i].dataset.caption || '';
    };
    const play = () => { timer = setInterval(() => show(i + 1), 7000); };
    dots.forEach((d, k) => d.addEventListener('click', () => { clearInterval(timer); show(k); play(); }));
    show(0); play();
  }

  /* ---------- Manifesto word reveal ---------- */
  const mani = document.querySelector('.manifesto .m-line');
  if (mani) {
    const words = mani.querySelectorAll('.w');
    const mio = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      words.forEach((w, k) => setTimeout(() => w.classList.add('on'), 90 * k));
      mio.disconnect();
    }), { threshold: 0.4 });
    mio.observe(mani);
  }

  /* ---------- Countdown ---------- */
  const cd = document.querySelector('.countdown');
  if (cd) {
    const target = new Date('2026-09-01T10:00:00+02:00').getTime();
    const cells = {
      d: cd.querySelector('[data-cd="d"]'), h: cd.querySelector('[data-cd="h"]'),
      m: cd.querySelector('[data-cd="m"]'), s: cd.querySelector('[data-cd="s"]')
    };
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      let diff = Math.max(0, target - Date.now()) / 1000;
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60);
      const s = Math.floor(diff - m * 60);
      cells.d.textContent = d; cells.h.textContent = pad(h);
      cells.m.textContent = pad(m); cells.s.textContent = pad(s);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Typewriter ---------- */
  const tw = document.querySelector('.typewriter .tw-text');
  if (tw) {
    const phrases = JSON.parse(document.querySelector('.typewriter').dataset.phrases);
    let p = 0, c = 0, deleting = false;
    const step = () => {
      const full = phrases[p];
      tw.textContent = full.slice(0, c);
      if (!deleting && c < full.length) { c++; setTimeout(step, 45); }
      else if (!deleting) { deleting = true; setTimeout(step, 2200); }
      else if (c > 0) { c--; setTimeout(step, 18); }
      else { deleting = false; p = (p + 1) % phrases.length; setTimeout(step, 400); }
    };
    if (reduced) { tw.textContent = phrases[0]; } else step();
  }

  /* ---------- Flipbook ---------- */
  const fb = document.querySelector('.flipbook');
  if (fb) {
    const pages = [...fb.querySelectorAll('.fb-page')];
    pages.forEach((p, k) => { p.style.zIndex = pages.length - k; });
    let current = 0; // number of flipped pages
    const count = document.querySelector('.fb-count');
    const update = () => {
      pages.forEach((p, k) => {
        p.classList.toggle('flipped', k < current);
        p.style.zIndex = (k < current) ? k + 1 : pages.length - k;
      });
      if (count) count.textContent = 'Spread ' + Math.min(current + 1, pages.length) + ' / ' + pages.length;
    };
    const next = () => { if (current < pages.length) { current++; update(); } };
    const prev = () => { if (current > 0) { current--; update(); } };
    pages.forEach((p, k) => p.addEventListener('click', () => { (k < current) ? prev() : next(); }));
    const bN = document.querySelector('.fb-next'), bP = document.querySelector('.fb-prev');
    if (bN) bN.addEventListener('click', next);
    if (bP) bP.addEventListener('click', prev);
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
    // jump from question list
    document.querySelectorAll('[data-goto-spread]').forEach(q => {
      q.addEventListener('click', () => {
        current = parseInt(q.dataset.gotoSpread, 10);
        update();
        document.querySelector('.flipbook-stage').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    update();
  }

  /* ---------- Collection: view toggle + filter ---------- */
  const vt = document.querySelector('.view-toggle');
  if (vt) {
    const roomView = document.getElementById('room-view');
    const indexView = document.getElementById('index-view');
    vt.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      vt.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const rooms = b.dataset.view === 'rooms';
      roomView.style.display = rooms ? '' : 'none';
      indexView.style.display = rooms ? 'none' : '';
    }));
  }
  const fbar = document.querySelector('.filter-bar');
  if (fbar) {
    fbar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      fbar.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.filter;
      document.querySelectorAll('#index-view .work').forEach(w => {
        w.classList.toggle('hiddenwork', f !== 'all' && (w.dataset.artist || '') !== f);
      });
    }));
  }

  /* ---------- Reading progress ---------- */
  const prog = document.querySelector('.progress');
  if (prog) {
    const upd = () => {
      const h = document.documentElement;
      prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    };
    window.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- Live conditions in Gsteig (open-meteo) ---------- */
  const cond = document.querySelector('.conditions');
  if (cond) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=46.387&longitude=7.267&current=temperature_2m,weather_code&timezone=Europe%2FZurich')
      .then(r => r.json())
      .then(d => {
        const codes = { 0:'clear skies',1:'mostly clear',2:'partly cloudy',3:'overcast',45:'fog',48:'fog',51:'drizzle',61:'light rain',63:'rain',65:'heavy rain',71:'light snow',73:'snow',75:'heavy snow',77:'snow grains',80:'showers',81:'showers',82:'heavy showers',85:'snow showers',86:'snow showers',95:'thunderstorm' };
        const c = d.current;
        cond.textContent = 'Currently in Gsteig: ' + Math.round(c.temperature_2m) + '°C, ' + (codes[c.weather_code] || '—') + ' · 1,184 m above sea level';
      })
      .catch(() => { cond.textContent = 'Gsteig b. Gstaad · 1,184 m above sea level'; });
  }
})();
