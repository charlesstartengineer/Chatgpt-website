document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 650));

  // Ambient particles are deliberately sparse to keep compositing inexpensive.
  const particleField = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    const size = Math.random() * 2.5 + .7;
    particle.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 90}%;--duration:${3 + Math.random() * 5}s;animation-delay:-${Math.random() * 6}s;opacity:${.18 + Math.random() * .55}`;
    particleField.appendChild(particle);
  }

  const cursor = document.querySelector('.cursor-glow');
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', ({ clientX, clientY }) => {
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
    }, { passive: true });
  }

  const spotlightItems = document.querySelectorAll('.spotlight');
  spotlightItems.forEach(item => item.addEventListener('pointermove', event => {
    const bounds = item.getBoundingClientRect();
    item.style.setProperty('--x', `${event.clientX - bounds.left}px`);
    item.style.setProperty('--y', `${event.clientY - bounds.top}px`);
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 35), { passive: true });

  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', open);
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

  const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.counted) return;
    entry.target.dataset.counted = 'true';
    const target = Number(entry.target.dataset.count);
    const suffix = entry.target.dataset.suffix;
    const decimal = target % 1 !== 0;
    const start = performance.now();
    const duration = 1500;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      entry.target.textContent = `${decimal ? value.toFixed(1) : Math.round(value)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .45 });
  document.querySelectorAll('[data-count]').forEach(counter => countObserver.observe(counter));

  const intensity = document.getElementById('intensity');
  const intensityValue = document.getElementById('intensityValue');
  intensity.addEventListener('input', () => {
    intensityValue.textContent = `${intensity.value}%`;
    document.documentElement.style.setProperty('--purple', `hsl(${255 + Number(intensity.value) / 7} 100% 73%)`);
  });

  document.querySelectorAll('.toggle').forEach(toggle => toggle.addEventListener('click', () => {
    const enabled = toggle.classList.toggle('enabled');
    toggle.setAttribute('aria-pressed', enabled);
  }));

  document.querySelectorAll('.dash-nav button').forEach(button => button.addEventListener('click', () => {
    document.querySelector('.dash-nav .selected').classList.remove('selected');
    button.classList.add('selected');
  }));

  document.getElementById('newProject').addEventListener('click', event => {
    const count = document.getElementById('projectCount');
    count.textContent = Number(count.textContent) + 1;
    event.currentTarget.textContent = '✓ Project created';
    event.currentTarget.style.background = '#527a6a';
    setTimeout(() => { event.currentTarget.textContent = '+ New project'; event.currentTarget.style.background = ''; }, 1800);
  });
});
