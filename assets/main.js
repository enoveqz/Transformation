(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav: Hintergrund beim Scrollen */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobiles Menü */
  const burger = document.querySelector('.nav__burger');
  const menu = document.getElementById('menu');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Einblenden beim Scrollen */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Hero: weiche, langsam fließende Farbwolken */
  const c = document.querySelector('.hero__orb');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h, dpr, t = 0, mx = 0, my = 0, tx = 0, ty = 0;

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.clientWidth; h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); }, { passive: true });

  const blob = (x, y, r, col) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(236,236,234,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };

  const draw = () => {
    t += 0.004;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    ctx.clearRect(0, 0, w, h);

    const mobile = w < 760;
    const R = Math.min(w, h) * (mobile ? 0.42 : 0.38);
    const cx = w * (mobile ? 0.62 : 0.68) + mx * 30;
    const cy = h * (mobile ? 0.36 : 0.42) + my * 30;

    // weiche Farbwolken
    ctx.globalCompositeOperation = 'multiply';
    blob(cx + Math.cos(t * 1.3) * R * .35, cy + Math.sin(t * 1.1) * R * .3, R * 1.25, 'rgba(185,196,255,.85)');
    blob(cx + Math.sin(t * .9) * R * .4, cy + Math.cos(t * 1.4) * R * .35, R * 1.05, 'rgba(242,201,255,.75)');
    blob(cx + Math.cos(t * .7 + 2) * R * .3, cy + Math.sin(t * .8 + 1) * R * .4, R * .95, 'rgba(255,214,186,.6)');
    ctx.globalCompositeOperation = 'source-over';

    if (!reduce) requestAnimationFrame(draw);
  };
  draw();
})();
