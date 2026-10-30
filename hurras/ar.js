/* حرّاس أترجّة — «مرآة المجهر»: الجراثيم على يد اللاعب الحقيقية عبر الكاميرا وتتبّع اليد.
   كل المعالجة تجري داخل الجهاز؛ لا تُحفظ صورة ولا تُرسل إلى أي مكان. */
(function () {
  'use strict';
  const H = window.__H;
  const { G, AU, save, persist, $, rnd, clamp } = H;
  const ARN = H.AR;
  const NEED = 20;           // ثواني الفرك المطلوبة
  let landmarker = null, stream = null, lastVT = -1, hands = [], loading = false, fake = false;
  const st = {};

  // نقاط التصاق الجراثيم على اليد: [نقطة، نقطة، موضع بينهما]
  const ANCH = [[0, 9, 0.5], [5, 17, 0.5], [0, 5, 0.6], [0, 17, 0.6], [9, 13, 0.3], [5, 6, 0.5], [9, 10, 0.5], [13, 14, 0.5],
    [17, 18, 0.5], [6, 7, 0.8], [10, 11, 0.8], [14, 15, 0.8], [2, 3, 0.5], [0, 13, 0.4], [1, 5, 0.5]];
  const NAILS = [[7, 8, 0.9], [11, 12, 0.9], [15, 16, 0.9], [19, 20, 0.9], [3, 4, 0.9]];

  /* ---------- شاشة التمهيد ---------- */
  function intro() {
    AU.init();
    $('arErr').hidden = true;
    $('bArGo').disabled = false; $('bArGo').textContent = '📷 افتح الكاميرا';
    H.show('sARIntro');
  }

  async function go() {
    if (loading) return;
    loading = true;
    const b = $('bArGo'); b.disabled = true; b.textContent = 'نجهّز المجهر…';
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nocam');
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      const v = $('arVid'); v.srcObject = stream; await v.play();
      if (!landmarker) {
        b.textContent = 'نحمّل عين المجهر… (أول مرة فقط)';
        const { FilesetResolver, HandLandmarker } = await import('./mp/vision_bundle.mjs');
        const fs = await FilesetResolver.forVisionTasks('mp/wasm');
        const opts = d => ({ baseOptions: { modelAssetPath: 'mp/hand_landmarker.task', delegate: d }, runningMode: 'VIDEO', numHands: 2,
          minHandDetectionConfidence: 0.5, minHandPresenceConfidence: 0.5, minTrackingConfidence: 0.5 });
        try { landmarker = await HandLandmarker.createFromOptions(fs, opts('GPU')); }
        catch (e) { landmarker = await HandLandmarker.createFromOptions(fs, opts('CPU')); }
      }
      start();
    } catch (e) {
      stopCam();
      $('arErr').hidden = false;
      $('arErr').innerHTML = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')
        ? 'لم نحصل على إذن الكاميرا. اسمح للمتصفح باستخدامها من إعداداته ثم جرّب مجددًا.'
        : 'تعذّر تشغيل الكاميرا أو المجهر على هذا الجهاز. جرّب متصفح Chrome أو Safari الحديث.';
      b.disabled = false; b.textContent = '📷 حاول مجددًا';
    }
    loading = false;
  }

  function stopCam() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
    const v = $('arVid'); v.srcObject = null;
    $('arVid').hidden = true; $('arUI').hidden = true;
  }

  /* ---------- اللعب ---------- */
  function start() {
    H.show('none');
    Object.assign(G, { mode: 'ar', germs: [], projs: [], parts: [], texts: [], score: 0, newCards: [], waveKilled: 0, waveTotal: 0, again: () => intro() });
    Object.assign(st, { phase: 'find', scan: 0, timer: 0, lastSec: 0, seen: {}, nails: false, rubT: 0, killed: 0, hero: null, open: {}, wash: -1, lostT: 0 });
    hands = []; lastVT = -1;
    $('arVid').hidden = false; $('arUI').hidden = false;
    setHint('ارفع يدك أمام الكاميرا 🖐️ وافتح أصابعك');
    ring();
    AU.music('play');
  }

  function quit() {
    stopCam();
    G.mode = 'menu';
    AU.music('menu');
    H.openMap();
  }

  function setHint(t) { if ($('arHint').textContent !== t) $('arHint').textContent = t; }
  function ring() {
    $('arNum').textContent = ARN(Math.floor(st.timer));
    $('arArc').style.strokeDashoffset = 276.5 * (1 - Math.min(1, st.timer / NEED));
  }

  // تحويل نقاط اليد من إطار الفيديو إلى الشاشة (مع عكس المرآة)
  function mapper() {
    const v = $('arVid'), { W, H: HH } = H.size();
    const vw = v.videoWidth || 640, vh = v.videoHeight || 480, s = Math.max(W / vw, HH / vh);
    const ox = (W - vw * s) / 2, oy = (HH - vh * s) / 2;
    return p => ({ x: W - (ox + p.x * vw * s), y: oy + p.y * vh * s });
  }

  function detect() {
    const v = $('arVid');
    if (fake || !landmarker || v.readyState < 2 || v.currentTime === lastVT) return;
    lastVT = v.currentTime;
    let res;
    try { res = landmarker.detectForVideo(v, performance.now()); } catch (e) { return; }
    const m = mapper(), out = [];
    (res.landmarks || []).forEach((lm, i) => {
      const key = (res.handednesses && res.handednesses[i] && res.handednesses[i][0] && res.handednesses[i][0].categoryName) || ('h' + i);
      out.push({ key, pts: lm.map(m) });
    });
    hands = out;
  }

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lerpP = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  function scaleOf(pts) { return dist(pts[0], pts[9]) || 80; }
  function palm(pts) { const ids = [0, 5, 9, 13, 17]; return { x: ids.reduce((s, i) => s + pts[i].x, 0) / 5, y: ids.reduce((s, i) => s + pts[i].y, 0) / 5 }; }

  function seed(hand, list, count) {
    const pool = list.slice().sort(() => Math.random() - 0.5).slice(0, count);
    pool.forEach((a, i) => {
      const type = Math.random() < 0.62 ? 'virus' : 'bact';
      const g = { type, hand: hand.key, a, off: { x: rnd(-0.12, 0.12), y: rnd(-0.12, 0.12) }, x: 0, y: 0, r: 20, stage: 0, hp: type === 'virus' ? 3 : 4,
        dying: -1, flash: 0, bubbles: [], rot: rnd(-0.6, 0.6), p: rnd(0, 6), wear: 0, rate: rnd(0.75, 1.35), pop: -i * 0.12, t: 0, split: 0, splitAnim: -1 };
      G.germs.push(g); G.waveTotal++;
    });
  }

  function place(g, byKey) {
    const h = byKey[g.hand];
    if (!h) return false;
    const P = h.pts, s = scaleOf(P), [i, j, t] = g.a, q = lerpP(P[i], P[j], t);
    g.x = q.x + g.off.x * s; g.y = q.y + g.off.y * s;
    g.r = s * (g.type === 'virus' ? 0.15 : 0.12) * (g.pop < 1 ? Math.max(0, g.pop) * (2 - Math.max(0, g.pop)) : 1);
    return true;
  }

  function frame(t, dt) {
    detect();
    const cx = H.cx, { W, H: HH } = H.size();
    const byKey = {}; hands.forEach(h => byKey[h.key] = h);
    // لمسة المجهر: إطار دائري متوهّج
    const vg = cx.createRadialGradient(W / 2, HH / 2, Math.min(W, HH) * 0.42, W / 2, HH / 2, Math.max(W, HH) * 0.75);
    vg.addColorStop(0, 'rgba(4,38,58,0)'); vg.addColorStop(1, 'rgba(4,38,58,.85)');
    cx.fillStyle = vg; cx.fillRect(0, 0, W, HH);
    cx.fillStyle = 'rgba(40,180,220,.08)'; cx.fillRect(0, 0, W, HH);

    if (st.wash >= 0) return washFrame(t, dt);

    // ظهور الجراثيم أول مرة تُرى فيها كل يد
    hands.forEach(h => {
      if (!st.seen[h.key]) {
        st.seen[h.key] = true; st.phase = 'scan'; st.scan = 0;
        st.scanAt = palm(h.pts); st.scanR = scaleOf(h.pts);
        seed(h, ANCH, save.age === 'a' ? 6 : 8);
        AU.sfx('wave');
      }
    });
    if (st.phase === 'scan') {
      st.scan += dt;
      const k = Math.min(1, st.scan / 1.6), R = st.scanR * (0.3 + k * 2.6);
      cx.strokeStyle = `rgba(246,207,74,${1 - k})`; cx.lineWidth = 4;
      cx.beginPath(); cx.arc(st.scanAt.x, st.scanAt.y, R, 0, 6.28); cx.stroke();
      setHint('🔬 نكشف ما على يدك تحت المجهر…');
      if (st.scan > 1.6) st.phase = 'play';
    }

    // قياس الفرك: يدان تحتكّان، أو يد واحدة تنفتح وتنغلق
    let inten = 0, spot = null;
    if (hands.length >= 2) {
      const a = hands[0], b = hands[1], pa = palm(a.pts), pb = palm(b.pts), s = (scaleOf(a.pts) + scaleOf(b.pts)) / 2;
      const rel = { x: pa.x - pb.x, y: pa.y - pb.y };
      if (st.rel && dist(pa, pb) < s * 1.6) {
        const v = Math.hypot(rel.x - st.rel.x, rel.y - st.rel.y) / Math.max(dt, 0.001);
        inten = clamp(v / (s * 2.2), 0, 1.6);
        spot = lerpP(pa, pb, 0.5);
      }
      st.rel = rel;
    } else st.rel = null;
    hands.forEach(h => {
      const P = h.pts, s = scaleOf(P);
      const op = [8, 12, 16, 20].reduce((m, i) => m + dist(P[i], P[0]), 0) / 4 / s;
      const prev = st.open[h.key];
      if (prev != null) {
        const v = Math.abs(op - prev) / Math.max(dt, 0.001);
        if (v > 0.9) { inten = Math.max(inten, clamp(v / 3.5, 0, 1.2)); spot = spot || palm(P); }
      }
      st.open[h.key] = op;
    });
    // نُبقي الفرك متصلًا لحظة قصيرة، لأن اليدين تتوقّفان عند طرفي كل حركة
    if (inten > 0.15) { st.hold = 0.4; st.inten = inten; st.spot = spot; } else st.hold = (st.hold || 0) - dt;
    if (st.hold > 0) { inten = Math.max(inten, st.inten * 0.8); spot = spot || st.spot; }
    const rubbing = st.phase === 'play' && st.hold > 0 && spot && G.germs.some(g => g.dying < 0);
    if (rubbing) {
      st.timer = Math.min(NEED + 5, st.timer + dt);
      if (Math.floor(st.timer) > st.lastSec) { st.lastSec = Math.floor(st.timer); if (st.lastSec <= NEED) AU.sfx('tick'); }
      ring();
      if (performance.now() - st.rubT > 150) { AU.sfx('rub'); st.rubT = performance.now(); }
      for (let i = 0; i < 2; i++) H.part('foam', spot.x + rnd(-40, 40), spot.y + rnd(-40, 40), rnd(-40, 40), rnd(-60, 10), rnd(8, 18), 1.3);
    }

    // الجراثيم
    const pace = save.age === 'a' ? 0.3 : 0.24;   // ضربة كل ٣–٤ ثوانٍ تقريبًا عند الفرك المتوسط
    for (const g of G.germs) {
      g.t += dt; g.pop += dt * 2.2; g.flash = Math.max(0, g.flash - dt * 4);
      const vis = place(g, byKey);
      if (g.dying >= 0) { g.dying += dt; if (g.dying > 0.55) g.dead = true; }
      if (!g.x && !g.y) continue;
      if (g.dying < 0 && rubbing) {
        g.wear += dt * inten * pace * g.rate;
        if (Math.random() < 0.08) H.part('bub', g.x, g.y, rnd(-40, 40), rnd(-70, -20), rnd(3, 7), 0.8);
        if (g.wear >= 1) { g.wear = 0; H.hit(g, g.x, g.y); if (g.dying >= 0) st.killed++; }
      }
      cx.globalAlpha = vis ? 1 : 0.4;
      if (g.dying < 0) { // ظلّ خفيف يجعلها تبدو ملتصقة بالجلد
        cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(g.x + g.r * 0.15, g.y + g.r * 0.35, g.r * 0.9, g.r * 0.45, 0, 0, 6.28); cx.fill();
      }
      if (g.r > 1) {
        if (g.type === 'virus') { if (g.dying >= 0) H.drawBurst(g); else H.drawVirus(g, t); }
        else if (g.dying < 0 || g.dying < 0.55) drawBactNoRing(g, t);
      }
      cx.globalAlpha = 1;
    }
    G.germs = G.germs.filter(g => !g.dead);

    drawHero(t, dt, hands[0]);

    // التلميحات
    const alive = G.germs.filter(g => g.dying < 0).length;
    if (st.phase === 'play') {
      if (!hands.length) { st.lostT += dt; if (st.lostT > 0.6) setHint('أين يدك؟ أعدها أمام الكاميرا 🖐️'); }
      else {
        st.lostT = 0;
        if (rubbing) setHint(st.timer < 8 ? '🧼 رائع! استمرّ في الفرك…' : st.timer < 15 ? '🫧 الرغوة تفكّك الجراثيم!' : '⏱️ اقتربت من ٢٠ ثانية!');
        else if (hands.length === 1) setHint('افرك يديك معًا 🙌 أو افتح يدك وأغلقها بسرعة ✊🖐️');
        else setHint('قرّب يديك وافركهما معًا 🙌');
      }
    }
    // جراثيم مختبئة تحت الأظافر إذا انتهت قبل العشرين ثانية
    if (st.phase === 'play' && alive === 0 && G.germs.length === 0 && st.timer < NEED && hands.length && !st.nails) {
      st.nails = true;
      seed(hands[0], NAILS, 4);
      H.toast('💅 انتبه! جراثيم مختبئة تحت الأظافر');
      AU.sfx('split');
    }
    if (st.phase === 'play' && G.germs.length === 0 && Object.keys(st.seen).length && (st.timer >= NEED || st.nails)) {
      if (st.timer < NEED) { // أكمل العشرين ثانية بمزيد من الجراثيم بين الأصابع
        if (hands.length) seed(hands[0], ANCH, 3);
      } else finish();
    }
  }

  function drawBactNoRing(g, t) {
    const keep = g.splitMax; g.splitMax = 0; g.split = 9; H.drawBact(g, t); g.splitMax = keep;
  }

  function drawHero(t, dt, h) {
    const im = H.IMG.hero; if (!H.ready(im)) return;
    const { W, H: HH } = H.size();
    let tx = W * 0.82, ty = HH * 0.72, s = Math.min(W, HH) * 0.2;
    if (h) { const P = h.pts, sc = scaleOf(P); tx = P[12].x + sc * 0.9; ty = P[12].y - sc * 0.2; s = clamp(sc * 0.9, 60, 180); }
    if (!st.hero) st.hero = { x: tx, y: ty };
    st.hero.x += (tx - st.hero.x) * Math.min(1, dt * 3); st.hero.y += (ty - st.hero.y) * Math.min(1, dt * 3);
    const x = clamp(st.hero.x, s * 0.4, W - s * 0.4), y = clamp(st.hero.y, s * 0.6, HH - s * 0.2) + Math.sin(t * 3) * 6;
    const w = s * im.naturalWidth / im.naturalHeight;
    H.cx.drawImage(im, x - w / 2, y - s / 2, w, s);
  }

  function finish() {
    st.wash = 0;
    setHint('💧 الماء يجرف كل شيء… يداك نظيفتان!');
    H.unlockCard('mirror'); H.unlockCard('scrub');
    AU.sfx('burst');
  }

  function washFrame(t, dt) {
    st.wash += dt;
    const cx = H.cx, { W, H: HH } = H.size(), y = -HH * 0.3 + st.wash * HH * 1.1;
    const gr = cx.createLinearGradient(0, y - HH * 0.5, 0, y);
    gr.addColorStop(0, 'rgba(120,230,255,0)'); gr.addColorStop(0.8, 'rgba(120,230,255,.45)'); gr.addColorStop(1, 'rgba(230,252,255,.9)');
    cx.fillStyle = gr; cx.fillRect(0, y - HH * 0.5, W, HH * 0.5);
    if (Math.random() < 0.6) H.part('bub', rnd(0, W), y, rnd(-30, 30), rnd(40, 120), rnd(4, 12), 1);
    if (st.wash > 1.8 && G.mode === 'ar') end();
  }

  function end() {
    G.mode = 'over';
    stopCam();
    save.stars.ar = 3; persist();
    $('resTitle').textContent = 'يداك نظيفتان الآن! 🎉';
    $('resScore').innerHTML = `فركتَ يديك <b>${ARN(Math.round(Math.min(st.timer, NEED + 5)))}</b> ثانية، وقضيتَ على <b>${ARN(st.killed)}</b> جرثومة لا تراها العين.<br>تذكّر: افعلها بالماء والصابون قبل كل وجبة 🧼`;
    const s = $('stars').children;
    for (let i = 0; i < 3; i++) { s[i].classList.remove('on'); setTimeout(() => { s[i].classList.add('on'); AU.sfx('star', i); }, 500 + i * 380); }
    $('quiz').hidden = true;
    const nc = $('newCards'); nc.innerHTML = '';
    G.newCards.forEach(id => {
      const c = H.CARDS.find(x => x.id === id), b = document.createElement('button');
      b.textContent = '🔬 ' + c.title; b.onclick = () => H.openCard(id); nc.appendChild(b);
    });
    H.show('sResult'); AU.sfx('win'); AU.music('menu');
  }

  // لمس الجرثومة على الشاشة يعمل أيضًا، كمساعدة لمن يمسك الجوال بيد واحدة
  $('cv').addEventListener('pointerdown', e => {
    if (G.mode !== 'ar' || st.phase !== 'play') return;
    for (const g of G.germs) if (g.dying < 0 && Math.hypot(g.x - e.clientX, g.y - e.clientY) < g.r * 1.4 + 14) {
      H.hit(g, g.x, g.y); if (g.dying >= 0) st.killed++;
      break;
    }
  });

  $('bArGo').onclick = go;
  $('bArBack').onclick = () => H.openMap();
  $('bArQuit').onclick = quit;
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'ar') quit(); });

  // للاختبار الآلي فقط: تمرير نقاط يد مصطنعة
  window.__AR = { intro, frame, _feed: h => { fake = true; hands = h; }, _start: start, _finish: () => { st.timer = NEED; finish(); } };
})();
