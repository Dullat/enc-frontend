import { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import DedsecBackground from "../theme/DedsecBackground.jsx";
import { DedsecLogo } from "../svgs/DedsecLogo.jsx";
import { useLoginMutation } from "../features/user/userApi.js";

const LoginPage = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = await formData.get("email");
    const password = await formData.get("password");

    try {
      const user = await login({ email, password }).unwrap();
      navigate("/profile");
    } catch (error) {}
  };
  return (
    <DedsecBackground glowRadius={120} glowStr={0.5}>
      <div
        className={`relative w-full min-h-dvh flex items-center justify-center px-4`}
      >
        <Form
          onSubmit={handleSubmit}
          className="ds-card py-8 px-6 md:px-8 flex flex-col gap-6 w-full max-w-[500px]"
        >
          <div className="hud-tl" />
          <div className="hud-tr" />
          <div className="hud-br" />
          <div className="hud-bl" />

          <div className="w-full">
            <div className="text-seq text-[.56rem] flex items-center justify-between">
              <p>SEQ:0X0021 // LOG_IN MODULE</p>
              <p className="ds-badge ds-badge-live ds-badge-o outline-none border-0 hidden sm:flex">
                AWAITING INPUT
              </p>
            </div>
            <div className="ds-divider w-full mt-1"></div>
          </div>

          <div className="flex items-center gap-4">
            <DedsecLogo size={40} />
            <div className="text-[clamp(.8rem,3vw,1.2rem)]">
              <h1 className="text-display-md font-[900] text-[1em]">DULLAT</h1>
              <div className="text-seq text-center text-[.5em] text-start">
                Welcome to ENCRYPTION NETWORK CORP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-display-sm text-orange mb-1 text-start font-famil-display">
            <p className="text-seq text-[.7rem]">OPERATION: </p>
            <p className="text-seq text-[.7rem] text-orange opacity-80">
              LOG_IN
            </p>
            <div className="ds-divider w-full ml-2 h-[2px]"></div>
          </div>
          <div className="ds-field">
            <label htmlFor="email" className="ds-field-label">
              Email
            </label>
            <input type="text" name="email" className="ds-input" />
            <div className="ds-divider h-[2px]"></div>
          </div>
          <div className="ds-field">
            <label htmlFor="password" className="ds-field-label">
              Password
            </label>
            <input type="password" name="password" className="ds-input" />
          </div>
          <button
            type="submit"
            className="ds-scanlines !relative ds-btn ds-btn-outline-o"
          >
            <span>submit</span>
          </button>
          <div className="flex flex-col">
            <div className="ds-divider mb-3"></div>
            <div
              className={`flex justify-between text-seq text-ui-sm text-[.58rem]`}
            >
              <p>DON'T HAVE AN ACCOUNT?</p>
              <Link
                to="/register"
                className="text-orange sm:text-muted hover:text-orange"
              >
                SING_UP
              </Link>
            </div>
            <Link
              to="/"
              className={`ml-auto flex justify-between text-seq text-ui-sm text-[.58rem] mt-2 text-orange sm:text-muted hover:text-orange`}
            >
              ABORT_MISSION
            </Link>
          </div>
        </Form>
      </div>
    </DedsecBackground>
  );
};

export default LoginPage;
