(() => {
  const gallery = document.querySelector('.recognition-collection');
  if (!gallery) return;
  const track = gallery.querySelector('.recognition-track');
  const buttons = [...gallery.querySelectorAll('[data-rec-direction]')];
  const update = () => {
    buttons[0].disabled = track.scrollLeft < 2;
    buttons[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const move = direction => {
    const tile = track.querySelector('.recognition-tile');
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-off');
    track.scrollBy({left: direction * (tile.getBoundingClientRect().width + gap), behavior: reduced ? 'instant' : 'smooth'});
  };
  buttons.forEach(button => button.addEventListener('click', () => move(Number(button.dataset.recDirection))));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  track.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(track);
  update();
})();
