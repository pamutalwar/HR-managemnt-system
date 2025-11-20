import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchJobs, fetchApplicants } from '../services/api';
import './Dashboard.css';

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export default function RecruiterDashboardPage() {
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, interviews: 0, tasks: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [jobsRes, applicantsRes] = await Promise.all([
          fetchJobs(),
          fetchApplicants()
        ]);
        setJobs(jobsRes.data);
        setStats(s => ({
          ...s,
          jobs: jobsRes.data.length,
          applicants: applicantsRes.data.length,
          interviews: 5, // TODO: Replace with real API
          tasks: 20 // TODO: Replace with real API
        }));
      } catch (e) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const chartData = [
    { name: 'Jobs', value: stats.jobs },
    { name: 'Applicants', value: stats.applicants },
    { name: 'Interviews', value: stats.interviews }
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 'bold', fontSize: 28 }}>Recruiter Dashboard</h2>
            <span style={{ color: '#888', fontSize: 16 }}>Welcome back! Here’s your summary.</span>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <div className="dashboard-cards">
            <div className="card" style={{ borderTop: '4px solid #3b82f6' }}>
              <div style={{ fontSize: 14, color: '#888' }}>Jobs</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{loading ? '...' : stats.jobs}</div>
            </div>
            <div className="card" style={{ borderTop: '4px solid #10b981' }}>
              <div style={{ fontSize: 14, color: '#888' }}>Applicants</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{loading ? '...' : stats.applicants}</div>
            </div>
            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div style={{ fontSize: 14, color: '#888' }}>Interviews</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{loading ? '...' : stats.interviews}</div>
            </div>
            <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
              <div style={{ fontSize: 14, color: '#888' }}>Tasks</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{loading ? '...' : stats.tasks}</div>
            </div>
          </div>
          <div className="dashboard-charts">
            <div className="chart-box">
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Application Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" outerRadius={70} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-box">
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Recent Jobs</h3>
              {loading ? 'Loading...' : (
                <ul style={{ textAlign: 'left', paddingLeft: 0, listStyle: 'none' }}>
                  {jobs.slice(0, 5).map(job => (
                    <li key={job.id} style={{ marginBottom: 12, padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                      <b style={{ color: '#3b82f6' }}>{job.title}</b> <span style={{ color: '#888' }}>({job.department})</span>
                      <div style={{ fontSize: 13, color: '#aaa' }}>{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : ''}</div>
                    </li>
                  ))}
                  {jobs.length === 0 && <li style={{ color: '#888' }}>No jobs found.</li>}
                </ul>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}