import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setAccent } from "../features/theme/themeSlice.js";

import { CloseIcon } from "../svgs/PrimaryIcons.jsx";
import { DedsecLogo } from "../svgs/DedsecLogo.jsx";

import { NAV_ITEMS, MODULE_ACCENT } from "../data/dedsecData.js";
import { hexToRgb } from "../utils/hexToRgb.js";

const Sidebar = ({ open, handleOpen, color = "orange" }) => {
  const dispatch = useDispatch();
  const ACCENT = useSelector((state) => state.theme.accent);

  return (
    <div
      className={`bg-surface border-0 border-r-[1px] border-r-line top-0 sticky sm:sticky ${
        open ? "w-[280px]" : "w-[0px]"
      } h-dvh transition-all duration-300 overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 z-[99] border-solid border border-t-0 border-r-0 py-1 rounded-full border-solid cursor-pointer px-2`}
        style={{ color: ACCENT }}
        onClick={() => handleOpen("hide")}
      >
        <CloseIcon color={ACCENT} />
      </div>
      {/* Sidebar top area */}
      <div
        className={`flex gap-3 px-3 py-6 items-center border-0 border-b-[1px] border-b-line`}
      >
        <DedsecLogo color={ACCENT} />
        <div className={`flex flex-col gap-[.03rem]`}>
          <div
            className={`font-family-display font-[900] tracking-[.25rem] text-white`}
          >
            DuLLat
          </div>
          <div className={`font-family-mono text-ui-xs text-muted `}>
            ENC NETWORK CORP
          </div>
        </div>
      </div>

      {/* Nav section */}
      <nav className={`flex flex-col w-full`}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.id} item={item} ACCENT={ACCENT} />
        ))}
      </nav>
    </div>
  );
};

const NavItem = React.memo(({ item, ACCENT }) => {
  // This optimization is only usefull when use change route from components without interacting with sidebar
  // otherwise ACCENT changes enerytime and and it rerendered, but its just a sidebar, no big issue
  return (
    <NavLink
      to={`${item.to}`}
      key={item.id}
      className={`flex gap-3 py-2 items-center cursor-pointer w-full px-3`}
      style={({ isActive, isPending }) => ({
        background: isActive ? `rgba(${hexToRgb(ACCENT)},0.06)` : "transparent",
        borderLeft: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
      })}
    >
      {({ isActive, isPending }) => (
        <>
          <span style={{ color: isActive ? ACCENT : "#252535" }}>
            <item.icon size={20} color={isActive ? ACCENT : "#252535"} />
          </span>
          <div
            className={`flex-1 flex font-family-mono items-center`}
            style={{ color: isActive ? ACCENT : "#44445A" }}
          >
            <p className={`text-start text-[.9rem]`}>{item.label}</p>
            <p className="text-ui-xs ml-auto">{item.seq}</p>
          </div>
        </>
      )}
    </NavLink>
  );
});
export default React.memo(Sidebar);
