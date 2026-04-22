// Shared.jsx — header, footer, section headers used across all 3 variations

function Header({ variation, setVariation, active = "products" }) {
  return (
    <header className="hdr">
      <div className="hdr__inner">
        <a className="hdr__logo" href="#top">
          <img src="../assets/logo.svg" alt="Solwit" />
        </a>
        <nav className="hdr__nav">
          <a className={active==="products"?"active":""}>Produkti</a>
          <a>Risinājumi</a>
          <a>Klienti</a>
          <a>Dokumentācija</a>
          <a>Kontakti</a>
        </nav>
        <div className="hdr__actions">
          <span className="hdr__crumb">Produkti <span style={{opacity:.4,margin:"0 6px"}}>/</span> <b>WMS</b></span>
          <button className="btn btn--secondary btn--sm">Pieprasīt demo</button>
          <button className="btn btn--primary btn--sm">
            Sākt
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__inner">
        <div className="ftr__brand">
          <img src="../assets/logo-purple.svg" alt="Solwit" />
          <p>Noliktavas vadība, kas pielāgojas jūsu procesiem — nevis otrādi.</p>
        </div>
        <div className="ftr__col">
          <div className="ftr__hd">Produkts</div>
          <a>Funkcijas</a><a>Integrācijas</a><a>Cenas</a><a>Drošība</a><a>Changelog</a>
        </div>
        <div className="ftr__col">
          <div className="ftr__hd">Izstrādātājiem</div>
          <a>Dokumentācija</a><a>REST API</a><a>Webhooks</a><a>SDK</a><a>Status</a>
        </div>
        <div className="ftr__col">
          <div className="ftr__hd">Uzņēmums</div>
          <a>Par mums</a><a>Klienti</a><a>Karjera</a><a>Blogs</a><a>Kontakti</a>
        </div>
      </div>
      <div className="ftr__legal">
        <span>Copyright 2025 Solwit. Visas tiesības aizsargātas.</span>
        <span>Brīvības iela 103, Rīga · info@solwit.lv</span>
      </div>
    </footer>
  );
}

function Icon({ name, size=22, stroke=2 }) {
  const base = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    box: <React.Fragment><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></React.Fragment>,
    zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
    chart: <React.Fragment><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></React.Fragment>,
    plug: <React.Fragment><path d="M12 2v6"/><path d="M6 9h12l-1 11a2 2 0 01-2 2H9a2 2 0 01-2-2L6 9z"/></React.Fragment>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    scan: <React.Fragment><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></React.Fragment>,
    code: <React.Fragment><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></React.Fragment>,
    layers: <React.Fragment><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></React.Fragment>,
    truck: <React.Fragment><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></React.Fragment>,
    arrow: <React.Fragment><path d="M5 12h14M13 5l7 7-7 7"/></React.Fragment>,
  };
  return <svg {...base}>{paths[name]}</svg>;
}

window.Header = Header;
window.Footer = Footer;
window.Icon = Icon;
