/* حرّاس أترجّة: موسيقى ومؤثرات مولَّدة بالكامل عبر Web Audio (تأليف أصلي) */
(function () {
  'use strict';
  const A = {};
  let ctx = null, master, musicBus, sfxBus, noiseBuf, verb;
  const pluckCache = new Map();
  const MUSIC_VOL = 0.2; // الموسيقى خلفية هادئة تحت المؤثرات
  const st = { music: true, sfx: true };
  try { Object.assign(st, JSON.parse(localStorage.getItem('hurras.snd') || '{}')); } catch (e) {}

  function save() { try { localStorage.setItem('hurras.snd', JSON.stringify(st)); } catch (e) {} }

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = st.music ? MUSIC_VOL : 0;
    sfxBus = ctx.createGain(); sfxBus.gain.value = st.sfx ? 0.8 : 0;
    musicBus.connect(master); sfxBus.connect(master);
    // صدى بسيط يمنح الموسيقى رحابة
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 1.8, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    verb.buffer = ir;
    const vg = ctx.createGain(); vg.gain.value = 0.22;
    verb.connect(vg); vg.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  /* وتر مقطوف (Karplus-Strong) يشبه القانون والعود */
  function pluckBuf(f, bright) {
    const key = Math.round(f * 10) + (bright ? 'b' : '');
    if (pluckCache.has(key)) return pluckCache.get(key);
    const sr = ctx.sampleRate, len = Math.floor(sr * 1.6), N = Math.max(2, Math.round(sr / f));
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const ring = new Float32Array(N);
    let lp = 0;
    for (let i = 0; i < N; i++) { lp = lp * (bright ? 0.2 : 0.55) + (Math.random() * 2 - 1); ring[i] = lp * 0.5; }
    const decay = bright ? 0.997 : 0.994;
    for (let i = 0, p = 0; i < len; i++) {
      const nx = (p + 1) % N, v = ring[p];
      d[i] = v;
      ring[p] = decay * 0.5 * (v + ring[nx]);
      p = nx;
    }
    pluckCache.set(key, buf);
    return buf;
  }

  function pluck(f, t, vol, bus, bright, wet) {
    const s = ctx.createBufferSource(); s.buffer = pluckBuf(f, bright);
    const g = ctx.createGain(); g.gain.value = vol;
    s.connect(g); g.connect(bus || musicBus);
    if (wet) { const w = ctx.createGain(); w.gain.value = wet; g.connect(w); w.connect(verb); }
    s.start(t); s.stop(t + 1.6);
  }

  function tone(type, f0, f1, t, dur, vol, bus, attack) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus || sfxBus);
    o.start(t); o.stop(t + dur + 0.02);
    return g;
  }

  function noise(t, dur, vol, ftype, f0, f1, q, bus) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    s.playbackRate.value = 0.7 + Math.random() * 0.6;
    const fl = ctx.createBiquadFilter(); fl.type = ftype; fl.Q.value = q || 1;
    fl.frequency.setValueAtTime(f0, t);
    if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(bus || sfxBus);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  function bell(f, t, vol, bus) {
    tone('sine', f, f, t, 1.2, vol, bus);
    tone('sine', f * 2.76, f * 2.76, t, 0.5, vol * 0.3, bus);
    tone('sine', f * 5.4, f * 5.4, t, 0.25, vol * 0.12, bus);
  }

  /* ===== الموسيقى: مقامات عربية بأرباع الأصوات ===== */
  const MAQAM = {
    rast:   [0, 200, 350, 500, 700, 900, 1050],   // راست: مشرق ومتفائل
    bayati: [0, 150, 300, 500, 700, 800, 1000]    // بياتي: دافئ وحنون
  };
  function deg(root, scale, d) { // d يبدأ من 1
    const i = d - 1, oct = Math.floor(i / 7), k = ((i % 7) + 7) % 7;
    return root * Math.pow(2, oct + MAQAM[scale][k] / 1200);
  }

  // الألحان بالأثمان: [درجة، طول]؛ 0 = سكتة
  const SONGS = {
    play: { // «نشيد القطرة» على مقام راست، إيقاع مقسوم
      root: 261.63, scale: 'rast', bpm: 112, drums: 'maqsum',
      mel: [
        [5,2],[4,1],[3,1],[2,2],[3,2],[4,2],[5,2],[4,2],[3,2],
        [5,2],[4,1],[3,1],[2,2],[3,1],[2,1],[1,4],[0,4],
        [6,2],[8,2],[8,1],[7,1],[6,2],[5,2],[6,1],[5,1],[4,2],[5,2],
        [6,2],[5,1],[4,1],[3,2],[4,2],[3,1],[2,1],[1,2],[0,4],
        [1,1],[3,1],[5,2],[5,1],[6,1],[5,2],[4,1],[3,1],[4,2],[3,2],[0,2],
        [3,1],[4,1],[5,2],[6,1],[7,1],[8,2],[7,1],[6,1],[5,2],[0,4],
        [8,2],[7,1],[6,1],[5,2],[4,2],[3,2],[4,1],[3,1],[2,2],[3,2],
        [5,2],[4,1],[3,1],[2,2],[3,1],[2,1],[1,8]
      ],
      bass: [1, 1, 5, 1, 4, 4, 5, 1, 1, 1, 5, 5, 1, 4, 5, 1]
    },
    menu: { // «حديقة المجهر» على مقام بياتي، هادئة
      root: 293.66, scale: 'bayati', bpm: 80, drums: 'soft',
      mel: [
        [5,3],[4,1],[3,2],[4,2],[3,2],[2,2],[1,4],
        [1,2],[2,2],[3,2],[4,2],[5,4],[6,1],[5,1],[4,2],
        [8,3],[7,1],[6,2],[5,2],[6,2],[5,1],[4,1],[5,4],
        [4,2],[3,1],[2,1],[3,2],[2,2],[1,8],
        [3,2],[4,2],[5,3],[6,1],[5,2],[4,2],[3,4],
        [4,2],[5,2],[6,2],[5,1],[4,1],[3,4],[2,4],
        [1,2],[3,2],[5,2],[8,2],[7,3],[6,1],[5,4],
        [4,2],[3,1],[2,1],[3,2],[2,2],[1,8]
      ],
      bass: [1, 1, 4, 1, 1, 4, 5, 1]
    }
  };

  let cur = null, nextT = 0, step = 0, melIdx = 0, melLeft = 0, timer = null, songName = null;
  const MAQSUM = ['D', 'T', '', 'T', 'D', '', 'T', 'k'];
  const SOFT = ['D', '', 'k', '', '', 'k', 't', ''];

  function doum(t, v) { tone('sine', 120, 52, t, 0.32, v, musicBus, 0.003); noise(t, 0.05, v * 0.25, 'lowpass', 400, 0, 1, musicBus); }
  function tek(t, v) { noise(t, 0.07, v, 'bandpass', 3800, 2500, 2.5, musicBus); tone('triangle', 900, 700, t, 0.03, v * 0.25, musicBus); }

  function schedule() {
    const s = cur, e8 = 60 / s.bpm / 2;
    while (nextT < ctx.currentTime + 0.15) {
      const t = nextT, inBar = step % 8;
      // الإيقاع
      const pat = s.drums === 'maqsum' ? MAQSUM : SOFT, hit = pat[inBar];
      const dv = s.drums === 'maqsum' ? 0.5 : 0.22;
      if (hit === 'D') doum(t, dv);
      else if (hit === 'T') tek(t, dv * 0.55);
      else if (hit === 'k' || hit === 't') tek(t, dv * 0.25);
      // رنين خفيف كالرّق
      if (s.drums === 'maqsum' && inBar % 2 === 1) noise(t, 0.04, 0.05, 'highpass', 7000, 0, 1, musicBus);
      // الباص والقرار
      if (inBar === 0 || inBar === 4) {
        const bar = Math.floor(step / 8), b = s.bass[bar % s.bass.length];
        pluck(deg(s.root / 2, s.scale, b), t, 0.5, musicBus, false, 0.1);
        if (inBar === 0) pluck(deg(s.root / 4, s.scale, 1), t, 0.35, musicBus, false, 0);
      }
      if (s.drums === 'soft' && inBar === 0) { // نسيج هادئ من التآلفات
        const bar = Math.floor(step / 8), b = s.bass[bar % s.bass.length];
        [1, 3, 5].forEach((d, i) => pluck(deg(s.root, s.scale, b + d - 1), t + e8 * (2 + i * 0.6), 0.12, musicBus, true, 0.4));
      }
      // اللحن
      if (melLeft <= 0) {
        const [d, len] = s.mel[melIdx];
        melIdx = (melIdx + 1) % s.mel.length;
        melLeft = len;
        if (d) {
          const f = deg(s.root, s.scale, d);
          pluck(f, t, 0.42, musicBus, true, 0.3);
          if (len >= 3) pluck(f, t + e8 * 1.5, 0.18, musicBus, true, 0.3); // ترعيد خفيف على النوتات الطويلة
          if (s.drums === 'maqsum' && len >= 2 && Math.random() < 0.25) pluck(f * 2, t + e8, 0.1, musicBus, true, 0.4);
        }
      }
      melLeft--;
      step++; nextT += e8;
    }
  }

  A.music = function (name) {
    init(); if (!ctx) return;
    if (songName === name) return;
    songName = name;
    if (timer) clearInterval(timer);
    cur = SONGS[name]; step = 0; melIdx = 0; melLeft = 0;
    nextT = ctx.currentTime + 0.1;
    timer = setInterval(schedule, 30);
  };
  A.stopMusic = function () { if (timer) clearInterval(timer); timer = null; songName = null; };

  /* ===== المؤثرات ===== */
  const R = 261.63;
  const F = {
    click() { tone('sine', 900, 1300, now(), 0.06, 0.25); },
    shoot() { const t = now(); tone('sine', 420, 1100, t, 0.1, 0.35); noise(t, 0.06, 0.08, 'highpass', 3000, 0, 1); },
    membrane() { // فقاعات الصابون تذيب الغلاف الدهني
      const t = now(); noise(t, 0.4, 0.3, 'bandpass', 1200, 5000, 1.5);
      for (let i = 0; i < 5; i++) tone('sine', 700 + Math.random() * 900, 1500 + Math.random() * 800, t + 0.05 + i * 0.05, 0.05, 0.18);
    },
    spikes() { const t = now(); [0, 0.06, 0.12].forEach((d, i) => { pluck(deg(R * 2, 'rast', 5 - i), t + d, 0.4, sfxBus, true); tone('square', 2000, 1200, t + d, 0.03, 0.06); }); },
    burst() {
      const t = now(); noise(t, 0.5, 0.45, 'lowpass', 3000, 200, 1);
      tone('sine', 200, 60, t, 0.3, 0.5);
      [1, 3, 5, 8].forEach((d, i) => bell(deg(R * 2, 'rast', d), t + 0.08 + i * 0.06, 0.12));
    },
    armor() { const t = now(); tone('square', 320, 260, t, 0.12, 0.12); noise(t, 0.12, 0.25, 'bandpass', 2400, 1800, 6); tone('sine', 1800, 1700, t, 0.25, 0.06); },
    crack() { const t = now(); noise(t, 0.18, 0.35, 'highpass', 1500, 600, 1); tone('sawtooth', 180, 90, t, 0.15, 0.08); },
    split() { const t = now(); const g = tone('sine', 260, 520, t, 0.35, 0.35); tone('sine', 270, 140, t + 0.18, 0.25, 0.25); noise(t, 0.3, 0.1, 'lowpass', 800, 300, 3); },
    hurt() { const t = now(); [5, 3, 1].forEach((d, i) => tone('triangle', deg(R, 'bayati', d), 0, t + i * 0.11, 0.25, 0.25)); },
    card() { const t = now(); [1, 3, 5, 8, 10].forEach((d, i) => bell(deg(R * 2, 'rast', d), t + i * 0.08, 0.13)); },
    star(i) { bell(deg(R * 2, 'rast', [5, 8, 10][i] || 8), now(), 0.2); },
    rub() { noise(now(), 0.18, 0.12, 'bandpass', 1500 + Math.random() * 1500, 900, 2); if (Math.random() < 0.4) tone('sine', 1200 + Math.random() * 1200, 2400, now(), 0.04, 0.08); },
    win() {
      const t = now();
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((d, i) => pluck(deg(R, 'rast', d), t + i * 0.08, 0.5, sfxBus, true));
      [1, 3, 5, 8].forEach(d => pluck(deg(R, 'rast', d), t + 0.75, 0.35, sfxBus, true));
      bell(deg(R * 2, 'rast', 8), t + 0.75, 0.2);
    },
    lose() { const t = now(); [5, 4, 3, 2, 1].forEach((d, i) => pluck(deg(R, 'bayati', d), t + i * 0.16, 0.45, sfxBus, false)); },
    wave() { const t = now(); [1, 5, 8].forEach((d, i) => pluck(deg(R, 'rast', d), t + i * 0.1, 0.4, sfxBus, true)); doum(t, 0.5); doum(t + 0.3, 0.4); },
    tick() { tone('sine', 1500, 1500, now(), 0.05, 0.15); }
  };
  function now() { return ctx.currentTime + 0.005; }
  A.sfx = function (n, a) { init(); if (!ctx || !st.sfx) return; try { F[n](a); } catch (e) {} };

  function apply() {
    if (ctx) {
      musicBus.gain.setTargetAtTime(st.music ? MUSIC_VOL : 0, ctx.currentTime, 0.05);
      sfxBus.gain.setTargetAtTime(st.sfx ? 0.8 : 0, ctx.currentTime, 0.05);
    }
  }
  A.toggle = function (k) { st[k] = !st[k]; save(); apply(); return st[k]; };
  A.setAll = function (on) { st.music = on; st.sfx = on; save(); apply(); };
  A.state = st;
  A.init = init;
  A.suspend = () => { if (ctx && ctx.state === 'running') ctx.suspend(); };
  A.resume = () => { if (ctx && ctx.state === 'suspended') ctx.resume(); };
  window.HAudio = A;
})();
