import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import "../auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        // For admin registration, verify admin code
        if (role === "admin") {
          if (!adminCode) {
            toast.error("Admin code is required");
            setLoading(false);
            return;
          }
          if (adminCode !== "ADMIN123") {
            toast.error("Invalid admin code");
            setLoading(false);
            return;
          }
        }
        result = await register(name, email, password, role);
      }

      if (result.success) {
        toast.success(isLogin ? "Login successful!" : "Registration successful!");
        if (isLogin) {
          navigate("/");
        } else {
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setName("");
          setRole("employee");
          setAdminCode("");
        }
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container-new">
      {/* Left Side - Features */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <div className="auth-logo">
            <h1>OpsMind AI</h1>
            <p>Enterprise Knowledge Assistant</p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-icon">📄</div>
              <div className="feature-text">
                <h3>Smart Document Search</h3>
                <p>Upload PDFs and get instant answers with AI</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <h3>Precise Citations</h3>
                <p>Every answer includes source document and page number</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <h3>Admin Analytics</h3>
                <p>Track document usage and user engagement</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">
                <h3>Secure & Private</h3>
                <p>Role-based access control for your data</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <h3>Lightning Fast</h3>
                <p>Get answers in seconds, not hours</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎓</div>
              <div className="feature-text">
                <h3>Knowledge Graph</h3>
                <p>Visualize document relationships and topics</p>
              </div>
            </div>
          </div>

          <div className="auth-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Documents Processed</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-number">2-5s</span>
              <span className="stat-label">Response Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>{isLogin ? "Login to your account" : "Join OpsMind AI"}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Role</label>
                  <div className="role-selector">
                    <button
                      type="button"
                      className={`role-btn ${role === "employee" ? "active" : ""}`}
                      onClick={() => {
                        setRole("employee");
                        setAdminCode("");
                      }}
                    >
                      <span className="role-icon">👤</span>
                      <span className="role-name">Employee</span>
                      <span className="role-desc">Access documents</span>
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${role === "viewer" ? "active" : ""}`}
                      onClick={() => {
                        setRole("viewer");
                        setAdminCode("");
                      }}
                    >
                      <span className="role-icon">👁️</span>
                      <span className="role-name">Viewer</span>
                      <span className="role-desc">View only</span>
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${role === "admin" ? "active" : ""}`}
                      onClick={() => setRole("admin")}
                    >
                      <span className="role-icon">👑</span>
                      <span className="role-name">Admin</span>
                      <span className="role-desc">Full access</span>
                    </button>
                  </div>
                </div>

                {role === "admin" && (
                  <div className="form-group">
                    <label>Admin Code</label>
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter admin code"
                      required
                    />
                    <small style={{ color: "#6366f1", fontWeight: "500" }}>
                      💡 Admin Code: ADMIN123
                    </small>
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName("");
                  setRole("employee");
                  setAdminCode("");
                }}
                className="toggle-btn"
                disabled={loading}
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
