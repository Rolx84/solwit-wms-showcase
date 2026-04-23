/* ==========================================================================
   Solwit WMS — hero-scroll (GSAP + ScrollTrigger)
   Scroll-choreography timeline. Three stages inside one pinned hero.

   Stage 0 (pre-scroll):   orbs scatter in, headline settles
   Stage 1 (0   -> 33%):   scatter -> constellation (lines fade in)
   Stage 2 (33% -> 66%):   plane tilts to 3D; orbs begin orbiting
   Stage 3 (66% -> 100%):  orbs fly past camera w/ label chips
   ========================================================================== */

(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------- Orb layout data ----------------
  // Angles chosen so the constellation reads balanced on both the
  // horizontal stage-1 arrangement AND the tilted orbit plane.
  const ORBS = [
    { key: "ERP",       angle: -35, radius: 180, speed: 42, phase:   0, z: 30 },
    { key: "RAZOSANA",  angle: 145, radius: 180, speed: 42, phase: 140, z: 30 },
    { key: "ALGA",      angle:  80, radius: 270, speed: 66, phase:  70, z: 10 },
    { key: "PERSONALS", angle: -110,radius: 270, speed: 66, phase: 220, z: 10 },
    { key: "DOKUMENTI", angle:  30, radius: 340, speed: 92, phase:  40, z: -8 },
    { key: "API",       angle: -155,radius: 340, speed: 92, phase: 200, z: -8 },
  ];

  // Scatter "from" positions — offscreen edges, randomized per orb
  const SCATTER = [
    { x: -620, y: -320, rot: -30 },   // ERP
    { x:  640, y: -280, rot:  25 },   // RAZOSANA
    { x: -580, y:  340, rot:  20 },   // ALGA
    { x:  560, y:  360, rot: -22 },   // PERSONALS
    { x: -740, y:   60, rot:  35 },   // DOKUMENTI
    { x:  760, y:  -90, rot: -28 },   // API
  ];

  // Constellation targets — balanced spread around sun, depth-layered
  // x,y in pixels from center of orbit plane
  const CONSTELLATION = [
    { x: -260, y: -120, z: 24 },  // ERP         (big, front-left)
    { x:  270, y:  100, z: 18 },  // RAZOSANA    (front-right)
    { x:   80, y: -240, z:  6 },  // ALGA        (top)
    { x: -160, y:  220, z:  6 },  // PERSONALS   (bottom-left)
    { x:  340, y: -180, z: -8 },  // DOKUMENTI   (back-right)
    { x: -340, y:   10, z: -8 },  // API         (back-left)
  ];

  // ---------------- Bootstrap ----------------
  function boot() {
    if (!window.gsap || !window.ScrollTrigger) {
      // libraries are async; try again next tick
      return requestAnimationFrame(boot);
    }
    gsap.registerPlugin(ScrollTrigger);

    const heroPin    = document.getElementById("heroPin");
    const orbitPlane = document.getElementById("orbitPlane");
    const orbitLinks = document.getElementById("orbitLinks");
    const sun        = document.getElementById("sun");
    const flypast    = document.getElementById("flypast");
    const flyChip    = document.getElementById("flypastChip");
    const stage1     = document.getElementById("stage1");
    const stage2     = document.getElementById("stage2");
    const stage3     = document.getElementById("stage3");
    const ctaRow     = document.getElementById("ctaRow");
    const scrollHint = document.getElementById("scrollHint");
    const bgWash     = document.querySelector(".stage-bg__wash");
    const rings      = gsap.utils.toArray(".orbit-ring");
    const orbEls     = ORBS.map(o => document.querySelector(`.orb[data-key="${o.key}"]`));
    const linkEls    = ORBS.map(o => document.querySelector(`.orbit-link[data-key="${o.key}"]`));

    // Size the scroll driver — shorter on mobile so it doesn't feel endless
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    const driver  = document.getElementById("scrollDriver");
    driver.style.setProperty("--driver-h", isSmall ? "240vh" : "300vh");

    // Disable 3D tilt on mobile; flat plane keeps orbit animation readable
    const MAX_TILT = isSmall ? 0 : 20;   // degrees rotateX at stage 2
    const MAX_TILT_Z = isSmall ? 0 : -8;

    // ---------- Reduced-motion: paint final state, bail ----------
    if (REDUCED) {
      renderStaticFinal();
      return;
    }

    // ---------- Stage 0 — scatter in ----------
    gsap.set(orbEls, { opacity: 0 });
    gsap.set(sun, { opacity: 0, scale: 0.7 });
    gsap.set([stage2, stage3], { opacity: 0, y: 18 });
    gsap.set(ctaRow, { opacity: 0, y: 24 });

    // Place orbs at scatter positions, invisible
    orbEls.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        x: SCATTER[i].x, y: SCATTER[i].y, z: 0,
        rotation: SCATTER[i].rot, scale: 0.6, opacity: 0,
      });
    });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .to(orbEls, {
        duration: 1.1,
        opacity: 1,
        scale: 1,
        rotation: 0,
        x: (i) => CONSTELLATION[i].x * 0.45,  // partial settle — full snap happens on scroll
        y: (i) => CONSTELLATION[i].y * 0.45,
        stagger: { each: 0.08, from: "random" },
      }, 0)
      .from(stage1, { opacity: 0, y: 24, duration: 0.9, ease: "power2.out" }, 0.25)
      .to(sun, { opacity: 0.0, duration: 0.01 }, 0);   // sun stays hidden until stage 1 completes

    // ---------- Stage 1..3 — scrubbed master timeline ----------
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: driver,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: heroPin,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Stage-3 fly-past label chip: swap content based on progress
          updateFlyChip(self.progress);
        },
        onEnter: () => { scrollHint.style.opacity = "0"; },
        onLeaveBack: () => { scrollHint.style.opacity = "1"; },
      },
    });

    // Segment A (0 -> 0.33): scatter partial -> full constellation + lines + sun
    tl.to(orbEls, {
      x: (i) => CONSTELLATION[i].x,
      y: (i) => CONSTELLATION[i].y,
      z: (i) => CONSTELLATION[i].z,
      scale: 1,
      ease: "power2.inOut",
      duration: 0.33,
    }, 0)
      .to(orbitLinks, { opacity: 1, duration: 0.33, ease: "power2.out" }, 0.12)
      .to(sun, { opacity: 1, scale: 1, duration: 0.33, ease: "back.out(1.6)" }, 0.08)
      .to(stage1, { opacity: 0, y: -28, duration: 0.25, ease: "power2.in" }, 0.22)
      .to(stage2, { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" }, 0.26)
      .to(bgWash, { opacity: 1.15, duration: 0.33, ease: "none" }, 0);

    // Segment B (0.33 -> 0.66): tilt plane, rings fade in, orbs migrate to ring slots
    tl.to(orbitPlane, {
      // GSAP updates via CSS custom props on inline style
      "--rx": `${MAX_TILT}deg`,
      "--rz": `${MAX_TILT_Z}deg`,
      duration: 0.33,
      ease: "power2.inOut",
    }, 0.33)
      .to(rings, {
        opacity: (i) => 0.8 - i * 0.15,
        duration: 0.33,
        ease: "power2.out",
        stagger: 0.05,
      }, 0.33)
      // Fade out the connection lines as the scene becomes a tilted orbit
      .to(orbitLinks, { opacity: 0.35, duration: 0.33, ease: "power2.inOut" }, 0.33)
      .to(stage2, { opacity: 0, y: -24, duration: 0.22, ease: "power2.in" }, 0.55)
      .to(stage3, { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" }, 0.58);

    // Segment C (0.66 -> 1.0): fly-past. Each orb flies toward viewer in sequence.
    // We phase each orb's "fly" window inside the last third.
    const segStart = 0.66;
    const segEnd   = 0.96;
    const segLen   = segEnd - segStart;
    const slot     = segLen / ORBS.length;     // window per orb
    const overlap  = slot * 0.5;               // overlap for smooth sequence

    orbEls.forEach((el, i) => {
      const t0 = segStart + i * (slot - overlap * 0.5);
      const t1 = t0 + slot + overlap * 0.2;

      // Build a "fly toward camera" tween: z surges forward, scale grows, then fades
      tl.to(el, {
        x: gsap.utils.random(-120, 120, 1),
        y: gsap.utils.random(-80, 80, 1),
        z: 520,
        scale: 2.4,
        opacity: 0,
        ease: "power3.in",
        duration: t1 - t0,
      }, t0);
    });

    // Sun brightens and inflates across segment C
    tl.to(sun, {
      scale: 1.55,
      filter: "brightness(1.25) saturate(115%)",
      duration: segLen,
      ease: "power2.in",
    }, segStart)
      .to(orbitLinks, { opacity: 0, duration: 0.2, ease: "power2.in" }, segStart)
      .to(rings, { opacity: 0, duration: 0.25, ease: "power2.in", stagger: 0.03 }, segStart);

    // CTA fade-up and stage-3 copy persist at end
    tl.to(ctaRow, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.92)
      .to(flypast, { opacity: 1, duration: 0.15 }, segStart)
      .to(flypast, { opacity: 0, duration: 0.15, ease: "power2.in" }, 0.96);

    // ---------- Orbit animation (independent — runs through stages 2 & 3) ----------
    // We animate each orb's own "orbit" translation on top of its timeline-controlled
    // base position. Approach: use a separate quickSet per frame with additive offset.
    // Simpler and more reliable — use a single rAF that reads ScrollTrigger progress.
    const orbitState = { t: 0, active: 0 };  // active 0..1 fades orbit contribution in
    let rafId = null;

    // How strongly the orbit motion is applied, driven by scroll progress:
    // 0 at progress<0.33, grows to 1 at 0.66, falls back to 0 at 1.0 (orbs flying past take over)
    function orbitActivity(p) {
      if (p < 0.33) return 0;
      if (p < 0.66) return (p - 0.33) / 0.33;
      if (p < 0.80) return 1 - (p - 0.66) / 0.14;   // fade orbit during fly-past
      return 0;
    }

    function tick(now) {
      orbitState.t = now / 1000;
      const p = ScrollTrigger.getById && ScrollTrigger.getById("heroTL")
              ? ScrollTrigger.getById("heroTL").progress
              : (tl.scrollTrigger ? tl.scrollTrigger.progress : 0);
      const act = orbitActivity(p);

      // Only add orbit contribution when active > 0; otherwise cheap-exit
      if (act > 0 && p < 0.66) {
        // In segment B we lerp from constellation point to ring slot,
        // then orbit along the ring. Compute target ring position for each orb.
        const segB = Math.min(1, Math.max(0, (p - 0.33) / 0.33));
        ORBS.forEach((o, i) => {
          const el = orbEls[i];
          if (!el) return;
          const a = ((orbitState.t * (360 / o.speed)) + o.phase) * Math.PI / 180;
          const rx = Math.cos(a) * o.radius;
          const ry = Math.sin(a) * o.radius;
          // Blend constellation point -> orbit point by segB
          const cx = CONSTELLATION[i].x;
          const cy = CONSTELLATION[i].y;
          const cz = CONSTELLATION[i].z;
          const tx = cx + (rx - cx) * segB;
          const ty = cy + (ry - cy) * segB;
          const tz = cz + (o.z - cz) * segB;
          gsap.set(el, { x: tx, y: ty, z: tz });

          // Update SVG connection line (link from sun 0,0 to orb position)
          const link = linkEls[i];
          if (link) {
            link.setAttribute("x2", tx.toFixed(1));
            link.setAttribute("y2", ty.toFixed(1));
          }
        });
      } else if (act > 0 && p >= 0.66 && p < 0.80) {
        // Partial orbit with fading activity — orbs are also being flown by the timeline.
        // We skip applying x/y here to avoid fighting the fly-past tween.
      } else if (p < 0.33) {
        // Stage 1 — draw links from sun (0,0) to each orb's current GSAP-tracked position.
        orbEls.forEach((el, i) => {
          const link = linkEls[i];
          if (!link) return;
          const tx = Number(gsap.getProperty(el, "x")) || 0;
          const ty = Number(gsap.getProperty(el, "y")) || 0;
          link.setAttribute("x2", tx.toFixed(1));
          link.setAttribute("y2", ty.toFixed(1));
        });
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // ---------- Fly-past chip content swap ----------
    function updateFlyChip(p) {
      if (p < 0.66) { flyChip.textContent = ""; return; }
      const rel = (p - 0.66) / 0.30;      // 0..1 across fly-past window
      const idx = Math.min(ORBS.length - 1, Math.floor(rel * ORBS.length));
      const el  = orbEls[idx];
      if (!el) return;
      const label = el.getAttribute("data-label");
      if (flyChip.textContent !== label) {
        flyChip.textContent = label;
      }
    }

    // ---------- Resize handling ----------
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nowSmall = window.matchMedia("(max-width: 768px)").matches;
        driver.style.setProperty("--driver-h", nowSmall ? "240vh" : "300vh");
        ScrollTrigger.refresh();
      }, 120);
    });

    // Initial layout pass — draw links at initial constellation positions
    requestAnimationFrame(() => {
      orbEls.forEach((el, i) => {
        const link = linkEls[i];
        if (!link) return;
        // initial scatter positions (post-intro partial settle)
        link.setAttribute("x2", (CONSTELLATION[i].x * 0.45).toFixed(1));
        link.setAttribute("y2", (CONSTELLATION[i].y * 0.45).toFixed(1));
      });
    });
  } // boot

  // ---------- Reduced-motion static render ----------
  function renderStaticFinal() {
    const sun = document.getElementById("sun");
    const stage1 = document.getElementById("stage1");
    const ctaRow = document.getElementById("ctaRow");
    const orbEls = document.querySelectorAll(".orb");

    gsap.set(sun, { opacity: 1, scale: 1 });
    gsap.set(stage1, { opacity: 1, y: 0 });
    gsap.set(ctaRow, { opacity: 1, y: 0 });
    orbEls.forEach((el, i) => {
      const target = [
        { x: -260, y: -120 }, { x: 270, y: 100 }, { x: 80, y: -240 },
        { x: -160, y: 220 }, { x: 340, y: -180 }, { x: -340, y: 10 },
      ][i] || { x: 0, y: 0 };
      gsap.set(el, { x: target.x, y: target.y, scale: 1, opacity: 1 });
    });
    const scrollHint = document.getElementById("scrollHint");
    if (scrollHint) scrollHint.style.display = "none";
  }

  // Kick off once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
