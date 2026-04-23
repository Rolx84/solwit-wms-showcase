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

// Wispy dashed ring: a thin torus rendered with a radial alpha mask, so the
// edges fade out instead of looking like a hard hoop.
function makeRing(THREE, radius, color) {
  const geo = new THREE.RingGeometry(radius - 0.35, radius + 0.35, 192, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = -Math.PI / 2; // lie flat on the orbital plane
  return ring;
}

function HeroC() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);

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
    const sunGeo = new THREE.SphereGeometry(22, 48, 48);
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

    // --- orbital rings (wispy) ---------------------------------------
    // Repo-wide radii are 170/240/305 (px-ish). Scene units are similar scale.
    const RING_RADII = [170, 240, 305];
    const ringColors = ["#9D51E9", "#9D51E9", "#62358F"];
    const rings = RING_RADII.map((r, i) => makeRing(THREE, r, ringColors[i]));
    rings.forEach(r => disk.add(r));

    // --- planets ------------------------------------------------------
    const ORBITS = window.ORBITS || [];
    const planets = ORBITS.map((p) => {
      const geo = new THREE.SphereGeometry(p.size * 0.4, 32, 32);
      const col = new THREE.Color(p.color);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.28,
        roughness: 0.45,
        metalness: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);

      // soft glow sprite behind each planet
      const glowMat = new THREE.SpriteMaterial({
        map: bloomTex,
        color: col,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(p.size * 1.9, p.size * 1.9, 1);

      const group = new THREE.Group();
      group.add(glow);
      group.add(mesh);
      disk.add(group);

      return {
        data: p,
        group,
        mesh,
        // ORBITS.speed is seconds-per-revolution-ish; convert to rad/s
        omega: (Math.PI * 2) / p.speed,
        phase: (p.offset / 360) * Math.PI * 2,
      };
    });

    // --- interactions -------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const scroll = { progress: 0, eased: 0 };
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const h = r.height || 1;
      // progress = how far into the hero we've scrolled (0 at top, 1 when
      // hero is fully above the fold).
      const p = Math.min(1, Math.max(0, -r.top / h));
      scroll.progress = p;
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

      // planets orbit
      planets.forEach((pl) => {
        const a = t * pl.omega + pl.phase;
        const r = pl.data.radius;
        pl.group.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        pl.mesh.rotation.y += dt * 0.6;
      });

      // sun gentle pulse (~3%)
      const pulse = 1 + Math.sin(t * 1.6) * 0.03;
      sun.scale.setScalar(pulse);
      bloomLayers[0].material.opacity = 0.85 + Math.sin(t * 1.3) * 0.1;

      // mouse tilt with damping
      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);
      disk.rotation.z = mouse.x * 0.08;
      disk.rotation.x = 0.3 + mouse.y * 0.08;

      // scroll dolly — eased lerp gives that "inevitable fall" feel
      scroll.eased = lerp(scroll.eased, scroll.progress, 0.08);
      const z = lerp(startZ, startZ * 0.3, scroll.eased);
      camera.position.z = z;
      // slight y-dip so we feel like we dive under the disk as we go in
      camera.position.y = lerp(80, 30, scroll.eased);
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
      bloomLayers.forEach(s => s.material.dispose());
      rings.forEach(r => { r.geometry.dispose(); r.material.dispose(); });
      planets.forEach(pl => {
        pl.mesh.geometry.dispose(); pl.mesh.material.dispose();
        pl.group.children.forEach(c => c.material && c.material !== pl.mesh.material && c.material.dispose());
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-c" style={{position:"relative", maxWidth:1440, margin:"0 auto", overflow:"hidden"}} id="top">
      {/* three.js canvas sits behind the overlay */}
      <canvas ref={canvasRef} className="hero-c__canvas" aria-hidden="true"/>

      {/* headline floats above the scene */}
      <div className="hero-c__copy" style={{position:"relative", zIndex:5, maxWidth:720}}>
        <div className="hero-a__tag"><span className="pulse"/> Reāllaika noliktavas vadība</div>
        <h1 className="h1" style={{textShadow:"0 2px 30px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4)"}}>
          Redziet savu noliktavu<br/>
          <span className="h1--mono">tā, kā tā ir tagad</span>
        </h1>
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

      {/* dashboard preview */}
      <div className="hero-c__dash" style={{position:"relative", zIndex:5, marginTop:40}}>
        <DashPreview />
      </div>
    </div>
  );
}

window.HeroC = HeroC;
window.DashPreview = DashPreview;
