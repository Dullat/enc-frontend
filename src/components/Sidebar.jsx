import { useState } from "react";
import { CloseIcon } from "../svgs/PrimaryIcons.jsx";
import { DedsecLogo } from "../svgs/DedsecLogo.jsx";

import { NAV_ITEMS, MODULE_ACCENT } from "../data/dedsecData.js";
import { hexToRgb } from "../utils/hexToRgb.js";

const Sidebar = ({
  open,
  handleOpen,
  active = "profile",
  onNav = () => {},
  color = "orange",
}) => {
  return (
    <div
      className={`sticky bg-surface border-0 border-r-[1px] border-r-line top-0 ${
        open ? "w-[400px]" : "w-[0px]"
      } h-dvh transition-all duration-300 overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 z-[99] border-solid border border-t-0 border-r-0 border-orange py-1 rounded-full border-solid cursor-pointer px-2`}
        onClick={handleOpen}
      >
        <CloseIcon />
      </div>
      {/* Sidebar top area */}
      <div
        className={`flex gap-3 px-3 py-6 items-center border-0 border-b-[1px] border-b-line`}
      >
        <DedsecLogo />
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
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const accent = MODULE_ACCENT[active].color;
          return (
            <button
              key={item.id}
              className={`flex gap-3 py-2 items-center cursor-pointer w-full px-3`}
              style={{
                background: isActive
                  ? `rgba(${hexToRgb(accent)},0.06)`
                  : "transparent",
                borderLeft: isActive
                  ? `2px solid ${accent}`
                  : "2px solid transparent",
              }}
            >
              <span style={{ color: isActive ? accent : "#252535" }}>
                <item.icon size={20} color={isActive ? accent : "#252535"} />
              </span>
              <div
                className={`flex-1 flex font-family-mono items-center`}
                style={{ color: isActive ? accent : "#44445A" }}
              >
                <p className={`text-start text-[.9rem]`}>{item.label}</p>
                <p className="text-ui-xs ml-auto">{item.seq}</p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
