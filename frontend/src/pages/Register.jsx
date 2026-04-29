import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT_ROLE");
  const [localError, setLocalError] = useState("");

  const { register, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!name || !email || !password) {
      return setLocalError("Please fill all fields");
    }
    try {
      await register({ name, email, password, role });
      // Direct to appropriate dashboard after register
      if (role === "STUDENT_ROLE") navigate("/student-dashboard");
      else if (role === "FACULTY_ROLE") navigate("/faculty-dashboard");
      else navigate("/admin-dashboard");
    } catch (err) {
      // Error is handled in context, but we can also handle local here if needed
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
      <div className="fixed inset-0 scanline z-0 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-lg">
        <div className="absolute -top-12 -left-4 flex space-x-2">
          <div className="w-2 h-2 bg-primary"></div>
          <div className="w-8 h-[1px] bg-outline-variant mt-1"></div>
          <span className="text-[10px] font-label tracking-[0.2em] text-primary/60 uppercase">
            SYSTEM_REG_V4.0
          </span>
        </div>

        <div className="absolute -bottom-12 -right-4 flex items-center space-x-2">
          <span className="text-[10px] font-label tracking-[0.2em] text-outline uppercase">
            NEW_ACCOUNT_CREATED
          </span>
          <div className="w-12 h-[1px] bg-outline-variant"></div>
          <div className="w-2 h-2 border border-primary"></div>
        </div>

        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-10 relative overflow-hidden border border-outline-variant/20 shadow-2xl">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>

          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-headline font-bold tracking-tighter text-primary uppercase">
                INITIALIZE
                <br />
                UNIMEET
              </h1>
              <div className="flex flex-col items-end">
                <div className="bg-secondary-container text-on-secondary-container text-[10px] px-3 py-1 font-label font-bold tracking-widest uppercase border-none outline-none">
                  IDENTITY_DESIGNATION
                </div>
                <span className="text-[9px] text-outline mt-1 font-mono">
                  STEP: [01/02]
                </span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-primary/40 via-outline-variant/10 to-transparent"></div>
          </header>

          {/* Role Selection Module */}
          <div className="mb-10">
            <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.2em] mb-4 text-center">
              Select Operational Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("STUDENT_ROLE")}
                className={`p-6 border transition-all duration-300 flex flex-col items-center gap-3 group relative overflow-hidden chamfer-card ${
                  role === "STUDENT_ROLE"
                    ? "border-primary bg-primary/10 shadow-[0_0_25px_rgba(0,240,240,0.15)] ring-1 ring-primary/50"
                    : "border-outline-variant/20 bg-surface-container-highest/30 hover:border-primary/40"
                }`}
              >
                {role === "STUDENT_ROLE" && (
                  <div className="absolute top-0 right-0 p-1 bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-xs">
                      check
                    </span>
                  </div>
                )}
                <span
                  className={`material-symbols-outlined text-4xl transition-all duration-500 ${role === "STUDENT_ROLE" ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,240,240,0.6)]" : "text-outline-variant group-hover:text-primary/70"}`}
                >
                  school
                </span>
                <div className="text-center">
                  <p
                    className={`text-[10px] font-label font-bold uppercase tracking-widest transition-colors ${role === "STUDENT_ROLE" ? "text-primary" : "text-outline-variant"}`}
                  >
                    Student
                  </p>
                  <p className="text-[7px] text-outline-variant/50 uppercase mt-1 tracking-tighter">
                    Researcher Access
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("FACULTY_ROLE")}
                className={`p-6 border transition-all duration-300 flex flex-col items-center gap-3 group relative overflow-hidden chamfer-card ${
                  role === "FACULTY_ROLE"
                    ? "border-primary bg-primary/10 shadow-[0_0_25px_rgba(0,240,240,0.15)] ring-1 ring-primary/50"
                    : "border-outline-variant/20 bg-surface-container-highest/30 hover:border-primary/40"
                }`}
              >
                {role === "FACULTY_ROLE" && (
                  <div className="absolute top-0 right-0 p-1 bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-xs">
                      check
                    </span>
                  </div>
                )}
                <span
                  className={`material-symbols-outlined text-4xl transition-all duration-500 ${role === "FACULTY_ROLE" ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,240,240,0.6)]" : "text-outline-variant group-hover:text-primary/70"}`}
                >
                  co_present
                </span>
                <div className="text-center">
                  <p
                    className={`text-[10px] font-label font-bold uppercase tracking-widest transition-colors ${role === "FACULTY_ROLE" ? "text-primary" : "text-outline-variant"}`}
                  >
                    Faculty
                  </p>
                  <p className="text-[7px] text-outline-variant/50 uppercase mt-1 tracking-tighter">
                    Instructor Protocols
                  </p>
                </div>
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {(localError || authError) && (
              <div className="bg-error/10 border border-error/50 text-error p-3 text-xs font-label uppercase tracking-widest flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">error</span>
                {localError || authError}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative group">
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-1 px-1">
                  Designated Name
                </label>
                <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary group-focus-within:bg-surface-container-highest transition-all duration-300">
                  <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 placeholder:text-outline-variant/50 placeholder:uppercase placeholder:text-xs outline-none"
                    placeholder="FULL NAME"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-1 px-1">
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
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-1 px-1">
                  Secure Password
                </label>
                <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary group-focus-within:bg-surface-container-highest transition-all duration-300">
                  <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary transition-colors">
                    lock_open
                  </span>
                  <input
                    className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 placeholder:text-outline-variant/50 outline-none"
                    placeholder="••••••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden chamfer-btn bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 font-headline font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,240,240,0.2)] hover:shadow-[0_0_35px_rgba(0,240,240,0.4)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-sm">
                    {loading ? "INITIALIZING..." : "CREATE ACCOUNT"}
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
                  to="/login"
                >
                  Already Active? (Login)
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
