import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './Dashboard.css';


export default function Onboarding() {
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Send Offer', done: false },
    { id: 2, label: 'Orientation', done: false }
  ]);
  const toggle = id => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const completed = tasks.filter(t => t.done).length;

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <h2 style={{ fontWeight: 'bold', marginBottom: 24 }}>Onboarding Checklist</h2>
          <progress value={completed} max={tasks.length} style={{ width: '100%', marginBottom: 12 }}></progress>
          <span style={{ marginBottom: 16, display: 'block' }}> {completed} of {tasks.length} tasks completed</span>
          <ul className="card" style={{ minWidth: 300 }}>
            {tasks.map(t => (
              <li key={t.id} style={{ textAlign: 'left', marginBottom: 8 }}>
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} style={{ marginRight: 8 }} /> {t.label}
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </div>
  );
}