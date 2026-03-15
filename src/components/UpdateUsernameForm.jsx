import { useState, useRef } from "react";
import { useUpdateUsernameMutation } from "../features/user/userApi.js";
import { Link, Form } from "react-router-dom";

const UpdateUsernameForm = ({ username }) => {
  const [disabled, setDisabled] = useState(true);
  const [updateUsername, { isLoading, isError, error }] =
    useUpdateUsernameMutation();

  const inputRef = useRef(null);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const username = await formData.get("username");
      await updateUsername(username).unwrap();
      inputRef.current.value = "";
      setDisabled(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleUpdateUsername} className="flex flex-col gap-4">
      <div className="ds-field focus-within:[&_.label-inner]:!text-gold">
        <label className="ds-field-label label-inner" htmlFor="username">
          USER_NAME
        </label>
        <input
          ref={inputRef}
          type="text"
          id="username"
          name="username"
          placeholder={username}
          className="ds-input !ds-input-g"
          onChange={(e) => setDisabled(e.target.value.length === 0)}
        />
      </div>
      <button
        type="submit"
        className={`ds-btn ds-btn-outline-g ${disabled ? "pointer-events-none opacity-40" : ""}`}
        disabled={disabled}
      >
        <span>{isLoading ? "UPDATING..." : "SAVE_CHANGE"}</span>
      </button>
    </Form>
  );
};

export default UpdateUsernameForm;
