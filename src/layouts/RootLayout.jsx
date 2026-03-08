import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
};

export default RootLayout;
