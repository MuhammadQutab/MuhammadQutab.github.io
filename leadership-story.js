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
  let slide = 0;
  const slides = [...document.querySelectorAll('.sec-slide')];
  const stage = document.querySelector('.sec-carousel-stage');
  function selectSlide(index) {
    slide = (index + photos.length) % photos.length;
    slides.forEach((button, i) => {
      let offset = (i - slide + photos.length) % photos.length;
      if (offset > photos.length / 2) offset -= photos.length;
      button.dataset.position = String(offset);
      button.tabIndex = Math.abs(offset) <= 1 ? 0 : -1;
      button.setAttribute('aria-hidden', String(Math.abs(offset) > 1));
    });
    document.querySelectorAll('[data-slide-to]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===slide)));
    document.querySelector('#sec-slide-label').textContent = String(slide+1).padStart(2,'0') + ' / 06 · ' + photos[slide][1];
  }
  slides.forEach((button,i) => button.addEventListener('click', () => {
    if (suppressClick) return;
    if (i !== slide) { selectSlide(i); return; }
    opener = button;
    show(i);
    dialog.showModal();
    document.querySelector('#sec-close').focus();
  }));
  document.querySelector('#sec-slide-prev').addEventListener('click',()=>selectSlide(slide-1));
  document.querySelector('#sec-slide-next').addEventListener('click',()=>selectSlide(slide+1));
  document.querySelectorAll('[data-slide-to]').forEach(button=>button.addEventListener('click',()=>selectSlide(Number(button.dataset.slideTo))));
  stage.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();selectSlide(slide+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();selectSlide(slide-1);}
  });
  stage.addEventListener('dragstart', event => event.preventDefault());
  let startX = 0, startY = 0, dragging = false, suppressClick = false;
  stage.addEventListener('pointerdown',event=>{startX=event.clientX;startY=event.clientY;dragging=true;suppressClick=false;});
  stage.addEventListener('pointermove',event=>{
    if(dragging && Math.abs(event.clientX-startX)>10 && Math.abs(event.clientX-startX)>Math.abs(event.clientY-startY)) stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointerup',event=>{
    if(!dragging) return;
    dragging=false;
    const dx=event.clientX-startX, dy=event.clientY-startY;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) {
      suppressClick=true;selectSlide(slide+(dx<0?1:-1));
      setTimeout(()=>{suppressClick=false;},300);
    }
  });
  stage.addEventListener('pointercancel',()=>{dragging=false;});
  selectSlide(0);
  document.querySelector('#sec-close').addEventListener('click',()=>dialog.close());
  document.querySelector('#sec-prev').addEventListener('click',()=>show(current-1));
  document.querySelector('#sec-next').addEventListener('click',()=>show(current+1));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
  });
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
