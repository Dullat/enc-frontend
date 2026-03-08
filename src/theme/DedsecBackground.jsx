import { useEffect, useRef, useState, useMemo } from "react";

export default function DedsecBackground({
  color = "#FF6200",
  gridColor,
  glowRadius = 280,
  glowStr = 0.55,
  scanlines = true,
  vignette = true,
  className = "",
  children,
}) {
  const wrapRef = useRef(null);
  const glowRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);
  const [dims, setDims] = useState({ w: 1440, h: 900 });

  // Derive rgba helpers
  const hex2rgb = (hex) => {
    const h = hex.replace("#", "");
    const n = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16,
    );
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [r, g, b] = useMemo(() => hex2rgb(color), [color]);
  const gc = gridColor || `rgba(${r},${g},${b},0.06)`;

  // Resize observer
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Mouse tracking → CSS custom prop on glow div
  useEffect(() => {
    const el = wrapRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    const tick = () => {
      glow.style.transform = `translate(${mouse.current.x - glowRadius}px, ${mouse.current.y - glowRadius}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [glowRadius]);

  // ── Circuit path generator ──────────────────────────────────────────────
  // Each path is a series of H/V moves on a snapped grid (step = 80px)
  const STEP = 80;
  const paths = useMemo(() => {
    const { w, h } = dims;
    const snap = (v) => Math.round(v / STEP) * STEP;

    // Fixed set of interesting L-shaped circuit traces spanning the viewport
    return [
      // Top-left cluster
      `M0 ${snap(h * 0.18)} H${snap(w * 0.22)} V${snap(h * 0.38)} H${snap(w * 0.42)} V${snap(h * 0.18)} H${snap(w * 0.62)}`,
      `M${snap(w * 0.1)} 0 V${snap(h * 0.28)} H${snap(w * 0.28)} V${snap(h * 0.12)}`,
      // Top-right cluster
      `M${w} ${snap(h * 0.22)} H${snap(w * 0.72)} V${snap(h * 0.45)} H${snap(w * 0.88)} V${snap(h * 0.28)}`,
      `M${snap(w * 0.82)} 0 V${snap(h * 0.32)} H${snap(w * 0.65)} V${snap(h * 0.18)}`,
      // Bottom-left
      `M0 ${snap(h * 0.72)} H${snap(w * 0.3)} V${snap(h * 0.58)} H${snap(w * 0.5)} V${snap(h * 0.72)} H${snap(w * 0.38)} V${h}`,
      `M${snap(w * 0.18)} ${h} V${snap(h * 0.68)} H${snap(w * 0.08)} V${snap(h * 0.82)}`,
      // Bottom-right
      `M${w} ${snap(h * 0.68)} H${snap(w * 0.75)} V${snap(h * 0.82)} H${snap(w * 0.58)} V${snap(h * 0.62)}`,
      `M${snap(w * 0.88)} ${h} V${snap(h * 0.75)} H${snap(w * 0.72)} V${snap(h * 0.88)}`,
      // Center cross
      `M${snap(w * 0.38)} ${snap(h * 0.42)} H${snap(w * 0.52)} V${snap(h * 0.58)} H${snap(w * 0.38)} V${snap(h * 0.42)}`,
      `M${snap(w * 0.45)} ${snap(h * 0.3)} V${snap(h * 0.42)}`,
      `M${snap(w * 0.52)} ${snap(h * 0.58)} V${snap(h * 0.72)} H${snap(w * 0.65)} V${snap(h * 0.58)}`,
      // Long horizontal spine
      `M0 ${snap(h * 0.5)} H${snap(w * 0.35)}`,
      `M${snap(w * 0.62)} ${snap(h * 0.5)} H${w}`,
    ];
  }, [dims]);

  // Junction dots — where lines change direction
  const dots = useMemo(() => {
    const { w, h } = dims;
    const snap = (v) => Math.round(v / STEP) * STEP;
    return [
      { x: snap(w * 0.22), y: snap(h * 0.18) },
      { x: snap(w * 0.22), y: snap(h * 0.38) },
      { x: snap(w * 0.42), y: snap(h * 0.38) },
      { x: snap(w * 0.42), y: snap(h * 0.18) },
      { x: snap(w * 0.28), y: snap(h * 0.28) },
      { x: snap(w * 0.72), y: snap(h * 0.22) },
      { x: snap(w * 0.72), y: snap(h * 0.45) },
      { x: snap(w * 0.88), y: snap(h * 0.45) },
      { x: snap(w * 0.65), y: snap(h * 0.18) },
      { x: snap(w * 0.3), y: snap(h * 0.72) },
      { x: snap(w * 0.3), y: snap(h * 0.58) },
      { x: snap(w * 0.5), y: snap(h * 0.58) },
      { x: snap(w * 0.5), y: snap(h * 0.72) },
      { x: snap(w * 0.75), y: snap(h * 0.68) },
      { x: snap(w * 0.75), y: snap(h * 0.82) },
      { x: snap(w * 0.58), y: snap(h * 0.82) },
      { x: snap(w * 0.38), y: snap(h * 0.42) },
      { x: snap(w * 0.52), y: snap(h * 0.42) },
      { x: snap(w * 0.52), y: snap(h * 0.58) },
      { x: snap(w * 0.38), y: snap(h * 0.58) },
    ];
  }, [dims]);

  // Traveling lines config — each has a path index + animation params
  const travelers = useMemo(
    () => [
      { pathIdx: 0, dur: "4s", delay: "0s", opacity: 0.9 },
      { pathIdx: 1, dur: "3.2s", delay: "0.8s", opacity: 0.7 },
      { pathIdx: 2, dur: "5s", delay: "1.2s", opacity: 0.9 },
      { pathIdx: 3, dur: "3.8s", delay: "0.4s", opacity: 0.7 },
      { pathIdx: 4, dur: "4.5s", delay: "2s", opacity: 0.9 },
      { pathIdx: 5, dur: "3s", delay: "1.6s", opacity: 0.7 },
      { pathIdx: 6, dur: "4.2s", delay: "0.6s", opacity: 0.9 },
      { pathIdx: 7, dur: "3.5s", delay: "2.4s", opacity: 0.7 },
      { pathIdx: 11, dur: "6s", delay: "0.2s", opacity: 0.6 },
      { pathIdx: 12, dur: "6s", delay: "3s", opacity: 0.6 },
    ],
    [],
  );

  const svgId = "ds-bg";

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden bg-[#060608] ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* ── GRID ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(${gc} 1px, transparent 1px),
            linear-gradient(90deg, ${gc} 1px, transparent 1px)
          `,
          backgroundSize: `${STEP}px ${STEP}px`,
        }}
      />

      {/* ── MOUSE GLOW ── */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute z-10 rounded-full will-change-transform"
        style={{
          width: glowRadius * 2,
          height: glowRadius * 2,
          background: `radial-gradient(circle, rgba(${r},${g},${b},${glowStr}) 0%, rgba(${r},${g},${b},0.18) 35%, transparent 70%)`,
          mixBlendMode: "screen",
          top: 0,
          left: 0,
        }}
      />

      {/* ── CIRCUIT SVG ── */}
      <svg
        className="pointer-events-none absolute inset-0 z-20 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Base path stroke reused for travelers */}
          {paths.map((_, i) => (
            <path key={i} id={`${svgId}-p${i}`} d={paths[i]} />
          ))}

          {/* Glow filter for travelers */}
          <filter
            id={`${svgId}-glow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow filter for static bars */}
          <filter
            id={`${svgId}-softglow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── STATIC CIRCUIT BARS (base layer, very dim) ── */}
        <g
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.12"
          filter={`url(#${svgId}-softglow)`}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* ── JUNCTION DOTS ── */}
        <g fill={color} opacity="0.25">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="2.5" />
          ))}
        </g>

        {/* ── TRAVELING LINES ── */}
        {travelers.map((t, i) => {
          const pathD = paths[t.pathIdx];
          if (!pathD) return null;
          return (
            <g key={i} opacity={t.opacity} filter={`url(#${svgId}-glow)`}>
              {/* Clip to path shape */}
              <use
                href={`#${svgId}-p${t.pathIdx}`}
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                opacity="0"
              />
              {/* The traveling dot */}
              <circle r="2" fill={color}>
                <animateMotion
                  dur={t.dur}
                  repeatCount="indefinite"
                  begin={t.delay}
                  calcMode="linear"
                >
                  <mpath href={`#${svgId}-p${t.pathIdx}`} />
                </animateMotion>
              </circle>
              {/* Comet tail — a slightly larger, more transparent follower */}
              <circle r="4" fill={color} opacity="0.3">
                <animateMotion
                  dur={t.dur}
                  repeatCount="indefinite"
                  begin={`calc(${t.delay} + 0.06s)`}
                  calcMode="linear"
                >
                  <mpath href={`#${svgId}-p${t.pathIdx}`} />
                </animateMotion>
              </circle>
              <circle r="7" fill={color} opacity="0.1">
                <animateMotion
                  dur={t.dur}
                  repeatCount="indefinite"
                  begin={`calc(${t.delay} + 0.12s)`}
                  calcMode="linear"
                >
                  <mpath href={`#${svgId}-p${t.pathIdx}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}

        {/* ── SECONDARY ACCENT TRACES (thinner, different color stop) ── */}
        <g
          stroke={color}
          strokeWidth="0.5"
          fill="none"
          opacity="0.07"
          strokeDasharray="4 8"
        >
          {/* A few extra dashed traces between the main ones */}
          <path d={`M0 ${Math.round(dims.h * 0.5)} H${dims.w}`} />
          <path d={`M${Math.round(dims.w * 0.5)} 0 V${dims.h}`} />
        </g>
      </svg>

      {/* ── SCANLINES ── */}
      {scanlines && (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
          }}
        />
      )}

      {/* ── VIGNETTE ── */}
      {vignette && (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      )}

      {/* ── CONTENT ── */}
      <div className="relative z-40">{children}</div>
    </div>
  );
}
