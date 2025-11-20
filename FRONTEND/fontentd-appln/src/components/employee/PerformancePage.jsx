import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "./PerformancePage.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const PerformancePage = () => {
  const [data, setData] = useState({ months: [], scores: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:9090/api/performance/1")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch performance data", err);
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: "Performance Score",
        data: data.scores,
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#60a5fa",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Quarterly Performance Trend",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="performance-container">
      <h1 className="performance-title">Performance Report</h1>
      {loading ? (
        <p>Loading...</p>
      ) : data.months.length === 0 ? (
        <p>No performance data available.</p>
      ) : (
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default PerformancePage;
