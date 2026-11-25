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
  const commandOverlay = document.getElementById('commandOverlay');
  const commandTrigger = document.getElementById('commandTrigger');
  const commandClose = document.getElementById('commandClose');
  const commandSearch = document.getElementById('commandSearch');
  const commandItems = Array.from(document.querySelectorAll('.command-item'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function closePalette() {
    if (!commandOverlay) return;
    commandOverlay.hidden = true;
    document.body.classList.remove('palette-open');
    if (commandTrigger) commandTrigger.focus();
  }
  function openPalette() {
    if (!commandOverlay) return;
    commandOverlay.hidden = false;
    document.body.classList.add('palette-open');
    if (commandSearch) { commandSearch.value = ''; filterCommands(''); requestAnimationFrame(() => commandSearch.focus()); }
  }
  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    commandItems.forEach(item => {
      item.hidden = !!q && !item.textContent.toLowerCase().includes(q) && !(item.dataset.search || '').includes(q);
    });
    document.querySelectorAll('.command-group-label').forEach(label => {
      let next = label.nextElementSibling, hasVisible = false;
      while (next && !next.classList.contains('command-group-label')) {
        if (next.matches('.command-item') && !next.hidden) hasVisible = true;
        next = next.nextElementSibling;
      }
      label.hidden = !hasVisible;
    });
  }
  function runCommand(item) {
    if (item.dataset.command) {
      const target = document.querySelector(item.dataset.command);
      closePalette();
      if (target) target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'});
    } else if (item.dataset.action === 'print') {
      closePalette(); window.print();
    } else if (item.dataset.action === 'copy') {
      navigator.clipboard.writeText('astridbenson01@gmail.com').then(() => notify('Email copied to clipboard')).catch(() => { window.location.href='mailto:astridbenson01@gmail.com'; });
      closePalette();
    }
  }
  if (commandTrigger) commandTrigger.addEventListener('click', openPalette);
  if (commandClose) commandClose.addEventListener('click', closePalette);
  if (commandOverlay) commandOverlay.addEventListener('click', event => { if (event.target === commandOverlay) closePalette(); });
  if (commandSearch) commandSearch.addEventListener('input', () => filterCommands(commandSearch.value));
  commandItems.forEach(item => item.addEventListener('click', () => runCommand(item)));
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); commandOverlay && commandOverlay.hidden ? openPalette() : closePalette(); }
    if (event.key === 'Escape' && commandOverlay && !commandOverlay.hidden) closePalette();
    if (event.key === 'Enter' && commandSearch && document.activeElement === commandSearch && !commandOverlay.hidden) {
      const first = commandItems.find(item => !item.hidden);
      if (first) first.click();
    }
    if (event.key === 'ArrowDown' && commandSearch && document.activeElement === commandSearch && !commandOverlay.hidden) {
      event.preventDefault(); const first = commandItems.find(item => !item.hidden); if (first) first.focus();
    }
  });

  const progressBar = document.getElementById('scrollProgress');
  let progressQueued = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? window.scrollY / max : 0;
    if (progressBar) progressBar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, amount)) + ')';
    progressQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
  }, {passive:true});
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const sections = ['impact','approach','experience','contact'].map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-25% 0px -65% 0px'});
    sections.forEach(section => activeObserver.observe(section));
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.section-intro,.metric-card,.principle,.case-card,.timeline-item,.capability-cloud span');
    document.body.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {threshold:.12});
    revealTargets.forEach(target => { target.classList.add('reveal-item'); revealObserver.observe(target); });
  }

  const metrics = document.querySelectorAll('[data-count]');
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