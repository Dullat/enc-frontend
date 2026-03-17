import { useMemo } from "react";

export default function DedsecBackgroundMobile({
  color = "#FF6200",
  className = "",
  children,
}) {
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

  return (
    <div
      className={`relative overflow-hidden bg-[#060608] w-full ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(${r},${g},${b},0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${r},${g},${b},0.06) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke={color} strokeWidth="1" fill="none">
          <path d="M0 200 H300 V400 H600" />
          <path d="M100 0 V250 H300" />
          <path d="M100% 300 H70% V500" />
          <path d="M0 70% H40% V60%" />
          <path d="M60% 100% V70% H80%" />
        </g>
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(${r},${g},${b},0.15), transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(${r},${g},${b},0.1), transparent 70%)
          `,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
