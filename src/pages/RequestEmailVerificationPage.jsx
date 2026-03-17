import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRequestEmailVerificationMutation } from "../features/user/userApi.js";

const RequestEmailVerificationPage = () => {
  const [email, setEmail] = useState("");
  const ACCENT = useSelector((state) => state.theme.accent);

  const navigate = useNavigate();

  const [
    requestEmailVerification,
    { data, isLoading, isSuccess, isError, error },
  ] = useRequestEmailVerificationMutation();

  const isEmailValid =
    email.trim().length === 0 ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestEmailVerification(email);
  };

  useEffect(() => {
    let timer;
    if (isSuccess) {
      timer = setTimeout(() => {
        navigate("/login");
      }, 8000);
    }

    return () => clearTimeout(timer);
  }, [isSuccess]);

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
        MODULE // Request_Email
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
        Verify Email
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
        Please Verify Your Email first
      </div>

      <div className="ds-backdrop p-6 min-w-[400px] border border-[#18181f] mt-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div
            className={`ds-field w-full ${isEmailValid ? "" : "focus-within:[&_label]:!text-red-600"}`}
          >
            <p className="text-muted">Enter your email</p>
            <label
              htmlFor="email"
              className={`ds-field-label label ${isEmailValid && "text-orange"}`}
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placehoder="email"
              className="ds-input ds-input-o"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {isSuccess ? (
            <p className="text-label !text-orange">
              {data.message}
              <br />
              <span className="!font-[600] text-[.7rem] block mt-2">
                Verify before logging in. <br />
                Redirecting to Log_IN page...
              </span>
            </p>
          ) : (
            isError && (
              <p className="text-label !text-red-600">{error.data.message}</p>
            )
          )}

          {!isSuccess && (
            <button
              type="submit"
              to={"/login"}
              className={`ds-btn ds-btn-outline-o ${isEmailValid ? "opacity-100 pointer-events-auto" : "opacity-40 pointer-events-none"}`}
            >
              <span>{isLoading ? "Loading..." : "Request"}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestEmailVerificationPage;
