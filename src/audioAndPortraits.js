// Procedural Web Audio SFX, Japanese Web Speech API pronunciation, and SVG General Portraits
window.RTK3 = window.RTK3 || {};

window.RTK3.Audio = (function () {
  let ctx = null;
  let muted = false;
  let bgmEnabled = true;
  let bgmTheme = null;
  let bgmTimer = null;
  let bgmStep = 0;
  let bgmGain = null;
  let bgmFilter = null;
  let duckTimer = null;

  // Note frequencies (Hz) for pentatonic Three Kingdoms themes
  const NOTE = {
    _: 0,
    D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, C3: 130.81,
    D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, C4: 261.63,
    D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, C5: 523.25,
    D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  // Three authentic East Asian pentatonic BGM loops (no external audio files)
  const BGM_THEMES = {
    title: {
      tempoMs: 360,
      leadWave: 'triangle',
      lead: [
        'D4', '_', 'A4', 'G4', 'F4', 'G4', 'A4', '_',
        'C5', 'D5', 'C5', 'A4', 'G4', 'F4', 'D4', '_',
        'F4', 'G4', 'A4', 'C5', 'D5', '_', 'A4', 'G4',
        'F4', 'E4', 'D4', 'C4', 'D4', '_', '_', '_'
      ],
      bass: [
        'D2', '_', 'A2', '_', 'F2', '_', 'C3', '_',
        'G2', '_', 'D3', '_', 'A2', '_', 'D2', '_',
        'F2', '_', 'C3', '_', 'G2', '_', 'D3', '_',
        'A2', '_', 'G2', '_', 'D2', '_', 'A2', '_'
      ],
      drum: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    },
    strategy: {
      tempoMs: 340,
      leadWave: 'sine',
      lead: [
        'E4', 'G4', 'A4', '_', 'C5', 'A4', 'G4', 'E4',
        'D4', 'E4', 'G4', '_', 'E4', 'D4', 'C4', '_',
        'G4', 'A4', 'C5', '_', 'D5', 'C5', 'A4', 'G4',
        'E4', 'G4', 'D4', 'E4', 'C4', '_', '_', '_'
      ],
      bass: [
        'C3', 'G3', 'E3', 'G3', 'A2', 'E3', 'C3', 'E3',
        'G2', 'D3', 'G3', 'D3', 'C3', 'G3', 'C4', '_',
        'E3', 'G3', 'A2', 'E3', 'F2', 'C3', 'G2', 'D3',
        'C3', 'G3', 'G2', 'D3', 'C3', '_', 'G2', '_'
      ],
      drum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    battle: {
      tempoMs: 205,
      leadWave: 'sawtooth',
      lead: [
        'A4', 'A4', 'C5', 'D5', 'E5', '_', 'D5', 'C5',
        'A4', 'G4', 'A4', 'C5', 'A4', '_', 'E4', '_',
        'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'D5', 'E5',
        'A5', 'G5', 'E5', 'D5', 'C5', 'D5', 'A4', '_'
      ],
      bass: [
        'A2', 'A2', 'E3', 'A2', 'G2', 'G2', 'D3', 'G2',
        'F2', 'F2', 'C3', 'F2', 'E2', 'E2', 'G2', 'E2',
        'D2', 'D2', 'A2', 'D2', 'G2', 'G2', 'D3', 'G2',
        'E2', 'E2', 'G2', 'E2', 'A2', 'E2', 'A2', '_'
      ],
      drum: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1]
    }
  };

  function ensureBgmBus(c) {
    if (!c) return null;
    if (!bgmGain) {
      bgmFilter = c.createBiquadFilter();
      bgmFilter.type = 'lowpass';
      bgmFilter.frequency.value = 1750;
      bgmGain = c.createGain();
      bgmGain.gain.value = 0.22;
      bgmFilter.connect(bgmGain);
      bgmGain.connect(c.destination);
    }
    return bgmFilter;
  }

  function getCtx(allowWhenMuted = false) {
    if (muted && !allowWhenMuted) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playBgmNote(freq, dur, wave, vol) {
    if (!freq || muted || !bgmEnabled) return;
    const c = getCtx();
    if (!c || c.state !== 'running') return;
    const bus = ensureBgmBus(c);
    const now = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, now + dur);
    osc.connect(g);
    g.connect(bus);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  function playBgmDrum() {
    if (muted || !bgmEnabled) return;
    const c = getCtx();
    if (!c || c.state !== 'running') return;
    const bus = ensureBgmBus(c);
    const now = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);
    g.gain.setValueAtTime(0.14, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(g);
    g.connect(bus);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  function tickBgm() {
    if (!bgmTheme || muted || !bgmEnabled) return;
    const theme = BGM_THEMES[bgmTheme];
    if (!theme) return;
    const idx = bgmStep % theme.lead.length;
    const leadNote = NOTE[theme.lead[idx]];
    const bassNote = NOTE[theme.bass[idx]];
    const dur = (theme.tempoMs / 1000) * 1.15;

    if (leadNote) playBgmNote(leadNote, dur, theme.leadWave, theme.leadWave === 'sawtooth' ? 0.08 : 0.13);
    if (bassNote) playBgmNote(bassNote, dur * 1.2, 'triangle', 0.11);
    if (theme.drum[idx % theme.drum.length]) playBgmDrum();
    bgmStep += 1;
  }

  function restartBgmLoop() {
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
    if (!bgmTheme || muted || !bgmEnabled) return;
    const theme = BGM_THEMES[bgmTheme];
    if (!theme) return;
    bgmStep = 0;
    tickBgm();
    bgmTimer = setInterval(tickBgm, theme.tempoMs);
  }

  // Unlock AudioContext & start queued BGM on first user interaction
  function unlockAudio() {
    const c = getCtx(true);
    if (c && c.state === 'suspended') {
      c.resume().then(() => {
        if (bgmTheme && !bgmTimer && bgmEnabled && !muted) restartBgmLoop();
      }).catch(() => {});
    } else if (bgmTheme && !bgmTimer && bgmEnabled && !muted) {
      restartBgmLoop();
    }
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
  }

  function tone(freq, dur, type = 'square', vol = 0.06, delay = 0) {
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  return {
    isMuted: () => muted,
    toggleMute: () => {
      muted = !muted;
      if (muted) {
        if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
      } else {
        restartBgmLoop();
      }
      return muted;
    },
    isBgmEnabled: () => bgmEnabled,
    toggleBgm: () => {
      bgmEnabled = !bgmEnabled;
      if (bgmEnabled && !muted) {
        unlockAudio();
        restartBgmLoop();
      } else if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
      }
      return bgmEnabled;
    },
    setBgm: (themeName) => {
      if (bgmTheme === themeName && bgmTimer) return;
      bgmTheme = themeName;
      restartBgmLoop();
    },
    duckBgm: (ms = 1600) => {
      if (!ctx || !bgmGain) return;
      const now = ctx.currentTime;
      bgmGain.gain.cancelScheduledValues(now);
      bgmGain.gain.setTargetAtTime(0.05, now, 0.05);
      if (duckTimer) clearTimeout(duckTimer);
      duckTimer = setTimeout(() => {
        if (ctx && bgmGain) bgmGain.gain.setTargetAtTime(0.22, ctx.currentTime, 0.15);
      }, ms);
    },
    click: () => tone(520, 0.05, 'square', 0.04),
    confirm: () => {
      tone(523, 0.06, 'square', 0.05, 0);
      tone(659, 0.08, 'square', 0.05, 0.06);
    },
    coin: () => {
      tone(880, 0.07, 'triangle', 0.07, 0);
      tone(1174, 0.12, 'triangle', 0.07, 0.07);
    },
    drum: () => {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    },
    clash: () => {
      tone(320, 0.06, 'sawtooth', 0.08, 0);
      tone(190, 0.1, 'sawtooth', 0.08, 0.05);
    },
    fire: () => {
      tone(440, 0.08, 'sawtooth', 0.06, 0);
      tone(587, 0.08, 'sawtooth', 0.06, 0.06);
      tone(784, 0.15, 'triangle', 0.07, 0.12);
    },
    chimeOk: () => {
      tone(587, 0.08, 'triangle', 0.08, 0);
      tone(740, 0.08, 'triangle', 0.08, 0.08);
      tone(880, 0.16, 'triangle', 0.08, 0.16);
    },
    chimeBad: () => {
      tone(280, 0.12, 'sawtooth', 0.05, 0);
      tone(220, 0.18, 'sawtooth', 0.05, 0.11);
    },
    victory: () => {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'square', 0.06, i * 0.12));
    }
  };
})();

window.RTK3.speakJP = function (text, triggerEl = null) {
  if (!('speechSynthesis' in window) || !text) return false;
  try {
    if (window.RTK3.Audio && window.RTK3.Audio.duckBgm) {
      window.RTK3.Audio.duckBgm(1700);
    }
    if (triggerEl) {
      triggerEl.classList.add('speaking');
      setTimeout(() => triggerEl.classList.remove('speaking'), 900);
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja'));
    if (jpVoice) utter.voice = jpVoice;
    window.speechSynthesis.speak(utter);
    return true;
  } catch (e) {
    return false;
  }
};

// Procedural SVG retro general portrait (pure vector, zero external images)
window.RTK3.renderPortraitSVG = function (gen, size = 64) {
  if (!gen || !gen.p) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1e2433"/></svg>`;
  }
  const p = gen.p;
  const skin = p.skin || '#e5be96';
  const hair = p.hair || '#1c1c24';
  const armor = p.armor || '#3b5284';
  const bg = p.bg || '#162038';

  // Helmet / Headwear
  let helmSvg = '';
  if (p.helm === 'crown') {
    helmSvg = `
      <rect x="20" y="9" width="24" height="10" rx="2" fill="#222"/>
      <rect x="22" y="7" width="20" height="4" fill="#d4af37"/>
      <circle cx="32" cy="9" r="2.5" fill="#e63946"/>
    `;
  } else if (p.helm === 'scholar') {
    helmSvg = `
      <path d="M18 22 Q32 8 46 22 Z" fill="#202430" stroke="#c8a84b" stroke-width="1.2"/>
      <rect x="16" y="20" width="32" height="4" rx="1" fill="#151821"/>
      <circle cx="32" cy="17" r="2" fill="#d4af37"/>
    `;
  } else if (p.helm === 'lubu') {
    helmSvg = `
      <path d="M19 22 Q32 10 45 22 Z" fill="#5e1d36" stroke="#d4af37" stroke-width="1.3"/>
      <path d="M25 14 Q12 2 8 8 Q16 10 23 16" fill="none" stroke="#d94e34" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M39 14 Q52 2 56 8 Q48 10 41 16" fill="none" stroke="#d94e34" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="15" r="2.2" fill="#f2c94c"/>
    `;
  } else if (p.helm === 'plume') {
    helmSvg = `
      <path d="M18 23 Q32 10 46 23 Z" fill="#4f5666" stroke="#c8a84b" stroke-width="1.2"/>
      <path d="M32 12 Q35 3 44 6 Q38 11 33 14" fill="#d93838"/>
      <rect x="18" y="21" width="28" height="3" fill="#c8a84b"/>
    `;
  } else if (p.helm === 'turban') {
    helmSvg = `
      <path d="M18 23 Q32 11 46 23 Z" fill="#235c3f" stroke="#d4af37" stroke-width="1.2"/>
      <rect x="29" y="13" width="6" height="6" rx="1" fill="#d4af37"/>
    `;
  } else if (p.helm === 'iron') {
    helmSvg = `
      <path d="M17 24 Q32 10 47 24 Z" fill="#505868" stroke="#9aa3b2" stroke-width="1.2"/>
      <rect x="30" y="12" width="4" height="9" fill="#c8a84b"/>
    `;
  } else {
    // headband
    helmSvg = `
      <path d="M19 22 Q32 13 45 22" fill="${hair}"/>
      <rect x="19" y="19" width="26" height="3.5" fill="#b83232"/>
    `;
  }

  // Beard
  let beardSvg = '';
  if (p.beard === 'long') {
    beardSvg = `<path d="M22 39 Q32 42 42 39 L38 56 Q32 60 26 56 Z" fill="${hair}"/>`;
  } else if (p.beard === 'white') {
    beardSvg = `<path d="M22 39 Q32 42 42 39 L37 54 Q32 57 27 54 Z" fill="#d5dae3"/>`;
  } else if (p.beard === 'full') {
    beardSvg = `<path d="M21 37 Q21 48 32 49 Q43 48 43 37 L40 42 L32 44 L24 42 Z" fill="${hair}"/>`;
  } else if (p.beard === 'wild') {
    beardSvg = `<path d="M20 36 L23 47 L28 45 L32 50 L36 45 L41 47 L44 36 L39 40 L32 39 L25 40 Z" fill="${hair}"/>`;
  } else if (p.beard === 'neat') {
    beardSvg = `<path d="M26 40 Q32 42 38 40 L34 48 L30 48 Z" fill="${hair}"/>`;
  } else if (p.beard === 'goatee') {
    beardSvg = `<path d="M28 41 L36 41 L33 48 L31 48 Z" fill="${hair}"/>`;
  } else if (p.beard === 'short') {
    beardSvg = `<path d="M24 40 Q32 45 40 40 L38 44 Q32 46 26 44 Z" fill="${hair}"/>`;
  }

  const eyeLeft = p.eyepatch
    ? `<rect x="24" y="28" width="6" height="4" rx="1" fill="#18181f"/><line x1="21" y1="26" x2="31" y2="32" stroke="#18181f" stroke-width="1.3"/>`
    : `<rect x="25" y="29" width="3" height="2.5" fill="#181820"/>`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="portrait-svg">
    <defs>
      <linearGradient id="bg_${gen.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#0b0f19"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" fill="url(#bg_${gen.id})"/>
    <rect x="1.5" y="1.5" width="61" height="61" fill="none" stroke="#c8a84b" stroke-width="1.5" opacity="0.65"/>
    <!-- Shoulders / Armor -->
    <path d="M8 64 L13 46 Q32 42 51 46 L56 64 Z" fill="${armor}" stroke="#d4af37" stroke-width="1.2"/>
    <path d="M25 45 L32 54 L39 45" fill="none" stroke="#e5c158" stroke-width="1.5"/>
    <!-- Neck & Head -->
    <rect x="27" y="40" width="10" height="8" fill="${skin}"/>
    <path d="M20 22 Q20 17 32 17 Q44 17 44 22 L43 37 Q42 44 32 45 Q22 44 21 37 Z" fill="${skin}"/>
    <!-- Hair sides -->
    <rect x="19" y="22" width="3" height="11" fill="${hair}"/>
    <rect x="42" y="22" width="3" height="11" fill="${hair}"/>
    <!-- Eyebrows & Eyes -->
    <path d="M23 27 L29 28" stroke="${hair}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M41 27 L35 28" stroke="${hair}" stroke-width="1.8" stroke-linecap="round"/>
    ${eyeLeft}
    <rect x="36" y="29" width="3" height="2.5" fill="#181820"/>
    <!-- Nose & Mouth -->
    <path d="M32 30 L31 35 L33 35" fill="none" stroke="#9e6d4d" stroke-width="1.2"/>
    <line x1="29" y1="39" x2="35" y2="39" stroke="#8c4e3e" stroke-width="1.4"/>
    ${beardSvg}
    ${helmSvg}
  </svg>`;
};
