import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading, error: authError } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const query = new URLSearchParams(location.search);
  const initialRole = query.get("role") || "student";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const role = query.get("role");
    if (role) setSelectedRole(role);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) {
      return setLocalError("Please enter email and password");
    }
    try {
      const userData = await login({ email, password });

      // Intelligent Redirect: Target original destination if it exists
      const from = location.state?.from?.pathname;
      if (from) {
        console.log(
          `[AUTH_SUCCESS] Redirecting to original destination: ${from}`,
        );
        return navigate(from, { replace: true });
      }

      // Default fallback navigation based on detected role
      if (userData.role === "STUDENT_ROLE") navigate("/student-dashboard");
      else if (userData.role === "FACULTY_ROLE") navigate("/faculty-dashboard");
      else if (userData.role === "ADMIN_ROLE") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-on-surface selection:bg-primary-container selection:text-on-primary relative w-full pt-28 pb-10"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 240, 240, 0.05) 0%, transparent 50%),
                linear-gradient(rgba(20, 25, 22, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20, 25, 22, 0.5) 1px, transparent 1px)`,
        backgroundSize: `100% 100%, 40px 40px, 40px 40px`,
      }}
    >
      {/* Scanline Overlay */}
      <div className="fixed inset-0 scanline z-0 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-lg">
        {/* Top Tech Reticle Details */}
        <div className="absolute -top-12 -left-4 flex space-x-2">
          <div className="w-2 h-2 bg-primary"></div>
          <div className="w-8 h-[1px] bg-outline-variant mt-1"></div>
          <span className="text-[10px] font-label tracking-[0.2em] text-primary/60 uppercase">
            SYSTEM_AUTH_V4.0
          </span>
        </div>

        <div className="absolute -bottom-12 -right-4 flex items-center space-x-2">
          <span className="text-[10px] font-label tracking-[0.2em] text-outline uppercase">
            SECURE_ENCRYPTION_ACTIVE
          </span>
          <div className="w-12 h-[1px] bg-outline-variant"></div>
          <div className="w-2 h-2 border border-primary"></div>
        </div>

        {/* Main Container: Obsidian Monolith */}
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-10 relative overflow-hidden border border-outline-variant/20 shadow-2xl">
          {/* Decorative L-Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>

          {/* Header Section */}
          <header className="mb-12">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-headline font-bold tracking-tighter text-primary uppercase">
                UNIMEET
              </h1>
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-label font-bold text-primary uppercase tracking-[0.2em] mb-1">
                  Login As:
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    navigate(`/login?role=${e.target.value}`, {
                      replace: true,
                    });
                  }}
                  className="bg-primary/10 text-primary text-xs px-3 py-2 font-bold tracking-widest uppercase border border-primary/20 outline-none cursor-pointer hover:bg-primary/20 transition-all rounded"
                >
                  <option value="student" className="bg-[#0f1511] text-primary">
                    Student
                  </option>
                  <option value="faculty" className="bg-[#0f1511] text-primary">
                    Faculty
                  </option>
                  <option value="admin" className="bg-[#0f1511] text-primary">
                    Administrator
                  </option>
                </select>
                <p className="text-[9px] text-outline-variant font-medium uppercase tracking-wider mt-3 text-right max-w-[160px]">
                  Accessing the UniMeet network as {selectedRole}.
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-primary/40 via-outline-variant/10 to-transparent"></div>
          </header>

          {/* Login Interface */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {(localError || authError) && (
              <div className="bg-error/10 border border-error/50 text-error p-3 text-xs font-label uppercase tracking-widest flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">error</span>
                {localError || authError}
              </div>
            )}
            {/* Data Input Module */}
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-2 px-1">
                  Access Identifier (Email)
                </label>
                <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary group-focus-within:bg-surface-container-highest transition-all duration-300">
                  <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                  <input
                    className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 placeholder:text-primary/60 placeholder:text-xs outline-none"
                    placeholder="user@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em]">
                    Secure Password
                  </label>
                  <Link
                    to="/forgot-password"
                    size="sm"
                    className="text-[9px] font-label text-primary/90 hover:text-primary uppercase tracking-wider transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary group-focus-within:bg-surface-container-highest transition-all duration-300">
                  <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary transition-colors">
                    lock_open
                  </span>
                  <input
                    className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 placeholder:text-outline-variant/50 outline-none"
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 text-outline-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Module */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden chamfer-btn bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 font-headline font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,240,240,0.2)] hover:shadow-[0_0_35px_rgba(0,240,240,0.4)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-sm">
                    {loading
                      ? "AUTHORIZING..."
                      : `LOGIN AS ${selectedRole.toUpperCase()}`}
                  </span>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined text-lg">
                      bolt
                    </span>
                  )}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                )}
              </button>
              <div className="mt-8 flex justify-between items-center text-[10px] font-label text-outline tracking-wider uppercase">
                <Link
                  className="hover:text-primary transition-colors border-b border-transparent hover:border-primary"
                  to="/register"
                >
                  Create Account (Register)
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></div>
                  <span>Servers Nominal</span>
                </div>
              </div>
            </div>
          </form>

          {/* Bottom Telemetry Card */}
          <div className="mt-12 -mx-10 -mb-10 bg-surface-container-high/40 p-6 flex items-center justify-between border-t border-outline-variant/10">
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-[8px] text-outline-variant uppercase">
                  latency
                </p>
                <p className="text-xs font-mono text-primary">12ms</p>
              </div>
              <div className="text-center border-l border-outline-variant/20 pl-6">
                <p className="text-[8px] text-outline-variant uppercase">
                  encryption
                </p>
                <p className="text-xs font-mono text-primary">AES-512</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <span className="text-[9px] font-label text-outline-variant uppercase tracking-[0.3em]">
            nexus_os_kernel_7.2
          </span>
          <span className="text-[9px] font-label text-outline-variant/30">
            •
          </span>
          <span className="text-[9px] font-label text-outline-variant uppercase tracking-[0.3em]">
            © 2024 UNIMEET
          </span>
        </div>
      </main>
    </div>
  );
};

export default Login;
