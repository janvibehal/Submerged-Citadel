import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --pink: #00f5ff;
      --cyan: #0ff;
      --purple: #0a3aff;
      --magenta: #7b2fff;
      --dark: #010a14;
      --card-bg: rgba(0, 15, 40, 0.75);
      --bio: #39ff7e;
      --deep: #001a2e;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--dark);
      color: white;
      font-family: 'Rajdhani', sans-serif;
      overflow-x: hidden;
      cursor: crosshair;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--dark); }
    ::-webkit-scrollbar-thumb { background: var(--pink); }

    .scrollbar-thin { scrollbar-width: thin; scrollbar-color: var(--pink) var(--dark); }

    @keyframes flicker {
      0%, 100% { opacity: 1; }
      92% { opacity: 1; }
      93% { opacity: 0.4; }
      94% { opacity: 1; }
      96% { opacity: 0.6; }
      97% { opacity: 1; }
    }

    @keyframes scanMove {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @keyframes pulseCyan {
      0%, 100% { box-shadow: 0 0 10px #00f5ff, 0 0 30px #00f5ff; }
      50% { box-shadow: 0 0 20px #00f5ff, 0 0 60px #00f5ff, 0 0 80px #0a3aff; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    @keyframes borderGlow {
      0%, 100% { border-color: #00f5ff; box-shadow: 0 0 10px #00f5ff; }
      50% { border-color: #39ff7e; box-shadow: 0 0 20px #39ff7e; }
    }

    @keyframes bubbleRise {
      0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.2; }
      100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
    }

    @keyframes bioGlow {
      0%, 100% { opacity: 0.4; filter: blur(8px); }
      50% { opacity: 1; filter: blur(4px); }
    }

    @keyframes waveDistort {
      0%, 100% { transform: skewX(0deg) translateX(0); }
      25% { transform: skewX(0.5deg) translateX(2px); }
      75% { transform: skewX(-0.5deg) translateX(-2px); }
    }

    @keyframes depthPulse {
      0%, 100% { text-shadow: 0 0 10px #00f5ff, 0 0 30px #00f5ff; }
      50% { text-shadow: 0 0 20px #0ff, 0 0 50px #0ff, 0 0 80px #0a3aff; }
    }

    .flicker { animation: flicker 4s infinite; }
    .float { animation: float 4s ease-in-out infinite; }
    .border-glow { animation: borderGlow 3s ease-in-out infinite; }
    .pulse-cyan { animation: pulseCyan 2s ease-in-out infinite; }
    .wave-distort { animation: waveDistort 6s ease-in-out infinite; }
    .depth-pulse { animation: depthPulse 3s ease-in-out infinite; }

    .neon-text-cyan {
      color: #00f5ff;
      text-shadow: 0 0 10px #00f5ff, 0 0 30px #00f5ff, 0 0 60px #0a3aff;
    }

    .neon-text-bio {
      color: #39ff7e;
      text-shadow: 0 0 10px #39ff7e, 0 0 30px #39ff7e;
    }

    .glass-card {
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 245, 255, 0.25);
    }

    .vertical-text {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
    }

    .grid-bg {
      background-image:
        linear-gradient(rgba(0, 245, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 245, 255, 0.04) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .clip-corner {
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }

    .tour-card:hover .tour-overlay { opacity: 1; }
    .tour-overlay { opacity: 0; transition: opacity 0.3s ease; }

    .skill-tag {
      border: 1px solid rgba(0,245,255,0.2);
      color: rgba(255,255,255,0.5);
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      padding: 6px 12px;
      cursor: default;
      transition: all 0.2s ease;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    }

    .skill-tag:hover {
      border-color: #00f5ff;
      color: #00f5ff;
      box-shadow: 0 0 10px #00f5ff;
    }

    .bubble {
      position: fixed;
      border-radius: 50%;
      border: 1px solid rgba(0,245,255,0.3);
      pointer-events: none;
      animation: bubbleRise linear infinite;
    }

    .bio-orb {
      position: absolute;
      border-radius: 50%;
      animation: bioGlow 3s ease-in-out infinite;
      pointer-events: none;
    }

    .holo-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, #00f5ff, #39ff7e, transparent);
      animation: waveDistort 4s ease-in-out infinite;
    }

    .depth-meter {
      position: fixed;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 40;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
  `}</style>
);

function Bubbles() {
  const bubbles = [
    { id: 0, left: 5, size: 10, duration: 14, delay: 0 },
    { id: 1, left: 15, size: 7, duration: 10, delay: 2 },
    { id: 2, left: 25, size: 14, duration: 18, delay: 5 },
    { id: 3, left: 38, size: 6, duration: 9, delay: 1 },
    { id: 4, left: 50, size: 12, duration: 15, delay: 7 },
    { id: 5, left: 62, size: 8, duration: 11, delay: 3 },
    { id: 6, left: 72, size: 16, duration: 20, delay: 8 },
    { id: 7, left: 83, size: 9, duration: 13, delay: 4 },
    { id: 8, left: 90, size: 11, duration: 16, delay: 6 },
    { id: 9, left: 45, size: 7, duration: 12, delay: 9 },
  ];
  return (
    <>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            left: b.left + "%",
            width: b.size + "px",
            height: b.size + "px",
            animationDuration: b.duration + "s",
            animationDelay: b.delay + "s",
            bottom: "-50px",
          }}
        />
      ))}
    </>
  );
}

function Scanlines() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden opacity-20">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.9), transparent)",
            animation: "scanMove 8s linear infinite",
          }}
        />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,245,255,0.5) 8px, rgba(0,245,255,0.5) 9px)",
        }}
      />
    </>
  );
}

function DotNav({ sections, active, onNav }) {
  return (
    <div className="depth-meter">
      <span
        className="vertical-text mb-2"
        style={{
          color: "rgba(0,245,255,0.4)",
          fontFamily: "'Share Tech Mono'",
          fontSize: "9px",
          letterSpacing: "0.3em",
        }}
      >
        DEPTH
      </span>
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onNav(s.id)}
          className="group relative flex items-center justify-center"
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: active === s.id ? "12px" : "8px",
              height: active === s.id ? "12px" : "8px",
              background: active === s.id ? "#00f5ff" : "#1a3a4a",
              boxShadow: active === s.id ? "0 0 10px #00f5ff, 0 0 30px #00f5ff" : "none",
              animation: active === s.id ? "pulseCyan 2s ease-in-out infinite" : "none",
            }}
          />
          <span
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            style={{ right: "20px", fontFamily: "'Share Tech Mono'", color: "#00f5ff", fontSize: "10px" }}
          >
            {s.label}
          </span>
        </button>
      ))}
      <span
        style={{
          fontFamily: "'Share Tech Mono'",
          fontSize: "9px",
          color: "rgba(0,245,255,0.3)",
          letterSpacing: "0.1em",
        }}
      >
        {sections.findIndex((s) => s.id === active) * 200 + 200}M
      </span>
    </div>
  );
}

function Navbar({ onNav }) {
  const links = [
    { label: "surface", target: "home" },
    { label: "entities", target: "work" },
    { label: "interface", target: "ai" },
    { label: "lore", target: "about" },
  ];
  const [activeLink, setActiveLink] = useState("surface");

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-12 py-5"
      style={{ background: "linear-gradient(180deg, rgba(1,10,20,0.95) 0%, transparent 100%)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-2xl font-black uppercase depth-pulse"
          style={{ fontFamily: "'Bebas Neue'", color: "#00f5ff", letterSpacing: "0.1em" }}
        >
          ABYSSAL PROTOCOL
        </span>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: "'Share Tech Mono'", color: "rgba(0,245,255,0.35)" }}
        >
          // ♓
        </span>
      </div>
      <div className="flex gap-10">
        {links.map((l) => (
          <button
            key={l.label}
            onClick={() => {
              setActiveLink(l.label);
              onNav(l.target);
            }}
            className="text-sm uppercase tracking-widest transition-all duration-200 relative"
            style={{
              fontFamily: "'Share Tech Mono'",
              color: activeLink === l.label ? "white" : "rgba(255,255,255,0.35)",
            }}
          >
            {l.label}
            {activeLink === l.label && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-px"
                style={{ background: "#00f5ff", boxShadow: "0 0 8px #00f5ff" }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

function AITerminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    { role: "sys", text: "ABYSSAL_OS v3.1.2 — DIVE SEQUENCE INITIALIZED" },
    { role: "sys", text: "Neural-oceanic link established. Depth: 2400M." },
    { role: "sys", text: "Speak to the deep. It answers." },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLines((l) => [...l, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are LEVIATHAN, an ancient bio-mechanical AI living in a submerged cyberpunk city at the bottom of the ocean. You are part organic sea creature, part machine. You speak in poetic, ominous, beautiful short sentences. Reference the deep sea, bioluminescence, pressure, darkness, Pisces, water, and cyberpunk technology. Keep replies under 80 words. Never use emojis.",
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply =
        data.content?.find((b) => b.type === "text")?.text ||
        "...signal lost in the deep.";
      setLines((l) => [...l, { role: "ai", text: reply }]);
    } catch {
      setLines((l) => [
        ...l,
        { role: "ai", text: "SIGNAL LOST. Pressure too great." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="glass-card border-glow w-full max-w-2xl mx-auto p-5"
      style={{ fontFamily: "'Share Tech Mono'", fontSize: "13px" }}
    >
      <div
        className="flex items-center gap-2 mb-4 pb-3"
        style={{ borderBottom: "1px solid rgba(0,245,255,0.15)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#39ff7e", boxShadow: "0 0 6px #39ff7e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#0a3aff", boxShadow: "0 0 6px #0a3aff" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }} />
        <span className="ml-3 neon-text-cyan text-xs tracking-widest">
          LEVIATHAN :: DEEP INTERFACE
        </span>
        <span className="ml-auto text-xs" style={{ color: "rgba(57,255,126,0.5)" }}>
          DEPTH: 2400M
        </span>
      </div>

      <div className="h-52 overflow-y-auto space-y-2 mb-4 pr-1 scrollbar-thin">
        {lines.map((l, i) => (
          <div
            key={i}
            className="leading-relaxed"
            style={{
              color:
                l.role === "sys"
                  ? "rgba(57,255,126,0.5)"
                  : l.role === "user"
                  ? "#00f5ff"
                  : "rgba(255,255,255,0.85)",
            }}
          >
            <span
              className="mr-2"
              style={{
                color:
                  l.role === "sys"
                    ? "rgba(57,255,126,0.3)"
                    : l.role === "user"
                    ? "rgba(0,245,255,0.6)"
                    : "#39ff7e",
              }}
            >
              {l.role === "sys" ? "//DEEP" : l.role === "user" ? "> DIVER" : "LEVIATHAN"}
            </span>
            {l.text}
          </div>
        ))}
        {loading && (
          <div style={{ color: "#39ff7e" }} className="animate-pulse">
            LEVIATHAN <span style={{ color: "#00f5ff" }}>surfacing_</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className="flex items-center gap-3 pt-3"
        style={{ borderTop: "1px solid rgba(0,245,255,0.15)" }}
      >
        <span style={{ color: "#00f5ff" }}>~</span>
        <input
          className="flex-1 bg-transparent outline-none"
          style={{ color: "#00f5ff", caretColor: "#39ff7e" }}
          placeholder="transmit to the deep..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="clip-corner px-4 py-1.5 text-xs uppercase tracking-widest transition-all hover:opacity-80"
          style={{
            background: "#00f5ff",
            color: "black",
            fontWeight: 700,
            fontFamily: "'Share Tech Mono'",
          }}
        >
          DIVE
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden grid-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 120%, rgba(10,58,255,0.25) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #0a3aff 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />
        <div className="bio-orb w-4 h-4" style={{ background: "#39ff7e", top: "20%", left: "15%", boxShadow: "0 0 20px #39ff7e", animationDelay: "0s" }} />
        <div className="bio-orb w-3 h-3" style={{ background: "#00f5ff", top: "60%", left: "70%", boxShadow: "0 0 15px #00f5ff", animationDelay: "1s" }} />
        <div className="bio-orb w-5 h-5" style={{ background: "#7b2fff", top: "40%", right: "20%", boxShadow: "0 0 25px #7b2fff", animationDelay: "2s" }} />
        <div className="bio-orb w-2 h-2" style={{ background: "#39ff7e", bottom: "30%", left: "40%", boxShadow: "0 0 12px #39ff7e", animationDelay: "0.5s" }} />
      </div>

      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 select-none">
        <h2
          className="vertical-text text-5xl font-black uppercase flicker"
          style={{
            fontFamily: "'Bebas Neue'",
            color: "transparent",
            WebkitTextStroke: "1px rgba(0,245,255,0.35)",
            letterSpacing: "0.15em",
          }}
        >
          ABYSSAL PROTOCOL
        </h2>
      </div>

      <div className="relative z-10 flex flex-col justify-center px-24 max-w-4xl pt-20">
        <p
          className="text-xs tracking-widest uppercase mb-4 flicker"
          style={{ fontFamily: "'Share Tech Mono'", color: "#39ff7e" }}
        >
          ♓ PISCES SECTOR // DEPTH: 2400M
        </p>
        <h1
          className="text-7xl md:text-8xl font-black uppercase leading-none mb-6"
          style={{ fontFamily: "'Bebas Neue'", letterSpacing: "0.02em" }}
        >
          <span className="neon-text-bio">ABYSSAL</span>
          <br />
          <span style={{ color: "white", textShadow: "0 0 40px rgba(0,245,255,0.3)" }}>
            PROTOCOL
          </span>
          <br />
          <span className="neon-text-cyan wave-distort inline-block">ONLINE</span>
        </h1>
        <p
          className="text-sm leading-relaxed mb-8 max-w-lg"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Rajdhani'",
            fontWeight: 300,
            fontSize: "15px",
            lineHeight: "1.9",
          }}
        >
          Descend into the neon-lit ruins of AQUA-7 — a submerged megacity where
          bio-mechanical sea creatures patrol flooded corridors and ancient Pisces
          constellations pulse through bioluminescent neural networks.
          Organic meets circuit. Darkness meets light.
        </p>

        <div className="flex gap-6 mb-8">
          {[["DEPTH", "2400M"], ["ENTITIES", "347"], ["SECTOR", "♓-IX"]].map(([k, v]) => (
            <div
              key={k}
              className="glass-card clip-corner px-3 py-2"
              style={{ border: "1px solid rgba(0,245,255,0.2)" }}
            >
              <div className="text-xs" style={{ fontFamily: "'Share Tech Mono'", color: "rgba(0,245,255,0.4)" }}>{k}</div>
              <div className="text-lg font-black" style={{ fontFamily: "'Bebas Neue'", color: "#00f5ff" }}>{v}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="clip-corner px-8 py-3 text-sm uppercase tracking-widest font-bold transition-all hover:opacity-80"
            style={{
              background: "#00f5ff",
              color: "black",
              fontFamily: "'Share Tech Mono'",
              boxShadow: "0 0 20px #00f5ff",
            }}
          >
            DIVE IN &rsaquo;
          </button>
          <button
            onClick={() => document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" })}
            className="clip-corner px-8 py-3 text-sm uppercase tracking-widest transition-all hover:opacity-80"
            style={{
              border: "1px solid #39ff7e",
              color: "#39ff7e",
              fontFamily: "'Share Tech Mono'",
            }}
          >
            NEURAL LINK
          </button>
        </div>
      </div>

      <div
        className="absolute top-24 right-16 text-right z-10"
        style={{ fontFamily: "'Share Tech Mono'", fontSize: "10px", color: "rgba(0,245,255,0.35)" }}
      >
        <div>O2 RESERVE: 94%</div>
        <div>PRESSURE: 240 ATM</div>
        <div className="animate-pulse" style={{ color: "#39ff7e" }}>
          &#9654; BIO-LINK ACTIVE
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="holo-line opacity-40" />
      </div>
    </section>
  );
}

function Work() {
  const entities = [
    {
      num: "01",
      title: "HYDRA-7X",
      sub: "Bio-Mechanical Entity",
      desc: "Seven-headed deep sea construct. Each head runs an independent AI core fused with organic neural tissue harvested from ancient leviathans. Neon-tipped tendrils emit sonar pulses.",
      color: "#00f5ff",
      stat: "THREAT: APEX",
    },
    {
      num: "02",
      title: "PISCES NODE",
      sub: "AI Ocean Life",
      desc: "Twin koi constructs orbiting each other in eternal duality. One runs organic bio-code, one runs hard silicon. Together they navigate the flooded megacity ruins as living compasses.",
      color: "#39ff7e",
      stat: "CLASS: GUIDE",
    },
    {
      num: "03",
      title: "ABYSSAL REEF",
      sub: "Submerged City Zone",
      desc: "The drowned financial district of AQUA-7. Coral has grown through server towers. Jellyfish cluster around glowing data-nodes. The architecture breathes.",
      color: "#7b2fff",
      stat: "DEPTH: 2400M",
    },
  ];

  return (
    <section id="work" className="min-h-screen px-16 py-28 relative grid-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0a3aff 0%, transparent 70%)" }}
        />
        <div
          className="bio-orb w-6 h-6"
          style={{ background: "#39ff7e", top: "10%", right: "15%", boxShadow: "0 0 25px #39ff7e", animationDelay: "1.5s" }}
        />
      </div>

      <div className="flex items-end gap-4 mb-6">
        <h2
          className="text-7xl font-black uppercase"
          style={{ fontFamily: "'Bebas Neue'", color: "white", textShadow: "0 0 30px rgba(0,245,255,0.2)" }}
        >
          ENTITIES
        </h2>
        <div className="mb-3 flex-1 h-px" style={{ background: "linear-gradient(90deg, #00f5ff, transparent)" }} />
        <span className="mb-3 text-xs tracking-widest" style={{ fontFamily: "'Share Tech Mono'", color: "#00f5ff" }}>
          03 CLASSIFIED
        </span>
      </div>
      <div className="holo-line mb-12 opacity-30" />

      <div className="grid md:grid-cols-3 gap-6">
        {entities.map((t, i) => (
          <div
            key={i}
            className="glass-card clip-corner p-6 group cursor-pointer relative overflow-hidden tour-card"
            style={{ border: "1px solid " + t.color + "25", transition: "transform 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; }}
          >
            <div
              className="tour-overlay absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at center, " + t.color + "08 0%, transparent 70%)" }}
            />
            <div className="flex justify-between items-start mb-4">
              <span className="text-5xl font-black opacity-15" style={{ fontFamily: "'Bebas Neue'", color: t.color }}>
                {t.num}
              </span>
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-xs uppercase tracking-widest px-2 py-1"
                  style={{ border: "1px solid " + t.color + "40", color: t.color, fontFamily: "'Share Tech Mono'" }}
                >
                  {t.sub}
                </span>
                <span className="text-xs" style={{ fontFamily: "'Share Tech Mono'", color: "rgba(255,255,255,0.25)", fontSize: "9px" }}>
                  {t.stat}
                </span>
              </div>
            </div>
            <h3
              className="text-3xl font-black uppercase mb-3"
              style={{ fontFamily: "'Bebas Neue'", color: "white", textShadow: "0 0 20px " + t.color + "30" }}
            >
              {t.title}
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              {t.desc}
            </p>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest" style={{ color: t.color, fontFamily: "'Share Tech Mono'" }}>
              <span>SCAN ENTITY</span>
              <span>&rsaquo;</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 glass-card clip-corner p-6" style={{ border: "1px solid rgba(0,245,255,0.1)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Share Tech Mono'", color: "rgba(0,245,255,0.4)" }}>
          DUALITY INDEX // ORGANIC VS CYBER
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ fontFamily: "'Share Tech Mono'", color: "#39ff7e" }}>ORGANIC</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: "47%",
                background: "linear-gradient(90deg, #39ff7e, #00f5ff, #0a3aff, #7b2fff)",
                boxShadow: "0 0 10px #00f5ff",
              }}
            />
          </div>
          <span className="text-xs" style={{ fontFamily: "'Share Tech Mono'", color: "#7b2fff" }}>CYBER</span>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section id="ai" className="min-h-screen px-16 py-28 relative grid-bg flex flex-col justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 w-96 h-96 rounded-full opacity-10 -translate-x-1/2"
          style={{ background: "radial-gradient(circle, #0a3aff 0%, transparent 70%)" }}
        />
        <div
          className="bio-orb w-8 h-8"
          style={{ background: "#39ff7e", bottom: "20%", left: "10%", boxShadow: "0 0 30px #39ff7e", animationDelay: "0.8s" }}
        />
      </div>

      <div className="flex items-end gap-4 mb-4 relative z-10">
        <h2 className="text-7xl font-black uppercase" style={{ fontFamily: "'Bebas Neue'", color: "white" }}>
          DEEP INTERFACE
        </h2>
        <div className="mb-3 flex-1 h-px" style={{ background: "linear-gradient(90deg, #39ff7e, transparent)" }} />
      </div>
      <div className="holo-line mb-4 opacity-30 relative z-10" />
      <p
        className="text-xs tracking-widest uppercase mb-12 relative z-10"
        style={{ fontFamily: "'Share Tech Mono'", color: "rgba(57,255,126,0.4)" }}
      >
        // LEVIATHAN NEURAL NETWORK — ESTABLISH CONTACT
      </p>
      <div className="relative z-10">
        <AITerminal />
      </div>
    </section>
  );
}

function About() {
  const lore = [
    "Bioluminescent Shader Engine",
    "Fluid Distortion FX",
    "Neural Coral AI",
    "Depth Pressure Sim",
    "Organic Circuit Design",
    "Pisces Constellation Nav",
    "Tidal Wave Physics",
    "Hydro-Cyber Fusion",
    "Deep Sea Sonar UI",
    "Living Architecture",
  ];

  return (
    <section id="about" className="min-h-screen px-16 py-28 relative grid-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-96 h-96 opacity-10"
          style={{
            background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
            transform: "translate(20%, 20%)",
          }}
        />
      </div>

      <div className="flex items-end gap-4 mb-6">
        <h2 className="text-7xl font-black uppercase" style={{ fontFamily: "'Bebas Neue'", color: "white" }}>
          LORE
        </h2>
        <div className="mb-3 flex-1 h-px" style={{ background: "linear-gradient(90deg, #7b2fff, transparent)" }} />
      </div>
      <div className="holo-line mb-12 opacity-30" />

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300, fontSize: "16px", lineHeight: "1.9" }}
          >
            In the year 2189, rising seas swallowed AQUA-7. What remained was not silence —
            it was transformation. The city became a reef. Its circuits became coral.
            Its data-streams became currents.
          </p>
          <p
            className="leading-relaxed mb-6"
            style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300, fontSize: "15px", lineHeight: "1.9" }}
          >
            Pisces — the final sign, the ancient fish — now rules as two eternal forces:
            one organic, one machine, circling each other in the black.
            You are the diver. You are the bridge.
          </p>
          <div
            className="glass-card clip-corner p-4 inline-block"
            style={{ border: "1px solid rgba(57,255,126,0.2)" }}
          >
            <p className="text-xs leading-loose" style={{ fontFamily: "'Share Tech Mono'", color: "rgba(57,255,126,0.45)" }}>
              // STYLE: cyberpunk + deep sea fusion<br />
              // PALETTE: bioluminescent neon + void black<br />
              // DUALITY: organic circuits, living machines
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "'Share Tech Mono'", color: "#00f5ff" }}>
            GAME ENGINE FEATURES //
          </p>
          <div className="flex flex-wrap gap-2">
            {lore.map((s, i) => (
              <span key={i} className="skill-tag uppercase tracking-wider">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="px-16 py-8 flex justify-between items-center"
      style={{
        borderTop: "1px solid rgba(0,245,255,0.1)",
        fontFamily: "'Share Tech Mono'",
        fontSize: "11px",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.15)" }}>
        &copy; 2189 ABYSSAL PROTOCOL // ♓ ALL DEPTHS RESERVED
      </span>
      <span className="animate-pulse" style={{ color: "rgba(57,255,126,0.35)" }}>
        &#9654; DIVE ACTIVE
      </span>
    </footer>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  const sections = [
    { id: "home", label: "Surface" },
    { id: "work", label: "Entities" },
    { id: "ai", label: "Neural" },
    { id: "about", label: "Abyss" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <GlobalStyles />
      <Bubbles />
      <Scanlines />
      <Navbar onNav={scrollTo} />
      <DotNav sections={sections} active={activeSection} onNav={scrollTo} />
      <main>
        <Hero />
        <Work />
        <AISection />
        <About />
        <Footer />
      </main>
    </>
  );
}