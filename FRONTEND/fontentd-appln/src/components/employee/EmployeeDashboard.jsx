import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { Home, User, Calendar, Clock, BookOpen, MessageSquare } from "lucide-react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: 250, background: '#fff', borderRight: '1px solid #e5e7eb', padding: 0 }}>
        <h1 className="sidebar-title" style={{ fontWeight: 700, fontSize: 24, color: '#3b82f6', padding: '32px 0 0 32px', letterSpacing: 1 }}>HRMS <span style={{ color: '#6366f1' }}>Employee</span></h1>
        <nav className="nav-links" style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="dashboard" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><Home size={20} /> Dashboard</Link>
          <Link to="profile" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><User size={20} /> Profile</Link>
          <Link to="attendance" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><Calendar size={20} /> Attendance</Link>
          <Link to="leave-request" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><Clock size={20} /> Leaves</Link>
          <Link to="performance" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><BookOpen size={20} /> Performance</Link>
          <Link to="hr-queries" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><MessageSquare size={20} /> Queries</Link>
          <Link to="training" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><MessageSquare size={20} /> Training</Link>
          <Link to="WFOffice" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><MessageSquare size={20} /> 2office</Link>
          <Link to="stats" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 8, fontWeight: 600, color: '#374151' }}><MessageSquare size={20} /> Leave stats</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, background: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 32px 0 32px' }}>
          <h2 style={{ fontWeight: 700, fontSize: 28, color: '#111827' }}>Employee Dashboard</h2>
          <button onClick={logout} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>Log Out</button>
        </div>
        <div className="main-outlet" style={{ flex: 1, padding: 32 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
