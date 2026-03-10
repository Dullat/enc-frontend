import { useState, useRef, useEffect } from "react";
import { FEATURES } from "../data/dedsecData.js";
import { hexToRgb } from "../utils/hexToRgb.js";

const FeaturesSection = () => {
  return (
    <div className="w-full min-h-dvh snap-start px-2 md:px-12 flex py-4">
      <div className="my-auto">
        <div className={`text-seq mb-3 font-family-mono`}>
          SEQ:0x0010 // MODULES
        </div>
        <h2 className={`font-family-diaplay text-display-md mb-6`}>
          SYSTEM MODULES
        </h2>
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
          {FEATURES.map((f) => {
            const hover = `hover:bg-[#${f.accent.split("").slice(1).join("")}]`;
            console.log(hover);
            return (
              <div
                key={f.seq}
                className={`relative ds-card px-6 py-6 flex flex-col h-full`}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: f.accent,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 120,
                    height: 120,
                    background: `radial-gradient(circle at 100% 100%, rgba(${hexToRgb(f.accent)},0.09) 0%, transparent 80%)`,
                    pointerEvents: "none",
                  }}
                />
                <div className={`text-ui-xxs text-muted`}>{f.seq}</div>
                <h3
                  className={`text-display-sm mb-[.8rem]`}
                  style={{ color: f.accent }}
                >
                  {f.title}
                </h3>
                <p className={`font-family-mono opacity-60 text-ui-sm mb-6`}>
                  {f.desc}
                </p>

                <button
                  className={`ds-badge ${f.class} mt-auto w-min cursor-pointer hover:text-black`}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = f.accent)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  {f.tag}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
