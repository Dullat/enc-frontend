import { useState, useEffect } from "react";
import { useGetMeQuery } from "../features/user/userApi.js";
import NotLoggedIn from "../pages/NotLoggedIn.jsx";
import { Link, Outlet } from "react-router-dom";

const useRequireAuth = () => {
  const { data, isLoading, isError } = useGetMeQuery();

  if (isError) return <NotLoggedIn />;
  if (isLoading)
    return (
      <div className="fixed inset-0 z-[999] ds-backdrop flex items-center justify-center">
        <p>Decrypting Session...</p>
      </div>
    );

  return <Outlet />;
};

export default useRequireAuth;
