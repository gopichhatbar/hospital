import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState ,  useEffect} from "react";
// import { useState, } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Register from "./Register";

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex w-[100%] min-h-[100vh] max-h-[100vh]">
    {!isAuthPage && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
    <div className="flex-1 flex flex-col">
      {!isAuthPage && <Header isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div className="p-5 bg-gray-100 flex-1 max-h-[100vh] overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  </div>
  );
};

export default DashboardLayout;
