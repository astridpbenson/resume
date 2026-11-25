(() => {
  const menu = document.getElementById('menuToggle');
  const nav = document.querySelector('.desktop-nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded','false');
    }));
  }
  const print = document.getElementById('printResume');
  if (print) print.addEventListener('click', () => window.print());
  const toast = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  const copy = document.getElementById('copyEmail');
  if (copy) copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('astridbenson01@gmail.com'); notify('Email copied to clipboard'); }
    catch (_) { window.location.href = 'mailto:astridbenson01@gmail.com'; }
  });
  const metrics = document.querySelectorAll('[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, end = Number(el.dataset.count), prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
        const duration = 850, start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(end * eased).toLocaleString('en-US') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick); observer.unobserve(el);
      });
    }, {threshold: .35});
    metrics.forEach(el => observer.observe(el));
  }
})();