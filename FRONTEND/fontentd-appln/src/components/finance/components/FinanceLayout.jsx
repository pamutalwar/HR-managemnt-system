import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
const FinanceLayout = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarOpen((open) => !open);
    };
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} onLogout={logout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6" aria-label="Finance Main Content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FinanceLayout;
