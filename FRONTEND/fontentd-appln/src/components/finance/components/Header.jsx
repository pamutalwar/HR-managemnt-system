import React from "react";
import { Menu, LogOut } from "lucide-react";

const Header = ({ toggleSidebar, onLogout }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-gray-700 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Welcome back, Finance Admin</span>
                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">F</span>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition ml-4"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
