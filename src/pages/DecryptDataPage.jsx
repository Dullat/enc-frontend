import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery } from "../features/user/userApi.js";
import { setAccent } from "../features/theme/themeSlice.js";
import DropZone from "../components/DropZone.jsx";
import KeyInput from "../components/KeyInput.jsx";

import Dot from "../theme/Dot.jsx";
import InfoRow from "../theme/InfoRow.jsx";

import { hexToRgb } from "../utils/hexToRgb.js";

const ACCENT = "#00E87A"; // green

const fmtBytes = (b) => {
  if (b >= 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(2)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(1)} KB`;
  return `${b} B`;
};

const getOriginalFilename = (encName) => {
  let name = encName; // convert name.ext
  if (name.endsWith(".enc")) name = name.slice(0, -4);
  if (name.startsWith("enc_")) name = name.slice(4);
  return name || "decrypted_file";
};

const DecryptDataPage = () => {
  const { data } = useGetMeQuery();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  const progressRef = useRef(null);

  const startFakeProgress = () => {
    let p = 0;
    progressRef.current = setInterval(() => {
      p = Math.min(p + Math.random() * 8, 90);
      setProgress(Math.round(p));
    }, 300);
  };

  const stopFakeProgress = (final = 100) => {
    clearInterval(progressRef.current);
    setProgress(final);
  };

  const decrypt = async (file, password) => {
    const fileBuffer = await file.arrayBuffer();
    const data = new Uint8Array(fileBuffer);

    // [salt 16B][iv 12B][ciphertext + 16B GCM auth tag], this is what i want to decrypt
    if (data.byteLength < 16 + 12 + 16) {
      throw new Error("INVALID OR CORRUPTED FILE");
    }

    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const ciphertext = data.slice(28); // get GCM tag

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );

    const decrypted = await crypto.subtle.decrypt(
      // this also gonna throw err if pass is wrong , so dont wrry about handling that
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );

    return new Blob([decrypted]);
  };

  const handleDecrypt = async () => {
    if (!file || !password || status === "loading") return;

    setStatus("loading");
    setProgress(0);
    setErrMsg("");
    startFakeProgress();

    try {
      if (!file.name.endsWith(".enc")) {
        throw new Error("FILE DOES NOT APPEAR TO BE AN .enc FILE");
      }

      const fileHandle = await window.showSaveFilePicker({
        suggestedName: getOriginalFilename(file.name),
      });

      const decryptedBlob = await decrypt(file, password);

      const writable = await fileHandle.createWritable();
      await decryptedBlob.stream().pipeTo(writable);

      stopFakeProgress(100);
      setStatus("done");
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      stopFakeProgress(0);

      // here it set wrong password
      const msg =
        err.name === "OperationError"
          ? "DECRYPTION FAILED — WRONG PASSPHRASE OR CORRUPTED FILE"
          : err.message || "UNKNOWN ERROR";

      setErrMsg(msg);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword("");
    setStatus("idle");
    setProgress(0);
    setErrMsg("");
    clearInterval(progressRef.current);
  };

  const isLoading = status === "loading";
  const isDone = status === "done";
  const isError = status === "error";
  const canRun = !!file && password.length >= 1 && !isLoading;

  useEffect(() => {
    dispatch(setAccent(ACCENT));
  }, [dispatch]);

  return (
    <div className="flex w-full min-h-full items-center">
      <div className="py-8 px-4 max-w-[1200px] w-full mx-auto pb-20">
        {/* Page header */}
        <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-line">
          <div>
            <p
              className="font-mono text-[#252535] mb-1.5"
              style={{ fontSize: "0.52rem", letterSpacing: "0.35em" }}
            >
              MODULE_02 // DECRYPTION
            </p>
            <h1
              className="font-display font-black text-green leading-none mb-2"
              style={{
                fontSize: "clamp(1.4rem,3vw,2.2rem)",
                letterSpacing: "0.22em",
                color: ACCENT,
              }}
            >
              DECRYPT DATA
            </h1>
            <p
              className="font-mono text-label leading-[1.9] max-w-[480px]"
              style={{ fontSize: "0.6rem", letterSpacing: "0.06em" }}
            >
              AES-256-GCM decryption with PBKDF2-SHA256 key. Decryption runs
              entirely in your browser. Nothing leaves your device.
            </p>
            <Link
              to="/encryption/encrypt"
              className="text-seq text-[.5rem] opacity-60"
            >
              Wanna Encrypt files?{" "}
              <span className="text-magenta">Click here</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-col gap-1.5 items-end">
            {[
              { label: "ENGINE", ok: true },
              { label: "CLIENT-SIDE", ok: true },
              { label: "SERVER STORAGE", ok: false },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <span
                  className="font-mono text-[#252535]"
                  style={{ fontSize: "0.5rem", letterSpacing: "0.18em" }}
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
            <div className="absolute top-0 left-0 right-0 h-[1px] grad-top-g" />
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
                    className="font-mono border px-1.5 py-0.5"
                    style={{
                      fontSize: "0.48rem",
                      letterSpacing: "0.2em",
                      color: ACCENT,
                      borderColor: `rgba(${hexToRgb(ACCENT)},0.25)`,
                    }}
                  >
                    01
                  </span>
                  <span
                    className="font-display font-bold text-ds-white"
                    style={{ fontSize: "0.7rem", letterSpacing: "0.22em" }}
                  >
                    SELECT ENCRYPTED FILE
                  </span>
                </div>
                <DropZone
                  file={file}
                  onFile={setFile}
                  accent={ACCENT}
                  disabled={isLoading}
                  accept=".enc"
                />
              </div>

              <div className="h-[1px] bg-surface2" />

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-mono border px-1.5 py-0.5"
                    style={{
                      fontSize: "0.48rem",
                      letterSpacing: "0.2em",
                      color: ACCENT,
                      borderColor: `rgba(${hexToRgb(ACCENT)},0.25)`,
                    }}
                  >
                    02
                  </span>
                  <span
                    className="font-display font-bold text-ds-white"
                    style={{ fontSize: "0.7rem", letterSpacing: "0.22em" }}
                  >
                    ENTER PASSPHRASE
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

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono border px-1.5 py-0.5"
                    style={{
                      fontSize: "0.48rem",
                      letterSpacing: "0.2em",
                      color: ACCENT,
                      borderColor: `rgba(${hexToRgb(ACCENT)},0.25)`,
                    }}
                  >
                    03
                  </span>
                  <span
                    className="font-display font-bold text-ds-white"
                    style={{ fontSize: "0.7rem", letterSpacing: "0.22em" }}
                  >
                    EXECUTE
                  </span>
                </div>

                {(isLoading || isDone || isError) && (
                  <div className="mb-4">
                    <div className="flex justify-between font-mono mb-1.5">
                      <span
                        className="flex items-center gap-2 text-muted"
                        style={{ fontSize: "0.52rem", letterSpacing: "0.18em" }}
                      >
                        <Dot ok={!isError} pulse={isLoading} />
                        {isDone
                          ? "DECRYPTION COMPLETE"
                          : isError
                            ? "OPERATION FAILED"
                            : "DECRYPTING..."}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.52rem",
                          letterSpacing: "0.18em",
                          color: isDone ? ACCENT : isError ? "#FF0066" : ACCENT,
                        }}
                      >
                        {isDone ? "100%" : isError ? "ERR" : `${progress}%`}
                      </span>
                    </div>
                    <div className="ds-track">
                      <div
                        className={`h-full transition-all duration-350 relative overflow-hidden ${
                          isDone ? "" : isError ? "bg-magenta" : ""
                        }`}
                        style={{
                          width: isDone ? "100%" : `${progress}%`,
                          background: isDone
                            ? ACCENT
                            : isError
                              ? "#FF0066"
                              : ACCENT,
                        }}
                      >
                        {isLoading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[ds-shimmer_1.5s_infinite]" />
                        )}
                      </div>
                    </div>
                    {isError && errMsg && (
                      <p
                        className="font-mono text-magenta mt-2"
                        style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}
                      >
                        {errMsg}
                      </p>
                    )}
                  </div>
                )}

                {isDone && (
                  <p
                    className="font-mono mb-2"
                    style={{ fontSize: "0.72rem", color: ACCENT }}
                  >
                    File saved to selected directory on your system.
                  </p>
                )}

                {/* bttns */}
                <div className="flex gap-2.5 flex-wrap">
                  {!isDone ? (
                    <button
                      onClick={handleDecrypt}
                      disabled={!canRun}
                      className={`ds-btn ${canRun ? "pointer-events-auto" : "!pointer-events-none"}`}
                      style={{
                        padding: "0.85rem 2rem",
                        cursor: canRun ? "pointer" : "not-allowed",
                        opacity: canRun ? 1 : 0.35,
                        border: `1px solid rgba(${hexToRgb(ACCENT)},0.5)`,
                        color: ACCENT,
                        background: isLoading
                          ? `rgba(${hexToRgb(ACCENT)},0.08)`
                          : "transparent",
                      }}
                    >
                      <span>
                        {isLoading ? "DECRYPTING..." : "DECRYPT FILE"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="ds-btn"
                      style={{
                        padding: "0.85rem 2rem",
                        border: `1px solid ${ACCENT}`,
                        color: ACCENT,
                      }}
                    >
                      ↺ DECRYPT ANOTHER
                    </button>
                  )}

                  {(file || password) && !isLoading && !isDone && (
                    <button
                      onClick={handleReset}
                      className="ds-btn ds-btn-ghost"
                      style={{ padding: "0.85rem 1.2rem" }}
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
                        ok: password.length >= 1,
                        text:
                          password.length >= 1
                            ? "PASSPHRASE: READY"
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

          {/* Right side */}
          <div className="flex flex-col gap-[1px] bg-line">
            {file && (
              <div className="bg-surface p-6 relative animate-[ds-fadeup_0.25s_ease_both]">
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
                  }}
                />
                <p
                  className="font-mono text-[#252535] mb-1.5"
                  style={{ fontSize: "0.48rem", letterSpacing: "0.3em" }}
                >
                  05 // FILE INTEL
                </p>
                <p
                  className="font-display font-bold mb-4"
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.2em",
                    color: ACCENT,
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
                  label="OUTPUT"
                  value={getOriginalFilename(file.name)}
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
            <div className="bg-surface p-6 relative">
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
                }}
              />
              <p
                className="font-mono text-[#252535] mb-1.5"
                style={{ fontSize: "0.48rem", letterSpacing: "0.3em" }}
              >
                04 // SPECS
              </p>
              <p
                className="font-display font-bold mb-4"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  color: ACCENT,
                }}
              >
                CIPHER PARAMS
              </p>
              <InfoRow label="ALGORITHM" value="AES-256-GCM" color={ACCENT} />
              <InfoRow label="KEY DERIVE" value="PBKDF2-SHA256" />
              <InfoRow label="ITERATIONS" value="100,000" />
              <InfoRow label="KEY SIZE" value="256-BIT" />
              <InfoRow label="SALT" value="16 BYTES (READ)" />
              <InfoRow label="IV" value="12 BYTES (READ)" />
              <InfoRow label="AUTH TAG" value="VERIFIED (GCM)" />
              <InfoRow label="ACCEPTS" value="*.enc FILES" />
              <InfoRow label="SERVER LOGS" value="NONE" color={ACCENT} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecryptDataPage;
