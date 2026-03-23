import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CompressionPage = () => {
  const ACCENT = useSelector((state) => state.theme.accent);
  return (
    <div
      className="flex flex-col w-full p-3 sm:p-6 pb-20"
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col max-w-[1200px] m-auto gap-10">
        <div className="flex flex-row w-full gap-4">
          <div className="flex-1">
            <p className="text-seq">MODULE // COMPRESSION</p>
            <div
              className="text-display-md text-[clamp(1.5rem,3vw,1.7rem)] font-[900]"
              style={{ color: ACCENT }}
            >
              COMPRESSION
            </div>

            <p className="text-seq">
              File Compression with different levels. Create .zip files
            </p>
          </div>
          <div className="flex flex-col justify-end items-end hidden sm:flex">
            <p className="text-seq">Comp EnGINE</p>
            <p className="text-seq">METHOD: FFLATE</p>
            <p className="text-seq">
              MODE:<span className="text-orange opacity-30">ZIP</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
          <div className="flex flex-col gap-2 flex-1 ds-card p-4 grad-corner-c">
            <div>
              <p className="text-seq">01 // COMPRESSION</p>
              <div className="text-display-sm !text-[1.1rem] text-yellow">
                ZIP DATA
              </div>
            </div>
            <p className="text-pera">
              Create ZIP files by selecting one or more files. <br />
              All the files are zipped on client side, noting is sent to server
            </p>
            <div className="text-pera mb-3">
              For more info: <span className="text-magenta ">read Docs</span>
            </div>

            <div className="flex flex-wrap">
              <Link to="zip" className="ds-btn ds-btn-outline-y">
                <span>ZIP_FILES</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 ds-card p-4 grad-corner-m">
            <div>
              <p className="text-seq">02 // DECOMPRESS</p>
              <div className="text-display-sm !text-[1.1rem] text-green">
                UNZIP DATA
              </div>
            </div>
            <p className="text-pera">
              Exract ZIP files by selecting files. <br />
              All the files are extracted on client side, noting is sent to
              server
            </p>
            <div className="text-pera mb-3">
              For more info: <span className="text-magenta ">read Docs</span>
            </div>

            <div className="flex flex-wrap">
              <Link to="unzip" className="ds-btn ds-btn-outline-green">
                <span>UNZIP_FILE</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressionPage;
