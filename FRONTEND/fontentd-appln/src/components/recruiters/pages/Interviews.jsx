import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './Dashboard.css';


export default function Interviews() {
  const [form, setForm] = useState({ name: '', date: '' });
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState('');

  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.date) {
      setError('Please fill all fields');
      return;
    }
    setSchedule([...schedule, form]);
    setForm({ name: '', date: '' });
    setError('');
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <h2 style={{ fontWeight: 'bold', marginBottom: 24 }}>Schedule Interview</h2>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <form className="form" onSubmit={submit} style={{ marginBottom: 24 }}>
            <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Candidate Name" required style={{ marginRight: 8 }} />
            <input type="date" name="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ marginRight: 8 }} />
            <button type="submit">Schedule</button>
          </form>
          <ul className="card" style={{ minWidth: 300 }}>
            {schedule.length === 0 && <li style={{ color: '#888' }}>No interviews scheduled.</li>}
            {schedule.map((s, i) => <li key={i}>{s.name} - {s.date}</li>)}
          </ul>
        </main>
        <Footer />
      </div>
    </div>
  );
}

