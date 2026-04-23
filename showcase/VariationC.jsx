// VariationC.jsx — Hero leads with a live-looking dashboard panel, orbit is background
function DashPreview() {
  return (
    <div className="dash">
      <div className="dash__bar">
        <span className="d r"/><span className="d y"/><span className="d g"/>
        <span className="url">app.solwit.lv/wms/riga-01/ienakoshie</span>
      </div>
      <div className="dash__grid" style={{display:"grid", gridTemplateColumns:"200px 1fr", minHeight:360}}>
        {/* sidebar */}
        <div style={{background:"#F8F5FB", padding:18, borderRight:"1px solid var(--border-soft)", fontFamily:"var(--font-mono)", fontSize:13}}>
          <div style={{fontSize:11, color:"var(--ink-3)", marginBottom:10, textTransform:"uppercase", letterSpacing:".08em"}}>Noliktavas</div>
          {["Rīga-01","Liepāja","Daugavpils","Ventspils"].map((w,i) => (
            <div key={w} style={{
              padding:"8px 10px", borderRadius:8, marginBottom:4,
              background: i===0 ? "var(--purple-dark)" : "transparent",
              color: i===0 ? "#fff" : "var(--ink)",
              cursor:"pointer",
            }}>{w}</div>
          ))}
          <div style={{height:1, background:"var(--border-soft)", margin:"14px 0"}}/>
          <div style={{fontSize:11, color:"var(--ink-3)", marginBottom:10, textTransform:"uppercase", letterSpacing:".08em"}}>Operācijas</div>
          {[["Ienākošie","128"],["Izejošie","42"],["Inventarizācija","—"],["Atskaites","14"]].map(([n,c]) => (
            <div key={n} style={{display:"flex", justifyContent:"space-between", padding:"8px 10px", color:"var(--ink-2)"}}>
              <span>{n}</span>
              <span style={{color:"var(--ink-3)"}}>{c}</span>
            </div>
          ))}
        </div>
        {/* main */}
        <div style={{padding:22}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18}}>
            <div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:12, color:"var(--purple-mid)"}}>{"{ienākošie sūtījumi}"}</div>
              <div style={{fontFamily:"var(--font-display)", fontWeight:700, fontSize:26, color:"var(--ink)"}}>Šodien · 128 artikuli</div>
            </div>
            <div style={{display:"flex", gap:8}}>
              <span style={{padding:"6px 10px", background:"rgba(46,139,87,0.12)", color:"#2E8B57", borderRadius:6, fontFamily:"var(--font-mono)", fontSize:12}}>● live</span>
              <span style={{padding:"6px 10px", background:"var(--surface-muted)", borderRadius:6, fontFamily:"var(--font-mono)", fontSize:12}}>filter</span>
            </div>
          </div>

          {/* animated chart */}
          <div style={{height:90, display:"flex", alignItems:"flex-end", gap:4, marginBottom:20}}>
            {[32,48,36,64,52,78,62,84,70,92,80,88,72,96,82].map((h,i) => (
              <div key={i} style={{
                flex:1, height:`${h}%`,
                background: `linear-gradient(180deg, #E082FE 0%, #9D51E9 100%)`,
                borderRadius:3,
                animation: `bar-grow 900ms ${i*40}ms var(--ease-out) both`,
              }}/>
            ))}
          </div>

          {/* table */}
          <div style={{fontFamily:"var(--font-mono)", fontSize:12, color:"var(--ink-3)", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 80px", padding:"8px 0", borderBottom:"1px solid var(--border-soft)"}}>
            <span>SKU · artikuls</span><span>Piegādātājs</span><span>Skenēts</span><span style={{textAlign:"right"}}>Statuss</span>
          </div>
          {[
            ["PL-4420 · Pallete 120×80",  "DPD",      "09:42", "OK",    "#2E8B57"],
            ["SR-1104 · Servera skapis", "Industra", "09:41", "OK",    "#2E8B57"],
            ["PL-4420 · Pallete 120×80", "DPD",      "09:40", "check", "#C48A00"],
            ["CR-2201 · Kabeļa rullis",  "Würth",    "09:38", "OK",    "#2E8B57"],
          ].map((row,i) => (
            <div key={i} style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 80px", padding:"12px 0", borderBottom:"1px solid var(--border-soft)", fontSize:13, color:"var(--ink)"}}>
              <span>{row[0]}</span>
              <span style={{color:"var(--ink-2)"}}>{row[1]}</span>
              <span style={{color:"var(--ink-2)", fontFamily:"var(--font-mono)"}}>{row[2]}</span>
              <span style={{textAlign:"right", fontFamily:"var(--font-mono)", color:row[4]}}>● {row[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Spatial orb — radial-gradient sphere matching Ekosistēma styling
function Orb({ size, color, x, y, z, blur, opacity = 1, depth = 0, mouse, scrollY, drift }) {
  // depth: 0 = far back (parallax less), 1 = closest (parallax more)
  const px = (mouse.x * depth * 40);
  const py = (mouse.y * depth * 40);
  const sy = scrollY * (0.05 + depth * 0.25);
  const driftX = drift ? Math.sin(drift.t * drift.fx) * drift.ax : 0;
  const driftY = drift ? Math.cos(drift.t * drift.fy) * drift.ay : 0;
  return (
    <div style={{
      position: "absolute",
      left: `calc(${x}% + ${px + driftX}px)`,
      top: `calc(${y}% + ${py + driftY - sy}px)`,
      width: size, height: size,
      borderRadius: "50%",
      transform: `translate(-50%, -50%) translateZ(${z}px)`,
      background: `radial-gradient(circle at 32% 28%, #fff 0%, ${color} 50%, #2A1240 100%)`,
      boxShadow: `0 0 ${60 + size*0.3}px ${color}${Math.round(opacity * 90).toString(16).padStart(2,'0')}, inset -8px -12px 24px rgba(0,0,0,0.35)`,
      filter: blur ? `blur(${blur}px)` : "none",
      opacity,
      pointerEvents: "none",
      willChange: "transform",
    }}/>
  );
}

// --- three.js helpers ------------------------------------------------------
// Radial-gradient CanvasTexture — used for the volumetric bloom sprite and
// for the faint ring textures. Keeps bundle CDN-only (no PNG assets).
function makeRadialTexture(THREE, stops) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// Pink→purple gradient sphere texture, mapped by equirectangular so the hot
// spot shows off-center for a sun-like terminator.
function makeSunTexture(THREE) {
  const w = 512, h = 256;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  // base: deep purple
  ctx.fillStyle = "#62358F";
  ctx.fillRect(0, 0, w, h);
  // hot-spot highlight
  const hot = ctx.createRadialGradient(w*0.38, h*0.42, 0, w*0.38, h*0.42, w*0.55);
  hot.addColorStop(0,    "rgba(254, 164, 218, 1)");   // pink-soft core
  hot.addColorStop(0.22, "rgba(242, 47, 176, 0.95)"); // pink-bright
  hot.addColorStop(0.55, "rgba(157, 81, 233, 0.75)"); // purple-mid
  hot.addColorStop(1,    "rgba(98, 53, 143, 0)");
  ctx.fillStyle = hot; ctx.fillRect(0, 0, w, h);
  // soft plum shadow opposite
  const dark = ctx.createRadialGradient(w*0.82, h*0.65, 0, w*0.82, h*0.65, w*0.5);
  dark.addColorStop(0, "rgba(59, 44, 74, 0.55)");
  dark.addColorStop(1, "rgba(59, 44, 74, 0)");
  ctx.fillStyle = dark; ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Per-planet gradient texture — hot-spot highlight + body color + plum shadow,
// matching the DOM-orb radial-gradient pattern so spheres read as the same
// "3D marble" aesthetic rather than flat-shaded lit surfaces.
function makePlanetTexture(THREE, colorHex) {
  // Viewer-as-light-source: hot-spot baked at (u=0.32, v=0.28) — upper-left
  // of the canvas. Equirectangular + flipY means that lands on the sphere's
  // +Z/+Y quadrant, which is the face that naturally points toward the
  // camera. Planets are NOT rotated each frame, so this highlight stays
  // camera-facing as they orbit. Matches the sun's existing "slight offset
  // right" feel.
  const w = 512, h = 256;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, w, h);
  const hot = ctx.createRadialGradient(w*0.32, h*0.28, 0, w*0.32, h*0.28, w*0.48);
  hot.addColorStop(0,    "rgba(255,255,255,0.95)");
  hot.addColorStop(0.15, "rgba(255,255,255,0.55)");
  hot.addColorStop(0.55, "rgba(255,255,255,0)");
  ctx.fillStyle = hot; ctx.fillRect(0, 0, w, h);
  const dark = ctx.createRadialGradient(w*0.78, h*0.72, 0, w*0.78, h*0.72, w*0.55);
  dark.addColorStop(0,   "rgba(42,18,64,0.85)");
  dark.addColorStop(0.4, "rgba(42,18,64,0.35)");
  dark.addColorStop(1,   "rgba(42,18,64,0)");
  ctx.fillStyle = dark; ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Neutral white radial gradient — used for per-planet glow sprites, tinted via
// material.color. Separate from bloomTex (which has pink baked in) so the
// glow matches each planet's hue.
function makeNeutralGlow(THREE) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0,    "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.4)");
  g.addColorStop(1,    "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// Orbital ring rendered as a dashed line in the XZ plane. Additive blending
// on the previous torus disappeared against the light #EEEEEE page bg — using
// normal blending with a darker purple + dashed pattern reads clearly without
// feeling heavy.
function makeRing(THREE, radius, color) {
  const segments = 192;
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineDashedMaterial({
    color: new THREE.Color(color),
    dashSize: 7,
    gapSize: 5,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const ring = new THREE.Line(geo, mat);
  ring.computeLineDistances(); // required for dashed materials
  return ring;
}

function HeroC() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const tooltipRef = React.useRef(null);

  React.useEffect(() => {
    const THREE = window.THREE;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!THREE || !wrap || !canvas) return;

    // --- renderer / scene / camera ------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true, powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // transparent
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();

    const isMobile = () => window.innerWidth < 768;
    const baseZ = () => (isMobile() ? 520 : 420);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
    camera.position.set(0, 80, baseZ());
    camera.lookAt(0, 0, 0);

    // Tilt the whole "celestial disk" for that isometric feel.
    const disk = new THREE.Group();
    disk.rotation.x = 0.3;
    scene.add(disk);

    // --- lights -------------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const warm = new THREE.PointLight(0xF22FB0, 1.8, 900, 1.8);
    warm.position.set(0, 0, 0);
    disk.add(warm);
    const fill = new THREE.DirectionalLight(0x9D51E9, 0.35);
    fill.position.set(-120, 200, 180);
    scene.add(fill);

    // --- sun ----------------------------------------------------------
    const sunTex = makeSunTexture(THREE);
    const sunGeo = new THREE.SphereGeometry(34, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    disk.add(sun);

    // Volumetric bloom: three stacked additive sprites of different sizes.
    const bloomTex = makeRadialTexture(THREE, [
      [0.00, "rgba(255, 196, 236, 1)"],
      [0.25, "rgba(242, 47, 176, 0.55)"],
      [0.55, "rgba(157, 81, 233, 0.22)"],
      [1.00, "rgba(98, 53, 143, 0)"],
    ]);
    const bloomLayers = [
      { size: 110, opacity: 0.95 },
      { size: 200, opacity: 0.55 },
      { size: 340, opacity: 0.28 },
    ].map(({ size, opacity }) => {
      const m = new THREE.SpriteMaterial({
        map: bloomTex,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const s = new THREE.Sprite(m);
      s.scale.set(size, size, 1);
      disk.add(s);
      return s;
    });

    // --- orbital plane hint (subtle disk instead of explicit rings) ---
    // A single radial-gradient disk laid flat at y=0. Hints at the orbital
    // plane as a soft plum glow under the sun, fading to transparent before
    // the outer orbit. No explicit ring geometry.
    const planeTex = makeRadialTexture(THREE, [
      [0.00, "rgba(59, 44, 74, 0.32)"],
      [0.45, "rgba(59, 44, 74, 0.20)"],
      [0.85, "rgba(59, 44, 74, 0.04)"],
      [1.00, "rgba(59, 44, 74, 0)"],
    ]);
    const planeGeo = new THREE.CircleGeometry(380, 96);
    const planeMat = new THREE.MeshBasicMaterial({
      map: planeTex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const orbitalPlane = new THREE.Mesh(planeGeo, planeMat);
    orbitalPlane.rotation.x = -Math.PI / 2;
    disk.add(orbitalPlane);

    // --- planets ------------------------------------------------------
    // Each planet gets its own gradient texture (white hot-spot / body color /
    // plum shadow) so it reads like a 3D marble matching the DOM-orb aesthetic,
    // not a flat-shaded lit sphere.
    const neutralGlow = makeNeutralGlow(THREE);
    const ORBITS = window.ORBITS || [];
    const planets = ORBITS.map((p) => {
      // Bigger planets (0.55× vs 0.4× previously) so the scene feels populated
      const radius = p.size * 0.55;
      const geo = new THREE.SphereGeometry(radius, 48, 48);
      const tex = makePlanetTexture(THREE, p.color);
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const mesh = new THREE.Mesh(geo, mat);

      // soft glow sprite behind each planet, tinted to planet color
      const glowMat = new THREE.SpriteMaterial({
        map: neutralGlow,
        color: new THREE.Color(p.color),
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Sprite(glowMat);
      const glowBase = p.size * 2.2;
      glow.scale.set(glowBase, glowBase, 1);

      const group = new THREE.Group();
      group.add(glow);
      group.add(mesh);
      disk.add(group);

      return {
        data: p,
        group,
        mesh,
        glow,
        tex,
        glowBase,
        baseRadius: radius,
        hoverScale: 1,   // eased up to ~1.35 on hover
        // ORBITS.speed is seconds-per-revolution-ish; convert to rad/s
        omega: (Math.PI * 2) / p.speed,
        phase: (p.offset / 360) * Math.PI * 2,
      };
    });

    // --- interactions -------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, clientX: 0, clientY: 0, hasPointer: false };
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const tooltip = tooltipRef.current;
    const tooltipLabel = tooltip ? tooltip.firstElementChild : null;
    const tmpWorld = new THREE.Vector3();
    const tmpProj = new THREE.Vector3();

    const onMove = (e) => {
      // reuse cached rect; mousemove fires often, each getBoundingClientRect
      // would trigger layout reads that can synchronize with JS writes.
      mouse.tx = ((e.clientX - wrapRect.left) / wrapRect.width  - 0.5) * 2;
      mouse.ty = ((e.clientY - wrapRect.top)  / wrapRect.height - 0.5) * 2;
      ndc.x =  ((e.clientX - wrapRect.left) / wrapRect.width)  * 2 - 1;
      ndc.y = -((e.clientY - wrapRect.top)  / wrapRect.height) * 2 + 1;
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
      mouse.hasPointer = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Cached wrap rect — refreshed only on scroll and resize, reused in the
    // render loop so we don't force layout on every frame.
    let wrapRect = wrap.getBoundingClientRect();
    const scroll = { progress: 0, eased: 0 };
    const onScroll = () => {
      wrapRect = wrap.getBoundingClientRect();
      const h = wrapRect.height || 1;
      // progress = how far into the hero we've scrolled (0 at top, 1 when
      // hero is fully above the fold).
      scroll.progress = Math.min(1, Math.max(0, -wrapRect.top / h));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- sizing -------------------------------------------------------
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = baseZ() * (1 - scroll.eased * 0.7);
      camera.updateProjectionMatrix();
      wrapRect = wrap.getBoundingClientRect();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // --- pause when off-screen ---------------------------------------
    let inView = true;
    const io = new IntersectionObserver(
      (es) => { inView = es[0] ? es[0].isIntersecting : true; },
      { threshold: 0.01 }
    );
    io.observe(wrap);

    // --- animation loop ----------------------------------------------
    const startZ = baseZ();
    let raf;
    const clock = new THREE.Clock();
    const lerp = (a, b, t) => a + (b - a) * t;

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!inView) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // scroll dolly — eased lerp gives that "inevitable fall" feel
      scroll.eased = lerp(scroll.eased, scroll.progress, 0.08);

      // Planets orbit. Mesh Y-rotation blends 30% toward sun-facing so the
      // painted hot-spot drifts subtly as the planet orbits — viewer stays
      // the dominant light source, but you can tell each body is moving
      // through 3D space.
      planets.forEach((pl) => {
        const a = t * pl.omega + pl.phase;
        const r = pl.data.radius;
        pl.group.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        pl.mesh.rotation.y = (-a - Math.PI / 2) * 0.3;
      });

      // hover raycast: which planet is the cursor on? Only when mouse is active.
      let hoveredKey = null;
      if (mouse.hasPointer) {
        raycaster.setFromCamera(ndc, camera);
        const meshes = planets.map(p => p.mesh);
        const hits = raycaster.intersectObjects(meshes, false);
        if (hits.length > 0) {
          const hit = hits[0];
          hoveredKey = planets.find(p => p.mesh === hit.object).data.key;
        }
      }

      // per-planet hover ease: hovered planet scales up + boosts glow.
      planets.forEach((pl) => {
        const target = pl.data.key === hoveredKey ? 1.45 : 1;
        pl.hoverScale = lerp(pl.hoverScale, target, 0.14);
        pl.mesh.scale.setScalar(pl.hoverScale);
        pl.glow.scale.setScalar(pl.glowBase * (0.9 + (pl.hoverScale - 1) * 2.2));
        pl.glow.material.opacity = 0.55 + (pl.hoverScale - 1) * 0.8;
      });

      // tooltip: wrapper sits at the planet's projected screen center each
      // frame; inner label is CSS-animated so it "pops" up out of the
      // planet surface on hover. We also measure the planet's screen-space
      // radius (via projecting a top-of-sphere point) and feed it to CSS as
      // --pr so the label rests just above the surface regardless of
      // planet size or scroll-driven distance.
      if (tooltip && tooltipLabel) {
        if (hoveredKey) {
          const pl = planets.find(p => p.data.key === hoveredKey);
          pl.group.getWorldPosition(tmpWorld);
          tmpProj.copy(tmpWorld).project(camera);
          // use cached wrapRect — no getBoundingClientRect() per frame
          const sx = (tmpProj.x * 0.5 + 0.5) * wrapRect.width;
          const sy = (-tmpProj.y * 0.5 + 0.5) * wrapRect.height;
          // approximate screen radius: project top-of-sphere point
          tmpWorld.y += pl.baseRadius * pl.hoverScale;
          tmpProj.copy(tmpWorld).project(camera);
          const sTopY = (-tmpProj.y * 0.5 + 0.5) * wrapRect.height;
          const screenRadius = Math.max(14, Math.abs(sy - sTopY));
          tooltip.style.transform = `translate(${sx}px, ${sy}px)`;
          tooltip.style.setProperty("--pr", `${screenRadius}px`);
          if (tooltipLabel.textContent !== pl.data.label) {
            tooltipLabel.textContent = pl.data.label;
          }
          tooltip.classList.add("is-on");
        } else {
          tooltip.classList.remove("is-on");
        }
      }

      // sun: gentle idle pulse AND aggressive scroll growth.
      // Scale lerps 1 → 3.2× as scroll progresses; bloom grows with it so the
      // glow fills the frame. This is the "way bigger on scroll" moment.
      const idlePulse = 1 + Math.sin(t * 1.6) * 0.03;
      const scrollScale = 1 + scroll.eased * 2.2;   // 1 → 3.2
      sun.scale.setScalar(idlePulse * scrollScale);
      bloomLayers.forEach((layer, i) => {
        const baseSizes = [110, 200, 340];
        const s = baseSizes[i] * (1 + scroll.eased * 2.6);
        layer.scale.set(s, s, 1);
      });
      bloomLayers[0].material.opacity = 0.85 + Math.sin(t * 1.3) * 0.1;

      // mouse tilt with damping
      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);
      disk.rotation.z = mouse.x * 0.08;
      disk.rotation.x = 0.3 + mouse.y * 0.08;

      // camera dolly — softened since sun growth is now the dramatic effect.
      // Camera retreats slightly as sun grows so we don't end inside it.
      const z = lerp(startZ, startZ * 0.75, scroll.eased);
      camera.position.z = z;
      camera.position.y = lerp(80, 50, scroll.eased);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    // --- cleanup ------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      io.disconnect();
      // dispose resources
      sunGeo.dispose(); sunMat.dispose(); sunTex.dispose();
      bloomTex.dispose();
      neutralGlow.dispose();
      bloomLayers.forEach(s => s.material.dispose());
      planeGeo.dispose(); planeMat.dispose(); planeTex.dispose();
      planets.forEach(pl => {
        pl.mesh.geometry.dispose(); pl.mesh.material.dispose();
        pl.tex.dispose();
        pl.glow.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-c" id="top">
      {/* three.js canvas fills the full viewport width */}
      <canvas ref={canvasRef} className="hero-c__canvas" aria-hidden="true"/>

      {/* planet-hover tooltip — wrapper positioned each frame by JS,
          inner label animates scale+opacity from planet surface via CSS */}
      <div ref={tooltipRef} className="hero-c__tooltip" aria-hidden="true">
        <span className="hero-c__tooltip-label"></span>
      </div>

      {/* overlay stays inside the 1440 wrapper */}
      <div className="hero-c__inner">
        <div className="hero-c__copy">
          <div className="hero-a__tag"><span className="pulse"/> Reāllaika noliktavas vadība</div>
          <h1 className="h1" style={{textShadow:"0 2px 30px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4)", marginBottom:14}}>
            Noliktava<br/>
            vienotā sistēmā
          </h1>
          <p style={{
            fontFamily:"var(--font-mono)",
            fontSize:"clamp(20px, 2.4vw, 34px)",
            color:"var(--purple-mid)",
            lineHeight:1.25,
            letterSpacing:"-0.01em",
            margin:"0 0 30px",
            textShadow:"0 1px 12px rgba(255,255,255,0.75)",
          }}>
            viens datu slānis<br/>
            katra kustība
          </p>
          <p className="lead" style={{maxWidth:560, textShadow:"0 1px 16px rgba(255,255,255,0.7)"}}>
            Katra skenēšana parādās 50 milisekundēs. Katrs lēmums — uz reāliem skaitļiem.
            Noliktavas pārvaldība, kas seko līdzi jūsu biznesa ātrumam.
          </p>
          <div className="hero-a__actions">
            <button className="btn btn--primary">
              Pieprasīt demo
              <Icon name="arrow" size={16} />
            </button>
            <button className="btn btn--ghost">
              <Icon name="chart" size={16} />
              Skatīt dzīvās atskaites
            </button>
          </div>
        </div>

        <div className="hero-c__dash">
          <DashPreview />
        </div>
      </div>
    </div>
  );
}

window.HeroC = HeroC;
window.DashPreview = DashPreview;
