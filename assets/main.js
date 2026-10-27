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

/* Beispiele: Polaroid-Galerie mit Großansicht */
(() => {
  const data = [
    { k:'schreinerei', t:'Schreinerei', url:'werkbank-sieben.de', text:'Warme Holztöne und eine kräftige Serifenschrift zeigen Handwerk und Beständigkeit. Wichtigster Knopf: kostenloses Aufmaß anfragen.', f:['Leistungen mit Bildern','Holzarten zum Vergleichen','Anruf mit einem Tipp','Ablauf in 3 Schritten'] },
    { k:'friseur', t:'Friseur', url:'salon-mira.de', text:'Ruhige Farben, elegante Kursivschrift und viel Luft. Die Online-Terminbuchung steht ganz oben und entlastet das Telefon.', f:['Online-Terminbuchung','Preisliste','Team-Vorstellung','Öffnungszeiten'] },
    { k:'doener', t:'Dönerladen', url:'ocak-grill.de', text:'Laut, rot und appetitlich. Die Speisekarte ist filterbar, bestellt wird mit einem Tipp, das Mittagsmenü springt sofort ins Auge.', f:['Speisekarte mit Filter','Online bestellen','Mittagsangebot','Für das Handy gebaut'] },
    { k:'baeckerei', t:'Bäckerei & Café', url:'backstube-morgenrot.de', text:'Gemütlich und regional, mit handschriftlichen Akzenten. Kundschaft sieht, was heute in der Theke liegt, und kann für morgen vorbestellen.', f:['Tagesangebot','Vorbestellung','Frühstückskarte','Hinweisleiste oben'] },
    { k:'werkstatt', t:'Kfz-Werkstatt', url:'garage-19.de', text:'Dunkel, technisch und klar, mit Festpreisen. Termine werden online gebucht, den Status bekommt die Kundschaft automatisch aufs Handy.', f:['Terminbuchung mit Kennzeichen','Festpreise','Automatische Status-Updates','Freigabe per Klick'] },
  ];
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  const pols = [...document.querySelectorAll('.polaroid')];
  const $ = id => document.getElementById(id);
  const stage = lb.querySelector('.lightbox__stage');
  let cur = 0, opener = null;

  const show = i => {
    cur = (i + data.length) % data.length;
    const d = data[cur];
    $('lb-count').textContent = `${cur + 1} / ${data.length}`;
    $('lb-title').textContent = d.t;
    $('lb-url').textContent = d.url;
    $('lb-desk').src = `assets/img/demos/${d.k}-desktop.webp`; $('lb-desk').alt = `Desktop-Ansicht: ${d.t}`;
    $('lb-mob').src = `assets/img/demos/${d.k}-mobil.webp`; $('lb-mob').alt = `Handy-Ansicht: ${d.t}`;
    $('lb-text').textContent = d.text;
    $('lb-feat').innerHTML = d.f.map(x => `<li>${x}</li>`).join('');
    $('lb-live').href = `demos/${d.k}.html`;
    lb.querySelectorAll('.browser__scroll,.phone__scroll').forEach(s => s.scrollTop = 0);
    pols.forEach((p, j) => p.classList.toggle('is-active', j === cur));
  };
  const open = i => { opener = pols[i]; show(i); lb.showModal(); document.body.classList.add('lb-open'); };
  const close = () => lb.close();

  pols.forEach((p, i) => p.addEventListener('click', () => open(i)));
  lb.addEventListener('close', () => { document.body.classList.remove('lb-open'); pols.forEach(p => p.classList.remove('is-active')); opener && opener.focus(); });
  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  lb.querySelectorAll('.lightbox__view button').forEach(b => b.addEventListener('click', () => {
    lb.querySelectorAll('.lightbox__view button').forEach(x => x.classList.toggle('on', x === b));
    stage.dataset.view = b.dataset.v;
  }));
  const setMobileView = () => { if (innerWidth <= 760 && stage.dataset.view === 'both') { stage.dataset.view = 'mobil'; lb.querySelectorAll('.lightbox__view button').forEach(x => x.classList.toggle('on', x.dataset.v === 'mobil')); } };
  setMobileView(); addEventListener('resize', setMobileView);
  let x0 = null;
  lb.querySelector('.lightbox__foot').addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  lb.querySelector('.lightbox__foot').addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); x0 = null; });
})();

/* Leistungen: Reiter */
(() => {
  const tabs = [...document.querySelectorAll('.tabs [role=tab]')];
  if (!tabs.length) return;
  const select = (t, focus) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', on);
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length], true);
      if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length], true);
    });
  });
  select(tabs[0]);
  document.querySelectorAll('[data-tab]').forEach(a => a.addEventListener('click', () => {
    const t = document.getElementById('tab-' + a.dataset.tab); if (t) select(t);
  }));
})();

/* Logo: immer ganz nach oben */
document.querySelector('.nav__logo')?.addEventListener('click', e => {
  e.preventDefault();
  const m = document.getElementById('menu');
  if (m && !m.hidden) document.querySelector('.nav__burger').click();
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
});
