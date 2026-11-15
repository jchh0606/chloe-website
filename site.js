/* Draws the page from content.js, runs the About pop-up and the owner's text editor.
   You normally don't need to edit this file. */
(function () {
  const S = window.SITE;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const get = p => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), S);
  const setPath = (p, v) => { const ks = p.split('.'), last = ks.pop(); const t = ks.reduce((o, k) => (o == null ? undefined : o[k]), S); if (t != null) t[last] = v; };
  const editing = () => document.body.classList.contains('editing');
  const showTodo = () => S.showTodo || editing();
  const isGroup = t => /group/i.test(t);
  const joinList = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];

  // T(path): the text at that path, marked so the owner can edit it in place
  const T = p => `<span data-k="${p}">${esc(get(p))}</span>`;
  // empty field → a "To add" box (owner can type straight into it)
  const todo = (p, what) => showTodo() ? `<div class="todo"><b>To add:</b> <span data-k="${p}" data-ph="${esc(what)}"></span></div>` : '';
  const field = (label, p, what, cls = '') =>
    get(p) ? `<div class="field ${cls}"><h4>${esc(label)}</h4><p>${T(p)}</p></div>` : todo(p, what || label);

  /* ---------------- section bodies ---------------- */
  function photoFigure(cls) {
    const P = S.about.photo;
    return `<figure class="photo ${cls || ''}">
      <img src="${esc(P.small || P.src)}" srcset="${esc(P.small || P.src)} 720w, ${esc(P.src)} 1080w" sizes="(max-width: 820px) 92vw, 420px"
           width="1080" height="1350" alt="${esc(P.alt)}" loading="lazy">
      ${P.caption ? `<figcaption>${T('about.photo.caption')}</figcaption>` : ''}
    </figure>`;
  }
  const interestsList = () => `<ul class="interests">${S.about.interests.map((_, i) => `<li>${T('about.interests.' + i)}</li>`).join('')}</ul>`;
  function watchButton() {
    const V = S.about.video || {};
    if (!V.src) return null;
    return `<button type="button" class="about-watch" data-open-about="0" aria-label="Open About and watch ${esc(V.label || 'Meet Chloe')}">
        ${V.poster ? `<img src="${esc(V.poster)}" alt="" loading="lazy">` : ''}
        <span class="vid-start" aria-hidden="true"><span class="play-ico"></span><span class="vid-start-text"><b>${esc(V.label || 'Meet Chloe')}</b></span></span>
      </button>`;
  }
  function aboutBody() {
    const A = S.about, vid = watchButton();
    const media = vid || (showTodo()
      ? `<div class="vid-todo"><p><b>To add:</b> your intro video (MP4, under 20 MB).</p></div>`
      : photoFigure('photo-intro'));
    const photoInStory = vid || showTodo();
    return `<div class="about-top">
        <div class="about-media">${media}</div>
        <div class="about-intro">
          <p class="about-name">${T('hero.name')}</p>
          <p class="about-lead">${T('about.paragraphs.0')}</p>
          <h3 class="small-head">${T('about.interestsTitle')}</h3>
          ${interestsList()}
        </div>
      </div>
      <div class="about-story${photoInStory ? '' : ' no-photo'}">
        ${photoInStory ? photoFigure() : ''}
        <div class="story-text">
          <h3>${T('about.storyTitle')}</h3>
          ${A.paragraphs.slice(1).map((_, i) => `<p>${T('about.paragraphs.' + (i + 1))}</p>`).join('')}
          <dl class="facts">${A.facts.map((_, i) => `<dt>${T(`about.facts.${i}.label`)}</dt><dd>${T(`about.facts.${i}.value`)}</dd>`).join('')}</dl>
          <nav class="about-links" aria-label="Continue">
            <a class="text-link" href="#experience">See my experience</a>
            <a class="text-link" href="#projects">See my projects</a>
            <a class="text-link" href="#top">Back to the rink</a>
          </nav>
        </div>
      </div>
      ${schoolsRow()}`;
  }
  /* =====================================================================
     EXPERIENCE — featured story cards + archive. All text comes from S.experience in content.js.
     ===================================================================== */
  let xuid = 0;
  const XI = () => (S.experience.items || []).map((x, i) => [x, i]).filter(([x]) => x.published !== false);
  const XF = () => XI().filter(([x]) => x.featured);
  const XA = () => XI().filter(([x]) => !x.featured);
  const groupLabel = g => ((S.experience.filters || []).find(f => f.id === g) || {}).label || '';
  const xHas = v => Array.isArray(v) ? v.filter(Boolean).length > 0 : !!(v && String(v).trim());
  const xChips = (path, arr) => xHas(arr) ? `<ul class="pd-chips">${arr.map((_, k) => `<li>${T(path + '.' + k)}</li>`).join('')}</ul>` : '';
  const xMetrics = (path, arr) => xHas(arr) ? `<dl class="xm">${arr.map((m, k) => `<div class="xm-i"><dt>${T(`${path}.${k}.value`)}</dt><dd>${T(`${path}.${k}.label`)}</dd></div>`).join('')}</dl>` : '';
  function xResp(path, arr) {                                    // plain bullets, or grouped bullets with small headings
    if (!xHas(arr)) return '';
    if (typeof arr[0] === 'object') return `<div class="xr-groups">${arr.map((g, k) => `<div class="xr-g"><h5>${T(`${path}.${k}.heading`)}</h5>
      <ul class="pd-list">${(g.items || []).map((_, z) => `<li>${T(`${path}.${k}.items.${z}`)}</li>`).join('')}</ul></div>`).join('')}</div>`;
    return `<ul class="pd-list">${arr.map((_, k) => `<li>${T(path + '.' + k)}</li>`).join('')}</ul>`;
  }
  const xGallery = g => { g = (g || []).filter(p => p && p.src); return g.length ? `<div class="sp-photos">${g.map(p => `<figure class="pd-fig"><img src="${esc(p.src)}" alt="${esc(p.alt || '')}" loading="lazy">${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}</figure>`).join('')}</div>` : ''; };
  const xLinks = l => { l = (l || []).filter(d => d && d.href); return l.length ? `<ul class="pd-links">${l.map(d => `<li><a class="text-link" href="${esc(d.href)}" target="_blank" rel="noopener noreferrer">${esc(d.label || d.href)}</a></li>`).join('')}</ul>` : ''; };

  // ---- FeaturedCard ----
  function FeaturedCard([x]) {
    const place = (x.location || '').split(',')[0];
    const media = x.coverImage
      ? `<img src="${esc(x.coverImage)}" alt="${esc(x.coverAlt || '')}" loading="lazy">`
      : `<span class="xf-fb" aria-hidden="true"><span class="xf-fb-place">${esc(place)}</span><span class="xf-fb-date">${esc(x.date)}</span></span>`;
    return `<li><a class="xf-card" href="#experience-${esc(x.slug)}" data-exp="${esc(x.slug)}">
        <span class="xf-media">${media}</span>
        <span class="xf-text">
          <span class="xf-cat">${esc(x.category)}</span>
          <span class="xf-head">${esc(x.editorialHeadline)}</span>
          <span class="xf-org">${esc(x.organisation)}</span>
          <span class="xf-role">${esc(x.officialRole)}</span>
          <span class="xf-meta">${esc(x.location)} · ${esc(x.date)}</span>
          <span class="xf-more">Read the story <span class="xf-arrow" aria-hidden="true">→</span></span>
        </span>
      </a></li>`;
  }

  // ---- MiniCarousel (stays hidden until the mini project is published with slides) ----
  function MiniCarousel(mp) {
    const slides = (mp.slides || []).filter(s => s && s.image);
    if (!mp.published || !slides.length) return '';
    return `<section class="mc" aria-roledescription="carousel" aria-label="${esc(mp.title)}">
      <div class="mc-head"><p class="xa-label">${esc(mp.category || 'Mini project')}</p><h4>${esc(mp.title)}</h4>${mp.description ? `<p>${esc(mp.description)}</p>` : ''}</div>
      <div class="mc-track" tabindex="0" aria-label="${esc(mp.title)} slides">
        ${slides.map((s, k) => `<figure class="mc-slide" aria-roledescription="slide" aria-label="${k + 1} of ${slides.length}">
          <img src="${esc(s.image)}" alt="${esc(s.alt || s.title || '')}" loading="lazy">
          ${s.title || s.caption || s.lessonCategory ? `<figcaption>${s.lessonCategory ? `<span>${esc(s.lessonCategory)}</span>` : ''}${s.title ? `<b>${esc(s.title)}</b>` : ''}${s.caption ? `<p>${esc(s.caption)}</p>` : ''}${s.link ? `<a class="text-link" href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">Read more</a>` : ''}</figcaption>` : ''}
        </figure>`).join('')}
      </div>
      <div class="mc-ctrl"><button type="button" class="vid-btn mc-prev" aria-label="Previous slide">←</button><span class="mc-count" aria-live="polite">1 / ${slides.length}</span><button type="button" class="vid-btn mc-next" aria-label="Next slide">→</button></div>
    </section>`;
  }
  const relatedHTML = x => (x.relatedProjects || []).map(id => (S.experience.miniProjects || []).find(m => m.id === id)).filter(Boolean).map(MiniCarousel).join('');

  // ---- ArchiveEntry ----
  function ArchiveEntry([x, i], uid) {
    const b = `experience.items.${i}`, id = `${uid}-${i}`;
    const parts = [
      x.editorialHeadline ? `<p class="xa-headline">${T(b + '.editorialHeadline')}</p>` : '',
      x.employmentType || x.workArrangement ? `<p class="xa-sub">${[x.employmentType && T(b + '.employmentType'), x.workArrangement && T(b + '.workArrangement')].filter(Boolean).join(' · ')}</p>` : '',
      xHas(x.overview) ? `<p class="xa-ov">${T(b + '.overview')}</p>` : '',
      xMetrics(b + '.metrics', x.metrics),
      xHas(x.metricsNote) ? `<p class="xa-note">${T(b + '.metricsNote')}</p>` : '',
      xHas(x.responsibilities) ? `<h4 class="xa-label">${x.rich ? 'What I do' : 'Key responsibilities'}</h4>${xResp(b + '.responsibilities', x.responsibilities)}` : '',
      xHas(x.contributions) ? `<h4 class="xa-label">Contributions</h4>${xResp(b + '.contributions', x.contributions)}` : '',
      xHas(x.skills) ? `<h4 class="xa-label">Skills applied</h4>${xChips(b + '.skills', x.skills)}` : '',
      xGallery(x.gallery),
      relatedHTML(x)
    ].join('');
    return `<li class="xa-item${x.rich ? ' rich' : ''}" data-group="${esc(x.group)}" data-slug="${esc(x.slug)}">
      <h3 class="xa-h"><button type="button" class="xa-head" id="${id}-b" aria-expanded="false" aria-controls="${id}-p">
        <span class="xa-org">${esc(x.organisation)}</span>
        <span class="xa-role">${esc(x.officialRole)}</span>
        <span class="xa-date">${esc(x.date)}</span>
        <span class="xa-cat">${esc(groupLabel(x.group))}</span>
        <span class="xa-plus" aria-hidden="true"></span>
      </button></h3>
      <div class="xa-panel" id="${id}-p" role="region" aria-labelledby="${id}-b" inert><div class="xa-inner"><div class="xa-content">${parts}</div></div></div>
    </li>`;
  }

  function experienceBody() {
    const E = S.experience, uid = 'xa' + (++xuid);
    return `${E.intro ? `<p class="xp-intro">${T('experience.intro')}</p>` : ''}
      <h3 class="xp-h">${T('experience.featuredTitle')}</h3>
      <ul class="xf-grid">${XF().map(FeaturedCard).join('')}</ul>
      <h3 class="xp-h">${T('experience.archiveTitle')}</h3>
      <div class="xa">
        <div class="xa-filters" role="group" aria-label="Filter the archive">
          ${(E.filters || []).map((f, k) => `<button type="button" class="xa-f" data-f="${esc(f.id)}" aria-pressed="${k ? 'false' : 'true'}">${esc(f.label)}</button>`).join('')}
        </div>
        <p class="vh xa-count" aria-live="polite"></p>
        <ul class="xa-list">${XA().map(e => ArchiveEntry(e, uid)).join('')}</ul>
      </div>`;
  }

  // accordion: one open at a time per list; filters show/hide entries without reloading
  function setEntry(item, open) {
    const btn = item.querySelector('.xa-head'), panelEl = item.querySelector('.xa-panel');
    item.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); panelEl.inert = !open;
  }
  document.addEventListener('click', e => {
    const head = e.target.closest('.xa-head');
    if (head) {
      const item = head.closest('.xa-item'), list = item.parentElement, open = !item.classList.contains('open');
      list.querySelectorAll('.xa-item.open').forEach(o => { if (o !== item) setEntry(o, false); });
      setEntry(item, open);
      if (open) setTimeout(() => { const r = item.getBoundingClientRect(); if (r.top < 70) item.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' }); }, reduceMotion.matches ? 0 : 320);
      return;
    }
    const f = e.target.closest('.xa-f');
    if (f) {
      const box = f.closest('.xa'), g = f.dataset.f;
      box.querySelectorAll('.xa-f').forEach(b => b.setAttribute('aria-pressed', b === f ? 'true' : 'false'));
      let n = 0;
      box.querySelectorAll('.xa-item').forEach(it => {
        const show = g === 'all' || it.dataset.group === g; it.hidden = !show;
        if (!show && it.classList.contains('open')) setEntry(it, false);
        if (show) n++;
      });
      box.querySelector('.xa-count').textContent = `Showing ${n} ${n === 1 ? 'entry' : 'entries'}: ${f.textContent}`;
      return;
    }
    const mcBtn = e.target.closest('.mc-prev, .mc-next');
    if (mcBtn) {
      const tr = mcBtn.closest('.mc').querySelector('.mc-track'), w = tr.querySelector('.mc-slide').getBoundingClientRect().width + 12;
      tr.scrollBy({ left: mcBtn.classList.contains('mc-next') ? w : -w, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  });
  document.addEventListener('scroll', e => {                     // carousel counter follows swipes and buttons
    const tr = e.target && e.target.classList && e.target.classList.contains('mc-track') ? e.target : null; if (!tr) return;
    const w = tr.querySelector('.mc-slide').getBoundingClientRect().width + 12, n = tr.querySelectorAll('.mc-slide').length;
    tr.closest('.mc').querySelector('.mc-count').textContent = `${Math.min(n, Math.round(tr.scrollLeft / w) + 1)} / ${n}`;
  }, true);

  /* ---------- FeaturedDetail: one template for the three story pages, at #experience-<slug> ---------- */
  let edEl = null, edIdx = -1, edOpener = null, edClosing = false, edSource = 'section', edPanelScroll = 0;
  const expPageOpen = () => !!(edEl && !edEl.hidden);
  function FeaturedDetail(fi) {
    const F = XF(), [x, i] = F[fi], b = `experience.items.${i}`, n = F.length;
    const sec = (t, inner) => inner.trim() ? `<section class="pd-sec"><h3>${t}</h3>${inner}</section>` : '';
    const facts = [['Organisation', 'organisation'], ['Role', 'officialRole'], ['Location', 'location'], ['Date', 'date']]
      .filter(([, k]) => xHas(x[k])).map(([l, k]) => `<div><dt>${l}</dt><dd>${T(b + '.' + k)}</dd></div>`).join('');
    const eds = (x.editions || []).filter(Boolean);
    const editions = eds.length ? `<div class="xe-prog">${eds.map((ed, k) => {
        const p = `${b}.editions.${k}`;
        return `${k ? '<span class="xe-arrow" aria-hidden="true"></span>' : ''}<article class="xe${k === eds.length - 1 ? ' xe-now' : ''}">
          <p class="xe-year">${T(p + '.year')}</p>
          ${xHas(ed.editorialSubheading) ? `<p class="xe-sub">${T(p + '.editorialSubheading')}</p>` : ''}
          <h4 class="xe-role">${T(p + '.officialRole')}</h4>
          ${xHas(ed.focus) ? `<p class="xe-focus"><b>Focus:</b> ${T(p + '.focus')}</p>` : ''}
          ${xHas(ed.overview) ? `<p>${T(p + '.overview')}</p>` : ''}
          ${xHas(ed.responsibilities) ? `<h5>Responsibilities</h5>${xResp(p + '.responsibilities', ed.responsibilities)}` : ''}
          ${xHas(ed.skills) ? `<h5>Skills</h5>${xChips(p + '.skills', ed.skills)}` : ''}
          ${xGallery(ed.gallery)}
        </article>`; }).join('')}</div>` : '';
    return `
      <div class="sp-bar">
        <button type="button" class="sp-back" data-ed-close>← Back to Experience</button>
        <span class="sp-count">Featured experience ${fi + 1} of ${n}</span>
      </div>
      <div class="sp-scroll">
        <header class="xd-hero">
          ${x.coverImage ? `<figure class="pd-cover"><img src="${esc(x.coverImage)}" alt="${esc(x.coverAlt || '')}"></figure>` : ''}
          <p class="pd-meta">${T(b + '.category')}</p>
          <h2 class="sp-name" id="edTitle" tabindex="-1">${T(b + '.editorialHeadline')}</h2>
          ${xHas(x.subtitle) ? `<p class="xd-sub">${T(b + '.subtitle')}</p>` : ''}
          <dl class="xd-facts">${facts}</dl>
        </header>
        ${sec('The Experience', xHas(x.overview) ? `<p class="xd-lead">${T(b + '.overview')}</p>` : '')}
        ${eds.length ? sec('Two editions, two roles', editions) : ''}
        ${sec('What I Did', xResp(b + '.responsibilities', x.responsibilities))}
        ${sec('Contributions &amp; Impact', xMetrics(b + '.metrics', x.metrics) + xResp(b + '.contributions', x.contributions))}
        ${sec('Skills Applied', xChips(b + '.skills', x.skills))}
        ${sec('Media', xGallery(x.gallery) + xLinks(x.mediaLinks))}
        <nav class="sp-nav" aria-label="Other featured experiences">
          <button type="button" class="vid-btn" data-ed-go="-1" ${fi === 0 ? 'disabled' : ''}>Previous</button>
          <button type="button" class="vid-btn" data-ed-close>Back to Experience</button>
          <button type="button" class="vid-btn" data-ed-go="1" ${fi === n - 1 ? 'disabled' : ''}>Next</button>
        </nav>
      </div>`;
  }
  const setExpHash = fi => { try { history.replaceState(null, '', '#experience-' + XF()[fi][0].slug); } catch (_) {} };
  function renderExp(fi) {
    edIdx = fi; edEl.innerHTML = FeaturedDetail(fi);
    edEl.setAttribute('aria-labelledby', 'edTitle');
    edEl.querySelectorAll('[data-ed-close]').forEach(b => b.addEventListener('click', () => closeExp()));
    edEl.querySelectorAll('[data-ed-go]').forEach(b => b.addEventListener('click', () => {
      const to = edIdx + (+b.dataset.edGo); if (to < 0 || to >= XF().length) return;
      anim(edEl.querySelector('.sp-scroll'), [{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out' }).then(() => {
        renderExp(to); setExpHash(to);
        anim(edEl.querySelector('.sp-scroll'), [{ opacity: 0, transform: `translateX(${(+b.dataset.edGo) * 30}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380 });
        const nb = edEl.querySelector(`[data-ed-go="${b.dataset.edGo}"]`); (nb && !nb.disabled ? nb : edEl.querySelector('.sp-back')).focus({ preventScroll: true });
      });
    }));
  }
  function openExp(slugOrIdx, opener, fromHash) {
    const fi = typeof slugOrIdx === 'number' ? slugOrIdx : XF().findIndex(([x]) => x.slug === slugOrIdx);
    if (fi < 0) return;
    if (!edEl) {
      edEl = document.createElement('div'); edEl.className = 'sp pd xd'; edEl.hidden = true;
      edEl.setAttribute('role', 'dialog'); edEl.setAttribute('aria-modal', 'true');
      document.body.appendChild(edEl);
      edEl.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); closeExp(); }
        if (e.key === 'Tab') {
          const f = [...edEl.querySelectorAll('button:not([disabled]), a[href]')]; if (!f.length) return;
          if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        }
      });
    }
    edSource = opener && opener.closest && opener.closest('#panel') ? 'panel' : opener && opener.closest && opener.closest('#experience .xf-grid') ? 'section' : 'other';
    if (edSource === 'panel') edPanelScroll = $('panelBody').scrollTop;
    if (panel.open) panel.close();
    if (aboutIsOpen()) closeAbout();
    if (schoolPageOpen()) closeSchoolPage();
    if (projectPageOpen()) closeProject();
    pauseVideo();
    edOpener = opener || null; edClosing = false;
    renderExp(fi);
    if (!fromHash) setExpHash(fi);
    const was = expPageOpen();
    edEl.hidden = false;
    BG().forEach(el => el.inert = true); document.documentElement.classList.add('am-lock');
    if (!was) anim(edEl, [{ opacity: 0, transform: 'translateX(48px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380 });
    $('edTitle').focus({ preventScroll: true });
  }
  async function closeExp() {
    if (!expPageOpen() || edClosing) return;
    edClosing = true;
    await anim(edEl, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(48px)' }], { duration: 220, easing: 'ease-in' });
    edEl.hidden = true; edClosing = false;
    if (!aboutIsOpen() && !schoolPageOpen() && !projectPageOpen()) { BG().forEach(el => el.inert = false); document.documentElement.classList.remove('am-lock'); }
    if (/^#experience-/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }
    // always back to the Experience view the visitor came from
    const slugNow = XF()[edIdx] && XF()[edIdx][0].slug;
    const focusCard = root => { const a = root && root.querySelector(`.xf-card[data-exp="${slugNow}"]`); if (a) a.focus({ preventScroll: true }); return a; };
    if (edSource === 'panel' && window.openPanel) {
      window.openPanel('experience'); $('panelBody').scrollTop = edPanelScroll; focusCard($('panelBody'));
    } else {
      const sec = $('experience'), a = focusCard(sec);
      if (edSource !== 'section' && sec) sec.scrollIntoView({ block: 'start', behavior: 'instant' });
      else if (a) a.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  }
  window.openExperience = openExp;
  // open one experience from elsewhere (the rink boards): a featured story page, or the archive entry in place
  window.openExperienceEntry = slug => {
    const f = XF().findIndex(([x]) => x.slug === slug);
    if (f >= 0) return openExp(f, null);
    const sec = $('experience'); if (!sec) return;
    const all = sec.querySelector('.xa-f[data-f="all"]'); if (all && all.getAttribute('aria-pressed') !== 'true') all.click();
    const item = [...sec.querySelectorAll('.xa-item')].find(it => it.dataset.slug === slug);
    sec.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    if (item && !item.classList.contains('open')) setTimeout(() => { item.querySelector('.xa-head').click(); item.querySelector('.xa-head').focus({ preventScroll: true }); }, reduceMotion.matches ? 0 : 450);
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-exp]'); if (!a || editing()) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault(); openExp(a.dataset.exp, a);
  });
  const expFromHash = () => { const m = /^#experience-(.+)$/.exec(location.hash); return m ? XF().findIndex(([x]) => x.slug === m[1]) : -1; };
  window.addEventListener('hashchange', () => { const i = expFromHash(); if (i >= 0) openExp(i, null, true); });

  /* =====================================================================
     PROJECTS — ProjectGrid + ProjectCard (flip cards). All text comes from S.projects.list in content.js.
     ===================================================================== */
  const PL = () => (S.projects && S.projects.list) || [];
  const statusClass = st => 's-' + String(st || 'planned').toLowerCase().replace(/[^a-z]+/g, '');
  function ProjectCard(p, i) {
    const desc = p.shortDescription || (p.status === 'Completed' ? 'Details coming soon.' : 'This project is still taking shape. Details coming soon.');
    return `<li class="pc-item">
      <div class="pc" data-pc="${i}">
        <div class="pc-inner">
          <button type="button" class="pc-face pc-front" aria-expanded="false" aria-controls="pcb-${i}"
            aria-label="${esc(`${p.title}. ${p.category} project. Show details`)}">
            <span class="pc-top"><span class="pc-num">${esc(p.number || String(i + 1).padStart(2, '0'))}</span><span class="pc-cat">${esc(p.category)}</span></span>
            ${p.cardImage ? `<span class="pc-art"><img src="${esc(p.cardImage)}" alt="" loading="lazy"></span>` : '<span class="pc-mark" aria-hidden="true"></span>'}
            <span class="pc-title">${esc(p.title)}</span>
            <span class="pc-hint" aria-hidden="true">Tap to turn</span>
          </button>
          <div class="pc-face pc-back" id="pcb-${i}" inert>
            <span class="pc-status ${statusClass(p.status)}">${esc(p.status)}</span>
            <h3 class="pc-btitle">${esc(p.title)}</h3>
            <p class="pc-desc">${esc(desc)}</p>
            <a class="pc-view" href="#project-${esc(p.slug)}" data-project="${esc(p.slug)}">View Project</a>
            <button type="button" class="pc-turn" aria-label="Turn the card back over">Turn back</button>
          </div>
        </div>
      </div>
    </li>`;
  }
  const ProjectGrid = () => `<ul class="pgrid" aria-label="Projects">${PL().map(ProjectCard).join('')}</ul>`;
  function projectsBody() { return ProjectGrid(); }

  // flipping: one card at a time; clicking the turned card (or "Turn back") turns it over again
  let flipped = null;
  function setFlip(card, on, focus) {
    if (!card) return;
    card.classList.toggle('flipped', on);
    const front = card.querySelector('.pc-front'), back = card.querySelector('.pc-back');
    front.setAttribute('aria-expanded', on ? 'true' : 'false');
    back.inert = !on; front.inert = on;
    if (focus) (on ? back.querySelector('.pc-view') : front).focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const card = e.target.closest('.pc'); if (!card) return;
    if (e.target.closest('.pc-view')) return;                       // View Project: never flips
    const kb = e.detail === 0;                                       // keyboard "click"
    if (e.target.closest('.pc-front')) {
      if (flipped && flipped !== card) setFlip(flipped, false);
      setFlip(card, true, kb); flipped = card;
    } else if (e.target.closest('.pc-back')) {
      setFlip(card, false, kb || card.contains(document.activeElement)); if (flipped === card) flipped = null;
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !flipped || !flipped.contains(document.activeElement) || projectPageOpen()) return;
    setFlip(flipped, false, true); flipped = null;
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-project]'); if (!a || editing()) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault(); openProject(a.dataset.project, a);
  });

  /* ---------- ProjectDetail: one template for every project, opened at #project-<slug> ---------- */
  let pdEl = null, pdIdx = -1, pdOpener = null, pdClosing = false, pdFromLink = false, pdSource = 'section', pdPanelScroll = 0;
  const projectPageOpen = () => !!(pdEl && !pdEl.hidden);
  const has = v => Array.isArray(v) ? v.filter(x => x && (typeof x !== 'object' || x.src || x.href)).length > 0 : !!(v && String(v).trim());
  function ProjectDetail(i) {
    const p = PL()[i], b = `projects.list.${i}.`, n = PL().length;
    const txt = k => has(p[k]) ? `<p>${T(b + k)}</p>` : '';
    const list = (k, h) => has(p[k]) ? `${h ? `<h4>${h}</h4>` : ''}<ul class="pd-list">${p[k].map((_, x) => `<li>${T(b + k + '.' + x)}</li>`).join('')}</ul>` : '';
    const chips = (k, h) => has(p[k]) ? `<h4>${h}</h4><ul class="pd-chips">${p[k].map((_, x) => `<li>${T(b + k + '.' + x)}</li>`).join('')}</ul>` : '';
    const section = (title, inner) => inner.trim() ? `<section class="pd-sec"><h3>${title}</h3>${inner}</section>` : '';
    const sub = (h, k) => has(p[k]) ? `<h4>${h}</h4><p>${T(b + k)}</p>` : '';
    const msg = { 'Planned': 'Project planned — details coming soon', 'In Progress': 'Project in progress — details coming soon' }[p.status] || 'Project details coming soon';
    const gallery = (p.gallery || []).filter(g => g && g.src);
    const docs = (p.documents || []).filter(d => d && d.href), links = (p.externalLinks || []).filter(d => d && d.href);
    const body = p.showDetails ? [
      section('Project Overview', txt('overview') + list('objectives', 'Objectives') + sub('Context', 'context')),
      section('My Role', txt('myRole') + list('responsibilities', 'Responsibilities') + chips('skills', 'Skills applied') + chips('tools', 'Tools')),
      section('Process &amp; Approach', list('process') + list('keyDecisions', 'Key decisions')),
      section('Outcomes &amp; Learnings', list('outcomes', 'Results &amp; deliverables') + list('learnings', 'Key takeaways') + chips('skillsDeveloped', 'Skills developed')),
      section('Project Gallery', (gallery.length ? `<div class="sp-photos">${gallery.map(g => `<figure class="pd-fig"><img src="${esc(g.src)}" alt="${esc(g.alt || '')}" loading="lazy">${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('')}</div>` : '')
        + (docs.length || links.length ? `<ul class="pd-links">${docs.concat(links).map(d => `<li><a class="text-link" href="${esc(d.href)}" target="_blank" rel="noopener noreferrer">${esc(d.label || d.href)}</a></li>`).join('')}</ul>` : ''))
    ].join('') : `<div class="pd-soon"><p>${msg}</p>
        ${has(p.shortDescription) ? `<p class="pd-sd">${T(b + 'shortDescription')}</p>` : ''}</div>`;
    const meta = [p.category && `${esc(p.category)} project`, has(p.type) && T(b + 'type'), has(p.year) && T(b + 'year')].filter(Boolean).join('<span aria-hidden="true"> · </span>');
    return `
      <div class="sp-bar">
        <button type="button" class="sp-back" data-pd-close>← Back to Projects</button>
        <span class="sp-count">Project ${i + 1} of ${n}</span>
      </div>
      <div class="sp-scroll">
        <header class="pd-head">
          <p class="pd-meta">${meta}</p>
          <h2 class="sp-name" id="pdTitle" tabindex="-1">${T(b + 'title')}</h2>
          <span class="pc-status ${statusClass(p.status)}">${esc(p.status)}</span>
          ${p.coverImage ? `<figure class="pd-cover"><img src="${esc(p.coverImage)}" alt="${esc(p.coverAlt || '')}"></figure>` : ''}
        </header>
        <div class="pd-body">${body}</div>
        <nav class="sp-nav" aria-label="Other projects">
          <button type="button" class="vid-btn" data-pd-go="-1" ${i === 0 ? 'disabled' : ''}>Previous project</button>
          <button type="button" class="vid-btn" data-pd-close>Back to Projects</button>
          <button type="button" class="vid-btn" data-pd-go="1" ${i === n - 1 ? 'disabled' : ''}>Next project</button>
        </nav>
      </div>`;
  }
  const setProjectHash = i => { try { history.replaceState(null, '', '#project-' + PL()[i].slug); } catch (_) {} };
  function renderProject(i) {
    pdIdx = i; pdEl.innerHTML = ProjectDetail(i);
    pdEl.setAttribute('aria-labelledby', 'pdTitle');
    pdEl.querySelectorAll('[data-pd-close]').forEach(b => b.addEventListener('click', () => closeProject()));
    pdEl.querySelectorAll('[data-pd-go]').forEach(b => b.addEventListener('click', () => {
      const to = pdIdx + (+b.dataset.pdGo); if (to < 0 || to >= PL().length) return;
      anim(pdEl.querySelector('.sp-scroll'), [{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out' }).then(() => {
        renderProject(to); setProjectHash(to);
        anim(pdEl.querySelector('.sp-scroll'), [{ opacity: 0, transform: `translateX(${(+b.dataset.pdGo) * 30}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380 });
        const nb = pdEl.querySelector(`[data-pd-go="${b.dataset.pdGo}"]`); (nb && !nb.disabled ? nb : pdEl.querySelector('.sp-back')).focus({ preventScroll: true });
      });
    }));
  }
  function openProject(slugOrIdx, opener, fromHash) {
    const i = typeof slugOrIdx === 'number' ? slugOrIdx : PL().findIndex(p => p.slug === slugOrIdx);
    if (i < 0) return;
    if (!pdEl) {
      pdEl = document.createElement('div'); pdEl.className = 'sp pd'; pdEl.hidden = true;
      pdEl.setAttribute('role', 'dialog'); pdEl.setAttribute('aria-modal', 'true');
      document.body.appendChild(pdEl);
      pdEl.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); closeProject(); }
        if (e.key === 'Tab') {
          const f = [...pdEl.querySelectorAll('button:not([disabled]), a[href]')]; if (!f.length) return;
          if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        }
      });
    }
    // remember which card view it came from, so "Back to Projects" returns there
    pdSource = opener && opener.closest && opener.closest('#panel') ? 'panel' : opener && opener.closest && opener.closest('#projects .pgrid') ? 'section' : 'other';
    if (pdSource === 'panel') pdPanelScroll = $('panelBody').scrollTop;
    // only one layer at a time
    if (panel.open) panel.close();
    if (expPageOpen()) closeExp();
    if (aboutIsOpen()) closeAbout();
    if (schoolPageOpen()) closeSchoolPage();
    pauseVideo();
    pdOpener = opener || null; pdFromLink = !fromHash; pdClosing = false;
    renderProject(i);
    if (!fromHash) setProjectHash(i);
    const wasOpen = projectPageOpen();
    pdEl.hidden = false;
    BG().forEach(el => el.inert = true); document.documentElement.classList.add('am-lock');   // the page underneath keeps its scroll position
    if (!wasOpen) anim(pdEl, [{ opacity: 0, transform: 'translateX(48px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380 });
    $('pdTitle').focus({ preventScroll: true });
  }
  async function closeProject() {
    if (!projectPageOpen() || pdClosing) return;
    pdClosing = true;
    await anim(pdEl, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(48px)' }], { duration: 220, easing: 'ease-in' });
    pdEl.hidden = true; pdClosing = false;
    if (!aboutIsOpen() && !schoolPageOpen() && !expPageOpen()) { BG().forEach(el => el.inert = false); document.documentElement.classList.remove('am-lock'); }
    if (/^#project-/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }
    // always back to the card view: the Projects pop-up, or the Projects section on the page
    const slugNow = PL()[pdIdx] && PL()[pdIdx].slug;
    document.querySelectorAll('.pc.flipped').forEach(c => setFlip(c, false)); flipped = null;   // every card back on its front
    const focusCard = root => {
      const v = root && root.querySelector(`.pc-view[data-project="${slugNow}"]`); if (!v) return;
      const c = v.closest('.pc'); setFlip(c, false); if (flipped === c) flipped = null;
      c.querySelector('.pc-front').focus({ preventScroll: true });
      return c;
    };
    if (pdSource === 'panel' && window.openPanel) {
      window.openPanel('projects');
      $('panelBody').scrollTop = pdPanelScroll;
      const c = focusCard($('panelBody')); if (c && pdIdx >= 0) c.scrollIntoView({ block: 'nearest' });
    } else {
      const sec = $('projects');
      const c = focusCard(sec);
      if (pdSource !== 'section' && sec) sec.scrollIntoView({ block: 'start', behavior: 'instant' });   // came from elsewhere: show the cards
      else if (c) c.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  }
  window.openProject = openProject;
  const projectFromHash = () => { const m = /^#project-(.+)$/.exec(location.hash); return m ? PL().findIndex(p => p.slug === m[1]) : -1; };
  window.addEventListener('hashchange', () => { const i = projectFromHash(); if (i >= 0) openProject(i, null, true); else if (projectPageOpen() && !/^#project-/.test(location.hash)) closeProject(); });

  // only real values become links: no placeholder buttons
  function contactLinks() {
    const C = S.contact, out = [];
    if (C.linkedin) out.push(`<a class="text-link" href="${esc(C.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (C.cvLink)   out.push(`<a class="text-link" href="${esc(C.cvLink)}" target="_blank" rel="noopener">CV</a>`);
    if (C.email)    out.push(`<a class="text-link" href="#contact" data-mail-open>Email</a><span class="email-text">${esc(C.email)}</span>`);
    return out;
  }
  function contactBody() {
    if (editing()) {   // the owner fills the real addresses here; links appear for visitors once filled
      const row = (label, p, ph) => `<div class="edit-row"><span>${label}</span><span data-k="${p}" data-ph="${ph}">${esc(get(p))}</span></div>`;
      return `<div class="edit-contact">
        ${row('LinkedIn link', 'contact.linkedin', 'https://www.linkedin.com/in/your-name')}
        ${row('Email', 'contact.email', 'name@example.com')}
        ${row('CV link', 'contact.cvLink', 'a shared link to your CV, e.g. Google Drive')}
      </div>`;
    }
    const links = contactLinks();
    return links.length ? `<div class="contact-links">${links.join('')}</div>` :
      (S.showTodo ? `<div class="todo"><b>To add:</b> LinkedIn link, email address and CV link</div>` : '<p>Contact details coming soon.</p>');
  }
  function glanceBody() {
    const xps = XF();
    const pi = PL().findIndex(p => p.featured);
    const links = contactLinks();
    const mine = (p, what) => get(p) ? `<p class="mine"><b>My role:</b> ${T(p)}</p>` : todo(p, what);
    return `<div class="glance">
      <div>
        <p class="statement">${T('glance.lookingFor')}</p>
        <p>${joinList(S.hero.keywords.map((_, i) => T('hero.keywords.' + i)))}.</p>
        ${S.glance.availability ? `<p>${T('glance.availability')}</p>` : ''}
      </div>
      <dl>
        <dt>Most relevant experience</dt>
        <dd>${xps.map(([x, i]) => { const b = `experience.items.${i}.`; return `<div class="g-item">
            <div class="g-role">${T(b + 'officialRole')}</div>
            <div class="g-org">${T(b + 'organisation')}, ${T(b + 'location')}, ${T(b + 'date')}</div>
            <a class="text-link" href="#experience-${esc(x.slug)}" data-exp="${esc(x.slug)}">Read the story</a>
          </div>`; }).join('')}</dd>
        <dt>Featured project</dt>
        <dd>${pi >= 0 ? `<div class="g-item">
            <div class="g-role">${T(`projects.list.${pi}.title`)}</div>
            <div class="g-org">${T(`projects.list.${pi}.type`)}</div>
            ${mine(`projects.list.${pi}.myRole`, 'your role in one sentence')}
            <a class="text-link" href="#project-${esc(PL()[pi].slug)}" data-project="${esc(PL()[pi].slug)}">View project</a>
          </div>` : ''}</dd>
        <dt>Contact</dt>
        <dd>${links.length ? `<div class="contact-links">${links.join('')}</div>` : (S.showTodo ? '<div class="todo"><b>To add:</b> LinkedIn, email and CV link</div>' : 'Coming soon')}</dd>
      </dl>
    </div>`;
  }

  const SECTIONS = {
    glance:     { title: 'glance.title', body: glanceBody },
    about:      { title: 'about.title', body: aboutBody },
    experience: { title: 'experience.title', lead: 'experience.subtitle', body: experienceBody },
    projects:   { title: 'projects.title', lead: 'projects.intro', body: projectsBody },
    contact:    { title: 'contact.title', lead: 'contact.intro', body: contactBody }
  };
  const sectionHTML = (id, inPanel) => {
    const s = SECTIONS[id];
    return (inPanel ? '' : `<h2>${T(s.title)}</h2>`) + (s.lead ? `<p class="lead">${T(s.lead)}</p>` : '') + s.body();
  };

  /* ---------------- pop-up for Experience / Projects ---------------- */
  const panel = $('panel');
  let returnFocus = null;
  function closePanel() { if (panel.open) panel.close(); }
  window.openPanel = function (id) {
    if (id === 'about') return openAbout(document.activeElement, 0);   // About has its own pop-up
    pauseVideo();
    if (!SECTIONS[id] || typeof panel.showModal !== 'function') { const el = $(id); if (el) el.scrollIntoView({ block: 'start' }); return; }
    returnFocus = document.activeElement;
    $('panelTitle').innerHTML = T(SECTIONS[id].title);
    $('panelBody').innerHTML = sectionHTML(id, true);
    $('panelBody').scrollTop = 0;
    $('panelMore').setAttribute('href', '#' + id); $('panelMore').textContent = 'See this section on the page';
    panel.dataset.section = id; panel.dataset.school = '';
    panel.showModal();
    document.body.classList.add('panel-open');
    $('panelClose').focus();
  };
  panel.addEventListener('close', () => {
    document.body.classList.remove('panel-open');
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
  });
  $('panelClose').addEventListener('click', closePanel);
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
  panel.addEventListener('click', e => { if (!editing() && e.target.closest('a[href^="#"]')) closePanel(); });
  window.isPanelOpen = () => panel.open || aboutIsOpen() || schoolPageOpen() || contactIsOpen() || projectPageOpen() || expPageOpen();

  /* ---------------- school stories (click a logo in the rink or on the page) ---------------- */
  function schoolHTML(i) {
    const sp = S.sponsors[i], b = `sponsors.${i}.`;
    const photos = (sp.photos || []).filter(Boolean);
    return `<div class="school">
      <div class="school-head">
        ${sp.logo ? `<img class="school-logo" src="${esc(sp.logo)}" alt="${esc(sp.name)} logo">` : ''}
        <div>
          ${get(b + 'relation') ? `<p class="school-rel">${T(b + 'relation')}</p>` : todo(b + 'relation', 'how you are connected to this school, e.g. degree, semester, dates')}
        </div>
      </div>
      ${get(b + 'story') ? `<p class="school-story">${T(b + 'story')}</p>` : todo(b + 'story', 'what you did and what happened here')}
      ${photos.length ? `<div class="school-photos">${photos.map(src => `<img src="${esc(src)}" alt="${esc(sp.name)}" loading="lazy">`).join('')}</div>`
        : (sp.partner ? '' : (showTodo() ? '<div class="todo"><b>To add:</b> photos from your time here</div>' : ''))}
    </div>`;
  }
  window.openSchool = function (i) {
    if (!S.sponsors || !S.sponsors[i] || typeof panel.showModal !== 'function') return;
    pauseVideo();
    returnFocus = document.activeElement;
    $('panelTitle').innerHTML = T(`sponsors.${i}.name`);
    $('panelBody').innerHTML = schoolHTML(i);
    $('panelBody').scrollTop = 0;
    $('panelMore').setAttribute('href', '#about'); $('panelMore').textContent = 'See all schools';
    panel.dataset.section = ''; panel.dataset.school = String(i);
    if (!panel.open) panel.showModal();
    document.body.classList.add('panel-open');
    $('panelClose').focus();
  };
  /* ---------------- full-screen school page (opened from the banners in the stands) ---------------- */
  const slug = sp => (sp.short || sp.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let spEl = null, spIdx = -1, spOpener = null, spClosing = false;
  const schoolPageOpen = () => !!(spEl && !spEl.hidden);
  function schoolPageHTML(i) {
    const sp = S.sponsors[i], b = `sponsors.${i}.`, n = S.sponsors.length;
    const photos = (sp.photos || []).filter(Boolean);
    return `
      <div class="sp-bar">
        <button type="button" class="sp-back" data-sp-close>← Back to the rink</button>
        <span class="sp-count">${i + 1} of ${n}</span>
      </div>
      <div class="sp-scroll">
        <header class="sp-hero">
          <div class="sp-logo">${sp.logo ? `<img src="${esc(sp.logo)}" alt="${esc(sp.name)} logo">` : `<span>${esc(sp.short || sp.name)}</span>`}</div>
          <div>
            <h2 class="sp-name">${T(b + 'name')}</h2>
            ${get(b + 'relation') ? `<p class="sp-rel">${T(b + 'relation')}</p>` : todo(b + 'relation', 'how you are connected to this school, e.g. degree, semester, dates')}
          </div>
        </header>
        <section class="sp-body">
          ${sp.partner ? '' : '<h3>What I did here</h3>'}
          ${get(b + 'story') ? `<p class="sp-story">${T(b + 'story')}</p>` : todo(b + 'story', 'what you did and what happened here')}
          ${photos.length ? `<div class="sp-photos">${photos.map(src => `<img src="${esc(src)}" alt="${esc(sp.name)}" loading="lazy">`).join('')}</div>`
            : (sp.partner ? '' : (showTodo() ? '<div class="todo"><b>To add:</b> photos from your time here</div>' : ''))}
        </section>
        <nav class="sp-nav" aria-label="Other schools">
          <button type="button" class="vid-btn" data-sp-go="-1" ${i === 0 ? 'disabled' : ''}>Previous school</button>
          <button type="button" class="vid-btn" data-sp-go="1" ${i === n - 1 ? 'disabled' : ''}>Next school</button>
        </nav>
      </div>`;
  }
  function renderSchoolPage(i) {
    spIdx = i; spEl.innerHTML = schoolPageHTML(i);
    spEl.setAttribute('aria-label', S.sponsors[i].name);
    spEl.querySelectorAll('[data-sp-close]').forEach(b => b.addEventListener('click', () => closeSchoolPage()));
    spEl.querySelectorAll('[data-sp-go]').forEach(b => b.addEventListener('click', () => {
      const to = spIdx + (+b.dataset.spGo); if (to < 0 || to >= S.sponsors.length) return;
      anim(spEl.querySelector('.sp-scroll'), [{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out' }).then(() => {
        renderSchoolPage(to); setHash(to);
        anim(spEl.querySelector('.sp-scroll'), [{ opacity: 0, transform: `translateX(${(+b.dataset.spGo) * 30}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380 });
        const nb = spEl.querySelector(`[data-sp-go="${b.dataset.spGo}"]`); (nb && !nb.disabled ? nb : spEl.querySelector('.sp-back')).focus();
      });
    }));
  }
  const setHash = i => { try { history.replaceState(null, '', '#school-' + slug(S.sponsors[i])); } catch (_) { location.hash = 'school-' + slug(S.sponsors[i]); } };
  window.openSchoolPage = function (i, fromHash) {
    if (!S.sponsors || !S.sponsors[i]) return;
    if (!spEl) {
      spEl = document.createElement('div'); spEl.className = 'sp'; spEl.hidden = true;
      spEl.setAttribute('role', 'dialog'); spEl.setAttribute('aria-modal', 'true');
      document.body.appendChild(spEl);
      spEl.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); closeSchoolPage(); }
        if (e.key === 'Tab') {
          const f = [...spEl.querySelectorAll('button:not([disabled]), a[href]')]; if (!f.length) return;
          if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        }
      });
    }
    pauseVideo(); if (panel.open) panel.close();
    spOpener = document.activeElement; spClosing = false;
    renderSchoolPage(i);
    if (!fromHash) setHash(i);
    spEl.hidden = false;
    BG().forEach(el => el.inert = true); document.documentElement.classList.add('am-lock');
    anim(spEl, [{ opacity: 0, transform: 'translateX(48px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380 });   // slides in like a new page
    spEl.querySelector('.sp-back').focus({ preventScroll: true });
  };
  async function closeSchoolPage() {
    if (!schoolPageOpen() || spClosing) return;
    spClosing = true;
    await anim(spEl, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(48px)' }], { duration: 220, easing: 'ease-in' });
    spEl.hidden = true; spClosing = false;
    if (!aboutIsOpen()) { BG().forEach(el => el.inert = false); document.documentElement.classList.remove('am-lock'); }
    if (/^#school-/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }
    if (spOpener && document.contains(spOpener)) spOpener.focus({ preventScroll: true });
  }
  // shared links like …#school-coventry open that page; the browser's back button closes it
  function schoolFromHash() {
    const m = /^#school-(.+)$/.exec(location.hash); if (!m || !S.sponsors) return -1;
    return S.sponsors.findIndex(sp => slug(sp) === m[1]);
  }
  window.addEventListener('hashchange', () => { const i = schoolFromHash(); if (i >= 0) window.openSchoolPage(i, true); else if (schoolPageOpen()) closeSchoolPage(); });

  function schoolsRow() {
    if (!S.sponsors || !S.sponsors.length) return '';
    return `<div class="schools"><h3>${'Where I study and have studied'}</h3>
      <div class="school-row">${S.sponsors.map((sp, i) => `<button type="button" class="school-btn" data-school="${i}" aria-label="${esc(sp.name)}${sp.partner ? ' (GOALS partner university)' : ''}">
        ${sp.logo ? `<img src="${esc(sp.logo)}" alt="" loading="lazy">` : `<span>${esc(sp.short || sp.name)}</span>`}</button>`).join('')}</div></div>`;
  }

  /* =====================================================================
     ABOUT POP-UP — one flow of pages: Meet me → story scenes
     ===================================================================== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(.22,.8,.26,1)';
  let modal = null, panelBox, overlay, pages = [], pageIdx = 0, pagePending = null, pageBusy = false;
  let aboutOpener = null, closing = false;
  const aboutIsOpen = () => !!(modal && !modal.hidden);
  const anim = (el, frames, opts) => {
    if (!el) return Promise.resolve();
    if (reduceMotion.matches) {                                 // reduced motion: short fade only
      frames = frames.map(f => ({ opacity: f.opacity !== undefined ? f.opacity : 1 }));
      opts = { ...opts, duration: Math.min(opts.duration, 140), delay: 0 };
    }
    return el.animate(frames, { fill: 'both', easing: EASE, ...opts }).finished.catch(() => {});
  };

  function videoMarkup() {
    const V = S.about.video || {};
    if (!V.src) return showTodo() ? `<div class="vid-todo"><p><b>To add:</b> your intro video (MP4, under 20 MB).</p></div>` : photoFigure('photo-intro');
    return `<div class="vid">
      <div class="vid-frame">
        <video id="vidEl" preload="metadata" playsinline ${V.poster ? `poster="${esc(V.poster)}"` : ''}>
          <source src="${esc(V.src)}" type="video/mp4">
          ${V.captions ? `<track kind="captions" srclang="en" label="English" src="${esc(V.captions)}" default>` : ''}
        </video>
        <button type="button" class="vid-start" id="vidStart" aria-label="Play ${esc(V.label || 'Meet Chloe')}">
          <span class="play-ico" aria-hidden="true"></span>
          <span class="vid-start-text"><b>${T('about.video.label')}</b><small id="vidDur"></small></span>
        </button>
        <button type="button" class="vid-unmute" id="vidUnmute" hidden>Sound is off · Tap to turn on</button>
        <p class="vid-error" id="vidError" hidden>The video couldn't load. Everything about me is also written on this page.</p>
      </div>
    </div>`;
  }
  function pageList() {
    const A = S.about;
    const hasVid = !!(S.about.video && S.about.video.src);
    const list = [{ title: 'Meet me', html: `
      <div class="pg-media">${videoMarkup()}</div>
      <div class="pg-text am-intro">
        <p class="about-name">${S.about.greeting ? T('about.greeting') : T('hero.name')}</p>
        <p class="about-lead">${T('about.paragraphs.0')}</p>
        <h3 class="small-head">${T('about.interestsTitle')}</h3>
        ${interestsList()}
      </div>`, cls: 'pg-meet' }];
    (A.scenes || []).forEach((sc, i) => {
      const b = `about.scenes.${i}.`;
      const paras = (Array.isArray(sc.text) ? sc.text : [sc.text]).map((_, k) => `<p>${T(b + (Array.isArray(sc.text) ? 'text.' + k : 'text'))}</p>`).join('');
      let media = '';
      if (sc.images && sc.images.length) media = `<div class="st-img st-rot" aria-roledescription="carousel" aria-label="${esc(sc.title)} photos">
          ${sc.images.map((im, k) => `<div class="rot-slide${k ? '' : ' on'}" aria-hidden="${k ? 'true' : 'false'}"><img class="rot-bg" src="${esc(im.poster || im.src)}" alt="" loading="lazy">${im.video
            ? `<video class="rot-fg" src="${esc(im.video)}" poster="${esc(im.poster || '')}" muted playsinline preload="metadata" aria-label="${esc(im.alt || '')}"></video>`
            : `<img class="rot-fg" src="${esc(im.src)}" alt="${esc(im.alt || '')}" loading="lazy">`}</div>`).join('')}
          <div class="rot-dots">${sc.images.map((_, k) => `<button type="button" data-rot="${k}" aria-label="Photo ${k + 1} of ${sc.images.length}"${k ? '' : ' aria-current="true"'}></button>`).join('')}</div>
        </div>`;
      else if (sc.video) media = `<div class="st-img st-vid"><video src="${esc(sc.video)}" controls playsinline preload="metadata"${sc.alt ? ` aria-label="${esc(sc.alt)}"` : ''}></video></div>`;
      else if (sc.image) media = `<figure class="st-img"><img src="${esc(sc.image)}" alt="${esc(sc.alt || '')}" loading="lazy"></figure>`;
      else if (showTodo()) media = `<div class="st-img st-todo"><p><b>To add:</b> a photo or short video for “${esc(sc.title)}”</p></div>`;
      const fl = sc.flight;
      const flight = fl ? `<div class="flight" role="img" aria-label="${esc(`Flight from ${fl.from} to ${fl.to}`)}">
          <div class="flight-sky"></div>
          <div class="flight-labels" aria-hidden="true"><span class="fl-from"><small>From</small>${esc(fl.from)}</span><span class="fl-to"><small>To</small>${esc(fl.to)}</span></div>
        </div>` : '';
      const prevFlight = i > 0 && A.scenes[i - 1].flight;
      const ex = sc.extras && sc.extras.items && sc.extras.items.length
        ? `<div class="st-extras"><p>${T(b + 'extras.label')}</p><ul>${sc.extras.items.map((_, k) => `<li>${T(b + 'extras.items.' + k)}</li>`).join('')}</ul></div>` : '';
      list.push({ title: sc.title, path: b + 'title', arrival: !!prevFlight, html: `
        ${media ? `<div class="pg-media">${media}</div>` : ''}
        <div class="pg-text st-text">${sc.place ? `<p class="st-kicker">${T(b + 'place')}</p>` : `<p class="st-kicker">${T('about.storyTitle')}</p>`}<h3>${T(b + 'title')}</h3>${paras}${ex}${flight}</div>`,
        cls: 'pg-scene' + (media ? '' : ' pg-textonly') });
    });
    return list;
  }

  function buildAboutModal() {
    const wasOpen = aboutIsOpen(), keep = pageIdx;
    if (modal) { modal.remove(); if (window.__aboutKeys) document.removeEventListener('keydown', window.__aboutKeys); }
    pages = pageList(); pageIdx = Math.min(keep, pages.length - 1); pagePending = null; pageBusy = false;
    modal = document.createElement('div');
    modal.className = 'am'; modal.id = 'aboutModal'; modal.hidden = !wasOpen;
    modal.innerHTML = `
      <div class="am-overlay" data-am-close></div>
      <div class="am-panel" role="dialog" aria-modal="true" aria-labelledby="amTitle">
        <h2 class="vh" id="amTitle">About ${esc(S.hero.name)}</h2>
        <button type="button" class="am-close" data-am-close aria-label="Close">✕</button>
        <div class="am-stage">${pages.map((p, i) => `<section class="am-page ${p.cls}" data-page="${i}" aria-label="${esc(p.title)}"${i === pageIdx ? '' : ' hidden'}>${p.html}</section>`).join('')}</div>
        <div class="am-nav">
          <button type="button" class="vid-btn" id="amPrev">Previous</button>
          <div class="st-progress"><span class="st-count" id="amCount" aria-live="polite"></span>
            <span class="st-dots" aria-hidden="true">${pages.map(() => '<i></i>').join('')}</span></div>
          <button type="button" class="vid-btn" id="amNext">Next</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    overlay = modal.querySelector('.am-overlay'); panelBox = modal.querySelector('.am-panel');
    watchFlight();
    modal.querySelectorAll('[data-am-close]').forEach(b => b.addEventListener('click', closeAbout));
    $('amPrev').addEventListener('click', () => goPage(-1));
    $('amNext').addEventListener('click', () => goPage(1));
    document.addEventListener('keydown', aboutKeys); window.__aboutKeys = aboutKeys;
    function aboutKeys(e) {
      if (!aboutIsOpen() || !document.body.contains(modal)) return;
      if (e.key === 'Escape') { e.preventDefault(); closeAbout(); return; }
      const inField = e.target.closest('video, [contenteditable="true"], [contenteditable="plaintext-only"]');
      if (!inField && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); goPage(e.key === 'ArrowRight' ? 1 : -1); return; }
      if (e.key === 'Tab') {                                     // keep focus inside the pop-up
        const f = [...panelBox.querySelectorAll('button:not([disabled]), a[href], video[controls], [contenteditable="true"], [contenteditable="plaintext-only"]')].filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!panelBox.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    // Mac trackpad: two-finger swipe left/right. The page follows the fingers, then turns (or springs back).
    let acc = 0, idleT = null, spent = false, quietT = null;
    const SWIPE_AT = 110;
    panelBox.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;          // vertical scrolling stays normal
      e.preventDefault();                                            // no browser back/forward gesture here
      if (spent) {                                                   // one swipe = one page: wait until the trackpad's momentum stops
        clearTimeout(quietT); quietT = setTimeout(() => { spent = false; }, 200); return;
      }
      if (pageBusy || editing()) return;
      acc += e.deltaX;
      const atEdge = (acc > 0 && pageIdx === pages.length - 1) || (acc < 0 && pageIdx === 0);
      const cur = pageEl(pageIdx), shift = -acc * (atEdge ? 0.18 : 0.45);
      cur.style.transform = `translateX(${Math.max(-140, Math.min(140, shift))}px)`;
      cur.style.opacity = String(1 - Math.min(0.35, Math.abs(shift) / 400));
      clearTimeout(idleT);
      if (!atEdge && Math.abs(acc) > SWIPE_AT) {
        const step = acc > 0 ? 1 : -1; acc = 0; spent = true;
        clearTimeout(quietT); quietT = setTimeout(() => { spent = false; }, 200);
        goPage(step, 'swipe');
        return;
      }
      idleT = setTimeout(() => {                                     // fingers lifted before the threshold: spring back
        const c = pageEl(pageIdx), from = c.style.transform || 'translateX(0)';
        acc = 0; c.style.transform = ''; c.style.opacity = '';
        anim(c, [{ transform: from, opacity: 0.85 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 260 }).then(() => c.getAnimations().forEach(a => a.cancel()));
      }, 140);
    }, { passive: false });
    // swipe between pages on touch screens
    let sx = null;
    const stage = modal.querySelector('.am-stage');
    stage.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && !e.target.closest('video')) sx = { x: e.clientX, y: e.clientY }; });
    stage.addEventListener('pointerup', e => {
      if (!sx) return; const dx = e.clientX - sx.x, dy = e.clientY - sx.y; sx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goPage(dx < 0 ? 1 : -1, 'swipe');
    });
    stage.addEventListener('pointercancel', () => { sx = null; });
    updateNav();
    initVideo();
  }


  const BG = () => [...document.querySelectorAll('body > header, body > .hero, body > main, body > footer, body > .skip')];
  function openAbout(opener, page = 0) {
    if (!modal || (aboutIsOpen() && !closing)) return;
    closing = false;
    aboutOpener = opener && opener !== document.body ? opener : null;
    resetFlight();                                            // plays once per opening
    showPage(page);
    modal.hidden = false;
    startRot();
    BG().forEach(el => el.inert = true);                       // rink clicks, drags, keys and page focus locked
    document.documentElement.classList.add('am-lock');         // the page itself does not scroll
    anim(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' });
    anim(panelBox, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350 });
    pageIn(1, 120);
    if (page === 0) enterMeet(160);
    modal.querySelector('.am-close').focus({ preventScroll: true });
  }
  function enterMeet(delay) {
    if (!curVideo()) return;
    if (!reduceMotion.matches && !editing() && curVideo().paused) $('vidStart').hidden = true;   // it will start by itself
    setTimeout(autoplay, delay + 250);
  }
  async function closeAbout() {
    if (!aboutIsOpen() || closing) return;
    closing = true;
    pauseVideo(); stopFlight(); rotStop();
    await Promise.all([
      anim(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'linear' }),
      anim(panelBox, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 200, easing: 'ease-in' })
    ]);
    if (!closing) return;                                       // re-opened while closing
    closing = false; modal.hidden = true;
    BG().forEach(el => el.inert = false);
    document.documentElement.classList.remove('am-lock');
    if (aboutOpener && document.contains(aboutOpener)) aboutOpener.focus({ preventScroll: true });
  }
  window.openAbout = openAbout;

  /* ---------- photo rotation (one chapter can hold several photos) ---------- */
  let rotTimer = 0, rotBox = null;
  const ROT_MS = 2000;
  function rotShow(box, k) {
    const slides = box.querySelectorAll('.rot-slide'), dots = box.querySelectorAll('.rot-dots button');
    k = (k + slides.length) % slides.length; box._k = k;
    slides.forEach((s, i) => {
      s.classList.toggle('on', i === k); s.setAttribute('aria-hidden', i === k ? 'false' : 'true');
      const v = s.querySelector('video'); if (v && i !== k) { v.pause(); }
    });
    dots.forEach((d, i) => i === k ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
  }
  function rotStop() {
    clearTimeout(rotTimer); rotTimer = 0;
    if (rotBox) rotBox.querySelectorAll('video').forEach(v => { v.pause(); v.onended = null; });
    rotBox = null;
  }
  // shows the current slide, then moves on: photos after 2 s, videos when they finish
  function rotRun(box) {
    clearTimeout(rotTimer);
    const slide = box.querySelectorAll('.rot-slide')[box._k || 0], v = slide && slide.querySelector('video');
    const next = () => { if (rotBox !== box) return; if (box._hold || document.hidden) { rotTimer = setTimeout(next, 500); return; } rotShow(box, (box._k || 0) + 1); rotRun(box); };
    if (v) {
      v.currentTime = 0; v.onended = () => { v.onended = null; next(); };
      const p = v.play(); if (p && p.catch) p.catch(() => { rotTimer = setTimeout(next, ROT_MS); });   // video can't play: treat it like a photo
      rotTimer = setTimeout(() => { if (v.paused) next(); }, 12000);                                   // safety net
    } else rotTimer = setTimeout(next, ROT_MS);
  }
  function startRot() {
    rotStop();
    if (!modal || !aboutIsOpen()) return;
    const box = pageEl(pageIdx) && pageEl(pageIdx).querySelector('.st-rot');
    if (!box) return;
    if (!box._wired) {
      box._wired = true;
      box.querySelectorAll('.rot-dots button').forEach(b => b.addEventListener('click', () => { rotShow(box, +b.dataset.rot); if (rotBox === box) rotRun(box); else startRot(); }));
      ['pointerenter', 'focusin'].forEach(ev => box.addEventListener(ev, () => { box._hold = true; }));      // hover or keyboard focus pauses it
      ['pointerleave', 'focusout'].forEach(ev => box.addEventListener(ev, () => { box._hold = false; }));
    }
    box.querySelectorAll('video').forEach(v => { v.controls = reduceMotion.matches; });
    if (reduceMotion.matches) return;                            // calm mode: nothing moves by itself; dots and video controls still work
    rotBox = box; rotRun(box);
  }

  /* ---------- My Story: little flight from one chapter to the next ---------- */
  const FLIGHT = { played: false, flying: false, arrived: false, arrivalShown: false, prog: 0, raf: 0, timer: 0, io: null, ro: null };
  const flightEl = () => modal && modal.querySelector('.flight');
  const NS = 'http://www.w3.org/2000/svg';
  function drawFlight(prog) {
    const el = flightEl(); if (!el) return;
    const sky = el.querySelector('.flight-sky'), w = Math.round(sky.clientWidth);
    if (!w) return;
    if (el._w !== w) {                                           // (re)build for this width: small flat route on phones
      el._w = w;
      const mob = w < 420, h = mob ? 58 : 96, pad = 14, y = h - 12, x0 = pad, x1 = w - pad;
      const top = mob ? y - 30 : y - 92;
      const d = `M${x0} ${y} C${x0 + (x1 - x0) * 0.28} ${top} ${x0 + (x1 - x0) * 0.72} ${top} ${x1} ${y}`;
      sky.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" focusable="false">
        <ellipse class="cloud" cx="${w * 0.36}" cy="${h * 0.3}" rx="${mob ? 22 : 34}" ry="${mob ? 6 : 9}"/>
        <ellipse class="cloud c2" cx="${w * 0.66}" cy="${h * 0.42}" rx="${mob ? 16 : 26}" ry="${mob ? 5 : 7}"/>
        <path class="guide" d="${d}"/><path class="trail" d="${d}"/>
        <g class="dot from"><circle r="8" class="ring"/><circle r="4"/></g>
        <g class="dot to" transform="translate(${x1} ${y})"><circle r="8" class="ring"/><circle r="4"/></g>
        <g class="plane"><path d="M10 0 L3 -2 L-1 -9 L-4 -9 L-2 -2 L-7 -2 L-9 -5 L-11 -5 L-10 0 L-11 5 L-9 5 L-7 2 L-2 2 L-4 9 L-1 9 L3 2 Z"/></g>
      </svg>`;
      sky.style.height = h + 'px';
      el._path = sky.querySelector('.trail'); el._len = el._path.getTotalLength();
      el._plane = sky.querySelector('.plane'); el._cloud = sky.querySelectorAll('.cloud');
      sky.querySelector('.dot.from').setAttribute('transform', `translate(${x0} ${y})`);
      el._path.style.strokeDasharray = el._len;
    }
    FLIGHT.prog = prog;
    const L = el._len;
    el._path.style.strokeDashoffset = L * (1 - prog);
    const calm = reduceMotion.matches;
    el.classList.toggle('calm', calm);
    if (calm || prog >= 1) { el._plane.style.opacity = 0; }
    else {
      const a = el._path.getPointAtLength(L * prog), b = el._path.getPointAtLength(Math.min(L, L * prog + 2));
      const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      el._plane.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${ang})`); el._plane.style.opacity = 1;
    }
    el._cloud.forEach((c, k) => c.setAttribute('transform', `translate(${-prog * (k ? 10 : 6)} 0)`));   // clouds drift a touch
  }
  function arriveFlight() {
    const el = flightEl(); FLIGHT.flying = false; FLIGHT.arrived = true; drawFlight(1);
    if (!el) return;
    el.classList.add('arrived');
    const dot = el.querySelector('.dot.to .ring');
    if (dot && !reduceMotion.matches) dot.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.9)', opacity: 0 }], { duration: 700, easing: 'ease-out' });
  }
  function playFlight() {
    FLIGHT.timer = 0;
    if (FLIGHT.played || !aboutIsOpen()) return;
    FLIGHT.played = true;
    if (reduceMotion.matches) { arriveFlight(); return; }       // calm mode: the whole route, names, no moving plane
    FLIGHT.flying = true;
    const t0 = performance.now(), ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const tick = now => {
      if (!FLIGHT.flying) return;
      const k = Math.min(1, (now - t0) / 1000);
      drawFlight(ease(k));
      if (k < 1) FLIGHT.raf = requestAnimationFrame(tick); else arriveFlight();
    };
    FLIGHT.raf = requestAnimationFrame(tick);
  }
  function finishFlight() { if (FLIGHT.flying) { cancelAnimationFrame(FLIGHT.raf); arriveFlight(); } clearTimeout(FLIGHT.timer); FLIGHT.timer = 0; }
  function stopFlight() { cancelAnimationFrame(FLIGHT.raf); clearTimeout(FLIGHT.timer); FLIGHT.timer = 0; FLIGHT.flying = false; }
  function resetFlight() {
    stopFlight(); Object.assign(FLIGHT, { played: false, arrived: false, arrivalShown: false, prog: 0 });
    const el = flightEl(); if (el) { el.classList.remove('arrived'); el._w = 0; }
  }
  function watchFlight() {
    if (FLIGHT.io) FLIGHT.io.disconnect(); if (FLIGHT.ro) FLIGHT.ro.disconnect();
    const el = flightEl(); if (!el) return;
    FLIGHT.io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) { clearTimeout(FLIGHT.timer); FLIGHT.timer = 0; return; }
      drawFlight(FLIGHT.played ? 1 : FLIGHT.prog);
      if (!FLIGHT.played && !FLIGHT.timer && en.intersectionRatio >= 0.5) { if (reduceMotion.matches) playFlight(); else FLIGHT.timer = setTimeout(playFlight, 420); }   // after the page settles
    }, { root: modal.querySelector('.am-stage'), threshold: [0, 0.5, 1] });
    FLIGHT.io.observe(el);
    FLIGHT.ro = new ResizeObserver(() => { if (!FLIGHT.flying) drawFlight(FLIGHT.played ? 1 : FLIGHT.prog); });
    FLIGHT.ro.observe(el);
  }

  const pageEl = i => modal.querySelector(`.am-page[data-page="${i}"]`);
  function showPage(i) {
    pageIdx = i; pagePending = null;
    modal.querySelectorAll('.am-page').forEach(p => { p.hidden = +p.dataset.page !== i; p.getAnimations().forEach(a => a.cancel()); });
    updateNav(); startRot();
  }
  function updateNav() {
    $('amCount').textContent = `${pages[pageIdx].title} · ${pageIdx + 1} of ${pages.length}`;
    modal.querySelectorAll('.st-dots i').forEach((d, i) => d.classList.toggle('on', i === pageIdx));
    const prev = $('amPrev'), next = $('amNext'), had = document.activeElement;
    prev.disabled = pageIdx === 0; next.disabled = pageIdx === pages.length - 1;
    if ((had === next && next.disabled) || (had === prev && prev.disabled)) (next.disabled ? prev : next).focus({ preventScroll: true });
  }
  // incoming page: picture/video slides in from the side, text rises a little after it
  function pageIn(dir, delay = 0) {
    const p = pageEl(pageIdx);
    if (pages[pageIdx].arrival && FLIGHT.arrived && !FLIGHT.arrivalShown) {   // just landed: photo and title appear softly
      FLIGHT.arrivalShown = true;
      return Promise.all([
        anim(p.querySelector('.pg-media'), [{ opacity: 0, transform: 'translateY(14px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 700, delay }),
        anim(p.querySelector('.pg-text'), [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 700, delay: delay + 150 })
      ]);
    }
    return Promise.all([
      pageIdx === 0 && curVideo() ? anim(p.querySelector('.pg-media'), [{ opacity: 0, transform: 'translateY(36px) scale(.96)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 520, delay }) : anim(p.querySelector('.pg-media'), [{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 420, delay }),
      pageIdx === 0 && curVideo()
        ? anim(p.querySelector('.pg-text'), [{ opacity: 0, transform: 'translateX(56px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 560, delay: delay + 260 })
        : anim(p.querySelector('.pg-text'), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, delay: delay + 100 })
    ]);
  }
  // fast clicks jump to the newest target; transitions never stack or overlap
  let pageMode = 'click';
  function goPage(step, mode = 'click') {
    pageMode = mode;
    const base = pagePending !== null ? pagePending : pageIdx;
    const to = Math.max(0, Math.min(pages.length - 1, base + step));
    if (to === base) return;
    pagePending = to;
    if (!pageBusy) runPages();
  }
  async function runPages() {
    pageBusy = true;
    while (pagePending !== null && pagePending !== pageIdx) {
      const to = pagePending, dir = to > pageIdx ? 1 : -1, out = pageEl(pageIdx);
      const leavingMeet = pageIdx === 0;
      if (out.querySelector('.flight')) finishFlight();             // never leaves a half-finished flight behind
      if (leavingMeet) pauseVideo();                            // leaving the video page pauses the video
      const swipe = pageMode === 'swipe';
      const fromT = out.style.transform || 'translateX(0)', fromO = out.style.opacity || '1';
      out.style.transform = ''; out.style.opacity = '';
      await anim(out, [{ opacity: +fromO, transform: fromT }, { opacity: 0, transform: `translateX(${-dir * (swipe ? 120 : 10)}px)` }],
        { duration: swipe ? 220 : 160, easing: swipe ? 'cubic-bezier(.4,0,.6,1)' : 'ease-out' });
      out.hidden = true; out.getAnimations().forEach(a => a.cancel());
      pageIdx = to; pageEl(to).hidden = false; updateNav(); startRot();
      modal.querySelector('.am-stage').scrollTop = 0;
      if (to === 0) enterMeet(40);
      if (swipe) {                                             // whole page glides in from the side it was pulled from
        const inc = pageEl(to);
        await Promise.all([anim(inc, [{ opacity: 0, transform: `translateX(${dir * 120}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 420 }), pageIn(dir, 60)]);
        inc.getAnimations().forEach(a => { if (a.effect && a.effect.target === inc) a.cancel(); });
      } else await pageIn(dir);
    }
    pagePending = null; pageBusy = false;
  }

  /* ---------------- video: no autoplay, sound on when started, pauses when you move on ---------------- */
  const curVideo = () => document.getElementById('vidEl');
  function pauseVideo() { const v = curVideo(); if (v) v.pause(); }
  window.__pauseIntroVideo = pauseVideo;
  async function autoplay() {
    const v = curVideo(); if (!v || !aboutIsOpen() || pageIdx !== 0 || editing()) return;
    if (reduceMotion.matches) return;                         // reduced motion: wait for the Play button
    const start = $('vidStart'), un = $('vidUnmute');
    start.hidden = true; v.controls = true;
    try { v.muted = false; await v.play(); un.hidden = true; }
    catch (_) {
      try { v.muted = true; await v.play(); un.hidden = false; }   // browser blocked sound: play muted
      catch (__) { start.hidden = false; v.controls = false; }      // blocked entirely: show Play
    }
  }
  function initVideo() {
    const v = curVideo(); if (!v) return;
    const un = $('vidUnmute');
    un.addEventListener('click', () => { v.muted = false; un.hidden = true; if (v.paused) v.play().catch(() => {}); });
    v.addEventListener('volumechange', () => { if (!v.muted) un.hidden = true; });
    const start = $('vidStart'), dur = $('vidDur'), err = $('vidError');
    const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    const fail = () => { err.hidden = false; start.hidden = true; };
    v.addEventListener('loadedmetadata', () => { if (isFinite(v.duration) && v.duration > 0) dur.textContent = fmt(v.duration); });  // real length only
    v.addEventListener('error', fail, true);
    v.querySelector('source').addEventListener('error', fail);
    start.addEventListener('click', e => {
      if (editing() && e.target.closest('[data-k]')) return;   // editing the label, not playing
      v.muted = false; start.hidden = true; v.controls = true;  // built-in controls: pause, sound, full screen
      const p = v.play(); if (p && p.catch) p.catch(() => {});
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseVideo(); });
  window.addEventListener('pagehide', pauseVideo);

  /* =====================================================================
     CONTACT — "After the Show": a pass-style card over the rink
     ===================================================================== */
  let cm = null, cmOpener = null, cmClosing = false, cmCopyT = null, cmGreet = null;
  const contactIsOpen = () => !!(cm && !cm.hidden) || !!cmGreet;
  const STAR = '<svg class="cm-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 16.9 6.4 20.5 8 13.7 3 9.3l6.4-.7z"/></svg>';
  const BLADE = '<svg class="cm-blade" viewBox="0 0 120 16" aria-hidden="true"><path d="M4 11 H104 Q114 11 116 5" fill="none" stroke-width="2.4" stroke-linecap="round"/><path d="M22 11 V6 M58 11 V6 M94 11 V6" stroke-width="2" stroke-linecap="round"/></svg>';
  function contactCardHTML() {
    const C = S.contact, K = C.card || {};
    const topics = (K.topics || '').split('·').map(t => t.trim()).filter(Boolean);
    const actions = [];
    if (C.linkedin) actions.push(`<a class="cm-btn primary" href="${esc(C.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">LinkedIn</a>`);
    if (C.email) actions.push(`<button type="button" class="cm-btn gold" id="cmMailBtn" aria-expanded="false" aria-controls="cmMail">Email me</button>`);
    if (C.cvLink) actions.push(`<a class="cm-btn" href="${esc(C.cvLink)}" target="_blank" rel="noopener noreferrer" aria-label="Download CV (opens in a new tab)">Download CV</a>`);
    return `
      <div class="cm-overlay" data-cm-close></div>
      <div class="cm-wrap">
        <div class="cm-swing">
          <div class="cm-lanyard" aria-hidden="true">
            <svg viewBox="0 0 120 70" preserveAspectRatio="none"><path class="strap" d="M8 0 L52 58"/><path class="strap" d="M112 0 L68 58"/></svg>
            <span class="cm-clip"></span>
          </div>
          <article class="cm-card" role="dialog" aria-modal="true" aria-labelledby="cmTitle" aria-describedby="cmInvite">
            <button type="button" class="cm-close" data-cm-close aria-label="Close contact card">✕</button>
            <span class="cm-slot" aria-hidden="true"></span>
            <p class="cm-kicker" aria-hidden="true">${STAR}${STAR.replace('cm-star','cm-star sm')}</p>
            <h2 id="cmTitle" tabindex="-1">${T('contact.card.heading')}</h2>
            <p class="cm-topics">${topics.map((t, i) => `<span>${esc(t)}</span>${i < topics.length - 1 ? '<i aria-hidden="true">·</i>' : ''}`).join('')}</p>
            <p class="cm-invite" id="cmInvite">${T('contact.card.invite')}</p>
            <div class="cm-profile">
              ${K.photo ? `<img src="${esc(K.photo)}" alt="Chloe Jeong" width="64" height="64">` : ''}
              <div><p class="cm-name">${T('hero.name')}</p><p class="cm-loc">${T('contact.card.location')}</p></div>
            </div>
            ${actions.length ? `<div class="cm-actions">${actions.join('')}</div>` : ''}
            ${C.email ? (() => { const to = encodeURIComponent(C.email); return `<div class="cm-mail" id="cmMail" hidden>
                <p>Write to me with:</p>
                <div class="cm-mail-opts">
                  <a class="cm-mopt" href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=${to}" target="_blank" rel="noopener noreferrer" aria-label="Gmail (opens in a new tab)">Gmail</a>
                  <a class="cm-mopt" href="https://outlook.office.com/mail/deeplink/compose?to=${to}" target="_blank" rel="noopener noreferrer" aria-label="Outlook (opens in a new tab)">Outlook</a>
                  <a class="cm-mopt" href="mailto:${esc(C.email)}" target="_blank" rel="noopener noreferrer">Mail app</a>
                </div>
              </div>`; })() : ''}
            ${C.email ? `<div class="cm-email">
                <span class="cm-addr" id="cmAddr">${esc(C.email)}</span>
                <button type="button" class="cm-copy" id="cmCopy">Copy email</button>
              </div>
              <p class="cm-status" id="cmStatus" aria-live="polite"></p>` : ''}
            ${BLADE}
          </article>
        </div>
      </div>`;
  }
  function wireContact() {
    const mb = $('cmMailBtn');
    if (mb) mb.addEventListener('click', () => {
      const m = $('cmMail'), open = m.hidden; m.hidden = !open; mb.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { anim(m, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200 }); m.querySelector('a').focus({ preventScroll: true }); m.scrollIntoView({ block: 'nearest' }); }
    });
    cm.querySelectorAll('[data-cm-close]').forEach(b => b.addEventListener('click', () => closeContact()));
    const copy = $('cmCopy');
    if (copy) copy.addEventListener('click', async () => {
      const addr = S.contact.email, status = $('cmStatus');
      clearTimeout(cmCopyT);
      try {
        await navigator.clipboard.writeText(addr);                    // only claim success if it worked
        status.textContent = 'Email copied'; copy.textContent = 'Copied'; copy.classList.add('done');
        cmCopyT = setTimeout(() => { copy.textContent = 'Copy email'; copy.classList.remove('done'); status.textContent = ''; }, 2200);
      } catch (_) {                                                   // fallback: select the address so it can be copied by hand
        const r = document.createRange(); r.selectNodeContents($('cmAddr'));
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        status.textContent = 'Press Ctrl+C (⌘C on Mac) to copy the selected address.';
      }
    });
  }
  function openContact(opener) {
    if (contactIsOpen() || cmClosing) return;                         // never two cards at once
    if (aboutIsOpen()) closeAbout();
    if (panel.open) panel.close();
    if (schoolPageOpen()) closeSchoolPage();
    if (projectPageOpen()) closeProject();
    if (expPageOpen()) closeExp();
    pauseVideo();
    cmOpener = opener && opener !== document.body ? opener : null;
    BG().forEach(el => el.inert = true); document.documentElement.classList.add('am-lock');
    // 1) the skater stops, the light warms up and she bows + waves; 2) then the card rises
    const wait = window.__rinkContact ? window.__rinkContact(true) : 0;
    if (wait > 0) { cmGreet = setTimeout(showContactCard, wait); return; }
    showContactCard();
  }
  function cancelGreet() {                                            // Esc during the bow: skip the card
    clearTimeout(cmGreet); cmGreet = null;
    if (window.__rinkContact) window.__rinkContact(false);
    BG().forEach(el => el.inert = false); document.documentElement.classList.remove('am-lock');
    if (cmOpener && document.contains(cmOpener)) cmOpener.focus({ preventScroll: true });
  }
  function showContactCard() {
    cmGreet = null;
    if (!cm) { cm = document.createElement('div'); cm.className = 'cm'; cm.hidden = true; document.body.appendChild(cm); }
    cm.innerHTML = contactCardHTML(); wireContact();
    cm.hidden = false;
    const wrap = cm.querySelector('.cm-swing');
    anim(cm.querySelector('.cm-overlay'), [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' });
    anim(wrap, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400 })
      .then(() => {
        if (reduceMotion.matches || !contactIsOpen()) return;
        anim(wrap, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(1.8deg)' }, { transform: 'rotate(-1.1deg)' }, { transform: 'rotate(0.5deg)' }, { transform: 'rotate(0deg)' }],
          { duration: 900, easing: 'ease-out' });                        // the lanyard swings once, then settles
      });
    $('cmTitle').focus({ preventScroll: true });
  }
  async function closeContact() {
    if (!cm || cm.hidden || cmClosing) return;
    cmClosing = true;
    await Promise.all([
      anim(cm.querySelector('.cm-overlay'), [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'linear' }),
      anim(cm.querySelector('.cm-swing'), [{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 200, easing: 'ease-in' })
    ]);
    cm.hidden = true; cmClosing = false;
    if (window.__rinkContact) window.__rinkContact(false);           // light and controls back to how they were
    if (!aboutIsOpen() && !schoolPageOpen()) { BG().forEach(el => el.inert = false); document.documentElement.classList.remove('am-lock'); }
    if (cmOpener && document.contains(cmOpener)) cmOpener.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', e => {
    if (cmGreet) { if (e.key === 'Escape') { e.preventDefault(); cancelGreet(); } return; }
    if (!contactIsOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); closeContact(); return; }
    if (e.key === 'Tab') {                                             // focus stays inside the card
      const f = [...cm.querySelectorAll('.cm-card a[href], .cm-card button:not([disabled]), .cm-card [contenteditable]')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!cm.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $('cmTitle'))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.openContact = openContact;

  /* ---------------- render everything ---------------- */
  function renderAll() {
    $('heroName').innerHTML = T('hero.name');
    $('heroTagline').innerHTML = T('hero.tagline');
    $('heroKeys').innerHTML = `${T('hero.status')}: ${joinList(S.hero.keywords.map((_, i) => `<strong>${T('hero.keywords.' + i)}</strong>`))}.`;
    $('heroBtn').innerHTML = T('hero.button');
    $('heroHint').innerHTML = T('hero.hint');
    Object.keys(SECTIONS).forEach(id => { $(id).innerHTML = sectionHTML(id); });
    document.querySelectorAll('[data-open-about]').forEach(b => b.addEventListener('click', () => openAbout(b, +b.dataset.openAbout || 0)));
    buildAboutModal();
    if (panel.open && panel.dataset.section) { $('panelTitle').innerHTML = T(SECTIONS[panel.dataset.section].title); $('panelBody').innerHTML = sectionHTML(panel.dataset.section, true); }
    else if (panel.open && panel.dataset.school) { $('panelBody').innerHTML = schoolHTML(+panel.dataset.school); }
    document.querySelectorAll('[data-school]').forEach(b => b.addEventListener('click', () => window.openSchoolPage(+b.dataset.school)));
    if (schoolPageOpen()) renderSchoolPage(spIdx);
  }
  renderAll();
  { const i0 = schoolFromHash(); if (i0 >= 0) setTimeout(() => window.openSchoolPage(i0, true), 300); }
  { const p0 = projectFromHash(); if (p0 >= 0) setTimeout(() => openProject(p0, null, true), 300); }
  { const e0 = expFromHash(); if (e0 >= 0) setTimeout(() => openExp(e0, null, true), 300); }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#contact"]');
    if (!a || editing() || a.closest('.am, .sp, .cm, dialog')) return;
    e.preventDefault(); openContact(a);
    if (a.hasAttribute('data-mail-open')) { const go = () => { const b = $('cmMailBtn'); if (b && $('cmMail').hidden) b.click(); }; cmGreet ? setTimeout(go, 2100) : go(); }
  });
  document.querySelectorAll('.topbar a[href="#about"]').forEach(a => { a.textContent = 'About Me'; });
  // menu About Me / Experience / Projects: the skater jumps on screen, the title appears at the landing, then the page scrolls
  const NAV_JUMPS = { about: ['2A', 'About Me'], experience: ['3Lo', 'Experience'], projects: ['3Lz', 'Projects'] };
  const goToSection = id => {
    const sec = $(id); if (!sec) return;
    sec.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (!sec.hasAttribute('tabindex')) sec.setAttribute('tabindex', '-1');
    sec.focus({ preventScroll: true });                              // keyboard and screen reader users land in the section too
    history.replaceState(null, '', '#' + id);
  };
  document.querySelectorAll('.topbar nav a').forEach(a => {
    const id = (a.getAttribute('href') || '').slice(1), J = NAV_JUMPS[id];
    if (!J) return;
    a.addEventListener('click', e => {
      if (editing() || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;   // new-tab clicks keep working
      e.preventDefault();
      const title = get(SECTIONS[id].title) || J[1];
      if (window.skateNav) window.skateNav.go(id, J[0], { title, navigate: () => goToSection(id) });
      else goToSection(id);
    });
  });

  // highlight the menu item of the section on screen
  const navLinks = [...document.querySelectorAll('.topbar nav a')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main .section').forEach(s => io.observe(s));

  /* =====================================================================
     OWNER TEXT EDITOR — only the site's owner sees "Edit text".
     Changes are saved into the page itself and published for every visitor.
     ===================================================================== */
  const overrides = Object.assign({}, window.SITE_OVERRIDES || {});
  let dirty = false, bar = null;
  function editorBar() {
    bar = document.createElement('div');
    bar.className = 'edit-bar'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Text editor');
    bar.innerHTML = `
      <button type="button" class="edit-toggle" id="editToggle">Edit text</button>
      <div class="edit-tools" hidden>
        <span class="edit-msg" id="editMsg" aria-live="polite">Click any text to change it.</span>
        <label class="edit-check"><input type="checkbox" id="editTodo"> Show "To add" boxes to visitors</label>
        <button type="button" class="edit-btn" id="editDiscard">Discard</button>
        <button type="button" class="edit-btn primary" id="editSave" disabled>Save &amp; publish</button>
      </div>`;
    document.body.appendChild(bar);
    $('editTodo').checked = !!S.showTodo;
    $('editToggle').addEventListener('click', () => setEditing(!editing()));
    $('editDiscard').addEventListener('click', () => { if (!dirty || confirmInline('Discard your changes?')) location.reload(); });
    $('editSave').addEventListener('click', save);
    $('editTodo').addEventListener('change', e => { overrides.showTodo = e.target.checked; S.showTodo = e.target.checked; markDirty(); });
  }
  let confirmArmed = false;
  function confirmInline(msg) {        // two clicks instead of a browser dialog (dialogs are blocked here)
    if (confirmArmed) return true;
    confirmArmed = true; $('editMsg').textContent = msg + ' Click Discard again.';
    setTimeout(() => { confirmArmed = false; }, 4000);
    return false;
  }
  function setEditing(on) {
    document.body.classList.toggle('editing', on);
    $('editToggle').textContent = on ? 'Stop editing' : 'Edit text';
    bar.querySelector('.edit-tools').hidden = !on;
    renderAll();
  }
  function markDirty() { dirty = true; $('editSave').disabled = false; $('editMsg').textContent = 'Unsaved changes.'; }

  document.addEventListener('click', e => {
    if (!editing()) return;
    const el = e.target.closest('[data-k]');
    if (!el) return;
    e.preventDefault(); e.stopPropagation();                  // don't follow links or open things while editing
    if (el.isContentEditable) return;
    try { el.contentEditable = 'plaintext-only'; } catch (_) { el.contentEditable = 'true'; }
    if (!el.isContentEditable) el.contentEditable = 'true';
    el.focus();
  }, true);
  document.addEventListener('input', e => {
    const el = e.target.closest && e.target.closest('[data-k]');
    if (!el || !editing()) return;
    const p = el.dataset.k, v = el.textContent.replace(/\s+/g, ' ').trim();
    overrides[p] = v; setPath(p, v); markDirty();
  });
  document.addEventListener('keydown', e => {
    const el = e.target.closest && e.target.closest('[data-k]');
    if (el && editing() && e.key === 'Enter') { e.preventDefault(); el.blur(); }
  });
  document.addEventListener('focusout', e => {
    const el = e.target.closest && e.target.closest('[data-k]');
    if (el && el.isContentEditable) { el.contentEditable = 'false'; el.removeAttribute('contenteditable'); }
  });

  async function save() {
    const msg = $('editMsg'), btn = $('editSave');
    btn.disabled = true; msg.textContent = 'Publishing…';
    try {
      const artifact = await window.claude.use('artifact');
      if (!artifact) throw new Error('unavailable');
      const tpl = await (await fetch('page-template.html', { cache: 'no-store' })).text();
      if (!tpl.includes('__TEXT_OVERRIDES__')) throw new Error('template');
      const json = JSON.stringify(overrides).replace(/</g, '\\u003c');
      await artifact.publish(tpl.replace('__TEXT_OVERRIDES__', json));   // the page reloads to the new version
      dirty = false; msg.textContent = 'Published. Reloading…';
    } catch (err) {
      btn.disabled = false;
      const code = err && (err.code || err.message || '');
      msg.textContent = /conflict/.test(code) ? 'Someone published a newer version. Reload and try again.'
        : /not_granted|not_writer/.test(code) ? 'Only the site owner can publish changes.'
        : 'Could not publish right now. Your changes are still here; try Save again.';
    }
  }
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  (async () => {
    try {
      if (window.__forceEditor) return editorBar();           // local testing only
      if (!window.claude || !window.claude.use) return;
      const user = await window.claude.use('user');
      if (user && user.isOwner && (await user.isOwner())) editorBar();
    } catch (_) {}
  })();
})();
