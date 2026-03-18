import React, { useRef, useState, useEffect } from "react";
import useInView from "../hooks/useInView.jsx";

const cursorMute = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='30'><text y='15' font-family='monospace' font-size='12' font-weight='bold' fill='%23FF6200'>[ MUTE ]</text></svg>") 35 10, pointer`;
const cursorUnmute = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='20'><text y='15' font-family='monospace' font-size='12' font-weight='bold' fill='%2300E87A'>[ UnMUTE ]</text></svg>") 35 10, pointer`;

const TeaserSection = ({ studio = false }) => {
  const [play, setPlay] = useState(true);
  const [muted, setMuted] = useState(true);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const video = useRef();
  const viewTracker = useRef(null);

  const inView = useInView(viewTracker, 1);

  const handlePlay = (type = "toggle") => {
    setPlay((prev) => {
      let next;
      if (type === "toggle") {
        next = !prev;
        if (next === false) {
          setManuallyPaused(true);
        } else setManuallyPaused(false);
      } else if (type === "play") {
        if (manuallyPaused) manuallyPaused(false);
        next = true;
      } else {
        if (manuallyPaused) manuallyPaused(false);
        next = false;
      }
      next ? video.current.play() : video.current.pause();
      return next;
    });
  };

  const handleUnmute = () => {
    setMuted((prev) => !prev);
  };

  useEffect(() => {
    if (manuallyPaused) return;
    if (inView) {
      handlePlay("play");
      console.log("in view");
    } else {
      handlePlay("pause");
    }
  }, [inView]);

  return (
    <div
      style={{ cursor: muted ? cursorUnmute : cursorMute }}
      className="relative z-0 isolate overflow-hidden bg-void w-full sm:min-h-[600px] h-full snap-start snap-always will-change-transform flex items-center justify-center"
    >
      {/* onMouseLeave={() => handlePlay("pause")} */}
      {/* onMouseEnter={() => handlePlay("play")} */}
      <video
        ref={video}
        preload={"auto"}
        poster="/videos/bigBrother-poster.png"
        // autoPlay
        loop
        muted={muted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0
        brightness-[1.24] contrast-[1.7] transition-opacity duration-700"
        // saturate-[1.5] hue-rotate-[10deg]
      >
        <source src="/videos/bigBrother.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className={`absolute inset-0 bg-orange/70 mix-blend-multiply pointer-events-none z-[1] transform-gpu `}
      />
      <div className="ds-vignette absolute inset-0 z-[2] pointer-events-none transform-gpu" />
      <div
        className=" absolute inset-0 z-[3] transform-gpu bg-[rgba(255,255,255,.0)] backdrop-blur-[3px]"
        onClick={handleUnmute}
      />

      {/* <div className="absolute inset-4 z-[4] pointer-events-none cursor-auto"> */}
      {/*   <div className="hud-tl" /> */}
      {/*   <div className="hud-tr" /> */}
      {/*   <div className="hud-bl" /> */}
      {/*   <div className="hud-br" /> */}
      {/* </div> */}

      {/* <div className="absolute top-6 left-6 z-[10] flex flex-col gap-2"> */}
      {/*   <div> */}
      {/*     <span className="ds-badge ds-badge-live ds-badge-o">LIVE_FEED</span> */}
      {/*   </div> */}
      {/*   <span className="text-ui-xs text-muted">OPTIC_NODE // 0xFF3A</span> */}
      {/* </div> */}

      <div className="absolute top-6 right-6 z-[10] flex flex-col items-end gap-3 cursor-auto">
        <div className="flex gap-4 items-center">
          <span className="text-ui-xxs text-orange tracking-[0.2em]">
            LATENCY: 14ms
          </span>
          <button
            className="ds-badge ds-badge-o cursor-pointer hover:bg-orange hover:text-void transition-colors pointer-events-auto"
            onClick={handleUnmute}
          >
            {muted ? "AUDIO: MUTED" : "AUDIO: LIVE"}
          </button>
        </div>
        <div className="flex gap-2">
          <span className="text-ui-xxs text-muted">SECURE_CHANNEL</span>
          <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
        </div>
      </div>

      {/*   <div className="flex flex-col gap-1"> */}
      {/*     <span className="text-label">MONITORING_HASH</span> */}
      {/*     <span className="text-display-sm text-ds-white">SHA-256</span> */}
      {/*   </div> */}
      {/*   <div className="flex flex-col gap-2"> */}
      {/*     <div className="flex justify-between items-end"> */}
      {/*       <span className="text-label">DECRYPTION_PROGRESS</span> */}
      {/*       <span className="text-ui-xs text-orange">84%</span> */}
      {/*     </div> */}
      {/*     <div className="ds-track"> */}
      {/*       <div */}
      {/*         className="ds-fill ds-fill-o ds-fill-shimmer transform-gpu" */}
      {/*         style={{ width: "84%" }} */}
      {/*       /> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}

      {/* <div className="absolute bottom-8 right-6 z-[10] flex flex-col items-end cursor-auto"> */}
      {/*   <span className="text-label mb-1">LOCAL_TIME</span> */}
      {/*   <span className="text-stat-sm text-orange opacity-50"> */}
      {/*     {Date().split(" ").slice(0, 5).join(" ")} */}
      {/*   </span> */}
      {/*   <span className="text-ui-xxs text-muted mt-1">TZ: GL // "!SYNCED"</span> */}
      {/* </div> */}

      <div className="relative z-[20] flex flex-col items-center gap-6 mt-10 pointer-events-auto cursor-auto">
        {!studio ? (
          <h1
            className="text-display-xl !text-[clamp(1rem,6vw,4rem)] text-ds-white text-glow-o text-center uppercase ds-glitch"
            data-text="INTERCEPT"
          >
            {/* INTERCEPT */}
            BIG_BROTHER
          </h1>
        ) : (
          <h1
            className="text-display-xl text-ds-white text-glow-o text-center uppercase ds-glitch"
            data-text="SYS.ARCHIVE"
          >
            SYS.ARCHIVE<sup className="text-display-sm align-top">&reg;</sup>
          </h1>
        )}

        <p
          ref={viewTracker}
          className="text-ui-sm !text-[clamp(.5rem,2vw,.75rem)] text-body sm:max-w-md max-w-[80%] text-center bg-surface/60 backdrop-blur-sm p-4 border border-line transform-gpu"
        >
          {studio
            ? "ARCHIVAL RECORD: Core engineering outlines the deployment of next-generation quantum-resistant encryption protocols across primary network nodes."
            : "They are watching everything you do. Every message, every search, every transaction. You are nothing but a data point to them—a commodity to be bought, sold, and manipulated. Big Brother isn't a government anymore;"}
        </p>

        <button
          onClick={() => handlePlay()}
          className="ds-btn ds-btn-outline-o ds-btn-lg mt-4 z-[10]"
        >
          <span>{play ? "PAUSE_FEED" : "RESUME_FEED"}</span>
        </button>
      </div>
    </div>
  );
};

export default TeaserSection;
