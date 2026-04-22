// OrbitScene.jsx — interactive "celestial bodies" 3D-ish scene
// Central sun = WMS. Planets = connected systems. Hover / click to inspect.
// Pure CSS 3D transforms (no three.js) for perf + brand fidelity.

const ORBITS = [
  { key: "ERP",        label: "ERP",        color: "#E082FE", radius: 170, speed: 48,  size: 44, offset: 0 },
  { key: "RAZOSANA",   label: "Ražošana",   color: "#F22FB0", radius: 170, speed: 48,  size: 40, offset: 140 },
  { key: "ALGA",       label: "Alga",       color: "#9D51E9", radius: 240, speed: 72,  size: 36, offset: 70 },
  { key: "PERSONALS",  label: "Personāls",  color: "#62358F", radius: 240, speed: 72,  size: 36, offset: 220 },
  { key: "DOKUMENTI",  label: "Dokumenti",  color: "#3B2C4A", radius: 305, speed: 96,  size: 32, offset: 40 },
  { key: "API",        label: "REST API",   color: "#FEA4DA", radius: 305, speed: 96,  size: 32, offset: 180 },
];

function OrbitScene({ paused, onHover }) {
  const [t, setT] = React.useState(0);
  const [hover, setHover] = React.useState(null);

  React.useEffect(() => {
    if (paused) return;
    let raf, start = performance.now();
    const loop = (now) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <div className="orbit-scene" style={{ perspective: "1200px" }}>
      <div className="orbit-sky" style={{
        position: "absolute", inset: 0,
        transform: "rotateX(58deg) rotateZ(-14deg)",
        transformStyle: "preserve-3d",
      }}>
        {/* orbit rings */}
        {[170, 240, 305].map(r => (
          <div key={r} style={{
            position: "absolute", left: "50%", top: "50%",
            width: r*2, height: r*2, marginLeft: -r, marginTop: -r,
            borderRadius: "50%",
            border: "1px dashed rgba(157,81,233,0.28)",
          }}/>
        ))}

        {/* sun (WMS) */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 120, height: 120, marginLeft: -60, marginTop: -60,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #FEA4DA 0%, #9D51E9 45%, #62358F 100%)",
          boxShadow: "0 0 80px rgba(157,81,233,0.55), 0 0 120px rgba(242,47,176,0.35)",
          transform: "translateZ(24px)",
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle at 65% 70%, rgba(242,47,176,0.7) 0%, transparent 55%)",
            mixBlendMode: "screen",
          }}/>
        </div>

        {/* planets */}
        {ORBITS.map((p) => {
          const angle = ((t * (360 / p.speed)) + p.offset) * (Math.PI / 180);
          const x = Math.cos(angle) * p.radius;
          const y = Math.sin(angle) * p.radius;
          const isHover = hover === p.key;
          return (
            <div key={p.key}
              onMouseEnter={() => { setHover(p.key); onHover && onHover(p); }}
              onMouseLeave={() => { setHover(null); onHover && onHover(null); }}
              style={{
                position: "absolute", left: "50%", top: "50%",
                width: p.size, height: p.size,
                marginLeft: -p.size/2, marginTop: -p.size/2,
                transform: `translate3d(${x}px, ${y}px, ${20 + Math.sin(angle)*14}px)`,
                borderRadius: "50%",
                background: `radial-gradient(circle at 32% 30%, ${lighten(p.color)} 0%, ${p.color} 60%, ${darken(p.color)} 100%)`,
                boxShadow: isHover
                  ? `0 0 0 2px ${p.color}, 0 0 30px ${p.color}`
                  : `0 6px 20px rgba(59,18,101,0.35), inset -4px -6px 10px rgba(0,0,0,0.18)`,
                cursor: "pointer",
                transition: "box-shadow 160ms",
              }}
            />
          );
        })}
      </div>

      {/* flat-plane label that follows hovered planet */}
      {hover && (() => {
        const p = ORBITS.find(o => o.key === hover);
        const angle = ((t * (360 / p.speed)) + p.offset) * (Math.PI / 180);
        // project 3D-rotated coord back to screen approximation
        const x = Math.cos(angle) * p.radius;
        const y = Math.sin(angle) * p.radius;
        // rough match of rotateX(58deg) rotateZ(-14deg)
        const cosZ = Math.cos(-14 * Math.PI / 180), sinZ = Math.sin(-14 * Math.PI / 180);
        const xr = x * cosZ - y * sinZ;
        const yr = x * sinZ + y * cosZ;
        const ys = yr * Math.cos(58 * Math.PI / 180);
        return (
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate3d(${xr}px, ${ys - 34}px, 0)`,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>
            <div style={{
              background: "#fff", borderRadius: 8,
              padding: "6px 12px",
              fontFamily: "Fragment Mono, monospace", fontSize: 12,
              color: "var(--ink)",
              boxShadow: "0 6px 20px rgba(59,18,101,0.2)",
            }}>
              {p.label}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function lighten(hex, amt=40) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n>>16) + amt, g = ((n>>8)&0xff) + amt, b = (n&0xff) + amt;
  r = Math.min(255, r); g = Math.min(255, g); b = Math.min(255, b);
  return `rgb(${r},${g},${b})`;
}
function darken(hex, amt=40) {
  const n = parseInt(hex.slice(1), 16);
  let r = Math.max(0, (n>>16) - amt), g = Math.max(0, ((n>>8)&0xff) - amt), b = Math.max(0, (n&0xff) - amt);
  return `rgb(${r},${g},${b})`;
}

window.OrbitScene = OrbitScene;
window.ORBITS = ORBITS;
