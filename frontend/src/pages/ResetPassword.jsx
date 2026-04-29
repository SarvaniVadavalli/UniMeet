import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative pt-28">
      <div className="fixed inset-0 scanline z-0 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-lg">
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-10 border border-outline-variant/20 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>

          <header className="mb-10 text-center">
            <h1 className="text-3xl font-headline font-bold tracking-tighter text-primary uppercase mb-2">
              RESET PASSWORD
            </h1>
            <p className="text-[10px] font-label text-outline uppercase tracking-widest">
              Update your security credentials
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-2 px-1">
                New Password
              </label>
              <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary transition-all duration-300">
                <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary">
                  lock_reset
                </span>
                <input
                  className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 outline-none"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-2 px-1">
                Confirm Password
              </label>
              <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary transition-all duration-300">
                <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary">
                  verified
                </span>
                <input
                  className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 outline-none"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full chamfer-btn bg-primary text-on-primary py-5 font-headline font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? "RESETTING..." : "UPDATE PASSWORD"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-[10px] font-label text-outline hover:text-primary uppercase tracking-widest transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
