import { useState, useEffect, useRef } from "react";

// ── Keyframe injection ──────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

  :root {
    --abyss:      #020b12;
    --deep:       #041825;
    --mid:        #062030;
    --cyan:       #00ffe7;
    --cyan-dim:   #00ffe740;
    --cyan-glow:  #00ffe720;
    --magenta:    #ff2d78;
    --mag-dim:    #ff2d7840;
    --gold:       #ffd166;
    --bio:        #3d9eff;
    --bio-dim:    #3d9eff30;
    --text-prime: #d0f4f0;
    --text-dim:   #5a9ea0;
    --scan-line:  rgba(0,255,231,0.03);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--abyss);
    color: var(--text-prime);
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    position: fixed;
    width: 24px; height: 24px;
    border: 1.5px solid var(--cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width .15s, height .15s, background .15s;
    mix-blend-mode: screen;
  }
  .cursor-dot {
    position: fixed;
    width: 4px; height: 4px;
    background: var(--cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px var(--cyan);
  }

  /* Scanlines overlay */
  .scanlines::after {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      var(--scan-line) 2px,
      var(--scan-line) 4px
    );
    pointer-events: none;
    z-index: 100;
    animation: scanScroll 8s linear infinite;
  }
  @keyframes scanScroll {
    from { background-position: 0 0; }
    to   { background-position: 0 100vh; }
  }

  /* Glitch text */
  @keyframes glitch1 {
    0%,100% { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
    20%      { clip-path: inset(30% 0 50% 0); transform: translate(2px, 0); }
    40%      { clip-path: inset(60% 0 20% 0); transform: translate(-1px, 0); }
    60%      { clip-path: inset(80% 0 5% 0);  transform: translate(3px, 0); }
    80%      { clip-path: inset(10% 0 70% 0); transform: translate(-2px, 0); }
  }
  @keyframes glitch2 {
    0%,100% { clip-path: inset(50% 0 30% 0); transform: translate(2px, 0); color: var(--magenta); }
    25%      { clip-path: inset(20% 0 60% 0); transform: translate(-3px,0); }
    50%      { clip-path: inset(70% 0 10% 0); transform: translate(1px, 0); }
    75%      { clip-path: inset(5%  0 85% 0); transform: translate(-2px,0); color: var(--cyan); }
  }
  .glitch-wrap { position: relative; display: inline-block; }
  .glitch-wrap::before,
  .glitch-wrap::after {
    content: attr(data-text);
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    font: inherit; color: inherit;
  }
  .glitch-wrap::before { animation: glitch1 3.5s infinite; color: var(--cyan); }
  .glitch-wrap::after  { animation: glitch2 3.5s infinite .15s; color: var(--magenta); }

  /* Bioluminescent pulse */
  @keyframes bioPulse {
    0%,100% { opacity:.4; transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.08); }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(2deg); }
  }
  @keyframes floatY2 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-20px) rotate(-3deg); }
  }
  @keyframes ripple {
    0%   { transform: scale(0); opacity:.8; }
    100% { transform: scale(3); opacity:0; }
  }
  @keyframes ticker {
    from { transform: translateX(100%); }
    to   { transform: translateX(-100%); }
  }
  @keyframes depthScan {
    0%   { top: -4px; }
    100% { top: 100%; }
  }
  @keyframes fadeSlideUp {
    from { opacity:0; transform: translateY(30px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes hueShift {
    0%,100% { filter: hue-rotate(0deg); }
    50%      { filter: hue-rotate(40deg); }
  }
  @keyframes borderGlow {
    0%,100% { box-shadow: 0 0 8px var(--cyan-dim), inset 0 0 8px var(--cyan-glow); }
    50%      { box-shadow: 0 0 24px var(--cyan), inset 0 0 16px var(--cyan-dim); }
  }
  @keyframes particleDrift {
    0%   { transform: translate(0,0) scale(1); opacity:.6; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity:0; }
  }
  @keyframes waveDistort {
    0%,100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
    25%      { border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%; }
    50%      { border-radius: 55% 45% 60% 40% / 45% 55% 50% 50%; }
    75%      { border-radius: 40% 60% 45% 55% / 55% 45% 60% 40%; }
  }

  /* Holographic card */
  .holo-card {
    background: linear-gradient(160deg, rgba(0,30,70,.55) 0%, rgba(2,11,18,.92) 60%, rgba(0,80,180,.04) 100%);
    border: 1px solid rgba(0,255,231,.18);
    position: relative; overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
    box-shadow: inset 0 1px 0 rgba(0,255,231,.12), inset 0 0 30px rgba(0,20,60,.3);
  }
  .holo-card:hover {
    border-color: var(--cyan);
    box-shadow: 0 0 30px var(--cyan-dim), inset 0 0 20px var(--cyan-glow), inset 0 1px 0 rgba(0,255,231,.3);
  }
  .holo-card::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,255,231,.07), rgba(61,158,255,.05), transparent);
    transition: left .5s;
  }
  .holo-card:hover::before { left: 150%; }

  /* Glass water panel */
  .glass-water {
    background: linear-gradient(160deg, rgba(0,40,90,.6) 0%, rgba(0,15,40,.85) 100%);
    border: 1px solid rgba(0,180,255,.2);
    backdrop-filter: blur(24px);
    box-shadow: 0 8px 40px rgba(0,80,200,.12), inset 0 1px 0 rgba(0,255,231,.2), inset 0 0 40px rgba(0,20,80,.35);
    position: relative; overflow: hidden;
  }
  .glass-water::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,231,.5), rgba(61,158,255,.4), transparent);
  }
  .glass-water::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 35%);
    pointer-events: none;
  }

  /* Depth scan line */
  .depth-scan { position: relative; overflow: hidden; }
  .depth-scan::after {
    content: '';
    position: absolute; left: 0; width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    animation: depthScan 3s linear infinite;
    opacity: .5;
  }

  /* Ticker */
  .ticker-track { animation: ticker 22s linear infinite; white-space: nowrap; }

  /* Orbitron headings */
  .font-orbitron { font-family: 'Orbitron', monospace; }
  .font-mono     { font-family: 'Share Tech Mono', monospace; }

  /* Nav active indicator */
  .nav-link { position: relative; }
  .nav-link::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px; background: var(--cyan);
    transition: width .3s;
  }
  .nav-link:hover::after { width: 100%; }
`;

// ── Particle Field ──────────────────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur: Math.random() * 8 + 4,
    delay: Math.random() * 6,
    dx: (Math.random() - .5) * 200 + "px",
    dy: -(Math.random() * 200 + 50) + "px",
    color: Math.random() > .5 ? "#00ffe7" : Math.random() > .5 ? "#3d9eff" : "#005fff",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            "--dx": p.dx, "--dy": p.dy,
            animation: `particleDrift ${p.dur}s ${p.delay}s ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Bio Orb SVG creature ────────────────────────────────────────────────────
function BioOrb({ size = 180, color = "#00ffe7", accent = "#7bffb0", delay = "0s" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" style={{ animation: `floatY 6s ${delay} ease-in-out infinite, hueShift 8s ease-in-out infinite` }}>
      <defs>
        <radialGradient id={`rg-${delay}`} cx="40%" cy="35%">
          <stop offset="0%"   stopColor={accent} stopOpacity=".9" />
          <stop offset="60%"  stopColor={color}  stopOpacity=".5" />
          <stop offset="100%" stopColor="#020b12" stopOpacity=".95" />
        </radialGradient>
        <filter id={`glow-${delay}`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Body */}
      <ellipse cx="90" cy="90" rx="58" ry="65"
        fill={`url(#rg-${delay})`} stroke={color} strokeWidth="1"
        style={{ animation: "waveDistort 7s ease-in-out infinite" }}
      />
      {/* Cyber-rib lines */}
      {[0,1,2,3].map(i => (
        <ellipse key={i} cx="90" cy={75 + i*14} rx={30 - i*2} ry="4"
          fill="none" stroke={color} strokeWidth=".5" strokeOpacity=".5"
        />
      ))}
      {/* Eyes */}
      <circle cx="76" cy="78" r="7" fill="#020b12" stroke={color} strokeWidth="1" />
      <circle cx="104" cy="78" r="7" fill="#020b12" stroke={color} strokeWidth="1" />
      <circle cx="76" cy="78" r="3" fill={color} style={{ animation: `bioPulse 2s ease-in-out infinite` }} />
      <circle cx="104" cy="78" r="3" fill={color} style={{ animation: `bioPulse 2s .4s ease-in-out infinite` }} />
      {/* Fins */}
      <path d="M32,80 Q10,65 18,100 Q25,88 32,80Z" fill={color} fillOpacity=".3" stroke={color} strokeWidth=".8" />
      <path d="M148,80 Q170,65 162,100 Q155,88 148,80Z" fill={color} fillOpacity=".3" stroke={color} strokeWidth=".8" />
      {/* Tentacles */}
      {[0,1,2,3,4].map(i => (
        <path key={i}
          d={`M${70 + i*10},148 Q${65 + i*12},165 ${68 + i*8},178`}
          fill="none" stroke={color} strokeWidth="1.5" strokeOpacity=".6"
          style={{ animation: `floatY ${3 + i*.4}s ${i*.2}s ease-in-out infinite` }}
        />
      ))}
      {/* Circuit lines on body */}
      <path d="M90,60 L90,45 M82,60 L75,48 M98,60 L105,48"
        stroke={accent} strokeWidth=".8" strokeOpacity=".8" fill="none"
      />
      <circle cx="90" cy="44" r="3" fill={accent} style={{ animation: `bioPulse 1.5s ease-in-out infinite` }} />
    </svg>
  );
}

// ── Holographic Panel ───────────────────────────────────────────────────────
function HoloPanel({ children, className = "" }) {
  return (
    <div
      className={`holo-card glass-water depth-scan ${className}`}
      style={{ backdropFilter: "blur(18px)" }}
    >
      {/* Corner brackets */}
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
        <span key={i} className={`absolute ${pos} w-4 h-4 pointer-events-none`}
          style={{
            borderTop: i < 2 ? "1px solid var(--cyan)" : "none",
            borderBottom: i >= 2 ? "1px solid var(--cyan)" : "none",
            borderLeft: i % 2 === 0 ? "1px solid var(--cyan)" : "none",
            borderRight: i % 2 === 1 ? "1px solid var(--cyan)" : "none",
          }}
        />
      ))}
      {children}
    </div>
  );
}

// ── Stat Bar ────────────────────────────────────────────────────────────────
function StatBar({ label, value, color = "var(--cyan)" }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1" style={{ fontSize: 11 }}>
        <span className="font-mono" style={{ color: "var(--text-dim)" }}>{label}</span>
        <span className="font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full h-1 rounded-full" style={{ background: "rgba(0,255,231,.1)" }}>
        <div
          className="h-1 rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}`,
            transition: "width 1.5s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [activeSection, setActiveSection] = useState("HOME");
  const [ripples, setRipples] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const rippleId = useRef(0);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const move = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleClick = (e) => {
    const id = rippleId.current++;
    setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* Cursor */}
      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} />

      {/* Ripples */}
      {ripples.map(rp => (
        <div key={rp.id}
          style={{
            position: "fixed", left: rp.x, top: rp.y,
            width: 60, height: 60, borderRadius: "50%",
            border: "1px solid var(--cyan)", pointerEvents: "none", zIndex: 9998,
            transform: "translate(-50%,-50%)",
            animation: "ripple .7s ease-out forwards",
          }}
        />
      ))}

      <div className="scanlines min-h-screen" style={{ background: "var(--abyss)" }} onClick={handleClick}>
        <ParticleField />

        {/* ── Deep ocean gradient bg ── */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, #041e3a 0%, var(--abyss) 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
            background: "radial-gradient(ellipse 70% 50% at 30% 100%, #020d22 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: "20%", right: "10%", width: 400, height: 400,
            background: "radial-gradient(circle, rgba(0,255,231,.05) 0%, transparent 70%)",
            animation: "bioPulse 5s ease-in-out infinite",
          }} />
        </div>

        {/* ── Navbar ── */}
        <nav className="relative z-50 flex items-center justify-between px-10 py-5"
          style={{ borderBottom: "1px solid rgba(0,255,231,.12)", backdropFilter: "blur(16px)" }}>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, var(--cyan), var(--bio))",
              clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
              animation: "bioPulse 3s ease-in-out infinite",
            }} />
            <div>
              <div className="font-orbitron font-black text-sm tracking-widest" style={{ color: "var(--cyan)", letterSpacing: "0.3em" }}>
                PISCES
              </div>
              <div className="font-mono text-xs" style={{ color: "var(--text-dim)", letterSpacing: "0.15em" }}>
                DEEP_PROTOCOL_v2.8
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-8">
            {["HOME","EXPLORE","ENTITIES","NEXUS","DIVE"].map(link => (
              <button key={link}
                onClick={() => setActiveSection(link)}
                className="nav-link font-mono text-xs tracking-widest uppercase"
                style={{ color: activeSection === link ? "var(--cyan)" : "var(--text-dim)", background: "none", border: "none", cursor: "none" }}>
                {activeSection === link && <span style={{ color: "var(--cyan)", marginRight: 4 }}>//</span>}
                {link}
              </button>
            ))}
          </div>

          {/* Dive button */}
          <button className="font-orbitron font-bold text-xs tracking-widest px-6 py-2.5 relative overflow-hidden"
            style={{
              background: "transparent",
              border: "1px solid var(--cyan)",
              color: "var(--cyan)",
              clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
              animation: "borderGlow 2.5s ease-in-out infinite",
              cursor: "none",
              letterSpacing: "0.2em",
            }}>
            ▶ DIVE NOW
          </button>
        </nav>

        {/* ── TICKER ── */}
        <div className="relative z-40 overflow-hidden py-2" style={{ borderBottom: "1px solid rgba(0,255,231,.08)", background: "rgba(0,255,231,.03)" }}>
          <div className="ticker-track font-mono text-xs" style={{ color: "var(--text-dim)" }}>
            ◈ DEPTH: 3,400M &nbsp;◈ PRESSURE: 340 ATM &nbsp;◈ BIOLUMINESCENT INDEX: 98.7% &nbsp;◈ NEURAL-SEA SYNC: ACTIVE &nbsp;◈ ENTITIES DETECTED: 147 &nbsp;◈ ZONE: PISCES ABYSS SECTOR Ω &nbsp;◈ WARNING: ORGANIC-CYBER THRESHOLD EXCEEDED &nbsp;◈ SYSTEM INTEGRITY: 94.2% &nbsp;◈ TIDE ENCRYPTION: LOCKED &nbsp;◈ ∞ ◈
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="relative z-10 px-10 pt-16 pb-8 flex gap-12 items-start min-h-screen" style={{ animation: loaded ? "fadeSlideUp .8s ease-out both" : "none" }}>

          {/* LEFT: Main hero text */}
          <div className="flex-1 pt-8">

            {/* Classification badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5" style={{ border: "1px solid rgba(255,45,120,.4)", background: "rgba(255,45,120,.06)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--magenta)", animation: "bioPulse 1s ease-in-out infinite", display: "block" }} />
              <span className="font-mono text-xs tracking-widest" style={{ color: "var(--magenta)" }}>CLASSIFIED : DEPTH-SECTOR-Ω / PISCES PROTOCOL</span>
            </div>

            {/* Glitch headline */}
            <h1 className="font-orbitron font-black mb-4 leading-none"
              style={{ fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "0.05em" }}>
              <div className="glitch-wrap" data-text="SUBMERGED" style={{ color: "var(--cyan)", display: "block" }}>
                SUBMERGED
              </div>
              <div style={{ color: "var(--text-prime)", display: "block" }}>CITADEL</div>
              <div style={{ color: "var(--bio)", fontSize: "0.55em", letterSpacing: "0.35em", fontWeight: 400, fontFamily: "'Share Tech Mono'" }}>
                ▸ AQUA · CYBER · NEXUS
              </div>
            </h1>

            <p className="text-base mb-8 leading-relaxed max-w-lg"
              style={{ color: "var(--text-dim)", fontFamily: "'Rajdhani'", fontWeight: 300, fontSize: 17 }}>
              In the year 2187, ocean floors became the last frontier.
              Beneath 3,400 metres of crushing dark water lie the ruins of drowned megacities—now
              reborn as bio-mechanical fortresses pulsing with stolen current and alien intelligence.
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-4 mb-12">
              <button className="font-orbitron font-bold text-sm tracking-widest px-8 py-4 relative"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,231,.15), rgba(0,255,231,.05))",
                  border: "1px solid var(--cyan)",
                  color: "var(--cyan)",
                  clipPath: "polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%)",
                  boxShadow: "0 0 30px rgba(0,255,231,.2)",
                  cursor: "none",
                  letterSpacing: "0.2em",
                }}>
                ◈ ENTER ABYSS
              </button>
              <button className="font-mono text-xs tracking-widest px-6 py-4"
                style={{ background: "none", border: "1px solid rgba(255,209,102,.3)", color: "var(--gold)", cursor: "none" }}>
                ▷ WATCH TRAILER
              </button>
            </div>

            {/* Depth gauge / stats row */}
            <div className="flex gap-6">
              {[
                { label: "DEPTH", value: "3,400M", sub: "ABYSS ZONE" },
                { label: "SPECIES", value: "147+", sub: "BIO-CYBER" },
                { label: "CITIES", value: "23", sub: "SUBMERGED" },
                { label: "PLAYERS", value: "2.1M", sub: "ONLINE NOW" },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-orbitron font-black text-xl" style={{ color: "var(--cyan)" }}>{stat.value}</div>
                  <div className="font-mono text-xs" style={{ color: "var(--text-dim)", letterSpacing: "0.12em" }}>{stat.label}</div>
                  <div className="font-mono" style={{ fontSize: 9, color: "var(--magenta)", letterSpacing: "0.08em" }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Bio creatures showcase */}
          <div className="flex flex-col items-center gap-4 pt-4">
            {/* Main creature */}
            <HoloPanel className="p-6 relative" style={{ minWidth: 220 }}>
              <div className="font-mono text-xs mb-3 text-center" style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}>
                ENTITY_SCAN · TYPE-Ω3
              </div>
              <BioOrb size={200} color="#00ffe7" accent="#3d9eff" delay="0s" />
              <div className="mt-3 space-y-1 text-center">
                <div className="font-orbitron text-sm font-bold" style={{ color: "var(--text-prime)" }}>LEVIATHAN MK-VII</div>
                <div className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>Bio-Mechanical Apex Predator</div>
              </div>
              <div className="mt-3">
                <StatBar label="NEURAL SYNC" value={87} color="var(--cyan)" />
                <StatBar label="BIO-MASS" value={73} color="var(--bio)" />
                <StatBar label="CYBER-CORE" value={95} color="var(--magenta)" />
              </div>
            </HoloPanel>
          </div>

          {/* RIGHT: Side panels */}
          <div className="flex flex-col gap-4 pt-4 w-64">

            {/* Depth map panel */}
            <HoloPanel className="p-4">
              <div className="font-mono text-xs mb-3" style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}>
                ◈ DEPTH MAP
              </div>
              {/* Depth zones */}
              {[
                { zone: "SUNLIGHT", depth: "0–200M", color: "#ffd166", pct: 15 },
                { zone: "TWILIGHT", depth: "200–1,000M", color: "#00ffe7", pct: 35 },
                { zone: "MIDNIGHT", depth: "1–4,000M", color: "#7bffb0", pct: 65 },
                { zone: "ABYSSAL", depth: "4,000M+", color: "#ff2d78", pct: 92, active: true },
              ].map(z => (
                <div key={z.zone} className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: z.color, boxShadow: z.active ? `0 0 10px ${z.color}` : "none" }} />
                  <div className="flex-1">
                    <div className="font-mono text-xs leading-none" style={{ color: z.active ? z.color : "var(--text-dim)" }}>{z.zone}</div>
                    <div style={{ fontSize: 9, color: "var(--text-dim)", fontFamily: "Share Tech Mono" }}>{z.depth}</div>
                  </div>
                  {z.active && <span className="font-mono text-xs" style={{ color: z.color, fontSize: 9 }}>YOU</span>}
                </div>
              ))}
            </HoloPanel>

            {/* Secondary creature */}
            <HoloPanel className="p-4">
              <div className="font-mono text-xs mb-2" style={{ color: "var(--bio)", letterSpacing: "0.15em" }}>◈ NEARBY ENTITY</div>
              <div className="flex items-center gap-3">
                <BioOrb size={80} color="#3d9eff" accent="#00ffe7" delay="1.5s" />
                <div>
                  <div className="font-orbitron text-xs font-bold" style={{ color: "var(--bio)" }}>ABYSSAL WRAITH</div>
                  <div className="font-mono" style={{ fontSize: 9, color: "var(--text-dim)" }}>AI-DRIVEN</div>
                  <div className="mt-1.5">
                    <StatBar label="THREAT" value={62} color="var(--bio)" />
                  </div>
                </div>
              </div>
            </HoloPanel>

            {/* Signal panel */}
            <HoloPanel className="p-4">
              <div className="font-mono text-xs mb-3" style={{ color: "var(--magenta)", letterSpacing: "0.15em" }}>◈ BIO-SIGNAL FEED</div>
              {["HYDROKINETIC ANOMALY DETECTED", "NEURAL NET BREACH: SECTOR 7", "BIOLUMINESCENT SURGE +340%", "ENTITY MIGRATION: HEADING DEEP"].map((msg, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span style={{ color: "var(--magenta)", fontSize: 8, marginTop: 3, flexShrink: 0 }}>▸</span>
                  <span className="font-mono leading-tight" style={{ fontSize: 9, color: i === 1 ? "var(--magenta)" : "var(--text-dim)" }}>{msg}</span>
                </div>
              ))}
            </HoloPanel>
          </div>
        </section>

        {/* ── ENTITIES GRID ── */}
        <section className="relative z-10 px-10 py-16">
          <div className="flex items-center gap-6 mb-10">
            <div className="font-orbitron font-black text-3xl" style={{ color: "var(--text-prime)", letterSpacing: "0.1em" }}>
              BIO<span style={{ color: "var(--cyan)" }}>-MECH</span> ENTITIES
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--cyan), transparent)" }} />
            <div className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>147 CATALOGUED · 23 HOSTILE</div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { name: "LEVIATHAN MK-VII", type: "Apex Predator", threat: 95, color: "#00ffe7", tag: "HOSTILE" },
              { name: "CHORUS WRAITH", type: "Hive Mind Node", threat: 72, color: "#3d9eff", tag: "NEUTRAL" },
              { name: "IRON NAUTILUS", type: "Armored Scavenger", threat: 58, color: "#ffd166", tag: "PASSIVE" },
              { name: "VOID ANGLER", type: "Deep Web Hunter", threat: 88, color: "#ff2d78", tag: "HOSTILE" },
            ].map((entity, i) => (
              <HoloPanel key={entity.name} className="p-5 cursor-pointer"
                style={{ animation: `fadeSlideUp .6s ${i * .1 + .2}s ease-out both` }}>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs px-2 py-0.5"
                    style={{ background: `${entity.color}20`, border: `1px solid ${entity.color}60`, color: entity.color, fontSize: 9 }}>
                    {entity.tag}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "var(--text-dim)", fontSize: 9 }}>ID_{String(i+1).padStart(3,"0")}</span>
                </div>
                <div className="flex justify-center mb-4">
                  <BioOrb size={110} color={entity.color} accent={i % 2 === 0 ? "#3d9eff" : "#00ffe7"} delay={`${i * .7}s`} />
                </div>
                <div className="font-orbitron font-bold text-sm mb-1" style={{ color: entity.color, letterSpacing: "0.08em" }}>{entity.name}</div>
                <div className="font-mono text-xs mb-3" style={{ color: "var(--text-dim)" }}>{entity.type}</div>
                <StatBar label="THREAT LEVEL" value={entity.threat} color={entity.color} />
              </HoloPanel>
            ))}
          </div>
        </section>

        {/* ── DUALITY STRIP ── */}
        <section className="relative z-10 px-10 py-16 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: "linear-gradient(90deg, rgba(0,255,231,.04) 0%, transparent 50%, rgba(255,45,120,.04) 100%)",
            borderTop: "1px solid rgba(0,255,231,.1)",
            borderBottom: "1px solid rgba(255,45,120,.1)",
          }} />
          <div className="relative flex items-center gap-16">
            {/* Organic side */}
            <div className="flex-1">
              <div className="font-orbitron font-black text-4xl mb-3" style={{ color: "var(--bio)", letterSpacing: "0.08em" }}>ORGANIC</div>
              <div className="font-mono text-sm mb-4" style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>
                Ancient creatures evolved over millennia, carrying the memory of a world before the flood.
                Bioluminescent, fluid, alive — pulsing with instinct and deep-time intelligence.
              </div>
              <div className="flex gap-3">
                {["#00ffe7","#3d9eff","#005fff"].map(c => (
                  <div key={c} style={{ width: 40, height: 40, borderRadius: "50%", background: c, opacity: .7, animation: "bioPulse 3s ease-in-out infinite", boxShadow: `0 0 20px ${c}` }} />
                ))}
              </div>
            </div>

            {/* VS divider */}
            <div className="flex flex-col items-center">
              <div className="w-px h-24" style={{ background: "linear-gradient(to bottom, var(--bio), var(--magenta))" }} />
              <div className="font-orbitron font-black text-2xl my-3"
                style={{ color: "var(--text-prime)", textShadow: "0 0 20px rgba(255,255,255,.3)" }}>VS</div>
              <div className="w-px h-24" style={{ background: "linear-gradient(to bottom, var(--magenta), var(--bio))" }} />
            </div>

            {/* Cyber side */}
            <div className="flex-1 text-right">
              <div className="font-orbitron font-black text-4xl mb-3" style={{ color: "var(--magenta)", letterSpacing: "0.08em" }}>CYBER</div>
              <div className="font-mono text-sm mb-4" style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>
                Engineered constructs born from the wreckage of drowned cities. Cold, precise, networked —
                driven by distributed AI, harvesting neural current from the deep.
              </div>
              <div className="flex gap-3 justify-end">
                {["#ff2d78","#ff6eb0","#ff0055"].map(c => (
                  <div key={c} style={{ width: 40, height: 40, borderRadius: 4, background: c, opacity: .7, animation: "bioPulse 2.5s ease-in-out infinite", boxShadow: `0 0 20px ${c}`, transform: "rotate(45deg)" }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WORLD SECTORS ── */}
        <section className="relative z-10 px-10 py-16">
          <div className="flex items-center gap-6 mb-10">
            <div className="font-orbitron font-black text-3xl" style={{ color: "var(--text-prime)", letterSpacing: "0.1em" }}>
              OCEAN <span style={{ color: "var(--cyan)" }}>SECTORS</span>
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--cyan), transparent)" }} />
            <div className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>7 OCEANS · 23 ACTIVE ZONES</div>
          </div>

          {/* ── Glass world map ── */}
          <div className="relative mb-8 rounded-sm overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(0,30,60,.85) 0%, rgba(2,11,18,.95) 100%)",
              border: "1px solid rgba(0,255,231,.18)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 60px rgba(0,100,255,.15), inset 0 1px 0 rgba(0,255,231,.15), inset 0 0 40px rgba(0,30,80,.5)",
            }}>
            {/* Water shimmer top */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, rgba(0,255,231,.6), rgba(61,158,255,.4), transparent)",
              animation: "borderGlow 3s ease-in-out infinite",
            }} />
            {/* Glass water layer */}
            <div style={{
              position: "absolute", inset: 0,
              background: "repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(0,255,231,.015) 38px, rgba(0,255,231,.015) 40px)",
              pointerEvents: "none",
            }} />

            <div className="relative p-6">
              <div className="font-mono text-xs mb-4 flex items-center gap-3" style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}>
                ◈ GLOBAL SECTOR MAP
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", display: "inline-block", animation: "bioPulse 1.5s ease-in-out infinite" }} />
                <span style={{ color: "var(--text-dim)" }}>REAL-TIME · DEPTH-ADJUSTED</span>
              </div>

              {/* SVG World Map with ocean sector markers */}
              <svg viewBox="0 0 900 380" style={{ width: "100%", height: "auto" }}>
                {/* Ocean backdrop gradient */}
                <defs>
                  <radialGradient id="oceanBg" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#041828" />
                    <stop offset="100%" stopColor="#020b12" />
                  </radialGradient>
                  <filter id="mapGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="dotGlow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="900" height="380" fill="url(#oceanBg)" />

                {/* Grid lines */}
                {[0,1,2,3,4,5,6].map(i => (
                  <line key={`h${i}`} x1="0" y1={i*63} x2="900" y2={i*63} stroke="rgba(0,255,231,.06)" strokeWidth="1" />
                ))}
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                  <line key={`v${i}`} x1={i*82} y1="0" x2={i*82} y2="380" stroke="rgba(0,255,231,.06)" strokeWidth="1" />
                ))}

                {/* Continents — simplified silhouettes */}
                {/* North America */}
                <path d="M120,60 L180,55 L210,80 L220,130 L200,160 L170,175 L145,165 L130,140 L115,110 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* South America */}
                <path d="M175,185 L210,180 L225,210 L220,270 L195,300 L170,280 L160,240 L162,200 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* Europe */}
                <path d="M390,55 L430,50 L450,70 L440,95 L410,100 L390,85 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* Africa */}
                <path d="M400,115 L445,110 L460,145 L455,210 L430,250 L405,240 L390,200 L385,155 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* Asia */}
                <path d="M455,50 L580,45 L620,75 L610,120 L570,135 L510,130 L470,110 L450,80 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* South Asia / India */}
                <path d="M530,130 L560,125 L565,170 L545,185 L520,165 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* SE Asia / Indonesia */}
                <path d="M600,150 L640,145 L660,160 L650,175 L620,170 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* Australia */}
                <path d="M640,230 L700,220 L720,255 L710,295 L670,305 L640,280 L630,255 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* Japan */}
                <path d="M675,80 L690,75 L695,95 L680,100 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.25)" strokeWidth="1" />
                {/* Greenland */}
                <path d="M240,20 L280,18 L290,45 L265,55 L240,40 Z"
                  fill="rgba(0,40,70,.8)" stroke="rgba(0,255,231,.2)" strokeWidth="1" />
                {/* Antarctica */}
                <path d="M200,355 L700,358 L720,375 L180,375 Z"
                  fill="rgba(0,40,70,.6)" stroke="rgba(0,255,231,.15)" strokeWidth="1" />

                {/* ── SECTOR PING MARKERS ── */}
                {[
                  { id:"S01", name:"RED SEA",        x:470, y:145, status:"CONTESTED",  color:"#ff2d78", depth:"2,211M" },
                  { id:"S02", name:"PACIFIC ABYSS",  x:740, y:200, status:"RESTRICTED", color:"#ff2d78", depth:"10,935M" },
                  { id:"S03", name:"ARCTIC BREACH",  x:460, y:28,  status:"RESTRICTED", color:"#3d9eff", depth:"5,450M" },
                  { id:"S04", name:"MARIANA TRENCH", x:720, y:150, status:"RESTRICTED", color:"#ff2d78", depth:"10,994M" },
                  { id:"S05", name:"CORAL SEA",      x:710, y:260, status:"ACCESSIBLE", color:"#00ffe7", depth:"2,394M" },
                  { id:"S06", name:"DEAD SEA",       x:465, y:122, status:"ACCESSIBLE", color:"#00ffe7", depth:"306M" },
                  { id:"S07", name:"CASPIAN SEA",    x:495, y:90,  status:"NEUTRAL",    color:"#ffd166", depth:"1,025M" },
                  { id:"S08", name:"NORTH ATLANTIC", x:300, y:130, status:"ACCESSIBLE", color:"#00ffe7", depth:"8,376M" },
                  { id:"S09", name:"INDIAN OCEAN",   x:560, y:240, status:"CONTESTED",  color:"#ffd166", depth:"7,906M" },
                  { id:"S10", name:"MEDITERRANEAN",  x:430, y:105, status:"NEUTRAL",    color:"#ffd166", depth:"5,267M" },
                ].map(m => (
                  <g key={m.id} filter="url(#dotGlow)">
                    {/* Ping ring */}
                    <circle cx={m.x} cy={m.y} r="16" fill="none" stroke={m.color} strokeWidth=".5" strokeOpacity=".3"
                      style={{ animation: `ripple 2.5s ease-out infinite` }} />
                    <circle cx={m.x} cy={m.y} r="10" fill="none" stroke={m.color} strokeWidth=".8" strokeOpacity=".5"
                      style={{ animation: `ripple 2.5s .8s ease-out infinite` }} />
                    {/* Center dot */}
                    <circle cx={m.x} cy={m.y} r="4" fill={m.color} strokeWidth="1" stroke={m.color}
                      style={{ animation: `bioPulse 2s ease-in-out infinite` }} />
                    {/* Label */}
                    <text x={m.x + 8} y={m.y - 7} fontSize="7" fill={m.color} fontFamily="Share Tech Mono" letterSpacing="0.05em">{m.id} · {m.name}</text>
                    <text x={m.x + 8} y={m.y + 4}  fontSize="6" fill="rgba(180,220,240,.4)" fontFamily="Share Tech Mono">{m.depth}</text>
                  </g>
                ))}

                {/* Sonar sweep */}
                <circle cx="450" cy="190" r="120" fill="none" stroke="rgba(0,255,231,.06)" strokeWidth="1"
                  style={{ transformOrigin: "450px 190px", animation: "ripple 4s linear infinite" }} />
                <circle cx="450" cy="190" r="80" fill="none" stroke="rgba(0,255,231,.04)" strokeWidth="1"
                  style={{ transformOrigin: "450px 190px", animation: "ripple 4s .8s linear infinite" }} />
              </svg>

              {/* Legend row */}
              <div className="flex items-center gap-8 mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,255,231,.08)" }}>
                {[
                  { label: "ACCESSIBLE", color: "#00ffe7" },
                  { label: "CONTESTED",  color: "#ffd166" },
                  { label: "RESTRICTED", color: "#ff2d78" },
                  { label: "NEUTRAL",    color: "#3d9eff" },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                    <span className="font-mono" style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.12em" }}>{l.label}</span>
                  </div>
                ))}
                <div className="ml-auto font-mono" style={{ fontSize: 9, color: "var(--text-dim)" }}>
                  LAST SYNC · 00:00:04 AGO · DEPTH PROTOCOL ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* ── Sea detail cards ── */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { id:"S01", name:"RED SEA",        region:"Middle East",    depth:"2,211M",  status:"CONTESTED",  color:"#ff2d78", temp:"-2°C", entities: 34 },
              { id:"S06", name:"DEAD SEA",        region:"Levant",        depth:"306M",    status:"ACCESSIBLE", color:"#00ffe7", temp:"4°C",  entities: 8  },
              { id:"S04", name:"MARIANA TRENCH",  region:"Pacific",       depth:"10,994M", status:"RESTRICTED", color:"#ff2d78", temp:"-4°C", entities: 61 },
              { id:"S07", name:"CASPIAN SEA",     region:"Central Asia",  depth:"1,025M",  status:"NEUTRAL",    color:"#3d9eff", temp:"2°C",  entities: 19 },
              { id:"S10", name:"MEDITERRANEAN",   region:"Southern EU",   depth:"5,267M",  status:"NEUTRAL",    color:"#ffd166", temp:"1°C",  entities: 27 },
            ].map((s, i) => (
              <div key={s.id}
                className="relative overflow-hidden rounded-sm"
                style={{
                  background: `linear-gradient(160deg, rgba(0,20,50,.7) 0%, rgba(2,11,18,.95) 100%)`,
                  border: `1px solid ${s.color}35`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 4px 30px ${s.color}12, inset 0 1px 0 ${s.color}20, inset 0 0 20px rgba(0,20,60,.4)`,
                  animation: `fadeSlideUp .6s ${i*.1+.1}s ease-out both`,
                  padding: "14px",
                }}>
                {/* Glass water shimmer */}
                <div style={{
                  position:"absolute", top:0, left:0, right:0, height:1,
                  background:`linear-gradient(90deg, transparent, ${s.color}80, transparent)`,
                }} />
                {/* Frosted glass layer */}
                <div style={{
                  position:"absolute", inset:0,
                  background:"linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 40%)",
                  pointerEvents:"none",
                }} />
                <div className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono" style={{ fontSize: 8, color: s.color, letterSpacing:"0.15em" }}>{s.id}</span>
                    <span className="font-mono px-1.5 py-0.5" style={{
                      fontSize: 7, background:`${s.color}15`,
                      border:`1px solid ${s.color}40`, color: s.color,
                    }}>{s.status}</span>
                  </div>
                  <div className="font-orbitron font-black mb-0.5" style={{ fontSize: 11, color: s.color, letterSpacing:"0.06em" }}>{s.name}</div>
                  <div className="font-mono mb-3" style={{ fontSize: 8, color:"var(--text-dim)" }}>{s.region}</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {[
                      { k:"DEPTH", v: s.depth },
                      { k:"TEMP",  v: s.temp  },
                      { k:"ENTITIES", v: s.entities },
                      { k:"STATUS", v:"ONLINE" },
                    ].map(kv => (
                      <div key={kv.k}>
                        <div style={{ fontSize:7, color:"var(--text-dim)", fontFamily:"Share Tech Mono", letterSpacing:"0.1em" }}>{kv.k}</div>
                        <div style={{ fontSize:9, color: kv.k==="STATUS" ? "#00ffe7" : "var(--text-prime)", fontFamily:"Share Tech Mono" }}>{kv.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2" style={{ borderTop:`1px solid ${s.color}20` }}>
                    <button className="font-mono w-full text-center"
                      style={{ fontSize:8, color:s.color, background:"none", border:"none", cursor:"none", letterSpacing:"0.12em" }}>
                      ▸ INITIATE DIVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 px-10 py-8" style={{ borderTop: "1px solid rgba(0,255,231,.1)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-orbitron font-black text-sm" style={{ color: "var(--cyan)", letterSpacing: "0.3em" }}>PISCES // DEEP PROTOCOL</div>
              <div className="font-mono text-xs mt-1" style={{ color: "var(--text-dim)" }}>© 2187 ABYSSAL SYSTEMS CORP · ALL DEPTHS RESERVED</div>
            </div>
            <div className="flex items-center gap-4">
              {["DISCORD","X","YOUTUBE","TWITCH"].map(s => (
                <button key={s} className="font-mono text-xs" style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "none", letterSpacing: "0.1em" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}