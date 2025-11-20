import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../services/api';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './Dashboard.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getJobs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetchJobs();
        setJobs(res.data.sort((a, b) => b.id - a.id));
      } catch (e) {
        setError("Failed to load jobs.");
        setJobs([]);
      }
      setLoading(false);
    }
    getJobs();
  }, []);

  const removeJob = id => setJobs(jobs.filter(j => j.id !== id));

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <h2 style={{ fontWeight: 'bold', marginBottom: 24 }}>Recent Job Listings</h2>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table className="card" style={{ minWidth: 900, borderRadius: 12, boxShadow: '0 2px 12px #0001', background: '#fff', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '12px 24px', fontWeight: 700, fontSize: 16, borderTopLeftRadius: 12 }}>Title</th>
                  <th style={{ padding: '12px 24px', fontWeight: 700, fontSize: 16 }}>Department</th>
                  <th style={{ padding: '12px 24px', fontWeight: 700, fontSize: 16, width: 400 }}>Description</th>
                  <th style={{ padding: '12px 24px', fontWeight: 700, fontSize: 16 }}>Posted Date</th>
                  <th style={{ padding: '12px 24px', fontWeight: 700, fontSize: 16, borderTopRightRadius: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#888' }}>No jobs found.</td></tr>
                ) : (
                  jobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 24px', fontWeight: 500 }}>{job.title}</td>
                      <td style={{ padding: '12px 24px' }}>{job.department}</td>
                      <td style={{ padding: '12px 24px', width: 400, whiteSpace: 'normal', overflowWrap: 'break-word' }}>{job.description}</td>
                      <td style={{ padding: '12px 24px' }}>{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : ''}</td>
                      <td style={{ padding: '12px 24px' }}>
                        <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }} onClick={() => removeJob(job.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}