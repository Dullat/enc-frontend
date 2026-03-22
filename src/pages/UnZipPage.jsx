import { zipSync, unzipSync, strToU8, Zip } from "fflate";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Dot from "../theme/Dot.jsx";
import InfoRow from "../theme/InfoRow.jsx";
import KeyInput from "../components/KeyInput.jsx";

import { hexToRgb } from "../utils/hexToRgb.js";

const ACCENT = "#FFE600";
const fmtBytes = (b) => {
  if (b >= 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(2)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(1)} KB`;
  return `${b} B`;
};

const FileUpload = ({ file, setFile, disabled, MAX_SIZE }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const pick = (fs) => {
    if (
      fs.type !== "application/zip" &&
      !fs.name.toLowerCase().endsWith(".zip")
    )
      return alert("Only .zip files allowed");
    setFile(fs);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (!disabled) pick(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDrop={onDrop}
      onClick={() => !disabled && !file && ref.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      className={`flex flex-col items-center justify-center gap-3 px-6 py-7 min-h-[130px] border border-dashed transition-all duration-200
        ${disabled ? "cursor-not-allowed opacity-50" : file ? "cursor-default" : "cursor-pointer"}
      `}
      style={{
        borderColor: drag ? ACCENT : file ? `${ACCENT}66` : "#252530",
        background: drag
          ? `rgba(${hexToRgb(ACCENT)},0.05)`
          : file
            ? `rgba(${hexToRgb(ACCENT)},0.02)`
            : "transparent",
      }}
    >
      <input
        ref={ref}
        type="file"
        accept=".zip,application/zip"
        className="hidden"
        onChange={(e) => pick(e.target.files[0])}
        className="hidden"
      />
      {!file ? (
        <>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            stroke={drag ? ACCENT : "#252530"}
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
              style={{ color: drag ? ACCENT : "#44445A" }}
            >
              {drag ? "DROP FILE HERE" : "DRAG FILE OR CLICK TO SELECT"}
            </p>

            <p className="font-family-mono text-[0.5rem] tracking-[0.12em] text-[#252535] mt-1">
              ANY FILE TYPE — MAX {MAX_SIZE} MB
            </p>
          </div>
        </>
      ) : (
        <div key={`${file.name}`} className="flex items-center gap-4 w-full">
          {/* Type badge */}
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
            style={{
              background: `rgba(${hexToRgb(ACCENT)},0.07)`,
              border: `1px solid ${ACCENT}44`,
            }}
          >
            <span
              className="font-family-mono text-[0.42rem] tracking-[0.08em]"
              style={{ color: ACCENT }}
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
              className="font-family-mono text-[0.5rem] tracking-[0.1em] border border-[#252530] text-[#44445A] px-2 py-1 flex-shrink-0 hover:text-[#F2F2FA] hover:border-[#44445A]"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
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

const UnZipPage = () => {
  const [file, setFile] = useState(null);
  const [extractedFilesList, setExtractedFilesList] = useState([]);
  const [status, setStatus] = useState("idle"); // idle , loading , done ,error
  const [progress, setProgress] = useState(0); // it will be a fake progress
  const [log, setLog] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const progressRef = useRef(null);

  const isLoading = status === "loading";
  const isDone = status === "done";
  const isError = status === "error";
  const canRun = !!file && status === "idle" && !isLoading;

  const startFakeProgress = () => {
    let p = 0;
    progressRef.current = setInterval(() => {
      p = Math.min(p + Math.random() * 8, 90); // never hit 100 until done
      setProgress(Math.round(p));
    }, 300);
  };
  const stopFakeProgress = (final = 100) => {
    clearInterval(progressRef.current);
    setProgress(final);
  };

  const handleCompress = async (file) => {
    setStatus("loading");
    startFakeProgress();

    try {
      // when we select file using input, it only selects the its info and refrence no binary bytes loaded into ram
      // to load that into ram we do arrayBuffer, and files bytes are in arrayBuffer const, (data is loaded into ram and this  arrayBuffer variable is pointing to that)
      const arrayBuffer = await file.arrayBuffer();
      // Uint8Array allow you to inspect and view that files's bytes, its 8byte (0-255, cover all letters and symbols), now we can read actual bytes
      const zipData = new Uint8Array(arrayBuffer);

      // but i could also use fflate.zip(zipData, (err, data) => ...)
      const unzipped = unzipSync(zipData);
      console.log(unzipped);

      const filesList = Object.entries(unzipped).map(([name, data]) => {
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);

        return { name, url, size: data.length };
      });

      setExtractedFilesList(filesList);

      stopFakeProgress(100);
      setStatus("done");
    } catch (err) {
      console.error(err);
      stopFakeProgress(0);
      setStatus("error");
      setErrMsg(err.message || "Compression failed");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setLog([]);
    setErrMsg("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");

    if (extractedFilesList && extractedFilesList.length > 0) {
      for (let file of extractedFilesList) {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      }
    }

    setExtractedFilesList([]);
    clearInterval(progressRef.current);
  };

  useEffect(() => {
    console.log(extractedFilesList);
  }, [extractedFilesList]);

  return (
    <div className="flex flex-col w-full min-h-dvh justify-center pb-20 items-center">
      <div className="flex flex-col py-8 px-4 max-w-[1200px] w-full">
        <div className="flex items-end justify-between gap-4 pb-6 mb-8 border-b border-line">
          <div>
            <p
              className="font-mono text-[#252535] mb-1.5"
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
              }}
            >
              MODULE_04 // DECOMPRESS
            </p>
            <h1
              className="font-display font-black text-yellow leading-none mb-2"
              style={{
                fontSize: "clamp(1.4rem,3vw,2.2rem)",
                letterSpacing: "0.22em",
              }}
            >
              UNZIP DATA
            </h1>
            <p
              className="font-mono text-label leading-[1.9] max-w-[480px]"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
              }}
            >
              DECompress(UN_ZIP) files. DECompression is done on Client itself.
              Nothing is sent to server
            </p>
            <Link
              to="/compression/zip"
              className="text-seq  text-[.5rem] opacity-60"
            >
              Wanna Compress files?{" "}
              <span className="text-magenta">Click here</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-col gap-1.5 items-end">
            {[
              { label: "ENGINE", ok: true },
              { label: "STREAM", ok: true },
              { label: "SERVER STORAGE", ok: false },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <span
                  className="font-mono text-[#252535]"
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.18em",
                  }}
                >
                  {r.label}
                </span>
                <Dot ok={r.ok} pulse={r.ok} />
              </div>
            ))}
          </div>
        </div>

        {/* main grid */}
        <div className="flex w-full gap-[1px] bg-line mx-auto">
          <div className="bg-surface w-full p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] grad-top-y" />
            <div
              className="absolute bottom-0 right-0 w-[200px] h-[200px] pointer-events-none"
              style={{
                background: `radial-gradient(circle at 100% 100%,rgba(${hexToRgb(ACCENT)},0.06) 0%,transparent 65%)`,
              }}
            />

            {extractedFilesList.length > 0 && (
              <div className="flex flex-col gap-4 py-2">
                <p className="text-seq text-green">Downlaod your files</p>
                {extractedFilesList.map((file) => (
                  <div
                    key={`${file.name}`}
                    className="flex items-center gap-4 w-full"
                  >
                    {/* Type badge */}
                    <div
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: `rgba(${hexToRgb(ACCENT)},0.07)`,
                        border: `1px solid ${ACCENT}44`,
                      }}
                    >
                      <span
                        className="font-family-mono text-[0.42rem] tracking-[0.08em]"
                        style={{ color: ACCENT }}
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
                        {fmtBytes(file.size)} ·{" "}
                        {file.name.split(".").pop().toUpperCase().slice(0, 4) ||
                          "UNKNOWN TYPE"}
                      </p>
                    </div>

                    <button
                      className="font-family-mono text-[0.5rem] tracking-[0.1em] border border-[#252530] text-[#44445A] px-2 py-1 flex-shrink-0 hover:text-[#F2F2FA] hover:border-[#44445A]"
                      onClick={(e) => {
                        e.stopPropagation();
                        const a = document.createElement("a");
                        a.href = file.url;
                        a.download = file.name;
                        a.click();
                      }}
                    >
                      ⬇ Download
                    </button>
                  </div>
                ))}
                <hr className="opacity-20 py-2" />
              </div>
            )}
            <div className="flex flex-col gap-5.5">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-mono text-yellow border border-yellow/25 px-1.5 py-0.5"
                    style={{
                      fontSize: "0.48rem",
                      letterSpacing: "0.2em",
                    }}
                  >
                    01
                  </span>
                  <span
                    className="font-display font-bold text-ds-white"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.22em",
                    }}
                  >
                    SELECT FILE
                  </span>
                </div>
                <FileUpload
                  file={file}
                  setFile={setFile}
                  disabled={isLoading || isDone}
                  MAX_SIZE={500}
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-yellow border border-yellow/25 px-1.5 py-0.5"
                    style={{
                      fontSize: "0.48rem",
                      letterSpacing: "0.2em",
                    }}
                  >
                    02
                  </span>
                  <span
                    className="font-display font-bold text-ds-white"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.22em",
                    }}
                  >
                    EXECUTE
                  </span>
                </div>

                {/* progress bar, its fake one */}
                {(isLoading || isDone || isError) && (
                  <div className="mb-4">
                    <div className="flex justify-between font-mono mb-1.5">
                      <span
                        className="flex items-center gap-2 text-muted"
                        style={{
                          fontSize: "0.52rem",
                          letterSpacing: "0.18em",
                        }}
                      >
                        <Dot ok={!isError} pulse={isLoading} />
                        {isDone
                          ? "DECOMPRESSION COMPLETE"
                          : isError
                            ? "OPERATION FAILED"
                            : "DECOMPRESSING..."}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.52rem",
                          letterSpacing: "0.18em",
                          color: isDone
                            ? "#00E87A"
                            : isError
                              ? "#FF0066"
                              : ACCENT,
                        }}
                      >
                        {isDone ? "100%" : isError ? "ERR" : `${progress}%`}
                      </span>
                    </div>
                    <div className="ds-track">
                      <div
                        className={`h-full transition-all duration-350 relative overflow-hidden ${
                          isDone
                            ? "bg-green"
                            : isError
                              ? "bg-magenta"
                              : "bg-cyan"
                        }`}
                        style={{
                          width: isDone ? "100%" : `${progress}%`,
                        }}
                      >
                        {isLoading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[ds-shimmer_1.5s_infinite]" />
                        )}
                      </div>
                    </div>
                    {/* Error message */}
                    {isError && errMsg && (
                      <p
                        className="font-mono text-magenta mt-2"
                        style={{
                          fontSize: "0.55rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {errMsg.toUpperCase()}
                      </p>
                    )}
                  </div>
                )}
                {/* {isDone && ( */}
                {/*   <div className="mb-4"> */}
                {/*     <p className="text-green font-family-mono text-[.72rem] mb-3"> */}
                {/*       FILES COMPRESSED SUCCESSFULLY */}
                {/*     </p> */}
                {/*     <a */}
                {/*       href={downloadUrl} */}
                {/*       download="compressed_data.zip" */}
                {/*       className="ds-btn border border-yellow text-yellow hover:bg-yellow/10" */}
                {/*       style={{ */}
                {/*         padding: "0.8rem 2rem", */}
                {/*         fontSize: "0.6rem", */}
                {/*       }} */}
                {/*     > */}
                {/*       DOWNLOAD ZIP */}
                {/*     </a> */}
                {/*   </div> */}
                {/* )} */}

                {/* btns */}
                <div className="flex gap-2.5 flex-wrap">
                  {!isDone ? (
                    <button
                      onClick={() => handleCompress(file)}
                      disabled={!canRun}
                      className={`ds-btn ds-btn-outline-y ${canRun ? "pointer-events-auto" : "!pointer-events-none"} `}
                      style={{
                        padding: "0.85rem 2rem",
                        cursor: canRun ? "pointer" : "not-allowed",
                        opacity: canRun ? 1 : 0.35,
                        background: isLoading
                          ? `rgba(${hexToRgb(ACCENT)},0.08)`
                          : "transparent",
                      }}
                    >
                      <span>
                        {isLoading ? "DECOMPRESSING..." : "DECOMPRESS FILES"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="ds-btn border border-green text-green hover:bg-green/10"
                      style={{
                        padding: "0.85rem 2rem",
                      }}
                    >
                      ↺ DECOMPRESS ANOTHER
                    </button>
                  )}

                  {file && !isLoading && !isDone && (
                    <button
                      onClick={handleReset}
                      className="ds-btn ds-btn-ghost"
                      style={{
                        padding: "0.85rem 1.2rem",
                      }}
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {!isLoading && !isDone && (
                  <div className="flex flex-col gap-1.5 mt-3.5">
                    {[
                      {
                        ok: file,
                        text: file
                          ? `${file.name} FILE(S) SELECTED`
                          : "NO FILE SELECTED",
                      },
                    ].map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Dot ok={v.ok} pulse={false} />
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "0.5rem",
                            letterSpacing: "0.12em",
                            color: v.ok ? "#44445A" : "#3a1020",
                          }}
                        >
                          {v.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnZipPage;
