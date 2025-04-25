import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Users, Settings, Menu, X,Pill, User, LogIn, LogOut, UserPlus  } from "lucide-react";

export default function Sidebar({isOpen,setIsOpen}) {
    

    return (
        <div className="relative">
           
            <div
                className={`h-[100%]  lg:w-64 lg:p-5  transition-all duration-500  bg-gray-900 text-white  
                ${isOpen ? " w-64 p-5" : " w-0 overflow-clip"} 
                    lg:relative lg:translate-x-0 z-40`}
            >

                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <nav className="mt-5">
                    <ul>
                        <li className="mb-3">
                            <Link
                                to="/dashboard"
                                className="flex text-lg items-center gap-2 p-2 hover:bg-gray-700 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                <Home size={20} /> Dashboard
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/"
                                className="flex text-lg items-center gap-2 p-2 hover:bg-gray-700 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                <Users size={20} /> Show All Patient
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/medicine/add"
                                className="flex text-lg items-center gap-2 p-2 hover:bg-gray-700 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                <Pill size={20} /> Add Medicine
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/addnew"
                                className="flex text-lg items-center gap-2 p-2 hover:bg-gray-700 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                <User size={20} /> Add New Patient
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/register"
                                className="flex text-lg items-center gap-2 p-2 hover:bg-gray-700 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                <LogIn size={20} /> Register
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/login"
                                className="flex text-lg items-center gap-2 p-2 hover:bg-gray-700 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                <LogIn size={20} /> Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Clickable area outside sidebar to close it */}
            {isOpen && (
                <div
                    className="fixed inset-0 lg:hidden z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}
