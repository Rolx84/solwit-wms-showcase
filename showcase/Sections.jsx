// Sections.jsx — shared mid-page sections for the WMS landing

function Features() {
  const items = [
    { icon: "scan",   title: "Skenēšana reāllaikā", desc: "Android un iOS aplikācijas ar <50ms atbildes laiku. Offline režīms, kas sinhronizējas, kad tīkls atgriežas." },
    { icon: "plug",   title: "Integrējas ar visu", desc: "REST API, webhooks un gatavi savienotāji uz Horizon, Tildi, 1C un Microsoft Dynamics." },
    { icon: "chart",  title: "Atskaites, ko saprot vadība", desc: "Dzīvie paneļi par krājumu apriti, piegādes precizitāti un noliktavas efektivitāti — bez SQL." },
    { icon: "shield", title: "Drošība, kas atbilst GDPR", desc: "Datu glabātuve Rīgā, ISO 27001 sertificēta. Pilna audita pēda katrai skenēšanai." },
    { icon: "layers", title: "Daudzpakāpju noliktavas", desc: "Vadiet desmitiem noliktavu kā vienu — vai katru atsevišķi. Automātiska pārvade starp tām." },
    { icon: "truck",  title: "Kurjera integrācija", desc: "Automātiska etiķešu drukāšana DPD, Omniva, Venipak un Latvijas Pasts no vienas pogas." },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-lbl">funkcionalitāte</div>
        <h2 className="h2">Sešas lietas, kas padara<br/>WMS par ikdienas rīku.</h2>
        <p className="lead">Katra funkcija ir reāla klienta lūgums, kas kļuvis par daļu no platformas.</p>
        <div className="fgrid" style={{marginTop:40}}>
          {items.map((f,i) => (
            <div className="fcard reveal" key={i} style={{transitionDelay: `${i*60}ms`}}>
              <div className="fcard__icon"><Icon name={f.icon}/></div>
              <div className="fcard__t">{f.title}</div>
              <div className="fcard__d">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { title: "1 · Skenē QR", desc: "Darbinieks skenē paletes QR kodu ar savu Android ierīci." },
  { title: "2 · Validācija", desc: "WMS pārbauda SKU pret ERP un apstiprina daudzumu." },
  { title: "3 · Sadala plauktā", desc: "Algoritms izvēlas optimālo vietu pēc apgrozījuma." },
  { title: "4 · Nosūta webhook", desc: "receipt.created tiek nosūtīts uz ERP, grāmatvedību un dashboards." },
];

function Demo() {
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  React.useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 2400);
    return () => clearTimeout(id);
  }, [step, playing]);

  return (
    <section className="section" style={{paddingTop:60}}>
      <div className="wrap">
        <div className="section-lbl">interaktīvais demo</div>
        <h2 className="h2">Vienas paletes ceļš<br/>caur sistēmu.</h2>
        <p className="lead">Klikšķiniet uz soļiem vai ļaujiet tiem riteņot paši.</p>

        <div className="demo" style={{marginTop:40}}>
          <div className="demo__script">
            <div style={{display:"flex", gap:10, marginBottom:10}}>
              <button className="btn btn--sm btn--primary" onClick={() => setPlaying(!playing)}>
                {playing ? "Apturēt" : "▶ Atskaņot"}
              </button>
              <button className="btn btn--sm btn--ghost" onClick={() => { setStep(0); setPlaying(false); }}>
                ⟲ Atsākt
              </button>
            </div>
            {STEPS.map((s, i) => (
              <div key={i}
                className={"demo__step" + (i===step?" on":"") + (i<step?" done":"")}
                onClick={() => { setStep(i); setPlaying(false); }}>
                <div className="demo__num">{i<step?"✓":i+1}</div>
                <div className="demo__step-body">
                  <div className="demo__step-title">{s.title}</div>
                  <div className="demo__step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="demo__stage">
            <div className="demo__statusbar">
              <span>● WMS RIX-01</span>
              <span>09:42:18</span>
            </div>
            <div className="demo__content">
              <DemoStage step={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoStage({ step }) {
  // animated content per step
  if (step === 0) return (
    <div key="s0" style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18}}>
      <div style={{width:200, height:200, background:"#fff", borderRadius:16, position:"relative", overflow:"hidden"}}>
        <div style={{
          position:"absolute", inset:"0 0 0 0",
          backgroundImage:"repeating-linear-gradient(0deg, #000 0 8px, #fff 8px 14px), repeating-linear-gradient(90deg, #000 0 8px, #fff 8px 14px)",
          backgroundSize:"28px 28px, 28px 28px",
          mixBlendMode:"multiply",
          opacity:0.8,
        }}/>
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:3, background:"#F22FB0",
          boxShadow:"0 0 12px #F22FB0",
          animation:"scan 1.4s ease-in-out infinite",
        }}/>
      </div>
      <div style={{fontFamily:"var(--font-mono)", fontSize:14, opacity:0.8}}>Skenē paletes QR…</div>
    </div>
  );
  if (step === 1) return (
    <div key="s1" style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:12, fontFamily:"var(--font-mono)", fontSize:13}}>
      <div style={{color:"#E082FE"}}>→ validating</div>
      {[
        ["SKU",      "PL-4420",      "ok"],
        ["Piegādātājs", "DPD RIX",  "ok"],
        ["Daudzums",   "128 gab.",   "ok"],
        ["ERP sinhro", "Horizon v22", "ok"],
      ].map(([k,v,s],i) => (
        <div key={k} style={{
          display:"flex", justifyContent:"space-between",
          padding:"10px 14px", background:"rgba(255,255,255,0.06)", borderRadius:8,
          animation:`fade-in 400ms ${i*180}ms both`,
        }}>
          <span style={{opacity:0.7}}>{k}</span>
          <span>{v} <span style={{color:"#63e6a0", marginLeft:8}}>● {s}</span></span>
        </div>
      ))}
    </div>
  );
  if (step === 2) return (
    <div key="s2" style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:10}}>
      <div style={{fontFamily:"var(--font-mono)", fontSize:13, color:"#E082FE", marginBottom:6}}>→ optimal slot: A-12-03</div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(8, 1fr)", gap:4}}>
        {Array.from({length:32}).map((_,i) => {
          const target = i === 18;
          return (
            <div key={i} style={{
              aspectRatio:"1", borderRadius:4,
              background: target ? "#9D51E9" : "rgba(255,255,255,0.08)",
              boxShadow: target ? "0 0 16px #9D51E9" : "none",
              animation: target ? "pop 600ms ease both" : "none",
            }}/>
          );
        })}
      </div>
      <div style={{fontFamily:"var(--font-mono)", fontSize:12, opacity:0.7, marginTop:10}}>
        Algoritma izvēle: augstas rotācijas zona, blakus iepriekšējai partijai.
      </div>
    </div>
  );
  return (
    <div key="s3" style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:10, fontFamily:"var(--font-mono)", fontSize:12}}>
      <div style={{color:"#E082FE", marginBottom:6}}>→ POST https://hook.solwit.lv/receipts</div>
      <pre style={{margin:0, color:"#e8e0f0", background:"rgba(255,255,255,0.04)", padding:14, borderRadius:8, fontSize:12, lineHeight:1.6}}>{`{
  "event": "receipt.created",
  "id": "rcpt_8KnQ9eL2",
  "warehouse": "RIX-01",
  "sku": "PL-4420",
  "qty": 128,
  "slot": "A-12-03",
  "ts": "2025-04-20T09:42:18Z"
}`}</pre>
      <div style={{display:"flex", gap:6, marginTop:6, flexWrap:"wrap"}}>
        {["ERP","grāmatvedība","dashboard","Slack"].map((x,i) => (
          <span key={x} style={{
            padding:"4px 10px", background:"rgba(157,81,233,0.2)", color:"#E082FE",
            borderRadius:6, fontSize:11,
            animation:`fade-in 300ms ${i*120 + 400}ms both`,
          }}>✓ {x}</span>
        ))}
      </div>
    </div>
  );
}

function Ecosystem() {
  const [active, setActive] = React.useState("ERP");
  const products = ORBITS;
  return (
    <section className="section" style={{background:"#fff", borderRadius:32, margin:"0 40px"}}>
      <div className="wrap">
        <div className="section-lbl">ekosistēma</div>
        <h2 className="h2">WMS ir viena zvaigzne.<br/>Bet viņa nav viena.</h2>
        <p className="lead">Solwit produkti dalās ar vienu datu slāni. Pievienojiet vienu — vai visus sešus.</p>

        <div className="chipbar" style={{marginTop:30}}>
          {products.map(p => (
            <button key={p.key} className={"chip" + (active===p.key?" on":"")}
              onClick={() => setActive(p.key)}>
              <span className="dot" style={{background:p.color}}/>
              {p.label}
            </button>
          ))}
        </div>

        <div className="eco__detail" style={{marginTop:30, padding:32, background:"var(--bg)", borderRadius:20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"center"}}>
          <div>
            <div className="section-lbl" style={{fontSize:12}}>{active.toLowerCase()}</div>
            <h3 className="h3">{ECO[active].title}</h3>
            <p className="body">{ECO[active].desc}</p>
            <div style={{display:"flex", flexWrap:"wrap", gap:10, marginTop:18}}>
              {ECO[active].tags.map(t => (
                <span key={t} style={{padding:"6px 12px", background:"var(--surface-muted)", borderRadius:8, fontFamily:"var(--font-mono)", fontSize:12, color:"var(--ink-2)"}}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{
              width:180, height:180, borderRadius:"50%",
              background:`radial-gradient(circle at 35% 30%, #fff 0%, ${products.find(p=>p.key===active).color} 55%, #3B2C4A 100%)`,
              boxShadow:`0 0 60px ${products.find(p=>p.key===active).color}80`,
              animation:"float 6s ease-in-out infinite",
            }}/>
          </div>
        </div>
      </div>
    </section>
  );
}

const ECO = {
  ERP:       { title: "Finanses, kas zina par katru paleti", desc: "WMS dati plūst tieši uz ERP — krājumi, izmaksas, rezerves. Nav vairāk Excel eksportēšanas pa nakti.", tags:["realtime","webhooks","account sync"] },
  RAZOSANA:  { title: "Ražošana, kas redz noliktavas",         desc: "Izejvielu pieejamība un izsekošana no saņemšanas līdz gatavai precei.", tags:["BOM","traceability"] },
  ALGA:      { title: "Akorda alga no skenējumiem",            desc: "Darbinieku paveiktais tiek uzskaitīts automātiski — katra skenēšana kļūst par algas datu punktu.", tags:["performance","auto payroll"] },
  PERSONALS: { title: "Maiņas un prasmes",                     desc: "Uzskaitiet, kam ir ko darīt, kam ir apmācība, un kam gaidāma vakance.", tags:["shifts","training"] },
  DOKUMENTI: { title: "Pavadzīmes un rēķini",                  desc: "Visi dokumenti glabāti vienuviet — saistīti ar konkrētu sūtījumu vai pasūtījumu.", tags:["EDI","e-invoice"] },
  API:       { title: "Jūsu izstrādātāji var darīt vairāk",   desc: "REST, GraphQL, SDK Node/Python/.NET, webhooks — veidojiet savu saskarni uz Solwit pamata.", tags:["REST","GraphQL","3 SDK"] },
};

function Proof() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="proof__grid" style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:40, alignItems:"center"}}>
          <div>
            <div className="section-lbl">klientu atsauksme</div>
            <h2 className="h2 proof__quote" style={{fontSize:40}}>"Mēs noņēmām trīs spreadsheet un pievienojām vienu API. Nakšu maiņa kļuva par ceturkšņa slodzi."</h2>
            <div style={{marginTop:24, display:"flex", alignItems:"center", gap:14}}>
              <div style={{width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#E082FE,#62358F)"}}/>
              <div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:14, color:"var(--ink)"}}>Kristaps Ozols</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:12, color:"var(--ink-3)"}}>CTO · Industra Logistics</div>
              </div>
            </div>
          </div>
          <div className="proof__stats" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
            <StatCard num="−68%" lbl="kļūdu samazinājums" tone="purple"/>
            <StatCard num="3.2×" lbl="ātrāka ienākošā apstrāde" tone="muted"/>
            <StatCard num="14 d." lbl="vidējais onboardings" tone="white"/>
            <StatCard num="500+" lbl="aktīvie lietotāji" tone="purple"/>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({num, lbl, tone}) {
  const bg = tone==="purple" ? "var(--purple-dark)" : tone==="muted" ? "var(--surface-muted)" : "#fff";
  const fg = tone==="purple" ? "#fff" : "var(--ink)";
  const sh = tone==="white" ? "0 4px 24px rgba(59,18,101,0.06)" : "none";
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState("");

  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // Parse: capture leading sign (-+), digits, optional decimal, and trailing suffix (%, ×, etc.)
        const m = /^([-+]?)(\d+(?:\.\d+)?)(.*)$/.exec(num.trim());
        if (!m) { setShown(num); return; }
        const sign = m[1] || "";
        const target = parseFloat(m[2]);
        const suffix = m[3] || "";
        const isDecimal = m[2].includes(".");
        const duration = 1400;
        const start = performance.now();
        const ease = t => 1 - Math.pow(1 - t, 3);   // easeOutCubic
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const val = target * ease(p);
          const str = isDecimal ? val.toFixed(1) : Math.round(val).toString();
          setShown(sign + str + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [num]);

  return (
    <div ref={ref} style={{background:bg, color:fg, padding:24, borderRadius:16, minHeight:120, display:"flex", flexDirection:"column", justifyContent:"space-between", boxShadow:sh}}>
      <div style={{fontFamily:"var(--font-display)", fontWeight:800, fontSize:44, lineHeight:1, fontVariantNumeric:"tabular-nums"}}>{shown || "0"}</div>
      <div style={{fontFamily:"var(--font-mono)", fontSize:13, opacity:0.85}}>{lbl}</div>
    </div>
  );
}

function CTA() {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="section" style={{paddingBottom:60}}>
      <div className="wrap">
        <div className="cta">
          <div style={{position:"relative", zIndex:1}}>
            <div className="section-lbl" style={{color:"#E082FE"}}>sāksim</div>
            <h2 className="cta__title">Pieprasiet<br/>30 min demo</h2>
            <p className="cta__lead">Parādīsim WMS ar jūsu datiem. Nav obligāti. Nav slidu. Nav pārdevēju.</p>
            <div style={{display:"flex", gap:24, fontFamily:"var(--font-mono)", fontSize:13, color:"rgba(255,255,255,0.8)"}}>
              <div>✓ Live vide</div>
              <div>✓ Jūsu SKU</div>
              <div>✓ 30 min</div>
            </div>
          </div>
          <form className="cta__form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
            {sent ? (
              <div style={{padding:"24px 0", textAlign:"center"}}>
                <div style={{fontFamily:"var(--font-mono)", fontSize:14, color:"#E082FE", marginBottom:8}}>✓ pieteikums nosūtīts</div>
                <div>Sazināsimies ar jums tuvāko 24 stundu laikā.</div>
              </div>
            ) : (
              <>
                <input placeholder="Vārds, uzvārds" required/>
                <input placeholder="Darba e-pasts" type="email" required/>
                <input placeholder="Uzņēmums · amats"/>
                <textarea placeholder="Cik SKU jūs pārvaldāt un kurā sistēmā šobrīd?" rows={3}/>
                <button type="submit" className="btn btn--light" style={{marginTop:4, alignSelf:"flex-start"}}>
                  Nosūtīt pieteikumu
                  <Icon name="arrow" size={16}/>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

window.Features = Features;
window.Demo = Demo;
window.Ecosystem = Ecosystem;
window.Proof = Proof;
window.CTA = CTA;
