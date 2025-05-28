import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto lg:ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
