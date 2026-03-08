import { useEffect, useRef, useState, useMemo, useCallback } from "react";

export default function Ticker({
  items = [],
  color = "#FF6200",
  speed = 60,
  label = "LIVE_FEED",
  height = 28,
  position = "bottom",
  className = "",
}) {
  const trackRef = useRef(null);
  const [dur, setDur] = useState("30s");

  // Measure the single copy width → derive duration from speed
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const halfW = el.scrollWidth / 2; // items are doubled for seamless loop
    setDur(`${Math.round(halfW / speed)}s`);
  }, [items, speed]);

  const posStyle =
    position === "bottom"
      ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }
      : position === "top"
        ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }
        : {};

  const doubled = [...items, ...items]; // seamless loop

  return (
    <div
      className={`overflow-hidden flex items-center ${className}`}
      style={{
        ...posStyle,
        height,
        background: "rgba(6,6,8,0.92)",
        borderTop: position === "bottom" ? "1px solid #18181f" : "none",
        borderBottom: position === "top" ? "1px solid #18181f" : "none",
        backdropFilter: "blur(8px)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Badge */}
      <div
        className="flex-shrink-0 flex items-center px-3 h-full border-r"
        style={{
          borderColor: "#18181f",
          background: "#0b0b0f",
          fontSize: "0.58rem",
          letterSpacing: "2px",
          color,
        }}
      >
        <span
          className="inline-block w-[5px] h-[5px] mr-2 flex-shrink-0"
          style={{
            background: color,
            animation: "ds-pulse 1.8s ease-in-out infinite",
          }}
        />
        {label}
      </div>

      {/* Scrolling track */}
      <div className="overflow-hidden flex-1 relative">
        <div
          ref={trackRef}
          className="flex items-center whitespace-nowrap"
          style={{
            animation: `ds-ticker ${dur} linear infinite`,
          }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className="flex items-center"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "2px",
                color: "#44445A",
                padding: "0 2.5rem",
              }}
            >
              {item.label && (
                <span style={{ color: "#252535", marginRight: "0.6rem" }}>
                  {item.label} //
                </span>
              )}
              <span style={{ color: item.highlight ? color : "#505060" }}>
                {item.value}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[0px] w-16 flex-shrink-0"
        style={{
          background: "linear-gradient(90deg, rgba(6,6,8,0.9), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16"
        style={{
          background: "linear-gradient(-90deg, rgba(6,6,8,0.9), transparent)",
        }}
      />

      <style>{`
        @keyframes ds-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ds-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.3; transform:scale(0.6); }
        }
      `}</style>
    </div>
  );
}
