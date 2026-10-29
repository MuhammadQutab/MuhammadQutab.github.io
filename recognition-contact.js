(() => {
  'use strict';
  const form = document.querySelector('#brief-form');
  const status = document.querySelector('#brief-status');
  const submit = form.querySelector('button[type="submit"]');
  const email = 'muhammadqutab6@gmail.com';
  let sending = false;
  const motionOff = () => document.documentElement.classList.contains('motion-off') || matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-enquiry-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelector('#enquiry').scrollIntoView({behavior: motionOff() ? 'instant' : 'smooth', block: 'start'});
      document.querySelector('#enquiry-name').focus({preventScroll:true});
      history.replaceState(null, '', '#enquiry');
    });
  });
  document.querySelector('#copy-email').addEventListener('click', async () => {
    const copyStatus = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email address copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.contact-email'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Email address selected. Copy the selected text, or choose Open Gmail.';
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    for (const name of ['name', 'email', 'message']) {
      const input = form.elements.namedItem(name);
      input.value = input.value.trim();
      input.setCustomValidity(name === 'message' && input.value.length < 10 ? 'Please write at least 10 characters.' : name === 'name' && input.value.length < 2 ? 'Please enter your name.' : '');
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('_honey') || '').trim()) return;
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Submitting your enquiry. Please keep this page open.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/' + email, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(Object.fromEntries(data.entries())),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('server');
      const result = await response.json();
      const accepted = result.success === true || result.success === 'true';
      const needsActivation = /activat|confirm.*email|check.*email/i.test(String(result.message || ''));
      if (needsActivation) {
        status.dataset.state = 'error';
        status.textContent = 'Email delivery is awaiting confirmation by the site owner. Please use Open Gmail or the email address beside this form for now. Your message is still here.';
      } else if (accepted) {
        status.dataset.state = 'success';
        status.textContent = 'Thank you — your enquiry has been submitted. Muhammad can reply to the email address you provided.';
        form.reset();
      } else {
        throw new Error('rejected');
      }
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError'
        ? 'The request took too long, so delivery could not be confirmed. Your message is still here. You can try again or use Open Gmail.'
        : 'Your enquiry could not be confirmed. Your message is still here. Please try again, or use Open Gmail / Copy email beside this form.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      submit.innerHTML = 'Send enquiry <span>↗</span>';
      form.removeAttribute('aria-busy');
    }
  });
  form.querySelectorAll('input,textarea').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));

  document.querySelectorAll('.honour-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (motionOff() || !matchMedia('(pointer: fine)').matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--honour-tilt', ((event.clientX - rect.left) / rect.width - .5) * 9 + 'deg');
      card.style.setProperty('--honour-lift', '-5px');
    }, {passive:true});
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--honour-tilt', '0deg');
      card.style.setProperty('--honour-lift', '0px');
    });
  });
})();
