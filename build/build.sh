#!/usr/bin/env bash
# Rebuild showcase/app.js from the four source .jsx files.
# Concatenates OrbitScene, Shared, VariationC, Sections + the App bootstrap,
# then runs esbuild with JSX transform + minification.
# React/ReactDOM stay external (loaded via UMD script tags in index.html).
set -e
cd "$(dirname "$0")/.."

cat showcase/OrbitScene.jsx showcase/Shared.jsx showcase/VariationC.jsx showcase/Sections.jsx > build/app-src.jsx
cat >> build/app-src.jsx <<'JSX'

function App() {
  React.useEffect(() => {
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />
      <HeroC />
      <Features />
      <Demo />
      <Ecosystem />
      <Proof />
      <CTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
JSX

npx --yes esbuild@0.24.0 build/app-src.jsx \
  --bundle=false --loader:.jsx=jsx --jsx=transform \
  --minify --target=es2019 \
  --outfile=showcase/app.js

echo "Built showcase/app.js"
