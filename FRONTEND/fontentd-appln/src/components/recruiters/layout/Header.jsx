import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <header className="header" style={{ background: '#f5f6fa', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb' }}>
      <h1 className="header-title" style={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>Recruiter Dashboard</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ background: '#3b82f6', color: '#fff', borderRadius: 20, padding: '8px 20px', fontWeight: 600, fontSize: 16 }}>HR Admin</span>
        <button
          onClick={logout}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            padding: '8px 20px',
            fontWeight: 600,
            fontSize: 16,
            marginLeft: 8,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
          onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}