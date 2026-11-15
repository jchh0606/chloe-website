/* =====================================================================
   PLACEHOLDER CHARACTER (임시 캐릭터)
   단순한 도형(구·원기둥)으로 만든 임시 모델입니다. 최종 3D 캐릭터가 나오면
   이 파일만 교체하면 됩니다. rink.js는 아래 세 가지만 사용합니다:
     createCharacter(THREE) → { root, update(dt, state), copyPose(other) }
     - root:   발이 y=0, 얼굴이 +z 방향을 보는 THREE.Group
     - update: state = { t, speed(0~1), lean(-1~1), spinning, calm,
                         element: { type: 'spiral'|'jump'|'eagle'|'wave', p: 0~1 } }
     - copyPose: 얼음 반사용 복제 캐릭터에 같은 자세를 복사
   ===================================================================== */
/* Navigation jumps (menu About Me / Experience / Projects). Fractions of the whole move:
   prep = preparation edge starts, to = take-off, air = leaves the ice, land = touches down, exit = exit glide.
   back = approach skated backwards. All rotate counter-clockwise seen from above (positive yaw). */
window.SKATE_JUMPS = {
  '2A':  { name: 'Double Axel',  dur: 2.7, prep: 0.22, to: 0.36, air: 0.41, land: 0.64, exit: 0.73, turns: 2.5, h: 1.05, back: false },
  '3Lo': { name: 'Triple Loop',  dur: 2.6, prep: 0.20, to: 0.36, air: 0.41, land: 0.65, exit: 0.74, turns: 3,   h: 0.92, back: true },
  '3Lz': { name: 'Triple Lutz',  dur: 2.8, prep: 0.20, to: 0.37, air: 0.44, land: 0.67, exit: 0.76, turns: 3,   h: 0.98, back: true }
};
window.createCharacter = function (THREE) {
  const COLORS = {
    skin:  0xF7C4A5,
    hair:  0x0B090E,   // black hair
    dress: 0xFFB81C,   // yellow dress
    boot:  0xFAFAFF,   // white skates
    blade: 0xC9D2DD,   // silver blades
    cheek: 0xFF8C86,
    eye:   0x231B2B
  };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...o });
  const M = {
    skin: std(COLORS.skin, { roughness: 0.75 }),
    hair: std(COLORS.hair, { roughness: 0.8 }),
    dress: new THREE.MeshPhysicalMaterial({ color: COLORS.dress, roughness: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.4, side: THREE.DoubleSide }),
    boot: std(COLORS.boot, { roughness: 0.35 }),
    blade: std(COLORS.blade, { roughness: 0.2, metalness: 0.9 }),
    eye: std(COLORS.eye, { roughness: 0.3 }),
    white: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    cheek: new THREE.MeshBasicMaterial({ color: COLORS.cheek, transparent: true, opacity: 0.7 }),
    sparkle: new THREE.MeshBasicMaterial({ color: 0xFFFBEA })
  };
  const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; return m;
  };
  const sphere = r => new THREE.SphereGeometry(r, 32, 24);
  const HIP = 0.66;

  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);          // whole-body sway / crouch
  const upper = new THREE.Group(); upper.position.y = HIP; body.add(upper);   // bends at the hips
  const parts = { body, upper };

  // legs with skates — each leg pivots at the hip so it can lift (spiral) or turn out (spread eagle)
  ['legL', 'legR'].forEach((name, i) => {
    const s = i === 0 ? -1 : 1;
    const leg = new THREE.Group(); leg.position.set(0.115 * s, HIP, 0);
    leg.add(mesh(new THREE.CylinderGeometry(0.062, 0.07, 0.38, 20), M.skin, 0, -0.18, 0));
    leg.add(mesh(new THREE.CylinderGeometry(0.095, 0.115, 0.2, 24), M.boot, 0, -0.41, 0));
    const boot = mesh(sphere(0.12), M.boot, 0, -0.53, 0.03); boot.scale.set(1, 1.05, 1.55); leg.add(boot);
    leg.add(mesh(new THREE.BoxGeometry(0.035, 0.035, 0.46), M.blade, 0, -0.642, 0.03));
    body.add(leg); parts[name] = leg;
  });

  // dress
  const skirt = mesh(new THREE.CylinderGeometry(0.21, 0.44, 0.26, 40, 1, true), M.dress, 0, 0.06, 0);
  upper.add(skirt); parts.skirt = skirt;
  const bodice = mesh(sphere(0.25), M.dress, 0, 0.26, 0); bodice.scale.set(1, 1.12, 0.85); upper.add(bodice);
  [-1, 1].forEach(s => {
    const strap = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.17, 8), M.dress, 0.1 * s, 0.45, 0.02);
    strap.rotation.z = 0.12 * s; upper.add(strap);
  });
  parts.sparkles = [];
  [[0.1, 0.29, 0.2], [-0.08, 0.22, 0.21], [0.02, 0.36, 0.2], [0.25, 0.04, 0.24], [-0.3, 0.0, 0.2], [0.05, -0.02, 0.4]].forEach(p => {
    const sp = mesh(new THREE.OctahedronGeometry(0.022), M.sparkle, ...p); sp.castShadow = false;
    upper.add(sp); parts.sparkles.push(sp);
  });
  upper.add(mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.12, 16), M.skin, 0, 0.47, 0));

  // arms (pivot at the shoulder)
  ['armL', 'armR'].forEach((name, i) => {
    const s = i === 0 ? -1 : 1;
    const arm = new THREE.Group(); arm.position.set(0.22 * s, 0.41, 0);
    arm.add(mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.34, 16), M.skin, 0, -0.17, 0));
    arm.add(mesh(sphere(0.06), M.skin, 0, -0.36, 0));
    arm.add(mesh(sphere(0.05), M.skin, 0, 0, 0));
    upper.add(arm); parts[name] = arm;
  });

  // rose bouquet (only shown while she waves goodbye on the Contact card)
  const bouquet = new THREE.Group(); bouquet.position.set(0, -0.38, 0.02); bouquet.visible = false;
  {
    const paper = new THREE.MeshStandardMaterial({ color: 0xFFF3DC, roughness: 0.8, side: THREE.DoubleSide });
    const leaf = new THREE.MeshStandardMaterial({ color: 0x3E8E4E, roughness: 0.7 });
    const rose = new THREE.MeshStandardMaterial({ color: 0xE0263F, roughness: 0.55 });
    const wrap = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.42, 20, 1, true), paper);
    wrap.rotation.x = Math.PI; wrap.position.y = 0.12; bouquet.add(wrap);
    { const ribbon = mesh(new THREE.TorusGeometry(0.045, 0.014, 8, 20), M.dress, 0, 0.02, 0); ribbon.rotation.x = Math.PI / 2; bouquet.add(ribbon); }
    [[0, 0.36, 0], [0.09, 0.33, 0.05], [-0.09, 0.33, 0.04], [0.05, 0.34, -0.08], [-0.06, 0.35, -0.07], [0, 0.31, 0.11], [0.11, 0.3, -0.03]].forEach(([x, y, z], i) => {
      const r = new THREE.Mesh(new THREE.SphereGeometry(0.058, 14, 10), rose); r.position.set(x, y, z); r.scale.set(1, 0.85, 1); bouquet.add(r);
      const petal = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.012, 6, 14), rose); petal.position.set(x, y + 0.035, z); petal.rotation.x = Math.PI / 2; bouquet.add(petal);
      if (i % 2 === 0) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), leaf); l.position.set(x * 1.6, y - 0.07, z * 1.6); l.scale.set(1.4, 0.4, 0.8); bouquet.add(l); }
    });
  }
  parts.armL.add(bouquet); parts.bouquet = bouquet;

  // head (slightly larger so the face reads from the camera)
  const head = new THREE.Group(); head.position.set(0, 0.88, 0); head.scale.setScalar(1.08); upper.add(head); parts.head = head;
  head.add(mesh(sphere(0.42), M.skin));
  [-1, 1].forEach(s => head.add(mesh(sphere(0.07), M.skin, 0.41 * s, -0.04, 0)));
  head.add(mesh(new THREE.SphereGeometry(0.445, 40, 24, 0, Math.PI * 2, 0, 1.22), M.hair, 0, 0.01, 0));
  head.add(mesh(new THREE.SphereGeometry(0.45, 40, 24, Math.PI, Math.PI, 0, Math.PI * 0.82), M.hair, 0, 0.01, -0.01));
  [[-0.2, 0.17, 0.35, 0.4], [0.02, 0.2, 0.37, -0.15], [0.22, 0.16, 0.34, -0.5]].forEach(([x, y, z, rz]) => {
    const f = mesh(sphere(0.13), M.hair, x, y, z); f.scale.set(1.25, 0.55, 0.55); f.rotation.z = rz; head.add(f);
  });
  head.add(mesh(sphere(0.17), M.hair, 0, 0.36, -0.2));
  const tie = mesh(new THREE.TorusGeometry(0.12, 0.025, 10, 32), M.dress, 0, 0.3, -0.16);
  tie.rotation.x = -0.9; head.add(tie);
  // face
  parts.eyes = [];
  [-1, 1].forEach(s => {
    const eye = new THREE.Group(); eye.position.set(0.15 * s, -0.02, 0.385);
    const e = mesh(sphere(0.062), M.eye); e.scale.set(0.85, 1.15, 0.5); e.castShadow = false; eye.add(e);
    const hl = mesh(sphere(0.02), M.white, 0.02, 0.04, 0.03); hl.castShadow = false; eye.add(hl);
    head.add(eye); parts.eyes.push(eye);
    const cheek = mesh(sphere(0.06), M.cheek, 0.245 * s, -0.13, 0.33); cheek.scale.set(1.3, 0.7, 0.3); cheek.castShadow = false; head.add(cheek);
  });
  // open, happy smile with a little tongue, and arched brows
  const mouth = mesh(new THREE.CircleGeometry(0.095, 28, Math.PI, Math.PI), new THREE.MeshBasicMaterial({ color: 0x7A2E3E, side: THREE.DoubleSide }), 0, -0.11, 0.405);
  mouth.scale.y = 0.85; mouth.rotation.x = 0.22; mouth.castShadow = false; head.add(mouth);
  const tongue = mesh(new THREE.CircleGeometry(0.05, 20, Math.PI, Math.PI), new THREE.MeshBasicMaterial({ color: 0xFF8A8A, side: THREE.DoubleSide }), 0, -0.155, 0.409);
  tongue.scale.y = 0.55; tongue.rotation.x = 0.25; tongue.castShadow = false; head.add(tongue);
  [-1, 1].forEach(s => {
    const brow = mesh(new THREE.TorusGeometry(0.05, 0.01, 6, 16, Math.PI * 0.7), M.hair, 0.15 * s, 0.09, 0.395);
    brow.rotation.z = Math.PI * 0.15; brow.castShadow = false; head.add(brow);
  });

  // ---- animation ----
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const envelope = (p, a = 0.2, b = 0.2) => Math.min(smooth(p / a), smooth((1 - p) / b));
  let blinkIn = 2 + Math.random() * 3, blinkT = 0;

  function update(dt, st) {
    const t = st.t, sp = st.speed || 0, calm = st.calm, el = st.element;
    const idle = calm || el ? 0 : (1 - Math.min(1, sp * 2));
    // ---- base pose ----
    body.rotation.set(0, 0, Math.sin(t * 1.4) * 0.045 * idle - (st.lean || 0) * 0.16);
    body.position.set(Math.sin(t * 1.4) * 0.025 * idle, Math.abs(Math.sin(t * 1.4)) * 0.012 * idle, 0);
    upper.rotation.set(sp * 0.16, 0, 0);
    head.rotation.set(-sp * 0.08 - 0.08, 0, 0);                    // chin up a little: face toward the camera
    const open = st.spinning ? 0.15 : 0.35 + sp * 0.75;
    parts.armL.rotation.set(st.spinning ? -0.4 : 0, 0, -open);
    parts.armR.rotation.set(st.spinning ? -0.4 : 0, 0, open);
    bouquet.visible = false;
    parts.legL.rotation.set(0, 0, 0); parts.legR.rotation.set(0, 0, 0);
    let flare = 1 + sp * 0.12 + (st.spinning ? 0.18 : 0);

    // ---- figure skating elements ----
    if (el) {
      const p = el.p;

      const J = window.SKATE_JUMPS[el.type];
      if (J) {
        // anatomical sides (she faces +z): her right leg/arm sit at -x = legL/armL, her left at +x = legR/armR
        const RL = parts.legL, LL = parts.legR, RA = parts.armL, LA = parts.armR;
        const ramp = (a, b) => smooth((p - a) / (b - a));
        const glide = 1 - ramp(J.prep, J.prep + 0.06);
        const prep = ramp(J.prep, J.to) * (1 - ramp(J.to + 0.02, J.air));
        const take = ramp(J.to, J.air) * (1 - ramp(J.air, J.air + 0.05));
        const air = ramp(J.air, J.air + 0.04) * (1 - ramp(J.land - 0.03, J.land));
        const impact = ramp(J.land - 0.01, J.land + 0.03) * (1 - ramp(J.land + 0.04, J.exit + 0.02));
        const free = ramp(J.land - 0.02, J.land + 0.05) * (1 - ramp(0.9, 1));      // left free leg extended back
        const stroke = Math.sin(p * J.dur * Math.PI * 2 * 0.9);
        // glide: forward strokes (2A) or backward C-cuts (loop, lutz)
        if (J.back) { RL.rotation.z = -0.22 * Math.max(0, stroke) * glide; LL.rotation.z = 0.22 * Math.max(0, -stroke) * glide; }
        else { RL.rotation.x = 0.45 * Math.max(0, stroke) * glide; LL.rotation.x = 0.45 * Math.max(0, -stroke) * glide; }
        body.position.y -= 0.03 * glide;
        let ra = [0, 0, lerp(-open, -0.9, glide)], la = [0, 0, lerp(open, 0.9, glide)];
        if (el.type === '2A') {
          // left forward outside edge: lean left, knee bent, arms drawn back, right free leg behind
          body.rotation.z -= 0.15 * prep; body.position.y -= 0.11 * prep; upper.rotation.x += 0.18 * prep;
          RL.rotation.x += 0.4 * prep;
          ra = [lerp(ra[0], 0.7, prep), 0, lerp(ra[2], -0.5, prep)]; la = [lerp(la[0], 0.7, prep), 0, lerp(la[2], 0.5, prep)];
          // step up: right knee drives forward and up, both arms swing through and up
          RL.rotation.x = lerp(RL.rotation.x, -1.2, take); upper.rotation.x -= 0.12 * take; body.position.y += 0.05 * take;
          ra = [lerp(ra[0], -1.6, take), 0, lerp(ra[2], 0.1, take)]; la = [lerp(la[0], -1.6, take), 0, lerp(la[2], -0.1, take)];
        } else if (el.type === '3Lo') {
          // right back outside edge, deep sit, left leg crossed in front; arms wound (right forward, left back)
          body.rotation.z += 0.14 * prep; body.position.y -= 0.15 * prep; upper.rotation.x += 0.3 * prep;
          LL.rotation.x = -0.5 * prep; LL.rotation.z = -0.18 * prep;
          ra = [lerp(ra[0], -0.9, prep), 0, lerp(ra[2], -0.25, prep)]; la = [lerp(la[0], 0.5, prep), 0, lerp(la[2], 1.0, prep)];
          // springs straight up off the right foot, no toe pick: both arms lift together
          body.position.y += 0.06 * take; upper.rotation.x -= 0.25 * take; LL.rotation.x = lerp(LL.rotation.x, -0.25, take);
          ra = [lerp(ra[0], -1.25, take), 0, lerp(ra[2], -1.4, take)]; la = [lerp(la[0], -1.25, take), 0, lerp(la[2], 1.4, take)];
        } else {
          // long left back outside edge, lean left, left arm forward, right arm and right leg reaching back
          body.rotation.z -= 0.17 * prep; body.position.y -= 0.06 * prep; upper.rotation.y = 0.35 * prep;
          RL.rotation.x = 0.75 * prep;
          ra = [lerp(ra[0], 0.6, prep), 0, lerp(ra[2], -0.8, prep)]; la = [lerp(la[0], -1.25, prep), 0, lerp(la[2], 0.25, prep)];
          // right toe pick planted behind, body vaults over it; arms pull in
          const pick = ramp(J.to, J.to + 0.03) * (1 - ramp(J.air - 0.01, J.air + 0.02));
          RL.rotation.x = lerp(RL.rotation.x, 0.5, pick); body.position.y -= 0.1 * pick * (1 - take) ; body.position.y += 0.05 * take;
          upper.rotation.y *= 1 - take;
          ra = [lerp(ra[0], -1.1, take), 0, lerp(ra[2], 0.2, take)]; la = [lerp(la[0], -1.1, take), 0, lerp(la[2], -0.2, take)];
        }
        // air: tight rotation position, arms crossed at the chest, left leg crossed over the right
        if (air > 0) {
          ra = [lerp(ra[0], -1.35, air), 0, lerp(ra[2], 0.5, air)]; la = [lerp(la[0], -1.35, air), 0, lerp(la[2], -0.5, air)];
          RL.rotation.set(lerp(RL.rotation.x, 0, air), 0, lerp(RL.rotation.z, 0.04, air));
          LL.rotation.set(lerp(LL.rotation.x, -0.16, air), 0, lerp(LL.rotation.z, -0.15, air));
          upper.rotation.x = lerp(upper.rotation.x, 0.02, air); flare -= 0.16 * air;
        }
        // landing on the right back outside edge: knee absorbs, left leg extends back, arms open, lean right
        if (free > 0) {
          LL.rotation.set(lerp(LL.rotation.x, 1.15, free), 0, lerp(LL.rotation.z, 0.22, free));   // left free leg lifted well back: clearly a right-foot landing
          RL.rotation.set(lerp(RL.rotation.x, 0, free), 0, lerp(RL.rotation.z, 0, free));
          ra = [lerp(ra[0], 0.25, free), 0, lerp(ra[2], -1.35, free)]; la = [lerp(la[0], 0.25, free), 0, lerp(la[2], 1.35, free)];
          body.rotation.z += 0.12 * free; upper.rotation.x += 0.12 * free; head.rotation.x -= 0.1 * free;
          flare += 0.06 * free;
        }
        body.position.y -= 0.12 * impact; upper.rotation.x += 0.22 * impact;
        RA.rotation.set(ra[0], 0, ra[2]); LA.rotation.set(la[0], 0, la[2]);
      }
      if (el.type === 'spiral') {               // free leg lifted high behind, torso forward, arms long
        const e = envelope(p, 0.25, 0.22);
        upper.rotation.x = lerp(upper.rotation.x, 0.85, e);
        head.rotation.x = lerp(head.rotation.x, -0.65, e);
        parts.legR.rotation.x = 1.55 * e;
        parts.armL.rotation.set(-0.5 * e, 0, lerp(-open, -1.35, e));
        parts.armR.rotation.set(0.35 * e, 0, lerp(open, 1.3, e));
        flare += 0.08 * e;
      }
      if (el.type === 'eagle') {                // spread eagle: feet turned out, lean back, arms high
        const e = envelope(p, 0.22, 0.22);
        parts.legL.rotation.set(0, -1.25 * e, -0.2 * e);
        parts.legR.rotation.set(0, 1.25 * e, 0.2 * e);
        body.position.y -= 0.03 * e;
        upper.rotation.x = lerp(upper.rotation.x, -0.28, e);
        head.rotation.x = lerp(head.rotation.x, -0.25, e);
        parts.armL.rotation.set(0, 0, lerp(-open, -2.1, e));
        parts.armR.rotation.set(0, 0, lerp(open, 2.1, e));
      }
      if (el.type === 'wave') {                 // after the show: a quick spin holding a rose bouquet
        const hold = smooth(p / 0.08) * (1 - smooth((p - 0.92) / 0.08));
        parts.armL.rotation.set(lerp(0, -0.85, hold), 0, lerp(-open, 0.12, hold));
        parts.armR.rotation.set(lerp(0, -0.7, hold), 0, lerp(open, -0.35, hold));   // other hand wraps in toward the flowers
        bouquet.visible = hold > 0.02;
        bouquet.scale.setScalar(Math.max(0.01, hold) * 0.85);
        bouquet.rotation.set(-parts.armL.rotation.x - 0.15, 0, -parts.armL.rotation.z);   // keep the flowers upright
      }
      if (el.type === 'jump') {                 // prep crouch → tight air position → landing with free leg back
        const prep = smooth(p / 0.22) * (1 - smooth((p - 0.22) / 0.06));
        const air = smooth((p - 0.24) / 0.08) * (1 - smooth((p - 0.66) / 0.08));
        const land = smooth((p - 0.68) / 0.08) * (1 - smooth((p - 0.86) / 0.14));
        body.position.y -= 0.08 * prep + 0.06 * land;
        upper.rotation.x += 0.3 * prep + 0.35 * land;
        parts.armL.rotation.set(lerp(0, -1.25, air) + 0.4 * prep, 0, lerp(lerp(-open, -0.6, prep), -0.15, air));
        parts.armR.rotation.set(lerp(0, -1.25, air) + 0.4 * prep, 0, lerp(lerp(open, 0.6, prep), 0.15, air));
        if (land > 0) { parts.armL.rotation.z = lerp(parts.armL.rotation.z, -1.3, land); parts.armR.rotation.z = lerp(parts.armR.rotation.z, 1.3, land); }
        parts.legL.rotation.z = 0.08 * air;
        parts.legR.rotation.set(0.95 * land, 0, -0.08 * air);
        flare -= 0.1 * air;
      }
    }

    skirt.scale.set(flare, 1 - (flare - 1) * 0.6, flare);
    skirt.rotation.y += dt * (0.2 + sp);
    // blink
    blinkIn -= dt;
    if (blinkIn <= 0) { blinkT = 0.14; blinkIn = 2.5 + Math.random() * 3.5; }
    let eyeY = 1;
    if (blinkT > 0) { blinkT -= dt; eyeY = 0.12; }
    parts.eyes.forEach(e => e.scale.y = eyeY);
    parts.sparkles.forEach((s, i) => s.scale.setScalar(calm ? 1 : 0.7 + 0.5 * Math.abs(Math.sin(t * 2 + i * 1.7))));
  }

  // used for the soft reflection on the ice
  const poseKeys = ['body', 'upper', 'skirt', 'armL', 'armR', 'legL', 'legR', 'head', 'bouquet'];
  function copyPose(other) {
    poseKeys.forEach(k => {
      parts[k].position.copy(other.parts[k].position);
      parts[k].rotation.copy(other.parts[k].rotation);
      parts[k].scale.copy(other.parts[k].scale);
    });
    parts.eyes.forEach((e, i) => e.scale.copy(other.parts.eyes[i].scale));
    parts.bouquet.visible = other.parts.bouquet.visible;
  }

  return { root, update, copyPose, parts };
};
