import { useState, useEffect, useRef } from "react";
import { Form, Link } from "react-router-dom";
import { DedsecLogo } from "../svgs/DedsecLogo.jsx";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isNameValid =
    name.trim().length === 0
      ? null
      : name.trim().length >= 4 && name.trim().length <= 8;

  const isEmailValid =
    email.trim().length === 0 ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPassLength =
    password.trim().length >= 4 && password.trim().length <= 32;

  const isPassDigit = /[0-9]/.test(password);

  const isPassUpper = /[A-Z]/.test(password);

  const isPassSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(password);

  const isPassValid =
    password.trim().length === 0
      ? null
      : isPassSymbol && isPassLength && isPassUpper && isPassDigit;

  const isPassMatch =
    confirm.trim().length === 0 ? null : confirm.trim() === password.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      isNameValid &&
      isPassValid &&
      isEmailValid &&
      isPassValid &&
      isPassMatch
    ) {
      console.log("logging in");
    }
  };
  return (
    <div className={`flex items-center justify-center min-h-dvh p-4`}>
      <Form
        onSubmit={handleSubmit}
        className="relative ds-card px-8 py-10 flex flex-col gap-4 w-full max-w-[500px]"
      >
        <div className="hud-tl" />
        <div className="hud-tr" />
        <div className="hud-br" />
        <div className="hud-bl" />

        <div className="w-full">
          <div className="text-seq text-[.56rem] flex items-center justify-between">
            <p>SEQ:0X0021 // REGISTER MODULE</p>
            <p className="ds-badge ds-badge-live ds-badge-o outline-none border-0 hidden sm:flex">
              AWAITING INPUT
            </p>
          </div>
          <div className="ds-divider w-full mt-1"></div>
        </div>

        <div className="flex items-center gap-4">
          <DedsecLogo size={40} />
          <div className="text-[clamp(.8rem,3vw,1.2rem)]">
            <h1 className="text-display-md font-[900] text-[1em]">REGISTER</h1>
            <div className="text-seq text-center text-[.5em] text-start">
              Welcome to ENCRYPTION NETWORK CORP
            </div>
          </div>
        </div>
        <div className="ds-field">
          <label
            htmlFor="name"
            className={`ds-field-label ${isNameValid === null ? "text-muted" : isNameValid ? "text-orange" : "!text-red-600"}`}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className={`ds-input-o ds-input`}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="ds-field">
          <label
            htmlFor="email"
            className={`ds-field-label ${isEmailValid === null ? "text-muted" : isEmailValid ? "text-orange" : "!text-red-600"}`}
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            value={email}
            className={`ds-input ds-input-o`}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="ds-field">
          <label
            htmlFor="password"
            className={`ds-field-label ${isPassValid === null ? "text-muted" : isPassValid ? "text-orange" : "!text-red-600"}`}
          >
            Password
          </label>
          <input
            type={`password`}
            name="password"
            value={password}
            className={`ds-input ds-input-o`}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p
                className={`text-seq !text-[0.56rem] ${isPassLength ? "text-orange" : "!text-muted"}`}
              >
                8/32-CHAR
              </p>
              <p
                className={`text-seq !text-[0.56rem] ${isPassDigit ? "text-orange" : "!text-muted"}`}
              >
                1-Digit
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-seq !text-[0.56rem] ${isPassSymbol ? "text-orange" : "!text-muted"}`}
              >
                1-SYMBOL
              </p>
              <p
                className={`text-seq !text-[0.56rem] ${isPassUpper ? "text-orange" : "!text-muted"}`}
              >
                1-UPPER
              </p>
            </div>
          </div>
        </div>
        <div className="ds-field">
          <label
            htmlFor="password"
            className={`ds-field-label ${isPassMatch === null ? "text-muted" : isPassMatch ? "text-orange" : "!text-red-600"}`}
          >
            Confirm
          </label>
          <input
            type={`password`}
            name="confirm"
            value={confirm}
            className={`ds-input ds-input-o`}
            onChange={(e) => setConfirm(e.currentTarget.value)}
          />
        </div>
        <button type="submit" className="ds-btn ds-btn-outline-o">
          <span>SUBMIT</span>
        </button>
        <div className="flex flex-col">
          <div className="ds-divider mb-3"></div>
          <div
            className={`flex justify-between text-seq text-ui-sm text-[.58rem]`}
          >
            <p>ALREADY HAVE AN ACCOUNT?</p>
            <Link
              to="/login"
              className="text-orange sm:text-muted hover:text-orange"
            >
              SING_IN
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
  );
};

export default RegisterPage;
