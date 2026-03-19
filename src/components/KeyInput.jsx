import React, { useState } from "react";

const KeyInput = ({ value, onChange, disabled, ACCENT }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const strength = !value.length
    ? null
    : value.length < 8
      ? {
          label: "WEAK",
          textClass: "text-magenta",
          bgClass: "bg-magenta",
          pct: 25,
        }
      : value.length < 12
        ? {
            label: "MODERATE",
            textClass: "text-orange",
            bgClass: "bg-orange",
            pct: 60,
          }
        : value.length < 18
          ? {
              label: "STRONG",
              textClass: "text-gold",
              bgClass: "bg-gold",
              pct: 80,
            }
          : {
              label: "EXCELLENT",
              textClass: "text-green",
              bgClass: "bg-green",
              pct: 100,
            };

  return (
    <div className="flex flex-col gap-2">
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center">
        <label
          className={`text-label transition-colors duration-200 ${
            focused ? "text-orange" : "text-muted"
          }`}
        >
          PASSPHRASE (ENCRYPTION KEY)
        </label>

        {strength && (
          <span
            className={`font-mono text-[0.48rem] tracking-[0.15em] ${strength.textClass}`}
          >
            {strength.label}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="[ ENTER PASSPHRASE ]"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="ds-input pr-16 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface"
        />

        <button
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.48rem] tracking-[0.12em] bg-transparent border-none text-muted cursor-pointer hover:text-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>

      <div className="h-[2px] bg-line">
        <div
          className={`h-full transition-all duration-300 ${
            strength?.bgClass || "bg-transparent"
          }`}
          style={{ width: strength ? `${strength.pct}%` : "0%" }}
        />
      </div>

      <p className="font-mono text-[0.5rem] tracking-[0.15em] text-line-hi mt-1">
        THIS KEY IS NEVER SENT TO THE SERVER — STORE IT SECURELY
      </p>
    </div>
  );
};

export default KeyInput;
