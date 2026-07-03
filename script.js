document.addEventListener('DOMContentLoaded', () => {
  const screens = {
    start: document.getElementById('startScreen'),
    nameEntry: document.getElementById('nameEntryScreen'),
    envelope: document.getElementById('envelopeScreen'),
    takeoff: document.getElementById('takeoffScreen'),
    game: document.getElementById('gameScreen'),
    flight: document.getElementById('flightScreen'),
    peek: document.getElementById('peekScreen'),
    name: document.getElementById('nameScreen'),
    candle: document.getElementById('candleScreen'),
    funfact: document.getElementById('funfactScreen'),
    details: document.getElementById('detailsScreen'),
    invite: document.getElementById('inviteScreen'),
  };
  const envelope = document.getElementById('envelope');
  const hotAirBalloon = document.querySelector('.hot-air-balloon');
  const nameBurst = document.getElementById('nameBurst');
  const mascot = document.getElementById('mascot');
  const gameField = document.getElementById('gameField');
  const gameScore = document.getElementById('gameScore');
  const gameHeading = document.getElementById('gameHeading');
  const candleFlame = document.getElementById('candleFlame');
  const candleHeading = document.getElementById('candleHeading');
  const candleHint = document.getElementById('candleHint');

  const audios = {
    music: document.getElementById('musicAudio'),
    open: document.getElementById('openAudio'),
    rise: document.getElementById('riseAudio'),
    chime: document.getElementById('chimeAudio'),
    pop: document.getElementById('popAudio'),
    giggle: document.getElementById('giggleAudio'),
    balloonpop: document.getElementById('balloonpopAudio'),
  };
  const allSfx = [audios.open, audios.rise, audios.chime, audios.pop, audios.giggle, audios.balloonpop];

  const soundToggle = document.getElementById('soundToggle');
  const iconOn = document.getElementById('iconSoundOn');
  const iconOff = document.getElementById('iconSoundOff');
  const countdownEl = document.getElementById('countdown');
  const replayBtn = document.getElementById('replayBtn');
  const nameForm = document.getElementById('nameForm');
  const nameInput = document.getElementById('nameInput');
  const tapHintText = document.getElementById('tapHintText');
  const letterLabelText = document.getElementById('letterLabelText');
  const takeoffText = document.getElementById('takeoffText');
  const footerMsgText = document.getElementById('footerMsgText');

  const COLORS = ['#A9C7E0', '#E3D5B8', '#8FB8D9', '#D9C9A8', '#F2ECDF'];
  const MUSIC_BASE_VOL = 0.22;
  const MUSIC_DUCK_VOL = 0.08;

  let guestName = '';
  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ================= VOIX ROBOTIQUE SIMPLE (synthese du navigateur) =================
  // Meme principe que dans FlashBrain : on utilise directement la voix du
  // navigateur (speechSynthesis), pas de fichiers audio pre-enregistres.
  // Avantage important : le navigateur met les repliques en FILE D'ATTENTE
  // automatiquement, donc deux voix ne peuvent jamais se superposer.
  const hasSpeech = 'speechSynthesis' in window;
  let frenchVoice = null;
  function pickVoice() {
    if (!hasSpeech) return;
    const voices = window.speechSynthesis.getVoices();
    frenchVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr')) || null;
  }
  if (hasSpeech) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function duckMusic() { audios.music.volume = MUSIC_DUCK_VOL; }
  function unduckMusic() { audios.music.volume = MUSIC_BASE_VOL; }

  let muted = false;

  function speak(text) {
    return new Promise((resolve) => {
      if (muted || !hasSpeech) {
        after(350, resolve);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      if (frenchVoice) u.voice = frenchVoice;
      u.rate = 1.0;
      u.pitch = 1.05;
      u.volume = 1;
      duckMusic();
      const safety = after(15000, () => { unduckMusic(); resolve(); });
      u.onend = () => { clearTimeout(safety); unduckMusic(); resolve(); };
      u.onerror = () => { clearTimeout(safety); unduckMusic(); resolve(); };
      window.speechSynthesis.speak(u);
    });
  }

  function wait(ms) {
    return new Promise((resolve) => after(ms, resolve));
  }

  function playSafe(audio, opts) {
    try {
      audio.currentTime = 0;
      if (opts && opts.volume !== undefined) audio.volume = opts.volume;
      audio.play().catch(() => {});
    } catch (e) {}
  }

  // ================= TEXTES DE L'HISTOIRE =================
  const TEXTS = {
    start: "Coucou toi ! Une aventure t'attend. Touche l'écran pour commencer !",
    namePrompt: "Avant de partir, dis-moi... comment tu t'appelles ?",
    envelopeHint: (n) => `Maintenant, touche l'enveloppe pour l'ouvrir, ${n} !`,
    takeoff: (n) => `Accroche-toi bien, ${n} ! On s'envole pour une super aventure !`,
    gameIntro: "Ouh là là, plein de ballons rigolos ! Attrape-les tous !",
    gameBravo: "Youpi, bravo ! Tu as tout attrapé ! En route !",
    flight: "On vole tout là-haut dans les nuages, hisse et ho !",
    peek: "Chut... on approche d'un endroit très très spécial...",
    arrival: "Tadaaa ! C'est Eliel ! Il va bientôt fêter son premier anniversaire !",
    candleIntro: "Entraîne-toi à souffler la flamme pour le jour J ! Touche-la plein de fois !",
    candleBravo: "Hourra ! Tu es prêt, ou prête, pour le grand jour !",
    funfactIntro: "Avant de continuer, viens découvrir un petit secret sur Eliel...",
    funfact: "Eliel adore rigoler, faire des bisous, et taper des mains. C'est le plus mignon des bébés !",
    funfactOutro: "Et maintenant, un petit mot pour les parents qui nous écoutent...",
    details: "Message pour les parents : rendez-vous samedi dix-huit juillet, à midi, au restaurant Karukéra. Tenue bleu ciel, beige ou crème.",
    outro: "On a hâte de te voir à la fête ! À très vite !",
    mascotTap: "Hihi, ça chatouille !",
  };

  function goTo(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function spawnConfetti(container, count) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = 6 + Math.random() * 8;
      const isCircle = Math.random() > 0.5;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.random() * 100 + '%';
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.borderRadius = isCircle ? '50%' : '2px';
      const dur = 5 + Math.random() * 5;
      const delay = Math.random() * 6;
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = delay + 's';
      container.appendChild(el);
    }
  }

  function burstConfettiOnce(container, count) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = 7 + Math.random() * 9;
      const isCircle = Math.random() > 0.5;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = (30 + Math.random() * 40) + '%';
      el.style.top = '38%';
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.borderRadius = isCircle ? '50%' : '2px';
      el.style.animation = 'none';
      const angle = (Math.random() * 360) * (Math.PI/180);
      const dist = 120 + Math.random()*160;
      const dx = Math.cos(angle)*dist;
      const dy = Math.sin(angle)*dist - 40;
      el.style.transition = `transform ${1.1 + Math.random()*0.6}s cubic-bezier(.2,.7,.3,1), opacity 1.4s ease`;
      el.style.transform = 'translate(0,0) rotate(0deg)';
      container.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random()*360}deg)`;
        el.style.opacity = '0';
      });
    }
  }

  spawnConfetti(document.getElementById('inviteConfetti'), 40);

  // ---- Mascotte interactive : tap = rigolade ----
  mascot.addEventListener('click', () => {
    mascot.classList.remove('tapped');
    void mascot.offsetWidth;
    mascot.classList.add('tapped');
    if (Math.random() > 0.5) {
      playSafe(audios.giggle, { volume: 0.7 });
    } else {
      speak(TEXTS.mascotTap);
    }
    if (navigator.vibrate) navigator.vibrate(15);
  });

  let sequenceTimers = [];
  function clearTimers() {
    sequenceTimers.forEach(id => clearTimeout(id));
    sequenceTimers = [];
  }
  function after(ms, fn) {
    const id = setTimeout(fn, ms);
    sequenceTimers.push(id);
    return id;
  }

  // ================= MINI-JEU 1 : ATTRAPE LES BALLONS =================
  const GAME_TOTAL = 6;
  let gamePopped = 0;
  let resolveGameWin = null;
  function waitForGameWin() { return new Promise((res) => { resolveGameWin = res; }); }

  function layoutBalloon(el) {
    const fieldW = gameField.clientWidth || 320;
    const fieldH = gameField.clientHeight || 340;
    const x = 16 + Math.random() * Math.max(40, fieldW - 100);
    const y = 16 + Math.random() * Math.max(40, fieldH - 140);
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.animationDelay = (Math.random() * 2) + 's';
  }

  function popBalloon(el) {
    if (el.classList.contains('popped')) return;
    el.classList.add('popped');
    gamePopped++;
    gameScore.textContent = `⭐ ${gamePopped} / ${GAME_TOTAL}`;
    playSafe(audios.balloonpop, { volume: 0.5 });
    if (navigator.vibrate) navigator.vibrate(12);
    if (gamePopped >= GAME_TOTAL) {
      gameHeading.textContent = 'Bravo, tu as tout attrapé ! 🎉';
      if (resolveGameWin) { resolveGameWin(); resolveGameWin = null; }
    }
  }

  function setupGame() {
    gameField.innerHTML = '';
    gamePopped = 0;
    gameScore.textContent = `⭐ 0 / ${GAME_TOTAL}`;
    gameHeading.textContent = 'Attrape tous les ballons ! 🎈';
    for (let i = 0; i < GAME_TOTAL; i++) {
      const el = document.createElement('div');
      el.className = 'game-balloon';
      el.style.background = COLORS[i % COLORS.length];
      layoutBalloon(el);
      el.addEventListener('click', () => popBalloon(el));
      el.addEventListener('touchstart', (e) => { e.preventDefault(); popBalloon(el); }, { passive: false });
      gameField.appendChild(el);
    }
  }

  // ================= MINI-JEU 2 : SOUFFLE LA BOUGIE =================
  const CANDLE_TAPS_NEEDED = 5;
  let candleTaps = 0;
  let candleDone = false;
  let resolveCandleWin = null;
  function waitForCandleWin() { return new Promise((res) => { resolveCandleWin = res; }); }

  function tapCandle() {
    if (candleDone) return;
    candleTaps++;
    candleFlame.style.transform = `translateX(-50%) scale(${Math.max(0.3, 1 - candleTaps*0.15)})`;
    if (navigator.vibrate) navigator.vibrate(10);
    if (candleTaps >= CANDLE_TAPS_NEEDED) {
      candleDone = true;
      candleFlame.classList.add('out');
      candleHeading.textContent = 'Bravo, tu es prêt(e) pour le jour J ! 🎂';
      candleHint.textContent = '';
      if (navigator.vibrate) navigator.vibrate([10, 30, 10, 30, 20]);
      if (resolveCandleWin) { resolveCandleWin(); resolveCandleWin = null; }
    }
  }

  function setupCandle() {
    candleTaps = 0;
    candleDone = false;
    candleFlame.classList.remove('out');
    candleFlame.style.transform = 'translateX(-50%) scale(1)';
    candleHeading.textContent = 'Entraîne-toi à souffler !';
    candleHint.textContent = 'Touche la flamme plein de fois !';
  }

  candleFlame.addEventListener('click', tapCandle);
  candleFlame.addEventListener('touchstart', (e) => { e.preventDefault(); tapCandle(); }, { passive: false });

  // ================= ECRAN DE DEMARRAGE =================
  const startScreen = document.getElementById('startScreen');
  let started = false;
  function startExperience() {
    if (started) return;
    started = true;
    // debloque le son sur mobile via un vrai geste utilisateur
    audios.music.volume = 0;
    audios.music.play().then(() => {
      audios.music.pause();
      audios.music.currentTime = 0;
    }).catch(() => {});

    (async () => {
      await speak(TEXTS.start);
      goTo('nameEntry');
      await speak(TEXTS.namePrompt);
    })();
    if (navigator.vibrate) navigator.vibrate(20);
  }
  startScreen.addEventListener('click', startExperience);
  startScreen.addEventListener('touchend', (e) => { e.preventDefault(); startExperience(); }, { passive: false });

  // ================= SAISIE DU PRENOM =================
  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = nameInput.value.trim();
    if (!raw) return;
    guestName = capitalize(raw);

    tapHintText.textContent = `Touche l'enveloppe, ${guestName} !`;
    letterLabelText.textContent = `${guestName}, tu es invité(e) !`;
    takeoffText.textContent = `On décolle, ${guestName} !`;
    footerMsgText.textContent = `Eliel est né le 17 juillet, on t'attend le 18, ${guestName} !`;

    goTo('envelope');
    speak(TEXTS.envelopeHint(guestName));
  });

  // ================= OUVERTURE ENVELOPPE =================
  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    playSafe(audios.open, { volume: 0.8 });
    if (navigator.vibrate) navigator.vibrate(30);
    envelope.classList.add('opened');
    after(900, () => { runSequence(); });
  }
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('touchend', (e) => { e.preventDefault(); openEnvelope(); }, { passive: false });

  function tryStartMusic() {
    audios.music.volume = MUSIC_BASE_VOL;
    audios.music.play().catch(() => {
      document.addEventListener('touchstart', () => audios.music.play().catch(()=>{}), { once: true });
      document.addEventListener('click', () => audios.music.play().catch(()=>{}), { once: true });
    });
  }

  // ================= SEQUENCE PRINCIPALE (async, sans superposition) =================
  async function runSequence() {
    if (hasSpeech) window.speechSynthesis.cancel();
    mascot.classList.remove('hidden');
    tryStartMusic();

    goTo('takeoff');
    hotAirBalloon.classList.remove('rising');
    void hotAirBalloon.offsetWidth;
    hotAirBalloon.classList.add('rising');
    after(300, () => playSafe(audios.rise, { volume: 0.45 }));
    await speak(TEXTS.takeoff(guestName));
    await wait(500);

    goTo('game');
    setupGame();
    await speak(TEXTS.gameIntro);
    await waitForGameWin();
    await speak(TEXTS.gameBravo);
    await wait(500);

    goTo('flight');
    await speak(TEXTS.flight);
    await wait(500);

    goTo('peek');
    await speak(TEXTS.peek);
    await wait(700);

    goTo('name');
    playSafe(audios.chime, { volume: 0.5 });
    await wait(700);
    burstConfettiOnce(nameBurst, 34);
    playSafe(audios.pop, { volume: 0.5 });
    if (navigator.vibrate) navigator.vibrate([10, 30, 10, 30, 10]);
    await speak(TEXTS.arrival);
    await wait(800);

    goTo('candle');
    setupCandle();
    await speak(TEXTS.candleIntro);
    await waitForCandleWin();
    await speak(TEXTS.candleBravo);
    await wait(600);

    await speak(TEXTS.funfactIntro);
    await wait(400);
    goTo('funfact');
    await speak(TEXTS.funfact);
    await wait(700);
    await speak(TEXTS.funfactOutro);
    await wait(500);

    goTo('details');
    after(200, () => document.getElementById('detail1').classList.add('shown'));
    after(2400, () => document.getElementById('detail2').classList.add('shown'));
    after(4600, () => document.getElementById('detail3').classList.add('shown'));
    await speak(TEXTS.details);
    await wait(600);

    await speak(TEXTS.outro);
    await wait(400);

    goTo('invite');
    startCountdown();
    after(400, () => mascot.classList.add('hidden'));
  }

  replayBtn.addEventListener('click', () => {
    clearTimers();
    if (hasSpeech) window.speechSynthesis.cancel();
    hotAirBalloon.classList.remove('rising');
    nameBurst.innerHTML = '';
    ['detail1','detail2','detail3'].forEach(id => document.getElementById(id).classList.remove('shown'));
    runSequence();
  });

  soundToggle.addEventListener('click', () => {
    muted = !muted;
    audios.music.muted = muted;
    allSfx.forEach(a => a.muted = muted);
    if (muted && hasSpeech) window.speechSynthesis.cancel();
    iconOn.style.display = muted ? 'none' : 'block';
    iconOff.style.display = muted ? 'block' : 'none';
  });

  function startCountdown() {
    const target = new Date('2026-07-18T12:00:00+01:00').getTime();
    function tick() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        countdownEl.textContent = "C'est aujourd'hui !";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      countdownEl.textContent = `J - ${days} jour${days > 1 ? 's' : ''} et ${hours}h avant la fête`;
    }
    tick();
    setInterval(tick, 60000);
  }
});
