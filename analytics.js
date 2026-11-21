/* =====================================================================
   Private visitor analytics (Umami Cloud)
   ---------------------------------------------------------------------
   - Loads Umami only on the live site, and never when the visitor has
     opted out (Privacy link in the footer), sends Do Not Track or
     Global Privacy Control.
   - The URL hash is ignored, so in-page navigation (#about, #project-…)
     never creates extra page views: one page view per page load.
   - Custom events carry only short, fixed labels (section / project
     slugs, button names). No email addresses, names or free text.
   Events
     project_view     { project }               a project detail opens
     experience_view  { experience, via }       via "section": an entry of the Experience section was on screen
                                                for 3 active seconds; via "detail": an experience detail page opened
     project_time     { project, range, seconds }   active time in a project detail
     section_time     { section, range, seconds }   active time in About / Experience / Projects
     scroll_depth     { depth }                 25% / 50% / 75% / 100% of the page, once each
     contact_open     { from }                  the contact card opens
     email_click      { method, location }      gmail / outlook / mail_app / mailto / copy
     linkedin_click   { location }
     cv_download      { location }              (shows up once a CV link is set in content.js)
   Turn on console logging while testing:  localStorage.setItem('sa.debug', '1')
   ===================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    websiteId: '8af8ceb8-c600-446a-9900-c91f95106c7b',
    script: 'https://cloud.umami.is/script.js',
    liveHosts: ['jchh0606.github.io'],      // tracking runs only here (not on localhost or copies)
    sections: ['about', 'experience', 'projects'],
    minSectionSeconds: 5,                   // shorter glances are not reported
    minProjectSeconds: 3,
    idleAfterMs: 90 * 1000,                 // no scroll / mouse / key / touch for this long = not reading
    maxSecondsPerEvent: 30 * 60
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
    del(k) { try { localStorage.removeItem(k); } catch (_) {} }
  };
  const debug = store.get('sa.debug') === '1';
  const log = (...a) => { if (debug) console.log('[analytics]', ...a); };

  const optedOut = () => store.get('umami.disabled') !== null;     // Umami's own opt-out flag
  const browserSignal = () => navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const isLive = () => CONFIG.liveHosts.includes(location.hostname);
  const enabled = () => isLive() && !optedOut() && !browserSignal();

  /* ---------- loader ---------- */
  function loadUmami() {
    if (!enabled() || document.querySelector('script[data-website-id]')) return;
    const s = document.createElement('script');
    s.defer = true;
    s.src = CONFIG.script;
    s.dataset.websiteId = CONFIG.websiteId;
    s.dataset.domains = CONFIG.liveHosts.join(',');
    s.dataset.excludeHash = 'true';          // #about, #project-… do not become separate page views
    s.dataset.doNotTrack = 'true';
    document.head.appendChild(s);
  }

  /* ---------- sending (queued until the Umami script has loaded) ---------- */
  const queue = [];
  function track(name, data) {
    if (optedOut() || browserSignal()) return;                     // the visitor's choice always wins, even when debugging
    log(name, data);
    if (!isLive() && !debug) return;
    if (window.umami && typeof window.umami.track === 'function') {
      try { window.umami.track(name, data); } catch (_) {}
    } else if (queue.length < 50) {
      queue.push([name, data]);
    }
  }
  const flushQueue = setInterval(() => {
    if (!(window.umami && typeof window.umami.track === 'function')) return;
    clearInterval(flushQueue);
    while (queue.length) { const [n, d] = queue.shift(); try { window.umami.track(n, d); } catch (_) {} }
  }, 500);
  setTimeout(() => clearInterval(flushQueue), 30000);             // blocked by an ad blocker: give up quietly

  const label = v => String(v || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').slice(0, 60) || 'unknown';
  const range = s => s < 10 ? '0-10s' : s < 30 ? '10-30s' : s < 60 ? '30-60s' : s < 120 ? '1-2min' : s < 300 ? '2-5min' : '5min+';

  /* ---------- detail views (called from site.js when a detail page opens) ---------- */
  let detail = null;                       // { kind, slug, el, seconds }
  let lastView = { key: '', at: 0 };
  function view(kind, slug, el) {
    const s = label(slug), key = kind + ':' + s, t = Date.now();
    if (detail && (detail.kind !== kind || detail.slug !== s)) flushDetail();
    if (!detail || detail.slug !== s || detail.kind !== kind) detail = { kind, slug: s, el: el || null, seconds: 0 };
    if (lastView.key === key && t - lastView.at < 2000) return;   // same detail re-rendered: one view
    lastView = { key, at: t };
    track(kind + '_view', kind === 'experience' ? { experience: s, via: 'detail' } : { [kind]: s });
  }

  /* experience entries shown inline in the Experience section (01, 02 …):
     "viewed" once an entry fills half the screen for 3 active seconds (once per page load) */
  const entrySeconds = {}, entrySent = new Set();
  function entryLabel(sec) {
    const h = document.getElementById(sec.getAttribute('aria-labelledby') || '');
    const n = (sec.querySelector('.num') || {}).textContent || '';
    return label((n.trim() ? n.trim() + '-' : '') + (h ? h.textContent.trim() : sec.id || 'entry'));
  }
  function trackEntries(dt) {
    document.querySelectorAll('#experience .xpe > section.sec').forEach(sec => {
      const r = sec.getBoundingClientRect();
      const shown = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      if (!(shown >= innerHeight * 0.5 || (r.height > 0 && shown >= r.height * 0.8))) return;
      const key = entryLabel(sec);
      if (entrySent.has(key)) return;
      entrySeconds[key] = (entrySeconds[key] || 0) + dt;
      if (entrySeconds[key] >= 3) { entrySent.add(key); track('experience_view', { experience: key, via: 'section' }); }
    });
  }
  function flushDetail() {
    if (!detail) return;
    const secs = Math.min(Math.round(detail.seconds), CONFIG.maxSecondsPerEvent);
    if (detail.kind === 'project' && secs >= CONFIG.minProjectSeconds) {
      track('project_time', { project: detail.slug, range: range(secs), seconds: secs });
    }
    detail.seconds = 0;
  }

  /* ---------- active time ---------- */
  const sectionSeconds = {};
  let lastInput = Date.now();
  ['scroll', 'wheel', 'pointerdown', 'pointermove', 'keydown', 'touchstart'].forEach(ev =>
    addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true, capture: true }));

  const visible = () => document.visibilityState === 'visible';
  const notIdle = () => Date.now() - lastInput < CONFIG.idleAfterMs;
  const overlayOpen = () => document.documentElement.classList.contains('am-lock') || !!document.querySelector('dialog[open]');

  function sectionInView() {
    // the one section crossing a reading line 40% down the screen
    const line = innerHeight * 0.4;
    for (const id of CONFIG.sections) {
      const el = document.getElementById(id); if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line && r.height > 0) return id;
    }
    return null;
  }

  let lastTick = performance.now();
  function tick() {
    const now = performance.now(), dt = Math.min((now - lastTick) / 1000, 2.5);
    lastTick = now;
    if (detail && detail.el && (detail.el.hidden || !document.contains(detail.el))) { flushDetail(); detail = null; }
    if (!visible() || !notIdle()) return;
    if (detail && detail.el && !detail.el.hidden) { detail.seconds += dt; return; }
    if (overlayOpen()) return;
    const id = sectionInView();
    if (id) sectionSeconds[id] = (sectionSeconds[id] || 0) + dt;
    if (id === 'experience') trackEntries(dt);
  }
  setInterval(tick, 1000);

  function flushSections() {
    CONFIG.sections.forEach(id => {
      const secs = Math.min(Math.round(sectionSeconds[id] || 0), CONFIG.maxSecondsPerEvent);
      if (secs >= CONFIG.minSectionSeconds) track('section_time', { section: id, range: range(secs), seconds: secs });
      sectionSeconds[id] = 0;
    });
  }
  function flushAll() { tick(); flushDetail(); flushSections(); }
  document.addEventListener('visibilitychange', () => {
    if (visible()) lastTick = performance.now();              // time away is never counted
    else flushAll();
  });
  addEventListener('pagehide', flushAll);

  /* ---------- scroll depth ---------- */
  const depthsSent = new Set();
  let scrollRaf = 0;
  function checkDepth() {
    scrollRaf = 0;
    const doc = document.documentElement, max = doc.scrollHeight;
    if (!max) return;
    const seen = (scrollY + innerHeight) / max;
    [25, 50, 75, 100].forEach(p => {
      const reached = p === 100 ? scrollY + innerHeight >= max - 40 : seen >= p / 100;
      if (reached && !depthsSent.has(p)) { depthsSent.add(p); track('scroll_depth', { depth: p + '%' }); }
    });
  }
  addEventListener('scroll', () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(checkDepth); }, { passive: true });

  /* ---------- contact, email, LinkedIn and CV clicks ---------- */
  function where(el) {
    if (el.closest('.cm-card')) return 'contact_card';
    if (el.closest('#contact')) return 'contact_section';
    if (el.closest('#panel')) return 'rink_panel';
    if (el.closest('#about')) return 'about';
    if (el.closest('.topbar')) return 'menu';
    return 'other';
  }
  document.addEventListener('click', e => {
    const t = e.target && e.target.closest ? e.target : null; if (!t) return;
    const copy = t.closest('.cm-copy, .ct-copy');
    if (copy) return track('email_click', { method: 'copy', location: where(copy) });
    const a = t.closest('a[href]'); if (!a) return;
    const href = a.getAttribute('href') || '';
    const cv = window.SITE && window.SITE.contact && window.SITE.contact.cvLink;
    if (cv && href === cv) return track('cv_download', { location: where(a) });
    if (/linkedin\.com/i.test(href)) return track('linkedin_click', { location: where(a) });
    if (/mail\.google\.com/i.test(href)) return track('email_click', { method: 'gmail', location: where(a) });
    if (/outlook\.(office|live)\.com/i.test(href)) return track('email_click', { method: 'outlook', location: where(a) });
    if (/^mailto:/i.test(href)) return track('email_click', { method: a.closest('.cm-mail') ? 'mail_app' : 'mailto', location: where(a) });
  }, true);

  function contactOpen(opener) {
    const o = opener && opener.closest ? opener : null;
    const from = !o ? 'other' : o.closest('#rink') ? 'rink' : o.closest('.topbar') ? 'menu'
      : o.closest('.hero') ? 'hero' : o.closest('#contact') ? 'contact_section' : o.closest('#panel') ? 'rink_panel' : 'other';
    track('contact_open', { from });
  }

  /* ---------- privacy notice + opt-out (footer link) ---------- */
  function privacyUI() {
    const P = (window.SITE && window.SITE.privacy) || null;
    const foot = document.querySelector('body > footer.foot');
    if (!P || !foot || document.getElementById('privacyOpen')) return;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const btn = document.createElement('button');
    btn.type = 'button'; btn.id = 'privacyOpen'; btn.className = 'foot-link'; btn.textContent = P.link || 'Privacy';
    foot.append(document.createTextNode(' · '), btn);

    const dlg = document.createElement('dialog');
    dlg.className = 'panel privacy-panel'; dlg.id = 'privacyPanel'; dlg.setAttribute('aria-labelledby', 'privacyTitle');
    dlg.innerHTML = `
      <div class="panel-head">
        <h2 id="privacyTitle">${esc(P.title || 'Privacy')}</h2>
        <button type="button" class="panel-close" data-privacy-close aria-label="Close">✕</button>
      </div>
      <div class="panel-body">
        ${(P.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join('')}
        <p class="privacy-choice"><label><input type="checkbox" id="privacyOptOut"> ${esc(P.optOutLabel || 'Do not count my visits on this browser')}</label></p>
        <p class="privacy-status" id="privacyStatus" aria-live="polite"></p>
      </div>`;
    document.body.appendChild(dlg);
    const box = dlg.querySelector('#privacyOptOut'), status = dlg.querySelector('#privacyStatus');
    const refresh = () => {
      box.checked = optedOut() || browserSignal();
      box.disabled = browserSignal();
      status.textContent = browserSignal() ? (P.signalNote || 'Your browser asks sites not to track you, so your visits are not counted.') : '';
    };
    box.addEventListener('change', () => {
      if (box.checked) store.set('umami.disabled', '1'); else store.del('umami.disabled');
      status.textContent = box.checked ? (P.offNote || 'Your visits on this browser will not be counted.') : (P.onNote || 'Counting is back on for this browser.');
      if (!box.checked) loadUmami();
    });
    btn.addEventListener('click', () => { refresh(); if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', ''); });
    dlg.querySelector('[data-privacy-close]').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });   // click on the backdrop
  }

  window.SiteAnalytics = { view, contactOpen, track };
  loadUmami();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', privacyUI); else privacyUI();
})();
