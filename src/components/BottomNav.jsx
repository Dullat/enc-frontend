import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../data/dedsecData.js";
import { hexToRgb } from "../utils/hexToRgb.js";

import { useSelector } from "react-redux";

const BottomNav = ({ open, handleOpen, color = "#FFF" }) => {
  const ACCENT = useSelector((state) => state.theme.accent);
  // const lastScrollY = useRef(0);
  const openRef = useRef(open);
  // const timerRef = useRef(null);

  const location = useLocation();
  // useEffect(() => {
  //   openRef.current = open;
  // }, [open]);
  //
  // useEffect(() => {
  //   const scrollContainer = document.querySelector(".scroll-container");
  //   const target = scrollContainer || window;
  //   const getScrollY = () =>
  //     scrollContainer ? scrollContainer.scrollTop : window.scrollY;
  //
  //   const handleScroll = () => {
  //     const currentScrollY = getScrollY();
  //
  //     if (currentScrollY > lastScrollY.current) {
  //       if (timerRef.current) clearTimeout(timerRef.current);
  //       if (openRef.current) handleOpen("hide");
  //     } else if (currentScrollY < lastScrollY.current) {
  //       if (!openRef.current) handleOpen("show");
  //       setTimer();
  //     }
  //
  //     lastScrollY.current = currentScrollY;
  //   };
  //
  //   const setTimer = () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //     timerRef.current = setTimeout(() => {
  //       if (openRef.current) handleOpen("hide");
  //     }, 4000);
  //   };
  //   target.addEventListener("scroll", handleScroll, { passive: true });
  //
  //   return () => {
  //     if (timerRef.current) clearTimeout(timerRef.current);
  //     target.removeEventListener("scroll", handleScroll);
  //   };
  // }, [location.pathname]);
  return (
    <div
      className="fixed bottom-0 w-full z-[99] bg-surface overflow-hidden transition-all"
      style={{ height: open ? "70px" : "0px" }}
    >
      <nav className="w-full flex items-center h-full border-0 border-t-1 border-t-line">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className="flex flex-col h-full items-center gap-1 flex-1 justify-center"
            style={({ isActive, isPending }) => ({
              background: isActive ? `rgba(${hexToRgb(ACCENT)},.07)` : "",
              borderTop: isActive
                ? `2px solid ${ACCENT}`
                : "2px solid transparent",
            })}
          >
            {({ isActive }) => (
              <div className="flex flex-col gap-1 items-center">
                <item.icon color={isActive ? ACCENT : "#252535"} />
                <p
                  className={`text-label text-[0.45rem]`}
                  style={{ color: isActive ? ACCENT : "" }}
                >
                  {item.label.split("").slice(0, 4).join("")}
                </p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
