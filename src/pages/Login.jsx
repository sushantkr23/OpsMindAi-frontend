import { useState, useEffect } from "react";
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
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: "employee", label: "Employee", icon: "👤", description: "Can upload & query documents" },
    { value: "viewer", label: "Viewer", icon: "👁️", description: "Can only view & query" },
    { value: "admin", label: "Admin", icon: "⚙️", description: "Full access & management" }
  ];

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    // Fetch registered emails for suggestions
    fetchEmailSuggestions();
  }, []);

  // Fetch all registered emails
  const fetchEmailSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/emails");
      const data = await response.json();
      if (data.success) {
        setEmailSuggestions(data.data);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  // Filter suggestions based on input
  const getFilteredSuggestions = (inputValue) => {
    if (!inputValue) return [];
    return emailSuggestions.filter(item =>
      item.email.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && isLogin) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setEmail(suggestion.email);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
        
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }
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
          fetchEmailSuggestions();
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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (resetStep === 1) {
        // Send reset code to email
        const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail })
        });
        
        const data = await response.json();
        if (data.success) {
          toast.success("✅ Reset code sent to your email!");
          toast("📧 Check your email for the reset code", { icon: "📬" });
          setResetStep(2);
        } else {
          toast.error(data.message || "Email not found");
        }
      } else if (resetStep === 2) {
        // Verify reset code
        if (!resetCode) {
          toast.error("Please enter the reset code");
          setLoading(false);
          return;
        }
        setResetStep(3);
        toast.success("✅ Code verified!");
      } else if (resetStep === 3) {
        // Reset password
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail,
            code: resetCode,
            newPassword: newPassword
          })
        });

        const data = await response.json();
        if (data.success) {
          toast.success("🎉 Password reset successfully!");
          setShowForgotPassword(false);
          setResetStep(1);
          setForgotEmail("");
          setResetCode("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(data.message || "Password reset failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions.find(r => r.value === role);
  const filteredSuggestions = getFilteredSuggestions(email);

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
                  <div className="role-dropdown-container">
                    <button
                      type="button"
                      className="role-dropdown-button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    >
                      <span className="role-dropdown-icon">{selectedRole?.icon}</span>
                      <span className="role-dropdown-label">{selectedRole?.label}</span>
                      <span className="role-dropdown-arrow">▼</span>
                    </button>

                    {showRoleDropdown && (
                      <div className="role-dropdown-menu">
                        {roleOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`role-dropdown-item ${role === option.value ? "active" : ""}`}
                            onClick={() => {
                              setRole(option.value);
                              setShowRoleDropdown(false);
                              setAdminCode("");
                            }}
                          >
                            <span className="role-item-icon">{option.icon}</span>
                            <div className="role-item-content">
                              <span className="role-item-label">{option.label}</span>
                              <span className="role-item-desc">{option.description}</span>
                            </div>
                            {role === option.value && <span className="role-item-check">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
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
              <div className="email-input-container">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => isLogin && email && setShowSuggestions(true)}
                  placeholder="Enter your email"
                  required
                  autoComplete="off"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="email-suggestions">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span className="suggestion-email">{suggestion.email}</span>
                        <span className="suggestion-name">{suggestion.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

            {isLogin && (
              <>
                <div className="remember-forgot">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            )}

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
                  setShowRoleDropdown(false);
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔐 Reset Password</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetStep(1);
                  setForgotEmail("");
                  setResetCode("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="reset-progress">
              <div className={`progress-step ${resetStep >= 1 ? "active" : ""}`}>
                <span className="step-number">1</span>
                <span className="step-label">Email</span>
              </div>
              <div className={`progress-line ${resetStep >= 2 ? "active" : ""}`}></div>
              <div className={`progress-step ${resetStep >= 2 ? "active" : ""}`}>
                <span className="step-number">2</span>
                <span className="step-label">Code</span>
              </div>
              <div className={`progress-line ${resetStep >= 3 ? "active" : ""}`}></div>
              <div className={`progress-step ${resetStep >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span>
                <span className="step-label">Password</span>
              </div>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="reset-form">
              {resetStep === 1 && (
                <div className="form-group">
                  <label>📧 Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <small>We'll send a reset code to this email</small>
                </div>
              )}

              {resetStep === 2 && (
                <div className="form-group">
                  <label>🔑 Reset Code</label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter the code from your email"
                    required
                  />
                  <small>Check your email for the reset code (valid for 15 minutes)</small>
                </div>
              )}

              {resetStep === 3 && (
                <>
                  <div className="form-group">
                    <label>🔒 New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>✓ Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn-reset" disabled={loading}>
                {loading ? "Processing..." : resetStep === 1 ? "📬 Send Code" : resetStep === 2 ? "✓ Verify Code" : "🔄 Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
