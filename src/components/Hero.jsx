import { useState, useEffect } from "react";
import HeroBgSvg from "../svgs/HeroBgSvg.jsx";
import HeroBgSvgMobile from "../svgs/HeroBgSvgMobile.jsx";
import useIsMobile from "../hooks/useIsMobile.jsx";
import { hexToRgb } from "../utils/hexToRgb.js";

const Hero = ({ color = "#FF6200", onEnter = () => {} }) => {
  const [tick, setTick] = useState(0);
  const PHRASES = ["ENCRYPT.", "SECURE.", "TRANSMIT.", "DOMINATE."];

  const STATS = [
    { num: "125", label: "FILES ENCRYPTED", accent: "#FF6200" },
    { num: "3", label: "LIVE CHANNELS", accent: "#FF0066" },
    { num: "4.5GB", label: "CLOUD STORAGE", accent: "#00C8FF" },
    { num: "99.90%", label: "UPTIME", accent: "#00E87A" },
  ];

  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setInterval(() => setTick((p) => (p + 1) % PHRASES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative flex flex-col justify-center h-max snap-start snap-always will-change-transform min-h-screen px-6 md:px-12 overflow-hidden">
      {isMobile ? (
        <HeroBgSvgMobile color={color} />
      ) : (
        <HeroBgSvg color={color} />
      )}

      {/* Top-right corner */}
      <div
        className="absolute top-6 right-6 text-right hidden md:block text-ui-xxs leading-[1.2rem]"
        style={{
          color: "#252535",
        }}
      >
        <div>
          BUILD <span style={{ color: "#44445A" }}>v0.0.1</span>
        </div>
        <div>
          UNDER.inc <span style={{ color: "#44445A" }}>DULLAT.jaTT</span>
        </div>
        <div>
          NODE <span style={{ color: "#44445A" }}>0xFF3A</span>
        </div>
      </div>

      {/* Seq label */}
      <div
        className="text-seq mb-4"
        style={{
          animation: "ds-fadeup 0.5s ease both",
        }}
      >
        SEQ:0x0001 // HOME MODULE
      </div>

      {/* Main headline */}
      <div
        className="relative"
        style={{ animation: "ds-fadeup 0.6s 0.1s ease both" }}
      >
        {/* Glitch accent */}
        <div
          className={`font-family-display text-[clamp(0.65rem,1.5vw,0.85rem)] font-bold tracking-[.5em] mb-[.8rem] opacity-80`}
          style={{
            color: color,
          }}
        >
          DEDSEC // ENCRYPTION NETWORK CORP
        </div>

        <h1 className="relative mb-[.15em] font-family-display text-[clamp(2.8rem,8vw,7rem)] font-[900] tracking-[.12em] leading-[1] text-white">
          TAKE
          <br />
          BACK
          <br />
          <span style={{ color }} className="relative inline-block">
            CONTROL
            {/* Glitch clone */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                color: "#FF0066",
                clipPath: "polygon(0 30%, 100% 30%, 100% 48%, 0 48%)",
                transform: "translateX(-3px)",
                animation: "ds-glitch 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            >
              CONTROL
            </span>
          </span>
        </h1>
      </div>

      {/* Cycling word */}
      <div
        style={{
          marginTop: "2rem",
          animation: "ds-fadeup 0.6s 0.2s ease both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 32, height: 1, background: color }} />
          <span
            key={tick}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color,
              animation: "ds-fadeup 0.3s ease both",
            }}
          >
            {PHRASES[tick]}
          </span>
        </div>
      </div>

      {/* Des */}
      <p
        className="text-muted mt-[2rem] max-w-[480px] font-family-mono text-[clamp(0.7rem,1.5vw,0.82rem)] tracking-[.06em] leading-[1.9]"
        style={{
          animation: "ds-fadeup 0.6s 0.3s ease both",
        }}
      >
        Military-grade encryption. End-to-end secure channels. Encrypted cloud
        storage. No logs. No metadata. No compromises.
      </p>

      {/* CTAs */}
      <div
        className="flex flex-wrap gap-3 mt-8"
        style={{ animation: "ds-fadeup 0.6s 0.4s ease both" }}
      >
        <button
          onClick={onEnter}
          className={`relative overflow-hidden group font-family-display font-bold text-[0.68rem] tracking-[0.3em] px-[2.2rem] py-[0.9rem] border-none cursor-pointer transition-shadow duration-300`}
          style={{ background: color, color: "#060608" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = `0 0 30px rgba(${hexToRgb(color)},0.45)`)
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          ENTER SYSTEM
        </button>
        <button
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.68rem",
            letterSpacing: "0.3em",
            padding: "0.9rem 2.2rem",
            background: "transparent",
            border: `1px solid #252530`,
            color: "#44445A",
            cursor: "pointer",
            transition: "all 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#44445A";
            e.currentTarget.style.color = "#F2F2FA";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#252530";
            e.currentTarget.style.color = "#44445A";
          }}
        >
          READ DOCS
        </button>
      </div>

      {/* Stat strips */}
      <div
        className="flex flex-wrap gap-px mt-14 [@media(max-height:800px)]:hidden"
        style={{ animation: "ds-fadeup 0.6s 0.5s ease both" }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            className="flex flex-col"
            style={{
              padding: "1rem 1.4rem",
              background: "#0b0b0f",
              borderTop: `1px solid ${s.accent}`,
              minWidth: 100,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-num)",
                fontSize: "1.8rem",
                color: s.accent,
                lineHeight: 1,
              }}
            >
              {s.num}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                color: "#44445A",
                marginTop: 4,
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className="mt-8 md:left-12 flex items-center gap-3"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.52rem",
          letterSpacing: "0.25em",
          color: "#252535",
          animation: "ds-fadeup 0.6s 0.7s ease both",
        }}
      >
        <div
          style={{
            width: 1,
            height: 24,
            background: "linear-gradient(180deg, transparent, #252535)",
          }}
        />
        SCROLL TO EXPLORE
      </div>
    </section>
  );
};

export default Hero;
