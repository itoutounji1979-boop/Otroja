/* حرّاس أترجّة — المرحلة الأولى: «يد سَنَد قبل الطعام» */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const AU = window.HAudio;
  const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ================= المحتوى ================= */
  const AGES = {
    a: { lbl: '٧ – ٨', name: 'مستكشف صغير', speed: 0.72, split: 7.2, gap: 1.15 },
    b: { lbl: '٩ – ١٠', name: 'باحث نشيط', speed: 0.88, split: 5.8, gap: 1 },
    c: { lbl: '١١ – ١٢', name: 'عالِم المستقبل', speed: 1.0, split: 4.8, gap: 0.9 }
  };

  const CARDS = [
    { id: 'membrane', title: 'المعطف الدهني', img: 'virus', txt: {
      a: 'بعض الفيروسات تلبس معطفًا رقيقًا من الدهون. الصابون يحبّ الدهون فيفكّ هذا المعطف، فينهار الفيروس!',
      b: 'غلاف بعض الفيروسات طبقة من الدهون. لجزيء الصابون طرف يحبّ الماء وطرف يحبّ الدهون، فينغرس طرفه في الغلاف ويمزّقه.',
      c: 'الفيروسات المغلّفة محاطة بغشاء دهني أخذته من الخلية التي خرجت منها. الصابون والكحول يفكّكان هذا الغشاء، فتنفصل أجزاء الفيروس ويفقد قدرته على العدوى.' } },
    { id: 'spikes', title: 'مفاتيح البروتين', emoji: '🔑', txt: {
      a: 'الأشواك على الفيروس مثل مفاتيح صغيرة يفتح بها أبواب خلايانا. إذا سقطت المفاتيح، لا يستطيع الدخول!',
      b: 'الأشواك بروتينات يلتصق بها الفيروس بخلايا الجسم. حين يذوب الغلاف تسقط الأشواك، فلا يجد الفيروس ما يتمسّك به.',
      c: 'بروتينات السطح تطابق «أقفالًا» على أغشية خلايانا تسمّى المستقبِلات. عندما يتفكّك الغشاء الدهني تنفصل هذه البروتينات، فيضيع على الفيروس طريقه إلى الخلية.' } },
    { id: 'rna', title: 'كتيّب التعليمات', emoji: '🧬', txt: {
      a: 'في قلب الفيروس كتيّب تعليمات صغير. إذا انسكب وتبعثر، لا يستطيع الفيروس صنع نسخ جديدة منه.',
      b: 'داخل الفيروس مادة وراثية تحمل تعليمات صنع فيروسات جديدة. حين تنكشف في الخارج تتلف بسرعة.',
      c: 'المادة الوراثية (DNA أو RNA) هي وصفة الفيروس. ولا يستطيع الفيروس أن يتكاثر وحده، بل يحتاج خلية حيّة ينسخ نفسه داخلها، ولهذا يقف على حدود الحياة.' } },
    { id: 'wall', title: 'درع البكتيريا', img: 'bacterium', txt: {
      a: 'البكتيريا تلبس درعًا قويًّا، لذلك تحتاج إلى ضربات أكثر من الفيروس!',
      b: 'البكتيريا كائن حيّ من خلية واحدة، يحميها جدار خلوي صلب أقوى من غلاف الفيروس الدهني.',
      c: 'الجدار الخلوي يحفظ شكل البكتيريا ويحميها. بعض المطهّرات تخترقه، وبعض المضادات الحيوية تمنع بناءه. لكن سوء استعمالها يساعد على ظهور بكتيريا مقاومة.' } },
    { id: 'split', title: 'واحدة تصير اثنتين', emoji: '➗', txt: {
      a: 'البكتيريا تكبر ثم تنقسم إلى اثنتين! لذلك نتخلّص منها بسرعة قبل أن يكثر عددها.',
      b: 'تتكاثر البكتيريا بالانقسام: الواحدة تصير اثنتين، ثم أربعًا، ثم ثماني… وهكذا يتضاعف العدد بسرعة.',
      c: 'في الظروف المناسبة تنقسم بعض البكتيريا كل عشرين دقيقة تقريبًا. بعد سبع ساعات قد تصير الخلية الواحدة أكثر من مليوني خلية! هذا ما يسمّيه العلماء النموّ الأُسّي.' } },
    { id: 'scrub', title: 'سرّ العشرين ثانية', emoji: '🧼', txt: {
      a: 'افرك يديك بالصابون عشرين ثانية كاملة: بين الأصابع، وعلى ظهر اليد، وتحت الأظافر. ثم اغسلها بالماء.',
      b: 'الفرك هو السرّ: يحرّك الصابون إلى كل زاوية في اليد، ثم يحمل الماء الجراثيم بعيدًا. عشرون ثانية تكفي ليعمل الصابون.',
      c: 'الصابون يفكّ التصاق الجراثيم بطبقة الدهون على الجلد، ويحبسها مع الأوساخ في كرات مجهرية تسمّى المذيلات، فيجرفها الماء. الفرك عشرين ثانية يمنحه الوقت الكافي.' } },
    // بطاقات المهمّات القادمة
    { id: 'iodine', title: 'سرّ اليود', img: 'iodine', future: true },
    { id: 'uv', title: 'الضوء البنفسجي', img: 'uv', future: true },
    { id: 'lister', title: 'ليستر وعام ١٨٦٧', img: 'lister', future: true },
    { id: 'spore', title: 'الأبواغ المدرّعة', emoji: '🥚', future: true }
  ];

  const LEVELS = [
    { n: 1, title: 'يد سَنَد قبل الطعام', sub: 'الصابون ضد الفيروسات والبكتيريا', open: true },
    { n: 2, title: 'تحدّي اليدين', sub: '٣٢٠٠ جرثومة في انتظارك', badge: 'قريبًا' },
    { n: 3, title: 'جرح في البستان', sub: 'أداة جديدة: اليود', img: 'iodine', paid: true },
    { n: 4, title: 'غرفة الضوء البنفسجي', sub: 'أداة جديدة: الأشعة فوق البنفسجية', img: 'uv', paid: true },
    { n: 5, title: 'رحلة إلى عام ١٨٦٧', sub: 'ساعد ليستر في إنقاذ المرضى', img: 'lister', paid: true }
  ];

  const STORY = [
    { art: 'hand', txt: 'عاد <b>سَنَد</b> من اللعب في بستان أترجّة، وجلس ليأكل حبّة تين شهيّة.' },
    { art: 'micro', txt: 'يداه تبدوان نظيفتين… لكن تحت المجهر حكاية أخرى! مدينة كاملة من الجراثيم.' },
    { art: 'hero', txt: 'أنا <b>قطرة</b>، حارسة أترجّة! سأنزل معك إلى العالم الصغير جدًّا، وسلاحنا رغوة الصابون.' },
    { art: 'goal', txt: 'مهمّتنا: نوقف الجراثيم قبل أن تعبر <b>خطّ الأمان</b> وتصل إلى طعام سَنَد. هل أنت مستعد؟' }
  ];

  const TIPS = {
    w1: {
      a: 'هذه <b>فيروسات</b>! المسها لأرمي عليها رغوة الصابون. ثلاث ضربات وتتفكّك!',
      b: 'هذه <b>فيروسات مغلّفة</b>. المسها لأرمي عليها الصابون، وراقب: يذوب الغلاف الدهني، ثم تسقط الأشواك، ثم ينكشف ما في داخلها.',
      c: 'هذه <b>فيروسات مغلّفة</b>. المسها لترميها بالصابون، وراقب مراحل التحلّل الثلاث: الغشاء الدهني، ثم بروتينات السطح، ثم المادة الوراثية.'
    },
    w2: {
      a: 'انتبه! <b>البكتيريا</b> تلبس درعًا قويًّا، وإذا تركتها طويلًا تنقسم إلى اثنتين!',
      b: '<b>البكتيريا</b> كائنات حيّة لها جدار صلب، وتتكاثر بالانقسام. أسرِع قبل أن تتضاعف! راقب الحلقة حولها.',
      c: '<b>البكتيريا</b> خلايا حيّة بجدار خلوي متين، وتتضاعف بالانقسام الثنائي. حين تمتلئ الحلقة حولها تنقسم، وكل ضربة تؤخّر الانقسام.'
    },
    w3: {
      a: 'هجوم كبير! فيروسات وبكتيريا معًا. أنت تستطيع يا حارس!',
      b: 'موجة مختلطة! نصيحتي: ابدأ بالبكتيريا قبل أن تنقسم.',
      c: 'موجة مختلطة! فكّر كعالِم: الفيروس لا يتكاثر هنا وحده، أمّا البكتيريا فتتضاعف. فمن تبدأ به؟'
    },
    scrub: {
      a: 'الآن السرّ الكبير: <b>افرك</b> يديك بالصابون <b>٢٠ ثانية</b>! افرك الشاشة بإصبعك ذهابًا وإيابًا.',
      b: 'بقيت جراثيم عالقة بين الأصابع. الفرك <b>٢٠ ثانية</b> يمنح الصابون وقتًا ليعمل. افرك الشاشة بإصبعك!',
      c: 'الفرك يحرّك جزيئات الصابون فتحبس الجراثيم والدهون في كرات مجهرية يجرفها الماء. افرك الشاشة <b>٢٠ ثانية</b>!'
    }
  };

  const LABELS = {
    membrane: { a: 'ذاب المعطف!', b: 'ذاب الغلاف الدهني!', c: 'تفكّك الغشاء الدهني' },
    spikes: { a: 'سقطت المفاتيح!', b: 'سقطت أشواك البروتين!', c: 'انفصلت بروتينات السطح' },
    rna: { a: 'تبعثرت التعليمات!', b: 'انكشفت المادة الوراثية!', c: 'تبعثرت المادة الوراثية' },
    armor: { a: 'درع قوي! اضرب أكثر', b: 'جدار صلب!', c: 'جدار خلوي متين' },
    bdead: { a: 'انهارت البكتيريا!', b: 'تحطّم الجدار!', c: 'تحلّلت الخلية البكتيرية' },
    split: { a: 'انقسمت!', b: 'انقسام! صارت اثنتين', c: 'انقسام ثنائي' }
  };

  const QUIZ = {
    a: { q: 'ماذا يفعل الصابون بمعطف الفيروس الدهني؟', o: ['يذيبه ويفكّه', 'يجعله أقوى', 'يلوّنه بالأزرق'], ok: 0,
      why: 'الصابون يحبّ الدهون، فيفكّ المعطف وينهار الفيروس.' },
    b: { q: 'لماذا نفرك أيدينا بالصابون عشرين ثانية؟', o: ['حتى تجفّ اليدان', 'ليصل الصابون إلى كل مكان ويعمل', 'لأن الماء بارد'], ok: 1,
      why: 'الفرك ينشر الصابون بين الأصابع وتحت الأظافر ويمنحه وقتًا ليفكّ الجراثيم.' },
    c: { q: 'بكتيريا تنقسم كل ٢٠ دقيقة. كم خلية تصير الخلية الواحدة بعد ساعة؟', o: ['٣ خلايا', '٨ خلايا', '٦٠ خلية'], ok: 1,
      why: 'في الساعة ثلاث انقسامات: ١ ← ٢ ← ٤ ← ٨. كل انقسام يضاعف العدد.' }
  };

  /* ================= الحفظ ================= */
  const SAVE_KEY = 'hurras.save';
  let save = { age: null, cards: [], stars: {}, seenStory: false, best: {} };
  try { Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch (e) {}
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} };

  /* ================= الصور ================= */
  const IMG = {};
  ['hero', 'virus', 'virus_burst', 'bacterium', 'bg', 'iodine', 'uv', 'lister'].forEach(n => {
    const im = new Image(); im.src = 'assets/' + n + '.webp'; IMG[n] = im;
  });
  const ready = im => im.complete && im.naturalWidth > 0;

  /* ================= الشاشات ================= */
  let curScr = 'sTitle';
  function show(id) {
    document.querySelectorAll('.scr').forEach(s => s.classList.toggle('on', s.id === id));
    curScr = id;
  }
  function overlay(id, on) { $(id).classList.toggle('on', on); }

  function refreshTitle() {
    $('ageLbl').textContent = save.age ? AGES[save.age].lbl : '؟';
    const n = save.cards.length, tot = CARDS.filter(c => !c.future).length;
    $('albumCount').textContent = AR(n) + '/' + AR(tot);
    $('bMusic').classList.toggle('off', !AU.state.music);
    $('bSfx').classList.toggle('off', !AU.state.sfx);
    $('pMusic').classList.toggle('off', !AU.state.music);
    $('pSfx').classList.toggle('off', !AU.state.sfx);
    const silent = !AU.state.music && !AU.state.sfx;
    $('bMute').textContent = silent ? '🔇' : '🔊';
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) AU.sfx('click');
    const go = e.target.closest('[data-go]');
    if (go) { show(go.dataset.go); refreshTitle(); }
  });

  $('bMusic').onclick = () => { AU.toggle('music'); refreshTitle(); };
  $('bSfx').onclick = () => { AU.toggle('sfx'); refreshTitle(); };
  $('pMusic').onclick = () => { AU.toggle('music'); refreshTitle(); };
  $('pSfx').onclick = () => { AU.toggle('sfx'); refreshTitle(); };
  // زر كتم سريع أثناء اللعب: يطفئ الموسيقى والمؤثرات معًا أو يعيدهما
  $('bMute').onclick = () => { AU.setAll(!AU.state.music && !AU.state.sfx); refreshTitle(); };
  $('bPlay').onclick = () => {
    AU.init(); AU.music('menu');
    if (!save.age) { afterAge = 'map'; openAge(); } else openMap();
  };
  $('bAge').onclick = () => { AU.init(); AU.music('menu'); afterAge = 'title'; openAge(); };
  $('bAlbum').onclick = () => { AU.init(); AU.music('menu'); albumBack = 'sTitle'; openAlbum(); };

  let afterAge = 'map';
  function openAge() {
    document.querySelectorAll('.age').forEach(b => b.classList.toggle('sel', b.dataset.age === save.age));
    show('sAge');
  }
  document.querySelectorAll('.age').forEach(b => b.onclick = () => {
    save.age = b.dataset.age; persist();
    if (afterAge === 'map') openMap(); else { show('sTitle'); refreshTitle(); }
  });

  function openMap() {
    const box = $('levels'); box.innerHTML = '';
    LEVELS.forEach(L => {
      const el = document.createElement('button');
      el.className = 'lvl' + (L.open ? ' go' : ' lock');
      const stars = save.stars[L.n] || 0;
      el.innerHTML =
        (L.img ? `<img src="assets/${L.img}.webp" alt="">` : `<span class="n">${AR(L.n)}</span>`) +
        `<span class="t"><b>${L.title}</b><span>${L.sub}</span></span>` +
        (L.open ? `<span class="s">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>`
          : L.paid ? '<span class="badge gold">🔒 مع الفتح الكامل</span>' : `<span class="badge">${L.badge}</span>`);
      el.onclick = () => {
        if (L.open) startLevel();
        else toast(L.paid ? '🔒 تُفتح هذه المهمّة مع النسخة الكاملة قريبًا' : '⏳ هذه المهمّة قيد البناء');
      };
      box.appendChild(el);
    });
    show('sMap');
  }
  $('bUnlock').onclick = () => toast('💳 الشراء سيتوفّر في نسخة المتجر قريبًا');

  /* القصة */
  let storyI = 0;
  function startLevel() {
    if (!save.seenStory) { storyI = 0; renderStory(); show('sStory'); }
    else beginPlay();
  }
  function renderStory() {
    const s = STORY[storyI], art = $('storyArt');
    art.style.backgroundImage = s.art === 'hand' ? 'radial-gradient(circle at 50% 40%,#ffe9b0,#f2b25b 60%,#c9762c)' : 'url(assets/bg.webp)';
    art.innerHTML = {
      hand: '<div class="big pop">🖐️</div><div class="big pop" style="font-size:44px;inset:auto 14% 12% auto">🍐</div>',
      micro: '<img class="pop float" src="assets/virus.webp" style="width:34%;top:12%;right:8%"><img class="pop float" src="assets/bacterium.webp" style="width:17%;top:30%;left:12%;animation-delay:.6s"><img class="pop float" src="assets/virus.webp" style="width:20%;bottom:10%;right:40%;animation-delay:1.2s">',
      hero: '<img class="pop float" src="assets/hero.webp" style="width:52%;left:24%;top:8%">',
      goal: '<img class="pop float" src="assets/hero.webp" style="width:30%;left:6%;bottom:6%"><img class="pop float" src="assets/virus.webp" style="width:26%;right:10%;top:8%"><img class="pop float" src="assets/bacterium.webp" style="width:13%;right:44%;top:14%">'
    }[s.art];
    const t = $('storyTxt'); t.innerHTML = s.txt; t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
    $('bNext').textContent = storyI === STORY.length - 1 ? 'لننطلق!' : 'التالي ←';
  }
  $('bNext').onclick = () => { if (++storyI >= STORY.length) { save.seenStory = true; persist(); beginPlay(); } else renderStory(); };
  $('bSkip').onclick = () => { save.seenStory = true; persist(); beginPlay(); };

  /* الألبوم */
  let albumBack = 'sTitle';
  function cardArt(c) { return c.img ? `<img src="assets/${c.img}.webp" alt="">` : `<span class="e">${c.emoji}</span>`; }
  function openAlbum() {
    const box = $('album'); box.innerHTML = '';
    CARDS.forEach((c, i) => {
      const have = save.cards.includes(c.id);
      const el = document.createElement('button');
      el.className = 'acard' + (have ? '' : ' lock');
      el.innerHTML = `<span class="no">${AR(i + 1)}</span><div class="art">${cardArt(c)}</div><b>${have ? c.title : c.future ? 'في مهمّة قادمة' : '؟؟؟'}</b>`;
      el.onclick = () => have ? openCard(c.id) : toast(c.future ? '🔒 تجدها في مهمّة قادمة' : '🔬 العبها لتكتشف هذه البطاقة');
      box.appendChild(el);
    });
    show('sAlbum');
  }
  $('bAlbumBack').onclick = () => { if (albumBack === 'sResult') show('sResult'); else { show(albumBack); refreshTitle(); } };
  let cardReturn = null;
  function openCard(id, lvlAge) {
    const c = CARDS.find(x => x.id === id), ages = ['a', 'b', 'c'];
    let ag = lvlAge || save.age || 'b';
    const box = $('cardBig');
    const render = () => {
      box.innerHTML = `<div class="art">${cardArt(c)}</div><h3>${c.title}</h3><p>${c.txt[ag]}</p>
        <div class="row">${ages.map(k => `<button class="btn small ${k === ag ? '' : 'ghost'}" data-ag="${k}">${AGES[k].lbl}</button>`).join('')}</div>
        <span class="lvl-t">اقرأ البطاقة بمستوى أعمق أو أبسط</span>
        <button class="btn" id="bCardOk">رائع!</button>`;
      box.querySelectorAll('[data-ag]').forEach(b => b.onclick = () => { ag = b.dataset.ag; render(); });
      $('bCardOk').onclick = () => { overlay('sCard', false); };
    };
    render();
    overlay('sCard', true);
  }

  let toastT = 0;
  function toast(html, ms) {
    const t = $('toast'); t.innerHTML = html; t.hidden = false;
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, ms || 2400);
  }

  function unlockCard(id) {
    if (save.cards.includes(id)) return;
    save.cards.push(id); persist();
    G.newCards.push(id);
    const c = CARDS.find(x => x.id === id);
    AU.sfx('card');
    toast('🔬 بطاقة فضول جديدة: <b>' + c.title + '</b>', 2600);
  }

  /* ================= محرّك اللعب ================= */
  const cv = $('cv'), cx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize); resize();

  const G = {
    mode: 'menu', germs: [], projs: [], parts: [], texts: [], amb: [],
    hearts: 3, score: 0, wave: 0, queue: [], spawnT: 0, waveTotal: 0, waveKilled: 0,
    timeScale: 1, slowT: 0, shake: 0, combo: 0, lastKill: -9, t: 0, heroKick: 0, heroHurt: 0, heroAim: 0,
    firstStage: {}, newCards: [], tapped: false, scrubP: 0, scrubGerms: [], wash: -1, lastLeak: 0
  };

  const unit = () => Math.min(W, H);
  const heroSize = () => Math.min(H * 0.19, W * 0.34, 190);
  const heroPos = () => ({ x: W / 2, y: H - heroSize() * 0.55 - Math.max(8, H * 0.01) });
  const safeY = () => H - heroSize() * 1.18;

  // جزيئات خلفية مجهرية تعطي الحياة لكل الشاشات
  for (let i = 0; i < 26; i++) G.amb.push({ x: Math.random(), y: Math.random(), r: rnd(2, 9), s: rnd(0.005, 0.02), a: rnd(0.08, 0.3), p: rnd(0, 6) });
  const menuGerms = [];
  for (let i = 0; i < 5; i++) menuGerms.push({ type: i % 2 ? 'bact' : 'virus', x: Math.random(), y: Math.random(), s: rnd(0.4, 0.8), p: rnd(0, 6), sz: rnd(0.05, 0.09) });

  function beginPlay() {
    show('none');
    AU.music('play');
    Object.assign(G, {
      mode: 'play', germs: [], projs: [], parts: [], texts: [], hearts: 3, score: 0, wave: 0, queue: [],
      timeScale: 1, slowT: 0, shake: 0, combo: 0, lastKill: -9, firstStage: {}, newCards: [], tapped: false,
      scrubP: 0, scrubGerms: [], wash: -1, heroHurt: 0
    });
    $('hud').hidden = false;
    updHud();
    nextWave();
  }

  function waveDef(n) {
    const V = 'virus', B = 'bact';
    if (n === 1) return { name: 'الموجة ١: فيروسات متسلّلة', tip: 'w1', list: [V, V, V, V, V, V], gap: 2.1, sp: 1 };
    if (n === 2) return { name: 'الموجة ٢: بكتيريا تنقسم', tip: 'w2', list: [B, V, V, B, V, B, V], gap: 2.2, sp: 1 };
    if (n === 3) return { name: 'الموجة ٣: الهجوم الكبير', tip: 'w3', list: [V, B, V, V, B, V, V, B, V, B, V, V, B, V], gap: 1.35, sp: 1.15 };
    return null;
  }

  function nextWave() {
    G.wave++;
    const d = waveDef(G.wave);
    if (!d) return startScrub();
    G.cur = d;
    G.queue = d.list.slice(); G.waveTotal = d.list.length; G.waveKilled = 0; G.spawnT = 0.6;
    $('waveLbl').textContent = d.name;
    updHud();
    G.mode = 'tip';
    tip(TIPS[d.tip][save.age], () => { G.mode = 'play'; AU.sfx('wave'); });
  }

  function tip(html, done) {
    $('tipTxt').innerHTML = html;
    $('tip').hidden = false;
    $('bTip').onclick = () => { $('tip').hidden = true; done && done(); };
  }

  function spawn(type) {
    const u = unit(), age = AGES[save.age];
    const r = type === 'virus' ? u * 0.085 : u * 0.07;
    const g = {
      type, r, x: rnd(Math.max(r * 1.3, 64 + r), W - r * 1.3), y: -r * 1.4, vy: H * 0.068 * age.speed * G.cur.sp * (type === 'bact' ? 0.85 : 1),
      kv: 0, hp: type === 'virus' ? 3 : 4, stage: 0, t: 0, p: rnd(0, 6), flash: 0, dying: -1,
      split: type === 'bact' ? age.split : 0, splitAnim: -1, bubbles: [], rot: rnd(-0.3, 0.3)
    };
    if (type === 'bact') g.splitMax = g.split;
    G.germs.push(g);
    return g;
  }

  function updHud() {
    let h = '';
    for (let i = 0; i < 3; i++) h += `<span class="${i < G.hearts ? '' : 'lost'}">💧</span>`;
    $('hearts').innerHTML = h;
    $('score').textContent = AR(G.score);
    $('waveBar').style.width = (G.waveTotal ? (G.waveKilled / G.waveTotal) * 100 : 0) + '%';
  }

  /* ---- اللمس ---- */
  let ptr = null;
  cv.addEventListener('pointerdown', e => {
    AU.init();
    if (G.mode === 'scrub') { ptr = { x: e.clientX, y: e.clientY, t: performance.now() }; return; }
    if (G.mode !== 'play') return;
    G.tapped = true;
    let best = null, bd = 1e9;
    for (const g of G.germs) {
      if (g.dying >= 0 || g.dead) continue;
      const d = Math.hypot(g.x - e.clientX, g.y - e.clientY);
      if (d < g.r * 1.5 + 18 && d < bd) { bd = d; best = g; }
    }
    fire(e.clientX, e.clientY, best);
  });
  cv.addEventListener('pointermove', e => {
    if (G.mode !== 'scrub' || !ptr) return;
    const now = performance.now(), dt = (now - ptr.t) / 1000;
    const d = Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y);
    if (dt > 0 && d > 6) {
      scrubMove(e.clientX, e.clientY, d, dt);
      ptr = { x: e.clientX, y: e.clientY, t: now };
    }
  });
  const endPtr = () => { ptr = null; };
  cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);

  function fire(x, y, target) {
    const h = heroPos();
    const sx = h.x + (x > h.x ? 1 : -1) * heroSize() * 0.18, sy = h.y - heroSize() * 0.25;
    G.projs.push({ x: sx, y: sy, tx: x, ty: y, target, trail: [] });
    G.heroKick = 1; G.heroAim = clamp((x - h.x) / W, -0.5, 0.5);
    AU.sfx('shoot');
  }

  function hit(g, px, py) {
    if (g.dying >= 0 || g.dead) return;
    g.flash = 1;
    const age = save.age;
    if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) {}
    if (g.type === 'virus') {
      g.stage++; g.kv = -H * 0.35;
      if (g.stage === 1) {
        AU.sfx('membrane');
        for (let i = 0; i < 14; i++) part('fat', g.x + rnd(-g.r, g.r), g.y + rnd(-g.r, g.r) * 0.6, rnd(-60, 60), rnd(-80, 20), rnd(4, 10), 1.2);
        for (let i = 0; i < 10; i++) part('bub', g.x + rnd(-g.r, g.r), g.y + rnd(-g.r, g.r), rnd(-50, 50), rnd(-90, -20), rnd(4, 12), 1.1);
        for (let i = 0; i < 4; i++) g.bubbles.push({ a: rnd(0, 6.28), d: rnd(0.4, 0.9), s: rnd(0.12, 0.22) });
        label(g, 'membrane'); learn('membrane', g);
      } else if (g.stage === 2) {
        AU.sfx('spikes');
        for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.28 + rnd(-0.2, 0.2); part('spike', g.x + Math.cos(a) * g.r, g.y + Math.sin(a) * g.r, Math.cos(a) * rnd(120, 220), Math.sin(a) * rnd(120, 220) - 40, g.r * 0.32, 1.1); }
        label(g, 'spikes'); learn('spikes', g);
      } else {
        AU.sfx('burst');
        g.dying = 0;
        for (let i = 0; i < 6; i++) { const a = rnd(0, 6.28); part('rna', g.x, g.y, Math.cos(a) * rnd(60, 150), Math.sin(a) * rnd(60, 150), g.r * rnd(0.5, 0.8), 1.4); }
        for (let i = 0; i < 18; i++) { const a = rnd(0, 6.28); part('dot', g.x, g.y, Math.cos(a) * rnd(80, 260), Math.sin(a) * rnd(80, 260), rnd(2.5, 5), 0.9); }
        part('ring', g.x, g.y, 0, 0, g.r, 0.5);
        label(g, 'rna'); learn('rna', g);
        kill(g, 100);
      }
    } else {
      g.hp--; g.kv = -H * 0.22;
      g.split = Math.min(g.splitMax, g.split + 1.6);
      for (let i = 0; i < 6; i++) part('shard', px || g.x, py || g.y, rnd(-160, 160), rnd(-200, 40), rnd(4, 8), 0.9);
      if (g.hp > 0) {
        AU.sfx('armor'); G.shake = Math.max(G.shake, 4);
        if (!G.firstStage.armor) { label(g, 'armor'); G.firstStage.armor = 1; unlockCard('wall'); }
      } else {
        AU.sfx('crack'); AU.sfx('membrane');
        g.dying = 0;
        for (let i = 0; i < 16; i++) part('foam', g.x + rnd(-g.r, g.r), g.y + rnd(-g.r * 1.2, g.r * 1.2), rnd(-40, 40), rnd(-60, 10), rnd(6, 14), 1);
        for (let i = 0; i < 10; i++) part('shard', g.x, g.y, rnd(-220, 220), rnd(-260, 60), rnd(5, 10), 1.1);
        part('ring', g.x, g.y, 0, 0, g.r, 0.5);
        label(g, 'bdead');
        kill(g, 150);
      }
    }
    for (let i = 0; i < 5; i++) part('splash', px || g.x, py || g.y, rnd(-120, 120), rnd(-150, 30), rnd(3, 6), 0.5);
  }

  // تبطيء الزمن عند أول مرة يرى فيها اللاعب كل مرحلة، ليفهم ما حدث
  function learn(key, g) {
    if (!G.firstStage[key]) { G.firstStage[key] = 1; G.slowT = 0.9; unlockCard(key); }
  }

  function kill(g, pts) {
    const now = G.t;
    G.combo = now - G.lastKill < 1.6 ? G.combo + 1 : 1;
    G.lastKill = now;
    const p = pts * G.combo;
    G.score += p; G.waveKilled++;
    G.texts.push({ x: g.x, y: g.y - g.r * 1.3, txt: '+' + AR(p) + (G.combo > 1 ? '  ×' + AR(G.combo) : ''), life: 1, max: 1, col: '#f6cf4a', size: 20 });
    updHud();
  }

  function label(g, k) {
    G.texts.push({ x: clamp(g.x, 90, W - 90), y: g.y + g.r * 1.6, txt: LABELS[k][save.age], life: 1.5, max: 1.5, col: '#ffffff', size: 16, box: true });
  }

  function part(kind, x, y, vx, vy, size, life) {
    G.parts.push({ kind, x, y, vx, vy, size, life, max: life, rot: rnd(0, 6.28), vr: rnd(-6, 6), hue: rnd(0, 360) });
  }

  function leak(g) {
    g.dead = true;
    G.hearts--; G.heroHurt = 0.6; G.shake = 10;
    G.waveKilled++;
    AU.sfx('hurt');
    if (navigator.vibrate) try { navigator.vibrate([30, 40, 30]); } catch (e) {}
    G.texts.push({ x: g.x, y: safeY() - 20, txt: 'عبرت جرثومة!', life: 1.2, max: 1.2, col: '#ff8fa8', size: 18, box: true });
    updHud();
    const hs = $('hearts').children[G.hearts]; if (hs) hs.classList.add('hit');
    if (G.hearts <= 0) setTimeout(() => endLevel(false), 700);
  }

  /* ---- تحدّي الفرك ---- */
  function startScrub() {
    G.mode = 'tip';
    tip(TIPS.scrub[save.age], () => {
      G.mode = 'scrub'; G.scrubP = 0; G.lastSec = 0;
      G.scrubGerms = [];
      for (let i = 0; i < 26; i++) G.scrubGerms.push({ type: Math.random() < 0.6 ? 'virus' : 'bact', x: rnd(0.08, 0.92) * W, y: rnd(0.12, 0.72) * H, r: unit() * rnd(0.03, 0.05), a: 1, p: rnd(0, 6), rot: rnd(-1, 1) });
      $('scrub').hidden = false; updScrub();
    });
  }
  function scrubMove(x, y, d, dt) {
    const speed = d / dt;
    if (speed < 120) return;
    G.scrubP = Math.min(20, G.scrubP + Math.min(dt, 0.08) * (save.age === 'a' ? 1.35 : 1.15));
    if (Math.random() < 0.7) part('foam', x + rnd(-20, 20), y + rnd(-20, 20), rnd(-30, 30), rnd(-30, 10), rnd(8, 18), 1.4);
    if (Math.random() < 0.3) part('bub', x, y, rnd(-60, 60), rnd(-80, -20), rnd(4, 10), 1);
    for (const s of G.scrubGerms) if (Math.hypot(s.x - x, s.y - y) < 70) s.a = Math.max(0, s.a - 0.06);
    if (!G.rubT || performance.now() - G.rubT > 140) { AU.sfx('rub'); G.rubT = performance.now(); }
    updScrub();
  }
  function updScrub() {
    const s = Math.floor(G.scrubP);
    $('scrubNum').textContent = AR(s);
    $('scrubArc').style.strokeDashoffset = 276.5 * (1 - G.scrubP / 20);
    if (s > G.lastSec) { G.lastSec = s; AU.sfx('tick'); }
    if (G.scrubP >= 20 && G.mode === 'scrub') {
      G.mode = 'wash'; G.wash = 0;
      $('scrubTxt').textContent = 'رائع! الماء يجرف كل شيء…';
      unlockCard('scrub');
      AU.sfx('burst');
      setTimeout(() => { $('scrub').hidden = true; endLevel(true); }, 1800);
    }
  }

  /* ---- النهاية ---- */
  function endLevel(won) {
    if (G.mode === 'over') return;
    G.mode = 'over';
    $('hud').hidden = true; $('tip').hidden = true; $('scrub').hidden = true;
    const stars = won ? (G.hearts >= 3 ? 3 : G.hearts === 2 ? 2 : 1) : 0;
    if (won) { save.stars[1] = Math.max(save.stars[1] || 0, stars); save.best[1] = Math.max(save.best[1] || 0, G.score); persist(); }
    $('resTitle').textContent = won ? 'أنقذتَ طعام سَنَد! 🎉' : 'عبرت الجراثيم هذه المرّة';
    $('resScore').innerHTML = won
      ? `النقاط: <b>${AR(G.score)}</b> · أفضل نتيجة: ${AR(save.best[1])}`
      : 'لا بأس! حتى العلماء يعيدون التجربة. جرّب أن تبدأ بالبكتيريا قبل أن تنقسم.';
    const st = $('stars').children;
    for (let i = 0; i < 3; i++) { st[i].classList.remove('on'); if (i < stars) setTimeout(() => { st[i].classList.add('on'); AU.sfx('star', i); }, 500 + i * 380); }
    // سؤال المجهر
    const q = QUIZ[save.age];
    $('quiz').hidden = !won;
    if (won) {
      $('qTxt').textContent = q.q; $('qWhy').hidden = true;
      const box = $('qOpts'); box.innerHTML = '';
      q.o.forEach((o, i) => {
        const b = document.createElement('button'); b.textContent = o;
        b.onclick = () => {
          if (box.dataset.done) return; box.dataset.done = 1;
          b.classList.add(i === q.ok ? 'ok' : 'no'); box.children[q.ok].classList.add('ok');
          $('qWhy').textContent = (i === q.ok ? 'أحسنت! ' : 'قريب! ') + q.why; $('qWhy').hidden = false;
          if (i === q.ok) { AU.sfx('card'); G.score += 200; $('resScore').innerHTML = `النقاط: <b>${AR(G.score)}</b> (+٢٠٠ لسؤال المجهر)`; save.best[1] = Math.max(save.best[1] || 0, G.score); persist(); }
        };
        box.appendChild(b);
      });
      delete box.dataset.done;
    }
    const nc = $('newCards'); nc.innerHTML = '';
    G.newCards.forEach(id => {
      const c = CARDS.find(x => x.id === id), b = document.createElement('button');
      b.textContent = '🔬 ' + c.title; b.onclick = () => openCard(id); nc.appendChild(b);
    });
    setTimeout(() => {
      show('sResult'); AU.sfx(won ? 'win' : 'lose'); AU.music('menu');
    }, won ? 200 : 300);
  }
  $('bResAgain').onclick = () => beginPlay();
  $('bResMap').onclick = () => { G.mode = 'menu'; openMap(); };

  /* ---- إيقاف مؤقت ---- */
  let pausedFrom = null;
  function pause() {
    if (!['play', 'tip', 'scrub'].includes(G.mode)) return;
    pausedFrom = G.mode; G.mode = 'paused'; show('sPause');
  }
  $('bPause').onclick = pause;
  $('bResume').onclick = () => { show('none'); G.mode = pausedFrom; };
  $('bRestart').onclick = () => { $('tip').hidden = true; $('scrub').hidden = true; beginPlay(); };
  $('bQuit').onclick = () => { G.mode = 'menu'; $('hud').hidden = true; $('tip').hidden = true; $('scrub').hidden = true; AU.music('menu'); openMap(); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pause(); AU.suspend(); } else AU.resume();
  });

  /* ================= الرسم ================= */
  function drawBg(t) {
    const im = IMG.bg;
    if (ready(im)) {
      const s = Math.max(W / im.naturalWidth, H / im.naturalHeight) * 1.08;
      const iw = im.naturalWidth * s, ih = im.naturalHeight * s;
      const ox = (W - iw) / 2 + Math.sin(t * 0.07) * W * 0.02, oy = (H - ih) / 2 + Math.cos(t * 0.05) * H * 0.015;
      cx.drawImage(im, ox, oy, iw, ih);
    } else { cx.fillStyle = '#06324a'; cx.fillRect(0, 0, W, H); }
    const gr = cx.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, 'rgba(2,20,40,.35)'); gr.addColorStop(0.6, 'rgba(2,20,40,0)'); gr.addColorStop(1, 'rgba(2,20,40,.45)');
    cx.fillStyle = gr; cx.fillRect(0, 0, W, H);
    for (const a of G.amb) {
      a.y -= a.s * 0.016; if (a.y < -0.05) { a.y = 1.05; a.x = Math.random(); }
      const x = (a.x + Math.sin(t * 0.3 + a.p) * 0.01) * W, y = a.y * H;
      cx.globalAlpha = a.a; cx.fillStyle = '#bff3ff';
      cx.beginPath(); cx.arc(x, y, a.r, 0, 6.28); cx.fill();
    }
    cx.globalAlpha = 1;
  }

  function drawVirus(g, t) {
    const im = IMG.virus; if (!ready(im)) return;
    const S = g.r * 2.6, w = S, h = S * im.naturalHeight / im.naturalWidth;
    const wob = Math.sin(t * 3 + g.p) * 0.06;
    cx.save(); cx.translate(g.x, g.y); cx.rotate(g.rot + wob);
    const sq = 1 + Math.sin(t * 5 + g.p) * 0.03 + g.flash * 0.12;
    cx.scale(sq, 2 - sq);
    if (g.stage >= 2) { // سقطت الأشواك: نقصّ الجسم الكروي فقط
      cx.beginPath(); cx.arc(0, h * 0.027, w * 0.36, 0, 6.28); cx.clip();
    }
    cx.drawImage(im, -w / 2, -h / 2, w, h);
    if (g.flash > 0) { cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = g.flash * 0.6; cx.drawImage(im, -w / 2, -h / 2, w, h); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; }
    cx.restore();
    cx.save(); cx.translate(g.x, g.y);
    if (g.stage === 0) { // الغلاف الدهني اللامع
      cx.lineWidth = g.r * 0.16;
      cx.strokeStyle = 'rgba(255,214,110,.38)';
      cx.beginPath(); cx.arc(0, 0, g.r * 1.02, 0, 6.28); cx.stroke();
      cx.lineWidth = g.r * 0.06; cx.strokeStyle = 'rgba(255,250,220,.6)';
      cx.beginPath(); cx.arc(0, 0, g.r * 1.02, -2.6 + Math.sin(t + g.p) * 0.2, -1.6 + Math.sin(t + g.p) * 0.2); cx.stroke();
    }
    for (const b of g.bubbles) { // فقاعات صابون عالقة
      const bx = Math.cos(b.a + t * 0.4) * g.r * b.d, by = Math.sin(b.a + t * 0.4) * g.r * b.d;
      bubble(bx, by, g.r * b.s, 0.85);
    }
    if (g.stage >= 2) { // تشقّقات
      cx.strokeStyle = 'rgba(20,40,90,.55)'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(-g.r * 0.2, -g.r * 0.7); cx.lineTo(0, -g.r * 0.35); cx.lineTo(-g.r * 0.12, -g.r * 0.1);
      cx.moveTo(g.r * 0.5, g.r * 0.3); cx.lineTo(g.r * 0.25, g.r * 0.45); cx.lineTo(g.r * 0.3, g.r * 0.7); cx.stroke();
    }
    cx.restore();
  }

  function drawBurst(g) {
    const im = IMG.virus_burst; if (!ready(im)) return;
    const k = g.dying / 0.55, S = g.r * 2.8 * (1 + k * 0.4);
    cx.globalAlpha = clamp(1 - k, 0, 1);
    cx.drawImage(im, g.x - S / 2, g.y - S / 2, S, S * im.naturalHeight / im.naturalWidth);
    cx.globalAlpha = 1;
  }

  function drawBact(g, t) {
    const im = IMG.bacterium; if (!ready(im)) return;
    const h = g.r * 2.5, w = h * im.naturalWidth / im.naturalHeight;
    cx.save(); cx.translate(g.x, g.y); cx.rotate(g.rot + Math.sin(t * 2 + g.p) * 0.08);
    let sx = 1, sy = 1;
    if (g.splitAnim >= 0) { const k = g.splitAnim / 0.6; sx = 1 + Math.sin(k * Math.PI) * 0.5; sy = 1 - Math.sin(k * Math.PI) * 0.15; }
    else if (g.split < 1.2) { const k = Math.sin(t * 18) * 0.04 * (1.2 - g.split); sx += k; sy -= k; }
    if (g.dying >= 0) { const k = g.dying / 0.55; sx *= 1 + k * 0.3; sy *= 1 - k * 0.6; cx.globalAlpha = 1 - k; }
    sx += g.flash * 0.1; sy -= g.flash * 0.1;
    cx.scale(sx, sy);
    cx.drawImage(im, -w / 2, -h / 2, w, h);
    if (g.flash > 0) { cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = g.flash * 0.5; cx.drawImage(im, -w / 2, -h / 2, w, h); cx.globalCompositeOperation = 'source-over'; }
    cx.globalAlpha = 1;
    // تشقّقات الدرع
    const cracks = 4 - g.hp;
    cx.strokeStyle = 'rgba(70,25,0,.75)'; cx.lineWidth = 2.2; cx.lineJoin = 'round';
    const C = [[-0.3, -0.6, 0.05, -0.4, -0.1, -0.2], [0.3, 0.1, 0.05, 0.25, 0.2, 0.45], [-0.25, 0.4, -0.05, 0.55, -0.2, 0.75]];
    for (let i = 0; i < Math.min(cracks, 3); i++) {
      const c = C[i]; cx.beginPath(); cx.moveTo(c[0] * w, c[1] * h / 1.4); cx.lineTo(c[2] * w, c[3] * h / 1.4); cx.lineTo(c[4] * w, c[5] * h / 1.4); cx.stroke();
    }
    cx.restore();
    // حلقة الانقسام
    if (g.dying < 0 && g.splitMax) {
      const k = 1 - g.split / g.splitMax;
      cx.lineWidth = 4; cx.lineCap = 'round';
      cx.strokeStyle = 'rgba(255,255,255,.15)';
      cx.beginPath(); cx.arc(g.x, g.y, g.r * 1.45, 0, 6.28); cx.stroke();
      cx.strokeStyle = k > 0.75 ? `rgba(255,111,145,${0.6 + Math.sin(t * 14) * 0.4})` : 'rgba(255,190,90,.85)';
      cx.beginPath(); cx.arc(g.x, g.y, g.r * 1.45, -Math.PI / 2, -Math.PI / 2 + k * 6.283); cx.stroke();
    }
  }

  function bubble(x, y, r, a) {
    cx.globalAlpha = a;
    const gr = cx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(0.7, 'rgba(190,240,255,.12)'); gr.addColorStop(1, 'rgba(220,250,255,.7)');
    cx.fillStyle = gr; cx.beginPath(); cx.arc(x, y, r, 0, 6.28); cx.fill();
    cx.globalAlpha = 1;
  }

  function drawParts(dt) {
    for (const p of G.parts) {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      const k = clamp(p.life / p.max, 0, 1);
      switch (p.kind) {
        case 'fat': p.vy += 260 * dt; cx.globalAlpha = k; cx.fillStyle = '#ffd36b';
          cx.beginPath(); cx.ellipse(p.x, p.y, p.size, p.size * 0.75, p.rot, 0, 6.28); cx.fill();
          cx.fillStyle = 'rgba(255,255,230,.8)'; cx.beginPath(); cx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.25, 0, 6.28); cx.fill(); break;
        case 'bub': p.vx *= 0.98; bubble(p.x, p.y, p.size * (1.2 - k * 0.2), k); break;
        case 'foam': p.vy *= 0.97; cx.globalAlpha = k * 0.85; cx.fillStyle = '#f4fdff';
          cx.beginPath(); cx.arc(p.x, p.y, p.size * (1.4 - k * 0.4), 0, 6.28); cx.fill(); break;
        case 'spike': p.vy += 300 * dt; p.vx *= 0.99; cx.globalAlpha = k; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
          cx.strokeStyle = '#f08a28'; cx.lineWidth = p.size * 0.35; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(p.size, 0); cx.stroke();
          cx.fillStyle = '#ffa547'; cx.beginPath(); cx.arc(p.size, 0, p.size * 0.33, 0, 6.28); cx.fill(); cx.restore(); break;
        case 'rna': p.vx *= 0.96; p.vy *= 0.96; cx.globalAlpha = k; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot * 0.3);
          cx.strokeStyle = `hsl(${p.hue},85%,65%)`; cx.lineWidth = 3; cx.lineCap = 'round'; cx.beginPath();
          for (let i = 0; i <= 12; i++) { const xx = (i / 12 - 0.5) * p.size * 2, yy = Math.sin(i * 1.1 + G.t * 6) * p.size * 0.18; i ? cx.lineTo(xx, yy) : cx.moveTo(xx, yy); }
          cx.stroke(); cx.restore(); break;
        case 'dot': p.vy += 200 * dt; p.vx *= 0.97; cx.globalAlpha = k; cx.fillStyle = `hsl(${p.hue},90%,65%)`;
          cx.beginPath(); cx.arc(p.x, p.y, p.size, 0, 6.28); cx.fill(); break;
        case 'shard': p.vy += 420 * dt; cx.globalAlpha = k; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
          cx.fillStyle = '#e48a2e'; cx.beginPath(); cx.moveTo(-p.size, -p.size * 0.5); cx.lineTo(p.size, -p.size * 0.2); cx.lineTo(0, p.size * 0.7); cx.closePath(); cx.fill(); cx.restore(); break;
        case 'splash': p.vy += 400 * dt; cx.globalAlpha = k; cx.fillStyle = '#9feaff'; cx.beginPath(); cx.arc(p.x, p.y, p.size, 0, 6.28); cx.fill(); break;
        case 'ring': cx.globalAlpha = k * 0.8; cx.strokeStyle = '#dff9ff'; cx.lineWidth = 3 * k + 1;
          cx.beginPath(); cx.arc(p.x, p.y, p.size * (2.4 - k * 1.4), 0, 6.28); cx.stroke(); break;
      }
    }
    cx.globalAlpha = 1;
    G.parts = G.parts.filter(p => p.life > 0);
    if (G.parts.length > 500) G.parts.splice(0, G.parts.length - 500);
  }

  function drawHero(t, dt) {
    const im = IMG.hero; if (!ready(im)) return;
    const s = heroSize(), p = heroPos();
    G.heroKick = Math.max(0, G.heroKick - dt * 5);
    G.heroHurt = Math.max(0, G.heroHurt - dt);
    const bob = Math.sin(t * 2.4) * s * 0.03;
    const sq = 1 - G.heroKick * 0.12;
    const shake = G.heroHurt > 0 ? Math.sin(t * 60) * 6 * G.heroHurt : 0;
    // هالة
    const gl = cx.createRadialGradient(p.x, p.y, s * 0.1, p.x, p.y, s * 0.8);
    gl.addColorStop(0, G.heroHurt > 0 ? 'rgba(255,110,140,.35)' : 'rgba(80,220,255,.32)'); gl.addColorStop(1, 'rgba(80,220,255,0)');
    cx.fillStyle = gl; cx.beginPath(); cx.arc(p.x, p.y, s * 0.8, 0, 6.28); cx.fill();
    cx.save(); cx.translate(p.x + shake, p.y + bob + s * 0.5);
    cx.rotate(G.heroAim * 0.5 * G.heroKick);
    if (G.heroAim < 0) cx.scale(-1, 1);
    cx.scale(1 + (1 - sq) * 0.6, sq);
    const w = s * im.naturalWidth / im.naturalHeight;
    cx.drawImage(im, -w / 2, -s, w, s);
    cx.restore();
  }

  function drawSafeLine(t) {
    const y = safeY();
    cx.save();
    cx.setLineDash([10, 10]); cx.lineDashOffset = -t * 30;
    cx.strokeStyle = 'rgba(246,207,74,.45)'; cx.lineWidth = 2;
    cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke();
    cx.setLineDash([]);
    cx.font = '600 12px Alexandria, sans-serif'; cx.textAlign = 'right'; cx.direction = 'rtl';
    cx.fillStyle = 'rgba(246,207,74,.75)';
    cx.fillText('خطّ الأمان: طعام سَنَد 🍐', W - 12, y + 18);
    cx.restore();
  }

  function drawProjs(dt) {
    for (const pr of G.projs) {
      if (pr.target && !pr.target.dead && pr.target.dying < 0) { pr.tx = pr.target.x; pr.ty = pr.target.y; }
      const dx = pr.tx - pr.x, dy = pr.ty - pr.y, d = Math.hypot(dx, dy), sp = 1500 * dt;
      pr.trail.push({ x: pr.x, y: pr.y }); if (pr.trail.length > 8) pr.trail.shift();
      if (d <= sp + 4) {
        pr.done = true;
        if (pr.target && !pr.target.dead && pr.target.dying < 0) hit(pr.target, pr.tx, pr.ty);
        else { for (let i = 0; i < 6; i++) part('splash', pr.tx, pr.ty, rnd(-120, 120), rnd(-150, 30), rnd(3, 6), 0.5); part('bub', pr.tx, pr.ty, 0, -40, 8, 0.8); }
      } else { pr.x += dx / d * sp; pr.y += dy / d * sp; }
      pr.trail.forEach((q, i) => { cx.globalAlpha = i / pr.trail.length * 0.5; cx.fillStyle = '#bff3ff'; cx.beginPath(); cx.arc(q.x, q.y, 3 + i * 0.6, 0, 6.28); cx.fill(); });
      cx.globalAlpha = 1;
      const a = Math.atan2(dy, dx);
      cx.save(); cx.translate(pr.x, pr.y); cx.rotate(a + Math.PI / 2);
      const gr = cx.createRadialGradient(-2, 2, 1, 0, 0, 11);
      gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.4, '#8fe9ff'); gr.addColorStop(1, '#17a6d8');
      cx.fillStyle = gr; cx.beginPath(); cx.moveTo(0, -14); cx.quadraticCurveTo(10, 2, 0, 10); cx.quadraticCurveTo(-10, 2, 0, -14); cx.fill();
      cx.restore();
    }
    G.projs = G.projs.filter(p => !p.done);
  }

  function drawTexts(dt) {
    cx.textAlign = 'center'; cx.direction = 'rtl';
    for (const tx of G.texts) {
      tx.life -= dt; tx.y -= 28 * dt;
      const k = clamp(tx.life / tx.max, 0, 1), sc = 1 + Math.max(0, (k - 0.85)) * 3;
      cx.globalAlpha = Math.min(1, k * 2);
      cx.font = `800 ${Math.round(tx.size * sc)}px Alexandria, sans-serif`;
      const half = cx.measureText(tx.txt).width / 2 + 16;
      tx.x = clamp(tx.x, half, W - half);
      if (tx.box) {
        const w = cx.measureText(tx.txt).width + 22;
        cx.fillStyle = 'rgba(4,38,58,.78)';
        roundRect(tx.x - w / 2, tx.y - tx.size * 0.95, w, tx.size * 1.6, 12); cx.fill();
      }
      cx.fillStyle = tx.col;
      cx.fillText(tx.txt, tx.x, tx.y);
    }
    cx.globalAlpha = 1;
    G.texts = G.texts.filter(t => t.life > 0);
  }
  function roundRect(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }

  function drawMenuGerms(t) {
    for (const m of menuGerms) {
      m.y -= 0.012 * m.s * 0.016 * 60 / 60; if (m.y < -0.15) { m.y = 1.15; m.x = Math.random(); }
      const im = m.type === 'virus' ? IMG.virus : IMG.bacterium; if (!ready(im)) continue;
      const S = unit() * m.sz * 2.4, w = m.type === 'virus' ? S : S * im.naturalWidth / im.naturalHeight, h = m.type === 'virus' ? S : S;
      cx.save(); cx.globalAlpha = 0.55; cx.translate((m.x + Math.sin(t * 0.4 + m.p) * 0.03) * W, m.y * H); cx.rotate(Math.sin(t * 0.6 + m.p) * 0.3);
      cx.drawImage(im, -w / 2, -h / 2, w, h); cx.restore();
    }
  }

  function drawHint(t) {
    if (G.tapped || G.wave !== 1 || G.mode !== 'play') return;
    const g = G.germs.find(x => x.dying < 0 && x.y > x.r);
    if (!g) return;
    const k = (t * 1.6) % 1;
    cx.globalAlpha = 1 - k; cx.strokeStyle = '#fff'; cx.lineWidth = 3;
    cx.beginPath(); cx.arc(g.x, g.y, g.r * (0.6 + k * 0.9), 0, 6.28); cx.stroke();
    cx.globalAlpha = 1;
    cx.font = `${Math.round(g.r * 0.9)}px sans-serif`; cx.textAlign = 'center';
    cx.fillText('👆', g.x + g.r * 0.4, g.y + g.r * 1.2 + Math.sin(t * 8) * 6);
  }

  /* ================= الحلقة الرئيسية ================= */
  let last = performance.now();
  function frame(now) {
    let dt = Math.min(0.05, (now - last) / 1000); last = now;
    G.t += dt;
    const t = G.t;
    if (G.slowT > 0) { G.slowT -= dt; G.timeScale = 0.28; } else G.timeScale = Math.min(1, G.timeScale + dt * 3);
    const gdt = G.mode === 'paused' ? 0 : dt * G.timeScale;

    cx.save();
    if (G.shake > 0) { cx.translate(rnd(-G.shake, G.shake), rnd(-G.shake, G.shake)); G.shake = Math.max(0, G.shake - dt * 30); }
    drawBg(t);
    const inGame = ['play', 'tip', 'paused', 'scrub', 'wash', 'over', 'between'].includes(G.mode);
    if (!inGame) drawMenuGerms(t);
    else {
      if (G.mode === 'play') update(gdt);
      if (G.mode !== 'scrub' && G.mode !== 'wash') drawSafeLine(t);
      for (const g of G.germs) {
        g.flash = Math.max(0, g.flash - gdt * 4);
        if (g.type === 'virus') { if (g.dying >= 0) drawBurst(g); else drawVirus(g, t); }
        else drawBact(g, t);
      }
      if (G.mode === 'scrub' || G.mode === 'wash') drawScrub(t, gdt);
      drawProjs(gdt);
      drawParts(gdt);
      drawHero(t, gdt);
      drawTexts(gdt);
      drawHint(t);
    }
    cx.restore();
    requestAnimationFrame(frame);
  }

  function update(dt) {
    // الظهور
    if (G.queue.length) {
      G.spawnT -= dt;
      if (G.spawnT <= 0) { spawn(G.queue.shift()); G.spawnT = G.cur.gap * AGES[save.age].gap * rnd(0.8, 1.2); }
    }
    const sy = safeY();
    for (const g of G.germs) {
      g.t += dt;
      if (g.dying >= 0) { g.dying += dt; if (g.dying > 0.55) g.dead = true; continue; }
      g.kv *= Math.pow(0.02, dt);
      g.y += (g.vy + g.kv) * dt;
      g.x += Math.sin(g.t * 1.3 + g.p) * 22 * dt;
      g.x = clamp(g.x, g.y < 90 ? 60 + g.r : g.r, W - g.r);
      if (g.type === 'bact') {
        if (g.splitAnim >= 0) {
          g.splitAnim += dt;
          if (g.splitAnim > 0.6) {
            g.splitAnim = -1; g.split = g.splitMax;
            const off = g.r * 1.3, c = Object.assign({}, g, { bubbles: [], hp: 4, x: clamp(g.x + off, g.r, W - g.r), p: rnd(0, 6), rot: rnd(-0.3, 0.3), flash: 1, kv: 0 });
            g.x = clamp(g.x - off, g.r, W - g.r); g.flash = 1;
            G.germs.push(c); G.waveTotal++;
            AU.sfx('split');
            for (let i = 0; i < 8; i++) part('bub', c.x, c.y, rnd(-60, 60), rnd(-60, 20), rnd(3, 7), 0.8);
            label(g, 'split');
            if (!G.firstStage.split) { G.firstStage.split = 1; unlockCard('split'); }
            updHud();
          }
        } else {
          g.split -= dt;
          const alive = G.germs.filter(x => x.type === 'bact' && !x.dead && x.dying < 0).length;
          if (g.split <= 0 && alive < 9 && g.y < sy - g.r * 2) g.splitAnim = 0;
          else if (g.split <= 0) g.split = 0.5;
        }
      }
      if (g.y - g.r * 0.3 > sy) leak(g);
    }
    G.germs = G.germs.filter(g => !g.dead);
    if (!G.queue.length && !G.germs.length && G.mode === 'play' && G.hearts > 0) {
      G.mode = 'between';
      setTimeout(() => { if (G.mode === 'between') nextWave(); }, 900);
    }
  }

  function drawScrub(t, dt) {
    for (const s of G.scrubGerms) {
      if (s.a <= 0) continue;
      const im = s.type === 'virus' ? IMG.virus : IMG.bacterium; if (!ready(im)) continue;
      const fade = G.mode === 'wash' ? Math.max(0, 1 - G.wash * 1.5) : 1;
      const a = Math.min(s.a, 1 - G.scrubP / 22) * fade; if (a <= 0) continue;
      const S = s.r * 2.4, w = s.type === 'virus' ? S : S * im.naturalWidth / im.naturalHeight;
      cx.save(); cx.globalAlpha = a; cx.translate(s.x + Math.sin(t * 2 + s.p) * 3, s.y); cx.rotate(s.rot);
      cx.drawImage(im, -w / 2, -S / 2, w, S); cx.restore();
    }
    cx.globalAlpha = 1;
    if (G.mode === 'wash') { // موجة الماء تجرف كل شيء
      G.wash += dt;
      const y = -H * 0.3 + G.wash * H * 1.1;
      const gr = cx.createLinearGradient(0, y - H * 0.5, 0, y);
      gr.addColorStop(0, 'rgba(120,230,255,0)'); gr.addColorStop(0.8, 'rgba(120,230,255,.45)'); gr.addColorStop(1, 'rgba(230,252,255,.9)');
      cx.fillStyle = gr; cx.fillRect(0, y - H * 0.5, W, H * 0.5);
      if (Math.random() < 0.6) part('bub', rnd(0, W), y, rnd(-30, 30), rnd(40, 120), rnd(4, 12), 1);
    }
  }

  requestAnimationFrame(frame);

  /* ================= التثبيت ودون اتصال ================= */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('bInstall').hidden = false; });
  $('bInstall').onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('bInstall').hidden = true; };
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

  refreshTitle();
  window.__G = G;
})();
