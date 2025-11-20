import React, { useState } from 'react';
import { postJob } from '../services/api';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './Dashboard.css';

export default function PostJob() {
  const [form, setForm] = useState({ title: '', department: '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await postJob(form);
      setMessage('Job Posted!');
      setForm({ title: '', department: '', description: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      setError('Failed to post job. ' + errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <h2 style={{ fontWeight: 'bold', marginBottom: 24 }}>Post New Job</h2>
          {message && <div style={{ color: 'green', marginBottom: 16 }}>{message}</div>}
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label style={{ fontWeight: 500 }}>Job Title</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Enter job title" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
            <label style={{ fontWeight: 500 }}>Department</label>
            <input name="department" value={form.department} onChange={handleChange} required placeholder="Enter department" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
            <label style={{ fontWeight: 500 }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Enter job description" rows={4} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }} />
            <button type="submit" disabled={loading} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 16, marginTop: 12, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </main>
        <Footer />
      </div>
    </div>
  );
}