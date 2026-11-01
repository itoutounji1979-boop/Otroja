/* حرّاس أترجّة — المرحلة الثانية: «تحدّي اليدين: ٣٢٠٠ جرثومة»
   يتعلّم اللاعب خطوات غسل اليدين الصحيحة: الكف، ظهر اليد، بين الأصابع، الإبهام، الأظافر، ثم الشطف والتجفيف. */
(function () {
  'use strict';
  const H = window.__H;
  const { G, AU, save, persist, $, rnd, clamp } = H;
  const ARN = H.AR;
  const VAL = 40;                 // كل جرثومة مرسومة تمثّل ٤٠ جرثومة حقيقية
  const MIN_RUB = 20;             // لا شطف قبل ٢٠ ثانية من الفرك

  /* ---------- المحتوى ---------- */
  const STEPS = [
    { z: 'palm', side: 'front', name: 'باطن الكف', ic: '✋' },
    { z: 'back', side: 'back', name: 'ظهر اليد', ic: '🤚' },
    { z: 'gaps', side: 'front', name: 'بين الأصابع', ic: '🖐️' },
    { z: 'thumb', side: 'front', name: 'الإبهام', ic: '👍' },
    { z: 'nails', side: 'back', name: 'الأظافر وأطراف الأصابع', ic: '💅' }
  ];
  const COUNTS = { palm: 18, back: 16, gaps: 16, thumb: 12, nails: 18 };   // المجموع ٨٠ × ٤٠ = ٣٢٠٠

  const CARDS2 = [
    { id: 'touch', title: 'اللمسة تنقل', emoji: '🚪', txt: {
      a: 'الجراثيم تنتقل من مقبض الباب والألعاب إلى يدك، ثم من يدك إلى فمك وعينيك. لذلك نغسل أيدينا!',
      b: 'كثير من الجراثيم تنتقل باللمس: من الأسطح إلى اليد، ومن اليد إلى الأنف والفم والعينين. لهذا نغسل اليدين قبل الطعام وبعد اللعب.',
      c: 'الأسطح التي يلمسها الناس كثيرًا، كمقابض الأبواب والهواتف، قد تحمل الجراثيم ساعات أو أيامًا بحسب نوعها، وتنقلها من يد إلى يد. وغسل اليدين يقطع هذه السلسلة.' } },
    { id: 'hide', title: 'أين تختبئ الجراثيم؟', emoji: '🕵️', txt: {
      a: 'تحب الجراثيم الأماكن المنسية: بين الأصابع، وتحت الأظافر، وحول الإبهام.',
      b: 'أكثر الأماكن التي ننساها عند الغسل: أطراف الأصابع، والإبهام، وما بين الأصابع. لهذا للغسل خطوات مرتّبة.',
      c: 'عندما راقب الباحثون طريقة غسل الناس أيديهم، وجدوا أن الإبهام وأطراف الأصابع وما بينها أكثر المناطق التي تفوتنا. ولهذا توصي منظمة الصحة العالمية بخطوات مرتّبة تغطّي كل سطح في اليد.' } },
    { id: 'rinse', title: 'الشطف يكمل المهمة', emoji: '🚿', txt: {
      a: 'الصابون يفكّ الجراثيم، والماء يحملها بعيدًا إلى المصرف.',
      b: 'إذا لم نشطف، تبقى الجراثيم المفكوكة على الجلد. الماء الجاري يجرف الرغوة وكل ما علق بها.',
      c: 'يحبس الصابون الدهون والجراثيم في كرات مجهرية (المذيلات)، والماء الجاري يحملها بعيدًا. ولهذا الماء الجاري أفضل من وعاء ماء راكد يعود إليه ما غسلناه.' } },
    { id: 'dry', title: 'جفّف جيدًا', emoji: '🧺', txt: {
      a: 'اليد المبلّلة تلتقط الجراثيم أسرع، فجفّفها بمنشفة نظيفة.',
      b: 'تنتقل الجراثيم عبر اليد المبلّلة أسهل من انتقالها عبر اليد الجافة، لذلك التجفيف جزء من الغسل.',
      c: 'الجلد الرطب ينقل الجراثيم أكثر بكثير من الجلد الجاف، لذلك ينتهي الغسل الصحيح بتجفيف جيد بمنشفة نظيفة أو منديل ورقي.' } }
  ];
  CARDS2.forEach(c => { if (!H.CARDS.find(x => x.id === c.id)) H.CARDS.splice(H.CARDS.findIndex(x => x.future), 0, c); });

  const TIPS = {
    story1: 'صباح سَنَد كان مليئًا باللعب: لمس <b>مقبض الباب</b>، ثم <b>الكرة</b>، ثم <b>هاتف أبيه</b>… وكل لمسة تركت ضيوفًا صغارًا على يده. راقب!',
    story2: 'المجهر يعدّ: <b>٣٢٠٠ جرثومة</b> على يد واحدة! وبعضها يختبئ حيث لا نتوقّع.',
    steps: {
      a: 'لن نغسل عشوائيًا! اتبع <b>الخطوات</b> بالترتيب: افرك بإصبعك فوق الجراثيم في المكان المضيء. وتذكّر أن تقلب اليد 🔄',
      b: 'للغسل الصحيح <b>خمس خطوات</b>: باطن الكف، ثم ظهر اليد، ثم بين الأصابع، ثم الإبهام، ثم الأظافر. افرك المكان المضيء أولًا، والبكتيريا المنسية ستنقسم!',
      c: 'سنطبّق <b>خطوات الغسل</b> التي يوصي بها الأطباء. الفرك في المكان المضيء أقوى مرتين. وانتبه: البكتيريا في الأماكن المنسية تنقسم وتعيد العدد إلى الارتفاع.'
    },
    rinse: 'فككنا الجراثيم بالصابون، والآن <b>الشطف</b>: اسحب إصبعك من الأعلى إلى الأسفل ليحمل الماء الرغوة بعيدًا 💧',
    dry: 'أخيرًا: <b>التجفيف</b>! اليد المبلّلة تلتقط الجراثيم بسرعة. المس اليد ٣ مرات لتجفّفها بالمنشفة 🧺'
  };

  const QUIZ = {
    a: { q: 'أين تختبئ الجراثيم كثيرًا على اليد؟', o: ['تحت الأظافر وبين الأصابع', 'على الأذن فقط', 'لا تختبئ أبدًا'], ok: 0,
      why: 'هذه الأماكن ننساها عند الغسل، فتختبئ فيها الجراثيم.' },
    b: { q: 'ماذا نفعل بعد الفرك بالصابون؟', o: ['نمسح الرغوة بملابسنا', 'نشطف بالماء الجاري ثم نجفّف', 'نترك الرغوة تجفّ وحدها'], ok: 1,
      why: 'الماء الجاري يحمل الجراثيم المفكوكة بعيدًا، والتجفيف يمنع اليد المبلّلة من التقاط غيرها.' },
    c: { q: 'لماذا الماء الجاري أفضل من وعاء ماء للشطف؟', o: ['لأنه أبرد', 'لأنه يحوي صابونًا', 'لأنه يجرف الجراثيم المفكوكة بعيدًا'], ok: 2,
      why: 'في الوعاء يبقى ما غسلناه في الماء نفسه، أمّا الماء الجاري فيحمله إلى المصرف.' }
  };

  /* ---------- هندسة اليد (وحدات نسبية) ---------- */
  const FING = [ // [قاعدة x، قاعدة y، طول، عرض، زاوية بالدرجات]
    [-0.21, -0.05, 0.44, 0.135, -9], [-0.07, -0.08, 0.5, 0.14, -2], [0.07, -0.07, 0.46, 0.135, 5], [0.21, -0.03, 0.35, 0.12, 13]
  ];
  const THUMB = [-0.27, 0.24, 0.36, 0.15, -52];
  const PALM = { x0: -0.3, x1: 0.3, y0: -0.1, y1: 0.5, r: 0.15 };

  function tipOf(f, k) { // نقطة على محور الإصبع: k من ٠ (القاعدة) إلى ١ (الطرف)
    const a = f[4] * Math.PI / 180;
    return { x: f[0] + Math.sin(a) * f[2] * k, y: f[1] - Math.cos(a) * f[2] * k };
  }

  function zonePoint(z) {
    if (z === 'palm' || z === 'back') return { x: rnd(PALM.x0 + 0.07, PALM.x1 - 0.07), y: rnd(PALM.y0 + 0.06, PALM.y1 - 0.08) };
    if (z === 'gaps') {
      const i = Math.floor(rnd(0, 3)), A = FING[i], B = FING[i + 1], k = rnd(0.05, 0.42);
      const pa = tipOf(A, k), pb = tipOf(B, k);
      return { x: (pa.x + pb.x) / 2 + rnd(-0.015, 0.015), y: (pa.y + pb.y) / 2 + rnd(-0.02, 0.02) };
    }
    if (z === 'thumb') { const p = tipOf(THUMB, rnd(0.15, 0.95)); return { x: p.x + rnd(-0.03, 0.03), y: p.y + rnd(-0.03, 0.03) }; }
    const fs = FING.concat([THUMB]), f = fs[Math.floor(rnd(0, fs.length))], p = tipOf(f, rnd(0.82, 0.98));
    return { x: p.x + rnd(-0.025, 0.025), y: p.y + rnd(-0.02, 0.02) };
  }

  /* ---------- الحالة ---------- */
  const S = {};
  const geo = () => {
    const { W, H: HH } = H.size();
    const u = Math.min(W * 0.92, HH * 0.6);
    return { W, HH, u, hx: W / 2, hy: HH * 0.5 - u * 0.12 };
  };

  function start() {
    H.show('none');
    AU.init(); AU.music('play');
    Object.assign(G, { mode: 'l2', parts: [], texts: [], germs: [], newCards: [], again: () => start() });
    Object.assign(S, {
      phase: 'intro', side: 'front', flip: 1, flipTo: 1, germs: [], foam: [], count: 0, shown: 0, peak: 0, rubT: 0, soapT: 0,
      step: 0, doneSteps: {}, divT: 0, rinse: 0, wet: 0, dry: 0, towel: -1, touch: -1, touches: 0, lastSnd: 0, finished: false, intro: 0
    });
    $('l2UI').hidden = false; $('l2Flip').hidden = true; $('l2Rinse').hidden = true;
    updUI();
    H.tip(TIPS.story1, () => { S.phase = 'touches'; S.touch = 0; });
  }

  function addGerm(z, p) {
    const side = (z === 'back' || z === 'nails') ? 'back' : 'front';
    p = p || zonePoint(z);
    const g = { z, side, x: p.x, y: p.y, type: Math.random() < 0.55 ? 'virus' : 'bact', clean: 0, pop: 0, rot: rnd(-0.6, 0.6), ph: rnd(0, 6), loose: false };
    S.germs.push(g); S.count += VAL; S.peak = Math.max(S.peak, S.count);
    return g;
  }

  function curStep() {
    for (let i = 0; i < STEPS.length; i++) if (S.germs.some(g => g.z === STEPS[i].z && g.clean < 1)) return i;
    return -1;
  }

  function updUI() {
    $('l2Count').textContent = ARN(Math.round(S.shown));
    const i = S.phase === 'soap' ? curStep() : -1;
    if (S.phase === 'soap' && i >= 0) {
      const s = STEPS[i];
      $('l2Step').innerHTML = `${s.ic} الخطوة ${ARN(i + 1)} من ٥: <b>${s.name}</b>`;
      const needFlip = s.side !== S.side;
      $('l2Flip').classList.toggle('pulse', needFlip);
    } else if (S.phase === 'rinse') $('l2Step').innerHTML = '💧 <b>الشطف</b>: اسحب إصبعك إلى الأسفل';
    else if (S.phase === 'dry') $('l2Step').innerHTML = '🧺 <b>التجفيف</b>: المس اليد';
    else $('l2Step').innerHTML = '🔬 المجهر يعدّ الجراثيم…';
    const lim = limit();
    $('l2Bar').style.width = S.phase === 'soap' ? Math.max(0, (1 - S.soapT / lim) * 100) + '%' : (S.phase === 'rinse' ? S.rinse * 100 : 100) + '%';
    const rb = $('l2Rinse');
    if (S.phase === 'soap') {
      const left = Math.ceil(MIN_RUB - S.rubT);
      rb.hidden = false;
      rb.disabled = left > 0;
      rb.textContent = left > 0 ? `⏱️ افرك ${ARN(left)} ثانية أخرى قبل الشطف` : '💧 إلى الشطف';
    } else rb.hidden = true;
  }
  const limit = () => save.age === 'a' ? 90 : save.age === 'b' ? 75 : 65;

  /* ---------- اللمس ---------- */
  let ptr = null;
  const cv = $('cv');
  function toHand(x, y) {
    const g = geo(), f = Math.abs(S.flip) || 0.01;
    return { x: (x - g.hx) / (g.u * f), y: (y - g.hy) / g.u };
  }
  cv.addEventListener('pointerdown', e => {
    if (G.mode !== 'l2') return;
    ptr = { x: e.clientX, y: e.clientY, t: performance.now() };
    if (S.phase === 'dry') {
      const p = toHand(e.clientX, e.clientY);
      if (Math.abs(p.x) < 0.7 && p.y > -0.8 && p.y < 0.85 && S.dry < 3) {
        S.towel = 0; S.dry++; AU.sfx('rub'); AU.sfx('rub');
        if (S.dry >= 3) setTimeout(() => { H.unlockCard('dry'); finish(); }, 900);
      }
    }
  });
  cv.addEventListener('pointermove', e => {
    if (G.mode !== 'l2' || !ptr) return;
    const now = performance.now(), dt = (now - ptr.t) / 1000, dx = e.clientX - ptr.x, dy = e.clientY - ptr.y, d = Math.hypot(dx, dy);
    if (dt <= 0 || d < 4) return;
    if (S.phase === 'soap') rub(e.clientX, e.clientY, d / dt, Math.min(dt, 0.08));
    else if (S.phase === 'rinse' && dy > 0) rinseMove(e.clientX, e.clientY, dy);
    ptr = { x: e.clientX, y: e.clientY, t: now };
  });
  const up = () => { ptr = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  function rub(x, y, speed, dt) {
    if (speed < 120 || Math.abs(S.flip) < 0.95) return;
    const p = toHand(x, y), g = geo(), R = 0.13, i = curStep();
    S.rubT += dt;
    if (Math.random() < 0.6) H.part('foam', x + rnd(-16, 16), y + rnd(-16, 16), rnd(-30, 30), rnd(-30, 10), rnd(7, 15), 1.1);
    if (S.foam.length < 260 && Math.random() < 0.5) S.foam.push({ side: S.side, x: p.x + rnd(-0.04, 0.04), y: p.y + rnd(-0.04, 0.04), r: rnd(0.025, 0.05), a: 0 });
    if (now() - S.lastSnd > 140) { AU.sfx('rub'); S.lastSnd = now(); }
    for (const gm of S.germs) {
      if (gm.side !== S.side || gm.clean >= 1) continue;
      if (Math.hypot(gm.x - p.x, gm.y - p.y) > R) continue;
      const bonus = i >= 0 && STEPS[i].z === gm.z ? 1.7 : 1;
      gm.clean += dt * 1.25 * bonus;
      if (gm.clean >= 1) pop(gm, g);
    }
  }
  const now = () => performance.now();

  function pop(gm, g) {
    const sx = g.hx + gm.x * g.u * S.flip, sy = g.hy + gm.y * g.u;
    for (let k = 0; k < 6; k++) H.part('bub', sx, sy, rnd(-60, 60), rnd(-80, -10), rnd(3, 8), 0.8);
    for (let k = 0; k < 5; k++) H.part('dot', sx, sy, rnd(-120, 120), rnd(-140, 20), rnd(2, 4), 0.7);
    S.count -= VAL;
    if (Math.random() < 0.35) AU.sfx('membrane');
    if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {}
    // اكتمال خطوة
    if (!S.germs.some(x => x.z === gm.z && x.clean < 1) && !S.doneSteps[gm.z]) {
      S.doneSteps[gm.z] = true;
      const st = STEPS.find(s => s.z === gm.z);
      G.texts.push({ x: g.W / 2, y: g.hy - g.u * 0.62, txt: '✔ ' + st.name + ' نظيف!', life: 1.6, max: 1.6, col: '#9ff5c2', size: 20, box: true });
      AU.sfx('card');
      if (gm.z === 'gaps' || gm.z === 'nails') H.unlockCard('hide');
    }
  }

  function rinseMove(x, y, dy) {
    const g = geo();
    S.rinse = Math.min(1, S.rinse + dy / g.HH * 0.55);
    for (let k = 0; k < 3; k++) H.part('splash', x + rnd(-24, 24), y + rnd(-10, 10), rnd(-40, 40), rnd(120, 260), rnd(3, 6), 0.7);
    if (now() - S.lastSnd > 160) { AU.sfx('rub'); S.lastSnd = now(); }
    // الماء يحمل الجراثيم المفكوكة جزئيًا بالصابون
    for (const gm of S.germs) if (gm.clean < 1 && gm.clean >= 0.3 && !gm.loose && Math.random() < S.rinse * 0.25) { gm.loose = true; gm.clean = 1; pop(gm, g); }
    if (S.rinse >= 1 && S.phase === 'rinse') {
      S.phase = 'between';
      H.unlockCard('rinse'); AU.sfx('wave');
      S.wet = 1;
      setTimeout(() => H.tip(TIPS.dry, () => { S.phase = 'dry'; updUI(); }), 500);
    }
    updUI();
  }

  /* ---------- الحلقة ---------- */
  function frame(t, dt) {
    const g = geo(), cx = H.cx;
    cx.fillStyle = 'rgba(2,20,32,.35)'; cx.fillRect(0, 0, g.W, g.HH);

    // قلب اليد
    S.flip += (S.flipTo - S.flip) * Math.min(1, dt * 9);
    if (Math.abs(S.flipTo - S.flip) < 0.01) S.flip = S.flipTo;
    S.side = S.flip >= 0 ? 'front' : 'back';

    drawHand(t, g);

    // اللمسات الثلاث في المقدمة
    if (S.phase === 'touches') {
      S.touch += dt;
      const icons = ['🚪', '⚽', '📱'], k = Math.floor(S.touch / 1.1);
      if (k < 3 && k >= S.touches) {
        S.touches = k + 1; AU.sfx('split');
        const per = [27, 27, 26][k], zs = Object.keys(COUNTS);
        let added = 0;
        for (const z of zs) { const want = Math.round(COUNTS[z] * per / 80); for (let i = 0; i < want && added < per; i++, added++) addGerm(z).pop = -rnd(0, 0.6); }
        while (added < per) { addGerm(zs[added % zs.length]).pop = -rnd(0, 0.6); added++; }
      }
      if (k < 3) {
        const p = (S.touch % 1.1) / 1.1;
        cx.globalAlpha = 1 - Math.max(0, p - 0.7) / 0.3;
        cx.font = `${Math.round(g.u * 0.2)}px sans-serif`; cx.textAlign = 'center';
        cx.fillText(icons[k], g.W * (0.2 + k * 0.3), g.hy - g.u * 0.75 + p * g.u * 0.5);
        cx.globalAlpha = 1;
      }
      if (S.touch > 3.6) {
        S.phase = 'story';
        H.unlockCard('touch');
        H.tip(TIPS.story2, () => H.tip(TIPS.steps[save.age], () => { S.phase = 'soap'; $('l2Flip').hidden = false; AU.sfx('wave'); updUI(); }));
      }
    }

    // الانقسام في الأماكن المنسية + الوقت
    if (S.phase === 'soap') {
      S.soapT += dt;
      S.divT += dt;
      const every = save.age === 'a' ? 7 : save.age === 'b' ? 5.5 : 4.5;
      if (S.divT > every && S.germs.length < 115) {
        S.divT = 0;
        const i = curStep(), cand = S.germs.filter(x => x.type === 'bact' && x.clean < 0.3 && !S.doneSteps[x.z] && (i < 0 || x.z !== STEPS[i].z));
        if (cand.length) {
          const m = cand[Math.floor(rnd(0, cand.length))];
          const c = addGerm(m.z, { x: m.x + rnd(-0.05, 0.05), y: m.y + rnd(-0.05, 0.05) }); c.type = 'bact'; c.pop = 0;
          if (m.side === S.side) {
            G.texts.push({ x: g.hx + m.x * g.u * S.flip, y: g.hy + m.y * g.u - 20, txt: '+' + ARN(VAL) + ' انقسام!', life: 1.1, max: 1.1, col: '#ff9fb3', size: 15, box: true });
            AU.sfx('split');
          }
        }
      }
      if (curStep() < 0 || S.soapT >= limit()) toRinse();
    }

    // العدّاد يلحق بالرقم الحقيقي بنعومة
    S.shown += (S.count - S.shown) * Math.min(1, dt * 6);
    if (Math.abs(S.count - S.shown) < 1) S.shown = S.count;
    updUI();

    drawHero(t, g);
  }

  function toRinse() {
    if (S.phase !== 'soap') return;
    S.phase = 'between';
    if (S.side !== 'front') { S.flipTo = 1; }
    $('l2Flip').hidden = true;
    H.tip(TIPS.rinse, () => { S.phase = 'rinse'; updUI(); });
  }

  function drawHand(t, g) {
    const cx = H.cx, f = S.flip, back = S.side === 'back';
    cx.save();
    cx.translate(g.hx, g.hy + Math.sin(t * 1.2) * 3);
    cx.scale(Math.max(0.02, Math.abs(f)) * g.u, g.u);
    // ظلّ وهالة المجهر
    const halo = cx.createRadialGradient(0, 0.1, 0.1, 0, 0.1, 0.95);
    halo.addColorStop(0, 'rgba(120,230,255,.18)'); halo.addColorStop(1, 'rgba(120,230,255,0)');
    cx.fillStyle = halo; cx.beginPath(); cx.arc(0, 0.1, 0.95, 0, 6.28); cx.fill();
    const m = back ? -1 : 1;   // ظهر اليد معكوس: الإبهام في الجهة الأخرى
    const skin = (y0, y1) => { const gr = cx.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, back ? '#f0b991' : '#f7cfae'); gr.addColorStop(1, back ? '#d9946c' : '#e6a985'); return gr; };
    cx.lineJoin = 'round';
    // الرسغ
    cx.fillStyle = skin(0.4, 0.75); cx.beginPath(); rr(-0.21, 0.4, 0.42, 0.36, 0.08); cx.fill();
    // الأصابع والإبهام
    const finger = (fd, isThumb) => {
      cx.save(); cx.translate(fd[0] * m, fd[1]); cx.rotate(fd[4] * m * Math.PI / 180);
      const w = fd[3], L = fd[2];
      cx.fillStyle = skin(-L, 0.05); cx.strokeStyle = 'rgba(150,80,50,.35)'; cx.lineWidth = 0.008;
      cx.beginPath(); rr(-w / 2, -L, w, L + 0.12, w / 2); cx.fill(); cx.stroke();
      cx.strokeStyle = 'rgba(160,90,60,.3)'; cx.lineWidth = 0.006;
      [0.38, 0.7].forEach(k => { if (isThumb && k > 0.5) return; cx.beginPath(); cx.moveTo(-w * 0.28, -L * k); cx.quadraticCurveTo(0, -L * k + (back ? -0.012 : 0.012), w * 0.28, -L * k); cx.stroke(); });
      if (back) { // الأظافر
        cx.fillStyle = '#ffe3dc'; cx.strokeStyle = 'rgba(190,120,110,.6)'; cx.lineWidth = 0.005;
        cx.beginPath(); rr(-w * 0.32, -L + 0.012, w * 0.64, w * 0.75, w * 0.25); cx.fill(); cx.stroke();
        cx.fillStyle = 'rgba(255,255,255,.7)'; cx.beginPath(); rr(-w * 0.2, -L + 0.02, w * 0.15, w * 0.4, 0.01); cx.fill();
      }
      cx.restore();
    };
    finger(THUMB, true);
    FING.forEach(fd => finger(fd));
    // الكف
    cx.fillStyle = skin(PALM.y0, PALM.y1); cx.strokeStyle = 'rgba(150,80,50,.3)'; cx.lineWidth = 0.008;
    cx.beginPath(); rr(PALM.x0, PALM.y0, PALM.x1 - PALM.x0, PALM.y1 - PALM.y0, PALM.r); cx.fill(); cx.stroke();
    // لمعة
    cx.fillStyle = 'rgba(255,255,255,.18)'; cx.beginPath(); cx.ellipse(-0.08 * m, 0.08, 0.14, 0.2, -0.3 * m, 0, 6.28); cx.fill();
    if (!back) { // خطوط الكف
      cx.strokeStyle = 'rgba(170,95,65,.45)'; cx.lineWidth = 0.008; cx.lineCap = 'round';
      cx.beginPath(); cx.moveTo(-0.25, 0.06); cx.quadraticCurveTo(0, 0.0, 0.26, 0.04); cx.stroke();
      cx.beginPath(); cx.moveTo(-0.24, 0.14); cx.quadraticCurveTo(0, 0.14, 0.2, 0.2); cx.stroke();
      cx.beginPath(); cx.moveTo(-0.2, 0.1); cx.quadraticCurveTo(-0.12, 0.3, -0.06, 0.46); cx.stroke();
    } else { // عُقَد الأصابع
      cx.strokeStyle = 'rgba(150,80,55,.35)'; cx.lineWidth = 0.007;
      FING.forEach(fd => { const x = -fd[0]; cx.beginPath(); cx.arc(x, fd[1] + 0.03, 0.035, Math.PI * 1.1, Math.PI * 1.9); cx.stroke(); });
    }
    // إضاءة منطقة الخطوة الحالية
    const i = S.phase === 'soap' ? curStep() : -1;
    if (i >= 0 && STEPS[i].side === S.side) {
      cx.globalAlpha = 0.25 + Math.sin(t * 5) * 0.12;
      cx.fillStyle = '#fff3a0';
      S.germs.forEach(gm => { if (gm.z === STEPS[i].z && gm.clean < 1) { cx.beginPath(); cx.arc(gm.x, gm.y, 0.075, 0, 6.28); cx.fill(); } });
      cx.globalAlpha = 1;
    }
    // الرغوة الملتصقة باليد
    const wash = S.phase === 'rinse' || S.phase === 'dry' || (S.phase === 'between' && S.rinse > 0) ? 1 - S.rinse : 1;
    for (const fo of S.foam) {
      if (fo.side !== S.side) continue;
      fo.a = Math.min(1, fo.a + 0.08);
      cx.globalAlpha = fo.a * 0.85 * wash; cx.fillStyle = '#f6fdff';
      cx.beginPath(); cx.arc(fo.x, fo.y, fo.r, 0, 6.28); cx.fill();
      cx.globalAlpha = fo.a * 0.5 * wash; cx.strokeStyle = '#bfefff'; cx.lineWidth = 0.004; cx.stroke();
    }
    cx.globalAlpha = 1;
    // قطرات الماء بعد الشطف
    if (S.wet > 0 && S.dry < 3) {
      cx.fillStyle = 'rgba(160,230,255,.75)';
      for (let k = 0; k < 14; k++) { const x = Math.sin(k * 12.9) * 0.27, y = (Math.cos(k * 7.3) * 0.5 + 0.5) * 0.6 - 0.1; cx.globalAlpha = 1 - S.dry / 3; cx.beginPath(); cx.ellipse(x, y, 0.012, 0.018, 0, 0, 6.28); cx.fill(); }
      cx.globalAlpha = 1;
    }
    cx.restore();

    // الجراثيم (بمقاس الشاشة كي لا تتشوّه أثناء القلب)
    for (const gm of S.germs) {
      if (gm.side !== S.side || gm.clean >= 1) continue;
      gm.pop = Math.min(1, gm.pop + 0.05);
      if (gm.pop <= 0) continue;
      const im = gm.type === 'virus' ? H.IMG.virus : H.IMG.bacterium; if (!H.ready(im)) continue;
      const k = gm.pop < 1 ? gm.pop * (2 - gm.pop) : 1;
      const sz = g.u * (gm.type === 'virus' ? 0.085 : 0.095) * k * (1 - gm.clean * 0.35), w = gm.type === 'virus' ? sz : sz * im.naturalWidth / im.naturalHeight;
      const x = g.hx + gm.x * g.u * f, y = g.hy + gm.y * g.u + Math.sin(t * 1.2) * 3 + Math.sin(t * 3 + gm.ph) * 1.5;
      cx.save(); cx.translate(x, y); cx.rotate(gm.rot + Math.sin(t * 2 + gm.ph) * 0.12); cx.scale(Math.abs(f), 1);
      cx.globalAlpha = 1 - gm.clean * 0.45;
      cx.drawImage(im, -w / 2, -sz / 2, w, sz);
      cx.restore();
      if (gm.clean > 0) bubbleOn(x, y, sz, gm.clean);
    }
    cx.globalAlpha = 1;

    // المنشفة
    if (S.towel >= 0) {
      S.towel += 0.03;
      const p = S.towel, y = g.hy - g.u * 0.7 + p * g.u * 1.5;
      cx.save(); cx.globalAlpha = Math.min(1, (1 - p) * 3);
      cx.fillStyle = '#fff4dd'; cx.fillRect(g.hx - g.u * 0.42, y - g.u * 0.12, g.u * 0.84, g.u * 0.24);
      cx.fillStyle = '#f6cf4a'; for (let k = 0; k < 3; k++) cx.fillRect(g.hx - g.u * 0.42, y - g.u * 0.08 + k * g.u * 0.07, g.u * 0.84, g.u * 0.02);
      cx.restore();
      if (p >= 1) { S.towel = -1; for (let k = 0; k < 8; k++) H.part('dot', g.hx + rnd(-g.u * 0.3, g.u * 0.3), g.hy + rnd(-g.u * 0.4, g.u * 0.4), rnd(-40, 40), rnd(-60, 0), rnd(2, 4), 0.8); }
    }

    // صنبور الماء أثناء الشطف
    if (S.phase === 'rinse') {
      const tx = g.W / 2, ty = Math.max(70, g.hy - g.u * 0.95);
      cx.fillStyle = '#c9d6dc'; cx.fillRect(tx - 60, ty - 18, 90, 18); cx.fillRect(tx + 14, ty - 8, 22, 26);
      cx.fillStyle = '#9fb2bb'; cx.fillRect(tx - 68, ty - 26, 16, 34);
      const gr = cx.createLinearGradient(0, ty + 18, 0, g.hy + g.u * 0.6);
      gr.addColorStop(0, 'rgba(150,225,255,.75)'); gr.addColorStop(1, 'rgba(150,225,255,0)');
      cx.fillStyle = gr; cx.fillRect(tx + 16, ty + 18, 18, g.hy + g.u * 0.6 - ty);
      if (Math.random() < 0.5) H.part('splash', tx + 25 + rnd(-8, 8), ty + 30 + rnd(0, g.u * 0.8), rnd(-30, 30), rnd(100, 200), rnd(2, 4), 0.5);
    }
  }

  function bubbleOn(x, y, sz, k) {
    const cx = H.cx, n = Math.ceil(k * 4);
    for (let i = 0; i < n; i++) {
      const a = i * 1.7, r = sz * (0.18 + i * 0.03);
      cx.globalAlpha = 0.75; cx.fillStyle = '#f4fdff';
      cx.beginPath(); cx.arc(x + Math.cos(a) * sz * 0.3, y + Math.sin(a) * sz * 0.3, r, 0, 6.28); cx.fill();
    }
    cx.globalAlpha = 1;
  }

  function rr(x, y, w, h, r) { const cx = H.cx; cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }

  function drawHero(t, g) {
    const im = H.IMG.hero; if (!H.ready(im)) return;
    const s = Math.min(g.u * 0.32, 130), w = s * im.naturalWidth / im.naturalHeight;
    const x = g.W - w * 0.55 - 6, y = g.HH - s - 70 + Math.sin(t * 2.4) * 6;
    H.cx.drawImage(im, x - w / 2, y, w, s);
  }

  /* ---------- النهاية ---------- */
  function finish() {
    if (S.finished) return;
    S.finished = true;
    G.mode = 'over';
    $('l2UI').hidden = true; $('tip').hidden = true;
    const left = Math.max(0, S.count), pct = left / 3200;
    const stars = pct <= 0.05 ? 3 : pct <= 0.2 ? 2 : 1;
    save.stars[2] = Math.max(save.stars[2] || 0, stars);
    save.best[2] = save.best[2] == null ? left : Math.min(save.best[2], left);
    persist();
    $('resTitle').textContent = left === 0 ? 'يد نظيفة تمامًا! 🎉' : 'غسلٌ رائع! 🎉';
    $('resScore').innerHTML = `من <b>${ARN(S.peak)}</b> جرثومة بقيت <b>${ARN(left)}</b> فقط.` +
      (left > 0 ? '<br>نصيحة: اتّبع الخطوات بالترتيب حتى لا تنقسم البكتيريا المنسية.' : '<br>اتّبعتَ خطوات الغسل الصحيحة كلها، يا حارس أترجّة!');
    const st = $('stars').children;
    for (let i = 0; i < 3; i++) { st[i].classList.remove('on'); if (i < stars) setTimeout(() => { st[i].classList.add('on'); AU.sfx('star', i); }, 500 + i * 380); }
    const q = QUIZ[save.age];
    $('quiz').hidden = false; $('qTxt').textContent = q.q; $('qWhy').hidden = true;
    const box = $('qOpts'); box.innerHTML = ''; delete box.dataset.done;
    q.o.forEach((o, i) => {
      const b = document.createElement('button'); b.textContent = o;
      b.onclick = () => {
        if (box.dataset.done) return; box.dataset.done = 1;
        b.classList.add(i === q.ok ? 'ok' : 'no'); box.children[q.ok].classList.add('ok');
        $('qWhy').textContent = (i === q.ok ? 'أحسنت! ' : 'قريب! ') + q.why; $('qWhy').hidden = false;
        if (i === q.ok) AU.sfx('card');
      };
      box.appendChild(b);
    });
    const nc = $('newCards'); nc.innerHTML = '';
    G.newCards.forEach(id => {
      const c = H.CARDS.find(x => x.id === id), b = document.createElement('button');
      b.textContent = '🔬 ' + c.title; b.onclick = () => H.openCard(id); nc.appendChild(b);
    });
    H.show('sResult'); AU.sfx('win'); AU.music('menu');
  }

  function quit() {
    $('l2UI').hidden = true; $('tip').hidden = true;
    G.mode = 'menu'; AU.music('menu'); H.openMap();
  }

  $('l2Flip').onclick = () => { if (S.phase === 'soap') { S.flipTo = -S.flipTo; AU.sfx('shoot'); } };
  $('l2Rinse').onclick = () => { if (S.rubT >= MIN_RUB) toRinse(); };
  $('l2Quit').onclick = quit;

  window.__L2 = { start, frame, _S: S };
})();
