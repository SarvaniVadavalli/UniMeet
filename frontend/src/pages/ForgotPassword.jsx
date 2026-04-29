import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      if (data.token) {
        toast.success("Access token found! Redirecting...");
        setTimeout(() => {
          navigate(`/reset-password/${data.token}`);
        }, 1000);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden pt-28">
      <div className="fixed inset-0 scanline z-0 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-lg">
        <div className="bg-surface-container-low/80 backdrop-blur-2xl p-10 border border-outline-variant/20 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>

          <header className="mb-10 text-center">
            <h1 className="text-3xl font-headline font-bold tracking-tighter text-primary uppercase mb-2">
              RECOVER ACCESS
            </h1>
            <p className="text-[10px] font-label text-outline uppercase tracking-widest">
              Identify your account to reset your password
            </p>
          </header>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative group">
                <label className="block text-[10px] font-label font-bold text-outline uppercase tracking-[0.15em] mb-2 px-1">
                  Access Identifier (Email)
                </label>
                <div className="flex items-center bg-surface-container-highest/50 border-l-2 border-transparent group-focus-within:border-primary transition-all duration-300">
                  <span className="material-symbols-outlined px-4 text-outline group-focus-within:text-primary">
                    alternate_email
                  </span>
                  <input
                    className="w-full bg-transparent border-none text-on-surface font-body py-4 focus:ring-0 placeholder:text-primary/60 outline-none"
                    placeholder="user@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full chamfer-btn bg-primary text-on-primary py-5 font-headline font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
              >
                {loading ? "REQUESTING..." : "RECOVER PASSWORD"}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-6">
              <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
                mail
              </span>
              <p className="text-on-surface-variant font-body">
                If an account exists for{" "}
                <span className="text-primary">{email}</span>, you are being
                redirected to the reset page.
              </p>
              <div className="bg-primary/5 p-4 border border-primary/20">
                <p className="text-[10px] font-label text-primary uppercase tracking-widest">
                  Development Mode: Check console/logs for the reset token.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-[10px] font-label text-outline hover:text-primary uppercase tracking-widest transition-colors"
            >
              Return to UniMeet
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
