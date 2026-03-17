// optimized for mobile specially ios and firefox(android)
import { hexToRgb } from "../utils/hexToRgb.js";

const HeroBgSvgMobile = ({ color }) => {
  const r = hexToRgb(color);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke={`rgba(${r},0.05)`}
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      <g stroke={color} strokeWidth="1" fill="none" opacity="0.15">
        <path d="M0 160 H240 V320 H480 V160 H720" />
        <path d="M1200 360 H880 V480 H640 V360" />
        <path d="M160 800 V560 H400 V640 H560 V560" />
        <path d="M1040 0 V200 H800 V120 H640 V200" />
        <path d="M320 400 H480 V520 H320 V400" />
        <path d="M0 560 H160" />
        <path d="M1040 560 H1200" />
      </g>

      <g fill={color} opacity="0.25">
        {[
          [240, 160],
          [240, 320],
          [480, 320],
          [480, 160],
          [880, 360],
          [880, 480],
          [640, 480],
          [400, 560],
          [400, 640],
          [480, 400],
          [480, 520],
          [320, 520],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" />
        ))}
      </g>

      <defs>
        <radialGradient id="rg" cx="100%" cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#rg)" />
    </svg>
  );
};

export default HeroBgSvgMobile;
