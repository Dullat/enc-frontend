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
      style={{
        border: `1px dashed ${drag ? accent : file ? accent + "66" : "#252530"}`,
        background: drag
          ? `rgba(${hexToRgb(accent)},0.05)`
          : file
            ? `rgba(${hexToRgb(accent)},0.02)`
            : "transparent",
        padding: "1.8rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.8rem",
        cursor: disabled ? "not-allowed" : file ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
        minHeight: 130,
      }}
    >
      <input
        ref={ref}
        type="file"
        style={{ display: "none" }}
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
            style={{ transition: "stroke 0.2s" }}
          >
            <rect x="1" y="1" width="28" height="28" />
            <path d="M10 18 L15 13 L20 18" />
            <line x1="15" y1="13" x2="15" y2="23" />
            <line x1="8" y1="23" x2="22" y2="23" />
          </svg>
          <div style={{ textAlign: "center" }}>
            <p
              className={`font-family-mono`}
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                color: drag ? accent : "#44445A",
                transition: "color 0.2s",
              }}
            >
              {drag ? "DROP FILE HERE" : "DRAG FILE OR CLICK TO SELECT"}
            </p>
            <p
              className={`font-family-mono`}
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.12em",
                color: "#252535",
                marginTop: "0.3rem",
              }}
            >
              ANY FILE TYPE — MAX 500 MB
            </p>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            width: "100%",
          }}
        >
          {/* Type badge */}
          <div
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              background: `rgba(${hexToRgb(accent)},0.07)`,
              border: `1px solid ${accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className={`font-family-mono`}
              style={{
                fontSize: "0.42rem",
                color: accent,
                letterSpacing: "0.08em",
              }}
            >
              {file.name.split(".").pop().toUpperCase().slice(0, 4)}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              className={`font-family-mono`}
              style={{
                fontSize: "0.65rem",
                color: "#F2F2FA",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.name}
            </p>
            <p
              className={`font-family-mono`}
              style={{
                fontSize: "0.52rem",
                color: "#44445A",
                marginTop: "0.2rem",
                letterSpacing: "0.1em",
              }}
            >
              {fmtBytes(file.size)} · {file.type || "UNKNOWN TYPE"}
            </p>
          </div>
          {!disabled && (
            <button
              className={`font-family-mono`}
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
                background: "none",
                border: "1px solid #252530",
                color: "#44445A",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                flexShrink: 0,
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
