import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccent } from "../features/theme/themeSlice.js";

import Sidebar from "../components/Sidebar.jsx";
import { ChevronRightIcon } from "../svgs/PrimaryIcons.jsx";
import { MODULE_ACCENT } from "../data/dedsecData.js";

const RootLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const activeId = location.pathname.split("/")[1] || "home";
    const accent = MODULE_ACCENT[activeId]?.color || null;
    if (accent) dispatch(setAccent(accent));
  }, [location.pathname, dispatch]);

  return (
    <div className="h-full w-full flex">
      {/* Sidebar for Pc screen Sidebar */}
      <div
        className={`absolute z-[99] top-1/2 transforn -translate-y-1/2 py-1 left-0 bg-orange rounded-full border-solid cursor-pointer ${open ? "hidden" : "absolute"}`}
        onClick={handleOpen}
      >
        <ChevronRightIcon color={"black"} />
      </div>
      {/* =============================== */}

      <Sidebar open={open} handleOpen={handleOpen} />
      <Outlet />
    </div>
  );
};

export default RootLayout;
