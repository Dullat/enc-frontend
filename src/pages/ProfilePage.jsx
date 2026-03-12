import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const ACCENT = useSelector((state) => state.theme.accent);
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.35em",
          color: "#252535",
          marginBottom: "1rem",
        }}
      >
        MODULE // PROFILE
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 900,
          letterSpacing: "0.2em",
          color: ACCENT,
        }}
      >
        PROFILE
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "#44445A",
          marginTop: "1rem",
        }}
      >
        MODULE UNDER CONSTRUCTION // BUILD v0.0.1
      </div>
      <Link
        to={"/"}
        style={{
          marginTop: "2rem",
          fontFamily: "var(--font-display)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          padding: "0.7rem 1.6rem",
          background: "transparent",
          border: `1px solid ${ACCENT}`,
          color: ACCENT,
          cursor: "pointer",
        }}
      >
        ← BACK TO HOME
      </Link>
    </div>
  );
};

export default ProfilePage;
