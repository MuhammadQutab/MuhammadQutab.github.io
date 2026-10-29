(() => {
  const dialog = document.querySelector('#sec-lightbox');
  const photo = document.querySelector('#sec-full-photo');
  const caption = document.querySelector('#sec-photo-caption');
  const count = document.querySelector('#sec-photo-count');
  const photos = [
    ['stage','On stage, together.'],['team','The team behind the event.'],
    ['connections','Connections at SEC ’24.'],['conversation','Conversations beyond the stage.'],
    ['announcement','Named Head of Team Media.'],['media-team','Team Media, SEC 2024.']
  ];
  let current = 0;
  let opener;
  function show(index) {
    current = (index + photos.length) % photos.length;
    photo.src = `assets/sec/${photos[current][0]}.webp`;
    photo.alt = photos[current][1];
    caption.textContent = photos[current][1];
    count.textContent = `${String(current+1).padStart(2,'0')} / 06`;
  }
  document.querySelectorAll('[data-sec-photo]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    show(Number(button.dataset.secPhoto));
    dialog.showModal();
    document.querySelector('#sec-close').focus();
  }));
  document.querySelector('#sec-close').addEventListener('click',()=>dialog.close());
  document.querySelector('#sec-prev').addEventListener('click',()=>show(current-1));
  document.querySelector('#sec-next').addEventListener('click',()=>show(current+1));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
  });
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
