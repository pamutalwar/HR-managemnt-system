import React, { useState, useEffect } from 'react';
import { fetchApplicants, updateApplicantStatus } from '../services/api';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './Dashboard.css';

const statusColors = {
  Pending: '#f59e0b',
  Shortlisted: '#10b981',
  Rejected: '#ef4444',
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function getApplicants() {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const res = await fetchApplicants();
        setApps(res.data);
      } catch (e) {
        setError('Failed to load applications.');
        setApps([]);
      }
      setLoading(false);
    }
    getApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    setSuccess('');
    setError('');
    try {
      await updateApplicantStatus(id, status);
      setApps(apps.map(a => a.id === id ? { ...a, status } : a));
      setSuccess('Status updated!');
    } catch (e) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <h2 style={{ fontWeight: 'bold', marginBottom: 24 }}>Applications</h2>
          {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          {loading ? <div>Loading...</div> : (
            <table className="card" style={{ minWidth: 400, borderRadius: 12, boxShadow: '0 2px 12px #0001', background: '#fff', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead><tr><th>Name</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {apps.length === 0 && (
                  <tr><td colSpan={3} style={{ color: '#888', textAlign: 'center', padding: 24 }}>No applications found.</td></tr>
                )}
                {apps.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td>
                      <span style={{
                        background: statusColors[a.status] || '#ddd',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '4px 12px',
                        fontWeight: 600,
                        fontSize: 13,
                      }}>{a.status}</span>
                    </td>
                    <td>
                      <select onChange={e => updateStatus(a.id, e.target.value)} value={a.status} style={{ padding: 6, borderRadius: 6 }}>
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}