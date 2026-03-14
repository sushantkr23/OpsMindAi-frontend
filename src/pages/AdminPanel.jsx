import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";
import Navbar from "../components/Layout/Navbar";
import toast from "react-hot-toast";
import "../admin.css";

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    } else {
      loadDashboard();
    }
  }, [isAdmin, navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashResponse, usersResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers()
      ]);
      setDashboard(dashResponse.data.data);
      setUsers(usersResponse.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-container">
      <Navbar />

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        <div className="admin-panel">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {activeTab === "overview" && dashboard && (
                <div className="overview-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{dashboard.totalUsers}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Documents</h3>
                    <p className="stat-value">{dashboard.totalDocuments}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Queries</h3>
                    <p className="stat-value">{dashboard.totalQueries}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Active Users (24h)</h3>
                    <p className="stat-value">{dashboard.activeUsers24h}</p>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status ${user.isActive ? "active" : "inactive"}`}>
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "analytics" && dashboard && (
                <div className="analytics-section">
                  <h3>System Analytics</h3>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h4>Total Chunks</h4>
                      <p>{dashboard.totalChunks}</p>
                    </div>
                    <div className="analytics-card">
                      <h4>Recent Queries</h4>
                      <p>{dashboard.recentQueries?.length || 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
