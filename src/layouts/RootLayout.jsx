import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccent } from "../features/theme/themeSlice.js";
import { useGetMeQuery } from "../features/user/userApi.js";

import Sidebar from "../components/Sidebar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import useIsMobile from "../hooks/useIsMobile.jsx";
import { ChevronRightIcon } from "../svgs/PrimaryIcons.jsx";
import { MODULE_ACCENT } from "../data/dedsecData.js";

const RootLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const ACCENT = useSelector((state) => state.theme.accent);

  const { data, isLoading } = useGetMeQuery();

  const [open, setOpen] = useState(true);
  const handleOpen = useCallback((action) => {
    if (action === "toggle") setOpen((prev) => !prev);
    if (action === "hide") setOpen(false);
    if (action === "show") setOpen(true);
  }, []);

  useEffect(() => {
    const activeId = location.pathname.split("/")[1] || "home";
    const accent = MODULE_ACCENT[activeId]?.color || null;
    if (accent) dispatch(setAccent(accent));
  }, [location.pathname, dispatch]);

  return (
    <div className="relative h-full w-full flex">
      {isLoading && (
        <div className="fixed inset-0 z-[999] ds-backdrop flex items-center justify-center">
          <p>Loading..</p>
        </div>
      )}
      {/* Sidebar for Pc screen Sidebar */}
      {!open && (
        <div
          className={`py-1 z-[4] transition-all rounded-full border-solid cursor-pointer ${isMobile ? "fixed bottom-0 left-1/2 transform -translate-x-1/2 -rotate-90" : "absolute top-1/2 transforn -translate-y-1/2 left-0"}`}
          style={{ background: ACCENT }}
          onClick={() => handleOpen("show")}
        >
          <ChevronRightIcon color={"black"} />
        </div>
      )}
      {isMobile ? (
        <BottomNav open={open} handleOpen={handleOpen} />
      ) : (
        <div className="flex-1 z-[5] hidden sm:flex">
          <Sidebar open={open} handleOpen={handleOpen} />
        </div>
      )}

      {/* =============================== */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
