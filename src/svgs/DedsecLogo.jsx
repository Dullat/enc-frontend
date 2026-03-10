import { hexToRgb } from "../utils/hexToRgb.js";
export const DedsecLogo = ({ size = 44, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="42" height="42" stroke={color} strokeWidth="1" />
      <rect
        x="5"
        y="5"
        width="34"
        height="34"
        stroke="#18181f"
        strokeWidth="1"
      />
      <polygon
        points="22,7 31,16 31,27 22,38 13,27 13,16"
        stroke={color}
        strokeWidth="1"
        fill={`rgba(${hexToRgb(color)},0.05)`}
      />
      <polygon
        points="13,16 8,10 17,14"
        stroke={color}
        strokeWidth="1"
        fill={`rgba(${hexToRgb(color)},0.1)`}
      />
      <polygon
        points="31,16 36,10 27,14"
        stroke={color}
        strokeWidth="1"
        fill={`rgba(${hexToRgb(color)},0.1)`}
      />
      <circle cx="18" cy="21" r="2" fill={color} />
      <circle cx="26" cy="21" r="2" fill={color} />
      <line x1="20" y1="27" x2="24" y2="27" stroke={color} strokeWidth="1" />
      <line x1="22" y1="25" x2="22" y2="27" stroke={color} strokeWidth="1" />
    </svg>
  );
};
