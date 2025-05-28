import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/use-user";
import { UserRole } from "../common/enums";
import { logout } from "../api/services/auth-service";
import { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logoutUser = async () => {
    const response = await logout();

    if (response.success) {
      setCurrentUser(null);
      navigate("/login", { replace: true });
    }
  };

  const activeClass = "font-bold bg-blue-600 text-white rounded p-3";
  const normalClass = "text-gray-700 hover:text-blue-500 p-3";

  return (
    <>
      <button
        className="lg:hidden fixed top-5 left-5 z-50 bg-white p-2 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-[250px] bg-gray-100 p-5 rounded-r-3xl transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:top-[20px] lg:left-[20px] lg:bottom-[20px] lg:rounded-3xl lg:w-[300px] lg:shadow-xl overflow-y-auto`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
              Home
            </NavLink>
            <NavLink to="/watch-list" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
              Watchlist
            </NavLink>
            {currentUser?.roleId === UserRole.Admin && (
              <NavLink to="/users" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
                Users
              </NavLink>
            )}
          </div>

          <button
            type="button"
            onClick={logoutUser}
            className="mt-5 text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      {open && <div className="fixed inset-0 bg-black opacity-40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
