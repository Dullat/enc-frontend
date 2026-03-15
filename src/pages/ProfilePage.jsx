import { useState, useEffect } from "react";
import { useGetMeQuery, useLogoutMutation } from "../features/user/userApi.js";
import { Link } from "react-router-dom";
import { DedsecLogo } from "../svgs/DedsecLogo.jsx";
import NotLoggedIn from "./NotLoggedIn.jsx";
import UpdateUsernameForm from "../components/UpdateUsernameForm.jsx";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const [modal, setModal] = useState(""); // logout, delete modals
  const ACCENT = useSelector((state) => state.theme.accent);

  const { data, isLoading, isError } = useGetMeQuery();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  const [deleteWord, setDeleteWord] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("logging out");
      const res = await logout().unwrap();
      console.log(res, "logout seccessfull");
      setModal("");
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteAccount = () => {};

  useEffect(() => {
    deleteWord === "delete" && setConfirmDelete(true);
  }, [deleteWord]);

  if (!data?.user || isError) return <NotLoggedIn />;

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      {/* logout */}
      {modal === "logout" && (
        <div className="fixed inset-0 z-[999] p-4 !h-dvh flex items-center ds-backdrop z-[2] !backdrop-blur-[2px]">
          <div className="ds-card p-6 py-8 max-w-[600px] m-auto">
            <div className="hud-tr hud-color-g"></div>
            <div className="hud-tl hud-color-g"></div>
            <div className="hud-br hud-color-g"></div>
            <div className="hud-bl hud-color-g"></div>
            <h2 className="text-display-sm text-gold mb-4">LOGOUT</h2>
            <p
              className="font-family-mono text-[.62rem] mb-6"
              style={{
                letterSpacing: "0.06em",
                color: "#44445A",
                lineHeight: 1.9,
              }}
            >
              This action will{" "}
              <span className="text-gold">log you out from this session.</span>{" "}
              are you sure, you want to log_out ?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className={`ds-btn ds-btn-outline-g`}
              >
                <span>{logoutLoading ? "Loggin_Out..." : "LOG_OUT"}</span>
              </button>
              <button onClick={() => setModal("")} className="ds-btn">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete modal */}
      {modal === "delete" && (
        <div className="fixed inset-0 p-4 z-[999] !h-dvh flex items-center top-0 ds-backdrop z-[2] !backdrop-blur-[2px]">
          <div className="ds-card p-6 py-8 max-w-[600px] m-auto">
            <div className="hud-tr hud-color-m"></div>
            <div className="hud-tl hud-color-m"></div>
            <div className="hud-br hud-color-m"></div>
            <div className="hud-bl hud-color-m"></div>
            <h2 className="text-display-sm text-magenta mb-4">
              DELETE ACCOUNT
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.06em",
                color: "#44445A",
                lineHeight: 1.9,
                marginBottom: "0.5rem",
              }}
            >
              This action is{" "}
              <span className="text-magenta">permanent and irreversible.</span>{" "}
              All files, keys, channels and account data will be wiped from all
              nodes.
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                color: "#44445A",
                marginBottom: "1.2rem",
              }}
            >
              TYPE YOUR USERNAME TO CONFIRM:
            </p>
            <div className="ds-field focus-within:[&_.delete-class]:!text-magenta">
              <label
                className="ds-field-label delete-class"
                htmlFor="deleteWord"
              >
                Conform Delete
              </label>
              <input
                type="text"
                id="deleteWord"
                name="deleteWord"
                value={deleteWord}
                onChange={(e) => setDeleteWord(e.target.value)}
                className="ds-input !ds-input-m"
              />
            </div>
            <div
              style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem" }}
            >
              <button
                onClick={handleDeleteAccount}
                disabled={deleteWord !== "delete"}
                className={`ds-btn ds-btn-outline-m ${deleteWord === "delete" ? "opacity-100" : "opacity-30 pointer-events-none"}`}
              >
                <span>DELETE</span>
              </button>
              <button
                onClick={() => {
                  setModal(null);
                  setDeleteWord("");
                }}
                className="ds-btn"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =================== */}
      <div className="max-w-[1200px] w-full m-auto ">
        <p className="text-label mb-2">MODULE_05 // PROFILE</p>
        <div className="flex items-center gap-2 mb-6">
          <DedsecLogo color={ACCENT} size={60} />
          <div className="">
            <p
              className="text-display-sm text-[clamp(1rem,2vw,1.3rem)]"
              style={{ color: ACCENT }}
            >
              {data.user.username}
            </p>
            <div className="flex items-center gap-2">
              {/* <div className="ds-badge ds-badge-g py-[.2rem] px-[.4rem]"> */}
              {/*   ADMIN */}
              {/* </div> */}
              <div className="ds-badge ds-badge-g py-[.2rem] px-[.4rem]">
                FREE_PLAN
              </div>
              <div className="ds-badge ds-badge-green py-[.2rem] px-[.4rem]">
                VERIFIED
              </div>
            </div>
          </div>
        </div>
        <div className="ds-divider w-full mb-6"></div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <div className=" relative backdrop-blur-sm border border-[#18181f] ds-backdrop px-6 py-6 flex-1">
              <p className="text-label ">01 // IDENTITY</p>
              <h1
                className="text-display-sm !text-mono mb-4"
                style={{ color: ACCENT }}
              >
                OPERATOR DOSSIER
              </h1>

              <div className="flex flex-col w-full items-center gap-3">
                <div className="flex items-center justify-between w-full">
                  <p className="text-label">USER_NAME</p>
                  <p className="text-label">{data.user.username}</p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-label">EMAIL</p>
                  <p className="text-label">{data.user.email}</p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-label">JOINED</p>
                  <p className="text-label">
                    {new Date(data.user.createdAt).toISOString().split("T")[0]}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-label">LAST_UPDATED</p>
                  <p className="text-label">
                    {new Date(data.user.updatedAt).toISOString().split("T")[0]}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-label">AUTH METHOD</p>
                  <p className="text-label">
                    {data.user.loginMethods.join("/")}
                  </p>
                </div>
                {/* <div className="flex items-center justify-between w-full"> */}
                {/*   <p className="text-label">EMPTY</p> */}
                {/*   <p className="text-label">EMPTY</p> */}
                {/* </div> */}
              </div>
            </div>
            <div className="flex-1 ds-backdrop border border-[#18181f] px-6 py-6 flex-1">
              <div className="text-display-sm mb-4">
                <p className="text-label">03 // management</p>
                <p style={{ color: ACCENT }}>EDIT PROFILE</p>
              </div>
              <UpdateUsernameForm username={data.user.username} />
            </div>
          </div>
          <div className="flex flex-col flex-wrap w-full ds-backdrop border border-[#18181f] p-6">
            <div className="overflow-hidden">
              <p className="text-label">03 // SECURITY</p>
              <p className="text-display-sm mb-4" style={{ color: ACCENT }}>
                SECURITY CONTROLLS
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap ">
                <div>
                  <div className="text-label !text-white !text-[.65rem]">
                    CREDENTIAL // PASSWORD
                  </div>
                  <p className="text-label block">THROUGH EMAIL</p>
                </div>
                <button className="ds-btn ds-btn-outline-o !py-[.5rem] !px-[1rem]">
                  <span>RESET_PASS</span>
                </button>
              </div>
              <div className="flex items-center justify-between flex-wrap ">
                <div>
                  <div className="text-label !text-white !text-[.65rem]">
                    log_out
                  </div>
                  <p className="text-label block">Destroy session</p>
                </div>
                <button
                  className="ds-btn ds-btn-outline-g !py-[.5rem] !px-[1rem]"
                  onClick={() => setModal("logout")}
                >
                  <span>Log_out</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 ds-backdrop border border-[#18181f] p-6 w-full">
            <div className="flex flex-col max-w-[700px]">
              <p className="text-label text-magenta opacity-40">
                04 // Danger_Zone
              </p>
              <h3 className="text-display-sm text-magenta">
                TERMINATE ACCOUNT
              </h3>
              <p className="text-magenta font-family-mono text-[.65rem]">
                Permanently delete this operator account. All files, encryption
                keys, and active channels will be wiped from all nodes.{" "}
                <b>This action cannot be undone.</b>
              </p>
            </div>
            <button
              className="ds-btn ds-btn-outline-m min-w-[9rem] py-[.5rem]"
              onClick={() => setModal("delete")}
            >
              <span>DELETE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
