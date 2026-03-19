import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const EncryptionPage = () => {
  const ACCENT = useSelector((state) => state.theme.accent);
  return (
    <div
      className="flex flex-col w-full p-3 sm:p-6 pb-20"
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col max-w-[1200px] m-auto gap-10">
        <div className="flex flex-row w-full gap-4">
          <div className="flex-1">
            <p className="text-seq">MODULE // ENCRYPTION</p>
            <div
              className="text-display-md text-[clamp(1.5rem,3vw,1.7rem)] font-[900]"
              style={{ color: ACCENT }}
            >
              ENCRYPTION
            </div>

            <p className="text-seq">
              Military-grade file encryption. AES-256-GCM with PBKDF2 key
              derivation
            </p>
          </div>
          <div className="flex flex-col justify-end items-end hidden sm:flex">
            <p className="text-seq">ENC ENGINE</p>
            <p className="text-seq">ALGO:SHA-256-GCM</p>
            <p className="text-seq">
              MODE:<span className="text-orange opacity-30">STREAM</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
          <div className="flex flex-col gap-2 flex-1 ds-card p-4 grad-corner-c">
            <div>
              <p className="text-seq">01 // ENCRYPTION</p>
              <div className="text-display-sm !text-[1.1rem] text-cyan">
                ENCRYPT DATA
              </div>
            </div>
            <p className="text-pera">
              Encrypt your data with SHA-256-GCM. You will be setting a
              password(key). <br />
              All the enc files are directly encrypted on client, noting is sent
              to server
            </p>
            <div className="text-pera mb-3">
              For more info: <span className="text-magenta ">read Docs</span>
            </div>

            <div className="flex flex-wrap">
              <Link
                to="/encryption/encrypt"
                className="ds-btn ds-btn-outline-c"
              >
                <span>ENCRYPT</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 ds-card p-4 grad-corner-m">
            <div>
              <p className="text-seq">01 // DECRYPTION</p>
              <div className="text-display-sm !text-[1.1rem] text-magenta">
                DECRYPT DATA
              </div>
            </div>
            <p className="text-pera">
              Decrypt your data with SHA-256-GCM. You will be requiring a
              password(key). <br />
              All the enc files are directly decrypted on client, noting is sent
              to server
            </p>
            <div className="text-pera mb-3">
              For more info: <span className="text-magenta ">read Docs</span>
            </div>

            <div className="flex flex-wrap">
              <Link
                to="/encryption/decrypt"
                className="ds-btn ds-btn-outline-m"
              >
                <span>DECRYPT</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncryptionPage;
