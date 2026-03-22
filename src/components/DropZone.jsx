import { useState, useRef, useCallback } from "react";
import { hexToRgb } from "../utils/hexToRgb.js";
const DropZone = ({ file, onFile, accent, disabled, MAX_SIZE }) => {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const fmtBytes = (b) => {
    if (b >= 1e9) return `${(b / 1e9).toFixed(2)} GB`;
    if (b >= 1e6) return `${(b / 1e6).toFixed(2)} MB`;
    if (b >= 1e3) return `${(b / 1e3).toFixed(1)} KB`;
    return `${b} B`;
  };

  const pick = (f) => {
    if (!f) return;
    if (f.size > MAX_SIZE) {
      alert("File exceeds 500 MB limit");
      return;
    }
    onFile(f);
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDrag(false);
      if (!disabled) pick(e.dataTransfer.files[0]);
    },
    [disabled],
  );

  return (
    <div
      onClick={() => !disabled && !file && ref.current.click()}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      className={`flex flex-col items-center justify-center gap-3 px-6 py-7 min-h-[130px] border border-dashed    transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-50" : file ? "cursor-default" : "cursor-pointer"}`}
      style={{
        borderColor: drag ? accent : file ? `${accent}66` : "#252530",
        background: drag
          ? `rgba(${hexToRgb(accent)},0.05)`
          : file
            ? `rgba(${hexToRgb(accent)},0.02)`
            : "transparent",
      }}
    >
      <input
        ref={ref}
        type="file"
        className="hidden"
        onChange={(e) => pick(e.target.files[0])}
        disabled={disabled}
      />

      {!file ? (
        <>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            stroke={drag ? accent : "#252530"}
            strokeWidth="1"
            className="transition-colors duration-200"
          >
            <rect x="1" y="1" width="28" height="28" />
            <path d="M10 18 L15 13 L20 18" />
            <line x1="15" y1="13" x2="15" y2="23" />
            <line x1="8" y1="23" x2="22" y2="23" />
          </svg>

          <div className="text-center">
            <p
              className="font-family-mono text-[0.65rem] tracking-[0.18em] transition-colors duration-200"
              style={{ color: drag ? accent : "#44445A" }}
            >
              {drag ? "DROP FILE HERE" : "DRAG FILE OR CLICK TO SELECT"}
            </p>

            <p className="font-family-mono text-[0.5rem] tracking-[0.12em] text-[#252535] mt-1">
              ANY FILE TYPE — MAX 500 MB
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4 w-full">
          {/* Type badge */}
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
            style={{
              background: `rgba(${hexToRgb(accent)},0.07)`,
              border: `1px solid ${accent}44`,
            }}
          >
            <span
              className="font-family-mono text-[0.42rem] tracking-[0.08em]"
              style={{ color: accent }}
            >
              {file.name.split(".").pop().toUpperCase().slice(0, 4)}
            </span>
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="font-family-mono text-[0.65rem] text-[#F2F2FA] tracking-[0.06em] truncate">
              {file.name}
            </p>

            <p className="font-family-mono text-[0.52rem] text-[#44445A] mt-1 tracking-[0.1em]">
              {fmtBytes(file.size)} · {file.type || "UNKNOWN TYPE"}
            </p>
          </div>

          {/* Remove button */}
          {!disabled && (
            <button
              className="font-family-mono text-[0.5rem] tracking-[0.1em] border border-[#252530] text-[#44445A] px-2 py-1 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DropZone;
