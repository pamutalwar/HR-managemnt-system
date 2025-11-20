import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    DollarSign,
    FileText,
    Settings,
    X,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const menuItems = [
        { path: "/finance", name: "Finance Dashboard", icon: LayoutDashboard },
        { path: "/finance/payroll", name: "Payroll", icon: FileText },
        { path: "/finance/settings", name: "Settings", icon: Settings },
    ];

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
            <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                <h1 className="text-xl font-bold text-primary-600">HRMS Finance</h1>
                <button onClick={toggleSidebar} className="text-gray-500 lg:hidden">
                    <X className="h-6 w-6" />
                </button>
            </div>
            <nav className="mt-8">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${isActive ? "bg-gray-100 text-primary-600 border-r-4 border-blue-500" : ""}`}
                            style={{ outline: 'none', boxShadow: 'none' }}
                            onClick={() => toggleSidebar()}
                        >
                            <Icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
