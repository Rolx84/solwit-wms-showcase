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

function HeroC() {
  const ref = React.useRef(null);
  const [mouse, setMouse] = React.useState({x:0, y:0});
  const [scrollY, setScrollY] = React.useState(0);
  const [t, setT] = React.useState(0);

  React.useEffect(() => {
    let raf;
    const tick = () => { setT(performance.now() / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    const onMove = (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      setMouse({ x: cx * 2, y: cy * 2 });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div ref={ref} className="hero-c" style={{position:"relative", maxWidth:1440, margin:"0 auto", overflow:"hidden"}} id="top">
      {/* spatial orb scene */}
      <div style={{position:"absolute", inset:0, pointerEvents:"none", perspective:"1200px"}}>
        {/* background ambient glow */}
        <div style={{
          position:"absolute", right:"-220px", top:"-180px",
          width:900, height:900, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(224,130,254,0.18) 0%, rgba(224,130,254,0) 60%)",
          pointerEvents:"none",
        }}/>

        {/* far background orb */}
        <Orb size={120} color="#3B2C4A" x={18} y={18} z={-200} blur={2} opacity={0.55} depth={0.15} mouse={mouse} scrollY={scrollY} drift={{t, fx:0.4, fy:0.3, ax:8, ay:6}}/>

        {/* mid orbs */}
        <Orb size={90}  color="#62358F" x={88} y={72} z={-50} opacity={0.9} depth={0.5} mouse={mouse} scrollY={scrollY} drift={{t, fx:0.5, fy:0.7, ax:14, ay:10}}/>
        <Orb size={70}  color="#9D51E9" x={8}  y={78} z={0}   opacity={0.95} depth={0.55} mouse={mouse} scrollY={scrollY} drift={{t, fx:0.6, fy:0.4, ax:12, ay:14}}/>
        <Orb size={56}  color="#FEA4DA" x={62} y={12} z={20}  opacity={0.85} depth={0.6} mouse={mouse} scrollY={scrollY} drift={{t, fx:0.8, fy:0.5, ax:10, ay:8}}/>

        {/* the main orb — biggest, behind headline, parallax follows cursor */}
        <Orb size={520} color="#E082FE" x={78} y={48} z={-100} opacity={1} depth={0.3} mouse={mouse} scrollY={scrollY} drift={{t, fx:0.2, fy:0.25, ax:6, ay:4}}/>

        {/* foreground tiny orb (closest, most parallax) */}
        <Orb size={36}  color="#F22FB0" x={48} y={88} z={120} opacity={1} depth={1.0} mouse={mouse} scrollY={scrollY} drift={{t, fx:1.1, fy:0.9, ax:18, ay:14}}/>
        <Orb size={28}  color="#E082FE" x={92} y={32} z={150} opacity={1} depth={1.2} mouse={mouse} scrollY={scrollY} drift={{t, fx:1.3, fy:1.1, ax:20, ay:16}}/>
      </div>

      {/* headline floats above the orbs */}
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
