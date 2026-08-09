(() => {
  document.documentElement.classList.add('js');
  const header = document.querySelector('.site-header');
  const mobileCta = document.querySelector('.mobile-cta');
  const requestSection = document.querySelector('#request');
  const form = document.querySelector('#lead-form');
  const frame = document.querySelector('#form-target');
  const errorBox = document.querySelector('#form-error');
  const success = document.querySelector('#success-state');
  const sourceField = document.querySelector('#source-field');
  const loadedAt = Date.now();
  let submitting = false;

  document.querySelector('#year').textContent = new Date().getFullYear();

  const setHeader = () => {
    header?.classList.toggle('is-sticky', window.scrollY > 76);
  };
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -35px' });
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  if (mobileCta && requestSection && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
      mobileCta.style.display = entry.isIntersecting ? 'none' : '';
    }, { threshold: 0.08 });
    ctaObserver.observe(requestSection);
  }

  const params = new URLSearchParams(window.location.search);
  const campaign = (params.get('src') || params.get('utm_source') || 'direct').replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 60);
  if (sourceField) sourceField.value = `website:${campaign}`;

  const showError = (message, field) => {
    if (errorBox) errorBox.textContent = message;
    if (field) {
      field.focus({ preventScroll: true });
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  form?.addEventListener('submit', (event) => {
    if (form.elements.website?.value) {
      event.preventDefault();
      return;
    }

    if (Date.now() - loadedAt < 2000) {
      event.preventDefault();
      showError('Please take a moment to review the disclosure before submitting.');
      return;
    }

    if (!form.checkValidity()) {
      event.preventDefault();
      const invalid = form.querySelector(':invalid');
      showError('Please complete all required fields and accept the consent statement.', invalid);
      return;
    }

    if (errorBox) errorBox.textContent = '';
    submitting = true;
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.querySelector('span:first-child').textContent = 'Sending securely…';
  });

  frame?.addEventListener('load', () => {
    if (!submitting) return;
    submitting = false;
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
