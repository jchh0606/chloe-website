/* =====================================================================
   THE LITTLE ARENA — 3D rink, 360° camera, skater controls, explorable objects.
   오브젝트 이름·연결 섹션·피겨 기술은 아래 OBJECTS에서 바꿀 수 있어요.
   ===================================================================== */
(function () {
  const OBJECTS = [
    // move: 열 때 캐릭터가 보여주는 피겨 기술 (spiral / jump / eagle)
    { id: 'about',      label: 'My Story',   kind: 'fragment',      move: 'spiral' }, // floating memory fragment → opens the My Story view
    { id: 'experience', label: 'Experience', kind: 'constellation', move: 'jump' },   // small constellation
    { id: 'projects',   label: 'Projects',   kind: 'portal',        move: 'eagle' }   // glowing portal
  ];
  const MOVE_TIME = { spiral: 1.7, jump: 1.35, eagle: 1.7, axel: 1.7, wave: 2.0 };
  const CHAR_SCALE = 1.6;
  const NEAR_DISTANCE = 4.3;          // objects sit in the stands, just beyond the boards
  const IDLE_BEFORE_AUTO = 9;          // seconds without skater input before a short glide + spin
  const W = 22, D = 13, R = 2.6;       // rink size (bigger ice for the school logos)
  // spread around the arena, away from the headline in the top-left: [x, z, base height, facing]
  //   About Me: far stands, centre-right · Experience: right-end stands · Projects: near stands, left
  // My Story · Experience · Projects sit together in one block of stands: [x, z, base height, facing]
  // wide screens: the far stands, centre-right (clear of the intro text on the left), between the school banners
  // tall screens: the far end of the rink, either side of the tunnel
  const PLACE_WIDE = {
    fragment:      [2.4, -(D / 2 + 2.2), 1.05, 0],
    constellation: [6.4, -(D / 2 + 2.2), 1.05, 0],
    portal:        [10.2, -8.17, 1.05, -0.40]          // on the curve of the stands
  };
  const PLACE_TALL = {
    fragment:      [W / 2 + 2.2, -3.9, 1.05, -Math.PI / 2],
    constellation: [W / 2 + 2.9, 0, 1.55, -Math.PI / 2],   // floating above the tunnel entrance, a step higher
    portal:        [W / 2 + 2.2, 3.9, 1.05, -Math.PI / 2]
  };
  const PLACE = PLACE_WIDE;
  const TAP_MOVE_PX = 8;               // more than this = drag (camera), not a tap
  const DOUBLE_TAP_MS = 320;

  const rinkEl = document.getElementById('rink');
  const labelsEl = document.getElementById('labels');
  const canvas = document.getElementById('scene');
  const resetBtn = document.getElementById('resetView');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let navBusy = false;   // a menu jump is running: rink input waits
  const panelOpen = () => navBusy || !!(window.isPanelOpen && window.isPanelOpen());

  const openSection = id => {
    if (window.openPanel) return window.openPanel(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start' });
  };

  // HTML labels are real buttons: always upright and readable, work without 3D and with the keyboard
  let activate = o => openSection(o.id);
  // the three navigation objects have moved out of the arena into the hero text (site.js): no labels, no 3D objects
  const labelBtns = [].map(o => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'obj-label';
    b.innerHTML = `${o.label}<small>Open</small>`;
    b.setAttribute('aria-label', `Open ${o.label}`);
    b.addEventListener('pointerdown', e => e.stopPropagation());
    b.addEventListener('click', e => { e.stopPropagation(); activate(o); });
    b.addEventListener('pointerenter', () => { if (typeof setHoverFromLabel === 'function') setHoverFromLabel(o.id); });
    b.addEventListener('pointerleave', () => { if (typeof setHoverFromLabel === 'function') setHoverFromLabel(null); });
    labelsEl.appendChild(b);
    return b;
  });

  function fallback() {
    rinkEl.classList.add('no3d');
    rinkEl.removeAttribute('tabindex');
    rinkEl.setAttribute('aria-label', 'Ice rink illustration');
    if (resetBtn) resetBtn.hidden = true;
    const hint = document.getElementById('heroHint');
    if (hint) hint.textContent = 'Use the menu or scroll down to explore';
  }
  if (!window.THREE || !window.createCharacter) return fallback();
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); }
  catch (e) { return fallback(); }

  const mobileLike = window.matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileLike ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const NAVY = 0x0E1430;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NAVY);
  scene.fog = new THREE.Fog(NAVY, 34, 80);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight(0x8EA2FF, 0x0B1026, 0.55); scene.add(hemi);
  const fill = new THREE.DirectionalLight(0xBFD8FF, 0.22); fill.position.set(-6, 10, 8); scene.add(fill);
  const back = new THREE.DirectionalLight(0x9FB4FF, 0.18); back.position.set(6, 8, -10); scene.add(back);
  const spot = new THREE.SpotLight(0xFFD27A, 2.6, 40, 0.34, 0.8, 1.2);   // warm light on the skater
  spot.position.set(0, 13, 3); spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0005; spot.shadow.radius = 4;
  scene.add(spot, spot.target);
  const wash = new THREE.SpotLight(0xFFE3A0, 0.8, 50, 0.8, 1, 1); wash.position.set(0, 16, 0);
  scene.add(wash, wash.target);
  const faceLight = new THREE.PointLight(0xFFD9A0, 0.9, 7, 2);     // warm light on the face and dress from the viewer's side
  scene.add(faceLight);

  // ---------- helpers ----------
  function roundedRect(w, d, r) {
    const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // a closed solid ring around the rink (offset from the ice edge), from y0 up to y0+h
  function ringSolid(offIn, offOut, h, mat, y0 = 0) {
    const shape = roundedRect(W + 2 * offOut, D + 2 * offOut, R + offOut);
    shape.holes.push(roundedRect(W + 2 * offIn, D + 2 * offIn, R + offIn));
    const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 20 });
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, mat); m.position.y = y0; return m;
  }
  // evenly spaced points around the rink at an offset, with the direction facing the ice
  function aroundRink(off, spacing) {
    const shape = roundedRect(W + 2 * off, D + 2 * off, R + off);
    const len = shape.getLength(), n = Math.max(8, Math.floor(len / spacing));
    return shape.getSpacedPoints(n).slice(0, n).map(p => {
      const x = p.x, z = -p.y;
      const cx = THREE.MathUtils.clamp(x, -(W / 2 - R), W / 2 - R), cz = THREE.MathUtils.clamp(z, -(D / 2 - R), D / 2 - R);
      return { x, z, face: Math.atan2(cx - x, cz - z) };
    });
  }
  function iceTexture() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * D / W);
    const g = c.getContext('2d'), CW = c.width, CH = c.height;
    const grad = g.createRadialGradient(CW / 2, CH / 2, 10, CW / 2, CH / 2, CW * 0.6);
    grad.addColorStop(0, '#F4FBFF'); grad.addColorStop(1, '#C4E2F6');
    g.fillStyle = grad; g.fillRect(0, 0, CW, CH);
    g.strokeStyle = 'rgba(120,160,220,.22)'; g.lineWidth = 4;
    g.beginPath(); g.arc(CW / 2, CH / 2, CH * 0.16, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(CW / 2, 0); g.lineTo(CW / 2, CH); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 2;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 26; i++) {
      const x = rnd() * CW, y = rnd() * CH, r = 60 + rnd() * 220, a = rnd() * Math.PI * 2;
      g.globalAlpha = 0.25 + rnd() * 0.35; g.beginPath(); g.arc(x, y, r, a, a + 0.6 + rnd() * 1.4); g.stroke();
    }
    g.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function portalTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(128, 128, 4, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255,240,190,1)'); grad.addColorStop(0.35, 'rgba(255,201,60,.85)');
    grad.addColorStop(0.7, 'rgba(120,170,255,.55)'); grad.addColorStop(1, 'rgba(30,42,100,.2)');
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 3;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(128, 128, 30 + i * 18, i, i + 2.2); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  }
  const glowMat = (color, intensity) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.3 });
  const soft = (color, rough = 0.85) => new THREE.MeshStandardMaterial({ color, roughness: rough });

  // =====================================================================
  //  ARENA (built once). Everything is a closed solid, so no cut edges show from any side.
  // =====================================================================
  const arena = new THREE.Group(); scene.add(arena);
  const GATE_Z = 0;                                  // entrance on the +x end of the rink

  // room: floor, round wall and ceiling enclose the whole set
  const ROOM_R = 48, CEIL = 24;
  const floorShape = new THREE.Shape(); floorShape.absarc(0, 0, ROOM_R, 0, Math.PI * 2, false);
  floorShape.holes.push(roundedRect(W + 0.2, D + 0.2, R + 0.1));
  const floor = new THREE.Mesh(new THREE.ShapeGeometry(floorShape, 32), soft(0x141B3E, 1));
  floor.geometry.rotateX(-Math.PI / 2); floor.position.y = -0.02; floor.receiveShadow = true; arena.add(floor);
  const room = new THREE.Mesh(new THREE.CylinderGeometry(ROOM_R, ROOM_R, CEIL + 1, 48, 1, false),
    new THREE.MeshStandardMaterial({ color: 0x10173A, roughness: 1, side: THREE.BackSide }));
  room.position.y = CEIL / 2 - 0.5; arena.add(room);
  // faint warm lights dotted along the upper walls
  const wallDots = [];
  for (let i = 0; i < 90; i++) { const a = Math.random() * Math.PI * 2, y = 6 + Math.random() * 12; wallDots.push(Math.cos(a) * (ROOM_R - 0.5), y, Math.sin(a) * (ROOM_R - 0.5)); }
  const wdGeo = new THREE.BufferGeometry(); wdGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallDots, 3));
  arena.add(new THREE.Points(wdGeo, new THREE.PointsMaterial({ color: 0xFFD98A, size: 0.35, transparent: true, opacity: 0.5 })));

  // under-ice tone so the soft reflection sits on light ice
  const under = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(W, D, R), 12), new THREE.MeshBasicMaterial({ color: 0xA9CCEA }));
  under.geometry.rotateX(-Math.PI / 2); under.position.y = -2.4; arena.add(under);

  // ice
  const iceGeo = new THREE.ShapeGeometry(roundedRect(W, D, R), 16); iceGeo.rotateX(-Math.PI / 2);
  { const p = iceGeo.attributes.position, uv = iceGeo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / W + 0.5, 0.5 - p.getZ(i) / D); }
  const ice = new THREE.Mesh(iceGeo, new THREE.MeshStandardMaterial({ map: iceTexture(), roughness: 0.18, metalness: 0.05, transparent: true, opacity: 0.86 }));
  ice.receiveShadow = true; arena.add(ice);

  // boards + warm rail
  const boards = ringSolid(0, 0.25, 0.55, soft(0xF3F1EC, 0.5)); boards.castShadow = boards.receiveShadow = true; arena.add(boards);
  arena.add(ringSolid(-0.02, 0.27, 0.07, glowMat(0xFFC93C, 0.35), 0.55));

  // ---------- school logos ----------
  // order in content.js = importance. On the ice: logos only (1 centre, 2–3 front, 4–5 back), not clickable.
  // Every school also gets a banner up in the stands (built further down); those banners open the school's page.
  const SPONSORS = ((window.SITE && window.SITE.sponsors) || []).filter(sp => sp && sp.name);
  function loadImage(src) {
    return new Promise(res => { if (!src) return res(null); const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  }
  function textCanvas(txt, w, h, color) {               // fallback when a logo file is missing: the name as plain text
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
    let sz = Math.round(h * 0.5); g.font = `700 ${sz}px "Albert Sans", system-ui, sans-serif`;
    while (g.measureText(txt).width > w * 0.9 && sz > 10) { sz -= 2; g.font = `700 ${sz}px "Albert Sans", system-ui, sans-serif`; }
    g.fillText(txt, w / 2, h / 2); return c;
  }
  // a logo painted under the ice surface: keeps the logo's own shape, fitted inside maxW × maxH
  async function iceLogo(sp, x, z, maxW, maxH) {
    const img = await loadImage(sp.logo);
    const src = img || textCanvas(sp.short || sp.name, 1024, 256, 'rgba(31,42,90,.8)');
    const k = Math.min(maxW / src.width, maxH / src.height), w = src.width * k, h = src.height * k;
    const tex = new THREE.Texture(src); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4; tex.needsUpdate = true;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.004, z); m.renderOrder = 1; arena.add(m);
  }
  const ICE_SPOTS = [[0, 0, 3.8, 3.8], [-6.4, 3.4, 4.6, 1.8], [6.4, 3.4, 4.6, 1.8], [-6.4, -3.4, 4.6, 2.6], [6.4, -3.4, 4.6, 2.6]];
  SPONSORS.slice(0, ICE_SPOTS.length).forEach((sp, i) => iceLogo(sp, ...ICE_SPOTS[i]));

  // entrance gate in the boards (+x end): gate doors, posts, carpet and a tunnel through the stands
  const gate = new THREE.Group(); gate.position.set(W / 2 + 0.12, 0, GATE_Z); arena.add(gate);
  const doorMat = soft(0x2B3772, 0.6);
  [-1, 1].forEach(s => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.8), doorMat); door.position.set(0, 0.28, s * 0.42); gate.add(door);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12), glowMat(0xFFC93C, 0.5)); post.position.set(0, 0.45, s * 0.86); gate.add(post);
  });
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(6, 0.02, 1.4), soft(0x2E3B7E, 0.9)); carpet.position.set(3.2, 0.01, 0); gate.add(carpet);

  // stepped stands all the way round (closed rings), with a back wall + rail
  const STANDS = [];
  const tierMats = [0x1B2452, 0x1F295B, 0x232E63, 0x27336C].map(c => soft(c, 0.9));
  for (let i = 0; i < 4; i++) {
    const off = 1.0 + i * 1.15, h = 0.55 + i * 0.5;
    const tier = ringSolid(off, off + 1.15, h, tierMats[i]); tier.receiveShadow = true; arena.add(tier);
    STANDS.push({ off: off + 0.55, h });
  }
  const outerOff = 1.0 + 4 * 1.15;
  {                                                                                   // back wall: a little lighter at the top, darker at the foot
    const wall = ringSolid(outerOff, outerOff + 0.35, 2.9, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, vertexColors: true }));
    const pos = wall.geometry.attributes.position, col = new Float32Array(pos.count * 3);
    const lo = new THREE.Color(0x10173B), hi = new THREE.Color(0x1F295E), tmp = new THREE.Color();
    for (let k = 0; k < pos.count; k++) { tmp.copy(lo).lerp(hi, THREE.MathUtils.clamp(pos.getY(k) / 2.9, 0, 1)); col.set([tmp.r, tmp.g, tmp.b], k * 3); }
    wall.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3)); arena.add(wall);
  }
  arena.add(ringSolid(outerOff - 0.05, outerOff + 0.4, 0.06, glowMat(0xFFD584, 0.55), 2.9));   // the top edge doubles as a slim warm light line

  // tunnel mouth in the stands behind the gate (covers the stands at that spot)
  const tunnel = new THREE.Group(); tunnel.position.set(W / 2 + 0.25 + 1.0, 0, GATE_Z); arena.add(tunnel);
  const tunnelBox = new THREE.Mesh(new THREE.BoxGeometry(outerOff + 0.4, 2.4, 2.4), soft(0x121941, 0.9));
  tunnelBox.position.set((outerOff + 0.4) / 2 - 0.2, 1.2, 0); tunnel.add(tunnelBox);
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.8), new THREE.MeshBasicMaterial({ color: 0x05081A }));
  mouth.rotation.y = -Math.PI / 2; mouth.position.set(-0.21, 0.9, 0); tunnel.add(mouth);
  const archMat = glowMat(0xFFC93C, 0.6);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.06, 10, 32, Math.PI), archMat);
  arch.rotation.y = -Math.PI / 2; arch.position.set(-0.22, 1.8, 0); tunnel.add(arch);
  [-1, 1].forEach(s => { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 0.1), archMat); leg.position.set(-0.22, 0.9, s * 0.85); tunnel.add(leg); });

  // school banners above the back wall of the stands — click one to open that school's page
  const banners = [];
  {
    const off = outerOff - 0.1, BW = 1.9, BH = 2.3, BY = 2.9 + 0.25 + BH / 2;
    const far = -(D / 2 + off), endX = W / 2 + off;
    const spots = [[4.5, far, 0], [-0.8, far, 0], [8.3, far, 0], [-6.2, far, 0],          // far side, between the objects; most visible first
                   [-endX, -3.6, Math.PI / 2], [-endX, 3.6, Math.PI / 2],                  // left end
                   [endX, -2.3, -Math.PI / 2], [endX, 2.3, -Math.PI / 2]];                 // right end, either side of the tunnel
    const frameMat = soft(0x1B2452, 0.7), rodMat = glowMat(0xFFC93C, 0.4);
    SPONSORS.slice(0, spots.length).forEach((sp, i) => {
      const [x, z, ry] = spots[i];
      const c = document.createElement('canvas'); c.width = 512; c.height = 620;
      const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
      const paint = img => {
        const g = c.getContext('2d');
        g.fillStyle = '#FBFCFF'; g.fillRect(0, 0, 512, 620);
        g.fillStyle = '#FFC93C'; g.fillRect(0, 600, 512, 20);
        const src = img || textCanvas(sp.short || sp.name, 440, 160, '#1F2A5A');
        const k = Math.min(400 / src.width, 380 / src.height), w = src.width * k, h = src.height * k;
        g.drawImage(src, (512 - w) / 2, 60 + (380 - h) / 2, w, h);
        g.fillStyle = '#1F2A5A'; g.textAlign = 'center'; g.textBaseline = 'middle';
        let sz = 34; g.font = `700 ${sz}px "Albert Sans", system-ui, sans-serif`;
        while (g.measureText(sp.name).width > 470 && sz > 16) { sz -= 2; g.font = `700 ${sz}px "Albert Sans", system-ui, sans-serif`; }
        g.fillText(sp.name, 256, 530);
        tex.needsUpdate = true;
      };
      paint(null); loadImage(sp.logo).then(img => img && paint(img));
      const grp = new THREE.Group(); grp.position.set(x, BY, z); grp.rotation.y = ry; arena.add(grp);
      const back = new THREE.Mesh(new THREE.BoxGeometry(BW + 0.12, BH + 0.12, 0.06), frameMat); back.position.z = -0.04; grp.add(back);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissive: 0xFFE7A3, emissiveIntensity: 0 }));
      grp.add(face);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, BW + 0.5, 10), rodMat); rod.rotation.z = Math.PI / 2; rod.position.y = BH / 2 + 0.12; grp.add(rod);
      [-1, 1].forEach(sd => { const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3, 6), frameMat); cord.position.set(sd * BW * 0.4, BH / 2 + 1.6, 0); grp.add(cord); });
      face.userData.school = SPONSORS.indexOf(sp); back.userData.school = face.userData.school;
      banners.push({ grp, face, idx: face.userData.school, hover: 0, x, z, ry, BH });
    });
  }
  const bannerHits = banners.flatMap(b => [b.face, b.grp.children[0]]);
  const bannerLabel = document.createElement('button');
  bannerLabel.type = 'button'; bannerLabel.className = 'obj-label school-label'; bannerLabel.hidden = true;
  bannerLabel.addEventListener('pointerdown', e => e.stopPropagation());
  bannerLabel.style.pointerEvents = 'none';   // the name tag is information only
  labelsEl.appendChild(bannerLabel);
  let hoverBanner = null, hoverObj = null;
  var setHoverFromLabel = id => { hoverObj = id ? objects.find(o => o.def.id === id) || null : null; };

  // ---------- boards around the ice: places I have worked (click → that experience) ----------
  const RINKCFG = (window.SITE && window.SITE.rink) || {};
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const boardPanels = [];
  {
    const list = (RINKCFG.boards || []).filter(b => b && b.name).slice(0, 10);
    const per = Math.ceil(list.length / 2), PW = 2.8, PH = 0.44, GAP = 0.55;
    list.forEach((bd, i) => {
      const far = i < per, k = far ? i : i - per, n = far ? per : list.length - per;
      const x = (k - (n - 1) / 2) * (PW + GAP);
      const c = document.createElement('canvas'); c.width = 1280; c.height = 200;
      const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
      const paint = img => {
        const g = c.getContext('2d');
        let bg = '#FFFFFF';
        if (img) {                                                     // the board takes the logo's own background colour
          const t = document.createElement('canvas'); t.width = img.width; t.height = img.height;
          const tg = t.getContext('2d'); tg.drawImage(img, 0, 0); const d = tg.getImageData(2, 2, 1, 1).data; bg = `rgb(${d[0]},${d[1]},${d[2]})`;
        }
        g.fillStyle = bg; g.fillRect(0, 0, 1280, 200);
        const src = img || textCanvas(bd.text || bd.name, 1160, 150, '#1F2A5A');
        const s = Math.min(1160 / src.width, 168 / src.height), w = src.width * s, h = src.height * s;
        g.drawImage(src, (1280 - w) / 2, (200 - h) / 2, w, h);
        tex.needsUpdate = true;
      };
      paint(null); loadImage(bd.logo).then(img => img && paint(img));
      const face = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      face.position.set(x, 0.29, far ? -D / 2 + 0.014 : D / 2 - 0.014);
      if (!far) face.rotation.y = Math.PI;
      face.userData.board = bd; arena.add(face);
      boardPanels.push({ face, bd, hover: 0 });
    });
  }
  const boardHits = boardPanels.map(b => b.face);

  // ---------- flags lowered from the ceiling, like a medal ceremony ----------
  function drawFlag(code, g, w, h) {
    const bands = (cols, vertical) => cols.forEach((col, i) => { g.fillStyle = col; vertical ? g.fillRect(i * w / cols.length, 0, w / cols.length + 1, h) : g.fillRect(0, i * h / cols.length, w, h / cols.length + 1); });
    if (code === 'DE') return bands(['#000000', '#DD0000', '#FFCE00']);
    if (code === 'FR') return bands(['#0055A4', '#FFFFFF', '#EF4135'], true);
    if (code === 'LT') return bands(['#FDB913', '#006A44', '#C1272D']);
    if (code === 'LU') return bands(['#EF3340', '#FFFFFF', '#00A3E0']);
    if (code === 'PL') return bands(['#FFFFFF', '#DC143C']);
    if (code === 'PT') {
      g.fillStyle = '#006600'; g.fillRect(0, 0, w * 0.4, h); g.fillStyle = '#FF0000'; g.fillRect(w * 0.4, 0, w * 0.6, h);
      const cx = w * 0.4, cy = h / 2, r = h * 0.21;                   // simplified emblem: armillary ring + shield
      g.strokeStyle = '#FFE000'; g.lineWidth = h * 0.045; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#FFFFFF'; g.strokeStyle = '#FF0000'; g.lineWidth = h * 0.02;
      g.beginPath(); g.moveTo(cx - r * 0.5, cy - r * 0.55); g.lineTo(cx + r * 0.5, cy - r * 0.55); g.lineTo(cx + r * 0.5, cy + r * 0.15);
      g.quadraticCurveTo(cx + r * 0.5, cy + r * 0.6, cx, cy + r * 0.7); g.quadraticCurveTo(cx - r * 0.5, cy + r * 0.6, cx - r * 0.5, cy + r * 0.15); g.closePath(); g.fill(); g.stroke();
      return;
    }
    if (code === 'GB') {
      g.fillStyle = '#012169'; g.fillRect(0, 0, w, h);
      const line = (x1, y1, x2, y2, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); };
      line(0, 0, w, h, '#FFFFFF', h * 0.2); line(w, 0, 0, h, '#FFFFFF', h * 0.2);
      line(0, 0, w, h, '#C8102E', h * 0.067); line(w, 0, 0, h, '#C8102E', h * 0.067);
      g.fillStyle = '#FFFFFF'; g.fillRect(w / 2 - h / 6, 0, h / 3, h); g.fillRect(0, h / 3, w, h / 3);
      g.fillStyle = '#C8102E'; g.fillRect(w / 2 - h / 10, 0, h / 5, h); g.fillRect(0, h * 0.4, w, h / 5);
      return;
    }
    if (code === 'KR') {
      g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = h / 4, ang = Math.atan2(2, 3);   // taegeuk tilted along the flag's diagonal
      g.save(); g.translate(cx, cy); g.rotate(ang);
      g.fillStyle = '#CD2E3A'; g.beginPath(); g.arc(0, 0, R, Math.PI, 0); g.fill();
      g.fillStyle = '#0047A0'; g.beginPath(); g.arc(0, 0, R, 0, Math.PI); g.fill();
      g.fillStyle = '#CD2E3A'; g.beginPath(); g.arc(-R / 2, 0, R / 2, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#0047A0'; g.beginPath(); g.arc(R / 2, 0, R / 2, 0, Math.PI * 2); g.fill();
      g.restore();
      // trigrams: ☰ top-left, ☵ top-right, ☲ bottom-left, ☷ bottom-right (true = solid bar)
      const tri = [[-1, -1, [1, 1, 1]], [1, -1, [0, 1, 0]], [-1, 1, [1, 0, 1]], [1, 1, [0, 0, 0]]];
      const bw = R, bh = R / 6, gap = R / 12, dist = R * 1.5;
      g.fillStyle = '#000000';
      tri.forEach(([sx, sy, bars]) => {
        const a = Math.atan2(sy * h, sx * w);
        g.save(); g.translate(cx + Math.cos(a) * (R + dist * 0.55), cy + Math.sin(a) * (R + dist * 0.55)); g.rotate(a + Math.PI / 2);
        bars.forEach((solid, j) => {
          const y = (j - 1) * (bh + gap) - bh / 2;
          if (solid) g.fillRect(-bw / 2, y, bw, bh); else { g.fillRect(-bw / 2, y, bw * 0.45, bh); g.fillRect(bw * 0.05, y, bw * 0.45, bh); }
        });
        g.restore();
      });
      return;
    }
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
  }
  const flagsList = (RINKCFG.flags || []).filter(f => f && f.code);
  const flags = [];
  let flagWire = null, flagsTall = null;
  const FLAG_W = 1.35, FLAG_H = 0.9, FLAG_Z = -(D / 2 - 0.5), FLAG_TOP = 8.5, WIRE_Y = 13.2, FLAG_X0 = -0.4, FLAG_X1 = 10.9;   // right half, above the banners, clear of the intro text
  if (flagsList.length) {
    const wireMat = soft(0x3A4370, 0.6);
    // phones (tall screens) look along the rink from the -x end, so the row hangs across the far +x end instead
    const tall = rinkEl.clientWidth / Math.max(1, rinkEl.clientHeight) < 0.9;
    flagWire = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, (tall ? D : W) + 2, 8), wireMat);
    const wire = flagWire;
    if (tall) { wire.rotation.x = Math.PI / 2; wire.position.set(W / 2 - 1.2, WIRE_Y, 0); } else { wire.rotation.z = Math.PI / 2; wire.position.set(0, WIRE_Y, FLAG_Z); }
    arena.add(wire); flagsTall = tall;
    flagsList.forEach((f, i) => {
      const n = flagsList.length, a0 = tall ? -(D / 2 - 1) : FLAG_X0, a1 = tall ? D / 2 - 1 : FLAG_X1;
      const x = n > 1 ? a0 + i * (a1 - a0) / (n - 1) : (a0 + a1) / 2;
      const c = document.createElement('canvas'); c.width = 480; c.height = 320; drawFlag(f.code, c.getContext('2d'), 480, 320);
      const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
      const geo = new THREE.PlaneGeometry(FLAG_W, FLAG_H, 12, 1);
      const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, side: THREE.DoubleSide, emissive: 0xFFFFFF, emissiveMap: tex, emissiveIntensity: 0.12 }));
      const grp = new THREE.Group(); arena.add(grp);
      if (tall) { grp.position.set(W / 2 - 1.2, FLAG_TOP, x); grp.rotation.y = -Math.PI / 2; } else grp.position.set(x, FLAG_TOP, FLAG_Z);
      cloth.position.y = -FLAG_H / 2; grp.add(cloth);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, FLAG_W + 0.16, 8), glowMat(0xFFC93C, 0.4)); bar.rotation.z = Math.PI / 2; grp.add(bar);
      const cords = [-1, 1].map(s => { const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 5), wireMat); cd.position.x = s * FLAG_W * 0.42; grp.add(cd); return cd; });
      const schoolIdx = f.school ? SPONSORS.findIndex(sp => sp.name === f.school) : -1;
      cloth.userData.flag = flags.length;
      flags.push({ grp, cloth, cords, f, schoolIdx, base: geo.attributes.position.array.slice(), drop: 0, delay: 0.4 + i * 0.18, hover: 0, x });
    });
  }
  const flagHits = flags.map(fl => fl.cloth);
  // the flag row follows the screen shape: along the far side on wide screens, across the far end on tall ones.
  // Re-applied when the shape changes after the scene was built (page opened in a resizing frame, phone rotated, window resized).
  function layoutFlags(tall) {
    if (!flags.length || tall === flagsTall) return;
    flagsTall = tall;
    const n = flags.length, a0 = tall ? -(D / 2 - 1) : FLAG_X0, a1 = tall ? D / 2 - 1 : FLAG_X1;
    flagWire.rotation.set(tall ? Math.PI / 2 : 0, 0, tall ? 0 : Math.PI / 2);
    flagWire.scale.y = ((tall ? D : W) + 2) / (((flagWire.geometry.parameters || {}).height) || 1);
    if (tall) flagWire.position.set(W / 2 - 1.2, WIRE_Y, 0); else flagWire.position.set(0, WIRE_Y, FLAG_Z);
    flags.forEach((fl, i) => {
      const x = n > 1 ? a0 + i * (a1 - a0) / (n - 1) : (a0 + a1) / 2;
      const y = fl.grp.position.y;
      if (tall) { fl.grp.position.set(W / 2 - 1.2, y, x); fl.grp.rotation.set(0, -Math.PI / 2, 0); }
      else { fl.grp.position.set(x, y, FLAG_Z); fl.grp.rotation.set(0, 0, 0); }
      fl.x = x;
    });
  }
  let flagsT = -1;                                                   // starts when the rink is first drawn
  function updateFlags(dt, calm) {
    if (!flags.length) return;
    if (flagsT < 0) flagsT = 0; else flagsT += dt;
    flags.forEach((fl, i) => {
      const k = calm ? 1 : Math.min(1, Math.max(0, (flagsT - fl.delay) / 2.2));
      const e = 1 - Math.pow(1 - k, 3);                               // eased lowering
      const y = FLAG_TOP + (WIRE_Y - 0.15 - FLAG_TOP) * (1 - e);
      fl.grp.position.y = y;
      const len = WIRE_Y - y; fl.cords.forEach(cd => { cd.scale.y = Math.max(0.01, len); cd.position.y = len / 2; });
      fl.hover += ((fl === hoverFlag ? 1 : 0) - fl.hover) * Math.min(1, dt * 8);
      fl.cloth.material.emissiveIntensity = 0.12 + fl.hover * 0.35;
      if (!calm) {                                                    // gentle ripple, a little stronger while it is still moving
        const p = fl.cloth.geometry.attributes.position, b = fl.base, amp = 0.025 + (1 - e) * 0.05;
        for (let v = 0; v < p.count; v++) {
          const bx = b[v * 3], by = b[v * 3 + 1];
          p.setZ(v, Math.sin(t * 1.6 + bx * 2.2 + i) * amp * ((FLAG_H / 2 - by) / FLAG_H));   // top edge stays on the bar
        }
        p.needsUpdate = true;
      }
    });
  }
  let hoverFlag = null, hoverBoard = null;
  const extraLabel = document.createElement('button');
  extraLabel.type = 'button'; extraLabel.className = 'obj-label school-label'; extraLabel.hidden = true;
  extraLabel.addEventListener('pointerdown', e => e.stopPropagation());
  extraLabel.style.pointerEvents = 'none';   // the name tag is information only
  labelsEl.appendChild(extraLabel);

  // ---------- the arena name on the front wall of the near stands (fixed, no motion, not clickable) ----------
  // The city list stays in content.js (rink.cities) for later use elsewhere; it is no longer drawn here.
  const cityMarks = [];
  let routeCurve = null, comet = null;
  {
    const TEXT = 'CHLOE JEONG ARENA';
    const FACE_Z = D / 2 + outerOff + 0.35, LETTER_H = 0.42, SIGN_Y = 2.12;      // front face of the wall, straight part
    const MAX_W = 2 * (W / 2 - R) * 0.62;                                         // stays well inside the flat part of the wall
    const c = document.createElement('canvas'), PX = 160, PAD = 40;
    const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
    const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.55, metalness: 0,
      emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.32, polygonOffset: true, polygonOffsetFactor: -2 });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    sign.position.set(0, SIGN_Y, FACE_Z + 0.006); arena.add(sign);
    const paint = () => {
      const g = c.getContext('2d'), font = `700 ${PX}px "Albert Sans", system-ui, sans-serif`;
      g.font = font; if ('letterSpacing' in g) g.letterSpacing = `${Math.round(PX * 0.2)}px`;
      const tw = Math.ceil(g.measureText(TEXT).width);
      c.width = tw + PAD * 2; c.height = Math.round(PX * 1.5);
      g.font = font; if ('letterSpacing' in g) g.letterSpacing = `${Math.round(PX * 0.2)}px`;
      g.textAlign = 'left'; g.textBaseline = 'middle';
      const x = PAD, y = c.height / 2 + PX * 0.04;
      g.fillStyle = 'rgba(4,7,22,.55)'; g.fillText(TEXT, x + 4, y + 6);            // shallow cast shadow: letters set slightly off the wall
      const grad = g.createLinearGradient(0, y - PX / 2, 0, y + PX / 2);           // warm ivory, a touch lighter on top
      grad.addColorStop(0, '#FBF4E4'); grad.addColorStop(1, '#E2D6BC');
      g.fillStyle = grad; g.fillText(TEXT, x, y);
      tex.needsUpdate = true;
      const h = LETTER_H * c.height / PX; let w = h * c.width / c.height;
      const k = w > MAX_W ? MAX_W / w : 1;                                           // never stretched, only scaled down evenly
      sign.scale.set(w * k, h * k, 1);
    };
    paint(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint);
  }
  const cityHits = cityMarks.map(cm => cm.hit);
  let hoverCity = null;
  function updateSky(dt, calm) {
    if (comet) {
      if (calm) comet.visible = false;
      else { const u = Math.min(0.999, Math.max(0, ((t / 14) % 1) || 0)); comet.visible = true; routeCurve.getPoint(u, comet.position); }   // a small light travels the route, slowly
    }
    cityMarks.forEach(cm => { const on = cm === hoverCity; cm.star.scale.setScalar(THREE.MathUtils.lerp(cm.star.scale.x, on ? 1.7 : 1, Math.min(1, dt * 8))); });
  }

  // seats (one instanced mesh) + a few simple audience silhouettes (two instanced meshes)
  const seatSpots = [];
  STANDS.forEach((s, i) => aroundRink(s.off, 0.62).forEach(p => {
    if (p.x > W / 2 && Math.abs(p.z - GATE_Z) < 1.5) return;        // leave the tunnel clear
    seatSpots.push({ ...p, y: s.h, row: i });
  }));
  const seatGeo = new THREE.BoxGeometry(0.44, 0.32, 0.38); seatGeo.translate(0, 0.16, 0);
  const seats = new THREE.InstancedMesh(seatGeo, soft(0xffffff, 0.8), seatSpots.length);
  const dummy = new THREE.Object3D(), col = new THREE.Color();
  seatSpots.forEach((p, i) => {
    dummy.position.set(p.x, p.y, p.z); dummy.rotation.set(0, p.face, 0); dummy.updateMatrix();
    seats.setMatrixAt(i, dummy.matrix);
    seats.setColorAt(i, col.set(p.row % 2 ? 0x3A4C9A : 0x31418A));
  });
  arena.add(seats);
  const people = [];
  let seed2 = 11; const rnd2 = () => (seed2 = (seed2 * 16807) % 2147483647) / 2147483647;
  seatSpots.forEach(p => { if (rnd2() < 0.07) people.push(p); });
  const bodyGeo = new THREE.CylinderGeometry(0.13, 0.2, 0.5, 10); bodyGeo.translate(0, 0.55, 0);
  const headGeo = new THREE.SphereGeometry(0.13, 12, 10); headGeo.translate(0, 0.92, 0);
  const bodies = new THREE.InstancedMesh(bodyGeo, soft(0xffffff, 0.9), people.length);
  const heads = new THREE.InstancedMesh(headGeo, soft(0xffffff, 0.9), people.length);
  const tones = [0x6C7BC4, 0x8A79B8, 0x5F8FB0, 0x9AA6D6, 0x7E6FA8];
  people.forEach((p, i) => {
    dummy.position.set(p.x, p.y, p.z); dummy.rotation.set(0, p.face, 0); dummy.updateMatrix();
    bodies.setMatrixAt(i, dummy.matrix); heads.setMatrixAt(i, dummy.matrix);
    bodies.setColorAt(i, col.set(tones[i % tones.length])); heads.setColorAt(i, col.set(0x2A3060));
  });
  arena.add(bodies, heads);

  // lighting rig above the rink: truss frame, lamp fixtures and soft light cones
  const truss = new THREE.Group(); truss.position.y = 11; arena.add(truss);
  const trussMat = soft(0x3A4370, 0.6);
  [[W + 2, 0, -(D / 2 + 1)]].forEach(([len, x, z]) =>   // far beam only: a near beam would cut across the flags in the start view
    { const b = new THREE.Mesh(new THREE.BoxGeometry(len, 0.25, 0.25), trussMat); b.position.set(x, 0, z); truss.add(b); });
  [[-(W / 2 + 1)], [W / 2 + 1]].forEach(([x]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, D + 2), trussMat); b.position.set(x, 0, 0); truss.add(b); });
  [-1, 1].forEach(s => { const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, CEIL - 11, 6), trussMat); cable.position.set(s * (W / 2 + 1), (CEIL - 11) / 2, 0); truss.add(cable); });
  const lampMat = glowMat(0xFFE2A0, 1.2), coneMat = new THREE.MeshBasicMaterial({ color: 0xFFE2A0, transparent: true, opacity: 0.032, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  [[-6, -(D / 2 + 1)], [0, -(D / 2 + 1)], [6, -(D / 2 + 1)], [-6, D / 2 + 1, 1], [6, D / 2 + 1, 1]].forEach(([x, z, sideOnly], i) => {
    if (sideOnly) return;   // near-side lamps removed with the near beam
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.45, 14), trussMat); lamp.position.set(x, -0.35, z); truss.add(lamp);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.24, 14), lampMat); lens.rotation.x = Math.PI / 2; lens.position.set(x, -0.58, z); truss.add(lens);
    if (i % 2 === 0) {   // a few visible beams, kept subtle
      const len = 11;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6, len, 20, 1, true), coneMat);
      cone.geometry.translate(0, -len / 2, 0);              // apex at the lamp, opening downward
      cone.position.set(x, -0.6, z); cone.rotation.x = z < 0 ? -0.32 : 0.32;   // tilted toward the ice
      truss.add(cone);
    }
  });

  // drifting sparkles over the ice (sparse)
  const sp = [];
  for (let i = 0; i < 70; i++) sp.push((Math.random() - 0.5) * (W + 2), 0.8 + Math.random() * 6, (Math.random() - 0.5) * (D + 2));
  const spGeo = new THREE.BufferGeometry(); spGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const sparkles = new THREE.Points(spGeo, new THREE.PointsMaterial({ color: 0xFFF1C2, size: 0.07, transparent: true, opacity: 0.75, depthWrite: false }));
  arena.add(sparkles);

  // skate-mark pool + click marker
  const marks = [];
  { const g = new THREE.PlaneGeometry(0.03, 0.26); g.rotateX(-Math.PI / 2);
    for (let i = 0; i < 120; i++) {
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
      m.position.y = 0.006; m.userData.life = 0; arena.add(m); marks.push(m);
    } }
  const marker = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.24, 40), new THREE.MeshBasicMaterial({ color: 0xFFD66B, transparent: true, opacity: 0, depthWrite: false }));
  marker.geometry.rotateX(-Math.PI / 2); marker.position.y = 0.01; arena.add(marker);
  let markerFade = 0;

  // ---------- explorable objects (kept low and toward the edges so they never fill the screen) ----------
  // About / Experience / Projects sit up in the far stands: [x, z, base height]
  const objects = [].map((def, i) => {
    const [x, z, base, face] = PLACE[def.kind];
    const g = new THREE.Group(); g.position.set(x, base, z); g.rotation.y = face; arena.add(g);
    const o = { def, group: g, anchor: new THREE.Vector3(x, base, z), hit: [], near: false, glow: 0, label: labelBtns[i] };
    const light = new THREE.PointLight(0xFFC93C, 0.6, 5, 2); g.add(light); o.light = light;
    if (def.kind === 'fragment') {
      const holder = new THREE.Group(); holder.position.y = 1.35; g.add(holder);
      const mat = new THREE.MeshStandardMaterial({ color: 0xFFE7A3, emissive: 0xFFC93C, emissiveIntensity: 0.35, roughness: 0.15, metalness: 0.1, flatShading: true, transparent: true, opacity: 0.92 });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), mat); crystal.scale.set(1, 1.35, 1); crystal.castShadow = true; holder.add(crystal);
      const shards = [];
      for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.TetrahedronGeometry(0.1), mat); holder.add(s); shards.push(s); }
      light.position.y = 1.35; o.labelY = 2.4; o.hit.push(crystal); o.mats = [mat];
      o.anim = (t, calm) => {
        holder.position.y = 1.35 + (calm ? 0 : Math.sin(t * 1.3) * 0.12);
        if (!calm) crystal.rotation.y = t * 0.6;
        shards.forEach((s, k) => { const a = (calm ? 0 : t * 0.9) + k * 2.1; s.position.set(Math.cos(a) * 0.7, Math.sin(a * 1.3) * 0.2, Math.sin(a) * 0.7); s.rotation.set(a, a, 0); });
      };
    }
    if (def.kind === 'constellation') {
      const holder = new THREE.Group(); holder.position.y = 2.6; g.add(holder);
      const mat = glowMat(0xFFF1C2, 0.9);
      const pts = [[-1.4, -0.2, 0.1], [-0.8, 0.35, -0.2], [-0.2, 0.1, 0.2], [0.35, 0.55, -0.1], [0.9, 0.2, 0.25], [1.45, 0.5, -0.15], [0.6, -0.35, 0.1]];
      const stars = pts.map(p => { const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.1), mat); s.position.set(...p); holder.add(s); return s; });
      const lineMat = new THREE.LineBasicMaterial({ color: 0xFFC93C, transparent: true, opacity: 0.5 });
      holder.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([0, 1, 2, 3, 4, 5, 4, 6, 2].map(k => new THREE.Vector3(...pts[k]))), lineMat));
      const hitBox = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 1.2), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      holder.add(hitBox); o.hit.push(hitBox);
      light.position.y = 2.3; o.labelY = 3.6; o.mats = [mat]; o.lineMat = lineMat;
      o.anim = (t, calm) => {
        holder.position.y = 2.6 + (calm ? 0 : Math.sin(t * 0.9) * 0.1);
        if (!calm) holder.rotation.y = Math.sin(t * 0.2) * 0.4;
        stars.forEach((s, k) => s.scale.setScalar(calm ? 1 : 0.8 + 0.35 * Math.abs(Math.sin(t * 1.6 + k))));
      };
    }
    if (def.kind === 'portal') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.16, 40), soft(0x2B3772, 0.5));
      base.position.y = 0.08; base.castShadow = base.receiveShadow = true; g.add(base);
      const ringMat = glowMat(0xFFC93C, 0.55);
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.1, 20, 64), ringMat); torus.position.y = 1.08; torus.castShadow = true; g.add(torus);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.74, 48), new THREE.MeshBasicMaterial({ map: portalTexture(), transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      disc.position.y = 1.08; g.add(disc);
      light.position.set(0, 1.1, 0.6); o.labelY = 2.3; o.hit.push(torus, disc); o.mats = [ringMat];
      o.anim = (t, calm) => { if (!calm) disc.rotation.z = -t * 0.5; };
    }
    return o;
  });

  // ---------- cute effects: a little burst of stars when an object is opened ----------
  const BURST_N = 48;
  const burstGeo = new THREE.BufferGeometry();
  burstGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(BURST_N * 3), 3));
  burstGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(BURST_N * 3), 3));
  const burstPts = new THREE.Points(burstGeo, new THREE.PointsMaterial({ size: 0.5, vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending }));
  burstPts.frustumCulled = false; scene.add(burstPts);
  const sparks = [];   // { p: Vector3, v: Vector3, life }
  const BURST_COLORS = [0xFFD54F, 0xFFFFFF, 0xFF9EB5, 0xBFE3FF].map(c => new THREE.Color(c));
  function burst(at) {
    for (let i = 0; i < 28; i++) {
      const a = Math.random() * Math.PI * 2, up = 2 + Math.random() * 3, sp = 1.6 + Math.random() * 2.4;
      sparks.push({ p: at.clone(), v: new THREE.Vector3(Math.cos(a) * sp, up, Math.sin(a) * sp), life: 1, c: BURST_COLORS[i % 4] });
    }
    while (sparks.length > BURST_N) sparks.shift();
  }
  function updateSparks(dt) {
    const pa = burstGeo.attributes.position, ca = burstGeo.attributes.color;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.life -= dt / 1.2; s.v.y -= 4.5 * dt; s.p.addScaledVector(s.v, dt);
      if (s.life <= 0) sparks.splice(i, 1);
    }
    for (let i = 0; i < BURST_N; i++) {
      const s = sparks[i];
      if (s) { pa.setXYZ(i, s.p.x, s.p.y, s.p.z); ca.setXYZ(i, s.c.r * s.life, s.c.g * s.life, s.c.b * s.life); }
      else { pa.setXYZ(i, 0, -50, 0); ca.setXYZ(i, 0, 0, 0); }
    }
    pa.needsUpdate = true; ca.needsUpdate = true;
  }

  // ---------- character + soft reflection ----------
  const hero = createCharacter(THREE);
  hero.root.scale.setScalar(CHAR_SCALE); scene.add(hero.root);
  const mirror = createCharacter(THREE);
  mirror.root.scale.set(CHAR_SCALE, -CHAR_SCALE, CHAR_SCALE);
  mirror.root.traverse(o => { o.castShadow = false; });
  scene.add(mirror.root);

  // =====================================================================
  //  CAMERA: orbit around the rink centre (360° horizontal, limited vertical, zoom)
  // =====================================================================
  const cam = { az: 0, el: 0.46, r: 22, tAz: 0, tEl: 0.46, tR: 22 };
  // zoom range is set from the default framing in startView(): about 0.62x (closest) to 1.12x (farthest) of the start distance
  const ZOOM_IN = 0.62, ZOOM_OUT = 1.12, CLOSE_R = 4.2;
  let R_MIN = 13.5; const EL_MIN = THREE.MathUtils.degToRad(7), EL_MAX_ABS = THREE.MathUtils.degToRad(72);
  let R_MAX = 30, START = { az: 0, el: 0.46, r: 22 };
  const camTarget = new THREE.Vector3(0, 2.2, 0);
  let closeness = 0;
  let camTouched = false;   // set once the visitor drags, pinches or zooms; until then every resize re-frames the view

  function startView() {
    const w = rinkEl.clientWidth, h = rinkEl.clientHeight, aspect = w / h;
    const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * aspect);
    const portrait = aspect < 0.9;
    // on tall screens look along the rink's long side so the skater is bigger
    const az = portrait ? -Math.PI / 2 : 0;          // tunnel stays at the far end, not in front
    const halfAcross = (portrait ? D / 2 + 0.8 : W / 2 + 1.4);
    const r = (halfAcross / Math.tan(hf / 2) + (portrait ? W / 2 : D / 2) * 0.6)
      * (portrait ? (aspect < 0.6 ? 1.0 : 1.16) : 1.13);   // phones are already wide enough                     // a little wider than a tight fit: more of the arena, skater still clear
    const el = THREE.MathUtils.degToRad(portrait ? 30 : 25);
    R_MIN = r * ZOOM_IN; R_MAX = r * ZOOM_OUT;
    return { az, el, r };
  }
  const maxElFor = r => Math.min(EL_MAX_ABS, Math.asin(Math.min(1, (CEIL - 2 - camTarget.y) / r)));
  const minElFor = r => EL_MIN + THREE.MathUtils.smoothstep(r, 12, 26) * THREE.MathUtils.degToRad(14);
  function clampCam() {
    cam.tR = THREE.MathUtils.clamp(cam.tR, R_MIN, R_MAX);
    cam.tEl = THREE.MathUtils.clamp(cam.tEl, minElFor(cam.tR), maxElFor(cam.tR));
  }
  function resetView(instant) {
    cam.tAz = START.az; cam.tEl = START.el; cam.tR = START.r;
    // take the short way round
    cam.az = cam.tAz + Math.atan2(Math.sin(cam.az - cam.tAz), Math.cos(cam.az - cam.tAz));
    if (instant || reduceMotion.matches) { cam.az = cam.tAz; cam.el = cam.tEl; cam.r = cam.tR; }
  }
  if (resetBtn) resetBtn.addEventListener('click', e => { e.stopPropagation(); camTouched = false; resetView(false); });
  resetBtn && resetBtn.addEventListener('pointerdown', e => e.stopPropagation());

  function updateCamera(dt, heroPos) {
    const k = reduceMotion.matches ? 1 : Math.min(1, dt * 10);
    const kr = reduceMotion.matches ? 1 : Math.min(1, dt * 6);          // zoom eases in a little more slowly than rotation
    cam.az += (cam.tAz - cam.az) * k; cam.el += (cam.tEl - cam.el) * k; cam.r += (cam.tR - cam.r) * kr;
    // when zoomed in close, aim at the skater so her face and dress fill the view
    closeness = THREE.MathUtils.smoothstep(cam.r, CLOSE_R, CLOSE_R + 7);   // only below the zoom range, so the view stays centred on the arena
    closeness = 1 - closeness;
    const tx = heroPos.x * closeness, tz = heroPos.z * closeness, ty = THREE.MathUtils.lerp(2.2, 1.9, closeness);
    camTarget.x += (tx - camTarget.x) * Math.min(1, dt * 4); camTarget.z += (tz - camTarget.z) * Math.min(1, dt * 4); camTarget.y = ty;
    const ce = Math.cos(cam.el);
    camera.position.set(camTarget.x + Math.sin(cam.az) * ce * cam.r, camTarget.y + Math.sin(cam.el) * cam.r, camTarget.z + Math.cos(cam.az) * ce * cam.r);
    camera.lookAt(camTarget);
    camera.updateMatrixWorld();                         // labels are placed with the camera's current position
  }

  // =====================================================================
  //  SKATER STATE
  // =====================================================================
  const pos = new THREE.Vector2(0, D * 0.15), vel = new THREE.Vector2();
  let yaw = 0, yawVel = 0, target = null, keys = new Set(), stillTime = 0, restFacing = 0, backwardFor = 0;
  let idleTime = 0, auto = null, lastMark = pos.clone(), heroY = 0;
  let perf = null;     // current element { type, id, time, dur, dir, faceYaw, startYaw }
  const MAX = 4.2, ACC = 6, DEC = 2.6;

  function clampToRink(p) {
    const ix = W / 2 - 0.7, iz = D / 2 - 0.7, r = Math.max(0.2, R - 0.7);
    let hit = false;
    if (Math.abs(p.x) > ix) { p.x = Math.sign(p.x) * ix; hit = true; }
    if (Math.abs(p.y) > iz) { p.y = Math.sign(p.y) * iz; hit = true; }
    const cx = ix - r, cz = iz - r;
    if (Math.abs(p.x) > cx && Math.abs(p.y) > cz) {
      const ox = Math.sign(p.x) * cx, oz = Math.sign(p.y) * cz, dx = p.x - ox, dz = p.y - oz, l = Math.hypot(dx, dz);
      if (l > r) { p.x = ox + dx / l * r; p.y = oz + dz / l * r; hit = true; }
    }
    return hit;
  }
  function skaterInput() { idleTime = 0; if (auto) { auto = null; yawVel *= 0.3; } }
  // heading for an element: keep going if there is room, otherwise head toward the middle
  function safeHeading(preferred) {
    const d = new THREE.Vector2(Math.sin(preferred), Math.cos(preferred));
    const ahead = pos.clone().addScaledVector(d, 4.5);
    if (Math.abs(ahead.x) < W / 2 - 1 && Math.abs(ahead.y) < D / 2 - 1) return preferred;
    return Math.atan2(-pos.x, -pos.y + 0.0001);
  }

  const OBJ_JUMPS = { about: '2A', experience: '3Lo', projects: '3Lz' };
  activate = def => {
    if (window.skateNav && OBJ_JUMPS[def.id]) {                 // same jump as the menu, then the pop-up opens
      const ob = objects.find(o => o.def === def || o.def.id === def.id);
      if (ob && !reduceMotion.matches) { ob.sv = (ob.sv || 0) + 7; burst(ob.group.localToWorld(new THREE.Vector3(0, ob.labelY * 0.6, 0))); }
      openSection(def.id);                                       // the pop-up opens straight away
      window.skateNav.go(def.id, OBJ_JUMPS[def.id], { title: def.label, navigate: () => {} });   // the jump plays behind it
      return;
    }
    if (perf) return;
    const ob = objects.find(o => o.def === def || o.def.id === def.id);
    if (ob && !reduceMotion.matches) { ob.sv = (ob.sv || 0) + 7; burst(ob.group.localToWorld(new THREE.Vector3(0, ob.labelY * 0.6, 0))); }
    if (reduceMotion.matches) return openSection(def.id);       // reduced motion: open straight away
    startElement(def.move || 'spiral', def.id);
  };
  function startElement(type, id) {
    target = null; auto = null; idleTime = 0; keys.clear(); markerFade = Math.min(markerFade, 0.99);
    const moving = vel.length() > 0.5;
    let heading;
    if (type === 'spiral' || type === 'eagle') {
      // glide across the current view so the visitor sees the shape from the side
      const side = Math.sin(cam.az + Math.PI / 2), sideZ = Math.cos(cam.az + Math.PI / 2);
      const toward = pos.x * side + pos.y * sideZ > 0 ? -1 : 1;
      heading = Math.atan2(side * toward, sideZ * toward);
    } else heading = moving ? Math.atan2(vel.x, vel.y) : yaw;
    heading = safeHeading(heading);
    perf = { type, id, time: 0, dur: MOVE_TIME[type] || 1.5, dir: heading, faceYaw: cam.az, baseYaw: yaw };
  }
  function finishPerf(open = true) {
    if (!perf) return;
    const p = perf; perf = null; yawVel = 0; heroY = 0;
    if (p.type === 'axel' || (window.SKATE_JUMPS && window.SKATE_JUMPS[p.type])) backwardFor = 1.1;   // lands skating backwards
    if (p.onDone) p.onDone(open);
    if (open && p.id) openSection(p.id);
  }

  // =====================================================================
  //  INPUT: tap = move / open, drag = rotate camera, pinch / wheel = zoom
  // =====================================================================
  const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const icePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitPoint = new THREE.Vector3();
  const pointers = new Map();
  let gesture = null;          // { id, x0, y0, t0, dragging, pinchDist, midY }
  let lastTap = { t: 0, x: 0, y: 0 };

  function handleTap(clientX, clientY) {
    if (panelOpen()) return;
    const now = performance.now();
    const isDouble = now - lastTap.t < DOUBLE_TAP_MS && Math.hypot(clientX - lastTap.x, clientY - lastTap.y) < 40;
    lastTap = isDouble ? { t: 0, x: 0, y: 0 } : { t: now, x: clientX, y: clientY };
    if (perf) { if (perf.id) finishPerf(); return; }             // a tap during an element skips to the panel
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    // objects first: opening one never also moves the skater
    const hits = raycaster.intersectObjects(objects.flatMap(o => o.hit), false);
    if (hits.length) { const o = objects.find(o => o.hit.includes(hits[0].object)); if (o) return activate(o.def); }
    const bannerHit = raycaster.intersectObjects(bannerHits, false)[0];
    if (bannerHit) return;                                            // school banners only show their name on hover
    if (raycaster.intersectObjects(flagHits, false)[0]) return;          // flags only show their name on hover: a tap on one does nothing
    if (raycaster.ray.intersectPlane(icePlane, hitPoint)) {
      const p = new THREE.Vector2(hitPoint.x, hitPoint.z);
      if (Math.abs(p.x) > W / 2 + 0.3 || Math.abs(p.y) > D / 2 + 0.3) return;   // outside the rink
      clampToRink(p); target = p; skaterInput();
      marker.position.set(p.x, 0.01, p.y); markerFade = 1; marker.material.opacity = 0.75;
    }
  }

  rinkEl.addEventListener('pointerdown', e => {
    if (panelOpen()) return;
    if (e.isPrimary) pointers.clear();                 // never keep a pointer from an earlier gesture
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      gesture = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lx: e.clientX, ly: e.clientY, t0: performance.now(), dragging: false, touch: e.pointerType !== 'mouse' };
      if (e.pointerType === 'mouse') { try { rinkEl.setPointerCapture(e.pointerId); } catch (_) {} }
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      gesture = { pinch: true, dist: Math.hypot(a.x - b.x, a.y - b.y), midY: (a.y + b.y) / 2 };
    }
  });
  rinkEl.addEventListener('pointermove', e => {
    if (e.pointerType === 'mouse' && !gesture) {                       // pointer cursor over clickable logo boards
      const rr = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rr.left) / rr.width) * 2 - 1, -((e.clientY - rr.top) / rr.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hb = raycaster.intersectObjects(bannerHits, false)[0];
      hoverBanner = hb ? banners.find(b => b.idx === hb.object.userData.school) : null;
      const ho = raycaster.intersectObjects(objects.flatMap(o => o.hit), false)[0];
      hoverObj = ho ? objects.find(o => o.hit.includes(ho.object)) : null;
      const hf = raycaster.intersectObjects(flagHits, false)[0];
      const hc = raycaster.intersectObjects(cityHits, false)[0];
      hoverCity = hc && !hf ? cityMarks[hc.object.userData.city] : null;
      hoverFlag = hf ? flags[hf.object.userData.flag] : null;
      hoverBoard = null;   // the boards are decoration only: no hover, no click
      rinkEl.classList.toggle('over-logo', !!hoverObj);
    }
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (gesture.pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y), midY = (a.y + b.y) / 2;
      camTouched = true; cam.tR *= gesture.dist / Math.max(1, dist);                          // pinch zoom
      cam.tEl += (midY - gesture.midY) * 0.005;                            // two-finger up/down tilts
      gesture.dist = dist; gesture.midY = midY; clampCam(); return;
    }
    if (gesture.id !== e.pointerId) return;
    const dx = e.clientX - gesture.lx, dy = e.clientY - gesture.ly;
    if (!gesture.dragging && Math.hypot(e.clientX - gesture.x0, e.clientY - gesture.y0) > TAP_MOVE_PX) {
      gesture.dragging = true; rinkEl.classList.add('dragging');
    }
    if (gesture.dragging) {
      camTouched = true; cam.tAz -= dx * 0.0065;
      if (!gesture.touch) cam.tEl += dy * 0.005;                           // phones: vertical swipe scrolls the page
      clampCam();
    }
    gesture.lx = e.clientX; gesture.ly = e.clientY;
  });
  function endPointer(e, cancelled) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (gesture && !gesture.pinch && gesture.id === e.pointerId) {
      const quick = performance.now() - gesture.t0 < 600;
      if (!cancelled && !gesture.dragging && quick) handleTap(e.clientX, e.clientY);   // a drag never becomes a move
      gesture = null; rinkEl.classList.remove('dragging');
    } else if (gesture && gesture.pinch && pointers.size < 2) {
      gesture = null;                                                       // ending a pinch never taps
    }
  }
  rinkEl.addEventListener('pointerup', e => endPointer(e, false));
  rinkEl.addEventListener('pointercancel', e => endPointer(e, true));     // e.g. the page started scrolling
  rinkEl.addEventListener('lostpointercapture', e => endPointer(e, true));
  rinkEl.addEventListener('click', e => e.preventDefault());

  // wheel / trackpad zooms gently; at the zoom limits the page scrolls normally.
  // Each event's step is capped so fast flicks and trackpad momentum can't jump the camera, and a gesture that
  // reaches a limit is held for a moment so its leftover momentum doesn't spill into page scrolling or page zoom.
  let wheelHoldUntil = 0;
  rinkEl.addEventListener('wheel', e => {
    if (panelOpen()) return;
    const now = performance.now();
    let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    dy *= e.ctrlKey ? 2.2 : 0.55;                                   // pinch (ctrlKey) sends small steps; mouse wheels large ones
    dy = THREE.MathUtils.clamp(dy, -40, 40);
    const zoomingOut = dy > 0;
    const atLimit = (zoomingOut && cam.tR >= R_MAX - 0.01) || (!zoomingOut && cam.tR <= R_MIN + 0.01);
    if (atLimit) { if (now < wheelHoldUntil) e.preventDefault(); return; }   // brief hold only; not extended, so the page scrolls again right after
    e.preventDefault(); wheelHoldUntil = now + 250;
    camTouched = true; cam.tR *= Math.exp(dy * 0.0012); clampCam();
  }, { passive: false });

  // arrow keys move the skater relative to the screen (only while the rink has focus)
  const KEYS = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  rinkEl.addEventListener('keydown', e => {
    if (panelOpen()) return;
    if (KEYS[e.key]) { e.preventDefault(); keys.add(e.key); target = null; skaterInput(); if (perf && !perf.id) finishPerf(false); }
    else if (e.key === 'Enter' || e.key === ' ') {
      const near = objects.find(o => o.near);
      if (near) { e.preventDefault(); activate(near.def); }
    } else if (e.key === 'j' || e.key === 'J') { if (!perf && !reduceMotion.matches) { skaterInput(); startElement('axel', null); } }
    else if (e.key === 'Escape') target = null;
  });
  rinkEl.addEventListener('keyup', e => keys.delete(e.key));
  rinkEl.addEventListener('blur', () => keys.clear());

  function placeObjects(place) {
    objects.forEach(o => {
      const [x, z, base, face] = place[o.def.kind];
      o.group.position.set(x, base, z); o.group.rotation.y = face; o.anchor.set(x, base, z);
    });
  }

  // ---------- resize ----------
  let lastPortrait = null;
  function resize() {
    const w = rinkEl.clientWidth, h = rinkEl.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const portrait = w / h < 0.9;
    // framing only (same angle): wide screens slide the arena right of the intro text; tall screens move it down below the text
    const wide = w / h > 1.7;                           // 16:9 and wider: the front-wall sign would sit on the hint, so keep it below the fold
    const offX = portrait ? 0 : -Math.round(w * (wide ? 0.09 : 0.07));
    const offY = portrait ? -Math.round(h * 0.16) : Math.round(h * (wide ? -0.02 : 0.045));
    camera.setViewOffset(w, h, offX, offY, w, h);
    START = startView();
    layoutFlags(portrait);
    if (portrait !== lastPortrait) { lastPortrait = portrait; placeObjects(portrait ? PLACE_TALL : PLACE_WIDE); resetView(true); }
    else if (!camTouched) resetView(true);              // the frame settled on a new size before anyone moved the camera: use the framing for this size
    clampCam();
  }
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(rinkEl);   // the rink can change size without a window resize (e.g. inside an embedding frame)
  const initSize = [rinkEl.clientWidth, rinkEl.clientHeight];
  resize();

  // =====================================================================
  //  LOOP
  // =====================================================================
  let running = true, last = performance.now(), t = 0;
  new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) { last = performance.now(); requestAnimationFrame(frame); } }).observe(rinkEl);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && running) { last = performance.now(); requestAnimationFrame(frame); } });

  const tmp = new THREE.Vector2(), proj = new THREE.Vector3(), camFwd = new THREE.Vector3(), heroPos3 = new THREE.Vector3();
  const springTo = (want, dt, stiff, damp) => {
    const diff = Math.atan2(Math.sin(want - yaw), Math.cos(want - yaw));
    yawVel += (diff * stiff - yawVel * damp) * dt; yaw += yawVel * dt;
  };

  function step(dt) {
    const calm = reduceMotion.matches;
    // ----- desired velocity -----
    const desired = new THREE.Vector2();
    let element = null;
    if (perf) {
      perf.time += dt;
      const p = Math.min(1, perf.time / perf.dur);
      element = { type: perf.type, p };
      const dx = Math.sin(perf.dir), dz = Math.cos(perf.dir);
      const NJ = window.SKATE_JUMPS && window.SKATE_JUMPS[perf.type];
      const sp = NJ ? (p < NJ.air ? 2.7 : p < NJ.land ? 2.4 : THREE.MathUtils.lerp(2.1, 0.8, (p - NJ.land) / (1 - NJ.land))) :
        perf.type === 'wave' ? 0 : perf.type === 'spiral' ? 2.6 : perf.type === 'eagle' ? 2.2 : perf.type === 'axel' ? (p < 0.72 ? 3.0 : 1.8) : (p < 0.7 ? 2.0 : 1.2);
      desired.set(dx * sp, dz * sp);
      if (perf.onPhase) perf.onPhase(p);
      if (p >= 1) finishPerf();
    } else if (keys.size) {
      // screen-relative: "up" = away from the camera, "right" = screen right
      camera.getWorldDirection(camFwd); camFwd.y = 0; camFwd.normalize();
      let f = 0, s = 0; keys.forEach(k => { s += KEYS[k][0]; f += KEYS[k][1]; });
      desired.set(camFwd.x * f - camFwd.z * s, camFwd.z * f + camFwd.x * s);
      if (desired.lengthSq()) desired.normalize().multiplyScalar(MAX);
    } else if (target) {
      tmp.subVectors(target, pos); const d = tmp.length();
      if (d < 0.06) target = null;
      else desired.copy(tmp.normalize().multiplyScalar(Math.min(MAX, Math.sqrt(2 * DEC * d) * 0.95)));
    } else if (auto && auto.phase === 'glide') {
      const l = Math.max(0.5, pos.length()), R0 = Math.min(W, D) * 0.28;
      desired.set(-pos.y / l, pos.x / l).multiplyScalar(2.2).add(tmp.set(pos.x / l, pos.y / l).multiplyScalar((R0 - l) * 0.9));
    }
    const speeding = desired.lengthSq() > vel.lengthSq() * 0.98;
    const rate = (speeding ? ACC : DEC) * dt;
    tmp.subVectors(desired, vel);
    if (tmp.length() <= rate) vel.copy(desired); else vel.add(tmp.setLength(rate));
    pos.addScaledVector(vel, dt);
    if (clampToRink(pos)) vel.multiplyScalar(0.5);
    const speed = vel.length();

    // ----- facing -----
    const spinning = !!(auto && auto.phase === 'spin');
    stillTime = speed < 0.12 && !keys.size ? stillTime + dt : 0;
    if (stillTime > 0 && stillTime - dt <= 0) restFacing = cam.az;     // when she stops, face the view at that moment
    backwardFor = Math.max(0, backwardFor - dt);
    if (element) {
      const p = element.p;
      if (element.type === 'wave' && perf) {                          // quick upright spin, ends facing the viewer
        const q = Math.min(1, p / 0.9), e = q * q * (3 - 2 * q);
        const lead = Math.atan2(Math.sin(perf.faceYaw - perf.baseYaw), Math.cos(perf.faceYaw - perf.baseYaw));
        yaw = perf.baseYaw + e * (Math.PI * 2 * 4 + lead); yawVel = 0; heroY = 0;   // 4 turns, smooth start and stop
      }
      const NJ = window.SKATE_JUMPS && window.SKATE_JUMPS[element.type];
      const airborne = (element.type === 'jump' || element.type === 'axel') && p > 0.24 && p < 0.72;
      if (NJ && perf) {
        if (p < NJ.air) {                                              // approach: forward (axel) or backward (loop, lutz)
          springTo(perf.dir + (NJ.back ? Math.PI : 0), dt, 40, 11); perf.baseYaw = yaw; heroY = 0;
        } else if (p < NJ.land) {                                      // in the air: steady counter-clockwise turns on an arc
          const q = (p - NJ.air) / (NJ.land - NJ.air);
          yaw = perf.baseYaw + q * Math.PI * 2 * NJ.turns; yawVel = 0;
          heroY = Math.sin(q * Math.PI) * NJ.h;
        } else { heroY = 0; springTo(perf.dir + Math.PI, dt, 40, 11); }  // landed backwards: exit glide
      } else if (airborne) {
        const q = (p - 0.24) / 0.48;
        const turns = element.type === 'axel' ? 2.5 : 2;               // double axel: 2½ turns, forward take-off
        yaw = perf ? perf.baseYaw + q * Math.PI * 2 * turns : yaw; yawVel = 0;
        heroY = Math.sin(q * Math.PI) * (element.type === 'axel' ? 1.05 : 0.85);
      } else if (element.type !== 'wave' && !NJ) {
        heroY = 0;
        let want;
        if (element.type === 'spiral') want = perf ? perf.dir : yaw;            // profile toward the viewer
        else if (element.type === 'axel') want = perf ? (p < 0.5 ? perf.dir : perf.dir + Math.PI) : yaw;
        else want = perf ? perf.faceYaw : yaw;                                   // eagle & jump: face the viewer
        springTo(want, dt, 40, 11);
        if (perf && p <= 0.24) perf.baseYaw = yaw;
      }
    } else if (spinning) {
      const k = auto.time / 2.2;
      yawVel = Math.sin(Math.min(1, k) * Math.PI) * 12; yaw += yawVel * dt;
    } else {
      let want = null;
      if (speed > 0.15) want = Math.atan2(vel.x, vel.y) + (backwardFor > 0 ? Math.PI : 0);
      else if (stillTime > 1.2) want = restFacing;
      if (want !== null) springTo(want, dt, speed > 0.15 ? 28 : 10, speed > 0.15 ? 10 : 6);
      else { yawVel *= Math.max(0, 1 - dt * 6); yaw += yawVel * dt; }
    }
    const lean = element || spinning ? 0 : THREE.MathUtils.clamp(yawVel / 5, -1, 1) * Math.min(1, speed / MAX);
    if (!element) heroY = 0;

    // ----- automatic skating: only after a quiet period of skater input (camera moves don't count) -----
    const quiet = !perf && !keys.size && !target && speed < 0.1 && !panelOpen();
    if (!auto) idleTime = quiet ? idleTime + dt : 0;
    if (!calm && !auto && idleTime > IDLE_BEFORE_AUTO) auto = { phase: 'glide', time: 0 };
    if (auto) {
      if (calm || panelOpen()) { auto = null; idleTime = 0; }
      else {
        auto.time += dt;
        if (auto.phase === 'glide' && auto.time > 5) auto = { phase: 'slow', time: 0 };
        else if (auto.phase === 'slow' && speed < 0.25) auto = { phase: 'spin', time: 0 };
        else if (auto.phase === 'spin' && auto.time >= 2.2) { auto = null; idleTime = 0; yawVel = 0; }
      }
    }

    // ----- blade marks + click marker -----
    if (pos.distanceTo(lastMark) > 0.3 && speed > 0.7 && heroY < 0.02) {
      const dir = Math.atan2(vel.x, vel.y), nx = Math.cos(dir) * 0.11, nz = -Math.sin(dir) * 0.11;
      [1, -1].forEach(side => {
        const m = marks.find(m => m.userData.life <= 0) || marks[0];
        m.position.set(pos.x + nx * side, 0.006, pos.y + nz * side); m.rotation.y = dir; m.userData.life = 1;
      });
      lastMark.copy(pos);
    }
    marks.forEach(m => { if (m.userData.life > 0) { m.userData.life -= dt / 2.4; m.material.opacity = Math.max(0, m.userData.life) * 0.4; } });
    if (target) { if (!calm) marker.scale.setScalar(1 + Math.sin(t * 4) * 0.08); }
    else if (markerFade > 0) { markerFade = Math.max(0, markerFade - dt * 2.5); marker.material.opacity = markerFade * 0.75; }

    // ----- apply to character + reflection -----
    hero.root.position.set(pos.x, heroY, pos.y); hero.root.rotation.y = yaw;
    const elementForPose = element ? { type: element.type === 'axel' ? 'jump' : element.type, p: element.p } : null;
    hero.update(dt, { t, speed: Math.min(1, speed / MAX), lean, spinning, calm, element: elementForPose });
    mirror.root.position.set(pos.x, -heroY, pos.y); mirror.root.rotation.y = yaw; mirror.copyPose(hero);
    spot.target.position.lerp(heroPos3.set(pos.x, 0, pos.y), Math.min(1, dt * 3));
    spot.position.set(spot.target.position.x * 0.4, 13, spot.target.position.z * 0.4 + 2);

    // ----- camera -----
    updateCamera(dt, heroPos3.set(pos.x, 0, pos.y));
    faceLight.position.set(pos.x + Math.sin(cam.az) * 2.2, heroY + 3.4, pos.y + Math.cos(cam.az) * 2.2);

    // ----- objects: proximity glow + readable labels that follow the view -----
    const r = rinkEl.getBoundingClientRect();
    objects.forEach(o => {
      const d = Math.hypot(o.anchor.x - pos.x, o.anchor.z - pos.y);
      o.near = d < NEAR_DISTANCE;
      o.glow += ((o.near ? 1 : 0) - o.glow) * Math.min(1, dt * 5);
      o.mats.forEach(m => m.emissiveIntensity = 0.35 + o.glow * 0.9);
      if (o.lineMat) o.lineMat.opacity = 0.45 + o.glow * 0.45;
      o.light.intensity = 0.6 + o.glow * 1.6;
      // springy "boing": a bit bigger while hovered, a pop when opened (calm mode: no bounce)
      const goal = 1 + o.glow * 0.08 + (o === hoverObj ? 0.16 : 0);
      if (o.s === undefined) { o.s = 1; o.sv = 0; }
      if (calm) o.s = goal; else { o.sv += ((goal - o.s) * 140 - o.sv * 9) * dt; o.s += o.sv * dt; }
      o.group.scale.setScalar(o.s);
      o.anim(t, calm);
      proj.set(o.anchor.x, o.anchor.y + o.labelY, o.anchor.z).project(camera);
      const visible = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      o.label.style.visibility = visible ? 'visible' : 'hidden';
      o.label.style.transform = `translate(${(proj.x + 1) / 2 * r.width}px, ${(1 - proj.y) / 2 * r.height}px) translate(-50%,-100%)`;
      o.label.classList.toggle('near', o.near);
    });
    banners.forEach(b => {
      b.hover += ((b === hoverBanner ? 1 : 0) - b.hover) * Math.min(1, dt * 8);
      b.face.material.emissiveIntensity = b.hover * 0.35;
      b.grp.scale.setScalar(1 + b.hover * 0.06);
      if (!calm) b.grp.rotation.z = Math.sin(t * 0.8 + b.x) * 0.012;      // banners sway very slightly
    });
    if (hoverBanner) {
      const sp = SPONSORS[hoverBanner.idx];
      bannerLabel.innerHTML = `${esc(sp.name)}${sp.relation ? `<small>${esc(sp.relation)}</small>` : ''}`; bannerLabel.classList.add('near');
      proj.copy(hoverBanner.grp.position); proj.y += hoverBanner.BH / 2 + 0.5; proj.project(camera);
      bannerLabel.hidden = proj.z > 1;
      bannerLabel.style.transform = `translate(${(proj.x + 1) / 2 * r.width}px, ${(1 - proj.y) / 2 * r.height}px) translate(-50%,-100%)`;
    } else if (!bannerLabel.hidden) bannerLabel.hidden = true;
    updateFlags(dt, calm);
    updateSky(dt, calm);
    boardPanels.forEach(b => { b.hover += ((b === hoverBoard ? 1 : 0) - b.hover) * Math.min(1, dt * 8); b.face.position.y = 0.29 + b.hover * 0.03; });
    const hx = hoverFlag || hoverBoard || hoverCity;
    if (hx) {
      if (hoverCity && !hoverFlag) {
        extraLabel.innerHTML = `${esc(hoverCity.cty.name)}, ${esc(hoverCity.cty.country)}<small>${esc(hoverCity.cty.note || '')}</small>`;
        proj.copy(hoverCity.top); proj.y += 0.8;
      } else if (hoverFlag) {
        const fl = hoverFlag;
        extraLabel.innerHTML = `${esc(fl.f.country)}<small>${esc(fl.f.school || fl.f.note || '')}</small>`;
        proj.set(fl.grp.position.x, fl.grp.position.y + 0.35, fl.grp.position.z);
      } else {
        extraLabel.innerHTML = `${esc(hoverBoard.bd.name)}<small>Open experience</small>`;
        proj.copy(hoverBoard.face.position); proj.y += 0.6;
      }
      proj.project(camera); extraLabel.classList.add('near');
      extraLabel.hidden = proj.z > 1;
      extraLabel.style.transform = `translate(${(proj.x + 1) / 2 * r.width}px, ${(1 - proj.y) / 2 * r.height}px) translate(-50%,-100%)`;
    } else if (!extraLabel.hidden) extraLabel.hidden = true;
    if (!calm) sparkles.rotation.y = t * 0.01;
    updateSparks(dt);
    applyMood(dt);
  }

  let first = true;
  let framesDrawn = 0;
  // read-only state for checks (no effect on the page)
  window.__rinkInfo = () => ({ init: initSize, size: [rinkEl.clientWidth, rinkEl.clientHeight], portrait: lastPortrait, flagsTall,
    camR: +cam.r.toFixed(2), startR: +START.r.toFixed(2), rMin: +R_MIN.toFixed(2), rMax: +R_MAX.toFixed(2), az: +cam.az.toFixed(2), touched: camTouched, frames: framesDrawn,
    running, hidden: document.hidden, ctxLost: renderer.getContext().isContextLost() });
  function frame(now) {
    if (!running || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    step(dt);
    renderer.render(scene, camera); framesDrawn++;
    if (first) { first = false; rinkEl.classList.add('ready'); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  setTimeout(() => { if (first) { last = performance.now() - 16; frame(performance.now()); } }, 1500);   // background tabs may not send animation frames: draw the first one anyway

  // ---------- "After the Show": Contact pop-up mood ----------
  // stops the skater, a short bow + wave toward the visitor, and warmer, softer stage light. Restored on close.
  let mood = 0, moodTarget = 0;
  const BASE = { spotColor: spot.color.clone(), spotI: spot.intensity, washI: wash.intensity, hemiI: hemi.intensity, fillI: fill.intensity };
  const WARM = new THREE.Color(0xFF9A3C);
  // returns how long (ms) the greeting needs before the card should appear; 0 = open straight away
  window.__rinkContact = on => {
    moodTarget = on ? 1 : 0;
    if (!on) return 0;
    if (window.skateNav) window.skateNav.cancel();             // a menu jump gives way to the Contact card
    target = null; keys.clear(); auto = null; idleTime = 0; markerFade = Math.min(markerFade, 0.99);
    if (reduceMotion.matches) { mood = 1; return 0; }        // calm mode: no greeting, light just switches
    const box = rinkEl.getBoundingClientRect();
    const visible = Math.min(box.bottom, innerHeight) - Math.max(box.top, 0) > Math.min(box.height, innerHeight) * 0.5;
    if (!visible || document.hidden) return 0;                // rink not on screen: nobody would see the bow
    if (perf) { perf = null; heroY = 0; yawVel = 0; }
    startElement('wave', null);
    return 2000;                                             // a two-second spin, then the card
  };
  const applyMood = dt => {
    if (mood !== moodTarget) mood += Math.sign(moodTarget - mood) * Math.min(Math.abs(moodTarget - mood), dt / 0.45);
    if (reduceMotion.matches) mood = moodTarget;
    spot.color.copy(BASE.spotColor).lerp(WARM, mood);
    spot.intensity = BASE.spotI * (1 + 0.4 * mood);
    wash.intensity = BASE.washI * (1 - 0.65 * mood);
    hemi.intensity = BASE.hemiI * (1 - 0.45 * mood);
    fill.intensity = BASE.fillI * (1 - 0.6 * mood);
  };

  // =====================================================================
  //  MENU NAVIGATION JUMPS — About Me: Double Axel, Experience: Triple Loop, Projects: Triple Lutz.
  //  The skater jumps on screen; the section title appears at the landing; then the page scrolls.
  //  IDLE → GLIDING → PREPARING → TAKEOFF → ROTATING → LANDING → EXIT_GLIDE → NAVIGATING → IDLE
  // =====================================================================
  const navTitle = document.createElement('div');
  navTitle.className = 'jump-title'; navTitle.setAttribute('aria-hidden', 'true'); navTitle.hidden = true;
  rinkEl.appendChild(navTitle);
  const nav = { state: 'IDLE', targetSection: null, jumpType: null, title: '', animationComplete: null };
  const setNavState = s => {
    if (nav.state === s) return;
    nav.state = s;
    window.dispatchEvent(new CustomEvent('skatenav', { detail: { state: s, targetSection: nav.targetSection, jumpType: nav.jumpType } }));
  };
  function showNavTitle() {
    navTitle.textContent = nav.title; navTitle.hidden = false;
    navTitle.getAnimations().forEach(a => a.cancel());
    navTitle.animate([{ opacity: 0, transform: 'translate(-50%,14px)', letterSpacing: '.42em' }, { opacity: 1, transform: 'translate(-50%,0)', letterSpacing: '.24em' }],
      { duration: 520, easing: 'cubic-bezier(.22,.8,.26,1)', fill: 'both' });
  }
  function hideNavTitle() {
    if (navTitle.hidden) return;
    navTitle.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'both' }).finished.then(() => { if (nav.state === 'IDLE' || nav.state === 'NAVIGATING') navTitle.hidden = true; }).catch(() => {});
  }
  const canPerform = () => {
    if (reduceMotion.matches || document.hidden || !running || rinkEl.classList.contains('no3d')) return false;
    const b = rinkEl.getBoundingClientRect();
    return Math.min(b.bottom, innerHeight) - Math.max(b.top, 0) > Math.min(b.height, innerHeight) * 0.5;   // rink mostly on screen
  };
  const lowPower = () => (navigator.hardwareConcurrency || 8) <= 4 || matchMedia('(max-width: 600px)').matches;
  // go(targetSection, jumpType, { title, navigate }) → Promise resolved after navigation
  window.skateNav = {
    get state() { return nav.state; }, get targetSection() { return nav.targetSection; }, get jumpType() { return nav.jumpType; },
    get animationComplete() { return nav.animationComplete; },
    cancel() { if (nav.state !== 'IDLE' && nav.cancel) nav.cancel(); },
    go(targetSection, jumpType, opts = {}) {
      const navigate = opts.navigate || (() => openSection(targetSection));
      if (nav.state !== 'IDLE') {                         // already jumping: just change where we land
        nav.targetSection = targetSection; nav.title = opts.title || targetSection; nav.navigate = navigate;
        if (nav.state === 'LANDING' || nav.state === 'EXIT_GLIDE') navTitle.textContent = nav.title;
        return nav.animationComplete;
      }
      const J = window.SKATE_JUMPS && window.SKATE_JUMPS[jumpType];
      nav.targetSection = targetSection; nav.jumpType = jumpType; nav.title = opts.title || targetSection; nav.navigate = navigate;
      if (!J || !canPerform()) {                          // no jump (reduced motion, rink off screen, no 3D): go straight there
        setNavState('NAVIGATING'); nav.navigate(); setNavState('IDLE');
        return (nav.animationComplete = Promise.resolve(false));
      }
      let done, safety;
      nav.animationComplete = new Promise(res => { done = res; });
      nav.cancel = () => { clearTimeout(safety); navBusy = false; hideNavTitle(); if (perf && perf.onDone) { perf.onDone = null; finishPerf(false); } setNavState('IDLE'); done(false); };
      const complete = played => {
        if (nav.state === 'IDLE' || nav.state === 'NAVIGATING') return;
        clearTimeout(safety); navBusy = false;
        setNavState('NAVIGATING'); hideNavTitle();
        try { nav.navigate(); } finally { setNavState('IDLE'); done(played); }
      };
      // clear whatever she was doing, then skate across the view with room for the jump
      if (perf) finishPerf(false);
      navBusy = true; target = null; keys.clear(); auto = null; idleTime = 0; markerFade = Math.min(markerFade, 0.99);
      const side = Math.sin(cam.az + Math.PI / 2), sideZ = Math.cos(cam.az + Math.PI / 2);
      const roomFor = h => { const d = new THREE.Vector2(Math.sin(h), Math.cos(h)); const a = pos.clone().addScaledVector(d, 7);
        return Math.abs(a.x) < W / 2 - 1 && Math.abs(a.y) < D / 2 - 1; };
      let heading = Math.atan2(side, sideZ);
      if (!roomFor(heading)) heading += Math.PI;
      if (!roomFor(heading)) heading = Math.atan2(-pos.x, -pos.y + 0.0001);
      perf = { type: jumpType, id: null, time: 0, dur: J.dur, dir: heading, faceYaw: cam.az, baseYaw: yaw };
      if (lowPower()) perf.time = J.dur * J.prep * 0.7;                // smaller devices: shorter approach
      const landingDone = { v: false };
      perf.onPhase = p => {
        setNavState(p < J.prep ? 'GLIDING' : p < J.to ? 'PREPARING' : p < J.air ? 'TAKEOFF' : p < J.land ? 'ROTATING' : p < J.exit ? 'LANDING' : 'EXIT_GLIDE');
        if (!landingDone.v && p >= J.land) { landingDone.v = true; showNavTitle(); }   // the title appears as the blade touches down
      };
      perf.onDone = () => complete(true);
      setNavState('GLIDING');
      safety = setTimeout(() => { if (perf && perf.onDone) { perf.onDone = null; finishPerf(false); } complete(false); }, J.dur * 1000 + 2500);   // never strand the visitor
      return nav.animationComplete;
    }
  };

  // small hook for checking the scene from the browser console
  window.__rink = {
    cam, resetView, START: () => START, tap: handleTap,
    get pos() { return { x: pos.x, z: pos.y }; }, get yaw() { return yaw; }, get target() { return target; },
    get perf() { return perf && perf.type; }, get heroY() { return heroY; }, get auto() { return auto && auto.phase; },
    keys,
    // advance the scene by n frames (used for checks when the page runs in the background)
    tick(n = 1) { for (let i = 0; i < n; i++) { t += 1 / 60; step(1 / 60); } renderer.render(scene, camera); }
  };
})();
