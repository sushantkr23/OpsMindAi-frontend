import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return "👑";
      case "employee":
        return "👤";
      case "viewer":
        return "👁️";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#ec4899";
      case "employee":
        return "#6366f1";
      case "viewer":
        return "#8b5cf6";
      default:
        return "#6366f1";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>OpsMind AI</h1>
      </div>

      <div className="navbar-content">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span 
            className="user-role-badge"
            style={{ borderColor: getRoleColor(user?.role) }}
          >
            <span className="role-icon">{getRoleIcon(user?.role)}</span>
            <span className="role-text">{user?.role}</span>
          </span>
        </div>

        <div className="navbar-actions">
          {isAdmin && (
            <button
              className="btn-nav btn-admin"
              onClick={() => navigate("/admin")}
              title="Admin Panel"
            >
              <span className="btn-icon">⚙️</span>
              Admin Panel
            </button>
          )}
          <button 
            className="btn-logout" 
            onClick={handleLogout}
            title="Logout"
          >
            <span className="btn-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
