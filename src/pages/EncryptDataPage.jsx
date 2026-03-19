import { useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery } from "../features/user/userApi.js";
import { setAccent } from "../features/theme/themeSlice.js";
import DropZone from "../components/DropZone.jsx";
import KeyInput from "../components/KeyInput.jsx";
import LogLine from "../components/LogLine.jsx";

import Dot from "../theme/Dot.jsx";
import InfoRow from "../theme/InfoRow.jsx";

import { hexToRgb } from "../utils/hexToRgb.js";

const ENDPOINT = "http://localhost:5000/api/enc-direct";
let MAX_SIZE = 1024 * 1024 * 1024;
const ACCENT = "#00C8FF"; // cyan
const ORANGE = "#FF6200";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtBytes = (b) => {
  if (b >= 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(2)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(1)} KB`;
  return `${b} B`;
};

export default function EncryptPage() {
  // const ACCENT = useSelector(state => state.theme.accent);
  const { data, isError: isUserError } = useGetMeQuery();
  const dispatch = useDispatch();
  dispatch(setAccent(ACCENT));

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle , loading , done ,error
  const [progress, setProgress] = useState(0); // it will be a fake progress
  const [log, setLog] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const progressRef = useRef(null);

  data?.user.plan === "pro"
    ? (MAX_SIZE = 2 * MAX_SIZE)
    : (MAX_SIZE = 0.5 * MAX_SIZE);

  const addLog = (msg, type = "info") => {
    const ts = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setLog((l) => [...l.slice(-8), { ts, msg, type }]);
  };

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

  const encrypt = async (file, password) => {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"],
    );

    const fileBuffer = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileBuffer,
    );

    const result = new Uint8Array(
      salt.byteLength + iv.byteLength + encrypted.byteLength,
    );

    result.set(salt, 0);
    result.set(iv, salt.byteLength);
    result.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    return new Blob([result]);
  };

  const handleEncrypt = async () => {
    if (!file || !password || status === "loading") return;

    // ── reset ──
    setStatus("loading");
    setProgress(0);
    setErrMsg("");
    setLog([]);

    addLog(`FILE SELECTED: ${file.name}`, "info");
    addLog(`SIZE: ${fmtBytes(file.size)}`, "info");
    addLog("INITIATING ENCRYPTION REQUEST...", "acc");
    startFakeProgress();

    try {
      if (file.size > MAX_SIZE)
        throw new Error(
          "SELECTED file above the assigned limit, Consider Pro plan...",
        );
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `enc_${file.name}.enc`,
        types: [
          {
            description: "Encrypted file",
            accept: { "application/octat-stream": [".enc"] },
          },
        ],
      });
      const encryptedBlob = await encrypt(file, password);
      const writable = await fileHandle.createWritable();

      await encryptedBlob.stream().pipeTo(writable);

      stopFakeProgress(100);
      addLog(`ENCRYPTED FILE DOWNLOADED: ${file.name}`, "ok");
      addLog("SESSION COMPLETE — KEY NEVER TRANSMITTED", "ok");
      setStatus("done");
    } catch (err) {
      stopFakeProgress(0);
      const msg = err.message || "UNKNOWN ERROR";
      addLog(`ERROR: ${msg}`, "err");
      console.log(err);
      setErrMsg(msg);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword("");
    setStatus("idle");
    setProgress(0);
    setLog([]);
    setErrMsg("");
    clearInterval(progressRef.current);
  };

  const isLoading = status === "loading";
  const isDone = status === "done";
  const isError = status === "error";
  const canRun = !!file && password.length >= 1 && !isLoading;

  return (
    <div className="flex w-full min-h-full items-center">
      <div className="py-8 px-4 max-w-[1200px] w-full mx-auto pb-20">
        {/* Page header */}
        <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-line">
          <div>
            <p
              className="font-mono text-[#252535] mb-1.5"
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
              }}
            >
              MODULE_02 // ENCRYPTION
            </p>
            <h1
              className="font-display font-black text-cyan leading-none mb-2"
              style={{
                fontSize: "clamp(1.4rem,3.5vw,2.2rem)",
                letterSpacing: "0.22em",
              }}
            >
              ENCRYPT DATA
            </h1>
            <p
              className="font-mono text-label leading-[1.9] max-w-[480px]"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
              }}
            >
              AES-256-GCM with PBKDF2-SHA256 key usage. File streams directly to
              your device — nothing stored server-side.
            </p>
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

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[1px] bg-line">
          <div className="bg-surface p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] grad-top-c" />
            <div
              className="absolute bottom-0 right-0 w-[200px] h-[200px] pointer-events-none"
              style={{
                background: `radial-gradient(circle at 100% 100%,rgba(${hexToRgb(ACCENT)},0.06) 0%,transparent 65%)`,
              }}
            />

            <div className="flex flex-col gap-5.5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-mono text-cyan border border-cyan/25 px-1.5 py-0.5"
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
                <DropZone
                  file={file}
                  onFile={setFile}
                  accent={ACCENT}
                  disabled={isLoading}
                />
              </div>

              <div className="h-[1px] bg-surface2" />

              {/* Password / Key */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-mono text-cyan border border-cyan/25 px-1.5 py-0.5"
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
                    SET PASSPHRASE
                  </span>
                </div>
                <KeyInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  accent={ACCENT}
                  disabled={isLoading}
                />
              </div>

              <div className="h-[1px] bg-surface2" />

              {/* Execution section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-cyan border border-cyan/25 px-1.5 py-0.5"
                    style={{
                      fontSize: "0.48rem",
                      letterSpacing: "0.2em",
                    }}
                  >
                    03
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
                          ? "ENCRYPTION COMPLETE"
                          : isError
                            ? "OPERATION FAILED"
                            : "ENCRYPTING..."}
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
                {isDone && (
                  <p className="text-green font-family-mono text-[.72rem] mb-2">
                    File is stored in selected Dir on your system (it will not
                    be showen in downloads)
                  </p>
                )}

                {/* btns */}
                <div className="flex gap-2.5 flex-wrap">
                  {!isDone ? (
                    <button
                      onClick={handleEncrypt}
                      disabled={!canRun}
                      className={`ds-btn ds-btn-outline-c ${canRun ? "pointer-events-auto" : "!pointer-events-none"} `}
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
                        {isLoading ? "ENCRYPTING..." : "ENCRYPT FILE"}
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
                      ↺ ENCRYPT ANOTHER
                    </button>
                  )}

                  {(file || password) && !isLoading && !isDone && (
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
                        ok: !!file,
                        text: file ? `FILE: ${file.name}` : "NO FILE SELECTED",
                      },
                      {
                        ok: password.length >= 8,
                        text:
                          password.length >= 8
                            ? "PASSPHRASE: READY"
                            : password.length > 0
                              ? `PASSPHRASE TOO SHORT (${password.length}/8 chars min)`
                              : "PASSPHRASE NOT SET",
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

          <div className="flex flex-col gap-[1px] bg-line">
            {/* <div className="bg-surface p-6 relative"> */}
            {/*   <div className="absolute top-0 left-0 right-0 h-[1px] grad-top-o" /> */}
            {/*   <p */}
            {/*     className="font-mono text-[#252535] mb-1.5" */}
            {/*     style={{ */}
            {/*       fontSize: "0.48rem", */}
            {/*       letterSpacing: "0.3em", */}
            {/*     }} */}
            {/*   > */}
            {/*     03 // PROTOCOL */}
            {/*   </p> */}
            {/*   <p */}
            {/*     className="font-display font-bold text-orange mb-4" */}
            {/*     style={{ */}
            {/*       fontSize: "0.72rem", */}
            {/*       letterSpacing: "0.2em", */}
            {/*     }} */}
            {/*   > */}
            {/*     HOW IT WORKS */}
            {/*   </p> */}
            {/**/}
            {/*   {[ */}
            {/*     { */}
            {/*       n: "01", */}
            {/*       text: "File is sent as multipart stream to the server", */}
            {/*     }, */}
            {/*     { */}
            {/*       n: "02", */}
            {/*       text: "PBKDF2-SHA256 derives a 256-bit AES key from your passphrase + random 16-byte salt", */}
            {/*     }, */}
            {/*     { */}
            {/*       n: "03", */}
            {/*       text: "Random 12-byte IV is generated for AES-256-GCM cipher", */}
            {/*     }, */}
            {/*     { */}
            {/*       n: "04", */}
            {/*       text: "Encrypted stream flows: SALT → IV → CIPHERTEXT → AUTH_TAG", */}
            {/*     }, */}
            {/*     { */}
            {/*       n: "05", */}
            {/*       text: "Output file downloads as enc_<filename>.enc", */}
            {/*     }, */}
            {/*     { */}
            {/*       n: "06", */}
            {/*       text: "Your passphrase is sent once in x-password header over TLS — never stored", */}
            {/*     }, */}
            {/*   ].map((step) => ( */}
            {/*     <div */}
            {/*       key={step.n} */}
            {/*       className="flex gap-3 pb-2.5 mb-2.5 border-b border-surface2 last:border-0 last:mb-0 last:pb-0" */}
            {/*     > */}
            {/*       <span */}
            {/*         className="font-mono text-orange shrink-0 mt-0.5" */}
            {/*         style={{ */}
            {/*           fontSize: "0.48rem", */}
            {/*           letterSpacing: "0.1em", */}
            {/*         }} */}
            {/*       > */}
            {/*         {step.n} */}
            {/*       </span> */}
            {/*       <span */}
            {/*         className="font-mono text-muted leading-[1.7]" */}
            {/*         style={{ */}
            {/*           fontSize: "0.54rem", */}
            {/*           letterSpacing: "0.06em", */}
            {/*         }} */}
            {/*       > */}
            {/*         {step.text} */}
            {/*       </span> */}
            {/*     </div> */}
            {/*   ))} */}
            {/* </div> */}
            {/**/}
            {/* CIPHER PARAMS */}
            <div className="bg-surface p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-[1px] grad-top-c" />
              <p
                className="font-mono text-[#252535] mb-1.5"
                style={{
                  fontSize: "0.48rem",
                  letterSpacing: "0.3em",
                }}
              >
                04 // SPECS
              </p>
              <p
                className="font-display font-bold text-cyan mb-4"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                }}
              >
                CIPHER PARAMS
              </p>
              <InfoRow label="ALGORITHM" value="AES-256-GCM" color={ACCENT} />
              <InfoRow label="KEY DERIVE" value="PBKDF2-SHA256" />
              <InfoRow label="ITERATIONS" value="100,000" />
              <InfoRow label="KEY SIZE" value="256-BIT" />
              <InfoRow label="SALT" value="16 BYTES (RANDOM)" />
              <InfoRow label="IV" value="12 BYTES (RANDOM)" />
              <InfoRow label="AUTH TAG" value="16 BYTES (GCM)" />
              <InfoRow label="MAX FILE" value={`${fmtBytes(MAX_SIZE)}`} />
              <InfoRow label="OUTPUT" value="enc_<name>.enc" />
              <InfoRow label="SERVER LOGS" value="NONE" color="#00E87A" />
            </div>

            {/* File info , ist only visible when a file is selected */}
            {file && (
              <div className="bg-surface p-6 relative animate-[ds-fadeup_0.25s_ease_both]">
                <div className="absolute top-0 left-0 right-0 h-[1px] grad-top-c" />
                <p
                  className="font-mono text-[#252535] mb-1.5"
                  style={{
                    fontSize: "0.48rem",
                    letterSpacing: "0.3em",
                  }}
                >
                  05 // FILE INTEL
                </p>
                <p
                  className="font-display font-bold text-cyan mb-4"
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.2em",
                  }}
                >
                  SELECTED FILE
                </p>
                <InfoRow
                  label="NAME"
                  value={
                    file.name.length > 22
                      ? file.name.slice(0, 19) + "..."
                      : file.name
                  }
                />
                <InfoRow label="SIZE" value={fmtBytes(file.size)} />
                <InfoRow label="TYPE" value={file.type || "BINARY"} />
                <InfoRow
                  label="EXT"
                  value={`.${file.name.split(".").pop().toUpperCase()}`}
                  color={ACCENT}
                />
                <InfoRow
                  label="MODIFIED"
                  value={new Date(file.lastModified)
                    .toLocaleDateString("en-GB")
                    .toUpperCase()}
                />
              </div>
            )}
          </div>
        </div>

        {/* <div className="border border-line border-t-0 bg-surface px-6 py-4"> */}
        {/*   <div className="flex justify-between items-center mb-3"> */}
        {/*     <div className="flex items-center gap-2.5"> */}
        {/*       <span */}
        {/*         className={`w-1.5 h-1.5 bg-cyan inline-block ${isLoading ? "animate-[ds-pulse_1s_infinite]" : "opacity-40"}`} */}
        {/*       /> */}
        {/*       <span */}
        {/*         className="font-mono text-[#252535]" */}
        {/*         style={{ */}
        {/*           fontSize: "0.52rem", */}
        {/*           letterSpacing: "0.25em", */}
        {/*         }} */}
        {/*       > */}
        {/*         OPERATION LOG */}
        {/*       </span> */}
        {/*     </div> */}
        {/*     {log.length > 0 && !isLoading && ( */}
        {/*       <button */}
        {/*         onClick={() => setLog([])} */}
        {/*         className="font-mono text-[#252535] bg-none border-none cursor-pointer" */}
        {/*         style={{ */}
        {/*           fontSize: "0.48rem", */}
        {/*           letterSpacing: "0.12em", */}
        {/*         }} */}
        {/*       > */}
        {/*         CLEAR */}
        {/*       </button> */}
        {/*     )} */}
        {/*   </div> */}
        {/*   <div className="flex flex-col gap-1.5 min-h-[28px]"> */}
        {/*     {log.length === 0 ? ( */}
        {/*       <span */}
        {/*         className="font-mono text-ghost" */}
        {/*         style={{ */}
        {/*           fontSize: "0.52rem", */}
        {/*           letterSpacing: "0.12em", */}
        {/*         }} */}
        {/*       > */}
        {/*         — AWAITING OPERATION — */}
        {/*       </span> */}
        {/*     ) : ( */}
        {/*       log.map((l, i) => <LogLine key={i} {...l} />) */}
        {/*     )} */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}
