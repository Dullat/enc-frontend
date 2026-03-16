import { useForgetPassMutation } from "../features/user/userApi.js";

const ForgetPassword = ({ email, setModal }) => {
  const [forgetPass, { isLoading, isError, error }] = useForgetPassMutation();

  const handleForgetPass = () => {
    try {
      forgetPass(email).unwrap();
    } catch (err) {}
  };
  return (
    <div className="fixed inset-0 z-[999] p-4 !h-dvh flex items-center ds-backdrop z-[2] !backdrop-blur-[2px]">
      <div className="ds-card p-6 py-8 max-w-[600px] m-auto">
        <div className="hud-tr hud-color-o"></div>
        <div className="hud-tl hud-color-o"></div>
        <div className="hud-br hud-color-o"></div>
        <div className="hud-bl hud-color-o"></div>
        <h2 className="text-display-sm text-orange mb-4">Reset_PASS</h2>
        <p
          className="font-family-mono text-[.62rem] mb-6"
          style={{
            letterSpacing: "0.06em",
            color: "#44445A",
            lineHeight: 1.9,
          }}
        >
          <span className="text-orange">
            A Reset-password link will be sent to your email, will be valid for
            5 mins.
          </span>
          <br />
          This action will{" "}
          <span className="text-gold">
            log you out from this session. and by reseting pass you will be
            logged out from all the sessions.
          </span>{" "}
          Are you sure, you want to Reset-password ?
          <br />
          {isError && (
            <span className="text-label text-red-700">
              Error: {error.data.message}
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleForgetPass}
            className={`ds-btn ds-btn-outline-o`}
          >
            <span>{isLoading ? "Sending..." : "SEND_MAIL"}</span>
          </button>
          <button onClick={() => setModal("")} className="ds-btn">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
