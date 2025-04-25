import { Bell, UserCircle, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Header = ({ isOpen, setIsOpen }) => {
    // const [users, setUsers] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const storedEmail = localStorage.getItem("userEmail"); // ✅ Directly fetch on render

    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("LoggedIn");
        localStorage.removeItem("userEmail");
        navigate("/login");
      };
      
    return (
        <div className="bg-cyan-900 h-20 shadow-md p-4 flex justify-between items-center">
            <div className="flex gap-10">
                <button
                    className="lg:hidden bg-gray-900 text-white p-2 rounded z-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-3xl text-white font-semibold lg:ml-0">Dashboard</h2>
            </div>

            <div className="relative">
                <div className="flex items-center text-white gap-4">
                    <Bell size={24} className="cursor-pointer" />
                    <UserCircle
                        size={24}
                        className="cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                </div>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg max-h-60 overflow-y-auto rounded-md p-2">
                        {storedEmail ? (
                            <div
                                className="p-2 w-auto hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                                onClick={handleLogout}
                            >
                                <span className="block w-32 truncate">{storedEmail}</span>
                                <span className="text-red-500">Logout</span>
                            </div>
                        ) : (
                            <p className="p-2 text-gray-500">No users logged in</p>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
};

export default Header;

// import { Bell, UserCircle ,Menu} from "lucide-react";

// const Header = ({isOpen,setIsOpen}) => {
    
//     return (
//         <div className="bg-cyan-900 h-20 shadow-md p-4 flex justify-between items-center"> 
//         <div className="flex gap-10">
//         <button
//             className="lg:hidden   bg-gray-900 text-white p-2 rounded z-50"
//             onClick={() => setIsOpen(!isOpen)}
//         >
//             <Menu size={24} />
//         </button>

//             <h2 className="text-3xl text-white font-semibold  lg:ml-0">Dashboard</h2>
//         </div>
//        <div className="flex items-center text-white gap-4">
//                 <Bell size={24} className="cursor-pointer" />
//                 <UserCircle size={24} className="cursor-pointer" />
//             </div>
//         </div>
//     );
// };

// export default Header;
