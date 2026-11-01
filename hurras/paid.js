/* حرّاس أترجّة — مهمّات النسخة الكاملة:
   ٣) جرح في البستان: اليود   ٤) غرفة الضوء البنفسجي   ٥) رحلة إلى بغداد مع الرازي */
(function () {
  'use strict';
  const H = window.__H;
  const { G, AU, save, persist, $, rnd, clamp } = H;
  const ARN = H.AR;
  const age = () => save.age || 'b';

  /* ================= بطاقات الفضول ================= */
  const TXT = {
    iodine: {
      a: 'اليود مطهّر بنّي اللون يقتل أنواعًا كثيرة من الجراثيم، لذلك يوضع على الجروح الصغيرة بعد غسلها بالماء النظيف.',
      b: 'اليود مادة تُتلف بروتينات الجراثيم وأغشيتها، فيقتل البكتيريا والفيروسات والفطريات. ولونه البنّي يدلّنا على المكان الذي غطّيناه.',
      c: 'يُستعمل اليود مطهّرًا منذ القرن التاسع عشر. وفي صيغة «البوفيدون اليودي» يتحرّر ببطء فيعمل مدة أطول ويهيّج الجلد أقل. ولا يُستعمل على الجروح الكبيرة أو لمن عنده حساسية منه إلا باستشارة طبية.'
    },
    wound: {
      a: 'إذا جُرحت: اغسل الجرح بماء نظيف، ثم ضع المطهّر، ثم غطّه بلاصقة نظيفة. وأخبر الكبار دائمًا.',
      b: 'الجلد درع يحمينا، والجرح باب مفتوح للجراثيم. الغسل يزيل الأوساخ، والمطهّر يقتل ما بقي، والضماد يمنع دخول جراثيم جديدة.',
      c: 'الإسعاف الأولي للجرح الصغير: إيقاف النزف بالضغط، ثم الغسل بماء جارٍ نظيف، ثم مطهّر مناسب، ثم ضماد معقّم. واحمرار الجرح أو انتفاخه أو سخونته بعد أيام قد يدل على عدوى تحتاج طبيبًا.'
    },
    uv: {
      a: 'ضوء بنفسجي خاص يخرّب «كتيّب التعليمات» داخل الجرثومة فلا تستطيع التكاثر. لكنه يؤذي العين والجلد، فلا يُشغَّل والناس في الغرفة.',
      b: 'الأشعة فوق البنفسجية من نوع C تُتلف المادة الوراثية للجراثيم. لكنها لا تصل إلى ما في الظل، ولهذا يحرّك العاملون المصباح في أنحاء الغرفة.',
      c: 'أشعة UV-C (طولها الموجي نحو ٢٠٠–٢٨٠ نانومتر) تمتصّها المادة الوراثية فتتكوّن فيها روابط خاطئة تمنع نسخها. وتُستعمل لتعقيم الغرف والماء والهواء، بشرط ألّا يكون أحد في المكان.'
    },
    shadow: {
      a: 'الضوء يمشي في خطوط مستقيمة، فالجراثيم المختبئة خلف السرير لا يصلها. حرّك المصباح لتصل إليها!',
      b: 'كل ما يقف في طريق الضوء يصنع ظلًّا. لذلك تعقيم الغرفة بالضوء يحتاج أكثر من مكان للمصباح.',
      c: 'شدّة الإشعاع تقلّ كلما ابتعدنا عن المصباح (تقريبًا بمربّع المسافة)، والظلال تحجبه تمامًا. لذلك تحتاج الغرفة جرعة كافية من أكثر من زاوية.'
    },
    razi: {
      a: 'أبو بكر الرازي طبيب مسلم عاش قبل أكثر من ألف سنة. يُروى أنه علّق قطع لحم في أحياء بغداد، واختار لبناء المستشفى المكان الذي فسد فيه اللحم أبطأ.',
      b: 'كان الرازي من كبار أطباء عصره، وكتب موسوعة طبية ضخمة اسمها «الحاوي»، واعتمد على الملاحظة والتجربة. ويُروى أنه اختار موضع مستشفى بغداد باختبار قطع اللحم.',
      c: 'عاش الرازي نحو ٨٦٥–٩٢٥م، وكتب رسالة مشهورة فرّق فيها بين الجدري والحصبة. لم يكن أحد يعرف الجراثيم بعد، فقد جاءت هذه المعرفة بعد قرون مع باستور وكوخ. لكن اهتمامه بالهواء النظيف والملاحظة الدقيقة سبق عصره.'
    },
    distill: {
      a: 'التقطير: نسخّن السائل فيتبخّر، ثم نبرّد البخار فيعود قطرات نقية.',
      b: 'يغلي الكحول عند نحو ٧٨ درجة، ويغلي الماء عند ١٠٠. فإذا سخّنّا المزيج بلطف يتبخّر الكحول أولًا فنجمعه وحده.',
      c: 'طوّر الكيميائيون في الحضارة الإسلامية جهاز «الإنبيق» للتقطير، ومن اسمه العربي جاءت كلمة alembic في اللغات الأوروبية. ويُنسب إلى الرازي أنه من أوائل من استعملوا الكحول المقطّر في الطب.'
    },
    alcohol: {
      a: 'الكحول يقتل كثيرًا من الجراثيم بسرعة، لذلك يعقّم به الأطباء أدواتهم وأيديهم.',
      b: 'الكحول يُفسد بروتينات الجراثيم ويذيب الغلاف الدهني للفيروسات، ثم يتبخّر بسرعة.',
      c: 'أفضل تركيز للتعقيم نحو ٦٠–٨٠٪، لأن قليلًا من الماء يساعد الكحول على الدخول إلى الخلية قبل أن يتبخّر. أمّا الكحول شبه النقي فيتبخّر أسرع من أن يعمل جيدًا.'
    }
  };
  const NEWC = [
    { id: 'wound', title: 'إسعاف الجرح', emoji: '🩹' },
    { id: 'shadow', title: 'الضوء والظل', emoji: '🔦' },
    { id: 'distill', title: 'الإنبيق والتقطير', emoji: '⚗️' },
    { id: 'alcohol', title: 'الكحول المعقّم', emoji: '🧴' }
  ];
  NEWC.forEach(c => { if (!H.CARDS.find(x => x.id === c.id)) H.CARDS.splice(H.CARDS.findIndex(x => x.future), 0, c); });
  H.CARDS.forEach(c => { if (TXT[c.id]) { c.txt = TXT[c.id]; if (c.id !== 'spore') delete c.future; } });

  const QUIZ = {
    3: {
      a: { q: 'جرحتَ ركبتك. ما أول شيء تفعله؟', o: ['أغسله بماء نظيف', 'أتركه مكشوفًا', 'أمسحه بالتراب'], ok: 0, why: 'الغسل يزيل الأوساخ أولًا، ثم المطهّر، ثم اللاصقة.' },
      b: { q: 'لماذا نغطّي الجرح بعد تطهيره؟', o: ['ليصبح أجمل', 'حتى لا تدخله جراثيم جديدة', 'لأن اليود يتبخّر'], ok: 1, why: 'الضماد النظيف يغلق الباب المفتوح في الجلد.' },
      c: { q: 'كيف يقتل اليود الجراثيم؟', o: ['يتلف بروتيناتها وأغشيتها', 'يبرّدها حتى تتجمّد', 'يجعلها تنام'], ok: 0, why: 'اليود مادة مؤكسِدة تُفسد بروتينات الجرثومة وغشاءها.' }
    },
    4: {
      a: { q: 'لماذا نُخرج الناس قبل تشغيل الضوء البنفسجي؟', o: ['لأنه يؤذي العين والجلد', 'لأنه مزعج', 'لأنه يطفئ الكهرباء'], ok: 0, why: 'الأشعة التي تخرّب المادة الوراثية للجراثيم تؤذي خلايانا أيضًا.' },
      b: { q: 'لماذا بقيت جراثيم خلف السرير؟', o: ['لأنها أقوى', 'لأن الضوء لا يصل إلى الظل', 'لأنها نائمة'], ok: 1, why: 'الضوء يسير في خطوط مستقيمة، فما في الظل لا يتعقّم.' },
      c: { q: 'ماذا تفعل أشعة UV-C بالجرثومة؟', o: ['تذيب جدارها بالحرارة', 'تتلف مادتها الوراثية فلا تتكاثر', 'تغيّر لونها فقط'], ok: 1, why: 'تمتصّها الـDNA والـRNA فتتكوّن روابط خاطئة تمنع النسخ.' }
    },
    5: {
      a: { q: 'ماذا يحدث في التقطير؟', o: ['يتبخّر السائل ثم يعود قطرات نقية', 'يتجمّد السائل', 'يختفي السائل'], ok: 0, why: 'نسخّن فيتبخّر، ثم نبرّد البخار فيتكاثف قطرات.' },
      b: { q: 'لماذا نسخّن المزيج بلطف عند تقطير الكحول؟', o: ['لأن النار خطرة فقط', 'لأن الكحول يغلي قبل الماء', 'لأن الكحول لا يغلي'], ok: 1, why: 'الكحول يغلي عند نحو ٧٨° والماء عند ١٠٠°، فالتسخين اللطيف يفصلهما.' },
      c: { q: 'لماذا اختار الرازي مكانًا فسد فيه اللحم أبطأ؟', o: ['لأنه أقرب إلى السوق', 'لأن الهواء فيه أنظف وأقل إفسادًا', 'لأنه أرخص'], ok: 1, why: 'لم تكن الجراثيم معروفة، لكن بطء الفساد دلّه على مكان أصحّ للمرضى.' }
    }
  };

  /* ================= الإطار المشترك ================= */
  let S = {}, L = null;
  const geo = () => { const { W, H: HH } = H.size(); return { W, HH, u: Math.min(W, HH * 0.62) }; };
  const ui = (title, hint) => { $('pxTitle').innerHTML = title; if (hint != null) $('pxHint').innerHTML = hint; };
  const meter = (k, lbl, col) => { $('pxMeter').style.width = clamp(k, 0, 1) * 100 + '%'; $('pxMeterLbl').textContent = lbl; if (col) $('pxMeter').style.background = col; };
  const btn = (txt, fn) => { const b = $('pxBtn'); if (!txt) { b.hidden = true; return; } b.hidden = false; b.textContent = txt; b.onclick = fn; };

  function start(n) {
    H.show('none');
    AU.init(); AU.music('play');
    L = LV[n];
    S = { n, t: 0, phase: '', killed: 0, done: false };
    Object.assign(G, { mode: 'px', parts: [], texts: [], germs: [], newCards: [], again: () => start(n) });
    $('pxUI').hidden = false; btn(null);
    L.init();
  }

  function quit() { $('pxUI').hidden = true; $('tip').hidden = true; G.mode = 'menu'; G.germs = []; AU.music('menu'); H.openMap(); }
  $('pxQuit').onclick = quit;

  function finish(stars, title, html) {
    if (S.done) return; S.done = true;
    G.mode = 'over'; G.germs = [];
    $('pxUI').hidden = true; $('tip').hidden = true;
    save.stars[S.n] = Math.max(save.stars[S.n] || 0, stars); persist();
    $('resTitle').textContent = title;
    $('resScore').innerHTML = html;
    const st = $('stars').children;
    for (let i = 0; i < 3; i++) { st[i].classList.remove('on'); if (i < stars) setTimeout(() => { st[i].classList.add('on'); AU.sfx('star', i); }, 500 + i * 380); }
    const q = QUIZ[S.n][age()];
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
    G.newCards.forEach(id => { const c = H.CARDS.find(x => x.id === id), b = document.createElement('button'); b.textContent = '🔬 ' + c.title; b.onclick = () => H.openCard(id); nc.appendChild(b); });
    H.show('sResult'); AU.sfx(stars ? 'win' : 'lose'); AU.music('menu');
  }

  function fail(title, html) {
    if (S.done) return; S.done = true;
    G.mode = 'over'; G.germs = []; $('pxUI').hidden = true; $('tip').hidden = true;
    $('resTitle').textContent = title; $('resScore').innerHTML = html;
    [...$('stars').children].forEach(s => s.classList.remove('on'));
    $('quiz').hidden = true; $('newCards').innerHTML = '';
    H.show('sResult'); AU.sfx('lose'); AU.music('menu');
  }

  // اللمس: كل مهمّة تستقبل down/move/up
  let ptr = null;
  const cv = $('cv');
  cv.addEventListener('pointerdown', e => { if (G.mode !== 'px') return; ptr = { x: e.clientX, y: e.clientY, t: performance.now() }; L.down && L.down(e.clientX, e.clientY); });
  cv.addEventListener('pointermove', e => {
    if (G.mode !== 'px' || !ptr) return;
    const now = performance.now(), dt = Math.max(0.001, (now - ptr.t) / 1000);
    L.move && L.move(e.clientX, e.clientY, e.clientX - ptr.x, e.clientY - ptr.y, dt);
    ptr = { x: e.clientX, y: e.clientY, t: now };
  });
  const up = e => { if (G.mode === 'px' && ptr) L.up && L.up(e.clientX, e.clientY); ptr = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  function frame(t, dt) { S.t += dt; L.frame(t, dt, geo()); }

  function drawImg(name, x, y, h, alpha, rot) {
    const im = H.IMG[name] || IMGX[name]; if (!im || !H.ready(im)) return;
    const w = h * im.naturalWidth / im.naturalHeight, cx = H.cx;
    cx.save(); cx.globalAlpha = alpha == null ? 1 : alpha; cx.translate(x, y); if (rot) cx.rotate(rot);
    cx.drawImage(im, -w / 2, -h / 2, w, h); cx.restore();
  }
  const IMGX = {};
  ['razi'].forEach(n => { const im = new Image(); im.src = 'assets/' + n + '.webp'; IMGX[n] = im; });

  function germSprite(g, t, extra) {
    const im = g.type === 'virus' ? H.IMG.virus : H.IMG.bacterium; if (!H.ready(im)) return;
    const h = g.r * 2.4, w = g.type === 'virus' ? h : h * im.naturalWidth / im.naturalHeight, cx = H.cx;
    cx.save(); cx.translate(g.x, g.y); cx.rotate((g.rot || 0) + Math.sin(t * 3 + (g.p || 0)) * 0.12);
    cx.globalAlpha = g.alpha == null ? 1 : g.alpha;
    cx.drawImage(im, -w / 2, -h / 2, w, h);
    cx.restore();
    if (extra && g.dose > 0 && g.dying < 0) { // حلقة تبيّن مقدار الجرعة
      cx.save(); cx.globalAlpha = 0.9; cx.strokeStyle = extra; cx.lineWidth = 3; cx.lineCap = 'round';
      cx.beginPath(); cx.arc(g.x, g.y, g.r * 1.35, -Math.PI / 2, -Math.PI / 2 + Math.min(1, g.dose) * 6.283); cx.stroke(); cx.restore();
    }
  }
  function rr(x, y, w, h, r) { const cx = H.cx; cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
  function label(x, y, txt, col) { G.texts.push({ x, y, txt, life: 1.4, max: 1.4, col: col || '#fff', size: 16, box: true }); }

  /* ================= ٣) جرح في البستان: اليود ================= */
  const L3 = {
    init() {
      Object.assign(S, { phase: 'intro', dirt: [], blobs: [], supply: 1, infection: 0, guardT: 0, spawnT: 0, band: null, painting: false });
      ui('🩹 جرح في البستان', '');
      meter(0, 'احمرار الجرح', '#ff8fa3');
      const g = geo(), c = this.center(g);
      for (let i = 0; i < 12; i++) S.dirt.push({ x: c.x + rnd(-g.u * 0.2, g.u * 0.2), y: c.y + rnd(-g.u * 0.035, g.u * 0.035), r: rnd(3, 7), a: 1 });
      H.tip({
        a: 'آخ! سَنَد خدش ركبته وهو يقطف التين 🍐 الجرح باب مفتوح للجراثيم. أولًا: <b>اغسله بماء نظيف</b>. اسحب إصبعك فوق الجرح من الأعلى إلى الأسفل.',
        b: 'سَنَد خدش ركبته! الجلد درعنا، والجرح ثغرة فيه. الخطوة الأولى: <b>غسل الجرح بماء نظيف</b> لإزالة الأوساخ. اسحب إصبعك فوقه إلى الأسفل.',
        c: 'جرح صغير في ركبة سَنَد. الإسعاف الصحيح يبدأ <b>بالغسل بماء جارٍ نظيف</b> لإزالة الأوساخ وكثير من الجراثيم. اسحب إصبعك فوق الجرح إلى الأسفل.'
      }[age()], () => { S.phase = 'wash'; ui('🩹 جرح في البستان', '💧 اغسل الجرح: اسحب إصبعك إلى الأسفل'); });
    },
    center(g) { return { x: g.W / 2, y: g.HH * 0.47 }; },
    down(x, y) {
      if (S.phase === 'band' && S.band && Math.hypot(x - S.band.x, y - S.band.y) < 90) S.band.drag = true;
    },
    move(x, y, dx, dy, dt) {
      const g = geo(), c = this.center(g);
      if (S.phase === 'wash' && dy > 0) {
        for (let k = 0; k < 2; k++) H.part('splash', x + rnd(-20, 20), y, rnd(-30, 30), rnd(120, 240), rnd(3, 5), 0.6);
        S.dirt.forEach(d => { if (Math.hypot(d.x - x, d.y - y) < 60) { d.a -= 0.25; d.y += 6; } });
        if (Math.random() < 0.2) AU.sfx('rub');
        if (S.dirt.every(d => d.a <= 0)) {
          S.phase = 'pre'; AU.sfx('card');
          H.tip({
            a: 'نظيف! لكن جراثيم البستان قادمة نحو الجرح. <b>ارسم باليود</b> بإصبعك حول الجرح وفي طريقها. اليود البنّي يقتلها! راقب خزّان اليود.',
            b: 'الآن <b>المطهّر</b>: ارسم بإصبعك باليود حول الجرح وفي طريق الجراثيم. كل جرثومة تمرّ في اليود تتلف. لا تُسرف، فالخزّان يحتاج وقتًا ليمتلئ.',
            c: 'المطهّر يقتل ما تبقّى ويحمي من القادم. <b>ارسم باليود</b> حول الجرح. اليود يعمل مدة ثم يجفّ، فجدّده في الأماكن المهمّة، ووزّع الخزّان بحكمة.'
          }[age()], () => { S.phase = 'guard'; S.guardT = 0; H.unlockCard('wound'); });
        }
      }
      if (S.phase === 'guard') {
        if (S.supply > 0.02 && Math.hypot(dx, dy) > 2) {
          const n = Math.max(1, Math.round(Math.hypot(dx, dy) / 14));
          for (let i = 0; i < n; i++) {
            const k = i / n;
            S.blobs.push({ x: x - dx * k, y: y - dy * k, r: g.u * 0.085 * rnd(0.9, 1.1), life: 11, max: 11 });
          }
          S.supply = Math.max(0, S.supply - 0.009 * n);
          S.painting = true;
          if (S.blobs.length > 400) S.blobs.splice(0, S.blobs.length - 400);
        }
      }
      if (S.phase === 'band' && S.band && S.band.drag) { S.band.x = x; S.band.y = y; }
    },
    up(x, y) {
      S.painting = false;
      if (S.phase === 'band' && S.band && S.band.drag) {
        S.band.drag = false;
        const g = geo(), c = this.center(g);
        if (Math.hypot(S.band.x - c.x, S.band.y - c.y) < g.u * 0.18) {
          S.band.x = c.x; S.band.y = c.y; S.band.on = true; S.phase = 'done'; AU.sfx('win');
          H.unlockCard('iodine');
          setTimeout(() => {
            const inf = S.infection, stars = inf < 25 ? 3 : inf < 60 ? 2 : 1;
            finish(stars, 'جرح نظيف ومحميّ! 🩹', `قضيتَ على <b>${ARN(S.killed)}</b> جرثومة، واحمرار الجرح <b>${ARN(Math.round(inf))}٪</b>.<br>تذكّر: اغسل، ثم طهّر، ثم غطِّ، وأخبر الكبار دائمًا.`);
          }, 900);
        }
      }
    },
    frame(t, dt, g) {
      const cx = H.cx, c = this.center(g), u = g.u;
      const sk = cx.createRadialGradient(c.x, c.y, u * 0.1, c.x, c.y, Math.max(g.W, g.HH) * 0.8);
      sk.addColorStop(0, '#f3c2a0'); sk.addColorStop(0.6, '#e6a984'); sk.addColorStop(1, '#b97a5c');
      cx.fillStyle = sk; cx.fillRect(0, 0, g.W, g.HH);
      cx.strokeStyle = 'rgba(150,90,60,.18)'; cx.lineWidth = 1.5;   // خطوط الجلد
      for (let i = 0; i < 9; i++) { const yy = g.HH * (0.12 + i * 0.1); cx.beginPath(); cx.moveTo(0, yy); cx.bezierCurveTo(g.W * 0.3, yy - 14, g.W * 0.7, yy + 14, g.W, yy); cx.stroke(); }
      // الجرح
      const red = S.infection / 100;
      cx.save(); cx.translate(c.x, c.y);
      const halo = cx.createRadialGradient(0, 0, u * 0.05, 0, 0, u * (0.3 + red * 0.2));
      halo.addColorStop(0, `rgba(255,60,80,${0.25 + red * 0.45})`); halo.addColorStop(1, 'rgba(255,60,80,0)');
      cx.fillStyle = halo; cx.beginPath(); cx.ellipse(0, 0, u * (0.42 + red * 0.15), u * (0.2 + red * 0.1), 0, 0, 6.28); cx.fill();
      cx.fillStyle = '#b3243a'; cx.beginPath(); cx.ellipse(0, 0, u * 0.26, u * 0.045, -0.06, 0, 6.28); cx.fill();
      cx.fillStyle = '#e2435a'; cx.beginPath(); cx.ellipse(0, -u * 0.006, u * 0.22, u * 0.022, -0.06, 0, 6.28); cx.fill();
      cx.restore();
      // الأوساخ
      S.dirt.forEach(d => { if (d.a > 0) { cx.globalAlpha = d.a; cx.fillStyle = '#6b4a2a'; cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.28); cx.fill(); } });
      cx.globalAlpha = 1;
      // اليود
      for (const b of S.blobs) {
        b.life -= dt;
        const k = clamp(b.life / b.max, 0, 1);
        const gr = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        gr.addColorStop(0, `rgba(170,80,20,${0.42 * k})`); gr.addColorStop(1, 'rgba(170,80,20,0)');
        cx.fillStyle = gr; cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 6.28); cx.fill();
      }
      S.blobs = S.blobs.filter(b => b.life > 0);

      if (S.phase === 'guard') {
        S.guardT += dt;
        const dur = age() === 'a' ? 40 : 45;
        S.supply = Math.min(1, S.supply + dt * (S.painting ? 0.03 : 0.14));
        // ظهور الجراثيم من الأطراف
        S.spawnT -= dt;
        const gap = (age() === 'a' ? 1.9 : age() === 'b' ? 1.45 : 1.2) * (S.guardT > dur * 0.6 ? 0.8 : 1);
        if (S.spawnT <= 0 && S.guardT < dur - 4) {
          S.spawnT = gap * rnd(0.7, 1.3);
          const side = Math.floor(rnd(0, 4)), type = Math.random() < 0.55 ? 'bact' : 'virus';
          const p = side === 0 ? { x: rnd(0, g.W), y: 70 } : side === 1 ? { x: rnd(0, g.W), y: g.HH - 20 } : side === 2 ? { x: -10, y: rnd(90, g.HH - 40) } : { x: g.W + 10, y: rnd(90, g.HH - 40) };
          G.germs.push({ type, x: p.x, y: p.y, r: u * (type === 'virus' ? 0.045 : 0.04), dose: 0, sp: u * rnd(0.08, 0.125) * (age() === 'a' ? 0.8 : 1), p: rnd(0, 6), rot: rnd(-0.5, 0.5), dying: -1 });
        }
        for (const gm of G.germs) {
          if (gm.dying >= 0) { gm.dying += dt; gm.alpha = 1 - gm.dying / 0.6; if (gm.dying > 0.6) gm.dead = true; continue; }
          const dx = c.x - gm.x, dy = c.y - gm.y, d = Math.hypot(dx, dy);
          gm.x += (dx / d * gm.sp + Math.sin(S.t * 2 + gm.p) * 20) * dt; gm.y += (dy / d * gm.sp + Math.cos(S.t * 2 + gm.p) * 12) * dt;
          const inIod = S.blobs.some(b => Math.hypot(b.x - gm.x, b.y - gm.y) < b.r * 0.92);
          if (inIod) { gm.dose += dt * 2.2; if (Math.random() < 0.15) H.part('bub', gm.x, gm.y, rnd(-20, 20), rnd(-40, -10), rnd(2, 5), 0.6); }
          if (gm.dose >= 1) {
            gm.dying = 0; S.killed++; AU.sfx('membrane');
            for (let k = 0; k < 8; k++) H.part('dot', gm.x, gm.y, rnd(-90, 90), rnd(-110, 30), rnd(2, 4), 0.7);
            if (S.killed === 1) label(gm.x, gm.y - 30, { a: 'اليود هزمها!', b: 'أتلف اليود غشاءها!', c: 'تأكسدت بروتيناتها' }[age()], '#ffd08a');
          } else if (d < u * 0.17) {
            gm.dead = true; S.infection = Math.min(100, S.infection + (gm.type === 'bact' ? 11 : 8));
            AU.sfx('hurt'); H.part('ring', gm.x, gm.y, 0, 0, gm.r, 0.5);
            label(c.x, c.y - u * 0.16, 'دخلت جرثومة الجرح!', '#ff9fb3');
          }
        }
        G.germs = G.germs.filter(x => !x.dead);
        for (const gm of G.germs) germSprite(gm, t, '#ffb35c');
        meter(S.infection / 100, 'احمرار الجرح', '#ff8fa3');
        ui('🩹 جرح في البستان', `🧴 خزّان اليود: <b>${ARN(Math.round(S.supply * 100))}٪</b> · ⏱️ ${ARN(Math.max(0, Math.ceil(dur - S.guardT)))}`);
        if (S.infection >= 100) return fail('احمرّ الجرح كثيرًا 😟', 'لا بأس، جرّب مرة أخرى! ارسم اليود <b>حول الجرح</b> مبكرًا، ولا تُفرغ الخزّان دفعة واحدة.<br>وفي الحياة: إذا احمرّ الجرح وانتفخ فأخبر الكبار ليأخذوك إلى الطبيب.');
        if (S.guardT >= dur && !G.germs.some(x => x.dying < 0)) {
          S.phase = 'band';
          S.band = { x: g.W / 2, y: g.HH - 120, drag: false, on: false };
          H.tip({ a: 'أحسنت! الخطوة الأخيرة: <b>اسحب اللاصقة</b> وضعها على الجرح.', b: 'الجرح نظيف ومطهّر. الآن <b>غطّه باللاصقة</b> حتى لا تدخله جراثيم جديدة: اسحبها إلى الجرح.', c: 'الضماد المعقّم يغلق الثغرة ويحمي الجرح وهو يلتئم. <b>اسحب اللاصقة</b> إلى الجرح.' }[age()], () => ui('🩹 جرح في البستان', '🩹 اسحب اللاصقة إلى الجرح'));
        }
      } else if (S.phase === 'pre' || S.phase === 'wash' || S.phase === 'intro') {
        meter(S.infection / 100, 'احمرار الجرح', '#ff8fa3');
      }
      // اللاصقة
      if (S.band) {
        const b = S.band;
        cx.save(); cx.translate(b.x, b.y); cx.rotate(-0.06);
        cx.fillStyle = '#f2c79a'; rr(-u * 0.32, -u * 0.075, u * 0.64, u * 0.15, u * 0.07); cx.fill();
        cx.fillStyle = '#fff3e6'; rr(-u * 0.12, -u * 0.06, u * 0.24, u * 0.12, u * 0.02); cx.fill();
        cx.fillStyle = 'rgba(160,110,70,.35)';
        for (let i = -6; i <= 6; i++) if (Math.abs(i) > 2) { cx.beginPath(); cx.arc(i * u * 0.04, 0, 2, 0, 6.28); cx.fill(); }
        cx.restore();
        if (!b.on && !b.drag) { cx.globalAlpha = 0.5 + Math.sin(t * 6) * 0.3; cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.setLineDash([8, 8]); cx.beginPath(); cx.ellipse(c.x, c.y, u * 0.33, u * 0.09, 0, 0, 6.28); cx.stroke(); cx.setLineDash([]); cx.globalAlpha = 1; }
      }
      drawImg('iodine', 46, g.HH - 70, 90, 0.95);
    }
  };

  /* ================= ٤) غرفة الضوء البنفسجي ================= */
  const L4 = {
    init() {
      const g = geo();
      const room = this.room(g);
      const R = (x, y, w, h, kind) => ({ x: room.x + x * room.w, y: room.y + y * room.h, w: w * room.w, h: h * room.h, kind });
      S.obs = [R(0.08, 0.12, 0.34, 0.2, 'bed'), R(0.6, 0.18, 0.22, 0.14, 'table'), R(0.14, 0.62, 0.14, 0.12, 'chair'), R(0.62, 0.62, 0.26, 0.11, 'cabinet')];
      S.people = [{ ic: '🧒', x: room.x + room.w * 0.5, y: room.y + room.h * 0.45, out: false, walk: 0 }, { ic: '👩‍⚕️', x: room.x + room.w * 0.75, y: room.y + room.h * 0.82, out: false, walk: 0 }];
      S.door = { x: room.x + room.w - 6, y: room.y + room.h * 0.45 };
      S.lamp = { x: room.x + room.w * 0.5, y: room.y + room.h * 0.92, drag: false };
      S.on = false; S.uvT = 0; S.phase = 'intro'; S.warned = false;
      // جراثيم موزّعة، بعضها مختبئ خلف الأثاث
      const inObs = (x, y) => S.obs.some(o => x > o.x - 8 && x < o.x + o.w + 8 && y > o.y - 8 && y < o.y + o.h + 8);
      const n = age() === 'a' ? 22 : 28;
      let tries = 0;
      while (G.germs.length < n && tries++ < 2000) {
        let x, y;
        if (G.germs.length < 8) { const o = S.obs[G.germs.length % 4]; x = o.x + rnd(0, o.w); y = G.germs.length < 4 ? o.y - rnd(12, 26) : o.y + o.h + rnd(12, 26); }
        else { x = room.x + rnd(16, room.w - 16); y = room.y + rnd(16, room.h - 16); }
        if (inObs(x, y) || x < room.x + 10 || x > room.x + room.w - 10 || y < room.y + 10 || y > room.y + room.h - 10) continue;
        const type = Math.random() < 0.5 ? 'virus' : 'bact';
        G.germs.push({ type, x, y, r: g.u * 0.03, dose: 0, p: rnd(0, 6), rot: rnd(-0.6, 0.6), dying: -1 });
      }
      S.total = G.germs.length;
      ui('🔦 غرفة الضوء البنفسجي', '');
      meter(0, 'الجراثيم المعقّمة', '#b58bff');
      btn(null);
      H.tip({
        a: 'غرفة مريض في المستشفى تحتاج تعقيمًا. عندنا <b>مصباح الضوء البنفسجي</b>! لكنه يؤذي العين والجلد، فأولًا: <b>المس كل شخص</b> ليخرج من الغرفة.',
        b: 'سنعقّم غرفة المستشفى بأشعة <b>UV-C</b>. هذه الأشعة تؤذي العين والجلد أيضًا، لذلك القاعدة الأولى: <b>لا أحد في الغرفة</b>. المس الأشخاص ليخرجوا.',
        c: 'تعقيم الغرف بأشعة <b>UV-C</b> فعّال، لكنه خطر على الإنسان. أول قاعدة أمان: <b>أخرِج كل الأشخاص</b> قبل التشغيل. المس كل شخص ليخرج.'
      }[age()], () => { S.phase = 'clear'; ui('🔦 غرفة الضوء البنفسجي', '🚪 المس الأشخاص ليخرجوا من الغرفة'); this.showBtn(); });
    },
    room(g) { const top = 150, bot = 110; return { x: 14, y: top, w: g.W - 28, h: Math.max(260, g.HH - top - bot) }; },
    showBtn() {
      btn('⚡ شغّل المصباح', () => {
        if (S.people.some(p => !p.out)) { AU.sfx('hurt'); H.toast('⚠️ توقّف! ما زال في الغرفة أشخاص. أخرجهم أولًا'); return; }
        S.on = true; S.phase = 'uv'; btn(null); AU.sfx('wave');
        H.tip({
          a: 'المصباح يعمل! <b>اسحب المصباح</b> في الغرفة. الجراثيم التي في الظل خلف الأثاث لا يصلها الضوء، فاذهب إليها!',
          b: '<b>اسحب المصباح</b> في أنحاء الغرفة. الضوء يسير في خطوط مستقيمة، فالأثاث يصنع ظلالًا تحمي الجراثيم خلفه.',
          c: '<b>حرّك المصباح</b> لتعطي كل مكان جرعة كافية: الشدّة تقلّ مع البعد، والظلال تحجب الأشعة تمامًا.'
        }[age()], () => { S.uvT = 0; S.phase = 'uv2'; });
      });
    },
    down(x, y) {
      if (S.phase === 'clear') {
        S.people.forEach(p => { if (!p.out && !p.walk && Math.hypot(p.x - x, p.y - y) < 44) { p.walk = 1; AU.sfx('click'); } });
      }
      if (S.phase === 'uv2' && Math.hypot(S.lamp.x - x, S.lamp.y - y) < 70) S.lamp.drag = true;
      else if (S.phase === 'uv2') { S.lamp.drag = true; } // يمكن تحريكه بالسحب من أي مكان
    },
    move(x, y, dx, dy) {
      if (S.phase === 'uv2' && S.lamp.drag) {
        const r = this.room(geo());
        S.lamp.x = clamp(S.lamp.x + dx, r.x + 20, r.x + r.w - 20); S.lamp.y = clamp(S.lamp.y + dy, r.y + 20, r.y + r.h - 20);
      }
    },
    up() { S.lamp.drag = false; },
    shadowed(gx, gy) { // هل يقطع أحد قطع الأثاث الخط بين المصباح والجرثومة؟
      const lx = S.lamp.x, ly = S.lamp.y;
      return S.obs.some(o => segRect(lx, ly, gx, gy, o));
    },
    frame(t, dt, g) {
      const cx = H.cx, room = this.room(g), u = g.u;
      // الأرضية
      cx.fillStyle = '#dfe9ee'; cx.fillRect(room.x, room.y, room.w, room.h);
      cx.strokeStyle = 'rgba(120,150,165,.25)'; cx.lineWidth = 1;
      for (let x = room.x; x < room.x + room.w; x += 34) { cx.beginPath(); cx.moveTo(x, room.y); cx.lineTo(x, room.y + room.h); cx.stroke(); }
      for (let y = room.y; y < room.y + room.h; y += 34) { cx.beginPath(); cx.moveTo(room.x, y); cx.lineTo(room.x + room.w, y); cx.stroke(); }
      cx.strokeStyle = '#7d97a3'; cx.lineWidth = 6; cx.strokeRect(room.x, room.y, room.w, room.h);
      cx.fillStyle = '#c99a62'; cx.fillRect(S.door.x - 4, S.door.y - 34, 10, 68);
      // الجراثيم
      for (const gm of G.germs) {
        if (gm.dying >= 0) { gm.dying += dt; gm.alpha = 1 - gm.dying / 0.6; if (gm.dying > 0.6) gm.dead = true; }
        germSprite(gm, t, '#e0c8ff');
      }
      G.germs = G.germs.filter(x => !x.dead);
      // ظلام + ضوء بظلال
      if (S.on) {
        cx.fillStyle = 'rgba(10,8,40,.55)'; cx.fillRect(room.x, room.y, room.w, room.h);
        const off = this.light(g, room);
        cx.save(); cx.globalCompositeOperation = 'lighter'; cx.drawImage(off, 0, 0, g.W, g.HH); cx.restore();
      }
      // الأثاث
      S.obs.forEach(o => {
        const col = { bed: '#8fb6d8', table: '#b98c5d', chair: '#c9a072', cabinet: '#a5b0b8' }[o.kind];
        cx.fillStyle = 'rgba(0,0,0,.18)'; rr(o.x + 4, o.y + 5, o.w, o.h, 8); cx.fill();
        cx.fillStyle = col; rr(o.x, o.y, o.w, o.h, 8); cx.fill();
        if (o.kind === 'bed') { cx.fillStyle = '#f4f8fb'; rr(o.x + 6, o.y + 6, o.w * 0.22, o.h - 12, 6); cx.fill(); cx.fillStyle = '#6f9fca'; rr(o.x + o.w * 0.3, o.y + 4, o.w * 0.66, o.h - 8, 6); cx.fill(); }
        cx.font = '600 11px Alexandria, sans-serif'; cx.textAlign = 'center'; cx.fillStyle = 'rgba(0,0,0,.45)';
        cx.fillText({ bed: 'سرير', table: 'طاولة', chair: 'كرسي', cabinet: 'خزانة' }[o.kind], o.x + o.w / 2, o.y + o.h / 2 + 4);
      });
      // الأشخاص
      cx.globalAlpha = 1;
      S.people.forEach(p => {
        if (p.out) return;
        if (p.walk) { const dx = S.door.x - p.x, dy = S.door.y - p.y, d = Math.hypot(dx, dy); if (d < 10) { p.out = true; AU.sfx('tick'); } else { p.x += dx / d * 220 * dt; p.y += dy / d * 220 * dt; } }
        cx.font = '40px sans-serif'; cx.textAlign = 'center'; cx.fillText(p.ic, p.x, p.y + Math.sin(t * 6) * (p.walk ? 3 : 1));
        if (!p.walk && S.phase === 'clear') { cx.strokeStyle = `rgba(255,220,90,${0.5 + Math.sin(t * 6) * 0.4})`; cx.lineWidth = 3; cx.beginPath(); cx.arc(p.x, p.y - 12, 30, 0, 6.28); cx.stroke(); }
      });
      if (S.phase === 'clear' && S.people.every(p => p.out)) { S.phase = 'ready'; ui('🔦 غرفة الضوء البنفسجي', '✅ الغرفة فارغة. شغّل المصباح!'); }
      // المصباح
      drawImg('uv', S.lamp.x, S.lamp.y, u * 0.16, 1);
      if (S.on) { cx.strokeStyle = 'rgba(200,160,255,.6)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(S.lamp.x, S.lamp.y, u * 0.1, 0, 6.28); cx.stroke(); }
      // الجرعة
      if (S.phase === 'uv2') {
        S.uvT += dt;
        const Rl = u * 0.62;
        for (const gm of G.germs) {
          if (gm.dying >= 0) continue;
          const d = Math.hypot(gm.x - S.lamp.x, gm.y - S.lamp.y);
          if (d > Rl || this.shadowed(gm.x, gm.y)) continue;
          gm.dose += dt * 0.9 * (1 - d / Rl) * (1 - d / Rl) * 2.2;
          if (gm.dose >= 1) {
            gm.dying = 0; S.killed++; AU.sfx(Math.random() < 0.5 ? 'spikes' : 'membrane');
            for (let k = 0; k < 3; k++) H.part('rna', gm.x, gm.y, rnd(-60, 60), rnd(-60, 60), gm.r * 0.8, 1);
            if (S.killed === 1) { label(gm.x, gm.y - 26, { a: 'تخرّبت التعليمات!', b: 'تلفت المادة الوراثية!', c: 'تلف الـDNA: لا تكاثر' }[age()], '#d9c2ff'); H.unlockCard('uv'); }
          }
        }
        if (!S.shadowTold && S.uvT > 6 && G.germs.some(gm => gm.dying < 0 && this.shadowed(gm.x, gm.y))) { S.shadowTold = true; H.unlockCard('shadow'); label(g.W / 2, room.y + 24, '🔦 جراثيم في الظل! حرّك المصباح', '#fff3a0'); }
        const dur = age() === 'a' ? 50 : 42, alive = G.germs.filter(x => x.dying < 0).length;
        meter(S.killed / S.total, 'الجراثيم المعقّمة', '#b58bff');
        ui('🔦 غرفة الضوء البنفسجي', `🦠 بقي <b>${ARN(alive)}</b> · ⏱️ ${ARN(Math.max(0, Math.ceil(dur - S.uvT)))}`);
        if (alive === 0 || S.uvT >= dur) {
          S.phase = 'end'; S.on = false;
          const pct = S.killed / S.total, stars = pct >= 0.95 ? 3 : pct >= 0.7 ? 2 : 1;
          H.unlockCard('uv'); H.unlockCard('shadow');
          setTimeout(() => finish(stars, 'غرفة معقّمة وآمنة! 💜', `عقّمتَ <b>${ARN(S.killed)}</b> من <b>${ARN(S.total)}</b> جرثومة، وأخرجتَ الجميع قبل التشغيل 👏<br>تذكّر: لا تنظر أبدًا إلى مصباح الأشعة فوق البنفسجية.`), 600);
        }
      }
    },
    light(g, room) {
      const off = this._off || (this._off = document.createElement('canvas'));
      const D = Math.min(window.devicePixelRatio || 1, 2);
      if (off.width !== Math.round(g.W * D) || off.height !== Math.round(g.HH * D)) { off.width = Math.round(g.W * D); off.height = Math.round(g.HH * D); }
      const o = off.getContext('2d'); o.setTransform(D, 0, 0, D, 0, 0); o.clearRect(0, 0, g.W, g.HH);
      const lx = S.lamp.x, ly = S.lamp.y, R = g.u * 0.62;
      o.save(); o.beginPath(); o.rect(room.x, room.y, room.w, room.h); o.clip();
      const gr = o.createRadialGradient(lx, ly, 0, lx, ly, R);
      gr.addColorStop(0, 'rgba(190,130,255,.75)'); gr.addColorStop(0.5, 'rgba(140,90,255,.35)'); gr.addColorStop(1, 'rgba(120,80,255,0)');
      o.fillStyle = gr; o.beginPath(); o.arc(lx, ly, R, 0, 6.28); o.fill();
      o.globalCompositeOperation = 'destination-out'; o.fillStyle = '#000';
      const far = 3000;
      S.obs.forEach(r => {
        const P = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
        for (let i = 0; i < 4; i++) {
          const a = P[i], b = P[(i + 1) % 4];
          const pa = [a[0] + (a[0] - lx) * far / Math.hypot(a[0] - lx, a[1] - ly), a[1] + (a[1] - ly) * far / Math.hypot(a[0] - lx, a[1] - ly)];
          const pb = [b[0] + (b[0] - lx) * far / Math.hypot(b[0] - lx, b[1] - ly), b[1] + (b[1] - ly) * far / Math.hypot(b[0] - lx, b[1] - ly)];
          o.beginPath(); o.moveTo(a[0], a[1]); o.lineTo(b[0], b[1]); o.lineTo(pb[0], pb[1]); o.lineTo(pa[0], pa[1]); o.closePath(); o.fill();
        }
      });
      o.restore();
      return off;
    }
  };
  function segRect(x1, y1, x2, y2, r) { // Liang–Barsky
    let t0 = 0, t1 = 1; const dx = x2 - x1, dy = y2 - y1;
    const p = [-dx, dx, -dy, dy], q = [x1 - r.x, r.x + r.w - x1, y1 - r.y, r.y + r.h - y1];
    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) { if (q[i] < 0) return false; continue; }
      const tt = q[i] / p[i];
      if (p[i] < 0) { if (tt > t1) return false; if (tt > t0) t0 = tt; } else { if (tt < t0) return false; if (tt < t1) t1 = tt; }
    }
    return t0 < 0.97;   // لا نعدّ الجرثومة الملاصقة تمامًا للحافة مظلّلة
  }

  /* ================= ٥) رحلة إلى بغداد مع الرازي ================= */
  const SITES = [
    { name: 'قرب المستنقع', ic: '🐸', rate: 1.35 },
    { name: 'وسط السوق المزدحم', ic: '🧺', rate: 1.1 },
    { name: 'قرب مكبّ النفايات', ic: '🗑️', rate: 1.55 },
    { name: 'على ضفّة دجلة، حيث الهواء الطلق', ic: '🌿', rate: 0.45 }
  ];
  const L5 = {
    init() {
      Object.assign(S, { phase: 'intro', meatT: 0, picked: -1, temp: 25, heat: false, drops: 0, pure: 0, impure: 0, dripT: 0, tools: [], wrong: 0, order: SITES.map((s, i) => i).sort(() => Math.random() - 0.5) });
      ui('⚗️ رحلة إلى بغداد', '');
      meter(0, 'تقدّم الرحلة', '#f6cf4a');
      H.tip({
        a: 'قطرة تسافر في الزمن إلى <b>بغداد</b> قبل أكثر من ألف سنة! هنا الطبيب <b>أبو بكر الرازي</b> يريد بناء مستشفى. يُروى أنه علّق <b>قطعة لحم</b> في كل حيّ، ليرى أين يفسد اللحم أبطأ. راقب جيدًا!',
        b: 'رحلة عبر الزمن إلى <b>بغداد</b>! الطبيب <b>أبو بكر الرازي</b> يبحث عن أنسب مكان لمستشفى جديد. تقول الرواية إنه علّق قطع لحم في أحياء مختلفة. راقب أيّها يفسد أبطأ، ثم اختر المكان.',
        c: 'بغداد، القرن العاشر. يُروى أن <b>الرازي</b> اختار موضع المستشفى بتجربة: علّق قطع لحم في أحياء مختلفة، واختار الحيّ الذي فسد فيه اللحم أبطأ. لم تكن الجراثيم معروفة بعد، لكن الملاحظة الدقيقة قادته إلى الهواء الأنظف.'
      }[age()], () => { S.phase = 'site'; S.meatT = 0; ui('⚗️ رحلة إلى بغداد', '👀 راقب قطع اللحم… أيّها يفسد أبطأ؟'); });
    },
    cards(g) { // مواقع البطاقات الأربع
      const top = 150, gap = 10, cw = (g.W - 28 - gap) / 2, ch = Math.min(200, (g.HH - top - 150 - gap) / 2);
      return S.order.map((si, k) => ({ si, x: 14 + (k % 2) * (cw + gap), y: top + Math.floor(k / 2) * (ch + gap), w: cw, h: ch }));
    },
    down(x, y) {
      const g = geo();
      if (S.phase === 'pick') {
        const c = this.cards(g).find(c => x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h);
        if (!c) return;
        if (SITES[c.si].rate < 0.6) {
          S.phase = 'site-ok'; AU.sfx('card'); H.unlockCard('razi');
          meter(0.33, 'تقدّم الرحلة', '#f6cf4a');
          H.tip({
            a: 'أحسنت! على ضفّة النهر فسد اللحم أبطأ، فالهواء هناك أنظف. سيُبنى المستشفى هنا! والآن يحتاج الرازي <b>كحولًا نقيًا</b> لتنظيف الجروح. هيّا إلى <b>الإنبيق</b> ⚗️',
            b: 'صحيح! اللحم يفسد بسبب كائنات دقيقة لم تكن معروفة بعد، وفي المكان الأنظف فسد أبطأ. والآن إلى <b>الإنبيق</b>: سنقطّر كحولًا نقيًا.',
            c: 'اختيار علمي: الفساد الأبطأ يعني هواءً أقل تلوّثًا. الآن <b>التقطير</b>: الكحول يغلي عند نحو ٧٨° والماء عند ١٠٠°. أبقِ الحرارة بينهما لتجمع كحولًا نقيًا.'
          }[age()], () => this.toDistill());
        } else {
          S.wrong++; AU.sfx('hurt');
          label(c.x + c.w / 2, c.y + c.h / 2, 'اللحم هنا فسد أسرع! راقب مرة أخرى', '#ff9fb3');
        }
      }
      if (S.phase === 'distill') { const b = this.heatBtn(g); if (Math.hypot(x - b.x, y - b.y) < b.r + 10) S.heat = true; }
      if (S.phase === 'tools') this.swab(x, y, 0, 0, 0.016);
    },
    move(x, y, dx, dy, dt) { if (S.phase === 'tools') this.swab(x, y, dx, dy, dt); },
    up() { S.heat = false; },
    toDistill() { S.phase = 'distill'; ui('⚗️ الإنبيق', '🔥 اضغط مطوّلًا على زر النار لتسخّن. أبقِ الحرارة بين ٧٨° و١٠٠°'); },
    heatBtn(g) { return { x: g.W / 2, y: g.HH - 110, r: 46 }; },
    swab(x, y, dx, dy, dt) {
      if (Math.hypot(dx, dy) / Math.max(dt, 0.001) < 100 && dx + dy !== 0) return;
      if (Math.random() < 0.5) H.part('bub', x + rnd(-10, 10), y + rnd(-10, 10), rnd(-30, 30), rnd(-50, -10), rnd(3, 6), 0.7);
      for (const gm of G.germs) {
        if (gm.dying >= 0 || Math.hypot(gm.x - x, gm.y - y) > 46) continue;
        gm.dose += Math.min(dt, 0.08) * 2.2 * (0.5 + S.pure / Math.max(1, S.drops));
        if (gm.dose >= 1) { gm.dying = 0; S.killed++; AU.sfx('membrane'); for (let k = 0; k < 6; k++) H.part('dot', gm.x, gm.y, rnd(-80, 80), rnd(-90, 20), rnd(2, 4), 0.6); }
      }
      if (performance.now() - (S.rubT || 0) > 160) { AU.sfx('rub'); S.rubT = performance.now(); }
    },
    frame(t, dt, g) {
      const cx = H.cx, u = g.u;
      cx.fillStyle = 'rgba(70,40,10,.35)'; cx.fillRect(0, 0, g.W, g.HH);
      if (S.phase === 'intro' || S.phase === 'site' || S.phase === 'pick' || S.phase === 'site-ok') {
        if (S.phase === 'site' || S.phase === 'pick') S.meatT += dt;
        if (S.phase === 'site' && S.meatT > 7) { S.phase = 'pick'; ui('⚗️ رحلة إلى بغداد', '👆 اختر المكان الذي فسد فيه اللحم أبطأ'); }
        this.cards(g).forEach(c => {
          const s = SITES[c.si], rot = clamp(S.meatT / 7 * s.rate, 0, 1.4);
          cx.fillStyle = 'rgba(255,244,220,.92)'; rr(c.x, c.y, c.w, c.h, 16); cx.fill();
          cx.strokeStyle = 'rgba(160,110,40,.5)'; cx.lineWidth = 2; cx.stroke();
          cx.font = `${Math.round(c.h * 0.16)}px sans-serif`; cx.textAlign = 'center'; cx.fillText(s.ic, c.x + c.w / 2, c.y + c.h * 0.2);
          // قطعة اللحم وهي تفسد
          const mx = c.x + c.w / 2, my = c.y + c.h * 0.52, mr = Math.min(c.w, c.h) * 0.2;
          cx.strokeStyle = '#7a5a30'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(mx, c.y + c.h * 0.28); cx.lineTo(mx, my - mr * 0.8); cx.stroke();
          const fresh = [196, 60, 70], bad = [110, 120, 60], k = Math.min(1, rot);
          const col = fresh.map((v, i) => Math.round(v + (bad[i] - v) * k));
          cx.fillStyle = `rgb(${col})`; cx.beginPath(); cx.ellipse(mx, my, mr, mr * 0.75, 0.3, 0, 6.28); cx.fill();
          cx.fillStyle = `rgba(255,235,230,${0.6 - k * 0.4})`; cx.beginPath(); cx.ellipse(mx - mr * 0.3, my - mr * 0.2, mr * 0.35, mr * 0.18, 0.3, 0, 6.28); cx.fill();
          // بقع الفساد والذباب
          const spots = Math.floor(k * 9);
          for (let i = 0; i < spots; i++) { cx.fillStyle = 'rgba(70,90,40,.75)'; cx.beginPath(); cx.arc(mx + Math.sin(i * 2.3) * mr * 0.6, my + Math.cos(i * 1.7) * mr * 0.45, 2 + (i % 3), 0, 6.28); cx.fill(); }
          const flies = Math.floor(rot * 3);
          cx.font = '14px sans-serif';
          for (let i = 0; i < flies; i++) cx.fillText('🪰', mx + Math.sin(t * 3 + i * 2) * mr * 1.4, my - mr + Math.cos(t * 4 + i) * mr * 0.6);
          cx.font = `600 ${Math.max(11, Math.round(c.h * 0.075))}px Alexandria, sans-serif`; cx.fillStyle = '#4a3410';
          wrapText(s.name, c.x + c.w / 2, c.y + c.h * 0.86, c.w - 14, Math.round(c.h * 0.09));
        });
        drawImg('razi', 52, g.HH - 100, 170);
      }
      if (S.phase === 'distill') this.drawDistill(t, dt, g);
      if (S.phase === 'tools') this.drawTools(t, dt, g);
    },
    drawDistill(t, dt, g) {
      const cx = H.cx, u = g.u;
      // الحرارة
      S.temp += (S.heat ? 26 : -14) * dt; S.temp = clamp(S.temp, 25, 120);
      const fx = g.W * 0.32, fy = g.HH * 0.52, fr = u * 0.16;
      // اللهب
      if (S.heat) for (let i = 0; i < 3; i++) H.part('dot', fx + rnd(-fr * 0.4, fr * 0.4), fy + fr * 1.25, rnd(-10, 10), rnd(-90, -50), rnd(3, 6), 0.4);
      cx.fillStyle = S.heat ? '#ff9a3c' : '#6b5a4a'; cx.beginPath(); cx.moveTo(fx - fr * 0.5, fy + fr * 1.55); cx.lineTo(fx, fy + fr * (S.heat ? 0.95 : 1.35)); cx.lineTo(fx + fr * 0.5, fy + fr * 1.55); cx.fill();
      // دورق الغليان
      const liq = 1 - S.drops / 16 * 0.6;
      cx.save();
      cx.beginPath(); cx.arc(fx, fy, fr, 0, 6.28); cx.clip();
      cx.fillStyle = `rgba(${S.temp > 100 ? '170,200,255' : '200,225,255'},.75)`; cx.fillRect(fx - fr, fy + fr - fr * 2 * liq * 0.7, fr * 2, fr * 2);
      if (S.temp > 78) for (let i = 0; i < (S.temp > 100 ? 4 : 2); i++) { cx.fillStyle = 'rgba(255,255,255,.8)'; cx.beginPath(); cx.arc(fx + rnd(-fr * 0.6, fr * 0.6), fy + rnd(0, fr * 0.8), rnd(2, 4), 0, 6.28); cx.fill(); }
      cx.restore();
      cx.strokeStyle = 'rgba(220,240,255,.9)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(fx, fy, fr, 0, 6.28); cx.stroke();
      // الرأس والأنبوب (الإنبيق)
      const hx = fx, hy = fy - fr * 1.15, ex = g.W * 0.74, ey = fy + fr * 0.6;
      cx.beginPath(); cx.moveTo(fx - fr * 0.25, fy - fr * 0.95); cx.lineTo(hx - fr * 0.35, hy); cx.quadraticCurveTo(hx, hy - fr * 0.5, hx + fr * 0.35, hy); cx.lineTo(fx + fr * 0.25, fy - fr * 0.95); cx.stroke();
      cx.lineWidth = 5; cx.beginPath(); cx.moveTo(hx + fr * 0.3, hy - fr * 0.05); cx.lineTo(ex, ey - fr * 0.55); cx.stroke();
      // البخار يمشي في الأنبوب
      if (S.temp > 78) { const k = (t * 1.3) % 1; cx.fillStyle = 'rgba(255,255,255,.7)'; cx.beginPath(); cx.arc(hx + fr * 0.3 + (ex - hx - fr * 0.3) * k, hy + (ey - fr * 0.55 - hy) * k, 4, 0, 6.28); cx.fill(); }
      // وعاء الاستقبال
      cx.lineWidth = 3; cx.strokeStyle = 'rgba(220,240,255,.9)'; cx.beginPath(); cx.moveTo(ex - fr * 0.5, ey - fr * 0.3); cx.lineTo(ex - fr * 0.4, ey + fr * 0.6); cx.lineTo(ex + fr * 0.4, ey + fr * 0.6); cx.lineTo(ex + fr * 0.5, ey - fr * 0.3); cx.stroke();
      const lvl = Math.min(1, S.drops / 12);
      cx.fillStyle = S.impure > S.pure * 0.4 ? 'rgba(160,190,230,.8)' : 'rgba(200,245,255,.85)';
      cx.fillRect(ex - fr * 0.4, ey + fr * 0.6 - fr * 0.85 * lvl, fr * 0.8, fr * 0.85 * lvl);
      // التقطير
      if (S.temp > 78) {
        S.dripT += dt * (S.temp > 100 ? 1.8 : 1.1);
        if (S.dripT > 1) {
          S.dripT = 0; S.drops++;
          if (S.temp > 100) { S.impure++; label(ex, ey - fr, 'ماء مع الكحول! خفّف النار', '#9fd0ff'); AU.sfx('hurt'); }
          else { S.pure++; AU.sfx('tick'); if (S.pure === 1) { label(ex, ey - fr, 'قطرة كحول نقيّة!', '#c8ffda'); H.unlockCard('distill'); } }
          H.part('splash', ex, ey - fr * 0.5, 0, 120, 4, 0.4);
        }
      }
      // ميزان الحرارة
      const tx = g.W - 34, ty0 = 170, ty1 = g.HH - 190, ky = v => ty1 - (v - 20) / 100 * (ty1 - ty0);
      cx.fillStyle = 'rgba(255,255,255,.15)'; rr(tx - 9, ty0, 18, ty1 - ty0, 9); cx.fill();
      cx.fillStyle = 'rgba(120,230,160,.35)'; cx.fillRect(tx - 9, ky(100), 18, ky(78) - ky(100));
      cx.fillStyle = S.temp > 100 ? '#ff6b6b' : S.temp > 78 ? '#5be09a' : '#ffd36b'; rr(tx - 5, ky(S.temp), 10, ty1 - ky(S.temp), 5); cx.fill();
      cx.font = '600 11px Alexandria'; cx.fillStyle = '#fff'; cx.textAlign = 'right';
      cx.fillText('١٠٠°', tx - 14, ky(100) + 4); cx.fillText('٧٨°', tx - 14, ky(78) + 4);
      cx.textAlign = 'center'; cx.font = '800 15px Alexandria'; cx.fillText(ARN(Math.round(S.temp)) + '°', tx, ty0 - 10);
      // زر النار
      const b = this.heatBtn(g);
      cx.fillStyle = S.heat ? '#ff7a2f' : '#e9a91c'; cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 6.28); cx.fill();
      cx.font = `${Math.round(b.r)}px sans-serif`; cx.fillText('🔥', b.x, b.y + b.r * 0.35);
      cx.font = '600 13px Alexandria'; cx.fillStyle = '#fff'; cx.fillText('اضغط مطوّلًا', b.x, b.y + b.r + 20);
      drawImg('razi', 46, g.HH - 90, 150);
      meter(0.33 + Math.min(1, S.pure / 10) * 0.33, 'تقدّم الرحلة', '#f6cf4a');
      ui('⚗️ الإنبيق', `💧 كحول نقي: <b>${ARN(S.pure)}</b> من ١٠ · ماء مختلط: ${ARN(S.impure)}`);
      if (S.pure >= 10 && S.phase === 'distill') {
        S.phase = 'between'; S.heat = false; AU.sfx('card');
        H.tip({
          a: 'جمعتَ كحولًا نقيًا! يُنسب إلى الرازي أنه من أوائل من استعملوه في الطب. والآن <b>امسح أدوات الطبيب</b> بقطنة الكحول لتعقيمها 🧴',
          b: 'ممتاز! الآن <b>عقّم الأدوات</b>: امسح بإصبعك فوق الجراثيم على أدوات الطبيب. الكحول يفسد بروتيناتها ويذيب غلاف الفيروسات.',
          c: 'كحول مقطّر نقي! وفي التعقيم الحديث يُخفَّف إلى نحو ٧٠٪ ليعمل أفضل. <b>امسح الأدوات</b> لتعقيمها.'
        }[age()], () => this.toTools());
      }
    },
    toTools() {
      const g = geo(), u = g.u;
      S.phase = 'tools'; G.germs = [];
      S.tools = [{ ic: '🔪', x: g.W * 0.28, y: g.HH * 0.38 }, { ic: '✂️', x: g.W * 0.72, y: g.HH * 0.38 }, { ic: '🥄', x: g.W * 0.28, y: g.HH * 0.64 }, { ic: '🪡', x: g.W * 0.72, y: g.HH * 0.64 }];
      S.tools.forEach(tl => { for (let i = 0; i < 5; i++) G.germs.push({ type: Math.random() < 0.5 ? 'virus' : 'bact', x: tl.x + rnd(-u * 0.12, u * 0.12), y: tl.y + rnd(-u * 0.08, u * 0.08), r: u * 0.03, dose: 0, p: rnd(0, 6), rot: rnd(-0.6, 0.6), dying: -1 }); });
      S.toolTotal = G.germs.length; S.killed = 0;
      ui('🧴 تعقيم الأدوات', '👆 امسح بإصبعك فوق الجراثيم على الأدوات');
    },
    drawTools(t, dt, g) {
      const cx = H.cx, u = g.u;
      cx.fillStyle = 'rgba(255,244,220,.85)'; rr(14, 150, g.W - 28, g.HH - 280, 20); cx.fill();
      S.tools.forEach(tl => { cx.font = `${Math.round(u * 0.2)}px sans-serif`; cx.textAlign = 'center'; cx.fillText(tl.ic, tl.x, tl.y + u * 0.07); });
      for (const gm of G.germs) {
        if (gm.dying >= 0) { gm.dying += dt; gm.alpha = 1 - gm.dying / 0.5; if (gm.dying > 0.5) gm.dead = true; }
        germSprite(gm, t, '#c8ffda');
      }
      G.germs = G.germs.filter(x => !x.dead);
      drawImg('razi', 46, g.HH - 90, 150);
      meter(0.66 + S.killed / S.toolTotal * 0.34, 'تقدّم الرحلة', '#f6cf4a');
      ui('🧴 تعقيم الأدوات', `🦠 بقي <b>${ARN(G.germs.filter(x => x.dying < 0).length)}</b> على الأدوات`);
      if (!G.germs.length && S.phase === 'tools') {
        S.phase = 'end'; H.unlockCard('alcohol');
        const ratio = S.pure / Math.max(1, S.pure + S.impure), stars = (S.wrong === 0 ? 1 : 0) + (ratio >= 0.8 ? 1 : 0) + 1;
        setTimeout(() => finish(stars, 'مستشفى بغداد جاهز! ⚗️', `اخترتَ موضع المستشفى ${S.wrong ? 'بعد ' + ARN(S.wrong) + ' محاولة' : 'من أول مرة'}، وقطّرتَ كحولًا نقاوته <b>${ARN(Math.round(ratio * 100))}٪</b>، وعقّمتَ أدوات الطبيب.<br>الرازي يشكرك يا حارس أترجّة!`), 500);
      }
    }
  };
  function wrapText(txt, x, y, maxW, lh) {
    const cx = H.cx, words = txt.split(' '), lines = []; let line = '';
    words.forEach(w => { const test = line ? line + ' ' + w : w; if (cx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test; });
    lines.push(line);
    lines.forEach((l, i) => cx.fillText(l, x, y + (i - (lines.length - 1) / 2) * lh));
  }

  const LV = { 3: L3, 4: L4, 5: L5 };
  H.LEVELS.forEach(Lv => { if (LV[Lv.n]) Lv.play = () => start(Lv.n); });

  window.__PX = { start, frame, _S: () => S };
})();
