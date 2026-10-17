'use strict';

(() => {
  const byId = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = byId('intro-screen');
  const gallery = byId('gallery-dialog');
  const photo = byId('gallery-image');
  const moments = [{"file": "02-1000121266.jpg", "alt": "Foto de um momento juntos"}, {"file": "09-1000100800.jpg", "alt": "Foto de um momento juntos"}, {"file": "01-1000232092.jpg", "alt": "Foto de um momento juntos"}, {"file": "12-1000096907.jpg", "alt": "Foto de um momento juntos"}, {"file": "06-1000110300.jpg", "alt": "Foto de um momento juntos"}, {"file": "07-1000110285.jpg", "alt": "Foto de um momento juntos"}, {"file": "04-1000119732.jpg", "alt": "Foto de um momento juntos"}, {"file": "05-1000110263.jpg", "alt": "Foto de um momento juntos"}, {"file": "08-1000109529.jpg", "alt": "Foto de um momento juntos"}, {"file": "11-1000097333.jpg", "alt": "Foto de um momento juntos"}, {"file": "album-ultima.png", "alt": "Foto do casal, com ela de vestido marrom e ele de camisa escura"}];
  const portraits = [{"file": "amor-1.jpg", "alt": "Amor com a amiga Clarissa ao fundo", "caption": "Participação especial da Clarissa ♡"}, {"file": "amor-2.jpg", "alt": "Amor apoiando o rosto na mão e sorrindo", "caption": ""}, {"file": "amor-3.jpg", "alt": "Amor dando um sorriso aberto", "caption": ""}, {"file": "amor-4.jpg", "alt": "Amor de camisa amarela ao ar livre", "caption": ""}, {"file": "amor-5.jpg", "alt": "Amor sorrindo à mesa", "caption": ""}, {"file": "amor-6.jpg", "alt": "Amor fazendo sinal de paz ao ar livre", "caption": ""}, {"file": "amor-7.jpg", "alt": "Amor de óculos escuros e camisa amarela", "caption": ""}];
  let activePhotos = moments;
  let portraitMode = false;
  let currentPhoto = 0;
  let galleryTrigger = null;
  let touchStart = null;
  let touchCurrent = null;

  function showMoment(index) {
    currentPhoto = (index + activePhotos.length) % activePhotos.length;
    const moment = activePhotos[currentPhoto];
    photo.src = 'assets/' + moment.file;
    photo.alt = moment.alt;
    byId('gallery-title').textContent = portraitMode ? 'Hoje é sobre você, amor.' : 'Para viver mais momentos assim.';
    byId('gallery-description').textContent = moment.caption || '';
    byId('gallery-description').hidden = !moment.caption;
    byId('gallery-hint').textContent = portraitMode ? 'feito para te ver sorrir' : 'com carinho, para você';
    byId('gallery-counter').textContent = String(currentPhoto + 1).padStart(2, '0') + ' / ' + activePhotos.length;
  }

  function syncPageLock() {
    document.body.classList.toggle('modal-open', intro.open || gallery.open);
  }

  function openGallery(index, trigger, isPortrait = false) {
    portraitMode = isPortrait;
    activePhotos = isPortrait ? portraits : moments;
    galleryTrigger = trigger;
    showMoment(index);
    if (!gallery.open) gallery.showModal();
    syncPageLock();
  }

  document.querySelectorAll('[data-gallery]').forEach((button) => {
    button.addEventListener('click', () => openGallery(Number(button.dataset.gallery), button));
  });
  document.querySelectorAll('[data-portrait]').forEach((button) => {
    button.addEventListener('click', () => openGallery(Number(button.dataset.portrait), button, true));
  });
  byId('all-memories').addEventListener('click', (event) => openGallery(0, event.currentTarget));
  byId('prev-photo').addEventListener('click', () => showMoment(currentPhoto - 1));
  byId('next-photo').addEventListener('click', () => showMoment(currentPhoto + 1));
  byId('close-gallery').addEventListener('click', () => gallery.close());
  gallery.addEventListener('close', () => {
    syncPageLock();
    galleryTrigger?.focus({ preventScroll: true });
  });
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showMoment(currentPhoto + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showMoment(currentPhoto - 1); }
  });
  photo.addEventListener('touchstart', (event) => {
    touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    touchCurrent = null;
  }, { passive: true });
  photo.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    touchCurrent = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    const dx = touchCurrent.x - touchStart.x;
    const dy = touchCurrent.y - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showMoment(currentPhoto + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  photo.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  [gallery].forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  const openedNotes = new Set();
  document.querySelectorAll('[data-note]').forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      if (!isExpanded) openedNotes.add(button.dataset.note);
      const count = openedNotes.size;
      byId('notes-status').textContent = count === 3
        ? 'Três carinhos para lembrar: você merece ser muito feliz, amor. ♡'
        : count + ' de 3 bilhetinhos descobertos. Cada um foi escrito para você. ♡';
    });
  });

  const envelope = byId('open-letter');
  const letter = byId('love-letter');
  envelope.addEventListener('click', () => {
    envelope.setAttribute('aria-expanded', 'true');
    envelope.hidden = true;
    letter.hidden = false;
    letter.focus({ preventScroll: true });
    letter.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });
  byId('close-letter').addEventListener('click', () => {
    letter.hidden = true;
    envelope.hidden = false;
    envelope.setAttribute('aria-expanded', 'false');
    envelope.focus({ preventScroll: true });
    envelope.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
  });

  let candleOut = false;
  byId('blow-candle').addEventListener('click', () => {
    if (candleOut) { celebrate(); return; }
    candleOut = true;
    document.querySelector('.cake-scene').classList.add('candle-out');
    byId('birthday-status').textContent = 'Pedido feito. Agora deixa a vida cuidar dos detalhes. ♡';
    byId('birthday-reveal').hidden = false;
    byId('blow-candle').innerHTML = 'Feliz aniversário, meu amor! <span aria-hidden="true">♡</span>';
    celebrate();
  });
  byId('celebrate-again').addEventListener('click', celebrate);

  const canvas = byId('confetti');
  const context = canvas.getContext('2d');
  let confettiFrame = 0;
  let pieces = [];
  let animationStart = 0;
  let lastTime = 0;
  const colors = ['#791f36', '#d99d89', '#c4944d', '#fff3da', '#b66571', '#aeb69a'];

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function stopConfetti() {
    cancelAnimationFrame(confettiFrame);
    confettiFrame = 0;
    pieces = [];
    if (context) context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function celebrate(options = {}) {
    const rain = options.rain === true;
    if (!context || reducedMotion.matches) return;
    stopConfetti();
    sizeCanvas();
    const width = window.innerWidth;
    const height = window.innerHeight;
    pieces = Array.from({ length: width < 600 ? 95 : 160 }, () => ({
      x: rain ? Math.random() * width : width * (.2 + Math.random() * .6),
      y: rain ? -12 - Math.random() * height * .7 : height * .48,
      vx: (Math.random() - .5) * (rain ? 1.4 : 13),
      vy: rain ? 2.3 + Math.random() * 3 : -8 - Math.random() * 13,
      gravity: rain ? .05 : .17,
      size: 4 + Math.random() * 6,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - .5) * .2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    animationStart = 0;
    lastTime = 0;
    confettiFrame = requestAnimationFrame(drawConfetti);
  }

  function drawConfetti(time) {
    if (!animationStart) animationStart = time;
    const delta = Math.min((time - (lastTime || time)) / 16.67, 2);
    lastTime = time;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces = pieces.filter((piece) => piece.y < window.innerHeight + 40);
    for (const piece of pieces) {
      piece.vy += piece.gravity * delta;
      piece.vx *= Math.pow(.993, delta);
      piece.x += piece.vx * delta;
      piece.y += piece.vy * delta;
      piece.angle += piece.spin * delta;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;
      context.globalAlpha = Math.min(1, (6000 - (time - animationStart)) / 1000);
      context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * .65);
      context.restore();
    }
    if (pieces.length && time - animationStart < 6000) confettiFrame = requestAnimationFrame(drawConfetti);
    else stopConfetti();
  }

  window.addEventListener('resize', () => { if (confettiFrame) sizeCanvas(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopConfetti(); }
  });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stopConfetti();
  });

  let sideConfettiStarted = false;
  function startSideConfetti() {
    if (sideConfettiStarted) return;
    sideConfettiStarted = true;
    const container = byId('side-confetti');
    const palette = ['#a92f46', '#d09a35', '#c65b76', '#698a64', '#4e8b9b', '#d47542'];
    const countPerSide = reducedMotion.matches ? 14 : (window.innerWidth < 600 ? 22 : 30);
    for (const side of ['left', 'right']) {
      const lane = document.createElement('div');
      lane.className = 'confetti-lane confetti-lane-' + side;
      for (let i = 0; i < countPerSide; i += 1) {
        const piece = document.createElement('i');
        piece.className = 'side-confetti-piece';
        const duration = reducedMotion.matches ? 16 + Math.random() * 8 : 6 + Math.random() * 5;
        piece.style.setProperty('--piece-x', (5 + Math.random() * 84) + '%');
        piece.style.setProperty('--piece-width', (4 + Math.random() * 5) + 'px');
        piece.style.setProperty('--piece-height', (7 + Math.random() * 7) + 'px');
        piece.style.setProperty('--piece-color', palette[i % palette.length]);
        piece.style.setProperty('--fall-duration', duration + 's');
        piece.style.setProperty('--fall-delay', -(i / countPerSide) * duration + 's');
        piece.style.setProperty('--piece-drift', (Math.random() - .5) * 30 + 'px');
        piece.style.setProperty('--piece-rotation', (Math.random() - .5) * 120 + 'deg');
        lane.appendChild(piece);
      }
      container.appendChild(lane);
    }
    container.classList.add('is-active');
  }

  const music = byId('birthday-music');
  const musicToggle = byId('music-toggle');
  music.volume = .35;
  function updateMusicControl(playing, message) {
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', (playing ? 'Pausar' : 'Tocar') + ' Coração Radiante');
    byId('music-icon').textContent = playing ? 'Ⅱ' : '▶';
    byId('music-status').textContent = message || (playing ? 'Pausar música' : 'Retomar música');
  }
  function playMusic() {
    musicToggle.hidden = false;
    updateMusicControl(false, 'Carregando música…');
    const result = music.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => updateMusicControl(false, 'Toque para ouvir'));
    }
  }
  music.addEventListener('play', () => updateMusicControl(true));
  music.addEventListener('pause', () => updateMusicControl(false));
  music.addEventListener('error', () => updateMusicControl(false, 'Toque para tentar novamente'));
  musicToggle.addEventListener('click', () => {
    if (music.paused) playMusic();
    else music.pause();
  });

  let introClosing = false;
  intro.addEventListener('close', () => {
    document.body.classList.remove('intro-open');
    intro.classList.remove('intro-leaving');
    syncPageLock();
    window.scrollTo(0, 0);
    byId('hero-title').focus({ preventScroll: true });
  });
  byId('start-surprise').addEventListener('click', () => {
    if (introClosing) return;
    introClosing = true;
    playMusic();
    startSideConfetti();
    byId('start-surprise').disabled = true;
    intro.classList.add('intro-leaving');
    if (reducedMotion.matches) intro.close();
    else window.setTimeout(() => intro.close(), 240);
  });
  if (typeof intro.showModal === 'function') {
    intro.showModal();
    document.body.classList.add('intro-open');
    syncPageLock();
  }
})();
