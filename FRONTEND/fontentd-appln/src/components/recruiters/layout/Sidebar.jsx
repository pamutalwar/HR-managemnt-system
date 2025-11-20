import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { Briefcase, FilePlus, List, Users, Calendar, CheckCircle } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/recruiter', icon: <Briefcase size={18} /> },
  { label: 'Post Job', to: '/post-job', icon: <FilePlus size={18} /> },
  { label: 'Job List', to: '/job-list', icon: <List size={18} /> },
  { label: 'Applications', to: '/applications', icon: <Users size={18} /> },
  { label: 'Interviews', to: '/interviews', icon: <Calendar size={18} /> },
  { label: 'Onboarding', to: '/onboarding', icon: <CheckCircle size={18} /> },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="sidebar" style={{ minHeight: '100vh', boxShadow: '2px 0 8px #f3f4f6' }}>
      <h2 className="sidebar-logo" style={{ fontSize: 22, marginBottom: 24, letterSpacing: 1 }}>HRMS <span style={{ color: '#6366f1' }}>Recruiter</span></h2>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.to}
            className={`sidebar-link${location.pathname === item.to ? ' active' : ''}`}
            to={item.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              background: location.pathname === item.to ? '#f3f4f6' : 'transparent',
              fontWeight: location.pathname === item.to ? 600 : 500,
              color: location.pathname === item.to ? '#3b82f6' : '#374151',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}